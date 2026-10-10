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
 * Keys lit on a keyboard drawn from the C at or below the lowest one. Each
 * mark is a position in semitones from that C, a colour and a label.
 */
function keyboardSvg(marks: { pos: number; color: string; label: string }[]) {
  const W = 36;
  const H = 150;
  const BW = 22;
  const BH = 92;
  const top = Math.max(...marks.map((m) => m.pos));
  const octaves = Math.max(1, Math.ceil((top + 1) / 12));
  const width = octaves * 7 * W;
  const markAt = (pos: number) => marks.find((m) => m.pos === pos);
  let whites = "";
  let blacks = "";
  for (let o = 0; o < octaves; o++) {
    for (let p = 0; p < 12; p++) {
      const pos = o * 12 + p;
      const m = markAt(pos);
      if (p in WHITE_OF_PC) {
        const x = (o * 7 + WHITE_OF_PC[p]) * W;
        whites += `<rect x="${x + 1}" y="1" width="${W - 2}" height="${H - 2}" rx="5" fill="${m ? m.color : "#f4f4f5"}"/>`;
        if (m) whites += `<text x="${x + W / 2}" y="${H - 14}" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">${esc(m.label)}</text>`;
      } else {
        const x = (o * 7 + BLACK_AFTER[p] + 1) * W - BW / 2;
        blacks += `<rect x="${x}" y="1" width="${BW}" height="${BH}" rx="4" fill="${m ? m.color : "#18181b"}" stroke="rgba(255,255,255,.12)"/>`;
        if (m) blacks += `<text x="${x + BW / 2}" y="${BH - 12}" text-anchor="middle" font-size="10" font-weight="800" fill="#fff">${esc(m.label)}</text>`;
      }
    }
  }
  return `<svg viewBox="0 0 ${width} ${H}" width="100%" role="img" aria-hidden="true" style="max-width:${width}px;display:block;margin:0 auto">${whites}${blacks}</svg>`;
}

// ── The page around it ───────────────────────────────────────────────────────

const CSS = `
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:#06030c;color:#d4d4db;font-family:"Plus Jakarta Sans",system-ui,-apple-system,sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:#e5a93c;text-decoration:none}a:hover{text-decoration:underline}
.wrap{max-width:760px;margin:0 auto;padding:24px 16px 64px}
.top{display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:13px}
.brand{font-weight:800;font-style:italic;font-size:20px;color:#fff}
.crumbs{margin-top:32px;font-size:12px;color:#71717a}
.crumbs a{color:#a1a1aa}
h1{color:#fff;font-size:clamp(30px,7vw,48px);line-height:1.1;letter-spacing:-.02em;margin:10px 0 12px}
.lead{font-size:18px;color:#a1a1aa;margin:0}
.lead b{color:#fff}
.kb{margin:28px 0 8px;padding:18px;border:1px solid rgba(255,255,255,.07);border-radius:20px;background:rgba(255,255,255,.02)}
.legend{display:flex;flex-wrap:wrap;gap:8px 18px;justify-content:center;margin-top:12px;font-size:13px;color:#a1a1aa}
.dot{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:6px;vertical-align:middle}
h2{color:#fff;font-size:22px;line-height:1.25;margin:40px 0 10px}
p{margin:10px 0}
.tones{font-size:18px;color:#fff;font-weight:700;letter-spacing:.02em}
table{width:100%;border-collapse:collapse;font-size:15px}
th,td{padding:9px 10px;border-bottom:1px solid rgba(255,255,255,.06);text-align:left}
th{font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#71717a;font-weight:800}
td a{font-weight:700}
tr.here td{background:rgba(229,169,60,.08)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px;margin-top:12px}
.chip{display:block;padding:9px 12px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.02);color:#d4d4db;font-size:14px}
.chip b{color:#fff}
.chip:hover{border-color:rgba(229,169,60,.5);text-decoration:none}
.cta{margin-top:48px;padding:24px;border-radius:24px;border:1px solid rgba(229,169,60,.25);background:rgba(229,169,60,.05)}
.cta h2{margin-top:0}
.btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}
.btn{display:inline-block;padding:12px 18px;border-radius:12px;background:#fff;color:#09090b;font-weight:800;font-size:12px;letter-spacing:.08em;text-transform:uppercase}
.btn.ghost{background:rgba(255,255,255,.04);color:#fff;border:1px solid rgba(255,255,255,.12)}
.btn:hover{text-decoration:none;opacity:.9}
footer{margin-top:56px;padding-top:20px;border-top:1px solid rgba(255,255,255,.06);font-size:12px;color:#71717a}
footer a{color:#a1a1aa;margin-right:14px}
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
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>
<style>${CSS}</style>
</head>
<body>
<div class="wrap">
<div class="top"><a class="brand" href="${opts.up}">Improvy</a><a href="${opts.up}#quiz">Take the 60-second test →</a></div>
<div class="crumbs">${crumbs
    .map((c, i) => (i === crumbs.length - 1 ? esc(c.name) : `<a href="${opts.up}${c.path}">${esc(c.name)}</a>`))
    .join(" › ")}</div>
${opts.body}
<div class="cta">
<h2>Name it before you can count it</h2>
<p>Improvy trains every degree in all 12 keys — the 3, the ♭7, the ♯11 — until you see the note without working it out. A few minutes a day. Free to start; Pro is one payment, never a subscription.</p>
<div class="btns"><a class="btn" href="${APP_STORE}">App Store</a><a class="btn" href="${PLAY_STORE}">Google Play</a><a class="btn ghost" href="${opts.up}#quiz">60-second test</a></div>
</div>
<footer><a href="${opts.up}">Improvy.app</a><a href="${opts.up}degrees/">Every degree in every key</a><a href="${opts.up}#teachers">For teachers</a><a href="${opts.up}#about">About</a></footer>
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
<h1>The ${esc(d.token)} of ${esc(key)} is ${esc(N)}</h1>
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
<h1>Every scale degree in ${esc(key)}</h1>
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
<h1>Every degree in every key</h1>
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
