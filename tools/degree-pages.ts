import type { Plugin } from "vite";
import {
  KEYS,
  degreeColor,
  degreeSemitones,
  noteName,
  parseDegree,
  parseNote,
  pc,
  spell,
  type KeyName,
  type Note,
} from "../src/lib/harmony";

/**
 * A page for every degree in every key — "the ♭7 of E♭", "the ♯11 of D" —
 * written out as static HTML at build time.
 *
 * People ask a search engine exactly these questions, one key and one degree
 * at a time, and the site is a single hash-routed page that answers none of
 * them. Each page answers its question in the first line, shows it on a
 * keyboard, says why it is spelled that way, and links to the same degree in
 * the other keys and to the other degrees in this one.
 *
 * The notes come from src/lib/harmony.ts — the spelling the app uses, by
 * letter then semitones — so no page can name a note the app would not.
 */
const SITE = "https://improvy.app/";
const APP_STORE = "https://apps.apple.com/app/id6775236759";
const PLAY_STORE = "https://play.google.com/store/apps/details?id=com.improvy.app";

interface DegreeInfo {
  token: string;
  slug: string;
  /** "flat seven". */
  words: string;
  /** "minor seventh". */
  interval: string;
  /** Where a musician meets it: a chord or a scale on the key's root. */
  example: { kind: "chord"; suffix: string; tones: string[] } | { kind: "scale"; name: string; tones: string[] };
  /** One sentence on what the degree does; {K} is the key, {N} the note. */
  role: string;
}

