import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRightLeft, Check, Layers, Sparkle, Spline } from "lucide-react";
import { HarmonyLens } from "./harmony/HarmonyLens";
import { ChordQualitiesDemo, KeysDemo, ScaleMapDemo } from "./harmony/MiniDemos";
import { StoreBadges } from "./StoreBadges";
import { ButtonColorful } from "./ButtonColorful";
import { PRO_PRICE_WEB } from "../lib/pricing";
import { degreeColor, parseDegree } from "../lib/harmony";
import { cn } from "../lib/utils";

/**
 * What comes after the notes: chords and scales, lit up on the keyboard with
 * their numbers. A preview of what is in development — it shows what the
 * visualisation will do, and says nothing about when.
 */

// The numbers that drift behind the title: a Cmaj7♯11's worth, and its tensions.
const DRIFT = ["1", "3", "5", "7", "9", "♯11", "13", "♭3", "♭7", "♭9"];

function Drifting() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 left-[55%] -z-10 hidden overflow-hidden md:block" aria-hidden="true">
      {DRIFT.map((t, i) => {
        const color = degreeColor(parseDegree(t));
        const left = (i * 37 + 7) % 88;
        const top = (i * 53 + 11) % 80;
        return (
          <motion.span
            key={t}
            className="absolute text-2xl sm:text-4xl font-black"
            style={{ left: `${left}%`, top: `${top}%`, color, textShadow: `0 0 24px ${color}` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.16, 0], y: [12, -18] }}
            transition={{ duration: 7 + (i % 4), repeat: Infinity, delay: i * 0.9, ease: "easeInOut" }}
          >
            {t}
          </motion.span>
        );
      })}
    </div>
  );
}

const FEATURES = [
  {
    eyebrow: "Chords",
    accent: "#e5a93c",
    icon: Layers,
    title: "Every chord, lit up",
    text: "Pick a chord — Cmaj7, F♯ø7, B♭7 — and its notes light up on the keyboard, each with its number. Change one number and you change the chord.",
    demo: <ChordQualitiesDemo />,
  },
  {
    eyebrow: "Scales",
    accent: "#06b6d4",
    icon: Spline,
    title: "Every scale, lit up",
    text: "The major scale and its seven modes on the keyboard, from brightest to darkest, with the numbers that give each one its colour.",
    demo: <ScaleMapDemo />,
  },
  {
    eyebrow: "All 12 keys",
    accent: "#f43f5e",
    icon: ArrowRightLeft,
    title: "Same numbers, any key",
    text: "Move a chord or a scale to another key: other keys light up, but its numbers — and their colours — stay exactly the same.",
    demo: <KeysDemo />,
  },
];

const ROADMAP = [
  {
    n: "01",
    title: "Notes",
    status: "Available now",
    live: true,
    text: "Every note of every key as its degree, 9s, 11s and 13s included. What Improvy trains today.",
  },
  {
    n: "02",
    title: "Chords",
    status: "In development",
    live: false,
    text: "Every chord lit up on the keyboard, its notes and extensions marked as numbers, in all 12 keys.",
  },
  {
    n: "03",
    title: "Scales",
    status: "In development",
    live: false,
    text: "Every scale and mode lit up on the keyboard as numbers, in all 12 keys.",
  },
];

