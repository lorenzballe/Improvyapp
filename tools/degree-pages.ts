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

/**
 * The stylesheet the React site is drawn with, as the build named it. Every
 * static page links the same file and uses the same classes for its header,
 * background, buttons and footer, so a page here and a page there are one
 * site, not two that look alike (src/index.css scans this file for them).
 */
let STYLESHEET = "assets/index.css";

const ARROW_LEFT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5 text-rose-500 transition-transform group-hover:-translate-x-0.5" aria-hidden="true"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`;
const APPLE_LOGO = `<svg class="fill-current shrink-0 w-7 h-7 text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 1.15-3.27 1.2-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5 1.07 3.29 1.07.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.02.07-.43 1.44-1.38 2.82M15.97 4.17c.66-.8 1.1-1.89 1.08-3.17-.91.04-2.01.6-2.67 1.38-.56.66-1.05 1.76-.9 3.01 1.05.08 2.06-.51 2.49-1.22z"/></svg>`;
const PLAY_LOGO = `<svg class="shrink-0 w-7 h-7 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M3.25 1.75C3.06 1.93 2.95 2.22 2.95 2.6V21.4C2.95 21.78 3.06 22.07 3.25 22.25L3.32 22.32L13.84 11.8V11.53L3.32 1.01L3.25 1.75Z" fill="#00A0FF"/><path d="M17.34 15.33L13.84 11.82V11.51L17.34 8L17.42 8.04L21.57 10.4C22.75 11.07 22.75 12.26 21.57 12.93L17.42 15.29L17.34 15.33Z" fill="#FFE000"/><path d="M13.84 11.66L3.25 22.25C3.59 22.59 4.19 22.61 4.88 22.22L17.34 15.14L13.84 11.66Z" fill="#FF2C00"/><path d="M13.84 11.66L17.34 8.18L4.88 1.1C4.19 0.71 3.59 0.73 3.25 1.07L13.84 11.66Z" fill="#00E676"/></svg>`;

/** The two store badges, as StoreBadges draws them. */
function storeBadges(className = "") {
  const base =
    "flex items-center gap-4 bg-zinc-900 border border-white/10 text-white rounded-2xl transition-all duration-300 active:scale-95 cursor-pointer shadow-lg group relative overflow-hidden focus:outline-none focus:ring-0 px-6 py-4 w-full sm:w-[220px]";
  const shine =
    `<span class="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"></span>`;
  const label = (small: string, big: string) =>
    `<div class="flex flex-col items-start leading-none text-left"><span class="text-[10.5px] text-zinc-500 font-sans tracking-[0.12em] font-bold uppercase mb-1 whitespace-nowrap">${small}</span><span class="text-base font-sans font-bold text-white">${big}</span></div>`;
  return `<div class="flex flex-wrap gap-4 ${className}">
<a href="${APP_STORE}" target="_blank" rel="noopener noreferrer" aria-label="Download Improvy on the App Store" class="${base} hover:border-[#e5a93c]/50 hover:shadow-[0_0_20px_rgba(229,169,60,0.15)]">${shine}${APPLE_LOGO}${label("Download on the", "App Store")}</a>
<a href="${PLAY_STORE}" target="_blank" rel="noopener noreferrer" aria-label="Get Improvy on Google Play" class="${base} hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]">${shine}${PLAY_LOGO}${label("Get it on", "Google Play")}</a>
</div>`;
}