const DEGREES: DegreeInfo[] = [
  {
    token: "♭2", slug: "flat-2", words: "flat two", interval: "minor second",
    example: { kind: "scale", name: "Phrygian", tones: ["1", "♭2", "♭3", "4", "5", "♭6", "♭7"] },
    role: "The ♭2 is a half step above the root. It is the note that makes Phrygian sound dark, and the root of the ♭II7 chord, the tritone substitute for the V7 that resolves to {K}.",
  },
  {
    token: "2", slug: "2", words: "two", interval: "major second",
    example: { kind: "chord", suffix: "add9", tones: ["1", "3", "5", "9"] },
    role: "The 2 is a whole step above the root. An octave up it is called the 9 — the same note, {N} — and it is the first colour most players add to a chord.",
  },
  {
    token: "♭3", slug: "flat-3", words: "flat three", interval: "minor third",
    example: { kind: "chord", suffix: "m", tones: ["1", "♭3", "5"] },
    role: "The ♭3 makes a chord minor: {K} minor is the root, {N} and the 5th. Over a dominant chord the same key on the piano is usually written as the ♯9, with another letter.",
  },
  {
    token: "3", slug: "3", words: "three", interval: "major third",
    example: { kind: "chord", suffix: "", tones: ["1", "3", "5"] },
    role: "The 3 decides major or minor. With the 7 it is a guide tone: the two notes that say what a chord is.",
  },
  {
    token: "4", slug: "4", words: "four", interval: "perfect fourth",
    example: { kind: "chord", suffix: "sus4", tones: ["1", "4", "5"] },
    role: "The 4 sits a half step above the major 3rd. In a sus chord it takes the 3rd's place; an octave up it is the 11.",
  },
  {
    token: "♯4", slug: "sharp-4", words: "sharp four", interval: "augmented fourth",
    example: { kind: "scale", name: "Lydian", tones: ["1", "2", "3", "♯4", "5", "6", "7"] },
    role: "The ♯4 is the Lydian note, a tritone above the root. On a chord symbol it is usually written ♯11.",
  },
  {
    token: "♭5", slug: "flat-5", words: "flat five", interval: "diminished fifth",
    example: { kind: "chord", suffix: "m7♭5", tones: ["1", "♭3", "♭5", "♭7"] },
    role: "The ♭5 halves the octave: a tritone above {K}. It is the 5th of the half-diminished and the diminished chord.",
  },
  {
    token: "5", slug: "5", words: "five", interval: "perfect fifth",
    example: { kind: "chord", suffix: "5", tones: ["1", "5"] },
    role: "The 5 is the most stable note after the root; a power chord is just the two of them.",
  },
  {
    token: "♯5", slug: "sharp-5", words: "sharp five", interval: "augmented fifth",
    example: { kind: "chord", suffix: "+", tones: ["1", "3", "♯5"] },
    role: "The ♯5 is the 5th of the augmented chord. Over a dominant the same key on the piano is usually written ♭13.",
  },
  {
    token: "♭6", slug: "flat-6", words: "flat six", interval: "minor sixth",
    example: { kind: "scale", name: "Aeolian (natural minor)", tones: ["1", "2", "♭3", "4", "5", "♭6", "♭7"] },
    role: "The ♭6 is the 6th of the natural minor scale, and the root of ♭VI, a chord major keys often borrow from their minor.",
  },
  {
    token: "6", slug: "6", words: "six", interval: "major sixth",
    example: { kind: "chord", suffix: "6", tones: ["1", "3", "5", "6"] },
    role: "The 6 is the added note of a sixth chord. An octave up, on a dominant, it is the 13.",
  },
  {
    token: "𝄫7", slug: "double-flat-7", words: "double-flat seven", interval: "diminished seventh",
    example: { kind: "chord", suffix: "°7", tones: ["1", "♭3", "♭5", "𝄫7"] },
    role: "The 𝄫7 is the 7th of the fully diminished chord. On the piano it is the same key as the 6, but a seventh is spelled with a seventh's letter.",
  },
  {
    token: "♭7", slug: "flat-7", words: "flat seven", interval: "minor seventh",
    example: { kind: "chord", suffix: "7", tones: ["1", "3", "5", "♭7"] },
    role: "The ♭7 is the 7th of the dominant chord and of the minor seventh chord, and the note that turns the major scale into Mixolydian.",
  },
  {
    token: "7", slug: "7", words: "seven", interval: "major seventh",
    example: { kind: "chord", suffix: "maj7", tones: ["1", "3", "5", "7"] },
    role: "The 7 is a half step below the root: the major seventh, the 7th of the maj7 chord and the leading tone of the key.",
  },
  {
    token: "♭9", slug: "flat-9", words: "flat nine", interval: "minor ninth",
    example: { kind: "chord", suffix: "7♭9", tones: ["1", "3", "5", "♭7", "♭9"] },
    role: "The ♭9 is the first altered tension on a dominant chord. It is the ♭2 an octave up, written as a 9 because it sits above the chord.",
  },
  {
    token: "9", slug: "9", words: "nine", interval: "major ninth",
    example: { kind: "chord", suffix: "maj9", tones: ["1", "3", "5", "7", "9"] },
    role: "The 9 is the 2 an octave up: the first extension on almost any chord, major, minor or dominant.",
  },
  {
    token: "♯9", slug: "sharp-9", words: "sharp nine", interval: "augmented ninth",
    example: { kind: "chord", suffix: "7♯9", tones: ["1", "3", "5", "♭7", "♯9"] },
    role: "The ♯9 is the tension of the 7♯9 chord. It sounds like the minor 3rd, but it is a raised 9th and is spelled with the 9th's letter.",
  },
  {
    token: "11", slug: "11", words: "eleven", interval: "perfect eleventh",
    example: { kind: "chord", suffix: "m11", tones: ["1", "♭3", "5", "♭7", "9", "11"] },
    role: "The 11 is the 4 an octave up. It sits naturally on minor chords; on a major chord it clashes with the 3rd, which is why the ♯11 exists.",
  },
  {
    token: "♯11", slug: "sharp-11", words: "sharp eleven", interval: "augmented eleventh",
    example: { kind: "chord", suffix: "maj7♯11", tones: ["1", "3", "5", "7", "♯11"] },
    role: "The ♯11 is the Lydian tension: the bright, open colour of maj7♯11 and of the Lydian dominant 7♯11.",
  },
  {
    token: "♭13", slug: "flat-13", words: "flat thirteen", interval: "minor thirteenth",
    example: { kind: "chord", suffix: "7♭13", tones: ["1", "3", "5", "♭7", "♭13"] },
    role: "The ♭13 is an altered tension of the dominant chord, one of the notes of the altered scale.",
  },
  {
    token: "13", slug: "13", words: "thirteen", interval: "major thirteenth",
    example: { kind: "chord", suffix: "13", tones: ["1", "3", "5", "♭7", "9", "13"] },
    role: "The 13 is the 6 an octave up: the top of a thirteenth chord, and of the classic dominant voicing with the 3 and the ♭7.",
  },
];

