/**
 * The music behind the "What's next" page: notes spelled the way a key spells
 * them, chords and scales written as degrees, and where each note sits on a
 * two-octave keyboard.
 *
 * Spelling works the way the app's own engine does (lib/utils/music_engine.dart):
 * a degree fixes the LETTER (a 3rd is two letters up, a 7th six) and the
 * semitones fix the accidental. So the 3rd of A♭ is C, not B♯, and the 7th of
 * C♯ in F♯ major is E♯, not F. Nothing here is a lookup table that could be
 * typed wrong in one key.
 */

export type Letter = "C" | "D" | "E" | "F" | "G" | "A" | "B";

const LETTERS: Letter[] = ["C", "D", "E", "F", "G", "A", "B"];
const NATURAL: Record<Letter, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
/** Semitones above the root for degrees 1–7 of the major scale. */
const MAJOR = [0, 2, 4, 5, 7, 9, 11];

export interface Note {
  letter: Letter;
  /** −2 … +2: double flat … double sharp. */
  acc: number;
}

const ACC_SYMBOL: Record<number, string> = { [-2]: "𝄫", [-1]: "♭", 0: "", 1: "♯", 2: "𝄪" };

export function noteName(n: Note): string {
  return n.letter + ACC_SYMBOL[n.acc];
}

export function parseNote(name: string): Note {
  const letter = name[0] as Letter;
  const rest = name.slice(1);
  const acc =
    rest === "♭" || rest === "b" ? -1 :
    rest === "♯" || rest === "#" ? 1 :
    rest === "𝄫" || rest === "bb" ? -2 :
    rest === "𝄪" || rest === "##" ? 2 : 0;
  return { letter, acc };
}

/** Pitch class, 0 = C. */
export function pc(n: Note): number {
  return (((NATURAL[n.letter] + n.acc) % 12) + 12) % 12;
}

/** A degree as written on a chart: an accidental and a number, "♭3", "9", "♯11". */
export interface Degree {
  num: number;
  acc: number;
}

export function parseDegree(token: string): Degree {
  let acc = 0;
  let i = 0;
  while (i < token.length) {
    const ch = token.slice(i, i + 2) === "𝄫" ? "𝄫" : token[i];
    if (ch === "♭" || ch === "b") acc -= 1;
    else if (ch === "♯" || ch === "#") acc += 1;
    else if (ch === "𝄫") acc -= 2;
    else break;
    i += ch.length;
  }
  return { num: Number(token.slice(i)), acc };
}

export function degreeLabel(d: Degree): string {
  return (ACC_SYMBOL[d.acc] ?? "") + d.num;
}

/** Semitones above the root, unfolded: the 9 is 14, not 2, so a voicing keeps its shape. */
export function degreeSemitones(d: Degree): number {
  const steps = d.num - 1;
  return MAJOR[steps % 7] + 12 * Math.floor(steps / 7) + d.acc;
}

/** The note that is [degree] above [root], spelled by letter. */
export function spell(root: Note, degree: Degree | string): Note {
  const d = typeof degree === "string" ? parseDegree(degree) : degree;
  const steps = (d.num - 1) % 7;
  const letter = LETTERS[(LETTERS.indexOf(root.letter) + steps) % 7];
  const target = (pc(root) + MAJOR[steps] + d.acc + 120) % 12;
  // The accidental that takes this letter to the target pitch, folded into −6…+5.
  let acc = ((target - NATURAL[letter]) % 12 + 12) % 12;
  if (acc > 6) acc -= 12;
  return { letter, acc };
}

/** Which degree [note] is, counted from [root]: the inverse of [spell], 1–7. */
export function degreeOf(note: Note, root: Note): Degree {
  const steps = (LETTERS.indexOf(note.letter) - LETTERS.indexOf(root.letter) + 7) % 7;
  let acc = ((pc(note) - pc(root) - MAJOR[steps]) % 12 + 12) % 12;
  if (acc > 6) acc -= 12;
  return { num: steps + 1, acc };
}

// ── Keys ────────────────────────────────────────────────────────────────────

/** The twelve major keys, spelled the way the app spells them. */
export const KEYS = ["C", "G", "D", "A", "E", "B", "F♯", "D♭", "A♭", "E♭", "B♭", "F"] as const;
export type KeyName = (typeof KEYS)[number];

/** Round the circle of fourths: C, F, B♭ … — the way jazz standards modulate. */
export const KEYS_BY_FOURTHS: KeyName[] = ["C", "F", "B♭", "E♭", "A♭", "D♭", "F♯", "B", "E", "A", "D", "G"];

// ── Chords ──────────────────────────────────────────────────────────────────

export type Quality = "maj7" | "7" | "m7" | "m7♭5";

export const QUALITIES: Record<Quality, { symbol: string; name: string; degrees: string[] }> = {
  maj7: { symbol: "maj7", name: "major seventh", degrees: ["1", "3", "5", "7"] },
  "7": { symbol: "7", name: "dominant seventh", degrees: ["1", "3", "5", "♭7"] },
  m7: { symbol: "m7", name: "minor seventh", degrees: ["1", "♭3", "5", "♭7"] },
  "m7♭5": { symbol: "ø7", name: "half-diminished", degrees: ["1", "♭3", "♭5", "♭7"] },
};

/** A note of a chord or a scale, numbered two ways. */
export interface Tone {
  note: Note;
  /** Counted from the chord's or the scale's own root. */
  ownDegree: Degree;
  /** Counted from the key's tonic. */
  keyDegree: Degree;
  /** 0–23 on a keyboard that starts at the C below the root. */
  position: number;
}

