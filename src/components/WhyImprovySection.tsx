import React from "react";
import { motion } from "motion/react";
import { 
  Sparkle, 
  Map, 
  Compass, 
  Award, 
  Zap, 
  Smartphone, 
  Clock, 
  Activity,
  Layers,
  ArrowRight
} from "lucide-react";

interface WhyImprovySectionProps {
  onLearnMoreClick: () => void;
}

export function WhyImprovySection({ onLearnMoreClick }: WhyImprovySectionProps) {
  return (
    <section id="why" className="relative pt-12 sm:pt-16 pb-24 sm:pb-32 max-w-7xl mx-auto px-6 md:px-12 z-30 scroll-mt-6 bg-transparent">
      {/* Background radial highlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -z-10 w-[70%] h-[300px] bg-gradient-to-tr from-rose-500/5 via-purple-500/5 to-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Grid: Main intro on left, core cards on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left column: Heavy philosophical copy */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 pb-4">
          
          <h2 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight uppercase leading-none">
            WHY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500">IMPROVY?</span>
          </h2>

          <div className="space-y-4 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
            <p className="text-white font-normal text-sm">
              Knowing music theory and using it while you play are two different skills.
            </p>
            <p>
              Most musicians know their scales. But in the middle of a solo, working out which note is the 5th of E♭, or which degree that F♯ is in D, takes a moment you don't have. That small pause, repeated on every note, is what breaks the flow.
            </p>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-[#d946ef] to-[#06b6d4] font-extrabold text-base">
              Improvy trains that pause away.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onLearnMoreClick}
              className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white border border-transparent hover:border-white text-xs font-black uppercase tracking-widest text-zinc-950 hover:text-white hover:bg-transparent transition-all duration-300 cursor-pointer shadow-xl active:scale-95"
            >
              <span>Read the Full Method</span>
              <ArrowRight className="w-4 h-4 text-zinc-900 group-hover:text-white group-hover:translate-x-1.5 transition-all duration-300" />
            </button>
          </div>
        </div>        {/* Right column: Highlights and cards */}
        <div className="lg:col-span-7">
          {/* Grid of the 4 fundamental concepts - balanced 2x2 grid on sm and up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            
            {/* Card 1 */}
            <div className="relative overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent border border-rose-500/20 p-6 sm:p-7 rounded-3xl space-y-4 hover:border-rose-500/70 hover:shadow-[0_12px_30px_rgba(244,63,94,0.06)] transition-all duration-300 group flex flex-col justify-between">
              <span className="absolute top-0 right-0 w-24 h-24 bg-rose-500/4 rounded-full blur-xl pointer-events-none group-hover:bg-rose-500/8 transition-colors duration-300" />
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/[0.05] flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-white font-display tracking-wide uppercase">No More Counting</h4>
                <p className="text-xs text-zinc-400 font-sans font-light leading-relaxed">
                  Knowing how a scale is built isn't the same as finding its notes in time. Improvy drills the step in between, until the answer arrives before you would have started counting.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent border border-[#e5a93c]/20 p-6 sm:p-7 rounded-3xl space-y-4 hover:border-[#e5a93c]/70 hover:shadow-[0_12px_30px_rgba(229,169,60,0.06)] transition-all duration-300 group flex flex-col justify-between">
              <span className="absolute top-0 right-0 w-24 h-24 bg-[#e5a93c]/4 rounded-full blur-xl pointer-events-none group-hover:bg-[#e5a93c]/8 transition-colors duration-300" />
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/[0.05] flex items-center justify-center text-[#e5a93c] group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-white font-display tracking-wide uppercase">Every Key, the Same Way</h4>
                <p className="text-xs text-zinc-400 font-sans font-light leading-relaxed">
                  Once you think in degrees, all 12 keys work the same way: the 5th is always the 5th. Improvy trains each key until B major feels as familiar as C.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="relative overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent border border-purple-500/20 p-6 sm:p-7 rounded-3xl space-y-4 hover:border-purple-500/70 hover:shadow-[0_12px_30px_rgba(168,85,247,0.06)] transition-all duration-300 group flex flex-col justify-between">
              <span className="absolute top-0 right-0 w-24 h-24 bg-purple-500/4 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/8 transition-colors duration-300" />
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/[0.05] flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-white font-display tracking-wide uppercase">Short, Focused Drills</h4>
                <p className="text-xs text-zinc-400 font-sans font-light leading-relaxed">
                  A few minutes a day of quick, randomized questions, one key at a time, with a difficulty that adapts to how fast and how accurately you answer.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="relative overflow-hidden bg-gradient-to-b from-white/[0.02] to-transparent border border-cyan-500/20 p-6 sm:p-7 rounded-3xl space-y-4 hover:border-cyan-500/70 hover:shadow-[0_12px_30px_rgba(6,182,212,0.06)] transition-all duration-300 group flex flex-col justify-between">
              <span className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/4 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/8 transition-colors duration-300" />
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/[0.05] flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <Sparkle className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-black text-white font-display tracking-wide uppercase">Freedom to Play</h4>
                <p className="text-xs text-zinc-400 font-sans font-light leading-relaxed">
                  Chords, extensions and melodies are all built from degrees. When finding them becomes automatic, your attention goes back where it belongs: to the music.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
