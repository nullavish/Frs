import { marked } from "marked";

// Every .md and .html file in the /blogs folder at the project root becomes a
// post. They are read when the site is built, so a new post needs a redeploy.
const files = import.meta.glob("../../blogs/*.{md,html}", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export type Post = {
  slug: string;
  title: string;
  date: string | null; // YYYY-MM-DD
  description: string;
  tags: string[];
  kind: "md" | "html";
  html: string; // the article body, already cleaned
  styles: string; // <style> rules from an .html post, scoped to the article
  minutes: number;
};

// Posts are the site owner's own files, but scripts and inline event handlers
// are still removed so a pasted snippet can't break the page.
function clean(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script\s*>/gi, "")
    .replace(/<script\b[^>]*>/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1="#"');
}

const unquote = (v: string) => v.trim().replace(/^["']|["']$/g, "");

function toTags(v: string | undefined): string[] {
  if (!v) return [];
  return v
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map((t) => unquote(t))
    .filter(Boolean);
}

// "2026-10-12" or "12 Oct 2026" -> "2026-10-12"; anything unreadable -> null.
function toDate(v: string | undefined, fallback?: string): string | null {
  for (const candidate of [v, fallback]) {
    if (!candidate) continue;
    const d = new Date(candidate.trim());
    if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }
  return null;
}

const words = (html: string) => html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

// Posts may start with a date: 2026-10-12-my-post.md -> slug "my-post".
function parseName(path: string) {
  const file = path.split("/").pop() ?? "";
  const base = file.replace(/\.(md|html)$/i, "");
  const m = base.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
  return { kind: (file.endsWith(".html") ? "html" : "md") as "md" | "html", slug: (m ? m[2]! : base).toLowerCase(), fileDate: m?.[1] };
}

function fromMarkdown(raw: string, name: ReturnType<typeof parseName>): Post | null {
  const fm: Record<string, string> = {};
  let body = raw.replace(/^\uFEFF/, "");
  const m = body.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (m) {
    for (const line of m[1]!.split(/\r?\n/)) {
      const i = line.indexOf(":");
      if (i > 0) fm[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
    }
    body = body.slice(m[0].length);
  }
  if (/^(true|yes)$/i.test(fm["draft"] ?? "")) return null;
  const heading = body.match(/^#\s+(.+)$/m)?.[1];
  const html = clean(marked.parse(body, { gfm: true, async: false }));
  const plain = body.replace(/[#>*_`\[\]()!-]/g, " ").replace(/\s+/g, " ").trim();
  return {
    slug: name.slug,
    title: unquote(fm["title"] ?? heading ?? name.slug),
    date: toDate(fm["date"], name.fileDate),
    description: unquote(fm["description"] ?? plain.slice(0, 160)),
    tags: toTags(fm["tags"]),
    kind: "md",
    html,
    styles: "",
    minutes: Math.max(1, Math.round(words(html) / 200)),
  };
}

function fromHtml(raw: string, name: ReturnType<typeof parseName>): Post | null {
  const meta = (key: string) =>
    raw.match(new RegExp(`<meta[^>]+name=["']${key}["'][^>]*content=["']([^"']*)["']`, "i"))?.[1] ??
    raw.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*name=["']${key}["']`, "i"))?.[1];
  if (/^(true|yes)$/i.test(meta("draft") ?? "")) return null;
  const title = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? raw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim() ?? name.slug;
  // Keep each <style> block, but scope it to the article so it can't restyle the site.
  const styles = [...raw.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((s) => `@scope (.blog-html) { ${s[1]} }`).join("\n");
  const body = (raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? raw)
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<\/?(html|head|body)[^>]*>/gi, "")
    .replace(/<title[\s\S]*?<\/title>/gi, "")
    .replace(/<meta[^>]*>/gi, "")
    .replace(/<link[^>]*>/gi, "");
  const html = clean(body);
  return {
    slug: name.slug,
    title,
    date: toDate(meta("date"), name.fileDate),
    description: meta("description") ?? html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 160),
    tags: toTags(meta("keywords")),
    kind: "html",
    html,
    styles,
    minutes: Math.max(1, Math.round(words(html) / 200)),
  };
}

export const posts: Post[] = Object.entries(files)
  .map(([path, raw]) => {
    const name = parseName(path);
    return name.kind === "html" ? fromHtml(raw, name) : fromMarkdown(raw, name);
  })
  .filter((p): p is Post => p !== null)
  .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const formatDate = (date: string | null) =>
  date ? new Date(`${date}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }) : "";
