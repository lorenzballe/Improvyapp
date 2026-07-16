import React from "react";
import { motion } from "motion/react";
import { AppLogo } from "./AppLogo";
import appDashboardImg from "../assets/images/frame_5_dashboard_1782039765702.jpg";
import { 
  ArrowLeft, 
  Sparkle, 
  Check, 
  X, 
  Ear,
  Layers, 
  Compass, 
  Binary, 
  Keyboard, 
  Music, 
  Workflow, 
  RefreshCw, 
  Play,
  RotateCcw,
  Sliders,
  Award,
  ArrowDown
} from "lucide-react";

interface InteractiveIPhoneMockupProps {
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: "amber" | "rose" | "purple" | "cyan";
  modeType: "diatonic" | "chromatic" | "inverse" | "piano";
  score: string;
  streak: string;
  timer: string;
}

function InteractiveIPhoneMockup({
  title,
  subtitle,
  badge,
  badgeColor,
  modeType,
  score,
  streak,
  timer
}: InteractiveIPhoneMockupProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateX = ((y - height / 2) / (height / 2)) * -12; // Max rotation 12deg
    const rotateY = ((x - width / 2) / (width / 2)) * 12;   // Max rotation 12deg

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
      transition: "transform 0.08s ease-out",
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.4s ease-in-out",
    });
  };

  const colors = {
    amber: {
      accent: "#e5a93c",
      shadow: "rgba(229, 169, 60, 0.35)",
      bgGradient: "from-amber-500/10 via-transparent to-transparent",
      backglow: "bg-amber-500/25",
    },
    rose: {
      accent: "#f43f5e",
      shadow: "rgba(244, 63, 94, 0.35)",
      bgGradient: "from-rose-500/10 via-transparent to-transparent",
      backglow: "bg-rose-500/25",
    },
    purple: {
      accent: "#a855f7",
      shadow: "rgba(168, 85, 247, 0.35)",
      bgGradient: "from-purple-500/10 via-transparent to-transparent",
      backglow: "bg-purple-500/25",
    },
    cyan: {
      accent: "#06b6d4",
      shadow: "rgba(6, 182, 212, 0.35)",
      bgGradient: "from-cyan-500/10 via-transparent to-transparent",
      backglow: "bg-cyan-500/25",
    },
  }[badgeColor];

  const badgeClasses = {
    amber: "bg-amber-500/10 border-[#e5a93c]/20 text-[#e5a93c]",
    rose: "bg-rose-500/10 border-rose-500/20 text-rose-455",
    purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-450",
  }[badgeColor];

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className="relative w-full max-w-[270px] h-[480px] rounded-[36px] bg-zinc-950 p-2 transition-all duration-300 transform-style-3d shadow-2xl hover:shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-white/[0.05] group"
    >
      {/* Magical Outer Neon Edge Glow & Dual-Border Shadowing */}
      <div 
        className="absolute inset-0 rounded-[36px] border pointer-events-none transition-all duration-500"
        style={{
          boxShadow: `inset 0 0 16px ${colors.shadow}, 0 0 35px -5px ${colors.shadow}`,
          borderColor: colors.accent + "40", // ~25% dynamic opacity
        }}
      />

      {/* Mystical backglow aura floating behind */}
      <div 
        className={`absolute -inset-2.5 rounded-[44px] ${colors.backglow} opacity-10 blur-2xl group-hover:opacity-30 transition-all duration-700 pointer-events-none`}
        style={{ transform: "translateZ(-40px)" }}
      />

      {/* Side physical buttons */}
      <div className="absolute top-[90px] -right-[1.5px] w-[2px] h-9 rounded-l bg-zinc-850" />
      <div className="absolute top-[80px] -left-[1.5px] w-[2px] h-7 rounded-r bg-zinc-850" />
      <div className="absolute top-[115px] -left-[1.5px] w-[2px] h-9 rounded-r bg-zinc-850" />
      <div className="absolute top-[160px] -left-[1.5px] w-[2px] h-9 rounded-r bg-zinc-850" />

      {/* Screen container */}
      <div className="relative h-full w-full rounded-[28px] overflow-hidden bg-gradient-to-b from-[#090514] to-[#030107] flex flex-col justify-between p-3.5 pt-6 select-none border border-white/[0.03]">
        
        {/* Dynamic Island / Notch */}
        <div className="absolute top-1.5 inset-x-0 flex justify-center z-50">
          <div className="w-18 h-3.5 rounded-full bg-black flex items-center justify-between px-2 shadow-inner">
            <div className="w-1 h-1 rounded-full bg-zinc-900" />
            <div className="w-0.5 h-0.5 rounded-full bg-blue-950" />
          </div>
        </div>

        {/* 3D Depth Content Layer */}
        <div className="absolute inset-0 w-full h-full overflow-hidden rounded-[28px] bg-[#0c0817]" style={{ transform: "translateZ(35px)" }}>
          <img 
            src={appDashboardImg} 
            alt="Improvy Statistics Dashboard" 
            className="w-full h-full object-cover scale-[1.09] translate-y-[-1px]"
            referrerPolicy="no-referrer"
          />
        </div>

      </div>
    </div>
  );
}

