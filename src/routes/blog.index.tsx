import { Link, createFileRoute } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { formatDate, posts } from "@/lib/blog";
import { jsonLd, pageMeta, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    ...pageMeta({
      title: "Blog — Shuklaji",
      description: "Notes, tutorials and write-ups by Shuklaji on technology, crypto, UPSC preparation, design and philosophy.",
      path: "/blog",
    }),
    scripts: [
      jsonLd({
        "@type": "Blog",
        url: `${SITE_URL}/blog`,
        name: "Shuklaji — Blog",
        author: { "@id": `${SITE_URL}/#person` },
        blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: `${SITE_URL}/blog/${p.slug}`, ...(p.date ? { datePublished: p.date } : {}) })),
      }),
    ],
  }),
  component: BlogIndex,
});

export const blogMenu = [
  { label: "brain", to: "/" },
  { label: "work", to: "/work" },
  { label: "blog", to: "/blog", current: true },
  { label: "vocademy", href: "https://vocademy.co.in" },
  { label: "let's talk", to: "/", hash: "hi" },
] as const;

function BlogIndex() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader items={[...blogMenu]} />
      <section className="mx-auto max-w-3xl px-5 pb-28 pt-36 sm:px-8">
        <p className="text-sm text-muted-foreground">notes from the rabbit holes</p>
        <h1 className="mt-3 font-serif text-6xl leading-none sm:text-7xl">blog.</h1>
        {posts.length === 0 && <p className="mt-16 text-muted-foreground">Nothing here yet. Add a .md or .html file to the blogs folder.</p>}
        <ul className="mt-16 divide-y divide-border border-y border-border">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link to="/blog/$slug" params={{ slug: p.slug }} className="group block py-8">
                <p className="text-xs text-muted-foreground">
                  {[formatDate(p.date), `${p.minutes} min read`, ...p.tags].filter(Boolean).join(" · ")}
                </p>
                <h2 className="mt-2 font-serif text-3xl leading-tight transition-transform duration-300 group-hover:translate-x-1 sm:text-4xl">{p.title}</h2>
                <p className="mt-2 max-w-xl text-muted-foreground">{p.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