export default function WhatsNextPage({ onBack, onGoPro }: { onBack: () => void; onGoPro: () => void }) {
  const reveal = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <div className="relative z-30 mx-auto w-full max-w-6xl px-4 pt-24 pb-16 md:pt-28 text-zinc-300 font-sans">
      <div className="mb-10 text-left">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-zinc-900/80 px-3.5 py-2 text-[10px] font-black uppercase tracking-widest text-rose-500 transition-all duration-200 hover:bg-zinc-800 hover:text-white active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-rose-500 transition-transform group-hover:-translate-x-0.5" />
          <span>Return to Home</span>
        </button>
      </div>

      {/* ── Hero ── */}
      <section className="relative isolate pb-10 sm:pb-14 text-left">
        <Drifting />
        <motion.div
          initial={{ opacity: 0, y: -16, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl space-y-6"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#e5a93c]">What's next</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e5a93c]/25 bg-[#e5a93c]/[0.08] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#e5a93c]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e5a93c] opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#e5a93c]" />
              </span>
              In development
            </span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl font-black uppercase leading-[0.95] tracking-tight text-white">
            Chords &amp; scales,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5a93c] via-rose-500 to-purple-500">
              lit up.
            </span>
          </h1>
          <p className="max-w-2xl text-sm sm:text-base font-light leading-relaxed text-zinc-400">
            Improvy trains you to see the number under every note. Next, you will see it under every chord and every scale:{" "}
            <strong className="font-semibold text-white">their keys light up on the keyboard, each one marked with its degree</strong>{" "}
            — the same numbers in all 12 keys.
          </p>
        </motion.div>
      </section>

      {/* ── The lens ── */}
      <motion.section {...reveal}>
        <HarmonyLens />
      </motion.section>

      {/* ── Three tools ── */}
      <section className="pt-20 sm:pt-28">
        <motion.div {...reveal} className="mb-10 sm:mb-12 space-y-3 text-center">
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase leading-none tracking-tight text-white text-balance">
            Three new{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500">ways to see</span>
          </h2>
          <p className="mx-auto max-w-xl text-xs sm:text-sm font-light leading-relaxed text-zinc-400">
            Each one starts from the skill Improvy already trains — knowing every degree in every key — and shows it on chords and scales.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.08 }}
                className="group relative flex flex-col overflow-hidden rounded-[28px] border border-white/[0.06] bg-[#0b0716]/70 p-6 sm:p-7 backdrop-blur-2xl transition-colors duration-500 hover:border-white/[0.14]"
              >
                <div
                  className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
                  style={{ background: f.accent }}
                />
                <div className="relative flex items-center gap-3">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-xl border bg-zinc-900"
                    style={{ borderColor: f.accent + "33", color: f.accent }}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.24em]" style={{ color: f.accent }}>
                    {f.eyebrow}
                  </span>
                </div>
                <h3 className="relative mt-5 font-display text-xl font-black uppercase tracking-tight text-white">{f.title}</h3>
                <p className="relative mt-2 text-xs sm:text-[13px] font-light leading-relaxed text-zinc-400">{f.text}</p>
                <div className="relative mt-6 flex-1 rounded-2xl border border-white/[0.05] bg-black/30 p-4 sm:p-5 min-h-[270px]">
                  {f.demo}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── One idea, all the way up ── */}
      <section className="pt-20 sm:pt-28">
        <motion.div {...reveal} className="mb-10 space-y-3 text-center">
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase leading-none tracking-tight text-white text-balance">
            One idea,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5a93c] via-rose-500 to-purple-500">all the way up</span>
          </h2>
          <p className="mx-auto max-w-xl text-xs sm:text-sm font-light leading-relaxed text-zinc-400">
            A chord is a handful of degrees. A scale is seven of them. Learn the numbers once, and everything built from them reads the same way.
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* The line that joins the three steps. */}
          <div className="pointer-events-none absolute left-[27px] top-6 bottom-6 w-px bg-gradient-to-b from-emerald-400/60 via-[#e5a93c]/50 to-purple-500/50 md:left-8 md:right-[calc((100%_-_2.5rem)/3_-_1.75rem)] md:top-[27px] md:bottom-auto md:h-px md:w-auto md:bg-gradient-to-r" />
          {ROADMAP.map((r, i) => (
            <motion.div
              key={r.n}
              {...reveal}
              transition={{ ...reveal.transition, delay: i * 0.1 }}
              className="relative flex gap-4 md:flex-col md:gap-5"
            >
              <span
                className={cn(
                  "relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-sm font-black",
                  r.live
                    ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.25)]"
                    : "border-[#e5a93c]/30 bg-[#0b0716] text-[#e5a93c]"
                )}
              >
                {r.live ? <Check className="h-5 w-5 stroke-[3]" /> : r.n}
              </span>
              <div className="rounded-3xl border border-white/[0.06] bg-[#0b0716]/60 p-5 sm:p-6 backdrop-blur-xl md:min-h-[150px] flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-black uppercase tracking-tight text-white">{r.title}</h3>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.16em] whitespace-nowrap",
                      r.live
                        ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                        : "border-[#e5a93c]/25 bg-[#e5a93c]/[0.08] text-[#e5a93c]"
                    )}
                  >
                    {r.status}
                  </span>
                </div>
                <p className="mt-2 text-xs sm:text-[13px] font-light leading-relaxed text-zinc-400">{r.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Start now ── */}
      <motion.section
        {...reveal}
        className="relative mt-20 sm:mt-28 overflow-hidden rounded-[36px] border border-white/[0.07] bg-gradient-to-b from-[#120c22]/80 to-[#07040f]/80 px-6 py-12 sm:px-12 sm:py-16 text-center backdrop-blur-2xl"
      >
        <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[560px] -translate-x-1/2 rounded-full bg-gradient-to-r from-[#e5a93c]/20 via-rose-500/15 to-purple-500/20 blur-3xl" />
        <div className="relative mx-auto max-w-2xl space-y-5">
          <Sparkle className="mx-auto h-6 w-6 text-[#e5a93c]" />
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase leading-[1.02] tracking-tight text-white text-balance">
            Start with the notes.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5a93c] via-rose-500 to-purple-500">
              The chords will follow.
            </span>
          </h2>
          <p className="text-xs sm:text-sm font-light leading-relaxed text-zinc-400">
            Everything you train in Improvy today — every degree, in every key — is what chords and scales are made of. When they light up on the keyboard, you will already know their numbers.
          </p>
          <div className="flex flex-col items-center gap-6 pt-3">
            <StoreBadges className="justify-center" />
            <ButtonColorful onClick={onGoPro} label={`Get Improvy Pro — ${PRO_PRICE_WEB}`} />
          </div>
        </div>
      </motion.section>
    </div>
  );
}