/** The floating header of every page but the home page, link for button. */
function header(up: string) {
  const item =
    "hover:text-white text-[8.5px] sm:text-[10.5px] font-sans font-extrabold uppercase tracking-[0.10em] sm:tracking-[0.18em] transition-colors duration-200 cursor-pointer focus:outline-none";
  return `<header class="fixed top-0 inset-x-0 z-50 w-full bg-gradient-to-b from-[#07040f] via-[#07040f]/80 to-transparent px-4 sm:px-6 pt-4 pb-7 flex justify-center transition-all duration-500 ease-out transform opacity-100 translate-y-0 pointer-events-auto">
<nav aria-label="Main" class="w-auto max-w-[95vw] bg-[#07040f]/85 backdrop-blur-xl border border-white/[0.08] py-1.5 px-2.5 sm:py-2.5 sm:px-6 rounded-full shadow-[0_16px_50px_rgba(7,4,15,0.7)] flex items-center justify-center gap-2 sm:gap-7">
<a href="${up}" class="hover:text-white flex items-center gap-1.5 text-[8.5px] sm:text-[10.5px] font-sans font-extrabold uppercase tracking-[0.10em] sm:tracking-[0.18em] text-zinc-350 transition-colors duration-200 cursor-pointer focus:outline-none"><span>HOME</span></a>
<a href="${up}#method" class="${item} text-zinc-400">Method</a>
<a href="${up}#faq" class="${item} text-zinc-400">FAQ</a>
<div class="relative group/btn p-[1.5px] rounded-xl bg-gradient-to-r from-rose-500/50 via-purple-500/50 to-[#e5a93c]/60 hover:from-rose-500 hover:via-purple-500 hover:to-[#e5a93c] bg-[length:200%_auto] animate-rainbow-shift transition-all duration-500">
<div class="absolute -inset-[3px] rounded-xl bg-gradient-to-r from-rose-500 via-purple-500 to-[#e5a93c] opacity-0 group-hover/btn:opacity-60 blur-[8px] transition-all duration-500 bg-[length:200%_auto] group-hover/btn:animate-rainbow-shift"></div>
<a href="${up}#pro" class="relative block px-2 py-1 sm:px-4 sm:py-2 rounded-[11px] text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all duration-350 active:scale-95 cursor-pointer whitespace-nowrap focus:outline-none bg-white text-zinc-950 hover:bg-transparent hover:text-white"><span class="inline sm:hidden">Improvy Pro</span><span class="hidden sm:inline">Get Improvy Pro</span></a>
</div>
</nav>
</header>`;
}

/** The site's footer, as App.tsx draws it; [current] is lit like a page there. */
function footer(up: string, current: "degrees" | "app" | null) {
  const link = "hover:text-white transition-colors duration-200 cursor-pointer text-left focus:outline-none";
  const here = (on: boolean) => (on ? " text-[#e5a93c]" : "");
  return `<footer class="border-t border-white/5 pt-10 pb-6 md:pt-12 md:pb-8 px-6 md:px-12 relative z-30 bg-[#07040f]/95 backdrop-blur-xl overflow-hidden mt-8 w-full">
<div class="absolute top-0 right-1/4 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
<div class="absolute bottom-0 left-10 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>
<div class="max-w-7xl mx-auto font-sans text-zinc-400">
<div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-left mb-0">
<div class="col-span-2 md:col-span-1 flex flex-col gap-3">
<div><a href="${up}" class="flex items-center gap-2.5"><img src="${up}images/improvy-app-icon.png" alt="Improvy logo" width="512" height="512" loading="lazy" decoding="async" class="h-8 w-8 rounded-[22%] border border-white/10"><span class="font-display text-xl sm:text-2xl font-black text-white italic tracking-tight">Improvy</span></a></div>
<p class="text-xs text-zinc-400 leading-relaxed font-light">Train your mind to see every note before you play it. Instant scale-degree mastery across all 12 keys for real musical fluency.</p>
</div>
<div class="flex flex-col gap-3.5">
<h4 class="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#e5a93c]">Explore</h4>
<div class="flex flex-col gap-2 text-xs font-medium text-zinc-400 font-normal">
<a href="${up}" class="${link}">Home</a>
<a href="${up}#method" class="${link}">The Method</a>
<a href="${up}#pricing" class="${link}">Pricing</a>
<a href="${up}#pro" class="${link}">Get Improvy Pro</a>
<a href="${up}#quiz" class="${link}">60-second test</a>
<a href="${up}degrees/" class="${link}${here(current === "degrees")}">Degree finder</a>
<a href="${up}app/" class="${link}${here(current === "app")}">The app &amp; screenshots</a>
<a href="${up}#teachers" class="${link}">For teachers</a>
</div>
</div>
<div class="flex flex-col gap-3.5">
<h4 class="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-rose-400">Company</h4>
<div class="flex flex-col gap-2 text-xs font-medium text-zinc-400">
<a href="${up}#about" class="${link}">About Us</a>
<a href="${up}#about" class="${link}">Affiliates</a>
<a href="${up}#feedback" class="${link}">Feedback</a>
</div>
</div>
<div class="flex flex-col gap-3.5">
<h4 class="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-indigo-400">Help &amp; Legal</h4>
<div class="flex flex-col gap-2 text-xs font-medium text-zinc-400">
<a href="${up}#about" class="${link}">Contact Us</a>
<a href="${up}#privacy" class="${link}">Privacy Policy</a>
<a href="${up}#terms" class="${link}">Terms of Service</a>
</div>
<div class="pt-6 mt-2 text-[11px] text-zinc-500 font-light"><p>© 2026 The Bale Company. All rights reserved.</p></div>
</div>
</div>
</div>
</footer>`;
}