/** The key as a URL: F♯ → f-sharp, E♭ → e-flat. */
function keySlug(k: KeyName) {
  return k.replace("♯", "-sharp").replace("♭", "-flat").toLowerCase();
}
/** "E♭" → "E flat"; "F♯" → "F sharp". */
function keyWords(k: string) {
  return k.replace("♯", " sharp").replace("♭", " flat");
}
/** What people type: "E♭" → "Eb", "♯11" → "#11", "𝄫7" → "bb7". */
function ascii(s: string) {
  return s.replace(/𝄫/g, "bb").replace(/𝄪/g, "x").replace(/♭/g, "b").replace(/♯/g, "#");
}
function cap(s: string) {
  return s[0].toUpperCase() + s.slice(1);
}
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Every note the pages print, checked: nothing past a double flat or sharp. */
function spelled(root: Note, token: string): Note {
  const n = spell(root, token);
  if (Math.abs(n.acc) > 2) throw new Error(`degree-pages: the ${token} of ${noteName(root)} came out ${n.acc} accidentals`);
  return n;
}

const LETTERS = ["C", "D", "E", "F", "G", "A", "B"];

/** 1 → "unison", 2 → "2nd", 9 → "9th". */
function ordinal(n: number) {
  return n === 1 ? "unison" : n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`;
}
/** "a 9th", "an 11th", "an augmented fourth". */
function a(word: string) {
  return /^(8|11|18|[aeiou])/i.test(word) ? `an ${word}` : `a ${word}`;
}

/** The other name of the same key on the piano, when someone might reach for it. */
function enharmonic(n: Note): Note | null {
  const p = pc(n);
  for (const acc of [0, -1, 1]) {
    for (const letter of LETTERS) {
      if (letter === n.letter) continue;
      const cand = { letter, acc } as Note;
      if (pc(cand) === p) return cand;
    }
  }
  return null;
}

/** The letters from the root up to the degree, counting the root: E, F, G, A, B, C, D. */
function letterWalk(root: Note, num: number) {
  const steps = (num - 1) % 7;
  const start = LETTERS.indexOf(root.letter);
  return Array.from({ length: steps + 1 }, (_, i) => LETTERS[(start + i) % 7]);
}

// ── The keyboard ─────────────────────────────────────────────────────────────

const WHITE_OF_PC: Record<number, number> = { 0: 0, 2: 1, 4: 2, 5: 3, 7: 4, 9: 5, 11: 6 };
const BLACK_AFTER: Record<number, number> = { 1: 0, 3: 1, 6: 3, 8: 4, 10: 5 };

/**
 * Keys lit on a keyboard drawn like the app's: white keys with hairline
 * seams, slate black keys, inside the app's dark frame, from the C at or
 * below the lowest key. Each mark is a position in semitones from that C, a
 * colour and a label.
 */
function keyboardSvg(marks: { pos: number; color: string; label: string }[]) {
  const W = 40;
  const H = 168;
  const BW = W * 0.62;
  const BH = H * 0.65;
  const PAD = 7;
  const top = Math.max(...marks.map((m) => m.pos));
  const octaves = Math.max(1, Math.ceil((top + 1) / 12));
  const keysW = octaves * 7 * W;
  const width = keysW + PAD * 2;
  const height = H + PAD * 2;
  const markAt = (pos: number) => marks.find((m) => m.pos === pos);
  let whites = "";
  let seams = "";
  let blacks = "";
  for (let o = 0; o < octaves; o++) {
    for (let p = 0; p < 12; p++) {
      const pos = o * 12 + p;
      const m = markAt(pos);
      if (p in WHITE_OF_PC) {
        const i = o * 7 + WHITE_OF_PC[p];
        const x = PAD + i * W;
        whites += `<rect x="${x}" y="${PAD}" width="${W}" height="${H}" fill="${m ? m.color : "#FFFFFF"}"/>`;
        if (i > 0) seams += `<rect x="${x - 0.5}" y="${PAD}" width="1" height="${H}" fill="#CBD5E1"/>`;
        if (m) whites += `<text x="${x + W / 2}" y="${PAD + H - 16}" text-anchor="middle" font-size="15" font-weight="900" fill="#fff">${esc(m.label)}</text>`;
      } else {
        const x = PAD + (o * 7 + BLACK_AFTER[p] + 1) * W - BW / 2;
        blacks += `<path d="M${x} ${PAD}h${BW}v${BH - 6}a6 6 0 0 1 -6 6h${-(BW - 12)}a6 6 0 0 1 -6 -6z" fill="${m ? m.color : "#1E293B"}" stroke="rgba(255,255,255,.10)"${m ? "" : ' filter="url(#drop)"'}/>`;
        if (m) blacks += `<text x="${x + BW / 2}" y="${PAD + BH - 12}" text-anchor="middle" font-size="11" font-weight="900" fill="#fff">${esc(m.label)}</text>`;
      }
    }
  }
  return `<svg viewBox="0 0 ${width} ${height}" width="100%" role="img" aria-hidden="true" font-family="Lexend, 'Plus Jakarta Sans', sans-serif" style="max-width:${width}px;display:block;margin:0 auto">
<defs>
<clipPath id="keys"><rect x="${PAD}" y="${PAD}" width="${keysW}" height="${H}" rx="12"/></clipPath>
<filter id="drop" x="-30%" y="-10%" width="160%" height="140%"><feDropShadow dx="0" dy="4" stdDeviation="3" flood-color="#000" flood-opacity=".45"/></filter>
</defs>
<rect x=".5" y=".5" width="${width - 1}" height="${height - 1}" rx="18" fill="rgba(0,0,0,.25)" stroke="rgba(255,255,255,.10)"/>
<g clip-path="url(#keys)">${whites}${seams}${blacks}</g>
</svg>`;
}

