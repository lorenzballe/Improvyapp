import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";
import { MiniKeyboard } from "./MiniKeyboard";
import { nextQuestion, answerName, questionColor } from "../../lib/quiz";
import { track } from "../../lib/analytics";

/**
 * One question, on the home page, before anything is explained: the ♭7 of E♭,
 * on a keyboard. Whoever had to count up from E♭ to find it has just felt the
 * problem the app solves, which no sentence on the page can do for them.
 */
export function TryOne({ onOpenQuiz }: { onOpenQuiz: () => void }) {
  const [q, setQ] = useState(() => nextQuestion());
  const [picked, setPicked] = useState<number | null>(null);
  const answered = picked !== null;
  const right = picked === q.answerPc;
  const color = questionColor(q);

  const pick = (pc: number) => {
    if (answered) return;
    setPicked(pc);
    track("try_one_answered", { right: pc === q.answerPc });
  };
  const another = () => {
    setQ(nextQuestion(q));
    setPicked(null);
  };

  return (
    <section id="try" aria-label="Try one question" className="relative z-30 max-w-xl mx-auto px-6 mt-16 sm:mt-20 scroll-mt-24">
      <div className="rounded-[28px] border border-white/[0.06] bg-[#07040f]/60 backdrop-blur-3xl p-6 sm:p-8 text-center shadow-2xl">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#e5a93c]">Try one</p>
        <h2 className="mt-3 font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          What's the <span style={{ color }}>{q.degree}</span> of {q.key}?
        </h2>
        <p className="mt-2 text-sm text-zinc-400 font-light min-h-[1.5rem]" aria-live="polite">
          {!answered ? (
            "Tap it. Did you have to count?"
          ) : right ? (
            <>
              <span className="font-semibold text-emerald-400">Right — {answerName(q)}.</span> Now try it against the clock.
            </>
          ) : (
            <>
              <span className="font-semibold text-rose-400">It's {answerName(q)}</span> — the {q.degree} of {q.key}.
            </>
          )}
        </p>

        <div className="mt-6">
          <MiniKeyboard
            onPick={pick}
            disabled={answered}
            marks={
              answered
                ? [{ pc: q.answerPc, color }, ...(right ? [] : [{ pc: picked!, color: "#f43f5e" }])]
                : []
            }
          />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenQuiz}
            className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 rounded-xl bg-white text-zinc-950 text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors duration-200 cursor-pointer focus:outline-none"
          >
            Take the 60-second test
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
          {answered && (
            <button
              onClick={another}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-white text-xs font-bold uppercase tracking-widest transition-colors duration-200 cursor-pointer focus:outline-none"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Another one
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
