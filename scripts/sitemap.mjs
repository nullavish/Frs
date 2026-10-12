// Rebuilds public/sitemap.xml from the pages plus every post in /blogs.
// Runs automatically before `npm run build`.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const SITE = "https://shuklaji.org";
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: `${SITE}/`, lastmod: today, priority: "1.0" },
  { loc: `${SITE}/work`, lastmod: today, priority: "0.8" },
  { loc: `${SITE}/blog`, lastmod: today, priority: "0.8" },
];
for (const file of readdirSync("blogs").filter((f) => /\.(md|html)$/i.test(f))) {
  const raw = readFileSync(`blogs/${file}`, "utf8");
  if (/^draft:\s*(true|yes)/im.test(raw) || /name=["']draft["'][^>]*content=["'](true|yes)/i.test(raw)) continue;
  const base = file.replace(/\.(md|html)$/i, "");
  const m = base.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
  const slug = (m ? m[2] : base).toLowerCase();
  const fm = raw.match(/^date:\s*(\S+)/im)?.[1] ?? raw.match(/name=["']date["'][^>]*content=["']([^"']+)/i)?.[1] ?? m?.[1];
  const d = fm ? new Date(fm) : null;
  urls.push({ loc: `${SITE}/blog/${slug}`, lastmod: d && !Number.isNaN(d.getTime()) ? d.toISOString().slice(0, 10) : today, priority: "0.6" });
}
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`)
  .join("\n")}\n</urlset>\n`;
writeFileSync("public/sitemap.xml", xml);
console.log(`sitemap: ${urls.length} urls`);
