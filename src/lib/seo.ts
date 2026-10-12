// Everything search engines and AI answer engines read about the site lives
// here: titles, descriptions, the share image, and the structured data that
// says who Shuklaji is. None of it changes what's on screen.

export const SITE_URL = "https://shuklaji.org";
export const OG_IMAGE = `${SITE_URL}/og.png`;

export const NAME = "Shuklaji";
export const ABOUT_SHORT =
  "Shuklaji (ѕнυкℓα जी) is a software developer, digital product builder, Telegram bot developer, web designer and author, exploring UPSC preparation, technology, crypto markets and philosophy. Founder of Vocademy and co-founder of Aatmdeep Pvt Ltd.";

export const EMAIL = "contact@shuklaji.in";

export const PROFILES = ["https://vocademy.co.in", "https://vocademyapp.com"];

export const person = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: NAME,
  alternateName: ["ѕнυкℓα जी", "shukla"],
  url: SITE_URL,
  image: OG_IMAGE,
  email: `mailto:${EMAIL}`,
  jobTitle: "Software Developer and Digital Product Builder",
  description: ABOUT_SHORT,
  worksFor: { "@type": "Organization", name: "Aatmdeep Pvt Ltd", description: "Co-founder" },
  knowsAbout: [
    "UPSC Civil Services preparation",
    "Competitive exams",
    "Python",
    "Telegram bot development",
    "React",
    "Web design",
    "Cryptocurrency markets",
    "Forex and quantitative trading experiments",
    "Educational technology",
    "Indian philosophy",
    "Technical writing",
  ],
  sameAs: PROFILES,
};

// Turn a JSON-LD object into a <script> entry for a route's head.
export const jsonLd = (data: Record<string, unknown>) => ({
  type: "application/ld+json",
  children: JSON.stringify({ "@context": "https://schema.org", ...data }),
});

// The standard set of tags for a page: title, description, canonical address
// and the share card.
export function pageMeta({ title, description, path }: { title: string; description: string; path: string }) {
  const url = `${SITE_URL}${path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "the anatomy of a curious mind — Shuklaji" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
