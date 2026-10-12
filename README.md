# shuklaji — the anatomy of a curious mind

Personal portfolio for [shuklaji.org](https://shuklaji.org): one hand-drawn thread that wanders through UPSC, code, crypto, products and philosophy, then drops you down the rabbit hole into all the work.

Design and code are based on the open-source [portfolio-template](https://github.com/SomehowLiving/portfolio-template) by Nidhi (MIT). The story, text and images here are Shuklaji's own.

## Run it

```
npm install   # or bun install
npm run dev
```

## Where to edit

- `src/routes/index.tsx`: the story, the talking objects, the featured work, contact links
- `src/routes/work.tsx`: all projects (the "more rabbit holes" page)
- `src/lib/seo.ts`, `public/llms.txt`, `public/sitemap.xml`: name, bio, email, site URL
- `src/assets/me.webp`: **placeholder silhouette. Replace with your own transparent cutout** with one hand raised at about 41% across / 2% down (that is where the thread ties on)
- `src/assets/project-*.webp`: placeholder cards for the three featured projects (1200×912)
- `public/og.png`, `favicon.ico`, `apple-touch-icon.png`: placeholders

## Content notes

- The timeline uses "chapter" labels instead of years. Reorder or add years in `timeline` in `index.tsx`.
- Social links: only Vocademy and the Vocademy app are linked. Add Telegram, GitHub or X in `LINKS` and the contact section of `index.tsx`.

## Blog

Put `.md` or `.html` files in the `blogs/` folder. They appear at `/blog` (list) and `/blog/<slug>` (post). The site reads the folder at build time, so redeploy after adding a post.

**Markdown** starts with a header:

```
---
title: My post
date: 2026-10-12
description: One-line summary for search and sharing.
tags: [crypto, notes]
draft: false      # true hides it
---
```

**HTML** takes its details from the head: `<title>`, `<meta name="description">`, `<meta name="date">`, `<meta name="keywords">` (tags), `<meta name="draft" content="true">` to hide. Your `<style>` rules are scoped to the article; `<script>` tags are removed.

A filename like `2026-10-12-my-post.md` gives the date and the slug `my-post`. `npm run build` also rebuilds `public/sitemap.xml` with every post.

## Header

The floating glass header is `src/components/site-header.tsx`; the glass look is the `.glass` classes at the bottom of `src/styles.css`. Menu items are passed in from each page (`index.tsx`, `work.tsx`, the blog routes).
