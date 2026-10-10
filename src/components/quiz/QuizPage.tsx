import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Copy, RotateCcw, Share2, Timer } from "lucide-react";
import { MiniKeyboard } from "./MiniKeyboard";
import { DownloadFree } from "../StoreBadges";
import { nextQuestion, answerName, questionColor, type Question } from "../../lib/quiz";
import { track } from "../../lib/analytics";
import type { Platform } from "../../lib/platform";

const DURATION_MS = 60_000;
/** How long an answer stays on the keyboard before the next question. */
const SHOW_RIGHT_MS = 250;
const SHOW_WRONG_MS = 1000;

type Phase = "intro" | "run" | "done";

interface Result {
  correct: number;
  answered: number;
  /** Mean time to an answer, in ms; null with none given. */
  avgMs: number | null;
  missed: Question[];
}

/** What the score says, in the app's own terms. */
function verdict(r: Result): { title: string; text: string } {
  if (r.correct >= 30)
    return {
      title: "That is automatic.",
      text: "You think in numbers. Improvy keeps it that way in all 12 keys — and takes it on to the 9s, 11s and 13s.",
    };
  if (r.correct >= 15)
    return {
      title: "Fluent, with pauses.",
      text: "Most degrees come at once; some you still work out. Those pauses are exactly what Improvy trains away, a few minutes a day.",
    };
  return {
    title: "You count — everyone does at first.",
    text: "Counting up from the root works, but not at tempo. Improvy turns the counting into knowing: a few minutes a day, in all 12 keys.",
  };
}

const SHARE_URL = "https://improvy.app/#quiz";

/**
 * The 60-second scale-degree test: a key and a degree, the note on the
 * keyboard, as many as a minute allows. A taste of the app's own drill, with
 * a score worth sending to a bandmate.
 */
