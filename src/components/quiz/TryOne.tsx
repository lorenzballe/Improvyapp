import { useRef } from "react";
import { motion } from "motion/react";
import { ArrowRight, RotateCcw, Timer } from "lucide-react";
import { PhoneMockup } from "../PhoneMockup";
import { ScaledScreen } from "../app/ScaledScreen";
import { TrainerScreen } from "../app/TrainerScreen";
import { ResultCard, AppButton } from "../app/ResultCard";
import { useTrainer } from "../app/useTrainer";
import { track } from "../../lib/analytics";

const LENGTH = 10;

/**
 * The app, playable on the home page: its own trainer screen, in the phone
 * the hero shows, running a ten-question session in one key. Whoever has to
 * count up from the root to answer has just felt the problem the app solves,
 * which no sentence on the page can do for them.
 */
export function TryOne({ onOpenQuiz }: { onOpenQuiz: () => void }) {
  const touched = useRef(false);
  const t = useTrainer({
    length: LENGTH,
    onFinish: (r) => track("try_finished", { correct: r.correct, answered: r.answered }),
  });
  const pick = (pitch: number) => {
    if (!touched.current) {
      touched.current = true;
      track("try_one_answered", { right: pitch === t.question.answerPc });
    }
    t.pick(pitch);
  };

  return (
    <section id="try" aria-label="Try the app" className="relative z-30 max-w-7xl mx-auto px-6 md:px-12 pt-24 sm:pt-28 scroll-mt-24">
      <div className="absolute top-1/3 left-1/4 -z-10 w-[60%] h-[360px] bg-gradient-to-tr from-[#e5a93c]/5 via-rose-500/5 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      {/* On a phone: the words, the app, then the buttons. Beside it on a
          computer: the app on the left, the words and buttons on the right. */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-16 gap-y-10 lg:gap-y-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:self-end space-y-6 text-left"
        >
          <p className="text-[11px] sm:text-xs font-sans uppercase tracking-[0.24em] bg-gradient-to-r from-[#f43f5e] via-[#d946ef] to-[#6366f1] bg-clip-text text-transparent font-black">
            No download, no sign-up
          </p>
          <h2 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight uppercase leading-none">
            Try it <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500">right here.</span>
          </h2>
          <div className="space-y-4 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed max-w-xl">
            <p className="text-white font-normal text-sm">This is the app — the same screen you will have on your phone.</p>
            <p>
              A key, a degree, and you tap the note: ten questions in one key, the way a session starts in Improvy. If you had to
              count up from the root to find it, that is the pause the app trains away.
            </p>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#d946ef] to-[#06b6d4] font-extrabold text-base">
              Name it before you can count it.
            </p>
          </div>
        </motion.div>

        {/* The phone: the app itself, live. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 lg:col-start-1 lg:row-start-1 lg:row-span-2 flex justify-center"
        >
          <PhoneMockup>
            <ScaledScreen width={284}>
              <TrainerScreen
                question={t.question}
                feedback={t.feedback}
                correct={t.correct}
                answered={t.answered}
                streak={t.streak}
                lastRight={t.lastRight}
                length={LENGTH}
                onPick={pick}
                onExit={t.start}
                overlay={
                  t.result && (
                    <ResultCard
                      title="SESSION COMPLETE"
                      subtitle={`Key of ${t.question.key} · Diatonic`}
                      result={t.result}
                      timed={false}
                      actions={
                        <>
                          <AppButton onClick={onOpenQuiz}>60-SECOND TEST</AppButton>
                          <AppButton variant="dark" onClick={t.start}>
                            PLAY AGAIN
                          </AppButton>
                        </>
                      }
                    />
                  )
                }
              />
            </ScaledScreen>
          </PhoneMockup>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 lg:col-start-6 lg:row-start-2 lg:self-start flex flex-col sm:flex-row gap-3"
        >
          <button
            onClick={onOpenQuiz}
            className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white border border-transparent hover:border-white text-xs font-black uppercase tracking-widest text-zinc-950 hover:text-white hover:bg-transparent transition-all duration-300 cursor-pointer shadow-xl active:scale-95"
          >
            <Timer className="w-4 h-4" />
            <span>The 60-second test</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-all duration-300" />
          </button>
          <button
            onClick={t.start}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-xs font-black uppercase tracking-widest text-white transition-all duration-300 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Another key</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