// ── The page around it ───────────────────────────────────────────────────────

const CSS = `
:root{color-scheme:dark}
*{box-sizing:border-box}
html{background:#06030c}
body{margin:0;min-height:100vh;color:#d4d4db;font-family:"Plus Jakarta Sans",system-ui,-apple-system,sans-serif;line-height:1.65;-webkit-font-smoothing:antialiased;
background:radial-gradient(900px 520px at 6% -8%,rgba(244,63,94,.16),transparent 62%),radial-gradient(820px 560px at 98% 2%,rgba(168,85,247,.17),transparent 62%),radial-gradient(900px 600px at 72% 104%,rgba(229,169,60,.09),transparent 62%),#06030c}
a{color:#e5a93c;text-decoration:none;transition:color .2s}a:hover{color:#fff}
.wrap{max-width:820px;margin:0 auto;padding:18px 20px 72px}
.top{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:8px 8px 8px 18px;border:1px solid rgba(255,255,255,.08);border-radius:999px;background:rgba(7,4,15,.72);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:0 16px 50px rgba(7,4,15,.7)}
.brand{font-weight:900;font-style:italic;font-size:20px;color:#fff;letter-spacing:-.01em}
.brand:hover{color:#fff}
.pill{font-size:10px;font-weight:900;letter-spacing:.16em;text-transform:uppercase;color:#09090b;background:#fff;padding:9px 14px;border-radius:999px;white-space:nowrap}
.pill:hover{color:#09090b;opacity:.88}
.crumbs{margin-top:40px;font-size:10.5px;font-weight:900;letter-spacing:.2em;text-transform:uppercase;color:#71717a}
.crumbs a{color:#a1a1aa}.crumbs a:hover{color:#fff}
.eyebrow{display:block;margin-top:22px;font-size:11px;font-weight:900;letter-spacing:.24em;text-transform:uppercase;background:linear-gradient(90deg,#f43f5e,#d946ef,#6366f1);-webkit-background-clip:text;background-clip:text;color:transparent}
h1{color:#fff;font-size:clamp(36px,8vw,64px);line-height:1.02;letter-spacing:-.035em;font-weight:800;margin:12px 0 18px}
h1 em{font-style:italic;font-weight:300;background:linear-gradient(90deg,#e5a93c,#f43f5e 55%,#a855f7);-webkit-background-clip:text;background-clip:text;color:transparent;padding-right:.1em}
.lead{font-size:17px;line-height:1.7;color:#a1a1aa;margin:0;font-weight:300}
.lead b{color:#fff;font-weight:700}
.kb{margin:34px 0 8px;padding:22px 18px 18px;border:1px solid rgba(255,255,255,.08);border-radius:28px;background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.012));box-shadow:0 30px 70px -24px rgba(0,0,0,.8)}
.legend{display:flex;flex-wrap:wrap;gap:8px 20px;justify-content:center;margin-top:16px;font-size:13px;color:#a1a1aa}
.dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:7px;vertical-align:middle;box-shadow:0 0 10px currentColor}
h2{margin:50px 0 12px;font-size:11px;font-weight:900;letter-spacing:.22em;text-transform:uppercase;color:#e5a93c}
p{margin:10px 0;font-weight:300;color:#c4c4cc}
p b{color:#fff;font-weight:700}
.tones{font-size:22px;color:#fff;font-weight:800;letter-spacing:.01em}
table{width:100%;border-collapse:separate;border-spacing:0;font-size:15px;border:1px solid rgba(255,255,255,.07);border-radius:20px;overflow:hidden;background:rgba(255,255,255,.015)}
th,td{padding:11px 16px;border-bottom:1px solid rgba(255,255,255,.06);text-align:left}
tr:last-child td{border-bottom:0}
th{font-size:10px;text-transform:uppercase;letter-spacing:.18em;color:#71717a;font-weight:900;background:rgba(255,255,255,.02)}
td{color:#d4d4db}
td a{font-weight:800}
td b{color:#fff}
tr.here td{background:rgba(229,169,60,.09)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:8px;margin-top:14px}
.chip{display:block;padding:10px 14px;border:1px solid rgba(255,255,255,.08);border-radius:14px;background:rgba(255,255,255,.025);color:#a1a1aa;font-size:14px;transition:border-color .2s,background .2s}
.chip b{color:#fff;font-weight:800}
.chip:hover{border-color:rgba(229,169,60,.55);background:rgba(229,169,60,.06);color:#d4d4db}
.cta{margin-top:64px;padding:32px 28px;border-radius:30px;border:1px solid rgba(229,169,60,.26);background:radial-gradient(520px 260px at 0% 0%,rgba(229,169,60,.13),transparent 70%),radial-gradient(520px 260px at 100% 100%,rgba(168,85,247,.12),transparent 70%),rgba(7,4,15,.65);box-shadow:0 30px 70px -24px rgba(0,0,0,.8)}
.cta h3{margin:0 0 12px;font-size:clamp(26px,5vw,38px);line-height:1.04;letter-spacing:-.02em;font-weight:900;text-transform:uppercase;color:#fff}
.cta h3 span{background:linear-gradient(90deg,#f43f5e,#a855f7,#6366f1);-webkit-background-clip:text;background-clip:text;color:transparent}
.cta p{max-width:560px}
.btns{display:flex;flex-wrap:wrap;gap:12px;margin-top:22px}
.store{display:flex;align-items:center;gap:12px;padding:12px 20px;border-radius:16px;background:#18181b;border:1px solid rgba(255,255,255,.1);color:#fff;min-width:190px}
.store:hover{color:#fff;border-color:rgba(229,169,60,.5);box-shadow:0 0 20px rgba(229,169,60,.15)}
.store small{display:block;font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;color:#71717a;font-weight:800;line-height:1.2}
.store strong{display:block;font-size:16px;line-height:1.2}
.btn{display:inline-flex;align-items:center;gap:8px;padding:14px 22px;border-radius:14px;background:#fff;color:#09090b;font-weight:900;font-size:11.5px;letter-spacing:.16em;text-transform:uppercase}
.btn:hover{color:#09090b;opacity:.88}
footer{margin-top:64px;padding-top:22px;border-top:1px solid rgba(255,255,255,.06);font-size:12px;color:#71717a;display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center}
footer a{color:#a1a1aa}
footer .brand{font-size:16px;margin-right:auto}
`;

