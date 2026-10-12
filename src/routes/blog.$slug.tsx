import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { SiteHeader } from "@/components/site-header";
import { formatDate, getPost } from "@/lib/blog";
import { jsonLd, pageMeta, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    if (!getPost(params.slug)) throw notFound();
    return null;
  },
  head: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) return {};
    return {
      ...pageMeta({ title: `${post.title} — Shuklaji`, description: post.description, path: `/blog/${post.slug}` }),
      scripts: [
        jsonLd({
          "@type": "BlogPosting",
          headline: post.title,
          description: post.description,
          url: `${SITE_URL}/blog/${post.slug}`,
          ...(post.date ? { datePublished: post.date } : {}),
          ...(post.tags.length ? { keywords: post.tags.join(", ") } : {}),
          author: { "@id": `${SITE_URL}/#person` },
          mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
        }),
      ],
    };
  },
  notFoundComponent: () => (
    <main className="grid min-h-screen place-items-center bg-background px-5 text-center text-foreground">
      <div>
        <p className="font-serif text-5xl">that post wandered off.</p>
        <Link to="/blog" className="mt-6 inline-block underline underline-offset-8">back to the blog</Link>
      </div>
    </main>
  ),
  component: BlogPost,
});

function BlogPost() {
  const { slug } = Route.useParams();
  const post = getPost(slug)!;
  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader
        items={[
          { label: "brain", to: "/" },
          { label: "work", to: "/work" },
          { label: "blog", to: "/blog", current: true },
          { label: "vocademy", href: "https://vocademy.co.in" },
          { label: "let's talk", to: "/", hash: "hi" },
        ]}
      />
      <article className="mx-auto max-w-2xl px-5 pb-28 pt-36 sm:px-8">
        <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground">← all posts</Link>
        <p className="mt-8 text-sm text-muted-foreground">{[formatDate(post.date), `${post.minutes} min read`].filter(Boolean).join(" · ")}</p>
        <h1 className="mt-3 font-serif text-5xl leading-[1.05] sm:text-6xl">{post.title}</h1>
        {post.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((t) => <span key={t} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">{t}</span>)}
          </div>
        )}
        {post.styles && <style dangerouslySetInnerHTML={{ __html: post.styles }} />}
        <div className={post.kind === "html" ? "blog-prose blog-html mt-12" : "blog-prose mt-12"} dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </main>
  );
}