/** BackgroundGradientAnimation's moving light, the same five blobs and the
 *  pointer that follows the mouse. */
const BLOBS = `<div id="blobs" style="mask-image:linear-gradient(to bottom, black 0%, black 45%, transparent 68%);-webkit-mask-image:linear-gradient(to bottom, black 0%, black 45%, transparent 68%)" class="absolute inset-0 pointer-events-none z-10 select-none overflow-hidden [filter:url(#blurMe)_blur(60px)] opacity-40">
<div class="absolute [background:radial-gradient(circle_at_center,_var(--first-color)_0,_var(--first-color)_50%)_no-repeat] [mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] [transform-origin:center_center] animate-first"></div>
<div class="absolute [background:radial-gradient(circle_at_center,_var(--second-color)_0,_var(--second-color)_50%)_no-repeat] [mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] animate-second"></div>
<div class="absolute [background:radial-gradient(circle_at_center,_var(--third-color)_0,_var(--third-color)_50%)_no-repeat] [mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] animate-third"></div>
<div class="absolute [background:radial-gradient(circle_at_center,_var(--fourth-color)_0,_var(--fourth-color)_50%)_no-repeat] [mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] animate-fourth"></div>
<div class="absolute [background:radial-gradient(circle_at_center,_var(--fifth-color)_0,_var(--fifth-color)_50%)_no-repeat] [mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] animate-fifth"></div>
<div id="pointer" class="absolute [background:radial-gradient(circle_at_center,_var(--pointer-color)_0,_var(--pointer-color)_50%)_no-repeat] [mix-blend-mode:var(--blending-value)] w-[400px] h-[400px] top-0 left-0 pointer-events-none opacity-60"></div>
</div>`;

/** The pointer's lag and colour, and Safari's lighter blur, as the component
 *  sets them. */
const BLOBS_SCRIPT = `<script>
(function () {
  var blobs = document.getElementById("blobs"), p = document.getElementById("pointer"), box = document.getElementById("bg");
  if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
    blobs.classList.remove("[filter:url(#blurMe)_blur(60px)]", "opacity-40");
    blobs.classList.add("blur-3xl", "opacity-30");
  }
  var C = [[59, 130, 246], [147, 51, 234], [234, 83, 88], [249, 115, 22], [247, 186, 43]];
  var x = 0, y = 0, tx = 0, ty = 0, mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
  box.addEventListener("mousemove", function (e) {
    var r = box.getBoundingClientRect();
    tx = e.clientX - r.left; ty = e.clientY - r.top; mx = e.clientX; my = e.clientY;
  });
  (function step() {
    x += (tx - x) / 11; y += (ty - y) / 11; cx += (mx - cx) / 11; cy += (my - cy) / 11;
    p.style.transform = "translate(" + Math.round(x - 200) + "px, " + Math.round(y - 200) + "px)";
    var s = Math.min(Math.max(cx / (innerWidth || 800), 0), 1) * 4, i = Math.floor(s), f = s - i, c;
    if (i >= 4) c = C[4];
    else {
      var a = C[i], b = C[i + 1], e = f * f * (3 - 2 * f);
      c = [0, 1, 2].map(function (k) { return Math.round(a[k] + (b[k] - a[k]) * e); });
    }
    p.style.setProperty("--pointer-color", "rgb(" + c.join(", ") + ")");
    requestAnimationFrame(step);
  })();
})();
</script>`;