function page(opts: {
  /** From this page back to the site root: "../../../". */
  up: string;
  path: string;
  title: string;
  description: string;
  crumbs: { name: string; path: string }[];
  body: string;
}) {
  const url = SITE + opts.path;
  const crumbs = [{ name: "Improvy", path: "" }, ...opts.crumbs];
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: SITE + c.path })),
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#06030c">
<title>${esc(opts.title)}</title>
<meta name="description" content="${esc(opts.description)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Improvy">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(opts.title)}">
<meta property="og:description" content="${esc(opts.description)}">
<meta property="og:image" content="${SITE}og-image.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="apple-itunes-app" content="app-id=6775236759">
<link rel="icon" type="image/png" href="${opts.up}favicon.png">
<link rel="apple-touch-icon" href="${opts.up}apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Lexend:wght@800..900&display=swap">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>
<style>${CSS}</style>
</head>
<body>
<div class="wrap">
<div class="top"><a class="brand" href="${opts.up}">Improvy</a><a class="pill" href="${opts.up}#quiz">60-second test</a></div>
<div class="crumbs">${crumbs
    .map((c, i) => (i === crumbs.length - 1 ? esc(c.name) : `<a href="${opts.up}${c.path}">${esc(c.name)}</a>`))
    .join(" › ")}</div>
