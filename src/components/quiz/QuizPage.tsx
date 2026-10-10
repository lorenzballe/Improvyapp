import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Check, RotateCcw, Timer } from "lucide-react";
import { DownloadFree } from "../StoreBadges";
import { PhoneMockup } from "../PhoneMockup";
import { ScaledScreen } from "../app/ScaledScreen";
import { TrainerScreen, SCREEN_H, SCREEN_W } from "../app/TrainerScreen";
import { ResultCard, AppButton, tierOf } from "../app/ResultCard";
import { useTrainer, type TrainerResult } from "../app/useTrainer";
import { LEXEND } from "../app/appColors";
import { degreeColor, parseDegree } from "../../lib/harmony";
import { track } from "../../lib/analytics";
import type { Platform } from "../../lib/platform";

const DURATION_MS = 60_000;
const SHARE_URL = "https://improvy.app/#quiz";

/** What the score says, in the app's own four grades. */
const VERDICT: Record<string, { title: string; text: string }> = {
  FLAWLESS: {
    title: "Not one wrong.",
    text: "You think in numbers. Improvy keeps it that way in all 12 keys — and takes it on to the chromatic degrees and the 9s, 11s and 13s.",
  },
  SHARP: {
    title: "That is fluency.",
    text: "Most degrees come before you could count them. Improvy takes the same speed to every key and every chromatic degree.",
  },
  SOLID: {
    title: "Fluent, with pauses.",
    text: "Most degrees come at once; some you still work out. Those pauses are exactly what Improvy trains away, a few minutes a day.",
  },
  "WARMING UP": {
    title: "You count — everyone does at first.",
    text: "Counting up from the root works, but not at tempo. Improvy turns the counting into knowing: a few minutes a day, in all 12 keys.",
  },
};

