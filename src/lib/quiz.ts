import { KEYS, parseNote, spell, pc, noteName, type KeyName } from "./harmony";

/**
 * The questions the site asks, the way the app's Diatonic mode asks them: a
 * key, a degree from 1 to 7, and the note found on the keyboard — whose keys
 * are lit and named for that key's scale, as on the phone.
 *
 * The answer is spelled by letter like everywhere else in Improvy (the 7 of
 * F♯ is E♯, never F), but a tap on the keyboard is a pitch: the key that
 * sounds it is right.
 */
const DEGREES = ["1", "2", "3", "4", "5", "6", "7"];

export interface Question {
  key: KeyName;
  /** "1" … "7". */
  degree: string;
  /** Spelled by letter: "E♯". */
  answer: string;
  /** Which of the twelve keys sounds it, 0 = C. */
  answerPc: number;
  /** The key's seven notes by pitch: the keys lit on the keyboard, and their names. */
  scale: Record<number, string>;
}

export function scaleOf(key: KeyName): Record<number, string> {
  const root = parseNote(key);
  const out: Record<number, string> = {};
  for (const d of DEGREES) {
    const n = spell(root, d);
    out[pc(n)] = noteName(n);
  }
  return out;
}

function ask(key: KeyName, degree: string): Question {
  const n = spell(parseNote(key), degree);
  return { key, degree, answer: noteName(n), answerPc: pc(n), scale: scaleOf(key) };
}

/** A random key, as the app picks one for a session. */
export function randomKey(rand: () => number = Math.random): KeyName {
  return KEYS[Math.floor(rand() * KEYS.length)];
}

/**
 * The next question in [key] — or, without one, in any key — never the one
 * just asked. The root comes up half as often as the other degrees: it is
 * the one nobody needs to practise.
 */
export function nextQuestion(previous?: Question | null, key?: KeyName, rand: () => number = Math.random): Question {
  for (;;) {
    const k = key ?? randomKey(rand);
    const degree = rand() < 0.07 ? "1" : DEGREES[1 + Math.floor(rand() * 6)];
    if (previous && previous.key === k && previous.degree === degree) continue;
    return ask(k, degree);
  }
}

/** Every question the site can ask: for the tests. */
export function allQuestions(): Question[] {
  return KEYS.flatMap((k) => DEGREES.map((d) => ask(k, d)));
}