${opts.body}
<div class="cta">
<h3>Name it before<br><span>you can count it.</span></h3>
<p>Improvy trains every degree in all 12 keys — the 3, the ♭7, the ♯11 — until you see the note without working it out. A few minutes a day. Free to start; Pro is one payment, never a subscription.</p>
<div class="btns">
<a class="store" href="${APP_STORE}"><svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 1.15-3.27 1.2-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5 1.07 3.29 1.07.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.02.07-.43 1.44-1.38 2.82M15.97 4.17c.66-.8 1.1-1.89 1.08-3.17-.91.04-2.01.6-2.67 1.38-.56.66-1.05 1.76-.9 3.01 1.05.08 2.06-.51 2.49-1.22z"/></svg><span><small>Download on the</small><strong>App Store</strong></span></a>
<a class="store" href="${PLAY_STORE}"><svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.25 1.75C3.06 1.93 2.95 2.22 2.95 2.6V21.4C2.95 21.78 3.06 22.07 3.25 22.25L3.32 22.32L13.84 11.8V11.53L3.32 1.01L3.25 1.75Z" fill="#00A0FF"/><path d="M17.34 15.33L13.84 11.82V11.51L17.34 8L17.42 8.04L21.57 10.4C22.75 11.07 22.75 12.26 21.57 12.93L17.42 15.29L17.34 15.33Z" fill="#FFE000"/><path d="M13.84 11.66L3.25 22.25C3.59 22.59 4.19 22.61 4.88 22.22L17.34 15.14L13.84 11.66Z" fill="#FF2C00"/><path d="M13.84 11.66L17.34 8.18L4.88 1.1C4.19 0.71 3.59 0.73 3.25 1.07L13.84 11.66Z" fill="#00E676"/></svg><span><small>Get it on</small><strong>Google Play</strong></span></a>
<a class="btn" href="${opts.up}#quiz">The 60-second test →</a>
</div>
</div>
<footer><a class="brand" href="${opts.up}">Improvy</a><a href="${opts.up}degrees/">Every degree in every key</a><a href="${opts.up}#teachers">For teachers</a><a href="${opts.up}#about">About</a><span>© 2026 The Bale Company</span></footer>
</div>
</body>
</html>
`;
}

function chipList(items: { href: string; html: string }[]) {
  return `<div class="grid">${items.map((i) => `<a class="chip" href="${i.href}">${i.html}</a>`).join("")}</div>`;
}

function degreePage(key: KeyName, d: DegreeInfo) {
  const root = parseNote(key);
  const deg = parseDegree(d.token);
  const note = spelled(root, d.token);
  const N = noteName(note);
  // 𝄫 and 𝄪 are missing from many fonts, a search result's among them: a
  // title also says them in words.
  const titleN = Math.abs(note.acc) === 2 ? `${N} (${note.letter} double ${note.acc < 0 ? "flat" : "sharp"})` : N;
  const color = degreeColor(deg);
  const semis = degreeSemitones(deg);
  const up = "../../../";
  const path = `degrees/${keySlug(key)}/${d.slug}/`;

  const walk = letterWalk(root, deg.num);
  const compound = deg.num > 7;
  // The simple interval under a 9, 11 or 13: a 9th is a 2nd an octave up.
  const span = ((deg.num - 1) % 7) + 1;
  const alt = note.acc !== 0 ? enharmonic(note) : null;
  const altSpan = alt ? ((LETTERS.indexOf(alt.letter) - LETTERS.indexOf(root.letter) + 7) % 7) + 1 : 0;

  const exampleTones = d.example.tones.map((t) => noteName(spelled(root, t)));
  const exampleName =
    d.example.kind === "scale"
      ? `${key} ${d.example.name}`
      : d.example.suffix === ""
        ? `${key} major`
        : d.example.suffix === "m"
          ? `${key} minor`
          : `${key}${d.example.suffix}`;

  const sameDegree = KEYS.map((k) => {
    const n = noteName(spelled(parseNote(k), d.token));
    const here = k === key;
    return `<tr${here ? ' class="here"' : ""}><td>${here ? esc(k) : `<a href="../../${keySlug(k)}/${d.slug}/">${esc(k)}</a>`}</td><td><b>${esc(n)}</b></td></tr>`;
  }).join("");

  const others = chipList(
    DEGREES.filter((o) => o !== d).map((o) => ({
      href: `../${o.slug}/`,
      html: `${esc(o.token)} → <b>${esc(noteName(spelled(root, o.token)))}</b>`,
    }))
  );

  const role = d.role.replace(/\{K\}/g, key).replace(/\{N\}/g, N);
  const letter = walk[walk.length - 1];
  const howLetters = compound
    ? `${cap(a(ordinal(deg.num)))} is ${a(ordinal(span))} an octave up, so it takes the ${ordinal(span)}'s letter: ${walk.join(", ")}.`
    : `Count letters first, the root included: ${walk.join(", ")}. ${cap(a(ordinal(span)))} lands on ${letter}.`;
  const howSemis =
    note.acc === 0
      ? `Then the sound: ${a(d.interval)} is ${semis} semitones above ${key}, which is exactly where ${N} is — no sharp or flat needed.`
      : `Then the sound: ${a(d.interval)} is ${semis} semitones above ${key}, and the ${letter} that is ${semis} semitones up is ${N}.`;
  const whyNot = alt
    ? `That is why it is ${N} and not ${noteName(alt)}: ${noteName(alt)} is the same key on the piano, but from ${key} it would be ${a(ordinal(compound ? altSpan + 7 : altSpan))}, not ${a(ordinal(deg.num))}.`
    : "";

  const body = `
<span class="eyebrow">Scale degrees · ${esc(key)} major</span>
<h1>The ${esc(d.token)} of ${esc(key)} is <em>${esc(N)}</em></h1>
<p class="lead">The <b>${esc(d.token)}</b> (${esc(d.words)}${ascii(d.token) !== d.token ? `, written ${esc(ascii(d.token))}` : ""}) of <b>${esc(key)}</b>${key.length > 1 ? ` (${esc(keyWords(key))}, ${esc(ascii(key))})` : ""} is <b>${esc(N)}</b>${note.acc !== 0 ? ` (${esc(keyWords(N).replace("𝄫", " double flat").replace("𝄪", " double sharp"))})` : ""}: ${esc(a(d.interval))} above the root.</p>
<div class="kb">
${keyboardSvg([
  { pos: pc(root), color: degreeColor(parseDegree("1")), label: "1" },
  { pos: pc(root) + semis, color, label: d.token },
])}
<div class="legend"><span><span class="dot" style="background:${degreeColor(parseDegree("1"))}"></span>${esc(key)} — the root, 1</span><span><span class="dot" style="background:${color}"></span>${esc(N)} — the ${esc(d.token)}</span></div>
</div>
<h2>How to find it</h2>
<p>${esc(howLetters)}</p>
<p>${esc(howSemis)}</p>
${whyNot ? `<p>${esc(whyNot)}</p>` : ""}
<h2>Where you meet it</h2>
<p>${esc(role)}</p>
<p>${d.example.kind === "chord" ? "In" : "In the scale"} <b>${esc(exampleName)}</b>:</p>
<p class="tones">${exampleTones.map(esc).join(" · ")}</p>
<h2>The ${esc(d.token)} in every key</h2>
<table><thead><tr><th>Key</th><th>The ${esc(d.token)}</th></tr></thead><tbody>${sameDegree}</tbody></table>
<h2>Every degree of ${esc(key)}</h2>
${others}
`;
  return {
    path,
    html: page({
      up,
      path,
      title:
        ascii(d.token) === d.token && ascii(key) === key
          ? `The ${d.token} of ${key} is ${titleN} · Improvy`
          : `The ${d.token} of ${key} (${ascii(d.token)} of ${ascii(key)}) is ${titleN} · Improvy`,
      description: `The ${d.token} (${d.words}) of ${key} is ${N}, a ${d.interval} above the root. See it on the keyboard, why it is spelled ${N}, where you meet it, and the ${d.token} in all 12 keys.`,
      crumbs: [
        { name: "Degrees", path: "degrees/" },
        { name: key, path: `degrees/${keySlug(key)}/` },
        { name: `The ${d.token}`, path },
      ],
      body,
    }),
  };
}

