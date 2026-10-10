import { useCallback, useEffect, useRef, useState } from "react";
import { nextQuestion, randomKey, type Question } from "../../lib/quiz";
import type { KeyName } from "../../lib/harmony";

/** How long an answer stays lit before the next question: the app's own timings. */
const SHOW_RIGHT_MS = 380;
const SHOW_WRONG_MS = 1800;

export interface Feedback {
  right: boolean;
  /** The key that was tapped, 0 = C. */
  picked: number;
}

export interface TrainerResult {
  correct: number;
  answered: number;
  /** Mean time to an answer, in ms; null with none given. */
  avgMs: number | null;
  bestStreak: number;
  /** Right or wrong, answer by answer: the ring on the result card. */
  marks: boolean[];
  missed: Question[];
}

export type Phase = "ready" | "run" | "done";

/**
 * One trainer run, as the app plays it: a question, a tap, the answer lit for
 * a moment, the next question.
 *
 *  - With [length]: a session of that many questions in one key, like the
 *    app's — it starts at once.
 *  - With [durationMs]: a run against the clock in every key, like the Daily
 *    Challenge — it waits for start().
 */
export function useTrainer(opts: { length?: number; durationMs?: number; onFinish?: (r: TrainerResult) => void }) {
  const timed = opts.durationMs !== undefined;
  const [sessionKey, setSessionKey] = useState<KeyName>(() => randomKey());
  const [question, setQuestion] = useState<Question>(() => nextQuestion(null, timed ? undefined : sessionKey));
  const [phase, setPhase] = useState<Phase>(timed ? "ready" : "run");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [streak, setStreak] = useState(0);
  const [leftMs, setLeftMs] = useState(opts.durationMs ?? 0);
  const [result, setResult] = useState<TrainerResult | null>(null);

  const phaseRef = useRef<Phase>(phase);
  const startedAt = useRef(0);
  const askedAt = useRef(0);
  const times = useRef<number[]>([]);
  const marks = useRef<boolean[]>([]);
  const missed = useRef<Question[]>([]);
  const counts = useRef({ correct: 0, answered: 0, streak: 0, best: 0 });
  const nextTimer = useRef<number | null>(null);
  const onFinish = useRef(opts.onFinish);
  onFinish.current = opts.onFinish;

  const finish = useCallback(() => {
    if (phaseRef.current !== "run") return;
    phaseRef.current = "done";
    if (nextTimer.current) window.clearTimeout(nextTimer.current);
    const t = times.current;
    const r: TrainerResult = {
      correct: counts.current.correct,
      answered: counts.current.answered,
      avgMs: t.length ? t.reduce((a, b) => a + b, 0) / t.length : null,
      bestStreak: counts.current.best,
      marks: [...marks.current],
      missed: [...missed.current],
    };
    setResult(r);
    setFeedback(null);
    setPhase("done");
    onFinish.current?.(r);
  }, []);

  /** A fresh run: a new key for a session, the clock reset for a timed one. */
  const start = useCallback(() => {
    if (nextTimer.current) window.clearTimeout(nextTimer.current);
    times.current = [];
    marks.current = [];
    missed.current = [];
    counts.current = { correct: 0, answered: 0, streak: 0, best: 0 };
    setCorrect(0);
    setAnswered(0);
    setStreak(0);
    setFeedback(null);
    setResult(null);
    setLeftMs(opts.durationMs ?? 0);
    const key = timed ? undefined : randomKey();
    if (key) setSessionKey(key);
    setQuestion((prev) => nextQuestion(prev, key));
    phaseRef.current = "run";
    setPhase("run");
    startedAt.current = performance.now();
    askedAt.current = startedAt.current;
  }, [opts.durationMs, timed]);

  /** Stops a run where it stands, with no result: the app's ✕ before the end. */
  const abort = useCallback(() => {
    if (nextTimer.current) window.clearTimeout(nextTimer.current);
    phaseRef.current = timed ? "ready" : "run";
    setFeedback(null);
    setPhase(timed ? "ready" : "run");
    setLeftMs(opts.durationMs ?? 0);
  }, [opts.durationMs, timed]);

  // A session starts on the page; its clock starts with the first question.
  useEffect(() => {
    askedAt.current = performance.now();
  }, []);

  // The clock of a timed run: a tick every tenth of a second, the end exactly on time.
  useEffect(() => {
    if (!timed || phase !== "run") return;
    const id = window.setInterval(() => {
      const left = (opts.durationMs ?? 0) - (performance.now() - startedAt.current);
      if (left <= 0) {
        setLeftMs(0);
        finish();
      } else setLeftMs(left);
    }, 100);
    return () => window.clearInterval(id);
  }, [timed, phase, opts.durationMs, finish]);

  useEffect(
    () => () => {
      if (nextTimer.current) window.clearTimeout(nextTimer.current);
    },
    []
  );

  const pick = useCallback(
    (pitch: number) => {
      if (phaseRef.current !== "run" || feedback) return;
      const right = pitch === question.answerPc;
      const c = counts.current;
      c.answered += 1;
      times.current.push(performance.now() - askedAt.current);
      marks.current.push(right);
      if (right) {
        c.correct += 1;
        c.streak += 1;
        c.best = Math.max(c.best, c.streak);
      } else {
        c.streak = 0;
        missed.current.push(question);
      }
      setAnswered(c.answered);
      setCorrect(c.correct);
      setStreak(c.streak);
      setFeedback({ right, picked: pitch });
      nextTimer.current = window.setTimeout(
        () => {
          if (phaseRef.current !== "run") return;
          if (!timed && opts.length && c.answered >= opts.length) {
            finish();
            return;
          }
          setFeedback(null);
          setQuestion((prev) => nextQuestion(prev, timed ? undefined : prev.key));
          askedAt.current = performance.now();
        },
        right ? SHOW_RIGHT_MS : SHOW_WRONG_MS
      );
    },
    [feedback, question, timed, opts.length, finish]
  );

  return {
    phase,
    question,
    sessionKey,
    feedback,
    correct,
    answered,
    streak,
    leftMs,
    result,
    start,
    abort,
    pick,
  };
}
