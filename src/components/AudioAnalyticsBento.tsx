import React, { useState } from "react";
import { motion } from "motion/react";
import { Activity, Percent, Layers, ShieldCheck, Zap, SlidersHorizontal, Check, ShieldAlert } from "lucide-react";
import { AnalyticalStat } from "../types";

const INITIAL_STATS: AnalyticalStat[] = [
  { degreeSymbol: "1", degreeName: "Tonic", accuracy: 98, responseTimeMs: 240, errorRate: 2 },
  { degreeSymbol: "3", degreeName: "Major 3rd", accuracy: 92, responseTimeMs: 380, errorRate: 8 },
  { degreeSymbol: "5", degreeName: "Perfect 5th", accuracy: 94, responseTimeMs: 290, errorRate: 6 },
  { degreeSymbol: "♭2", degreeName: "Minor 2nd", accuracy: 68, responseTimeMs: 920, errorRate: 32 },
  { degreeSymbol: "♭6", degreeName: "Minor 6th", accuracy: 55, responseTimeMs: 1150, errorRate: 45 },
  { degreeSymbol: "♭5", degreeName: "Tritone", accuracy: 72, responseTimeMs: 810, errorRate: 28 },
  { degreeSymbol: "7", degreeName: "Major 7th", accuracy: 81, responseTimeMs: 640, errorRate: 19 },
];