export interface Chord {
  root: Note;
  quality: Quality;
  symbol: string;
  tones: Tone[];
}

function tone(root: Note, token: string, key: Note): Tone {
  const ownDegree = parseDegree(token);
  const note = spell(root, ownDegree);
  return { note, ownDegree, keyDegree: degreeOf(note, key), position: pc(root) + degreeSemitones(ownDegree) };
}

export function chordSymbol(root: Note, quality: Quality): string {
  return noteName(root) + QUALITIES[quality].symbol;
}

/** A chord in root position, its root in the lower octave of a two-octave keyboard. */
export function buildChord(root: Note, quality: Quality, key: Note): Chord {
  const tones = QUALITIES[quality].degrees.map((token) => tone(root, token, key));
  return { root, quality, symbol: chordSymbol(root, quality), tones };
}

/** The seventh chord on each degree of a major key: Imaj7, ii7, iii7, IVmaj7, V7, vi7, viiø7. */
const CHORD_ON: Quality[] = ["maj7", "m7", "m7", "maj7", "7", "m7", "m7♭5"];

/** The chord built on [degree] (1–7) of [keyName] major, from the key's own notes. */
export function chordOnDegree(keyName: KeyName, degree: number): Chord {
  const key = parseNote(keyName);
  return buildChord(spell(key, String(degree)), CHORD_ON[degree - 1], key);
}

// ── Scales ──────────────────────────────────────────────────────────────────

export interface Mode {
  name: string;
  degrees: string[];
  /** One line on what gives the mode its colour. */
  character: string;
  /** 0 brightest … 6 darkest: how many degrees are lowered against Lydian. */
  darkness: number;
}

/** The seven modes of the major scale, brightest first. */
export const MODES: Mode[] = [
  { name: "Lydian", degrees: ["1", "2", "3", "♯4", "5", "6", "7"], character: "Major, with a ♯4 that floats", darkness: 0 },
  { name: "Ionian", degrees: ["1", "2", "3", "4", "5", "6", "7"], character: "The major scale itself", darkness: 1 },
  { name: "Mixolydian", degrees: ["1", "2", "3", "4", "5", "6", "♭7"], character: "Major, with the ♭7 of a dominant", darkness: 2 },
  { name: "Dorian", degrees: ["1", "2", "♭3", "4", "5", "6", "♭7"], character: "Minor, with a bright natural 6", darkness: 3 },
  { name: "Aeolian", degrees: ["1", "2", "♭3", "4", "5", "♭6", "♭7"], character: "The natural minor scale", darkness: 4 },
  { name: "Phrygian", degrees: ["1", "♭2", "♭3", "4", "5", "♭6", "♭7"], character: "Minor, with a dark ♭2", darkness: 5 },
  { name: "Locrian", degrees: ["1", "♭2", "♭3", "4", "♭5", "♭6", "♭7"], character: "The ♭5 that never settles", darkness: 6 },
];

export interface Scale {
  root: Note;
  mode: Mode;
  /** "D Dorian". */
  symbol: string;
  /** Root to root: seven notes and the octave on top. */
  tones: Tone[];
}

export function buildScale(root: Note, mode: Mode, key: Note): Scale {
  const tones = mode.degrees.map((token) => tone(root, token, key));
  tones.push({ ...tones[0], position: tones[0].position + 12 });
  return { root, mode, symbol: `${noteName(root)} ${mode.name}`, tones };
}

/** The mode that starts on each degree of a major key. */
const MODE_ON = ["Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Aeolian", "Locrian"];

/** The scale that starts on [degree] (1–7) of [keyName] major: the key's own notes, from there. */
export function scaleOnDegree(keyName: KeyName, degree: number): Scale {
  const key = parseNote(keyName);
  const mode = MODES.find((m) => m.name === MODE_ON[degree - 1])!;
  return buildScale(spell(key, String(degree)), mode, key);
}

// ── Colour ──────────────────────────────────────────────────────────────────

/**
 * One colour per semitone above the reference, the palette of the app's Stats
 * screen: a spectrum from the root (red) to the 7 (fuchsia). Because it is
 * tied to the degree and not to the letter, a chord keeps its colours in
 * every key — which is the whole point.
 */
const SPECTRUM = [
  "#EF4444", // 1
  "#F97316", // ♭2
  "#F59E0B", // 2
  "#EAB308", // ♭3 / ♯2
  "#84CC16", // 3
  "#22C55E", // 4
  "#10B981", // ♯4 / ♭5
  "#06B6D4", // 5
  "#3B82F6", // ♯5 / ♭6
  "#6366F1", // 6
  "#8B5CF6", // ♭7
  "#D946EF", // 7
];

export function degreeColor(d: Degree): string {
  return SPECTRUM[((degreeSemitones(d) % 12) + 12) % 12];
}

/** The same colour lifted towards white, for text on the dark page. */
export function degreeInk(d: Degree): string {
  const hex = degreeColor(d).slice(1);
  const mix = (i: number) =>
    Math.round(parseInt(hex.slice(i, i + 2), 16) * 0.7 + 255 * 0.3)
      .toString(16)
      .padStart(2, "0");
  return `#${mix(0)}${mix(2)}${mix(4)}`;
}

/** Black keys of an octave, by semitone. */
export const BLACK = new Set([1, 3, 6, 8, 10]);
