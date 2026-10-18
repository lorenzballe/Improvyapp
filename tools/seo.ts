import { readFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { APP_IMAGES, imageObject } from "./degree-pages";
import { PRO_PRICES, PRO_STORE_EUR, type Currency } from "../src/lib/pricing";

/**
 * Structured data for search engines, built from the same sources the page
 * renders — so the price Google shows and the FAQ it quotes can never drift
 * from what a visitor reads.
 *
 * Google only trusts structured data that matches visible content. Writing
 * the FAQ and the price twice, once in React and once in JSON, would be the
 * surest way to make them disagree after the next edit, so this reads them
 * out of src/ at build time instead.
 */
const SITE = "https://improvy.app/";
const APP_STORE = "https://apps.apple.com/app/id6775236759";
const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.improvy.app";

function read(root: string, file: string) {
  return readFileSync(path.join(root, file), "utf8");
}

/** 1899 → "18.99": the same table the page and the checkout use. */
const decimal = (cents: number) => (cents / 100).toFixed(2);

/** The { q, a } pairs of FaqSection, in order. */
function faqs(src: string) {
  const out: { q: string; a: string }[] = [];
  const re = /q:\s*"((?:[^"\\]|\\.)*)",\s*a:\s*"((?:[^"\\]|\\.)*)"/g;
  for (let m; (m = re.exec(src)); ) {
    out.push({ q: JSON.parse(`"${m[1]}"`), a: JSON.parse(`"${m[2]}"`) });
  }
  if (out.length === 0) throw new Error("seo: found no FAQ entries in FaqSection.tsx");
  return out;
}

export function seo(): Plugin {
  let root = process.cwd();
  return {
    name: "improvy-seo",
    configResolved(c) {
      root = c.root;
    },
    transformIndexHtml() {
      const faq = faqs(read(root, "src/components/FaqSection.tsx"));

      const org = {
        "@type": "Organization",
        "@id": `${SITE}#org`,
        name: "Improvy",
        url: SITE,
        logo: imageObject(APP_IMAGES[0]),
        email: "thebalecompany@gmail.com",
        sameAs: [APP_STORE, PLAY_STORE],
      };
      const offers = [
        { "@type": "Offer", name: "Free", price: "0", priceCurrency: "EUR", url: SITE },
        // On the website, in each currency it sells in.
        ...(Object.keys(PRO_PRICES) as Currency[]).map((c) => ({
          "@type": "Offer",
          name: "Improvy Pro — lifetime, on the website",
          price: decimal(PRO_PRICES[c]),
          priceCurrency: c.toUpperCase(),
          url: `${SITE}#pro`,
          availability: "https://schema.org/InStock",
        })),
        {
          "@type": "Offer",
          name: "Improvy Pro — lifetime, in the app",
          price: decimal(PRO_STORE_EUR),
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
        },
      ];
      const app = (os: string, url: string) => ({
        "@type": "MobileApplication",
        name: "Improvy",
        operatingSystem: os,
        applicationCategory: "EducationalApplication",
        applicationSubCategory: "Music education",
        description:
          "Improvy trains you to see every note as its scale degree, instantly, in all 12 keys — for improvising, transposing and composing without mental math.",
        url,
        image: [`${SITE}images/improvy-app-icon.png`, `${SITE}og-image.png`],
        screenshot: APP_IMAGES.filter((i) => i.h > i.w).map(imageObject),
        inLanguage: ["en", "it", "es", "fr", "de", "pt"],
        publisher: { "@id": `${SITE}#org` },
        offers,
      });
      const graph = {
        "@context": "https://schema.org",
        "@graph": [
          org,
          {
            "@type": "WebSite",
            "@id": `${SITE}#site`,
            name: "Improvy",
            url: SITE,
            inLanguage: "en",
            publisher: { "@id": `${SITE}#org` },
          },
          app("iOS", APP_STORE),
          app("Android", PLAY_STORE),
          {
            "@type": "FAQPage",
            mainEntity: faq.map(({ q, a }) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          },
        ],
      };
      return [
        {
          tag: "script",
          attrs: { type: "application/ld+json" },
          // "<" escaped so no string in the data can ever close the tag.
          children: JSON.stringify(graph).replace(/</g, "\\u003c"),
          injectTo: "head",
        },
      ];
    },
  };
}