function page(opts: {
  /** From this page back to the site root: "../../../". */
  up: string;
  path: string;
  title: string;
  description: string;
  crumbs: { name: string; path: string }[];
  body: string;
  /** Lit in the footer, as the React pages light theirs. */
  current: "degrees" | "app";
  /** The page's own picture for link previews; the site's card otherwise. */
  image?: { url: string; width: number; height: number; alt: string };
  /** The content's measure: a column of text, or the full width. */
  wide?: boolean;
  /** More structured data for the page, beside its breadcrumbs. */
  ld?: object[];
}) {
  const url = SITE + opts.path;
  const crumbs = [{ name: "Improvy", path: "" }, ...opts.crumbs];
  const breadcrumbs = {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: SITE + c.path })),
  };
  const ld = { "@context": "https://schema.org", "@graph": [breadcrumbs, ...(opts.ld ?? [])] };
  const image = opts.image ?? {
    url: `${SITE}og-image.png`,
    width: 1200,
    height: 630,
    alt: "Improvy — see every note as its scale degree, in all 12 keys",
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#06030c">
<title>${esc(opts.title)}</title>
<meta name="description" content="${esc(opts.description)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="Improvy">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(opts.title)}">
<meta property="og:description" content="${esc(opts.description)}">
<meta property="og:image" content="${image.url}">
<meta property="og:image:width" content="${image.width}">
<meta property="og:image:height" content="${image.height}">
<meta property="og:image:alt" content="${esc(image.alt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="apple-itunes-app" content="app-id=6775236759">
<link rel="icon" type="image/png" href="${opts.up}favicon.png">
<link rel="apple-touch-icon" href="${opts.up}apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Lexend:wght@400..900&display=swap">
<link rel="stylesheet" href="${opts.up}${STYLESHEET}">
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>
</head>
<body style="--gradient-background-start:rgb(6, 3, 12);--gradient-background-end:rgb(2, 1, 4);--first-color:rgb(67, 56, 202);--second-color:rgb(234, 83, 88);--third-color:rgb(247, 186, 43);--fourth-color:rgb(147, 51, 234);--fifth-color:rgb(59, 130, 246);--pointer-color:rgb(234, 83, 88);--size:60%;--blending-value:screen">
<div id="bg" class="min-h-screen w-full relative overflow-hidden bg-[linear-gradient(to_bottom,var(--gradient-background-start)_0%,var(--gradient-background-end)_55%,#000000_80%)]">
<svg class="hidden" aria-hidden="true"><defs><filter id="blurMe"><feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur"/><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo"/><feBlend in="SourceGraphic" in2="goo"/></filter></defs></svg>
<div class="relative z-20 w-full h-full">
<div class="w-full relative z-20 min-h-screen text-[#d4d4db] font-sans pb-0">
${header(opts.up)}
<main class="relative z-30 mx-auto w-full max-w-5xl px-4 pt-24 pb-16 md:pt-28 text-zinc-300 font-sans">
<div class="mb-10 text-left"><a href="${opts.up}" class="group inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-zinc-900/80 px-3.5 py-2 text-[10px] font-black uppercase tracking-widest text-rose-500 transition-all duration-200 hover:bg-zinc-800 hover:text-white active:scale-95 cursor-pointer">${ARROW_LEFT}<span>Return to Home</span></a></div>
${
  // The trail only where there is one to follow — a key, a degree in a key.
  // One step down, it would only repeat the page's own title.
  crumbs.length > 2
    ? `<nav aria-label="Breadcrumb" class="mb-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">${crumbs
        .map((c, i) =>
          i === crumbs.length - 1
            ? `<span class="text-zinc-400" aria-current="page">${esc(c.name)}</span>`
            : `<a href="${opts.up}${c.path}" class="hover:text-white transition-colors duration-200">${esc(c.name)}</a>`
        )
        .join(` <span aria-hidden="true">›</span> `)}</nav>`
    : ""
}
<div class="doc${opts.wide ? "" : " max-w-3xl"}">
${opts.body}
</div>
<section class="mt-20 rounded-[28px] border border-[#e5a93c]/25 bg-[#e5a93c]/[0.05] p-6 sm:p-10">
<p class="text-[11px] font-black uppercase tracking-[0.24em] text-[#e5a93c]">Free on iPhone and Android</p>
<h2 class="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Name it before<br><span class="italic font-normal font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#e5a93c] via-rose-500 to-purple-500 pr-2">you can count it.</span></h2>
<p class="mt-4 text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-2xl">Improvy trains every degree in all 12 keys — the 3, the ♭7, the ♯11 — until you see the note without working it out. A few minutes a day. Free to start; Pro is one payment, never a subscription.</p>
${storeBadges("mt-8")}
<a href="${opts.up}#quiz" class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#e5a93c] transition-colors duration-200">Or try the 60-second test in your browser <span aria-hidden="true">→</span></a>
</section>
</main>
${footer(opts.up, opts.current)}
</div>
</div>
${BLOBS}
</div>
${BLOBS_SCRIPT}
</body>
</html>
`;
}

function chipList(items: { href: string; html: string }[]) {
  return `<div class="chips">${items.map((i) => `<a class="chip" href="${i.href}">${i.html}</a>`).join("")}</div>`;
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
      current: "degrees",
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
      current: "degrees",
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
      current: "degrees",
      crumbs: [{ name: "Degrees", path }],
      body,
    }),
  };
}

/** The app's own pictures, under public/images: what an image search for
 *  "Improvy" should find — the icon and the store screenshots, each a named
 *  file with words that say what is in it. */
export const APP_IMAGES = [
  { file: "improvy-app-icon.png", w: 512, h: 512, alt: "Improvy app icon", name: "", text: "" },
  {
    file: "improvy-app-chromatic-scale-degree-trainer.jpg", w: 660, h: 1434,
    alt: "Improvy app: the chromatic scale-degree trainer",
    name: "The trainer",
    text: "A degree is asked — ♭3, ♯11, 13 — and you find its note in the key, against the clock.",
  },
  {
    file: "improvy-app-daily-challenge.jpg", w: 660, h: 1434,
    alt: "Improvy app: the Daily Challenge",
    name: "The Daily Challenge",
    text: "The same run for everyone, once a day, with a score to share and a streak to keep.",
  },
  {
    file: "improvy-app-progress-stats.jpg", w: 660, h: 1434,
    alt: "Improvy app: progress and statistics",
    name: "Stats",
    text: "Mastery in each of the 12 keys, your response time, and the degrees that still cost you.",
  },
  {
    file: "improvy-app-pocket-mode.jpg", w: 660, h: 1434,
    alt: "Improvy app: Pocket Mode, hands-free audio training",
    name: "Pocket Mode",
    text: "A voice asks, waits and answers — training on a walk, with the screen off.",
  },
  {
    file: "improvy-app-home-screen-widgets.jpg", w: 660, h: 1434,
    alt: "Improvy app: Home Screen widgets",
    name: "Widgets",
    text: "A question, the Daily Challenge and your weakest key, right on the Home Screen.",
  },
  {
    file: "improvy-app-banner.jpg", w: 1920, h: 823,
    alt: "Improvy — every note is a number: the scale degrees 1 to 7 on a keyboard",
    name: "",
    text: "",
  },
];

/** One of the app's pictures as Google's image metadata reads it: what it
 *  shows, and whose it is. */
export function imageObject(i: (typeof APP_IMAGES)[number]) {
  return {
    "@type": "ImageObject",
    contentUrl: `${SITE}images/${i.file}`,
    url: `${SITE}images/${i.file}`,
    name: i.name || i.alt,
    caption: i.alt,
    width: i.w,
    height: i.h,
    creator: { "@type": "Organization", name: "Improvy", url: SITE },
    creditText: "Improvy",
    copyrightNotice: "© 2026 The Bale Company",
  };
}

function appPage() {
  const up = "../";
  const path = "app/";
  const icon = APP_IMAGES[0];
  const shots = APP_IMAGES.filter((i) => i.name);
  const banner = APP_IMAGES[APP_IMAGES.length - 1];
  const body = `
<header class="text-left max-w-3xl">
<span class="eyebrow">The app</span>
<h1>Every note is a number.<br><em>Improvy, on your phone.</em></h1>
<p class="lead">Improvy is an app for iPhone and Android that trains you to see every note as its <b>scale degree</b> — the 3, the ♭7, the ♯11 — at once, in all 12 keys. For improvising, transposing and reading a chart without counting.</p>
</header>
<div class="mt-10 flex items-center gap-5">
<img src="${up}images/${icon.file}" width="${icon.w}" height="${icon.h}" alt="${esc(icon.alt)}" class="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-[22%] border border-white/[0.08] shadow-[0_18px_40px_-16px_rgba(0,0,0,0.9)]">
<div class="text-left">
<span class="block text-base sm:text-lg font-extrabold text-white tracking-tight">Improvy — Music Trainer</span>
<span class="mt-1 block text-sm text-zinc-400 font-light">Free to download. Pro is one payment, never a subscription.</span>
</div>
</div>
${storeBadges("mt-8")}
<h2>Screenshots</h2>
<p class="max-w-2xl">The five screens from the App Store and Google Play: the trainer, the Daily Challenge, the stats, Pocket Mode and the widgets.</p>
<div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">${shots
    .map(
      (i) => `<figure class="m-0">
<img src="${up}images/${i.file}" width="${i.w}" height="${i.h}" alt="${esc(i.alt)}" loading="lazy" decoding="async" class="block w-full h-auto rounded-[28px] border border-white/[0.06] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)]">
<figcaption class="mt-4 text-left"><span class="block text-base font-extrabold text-white tracking-tight">${esc(i.name)}</span><span class="mt-1 block text-sm text-zinc-400 font-light leading-relaxed">${esc(i.text)}</span></figcaption>
</figure>`
    )
    .join("\n")}</div>
