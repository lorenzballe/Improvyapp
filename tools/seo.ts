import { readFileSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { imageObject } from "./degree-pages";
import { APP_ICON, HOME_SCREEN, SCREENS_INTRO, STORE_SCREENSHOTS, type AppImage } from "../src/lib/appImages";
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

function attr(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** One of the app's pictures in the plain HTML, lazy: React replaces that
 *  HTML at once, so a visitor's browser fetches next to none of them. */
function figure(i: AppImage, width: number) {
  const caption = i.text ? `<figcaption><b>${attr(i.name ?? "")}</b><br />${attr(i.text)}</figcaption>` : "";
  return `<figure style="margin:0;width:${width}px;max-width:100%"><img src="images/${i.file}" width="${i.w}" height="${i.h}" alt="${attr(i.alt)}" loading="lazy" decoding="async" style="display:block;width:100%;height:auto;border-radius:20px" />${caption}</figure>`;
}

/**
 * The home page's pictures in its plain HTML — what a crawler that runs no
 * JavaScript reads — from the same list the rendered page draws: the home
 * screen the phone at the top shows, then the five store screenshots.
 */
function staticImages(html: string) {
  const blocks: Record<string, string> = {
    "home-screen": `<div style="margin:24px 0">${figure(HOME_SCREEN, 220)}</div>`,
    "app-screens": [
      "<h2>Inside the app</h2>",
      `<p>${attr(SCREENS_INTRO)}</p>`,
      `<div style="display:flex;flex-wrap:wrap;gap:24px 16px">${STORE_SCREENSHOTS.map((i) => figure(i, 200)).join("")}</div>`,
      '<p><a href="app/">Every screen, on its own page</a></p>',
    ].join("\n        "),
  };
  for (const [name, block] of Object.entries(blocks)) {
    const mark = `<!-- ${name}: written at build time by tools/seo.ts -->`;
    if (!html.includes(mark)) throw new Error(`seo: index.html has no "${mark}"`);
    html = html.replace(mark, block);
  }
  return html;
}

export function seo(): Plugin {
  let root = process.cwd();
  return {
    name: "improvy-seo",
    configResolved(c) {
      root = c.root;
    },
    transformIndexHtml(html) {
      const faq = faqs(read(root, "src/components/FaqSection.tsx"));

      const org = {
        "@type": "Organization",
        "@id": `${SITE}#org`,
        name: "Improvy",
        url: SITE,
        logo: imageObject(APP_ICON),
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
        image: [`${SITE}images/${APP_ICON.file}`, `${SITE}og-image.png`],
        // What the home page shows: the five store screenshots and the
        // home screen in the phone at the top.
        screenshot: [...STORE_SCREENSHOTS, HOME_SCREEN].map(imageObject),
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
      return {
        html: staticImages(html),
        tags: [
          {
            tag: "script",
            attrs: { type: "application/ld+json" },
            // "<" escaped so no string in the data can ever close the tag.
            children: JSON.stringify(graph).replace(/</g, "\\u003c"),
            injectTo: "head",
          },
        ],
      };
    },
  };
}