export const AudioAnalyticsBento: React.FC = () => {
  const [activeStatIndex, setActiveStatIndex] = useState<number>(4); // default on Minor 6th (lowest accuracy)
  const [diatonicRatio, setDiatonicRatio] = useState<number>(0.58); // transition animator
  const [trainingTones, setTrainingTones] = useState<string[]>(["♭2", "♭5", "♭6", "7"]); // custom isolation selections

  const handleToggleTrainingTone = (sym: string) => {
    if (trainingTones.includes(sym)) {
      setTrainingTones(trainingTones.filter(t => t !== sym));
    } else {
      setTrainingTones([...trainingTones, sym]);
    }
  };

  const activeStat = INITIAL_STATS[activeStatIndex];

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 max-w-7xl mx-auto px-4 md:px-0">
      
      {/* Bento Card 1: Key Analytics SVG Radial Chart (Col span 5) */}
      <div className="md:col-span-5 glass-panel border border-white/5 bg-[#0b0615]/75 p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[380px]">
        
        {/* Background radial glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-violet-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <span className="font-sans font-bold text-[9px] uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-full inline-block">
            Cognitive Reaction Map
          </span>
          <h4 className="text-xl font-bold text-white font-display">Scale Degree Accuracy Rate</h4>
          <p className="text-xs text-zinc-400 font-light font-sans leading-relaxed">
            A dynamic chart mapping how accurately your mind identifies degrees. Select any degree to load analytical data.
          </p>
        </div>

        {/* Dynamic Graphic SVG Element */}
        <div className="my-6 relative flex items-center justify-center">
          {/* Radial Accuracy Radar Mockup */}
          <svg className="w-48 h-48 select-none" viewBox="0 0 100 100">
            {/* Concentric grid circles */}
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            
            {/* Axis grid lines */}
            <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />

            {/* Glowing neon paths mapping exact actual accuracies */}
            <polygon 
              points="50,15 78,32 75,68 50,85 24,68 22,32" 
              fill="rgba(139, 92, 246, 0.05)" 
              stroke="url(#neonPurpleGrad)" 
              strokeWidth="1.5"
              className="transform-origin-center animate-spin-slow opacity-90"
            />

            {/* Individual active pointer node dots */}
            {INITIAL_STATS.map((stat, idx) => {
              const angle = (idx * 2 * Math.PI) / INITIAL_STATS.length;
              // scale distance based on accuracy percent
              const radius = 10 + (stat.accuracy / 100) * 35;
              const x = 50 + radius * Math.cos(angle);
              const y = 50 + radius * Math.sin(angle);
              const isActive = idx === activeStatIndex;

              return (
                <g 
                  key={stat.degreeSymbol} 
                  className="cursor-pointer"
                  onClick={() => setActiveStatIndex(idx)}
                >
                  <circle 
                    cx={x} 
                    cy={y} 
                    r={isActive ? 3.5 : 2} 
                    fill={isActive ? "#f43f5e" : "rgba(139, 92, 246, 0.8)"}
                    className="transition-all hover:scale-150"
                  />
                  {isActive && (
                    <circle 
                      cx={x} 
                      cy={y} 
                      r="6" 
                      fill="none" 
                      stroke="#f43f5e" 
                      strokeWidth="0.5" 
                      className="animate-ping"
                    />
                  )}
                </g>
              );
            })}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="neonPurpleGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#ec4899" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Quick float overlay badge with active detail info */}
          <div className="absolute right-0 bottom-0 bg-[#160e29] border border-[#8b5cf6]/20 px-3 py-2 rounded-xl text-right max-w-[120px] shadow-lg">
            <span className="text-[8px] font-sans font-bold uppercase text-zinc-500 block">In Focus</span>
            <span className="text-xs font-bold text-white block mt-0.5">{activeStat.degreeName} ({activeStat.degreeSymbol})</span>
            <span className={`text-[10px] font-sans font-extrabold block mt-0.5 ${
              activeStat.accuracy >= 90 ? "text-emerald-400" : activeStat.accuracy >= 70 ? "text-rose-450" : "text-rose-500"
            }`}>
              {activeStat.accuracy}% Acc
            </span>
          </div>
        </div>

        {/* Detailed Analytic Grid Footer */}
        <div className="grid grid-cols-3 gap-2 text-xs font-sans bg-black/50 p-3 rounded-2xl border border-white/5 relative z-10 mt-auto">
          <div>
            <span className="text-[8px] text-zinc-500 uppercase block tracking-wider font-bold">Latency</span>
            <span className="text-white font-semibold block mt-0.5">{activeStat.responseTimeMs}ms</span>
          </div>
          <div>
            <span className="text-[8px] text-zinc-500 uppercase block tracking-wider font-bold">Error Rate</span>
            <span className="text-rose-400 font-semibold block mt-0.5">{activeStat.errorRate}%</span>
          </div>
          <div>
            <span className="text-[8px] text-zinc-500 uppercase block tracking-wider font-bold">Reflex Stat</span>
            <span className={`font-semibold block mt-0.5 truncate ${
              activeStat.accuracy >= 90 ? "text-emerald-400" : activeStat.accuracy >= 75 ? "text-rose-450" : "text-rose-500"
            }`}>
              {activeStat.accuracy >= 90 ? "Solidified" : activeStat.accuracy >= 75 ? "Fluid" : "Critical"}
            </span>
          </div>
        </div>
      </div>

      {/* Bento Card 2: Diatonico vs Cromatico Simulator Slider (Col span 4) */}
      <div className="md:col-span-4 glass-panel border border-white/5 bg-[#0b0615]/75 p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[380px]">
        <div className="space-y-2 relative z-10">
          <span className="font-sans font-bold text-[9px] uppercase tracking-wider text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full inline-block">
            Dynamic Difficulty Balance
          </span>
          <h4 className="text-xl font-bold text-white font-display">Diatonic vs. Chromatic Tension</h4>
          <p className="text-xs text-zinc-400 font-light font-sans leading-relaxed">
            Visualize how harmonic density shifts from the natural 7-note diatonic center to the complete 12-note chromatic spectrum.
          </p>
        </div>

        {/* Animated slider simulation area with visual grid bar loops */}
        <div className="py-6 flex flex-col gap-4">
          <div className="flex justify-between items-center text-[10px] font-sans font-bold text-zinc-500 uppercase tracking-wider">
            <span>7 Notes (Diatonic)</span>
            <span>12 Notes (Chromatic)</span>
          </div>

          <div className="relative w-full h-8 bg-zinc-950 rounded-xl overflow-hidden flex items-center border border-white/5 p-1">
            {/* Range Slider handle track */}
            <div 
              style={{ width: `${diatonicRatio * 100}%` }}
              className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg opacity-40 transition-all duration-300"
            ></div>
            
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={diatonicRatio}
              onChange={(e) => setDiatonicRatio(parseFloat(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div 
              style={{ left: `calc(${diatonicRatio * 100}% - 8px)` }}
              className="absolute w-4.5 h-4.5 bg-white rounded-full shadow-md z-10 transition-all pointer-events-none border border-violet-500"
            ></div>
          </div>

          {/* Interactive virtual visualizer representing notes as nodes */}
          <div className="h-16 flex items-center justify-center gap-1.5 bg-black/40 p-2.5 rounded-xl border border-white/5">
            {Array.from({ length: 12 }).map((_, i) => {
              const isDiatonicKey = [0, 2, 4, 5, 7, 9, 11].includes(i);
              const opacityThresh = isDiatonicKey ? 1 : diatonicRatio;
              
              return (
                <div 
                  key={i}
                  style={{ opacity: opacityThresh }}
                  className={`flex-1 h-10 rounded-sm transition-all duration-300 ${
                    isDiatonicKey 
                      ? "bg-gradient-to-t from-violet-500 to-indigo-500" 
                      : "bg-rose-500"
                  }`}
                  title={isDiatonicKey ? "Diatonic Tone" : "Chromatic Tone"}
                ></div>
              );
            })}
          </div>
        </div>

        {/* Quick scientific insight */}
        <div className="text-[10px] text-zinc-400 font-light leading-relaxed font-sans bg-black/40 p-3 rounded-xl border border-white/5 flex gap-2">
          <Zap className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <p className="font-light">
            With {diatonicRatio >= 0.7 ? "high somatic chromatics" : "diatonic dominance"}, the brain requires {diatonicRatio >= 0.7 ? "3x more processing time" : "only 240ms"} to map the sensation.
          </p>
        </div>
      </div>

      {/* Bento Card 3: Custom Interval Personalization (Col span 3) */}
      <div className="md:col-span-3 glass-panel border border-white/5 bg-[#0b0615]/75 p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[380px]">
        <div className="space-y-2 relative z-10">
          <span className="font-sans font-bold text-[9px] uppercase tracking-wider text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded-full inline-block">
            Isolation Module
          </span>
          <h4 className="text-xl font-bold text-white font-display">Interval Tension Filter</h4>
          <p className="text-xs text-zinc-400 font-light font-sans leading-relaxed">
            Isolate the intervals you struggle with the most. Mark degrees to prioritize them in the app's training algorithm.
          </p>
        </div>

        {/* Degree custom pill selectors */}
        <div className="grid grid-cols-2 gap-2 my-4">
          {[
            { symbol: "♭2", name: "Minor 2nd" },
            { symbol: "2", name: "Major 2nd" },
            { symbol: "♭5", name: "Tritone" },
            { symbol: "♭6", name: "Minor 6th" },
            { symbol: "6", name: "Major 6th" },
            { symbol: "♭7", name: "Minor 7th" },
            { symbol: "7", name: "Major 7th" },
          ].map((interval) => {
            const isSelected = trainingTones.includes(interval.symbol);
            return (
              <button
                key={interval.symbol}
                onClick={() => handleToggleTone(interval.symbol)}
                className={`py-2 px-2.5 rounded-xl text-left border flex flex-col justify-between transition-all duration-200 cursor-pointer h-14 ${
                  isSelected 
                    ? "bg-rose-500/10 border-rose-500/40 text-rose-300"
                    : "bg-white/[0.01] border-white/5 text-zinc-500 hover:text-zinc-300 hover:border-white/10"
                }`}
              >
                <div className="flex justify-between items-center w-full">
                  <span className="font-sans text-xs font-bold text-zinc-300">{interval.symbol}</span>
                  {isSelected && <Check className="w-3 h-3 text-rose-400" />}
                </div>
                <span className="text-[8px] uppercase tracking-wider text-zinc-400">{interval.name}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic target counter */}
        <div className="text-[10px] font-sans font-bold text-zinc-500 flex items-center justify-between border-t border-white/5 pt-3">
          <span>Isolated Tones</span>
          <span className="text-white font-bold">{trainingTones.length} / 7</span>
        </div>
      </div>

    </div>
  );

  function handleToggleTone(sym: string) {
    handleToggleTrainingTone(sym);
  }
};