/** Phones get the app's screen at their own width; anything wider gets the phone. */
function useNarrow() {
  const query = "(max-width: 639px)";
  const [narrow, setNarrow] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setNarrow(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return narrow;
}

/** The largest width at which the app's whole screen fits this window. */
function useFitWidth() {
  const measure = () =>
    typeof window === "undefined" ? SCREEN_W : Math.min(window.innerWidth, (window.innerHeight * SCREEN_W) / SCREEN_H);
  const [w, setW] = useState(measure);
  useEffect(() => {
    const on = () => setW(measure());
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return w;
}

/**
 * The 60-second test: the app's own trainer, against the clock, in a new key
 * every question — the Daily Challenge's clock and its result card, with a
 * score worth sending to a bandmate.
 */
export default function QuizPage({ onBack, platform }: { onBack: () => void; platform: Platform }) {
  const narrow = useNarrow();
  const fitWidth = useFitWidth();
  // On a phone the test runs full screen, as the app does: the page's own
  // header and scrolling would otherwise sit across the keyboard.
  const [focus, setFocus] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = useTrainer({
    durationMs: DURATION_MS,
    onFinish: (r) =>
      track("quiz_finished", {
        correct: r.correct,
        answered: r.answered,
        accuracy: r.answered ? Math.round((100 * r.correct) / r.answered) : 0,
        avg_ms: r.avgMs === null ? null : Math.round(r.avgMs),
      }),
  });

  const begin = () => {
    setCopied(false);
    t.start();
    if (narrow) setFocus(true);
    track("quiz_started");
  };
  const stop = () => {
    t.abort();
    setFocus(false);
  };

  // Nothing behind the full-screen test scrolls.
  useEffect(() => {
    if (!focus) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [focus]);

  const share = async (r: TrainerResult) => {
    const acc = r.answered ? Math.round((100 * r.correct) / r.answered) : 0;
    const text = `I named ${r.correct} scale degrees in 60 seconds on Improvy (${acc}% right). Your turn:`;
    track("quiz_shared", { correct: r.correct });
    if (navigator.share) {
      try {
        await navigator.share({ text, url: SHARE_URL });
        return;
      } catch {
        // Cancelled, or not allowed here: the clipboard instead.
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${SHARE_URL}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const screen = (
    <TrainerScreen
      question={t.question}
      feedback={t.feedback}
      correct={t.correct}
      answered={t.answered}
      streak={t.streak}
      lastRight={t.lastRight}
      leftMs={t.leftMs}
      totalMs={DURATION_MS}
      onPick={t.pick}
      onExit={t.phase === "run" ? stop : undefined}
      exitLabel="Stop the test"
      overlay={
        t.phase === "ready" ? (
          <ReadyCard onStart={begin} />
        ) : t.result ? (
          <ResultCard
            title="THE 60-SECOND TEST"
            subtitle="Every key · Diatonic"
            result={t.result}
            timed
            actions={
              <>
                <AppButton onClick={() => share(t.result!)}>{copied ? "COPIED — PASTE IT ANYWHERE" : "SHARE YOUR RESULT"}</AppButton>
                <AppButton variant="dark" onClick={begin}>
                  TRY AGAIN
                </AppButton>
                {focus && (
                  <AppButton variant="dark" onClick={() => setFocus(false)}>
                    DONE
                  </AppButton>
                )}
              </>
            }
          />
        ) : null
      }
    />
  );

  const verdict = t.result ? VERDICT[tierOf(t.result, true).name] : null;

  return (
    <div className="relative z-30 mx-auto w-full max-w-7xl px-6 md:px-12 pt-24 pb-20 md:pt-28 text-zinc-300 font-sans">
      <div className="mb-10 text-left">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-zinc-900/80 px-3.5 py-2 text-[10px] font-black uppercase tracking-widest text-rose-500 transition-all duration-200 hover:bg-zinc-800 hover:text-white active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-rose-500 transition-transform group-hover:-translate-x-0.5" />
          <span>Return to Home</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-7 space-y-6 text-left">
          <p className="text-[11px] sm:text-xs font-sans uppercase tracking-[0.24em] bg-gradient-to-r from-[#f43f5e] via-[#d946ef] to-[#6366f1] bg-clip-text text-transparent font-black">
            The 60-second test
          </p>
          {verdict ? (
            <>
              <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight uppercase leading-none">
                {t.result!.correct} degrees <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500">in 60 seconds.</span>
              </h1>
              <div className="space-y-4 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed max-w-xl">
                <p className="text-white font-normal text-sm">{verdict.title}</p>
                <p>{verdict.text}</p>
              </div>
              {t.result!.missed.length > 0 && (
                <div className="max-w-xl">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">What you missed</p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {t.result!.missed.slice(0, 8).map((m, i) => (
                      <li key={i} className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs text-zinc-300">
                        the{" "}
                        <span className="font-bold" style={{ color: degreeColor(parseDegree(m.degree)) }}>
                          {m.degree}
                        </span>{" "}
                        of {m.key} is <span className="font-bold text-white">{m.answer}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                <DownloadFree platform={platform} placement="quiz" />
                <button
                  onClick={begin}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-xs font-black uppercase tracking-widest text-white transition-all duration-300 cursor-pointer active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try again</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight uppercase leading-none">
                How many degrees <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500">in 60 seconds?</span>
              </h1>
              <div className="space-y-4 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed max-w-xl">
                <p className="text-white font-normal text-sm">The app's own drill, against the clock.</p>
                <p>
                  A key and a degree — the 3 of A, the 6 of E♭ — and you tap the note on the keyboard. A new key every question,
                  as many as a minute allows. Then you get the app's result card, and what you missed.
                </p>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#d946ef] to-[#06b6d4] font-extrabold text-base">
                  Free, no sign-up. The clock starts on the first question.
                </p>
              </div>
              {t.phase === "ready" && (
                <button
                  onClick={begin}
                  className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-white border border-transparent hover:border-white text-xs font-black uppercase tracking-widest text-zinc-950 hover:text-white hover:bg-transparent transition-all duration-300 cursor-pointer shadow-xl active:scale-95"
                >
                  <Timer className="w-4 h-4" />
                  <span>Start the test</span>
                </button>
              )}
              {t.phase === "run" && (
                <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400">
                  <Check className="w-4 h-4" />
                  Running — tap the note on the keyboard
                </p>
              )}
            </>
          )}
        </div>

        {/* On the page's body, not in it: a transformed ancestor would turn
            "fixed" into "fixed to that ancestor". */}
        {focus &&
          createPortal(
            <div className="fixed inset-0 z-[100] bg-[#06030c] flex items-center justify-center">
              <div style={{ width: fitWidth }}>
                <ScaledScreen width={fitWidth}>{screen}</ScaledScreen>
              </div>
            </div>,
            document.body
          )}

        <div className="lg:col-span-5 flex justify-center">
          {focus ? null : narrow ? (
            <div className="w-full max-w-[420px] rounded-[34px] overflow-hidden border border-white/10 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.75)]">
              <ScaledScreen>{screen}</ScaledScreen>
            </div>
          ) : (
            <PhoneMockup>
              <ScaledScreen width={284}>{screen}</ScaledScreen>
            </PhoneMockup>
          )}
        </div>
      </div>
    </div>
  );
}

/** Before the clock starts: what the minute is, and the button that starts it. */
function ReadyCard({ onStart }: { onStart: () => void }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        background: "rgba(9,6,15,0.62)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 28,
        fontFamily: LEXEND,
        color: "#fff",
      }}
    >
      <div
        className="app-feedback"
        style={{
          width: "100%",
          padding: "30px 26px 26px",
          borderRadius: 32,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 0 56px -8px rgba(251,191,36,0.18), 0 16px 30px rgba(0,0,0,0.4)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, #FDE68A, #F59E0B)",
            boxShadow: "0 0 26px -2px rgba(245,158,11,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2A1B04" strokeWidth="2.4" strokeLinecap="round">
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2.5 2M9.5 2.5h5" />
          </svg>
        </div>
        <span style={{ marginTop: 18, fontSize: 11, fontWeight: 900, letterSpacing: 3, color: "#FBBF24", paddingLeft: 3 }}>THE 60-SECOND TEST</span>
        <span style={{ marginTop: 10, fontSize: 30, fontWeight: 900, letterSpacing: -0.5, lineHeight: 1.1 }}>Every key.<br />One minute.</span>
        <span style={{ marginTop: 12, fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.6)", lineHeight: 1.45 }}>
          A degree in a new key each question. Tap the note on the keyboard.
        </span>
        <div style={{ marginTop: 24, width: "100%" }}>
          <AppButton onClick={onStart}>START</AppButton>
        </div>
      </div>
    </div>
  );
}
