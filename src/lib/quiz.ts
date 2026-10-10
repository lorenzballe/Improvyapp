import { KEYS, parseNote, spell, pc, noteName, parseDegree, degreeColor, type KeyName, type Note } from "./harmony";

/**
 * The questions the site asks: "the ♭7 of E♭?", answered on a keyboard.
 *
 * The degrees are the ones the free app trains — the major scale and the five
 * chromatic notes between — and the keys are the app's twelve, spelled the
 * way it spells them. The answer is spelled by letter like everywhere else in
 * Improvy (the ♭7 of E♭ is D♭, never C♯), but a tap on the keyboard is a
 * pitch: any key that sounds the note is right.
 */
const DIATONIC = ["2", "3", "4", "5", "6", "7"];
const CHROMATIC = ["♭2", "♭3", "♯4", "♭6", "♭7"];

export interface Question {
  key: KeyName;
  /** As written on a chart: "♭7". */
  degree: string;
  /** Spelled by letter: D♭. */
  answer: Note;
  /** Which of the twelve keys sounds it, 0 = C. */
  answerPc: number;
}

/** A question, never the one just asked. Mostly the scale, now and then a chromatic note. */
export function nextQuestion(previous?: Question | null, rand: () => number = Math.random): Question {
  for (;;) {
    const key = KEYS[Math.floor(rand() * KEYS.length)];
    const pool = rand() < 0.7 ? DIATONIC : CHROMATIC;
    const degree = pool[Math.floor(rand() * pool.length)];
    if (previous && previous.key === key && previous.degree === degree) continue;
    const answer = spell(parseNote(key), degree);
    // A double flat is right — the ♭6 of D♭ is B𝄫 — but a stranger's first
    // minute with Improvy is not the place to meet one.
    if (Math.abs(answer.acc) > 1) continue;
    return { key, degree, answer, answerPc: pc(answer) };
  }
}

export function answerName(q: Question): string {
  return noteName(q.answer);
}

/** The degree's colour in the app: the same spectrum, the same key. */
export function questionColor(q: Question): string {
  return degreeColor(parseDegree(q.degree));
}

/** Every degree the test can ask, in every key, with its answer: for the tests. */
export function allQuestions(): Question[] {
  const out: Question[] = [];
  for (const key of KEYS) {
    for (const degree of [...DIATONIC, ...CHROMATIC]) {
      const answer = spell(parseNote(key), degree);
      if (Math.abs(answer.acc) > 1) continue;
      out.push({ key, degree, answer, answerPc: pc(answer) });
    }
  }
  return out;
}