export default function QuizPage({ onBack, platform }: { onBack: () => void; platform: Platform }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [q, setQ] = useState<Question | null>(null);
  const [leftMs, setLeftMs] = useState(DURATION_MS);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [shown, setShown] = useState<{ picked: number; right: boolean } | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);

  const phaseRef = useRef<Phase>("intro");
  const startedAt = useRef(0);
  const askedAt = useRef(0);
  const answerTimes = useRef<number[]>([]);
  const missed = useRef<Question[]>([]);
  const counts = useRef({ correct: 0, answered: 0 });
  const nextTimer = useRef<number | null>(null);

  const finish = () => {
    if (phaseRef.current !== "run") return;
    phaseRef.current = "done";
    if (nextTimer.current) window.clearTimeout(nextTimer.current);
    const times = answerTimes.current;
    const r: Result = {
      correct: counts.current.correct,
      answered: counts.current.answered,
      avgMs: times.length ? times.reduce((a, b) => a + b, 0) / times.length : null,
      missed: missed.current,
    };
    setResult(r);
    setShown(null);
    setPhase("done");
    track("quiz_finished", {
      correct: r.correct,
      answered: r.answered,
      accuracy: r.answered ? Math.round((100 * r.correct) / r.answered) : 0,
      avg_ms: r.avgMs === null ? null : Math.round(r.avgMs),
    });
  };

  const start = () => {
    answerTimes.current = [];
    missed.current = [];
    counts.current = { correct: 0, answered: 0 };
    setCorrect(0);
    setAnswered(0);
    setShown(null);
    setResult(null);
    setCopied(false);
    setLeftMs(DURATION_MS);
    setQ(nextQuestion());
    phaseRef.current = "run";
    setPhase("run");
    startedAt.current = performance.now();
    askedAt.current = startedAt.current;
    track("quiz_started");
  };

  // The clock: one tick a tenth of a second, the end exactly at sixty.
  useEffect(() => {
    if (phase !== "run") return;
    const id = window.setInterval(() => {
      const left = DURATION_MS - (performance.now() - startedAt.current);
      if (left <= 0) {
        setLeftMs(0);
        finish();
      } else setLeftMs(left);
    }, 100);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => () => {
    if (nextTimer.current) window.clearTimeout(nextTimer.current);
  }, []);

  const pick = (pc: number) => {
    if (phaseRef.current !== "run" || !q || shown) return;
    const right = pc === q.answerPc;
    counts.current.answered += 1;
    setAnswered(counts.current.answered);
    answerTimes.current.push(performance.now() - askedAt.current);
    if (right) {
      counts.current.correct += 1;
      setCorrect(counts.current.correct);
    } else {
      missed.current.push(q);
    }
    setShown({ picked: pc, right });
    nextTimer.current = window.setTimeout(() => {
      if (phaseRef.current !== "run") return;
      setShown(null);
      setQ((prev) => nextQuestion(prev));
      askedAt.current = performance.now();
    }, right ? SHOW_RIGHT_MS : SHOW_WRONG_MS);
  };

  const shareText = (r: Result) => {
    const acc = r.answered ? Math.round((100 * r.correct) / r.answered) : 0;
    return `I named ${r.correct} scale degrees in 60 seconds on Improvy (${acc}% right). Your turn:`;
  };

  const share = async (r: Result) => {
    const text = shareText(r);
    track("quiz_shared", { correct: r.correct });
    if (navigator.share) {
      try {
        await navigator.share({ text, url: SHARE_URL });
        return;
      } catch {
        // Cancelled, or not allowed here: fall back to the clipboard.
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${SHARE_URL}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const color = q ? questionColor(q) : "#ffffff";
  const seconds = Math.ceil(leftMs / 1000);

  return (
    <div className="relative z-30 mx-auto w-full max-w-2xl px-4 pt-24 pb-16 md:pt-28 text-zinc-300 font-sans">
      <div className="mb-8 text-left">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-zinc-900/80 px-3.5 py-2 text-[10px] font-black uppercase tracking-widest text-rose-500 transition-all duration-200 hover:bg-zinc-800 hover:text-white active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-rose-500 transition-transform group-hover:-translate-x-0.5" />
          <span>Return to Home</span>
        </button>
      </div>

      {phase === "intro" && (
        <div className="text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#e5a93c]">The 60-second test</p>
          <h1 className="mt-4 font-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
            How many degrees can you name in a minute?
          </h1>
          <p className="mt-5 text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-lg mx-auto">
            A key and a degree — the 3 of A, the ♭7 of E♭ — and you tap the note on the keyboard. As many as you can in 60
            seconds. Then you see how fast you were, and what you missed.
          </p>
          <button
            onClick={start}
            className="mt-8 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-zinc-950 text-sm font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors duration-200 cursor-pointer focus:outline-none"
          >
            <Timer className="w-4 h-4" />
            Start
          </button>
          <p className="mt-4 text-[11px] text-zinc-500">Free, no sign-up. The clock starts on the first question.</p>
        </div>
      )}

      {phase === "run" && q && (
        <div className="text-center">
          <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-zinc-400">
            <span>
              <span className="text-white text-base tabular-nums">{correct}</span> right
            </span>
            <span className="tabular-nums">
              <span className={seconds <= 10 ? "text-rose-400 text-base" : "text-white text-base"}>{seconds}</span> s
            </span>
          </div>
          <div className="mt-3 h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#e5a93c] via-rose-500 to-purple-500"
              style={{ width: `${(leftMs / DURATION_MS) * 100}%`, transition: "width 100ms linear" }}
            />
          </div>

          <h2 className="mt-10 font-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            The <span style={{ color }}>{q.degree}</span> of {q.key}
          </h2>
          <p className="mt-3 h-6 text-sm" aria-live="polite">
            {shown &&
              (shown.right ? (
                <span className="font-semibold text-emerald-400">{answerName(q)}</span>
              ) : (
                <span className="font-semibold text-rose-400">
                  It's {answerName(q)}
                </span>
              ))}
          </p>

          <div className="mt-6">
            <MiniKeyboard
              onPick={pick}
              disabled={!!shown}
              marks={
                shown
                  ? [{ pc: q.answerPc, color }, ...(shown.right ? [] : [{ pc: shown.picked, color: "#f43f5e" }])]
                  : []
              }
            />
          </div>
          <p className="mt-4 text-[11px] text-zinc-500 tabular-nums">{answered} answered</p>
        </div>
      )}

      {phase === "done" && result && (
        <div className="text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#e5a93c]">Your minute</p>
          <p className="mt-4 font-display text-7xl sm:text-8xl font-extrabold text-white tabular-nums leading-none">{result.correct}</p>
          <p className="mt-2 text-sm text-zinc-400">scale degrees named in 60 seconds</p>

          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md mx-auto">
            {[
              { label: "Right", value: result.answered ? `${Math.round((100 * result.correct) / result.answered)}%` : "—" },
              { label: "Per answer", value: result.avgMs === null ? "—" : `${(result.avgMs / 1000).toFixed(1)} s` },
              { label: "Answered", value: String(result.answered) },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3 py-4">
                <p className="text-xl font-black text-white tabular-nums">{s.value}</p>
                <p className="mt-1 text-[9.5px] font-bold uppercase tracking-widest text-zinc-500">{s.label}</p>
              </div>
            ))}
          </div>

          {(() => {
            const v = verdict(result);
            return (
              <div className="mt-8 max-w-lg mx-auto">
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">{v.title}</h2>
                <p className="mt-2 text-sm text-zinc-400 font-light leading-relaxed">{v.text}</p>
              </div>
            );
          })()}

          {result.missed.length > 0 && (
            <div className="mt-8 max-w-md mx-auto text-left">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-center">What you missed</p>
              <ul className="mt-3 flex flex-wrap justify-center gap-2">
                {result.missed.slice(0, 8).map((m, i) => (
                  <li
                    key={i}
                    className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300"
                  >
                    the <span className="font-bold" style={{ color: questionColor(m) }}>{m.degree}</span> of {m.key} is{" "}
                    <span className="font-bold text-white">{answerName(m)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10 flex flex-col items-center gap-4">
            <DownloadFree platform={platform} placement="quiz" />
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => share(result)}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-white text-xs font-bold uppercase tracking-widest transition-colors duration-200 cursor-pointer focus:outline-none"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : typeof navigator !== "undefined" && "share" in navigator ? <Share2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied — paste it anywhere" : "Share your score"}
              </button>
              <button
                onClick={start}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-white text-xs font-bold uppercase tracking-widest transition-colors duration-200 cursor-pointer focus:outline-none"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Try again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
