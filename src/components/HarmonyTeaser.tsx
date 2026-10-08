import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { HarmonyLens } from "./harmony/HarmonyLens";

/**
 * The short version of the What's Next page, for wherever it ends up: a
 * sentence, chords and scales lighting up by themselves, and the way in.
 */
export function HarmonyTeaser({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-6xl px-4 sm:px-6"
    >
      <div className="relative overflow-hidden rounded-[36px] border border-white/[0.07] bg-gradient-to-br from-[#120c22]/80 via-[#0b0716]/80 to-[#07040f]/80 p-6 sm:p-10 backdrop-blur-2xl">
        <div className="pointer-events-none absolute -top-28 -left-20 h-72 w-72 rounded-full bg-[#e5a93c]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="space-y-5 text-left lg:col-span-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#e5a93c]">Coming next</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#e5a93c]/25 bg-[#e5a93c]/[0.08] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#e5a93c]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e5a93c] opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#e5a93c]" />
                </span>
                In development
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase leading-[0.98] tracking-tight text-white">
              Chords &amp; scales,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5a93c] via-rose-500 to-purple-500">lit up</span>
            </h2>
            <p className="text-xs sm:text-sm font-light leading-relaxed text-zinc-400">
              Next for Improvy: <strong className="font-semibold text-white">every chord and every scale lit up on the keyboard</strong>, each key marked with its degree — the same numbers in all 12 keys.
            </p>
            <button
              onClick={onOpen}
              className="group inline-flex items-center gap-2.5 rounded-xl border border-transparent bg-white px-6 py-3.5 text-xs font-black uppercase tracking-widest text-zinc-950 shadow-xl transition-all duration-300 hover:border-white hover:bg-transparent hover:text-white active:scale-95 cursor-pointer"
            >
              <span>See what's next</span>
              <ArrowRight className="h-4 w-4 transition-all duration-300 group-hover:translate-x-1.5" />
            </button>
          </div>
          <div className="lg:col-span-7">
            <HarmonyLens compact />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