interface WhyImprovyPageProps {
  onBack: () => void;
}

export function WhyImprovyPage({ onBack }: WhyImprovyPageProps) {
  const logoRef = React.useRef<HTMLDivElement | null>(null);
  const [mousePct, setMousePct] = React.useState({ x: 50, y: 50 });
  const [isHoveringLogo, setIsHoveringLogo] = React.useState(false);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!logoRef.current) return;
      const rect = logoRef.current.getBoundingClientRect();
      
      const isInside = (
        e.clientX >= rect.left - 150 &&
        e.clientX <= rect.right + 150 &&
        e.clientY >= rect.top - 150 &&
        e.clientY <= rect.bottom + 150
      );
      
      setIsHoveringLogo(isInside);
      
      if (isInside) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const pctX = Math.max(0, Math.min(100, (x / rect.width) * 100));
        const pctY = Math.max(0, Math.min(100, (y / rect.height) * 100));
        setMousePct({ x: pctX, y: pctY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 md:py-16 text-zinc-300 font-sans relative z-30">
      
      {/* Sleek, Minimalist Back Navigation */}
      <div className="mb-12 text-left">
        <button 
          onClick={onBack}
          className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-white/[0.06] text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-white transition-all duration-200 cursor-pointer active:scale-95"
          id="back-button-method-page"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-rose-500 group-hover:-translate-x-0.5 transition-transform" />
          <span>Return to Home</span>
        </button>
      </div>

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-16 text-left"
      >
        
        {/* Editorial Masterpiece Title: Direct translation of musician's core vision */}
        <div className="space-y-6 max-w-4xl">
          <h1 className="text-4xl sm:text-6xl font-black text-white font-display tracking-tight uppercase leading-[1.0] select-none text-left">
            FROM MIND TO SOUND <br />
            <motion.span 
              className="relative inline-block group/underline cursor-pointer pb-2"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover="hover"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5a93c] via-rose-500 to-purple-500 relative z-10 font-bold">
                INSTANTLY
              </span>
              
              <motion.svg
                width="100%"
                height="22"
                viewBox="0 0 300 22"
                preserveAspectRatio="none"
                className="absolute -bottom-2 left-0 text-[#e5a93c] pointer-events-none overflow-visible"
              >
                <motion.path
                  d="M 0,11 Q 75,2 150,11 Q 225,20 300,11"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  variants={{
                    hidden: { pathLength: 0, opacity: 0 },
                    visible: {
                      pathLength: 1,
                      opacity: 1,
                      transition: { duration: 1.2, ease: "easeInOut", delay: 0.2 }
                    },
                    hover: {
                      d: "M 0,11 Q 75,20 150,11 Q 225,2 300,11",
                      transition: { duration: 0.8 },
                    }
                  }}
                />
              </motion.svg>
            </motion.span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-3xl">
            Many musicians simply play mechanical notes without understanding <strong className="text-white font-semibold">the hidden design</strong> behind each harmonic choice. Improvy was born to unify ear sensitivity with an instant, geometric visualization of the instrument, granting you true expressive freedom.
          </p>
        </div>

         {/* 1. SECTION: THE RE-ALIGNMENT OF EAR AND VISUALIZATION */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/[0.03] via-zinc-950 to-rose-500/[0.03] border border-amber-500/10 rounded-[32px] p-6 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/[0.01] rounded-full blur-[120px] pointer-events-none" />
          
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#e5a93c] shadow-md">
              <Ear className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight">The Ear is Only Half the Battle</h2>
            </div>
          </div>

          <div className="space-y-5 text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
            <p>
              There is a massive misconception in music education: believing that to improvise or compose, you simply need a "good ear" or rely solely on raw acoustic instinct. The ear plays an extraordinary role—it filters sound into scale degrees, relationships, and intervals. But by itself, it is not enough to project your ideas onto the instrument in real time.
            </p>
            <p className="text-white font-medium bg-white/[0.02] border-l-2 border-[#e5a93c] px-4 py-3 rounded-r-xl">
              Before you even play a key, <strong className="text-[#e5a93c]">the note in your mind must light up</strong>. The geometric mind works in perfect synergy with the ear: it instantly calculates where you are and where you need to go within the musical architecture, translating theoretical concepts into living spatial coordinates before your fingers even touch the board.
            </p>
            <p>
              This framework turns your relative ear training into an active visual map. Those who play by ear are constantly translating sound to numbers; with Improvy, you train your brain to map those very numbers into instant physical configurations on the instrument, unlocking your ultimate creative potential.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 mt-8 border-t border-white/[0.06] text-left">
            <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03]">
              <span className="text-rose-400 text-[10px] font-bold block uppercase tracking-wider mb-2">THE ANALOG TRAP</span>
              <p className="text-xs text-zinc-400 font-light leading-snug">Playing notes blindly, guessing the correct key, and suffering frustrating cognitive delays.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03]">
              <span className="text-[#e5a93c] text-[10px] font-bold block uppercase tracking-wider mb-2">THE "ILLUMINATED" MENTAL LINK</span>
              <p className="text-xs text-zinc-400 font-light leading-snug">Resolving coordinates in advance. Visualizing the exact shape of a chord before physical execution.</p>
            </div>
            <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03]">
              <span className="text-emerald-400 text-[10px] font-bold block uppercase tracking-wider mb-2">GENUINE EXPRESSIVE FREEDOM</span>
              <p className="text-xs text-zinc-400 font-light leading-snug">Instantly translating any harmonic or melodic idea inside your head onto your instrument without friction.</p>
            </div>
          </div>
        </div>

        {/* 2. SECTION: RELATIONAL MUSIC & TRANSFORMATION IN ALL KEYS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          <div className="lg:col-span-7 p-6 sm:p-10 rounded-[32px] bg-[#090514]/40 border border-white/[0.04] flex flex-col justify-between">
            <div className="space-y-5">
              <h3 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight">
                Music is Relative, Not Absolute
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                Because music operates through interval ratios, your internal visualization must be mastered in <strong className="text-white">every single key</strong>. In modern music and jazz, chromatic changes are constant and unforgiving. 
              </p>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                If you are suddenly asked for the <strong className="text-rose-400 font-medium">flat-13th of F-sharp (F# ♭13)</strong>, your brain cannot afford to count half-steps or hesitate. We don't mean just playing an F# chord with a flat 13, but understanding the pure intervallic relationship: the flat 13th starting from F-sharp. You need to capture this visually in your head in a split second. Only then can you navigate your instrument freely.
              </p>

              <div className="p-4.5 rounded-2xl bg-zinc-950/60 border border-white/[0.04] space-y-2.5">
                <span className="text-[9px] font-sans text-zinc-500 tracking-[0.2em] block uppercase font-bold">PURE INTERVALLIC RELATION</span>
                <div className="flex justify-between items-center text-xs font-sans tracking-widest uppercase">
                  <span className="text-[#e5a93c] font-black">STARTING NOTE: F♯</span>
                  <span className="text-emerald-400 font-bold">♭13 (INTERVAL) ➔ NOTE D</span>
                </div>
                <div className="w-full h-[1.5px] bg-gradient-to-r from-[#e5a93c] to-emerald-500 rounded-full" />
                <p className="text-[10px] text-zinc-400 font-light leading-relaxed">
                  Improvy reduces the decoding of complex intervals (like a flat 13 from a specific root key) to an instant geometric link between the sound and its keyboard coordinate, eliminating the lag of traditional theory calculation.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-10 rounded-[32px] bg-gradient-to-br from-purple-500/[0.03] to-[#07040f] border border-purple-500/20 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/[0.05] flex items-center justify-center text-purple-400">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight">
                The World's First Formalized Method
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                We were <strong className="text-[#e5a93c]">the first in the world</strong> to grasp, isolate, and scientifically formalize this precise cognitive processing challenge. 
              </p>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light">
                We aren't offering a casual game or tedious traditional sight-reading lessons. We have decoded a practical, dynamic, and incredibly fast training system that calibrates your mind from any musical angle—delivering modern drill tools focused purely on active results.
              </p>
              <p className="text-[11.5px] text-white font-light">
                Train anywhere, anytime, taking advantage of flexible, interactive mechanics for absolute creative control.
              </p>
            </div>


          </div>

        </div>

        {/* 3. SECTION: THE 4 CORE APP MODULES & MODES (THE HEART OF THE METHOD) */}
        <div className="space-y-8">
          <div className="text-center md:text-left space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight">Our App's 4 Core Training Modes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            
            {/* 1. MODALITÀ DIATONICA */}
            <div className="relative group overflow-visible p-8 sm:p-9 rounded-[32px] bg-zinc-950/40 border border-white/[0.04] hover:border-amber-500/20 hover:bg-zinc-950/70 transition-all duration-700 flex flex-col justify-between space-y-8 shadow-2xl hover:shadow-[0_0_50px_-12px_rgba(229,169,60,0.18)] hover:-translate-y-1.5">
              {/* Backglow blur-glow */}
              <div className="absolute -inset-2 rounded-[34px] bg-amber-500/10 opacity-0 group-hover:opacity-100 blur-3xl transition-all duration-700 pointer-events-none" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[10px] font-sans tracking-[0.18em] text-[#e5a93c] font-black uppercase">DIATONIC MODE</span>
                  </div>
                  <span className="text-[9px] text-[#e5a93c] font-bold uppercase bg-[#e5a93c]/5 px-2.5 py-1 rounded-full border border-[#e5a93c]/10">CORE FOUNDATIONS</span>
                </div>
                
                <h4 className="text-xl font-bold text-white uppercase font-display tracking-tight group-hover:text-[#e5a93c] transition-colors duration-300">7-Degree Tuning</h4>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  Practice exclusively on the seven diatonic degrees within a locked key of your choice. It's the perfect starter setup to build your harmonic center of gravity and master basic scale degree relationships without chromatic overload.
                </p>
              </div>

              {/* iPhone 3D Mockup */}
              <div className="relative z-10 flex justify-center py-4">
                <InteractiveIPhoneMockup 
                  title="Diatonic Degree"
                  subtitle="Key of C Major"
                  badge="DIATONIC"
                  badgeColor="amber"
                  modeType="diatonic"
                  score="+540 XP"
                  streak="7 Days"
                  timer="0:14"
                />
              </div>
            </div>

            {/* 2. MODALITÀ CROMATICA */}
            <div className="relative group overflow-visible p-8 sm:p-9 rounded-[32px] bg-zinc-950/40 border border-white/[0.04] hover:border-rose-500/20 hover:bg-zinc-950/70 transition-all duration-700 flex flex-col justify-between space-y-8 shadow-2xl hover:shadow-[0_0_50px_-12px_rgba(244,63,94,0.18)] hover:-translate-y-1.5">
              {/* Backglow blur-glow */}
              <div className="absolute -inset-2 rounded-[34px] bg-rose-500/10 opacity-0 group-hover:opacity-100 blur-3xl transition-all duration-700 pointer-events-none" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[10px] font-sans tracking-[0.18em] text-rose-400 font-black uppercase">CHROMATIC MODE</span>
                  </div>
                  <span className="text-[9px] text-rose-450 font-bold uppercase bg-rose-500/5 px-2.5 py-1 rounded-full border border-rose-500/10">ALTERATIONS & EXTENSIONS</span>
                </div>
                
                <h4 className="text-xl font-bold text-white uppercase font-display tracking-tight group-hover:text-rose-400 transition-colors duration-300">Complex Structures & Extensions</h4>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  Push past the standard scale. This mode trains you across all 12 chromatic tones, including the colorful extensions of modern jazz: 9ths (9, ♭9, ♯9), 11ths (11, ♯11), and 13ths (13, ♭13). Perfect for navigating altered chords with absolute confidence.
                </p>
              </div>

              {/* iPhone 3D Mockup */}
              <div className="relative z-10 flex justify-center py-4">
                <InteractiveIPhoneMockup 
                  title="Chromatic Extensions"
                  subtitle="Key of F♯ Alt"
                  badge="CHROMATIC"
                  badgeColor="rose"
                  modeType="chromatic"
                  score="+920 XP"
                  streak="12 Days"
                  timer="0:08"
                />
              </div>
            </div>

            {/* 3. MODALITÀ INVERSA */}
            <div className="relative group overflow-visible p-8 sm:p-9 rounded-[32px] bg-zinc-950/40 border border-white/[0.04] hover:border-purple-500/20 hover:bg-zinc-950/70 transition-all duration-700 flex flex-col justify-between space-y-8 shadow-2xl hover:shadow-[0_0_50px_-12px_rgba(168,85,247,0.18)] hover:-translate-y-1.5">
              {/* Backglow blur-glow */}
              <div className="absolute -inset-2 rounded-[34px] bg-purple-500/10 opacity-0 group-hover:opacity-100 blur-3xl transition-all duration-700 pointer-events-none" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-[10px] font-sans tracking-[0.18em] text-purple-400 font-black uppercase">REVERSE MODE</span>
                  </div>
                  <span className="text-[9px] text-purple-400 font-bold uppercase bg-purple-500/5 px-2.5 py-1 rounded-full border border-purple-500/10">REVERSE DIRECTIONALITY</span>
                </div>
                
                <h4 className="text-xl font-bold text-white uppercase font-display tracking-tight group-hover:text-purple-400 transition-colors duration-300">From Keyboard Key to Scale Degree</h4>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  The app flips your perspective: given a locked key and a specific physical note, it challenges you to guess which scale degree it represents (e.g., in the key of B-flat, G is the major 6th). Train your brain to convert absolute pitches to scale numbers instantly.
                </p>
              </div>

              {/* iPhone 3D Mockup */}
              <div className="relative z-10 flex justify-center py-4">
                <InteractiveIPhoneMockup 
                  title="Reverse Translation"
                  subtitle="Key of A♭ Maj"
                  badge="REVERSE"
                  badgeColor="purple"
                  modeType="inverse"
                  score="+1,450 XP"
                  streak="21 Days"
                  timer="0:03"
                />
              </div>
            </div>

            {/* 4. MODALITÀ TASTIERA INTERATTIVA */}
            <div className="relative group overflow-visible p-8 sm:p-9 rounded-[32px] bg-zinc-950/40 border border-white/[0.04] hover:border-cyan-500/20 hover:bg-zinc-950/70 transition-all duration-700 flex flex-col justify-between space-y-8 shadow-2xl hover:shadow-[0_0_50px_-12px_rgba(6,182,212,0.18)] hover:-translate-y-1.5">
              {/* Backglow blur-glow */}
              <div className="absolute -inset-2 rounded-[34px] bg-cyan-500/10 opacity-0 group-hover:opacity-100 blur-3xl transition-all duration-700 pointer-events-none" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.04] pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[10px] font-sans tracking-[0.18em] text-cyan-455 font-black uppercase">INTERACTIVE KEYBOARD</span>
                  </div>
                  <span className="text-[9px] text-cyan-400 font-bold uppercase bg-cyan-500/5 px-2.5 py-1 rounded-full border border-cyan-500/10">TACTILE INTERFACE</span>
                </div>
                
                <h4 className="text-xl font-bold text-white uppercase font-display tracking-tight group-hover:text-cyan-400 transition-colors duration-300">Tactile & Visual Feedback</h4>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  Use the integrated virtual keyboard to tap answers and see them light up before your eyes. This module anchors the synaptic connection between scale degrees and their physical layout on the white and black keys.
                </p>
              </div>

              {/* iPhone 3D Mockup */}
              <div className="relative z-10 flex justify-center py-4">
                <InteractiveIPhoneMockup 
                  title="Visual Keyboard"
                  subtitle="Tactile Interface"
                  badge="KEYBOARD MOCK"
                  badgeColor="cyan"
                  modeType="piano"
                  score="+3,120 XP"
                  streak="Continuous"
                  timer="FREEPLAY"
                />
              </div>
            </div>

          </div>
        </div>

        {/* 4. EXPLANATION OF TRANSFORMATION (BEFORE & AFTER COGNITIVE PIPELINE) */}
        <div className="relative group overflow-hidden p-8 sm:p-14 rounded-[40px] bg-gradient-to-b from-zinc-950/70 via-zinc-950/40 to-zinc-950/80 border border-white/[0.04] transition-all duration-700 hover:border-[#e5a93c]/20 hover:shadow-[0_0_80px_-15px_rgba(229,169,60,0.15)]">
          {/* Deluxe light effects & deep radial ambient highlights */}
          <div className="absolute -inset-3 rounded-[48px] bg-gradient-to-tr from-purple-500/10 via-transparent to-amber-500/8 opacity-50 blur-3xl pointer-events-none group-hover:opacity-85 transition-all duration-700" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-amber-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            <div className="lg:col-span-5 space-y-8 text-left">
              <div className="space-y-4">

                
                <h3 className="text-3xl sm:text-5xl font-black text-white font-display uppercase tracking-tight leading-[1.05]">
                  The Cognitive <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5a93c] via-rose-400 to-purple-400">
                    Revolution
                  </span>
                </h3>
              </div>
              
              <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                When you adopt the Improvy methodology, you leave behind the exhausting analog process, replacing it with an instant, geometric projection of the entire keyboard.
              </p>

              <div className="space-y-5 pt-3">
                {[
                  {
                    num: "01",
                    color: "text-[#e5a93c] border-[#e5a93c]/20 bg-[#e5a93c]/5 shadow-[0_0_15px_rgba(229,169,60,0.05)]",
                    title: "Eliminating Mnemonic Calculation",
                    text: "Stop counting half-steps or physical keys. Your brain responds by pure conditioned response."
                  },
                  {
                    num: "02",
                    color: "text-rose-400 border-rose-500/20 bg-rose-500/5 shadow-[0_0_15px_rgba(244,63,94,0.05)]",
                    title: "Active Pre-Visualization",
                    text: "The shape of the scale or chord flashes in your mind a split second before you even play it."
                  },
                  {
                    num: "03",
                    color: "text-purple-400 border-purple-500/20 bg-purple-500/5 shadow-[0_0_15px_rgba(168,85,247,0.05)]",
                    title: "Fluid Performance in All Keys",
                    text: "Glide through altered chords, complex arpeggios, and extensions without rigid visual blocks."
                  }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start group/step">
                    <span className={`w-9 h-9 rounded-xl border flex items-center justify-center font-sans text-xs font-black shrink-0 transition-all duration-300 group-hover/step:scale-110 group-hover/step:shadow-md ${step.color}`}>
                      {step.num}
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-white text-xs sm:text-sm font-bold tracking-wide transition-colors group-hover/step:text-[#e5a93c]">
                        {step.title}
                      </h4>
                      <p className="text-zinc-400 text-[11px] sm:text-xs font-light leading-relaxed">
                        {step.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-8">
              
              {/* Box Prima */}
              <div className="relative group/box overflow-hidden p-6 sm:p-7 rounded-3xl bg-zinc-950/40 border border-rose-500/10 shadow-[inset_0_0_20px_rgba(239,68,68,0.01)] hover:border-rose-500/25 hover:bg-zinc-950/65 transition-all duration-500">
                {/* Edge luminosity light for Prima */}
                <div className="absolute inset-0 rounded-3xl border pointer-events-none transition-all duration-500 opacity-20 group-hover/box:opacity-40"
                  style={{
                    boxShadow: "inset 0 0 15px rgba(244,63,94,0.1)",
                    borderColor: "rgba(244,63,94,0.15)"
                  }}
                />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                      <span className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-[#f44766]">BEFORE</span>
                    </div>
                    <span className="text-[9px] font-sans text-zinc-500 tracking-widest font-bold uppercase">THE ANALOG MINDSET</span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                      Under the illusion of improvising, you navigate by trial and error. To find a flat 13th starting from F-sharp, your brain laboriously counts keys and forces theoretical calculations, breaking your inner groove and rhythm.
                    </p>
                  </div>

                  {/* Red/Amber Warning Accent bar */}
                  <div className="flex gap-2.5 items-center bg-rose-500/[0.03] border border-rose-500/10 rounded-xl p-3">
                    <X className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="text-[10px] text-zinc-400 font-sans tracking-wide font-bold">
                      PROCESSING LATENCY: HIGH (~3-5 SECONDS HESITATION)
                    </span>
                  </div>
                </div>
              </div>

              {/* Luminous interactive bridge connection bar with premium down arrow */}
              <div className="flex justify-center relative py-4 select-none">
                {/* Neon core vertical flow line */}
                <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-rose-500/80 via-[#e5a93c] to-emerald-500/80 opacity-60" />
                
                {/* Luxurious orbital ring structure */}
                <div className="relative z-10 group/arrow-btn flex items-center justify-center">
                  {/* Surrounding radar wave pulse */}
                  <div className="absolute inset-0 rounded-full bg-[#e5a93c]/10 blur-md scale-125 animate-pulse" />
                  
                  {/* Decorative rotating glass helper ring */}
                  <div className="absolute -inset-1.5 rounded-full border border-dashed border-[#e5a93c]/20 animate-spin-slow group-hover/arrow-btn:border-emerald-500/30" />
                  
                  {/* Main button anchor */}
                  <div className="relative w-12 h-12 rounded-full bg-gradient-to-b from-zinc-900 to-black border border-white/[0.08] flex items-center justify-center shadow-[0_0_30px_rgba(229,169,60,0.25)] hover:shadow-[0_0_45px_rgba(16,185,129,0.35)] hover:scale-115 hover:border-emerald-500/40 transition-all duration-500 ease-out cursor-pointer">
                    
                    {/* Inner glowing core */}
                    <div className="absolute inset-0.5 rounded-full bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none" />
                    
                    {/* Animated custom premium arrow */}
                    <ArrowDown className="w-5 h-5 text-[#e5a93c] group-hover/arrow-btn:text-emerald-400 group-hover/arrow-btn:translate-y-0.5 transition-all duration-300 animate-bounce" />
                  </div>
                </div>
              </div>

              {/* Box Dopo */}
              <div className="relative group/box overflow-hidden p-6 sm:p-7 rounded-3xl bg-zinc-950/60 border border-emerald-500/20 shadow-[inset_0_0_30px_rgba(16,185,129,0.05)] hover:border-emerald-500/40 hover:bg-zinc-950/80 transition-all duration-500">
                {/* Edge luminosity light for Dopo */}
                <div className="absolute inset-0 rounded-3xl border pointer-events-none transition-all duration-500 opacity-50 group-hover/box:opacity-90"
                  style={{
                    boxShadow: "inset 0 0 20px rgba(16,185,129,0.2), 0 0 40px -5px rgba(16,185,129,0.12)",
                    borderColor: "rgba(16,185,129,0.3)"
                  }}
                />
                
                {/* Backglow for the magical outcome */}
                <div className="absolute -inset-1 rounded-3xl bg-emerald-500/5 opacity-0 group-hover/box:opacity-100 blur-xl transition-all duration-500 pointer-events-none" />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2 justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      <span className="text-[10px] font-sans font-black uppercase tracking-[0.2em] text-[#2ce293]">AFTER</span>
                    </div>
                    <span className="text-[9px] font-sans text-[#2ce293] font-bold tracking-widest uppercase bg-[#10b981]/10 px-2.5 py-1 rounded border border-[#10b981]/15">
                      THE GEOMETRIC MIND
                    </span>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-zinc-100 font-light leading-relaxed">
                    Keys instantly <span className="text-emerald-400 font-bold">"light up"</span> on the spatial grid projected in your mind. No more disconnected black or white keys; instead, you see clear interval maps and play whatever melody you hear in all keys in real time.
                  </p>



                  <div className="flex gap-2.5 items-center bg-emerald-500/[0.03] border border-emerald-500/15 rounded-xl p-3 shadow-sm">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-[10px] text-zinc-300 font-sans tracking-wide font-bold">
                      ACTIVE VISUALIZATION STABILIZED & 100% SECURE
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Bottom CTA block - Deluxe Premium Redesign */}
        <div className="pt-16 pb-24 border-t border-white/[0.04] relative overflow-visible">
          {/* Cosmic radial glow on the root CTA sector */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-600/5 via-rose-500/5 to-amber-500/5 rounded-full blur-[140px] pointer-events-none select-none" />

          {/* Real-time Interactive Glowing Keys Logo in background layer - IDENTICAL IN SIZE AND BEHAVIOR TO MAIN SCREEN */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 pointer-events-none select-none flex items-center justify-center -z-10 overflow-visible">
            <div ref={logoRef} className="relative w-full max-w-6xl aspect-square overflow-hidden flex items-center justify-center">
              {/* LAYER 1: BASE DIM KEYS FOR DEPTH (0 opacity for absolute black when not hovering) */}
              <div className="absolute inset-0 select-none opacity-0 pointer-events-none">
                <svg
                  viewBox="0 0 512 512"
                  className="w-full h-full max-h-[1100px] object-contain absolute inset-0 select-none pointer-events-none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="bg-key-1-grad-dim" x1="256" y1="104" x2="256" y2="408" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#7e3ff2" />
                      <stop offset="50%" stopColor="#26bcff" />
                      <stop offset="100%" stopColor="#13f5ab" />
                    </linearGradient>
                    <linearGradient id="bg-key-2-grad-dim" x1="256" y1="104" x2="256" y2="408" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#923ff2" />
                      <stop offset="40%" stopColor="#668bf6" />
                      <stop offset="100%" stopColor="#85f33d" />
                    </linearGradient>
                    <linearGradient id="bg-key-3-grad-dim" x1="256" y1="104" x2="256" y2="408" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#d633af" />
                      <stop offset="45%" stopColor="#f5527a" />
                      <stop offset="100%" stopColor="#ecf52a" />
                    </linearGradient>
                    <linearGradient id="bg-key-4-grad-dim" x1="256" y1="104" x2="256" y2="408" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#f52d50" />
                      <stop offset="45%" stopColor="#fa7f23" />
                      <stop offset="100%" stopColor="#fbcb18" />
                    </linearGradient>
                  </defs>
                  
                  <path d="M 110,104 L 130,104 A 12,12 0 0 1 142,116 L 142,276 C 142,284 156,284 156,292 L 156,392 A 16,16 0 0 1 140,408 L 93,408 A 16,16 0 0 1 77,392 L 77,120 A 16,16 0 0 1 93,104 Z" fill="url(#bg-key-1-grad-dim)" />
                  <path d="M 196,104 L 223,104 A 12,12 0 0 1 235,116 L 235,276 C 235,284 249,284 249,292 L 249,392 A 16,16 0 0 1 233,408 L 186,408 A 16,16 0 0 1 170,392 L 170,292 C 170,284 184,284 184,276 L 184,116 A 12,12 0 0 1 196,104 Z" fill="url(#bg-key-2-grad-dim)" />
                  <path d="M 289,104 L 316,104 A 12,12 0 0 1 328,116 L 328,276 C 328,284 342,284 342,292 L 342,392 A 16,16 0 0 1 326,408 L 279,408 A 16,16 0 0 1 263,392 L 263,292 C 263,284 277,284 277,276 L 277,116 A 12,12 0 0 1 289,104 Z" fill="url(#bg-key-3-grad-dim)" />
                  <path d="M 382,104 L 419,104 A 16,16 0 0 1 435,120 L 435,392 A 16,16 0 0 1 419,408 L 372,408 A 16,16 0 0 1 356,392 L 356,292 C 356,284 370,284 370,276 L 370,116 A 12,12 0 0 1 382,104 Z" fill="url(#bg-key-4-grad-dim)" />
                </svg>
              </div>

              {/* LAYER 2: INTERACTIVE ILLUMINATED MULTI-COLOR KEYS (Responsive to hover & coordinates) */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  opacity: isHoveringLogo ? 1.0 : 0,
                  filter: isHoveringLogo ? "saturate(1.45)" : "none",
                  maskImage: `radial-gradient(ellipse 35% 35% at ${mousePct.x}% ${mousePct.y}%, black 0%, rgba(0, 0, 0, 0.8) 25%, rgba(0, 0, 0, 0.45) 55%, rgba(0, 0, 0, 0.12) 80%, transparent 100%)`,
                  WebkitMaskImage: `radial-gradient(ellipse 35% 35% at ${mousePct.x}% ${mousePct.y}%, black 0%, rgba(0, 0, 0, 0.8) 25%, rgba(0, 0, 0, 0.45) 55%, rgba(0, 0, 0, 0.12) 80%, transparent 100%)`,
                  transition: "opacity 0.4s ease-out, filter 0.3s ease-out"
                }}
                className="absolute inset-0 select-none pointer-events-none"
              >
                <svg
                  viewBox="0 0 512 512"
                  className="w-full h-full max-h-[1100px] object-contain absolute inset-0 select-none pointer-events-none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="bg-key-1-grad-why" x1="256" y1="104" x2="256" y2="408" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#7e3ff2" />
                      <stop offset="50%" stopColor="#26bcff" />
                      <stop offset="100%" stopColor="#13f5ab" />
                    </linearGradient>
                    <linearGradient id="bg-key-2-grad-why" x1="256" y1="104" x2="256" y2="408" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#923ff2" />
                      <stop offset="40%" stopColor="#668bf6" />
                      <stop offset="100%" stopColor="#85f33d" />
                    </linearGradient>
                    <linearGradient id="bg-key-3-grad-why" x1="256" y1="104" x2="256" y2="408" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#d633af" />
                      <stop offset="45%" stopColor="#f5527a" />
                      <stop offset="100%" stopColor="#ecf52a" />
                    </linearGradient>
                    <linearGradient id="bg-key-4-grad-why" x1="256" y1="104" x2="256" y2="408" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#f52d50" />
                      <stop offset="45%" stopColor="#fa7f23" />
                      <stop offset="100%" stopColor="#fbcb18" />
                    </linearGradient>
                  </defs>

                  <path d="M 110,104 L 130,104 A 12,12 0 0 1 142,116 L 142,276 C 142,284 156,284 156,292 L 156,392 A 16,16 0 0 1 140,408 L 93,408 A 16,16 0 0 1 77,392 L 77,120 A 16,16 0 0 1 93,104 Z" fill="url(#bg-key-1-grad-why)" />
                  <path d="M 196,104 L 223,104 A 12,12 0 0 1 235,116 L 235,276 C 235,284 249,284 249,292 L 249,392 A 16,16 0 0 1 233,408 L 186,408 A 16,16 0 0 1 170,392 L 170,292 C 170,284 184,284 184,276 L 184,116 A 12,12 0 0 1 196,104 Z" fill="url(#bg-key-2-grad-why)" />
                  <path d="M 289,104 L 316,104 A 12,12 0 0 1 328,116 L 328,276 C 328,284 342,284 342,292 L 342,392 A 16,16 0 0 1 326,408 L 279,408 A 16,16 0 0 1 263,392 L 263,292 C 263,284 277,284 277,276 L 277,116 A 12,12 0 0 1 289,104 Z" fill="url(#bg-key-3-grad-why)" />
                  <path d="M 382,104 L 419,104 A 16,16 0 0 1 435,120 L 435,392 A 16,16 0 0 1 419,408 L 372,408 A 16,16 0 0 1 356,392 L 356,292 C 356,284 370,284 370,276 L 370,116 A 12,12 0 0 1 382,104 Z" fill="url(#bg-key-4-grad-why)" />
                </svg>
              </div>
            </div>
          </div>

          <div className="relative text-center max-w-3xl mx-auto w-full z-10">

            <div className="space-y-8 relative z-10">
              


              {/* Title & Description */}
              <div className="space-y-4 max-w-2xl mx-auto">
                <h3 className="text-3xl sm:text-5xl font-black text-white font-display uppercase tracking-tight leading-none">
                  Ready to Transform Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5a93c] via-rose-400 to-purple-400">
                    Musical Instinct?
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed max-w-lg mx-auto">
                  Training takes just a few minutes a day. It is the perfect cognitive bridge that permanently changes your perception and unlocks true improvisational freedom.
                </p>
              </div>

              {/* Ultra-luxe features grid inside the CTA box */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-xl mx-auto pt-2 border-t border-white/[0.04]">
                {[
                  {
                    icon: <Check className="w-3.5 h-3.5 text-emerald-400" />,
                    title: "No Subscription"
                  },
                  {
                    icon: <Check className="w-3.5 h-3.5 text-emerald-400" />,
                    title: "Proven Results"
                  },
                  {
                    icon: <Check className="w-3.5 h-3.5 text-emerald-400" />,
                    title: "Zero Setup"
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 py-1.5">
                    <div className="w-5.5 h-5.5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-white tracking-wide uppercase font-sans">
                      {item.title}
                    </h4>
                  </div>
                ))}
              </div>

              {/* Deluxe Trigger button */}
              <div className="pt-2">
                <button
                  onClick={onBack}
                  className="relative overflow-hidden px-10 py-5 rounded-2xl bg-gradient-to-r from-[#e5a93c] via-rose-500 to-purple-600 bg-[length:100%_auto] hover:bg-[length:200%_auto] hover:animate-rainbow-shift text-black font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 cursor-pointer active:scale-95 shadow-2xl hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(229,169,60,0.35)] font-sans group/btn"
                  id="start-training-btn-bottom"
                >
                  {/* Sliding glossy reflection sweep */}
                  <span className="absolute inset-0 w-1/2 h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover/btn:animate-shine pointer-events-none" />
                  
                  {/* Double border layer inside */}
                  <span className="absolute inset-0.5 rounded-[14px] border border-white/20 pointer-events-none" />

                  <span className="relative z-10 flex items-center justify-center gap-2">
                    RETURN HOME & START TRAINING NOW
                    <Sparkle className="w-3.5 h-3.5 text-black shrink-0 animate-pulse" />
                  </span>
                </button>
              </div>

            </div>
          </div>
        </div>

      </motion.div>

    </div>
  );
}