<img src="${up}images/${banner.file}" width="${banner.w}" height="${banner.h}" alt="${esc(banner.alt)}" loading="lazy" decoding="async" class="mt-16 block w-full h-auto rounded-[28px] border border-white/[0.06]">
`;
  return {
    path,
    images: APP_IMAGES.map((i) => ({ loc: `${SITE}images/${i.file}`, title: i.alt })),
    html: page({
      up,
      path,
      title: "Improvy app — screenshots for iPhone and Android",
      description:
        "See the Improvy app: the scale-degree trainer, the Daily Challenge, stats, Pocket Mode and widgets. Free on the App Store and Google Play.",
      current: "app",
      wide: true,
      image: { url: `${SITE}images/${banner.file}`, width: banner.w, height: banner.h, alt: banner.alt },
      crumbs: [{ name: "The app", path }],
      ld: [
        {
          "@type": "ImageGallery",
          name: "Improvy app screenshots",
          url: SITE + path,
          primaryImageOfPage: imageObject(banner),
          image: APP_IMAGES.map(imageObject),
        },
      ],
      body,
    }),
  };
}

/** Every page, for the sitemap and for the build. */
export function allPages() {
  const out: { path: string; html: string; images?: { loc: string; title: string }[] }[] = [indexPage(), appPage()];
  for (const key of KEYS) {
    out.push(keyPage(key));
    for (const d of DEGREES) out.push(degreePage(key, d));
  }
  return out;
}

function sitemap(pages: { path: string; images?: { loc: string; title: string }[] }[], homeImages: string[]) {
  // Each page lists the pictures that are on it: Google ties an image to the
  // page that shows it. The home page shows the logo (in the footer) and the
  // app's home screen; the store screenshots are on app/.
  const home = { path: "", images: homeImages.map((loc) => ({ loc, title: "" })) };
  const urls = [home, ...pages]
    .map((p) => {
      const imgs = (p.images ?? [])
        .map((i) => `\n    <image:image>\n      <image:loc>${i.loc}</image:loc>\n    </image:image>`)
        .join("");
      return `  <url>\n    <loc>${SITE}${p.path}</loc>\n    <changefreq>${p.path === "" ? "weekly" : "monthly"}</changefreq>\n    <priority>${p.path === "" ? "1.0" : p.path === "degrees/" || p.path === "app/" ? "0.8" : "0.6"}</priority>${imgs}\n  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Written by tools/degree-pages.ts at build time: the home page, the app's
     page with its screenshots, and the static page for every degree in every
     key. The home page's sections (#pro, #quiz, #teachers…) are hash
     fragments, not URLs to a crawler. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>
`;
}

export function degreePages(): Plugin {
  return {
    name: "improvy-degree-pages",
    apply: "build",
    generateBundle(_options, bundle) {
      const css = Object.keys(bundle).find((f) => /^assets\/index-[\w-]+\.css$/.test(f));
      if (!css) this.error("the site's stylesheet is not in the bundle, and the static pages are drawn with it");
      STYLESHEET = css;
      const pages = allPages();
      for (const p of pages) this.emitFile({ type: "asset", fileName: `${p.path}index.html`, source: p.html });
      const hero = Object.keys(bundle).find((f) => /^assets\/method_home_progress-[\w-]+\.webp$/.test(f));
      if (!hero) this.error("the home page's screenshot is not in the bundle, and the sitemap lists it");
      const homeImages = [`${SITE}images/${APP_IMAGES[0].file}`, `${SITE}${hero}`];
      this.emitFile({ type: "asset", fileName: "sitemap.xml", source: sitemap(pages, homeImages) });
    },
  };
}