function keyPage(key: KeyName) {
  const root = parseNote(key);
  const up = "../../";
  const path = `degrees/${keySlug(key)}/`;
  const scale = ["1", "2", "3", "4", "5", "6", "7"];
  const rows = DEGREES.map((d) => {
    const n = noteName(spelled(root, d.token));
    return `<tr><td><a href="${d.slug}/">${esc(d.token)}</a></td><td><b>${esc(n)}</b></td><td>${esc(d.interval)}</td></tr>`;
  }).join("");
  const body = `
<span class="eyebrow">Scale degrees · ${esc(key)} major</span>
<h1>Every degree<br>in <em>${esc(key)}</em></h1>
<p class="lead">The major scale of <b>${esc(key)}</b> is <b>${scale.map((t) => esc(noteName(spelled(root, t)))).join(" ")}</b>. Below, every degree a chart can ask for — the chromatic ones and the 9s, 11s and 13s — spelled the way it is written.</p>
<div class="kb">
${keyboardSvg(scale.map((t) => ({ pos: pc(root) + degreeSemitones(parseDegree(t)), color: degreeColor(parseDegree(t)), label: t })))}
</div>
<h2>The degrees of ${esc(key)}</h2>
<table><thead><tr><th>Degree</th><th>Note</th><th>Interval</th></tr></thead><tbody>${rows}</tbody></table>
<h2>Other keys</h2>
${chipList(KEYS.filter((k) => k !== key).map((k) => ({ href: `../${keySlug(k)}/`, html: `<b>${esc(k)}</b>` })))}
`;
  return {
    path,
    html: page({
      up,
      path,
      title: `Scale degrees in ${key}${ascii(key) !== key ? ` (${ascii(key)})` : ""} major, every one spelled · Improvy`,
      description: `Every scale degree of ${key} major, from the ♭2 to the 13: the ${key} major scale, the chromatic degrees and the jazz extensions, spelled correctly, on a keyboard.`,
      crumbs: [
        { name: "Degrees", path: "degrees/" },
        { name: key, path },
      ],
      body,
    }),
  };
}

function indexPage() {
  const up = "../";
  const path = "degrees/";
  const blocks = KEYS.map((k) => {
    const root = parseNote(k);
    return `<h2><a href="${keySlug(k)}/">${esc(k)}</a></h2>${chipList(
      DEGREES.map((d) => ({ href: `${keySlug(k)}/${d.slug}/`, html: `${esc(d.token)} → <b>${esc(noteName(spelled(root, d.token)))}</b>` }))
    )}`;
  }).join("");
  const body = `
<span class="eyebrow">Scale degree finder</span>
<h1>Every degree,<br><em>every key.</em></h1>
<p class="lead">The ♭7 of E♭, the ♯11 of D, the 13 of B♭: pick a key and a degree to see the note, why it is spelled that way, and where you meet it.</p>
${blocks}
`;
  return {
    path,
    html: page({
      up,
      path,
      title: "Scale degree finder: every degree in all 12 keys · Improvy",
      description: "Find any scale degree in any key: the 3, the ♭7, the ♯11, the 13 in all 12 major keys, spelled correctly and shown on a keyboard.",
      crumbs: [{ name: "Degrees", path }],
      body,
    }),
  };
}

/** Every page, for the sitemap and for the build. */
export function allPages() {
  const out = [indexPage()];
  for (const key of KEYS) {
    out.push(keyPage(key));
    for (const d of DEGREES) out.push(degreePage(key, d));
  }
  return out;
}

function sitemap(paths: string[]) {
  const urls = ["", ...paths]
    .map(
      (p) =>
        `  <url>\n    <loc>${SITE}${p}</loc>\n    <changefreq>${p === "" ? "weekly" : "monthly"}</changefreq>\n    <priority>${p === "" ? "1.0" : p === "degrees/" ? "0.8" : "0.6"}</priority>\n  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Written by tools/degree-pages.ts at build time: the home page, and the
     static page for every degree in every key. The home page's sections
     (#pro, #quiz, #teachers…) are hash fragments, not URLs to a crawler. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function degreePages(): Plugin {
  return {
    name: "improvy-degree-pages",
    apply: "build",
    generateBundle() {
      const pages = allPages();
      for (const p of pages) this.emitFile({ type: "asset", fileName: `${p.path}index.html`, source: p.html });
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap(pages.map((p) => p.path)) });
    },
  };
}
