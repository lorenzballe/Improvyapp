import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Sparkles, Compass, Users, Mail, Feather } from "lucide-react";

interface AboutPageProps {
  onBack: () => void;
  scrollToSection?: "top" | "get-in-touch" | null;
  scrollTrigger?: number;
}

export default function AboutPage({ onBack, scrollToSection, scrollTrigger }: AboutPageProps) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (scrollToSection === "get-in-touch") {
      const isInitial = isFirstRender.current;
      isFirstRender.current = false;

      const performScroll = () => {
        const bottomY = document.documentElement.scrollHeight || document.body.scrollHeight;
        window.scrollTo({
          top: bottomY,
          behavior: isInitial ? "auto" : "smooth"
        });
      };

      if (isInitial) {
        // First mount should jump instantly (spawn directly at bottom) to feel immediate
        const timer = setTimeout(performScroll, 50);
        return () => clearTimeout(timer);
      } else {
        // Subsequent triggers scroll smoothly down immediately without any render delay
        performScroll();
      }
    } else if (scrollToSection === "top") {
      isFirstRender.current = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [scrollToSection, scrollTrigger]);

  return (
    <div className="w-full max-w-3xl mx-auto px-6 pt-28 pb-16 md:pt-36 md:pb-24 text-zinc-350 font-sans relative z-30">
      
      {/* Main Content Animation Wrapper */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-14 text-left"
      >
        
        {/* Header Block */}
        <div className="space-y-6 pb-10 border-b border-white/[0.08]">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#e5a93c]">
            THE IMPROVY INTENT
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight uppercase leading-[1.1] select-none">
            ABOUT <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5a93c] via-rose-500 to-purple-500">
              IMPROVY
            </span>
          </h1>
          <div className="space-y-4 text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-2xl pt-2">
            <p>
              Improvy is a music-learning company dedicated to musical fluency through ear training.
            </p>
            <p>
              We design innovative tools that help you play music the way you experience it—by feel and context—so you can play what you hear.
            </p>
          </div>
        </div>

        {/* Bulletproof Single Column Point-By-Point Layout */}
        <div className="space-y-12">
          
          {/* Section 1: Our Approach */}
          <div className="space-y-4 border-b border-white/[0.04] pb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-[#e5a93c]/90 leading-none">01</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">Our Approach</h2>
            </div>
            
            <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-6">
              
              {/* Point 1 */}
              <div className="space-y-1 border-l border-white/5 pl-4 py-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Feeling-first</h3>
                <p className="text-zinc-400">Start with raw experience, then name what you hear.</p>
              </div>

              {/* Point 2 */}
              <div className="space-y-1 border-l border-white/5 pl-4 py-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Context-driven</h3>
                <p className="text-zinc-400">Anchor your ear with a clear tonal center.</p>
              </div>

              {/* Point 3 */}
              <div className="space-y-1 border-l border-white/5 pl-4 py-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Learning-paths</h3>
                <p className="text-zinc-400">Follow a structured, step-by-step curriculum.</p>
              </div>

              {/* Point 4 */}
              <div className="space-y-1 border-l border-white/5 pl-4 py-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Thoughtful design</h3>
                <p className="text-zinc-400">An intuitive, beautiful UI to keep you in the flow-state.</p>
              </div>

              <div className="pt-4">
                <button 
                  onClick={onBack}
                  className="group inline-flex items-center gap-1.5 text-xs text-[#e5a93c] hover:text-white hover:underline transition-all duration-250 cursor-pointer"
                >
                  <span>Read More About the Method</span>
                  <Compass className="w-3.5 h-3.5 text-[#e5a93c] group-hover:rotate-45 transition-transform" />
                </button>
              </div>

            </div>
          </div>

          {/* Section 2: The Team */}
          <div className="space-y-4 border-b border-white/[0.04] pb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-rose-500/90 leading-none">02</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">The Team</h2>
            </div>
            
            <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-4">
              <p>Improvy is an independent project, created and developed by one person:</p>

              <div className="grid grid-cols-1 gap-4 pt-2">
                <div className="bg-zinc-950/40 border border-white/[0.04] p-5 rounded-xl space-y-1">
                  <h4 className="text-sm font-bold text-white">Lorenzo Ballestrazzi</h4>
                  <p className="text-xs text-zinc-450">A young Italian musician and the creator of Improvy.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Get in touch */}
          <div id="get-in-touch" className="space-y-4 pb-4 scroll-mt-28">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-purple-500/90 leading-none">03</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">Get in touch</h2>
            </div>
            
            <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-6">
              <p>To contact us directly, you can use the following emails:</p>

              {/* Support */}
              <div className="space-y-1 border-l border-white/5 pl-4 py-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Support</h3>
                <p className="text-zinc-400">If you have any issues with the website or app, please contact us at:</p>
                <a href="mailto:thebalecompany@gmail.com" className="text-[#e5a93c] hover:underline font-medium hover:text-white transition-colors">thebalecompany@gmail.com</a>
              </div>

              {/* Affiliates */}
              <div className="space-y-1 border-l border-white/5 pl-4 py-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Affiliates</h3>
                <p className="text-zinc-400">If you would like to partner with us or offer Improvy to your students, contact us at:</p>
                <a href="mailto:thebalecompany@gmail.com" className="text-[#e5a93c] hover:underline font-medium hover:text-white transition-colors">thebalecompany@gmail.com</a>
              </div>

              {/* Questions */}
              <div className="space-y-1 border-l border-white/5 pl-4 py-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Questions and greetings</h3>
                <p className="text-zinc-400">If you have any questions or would like to say hello, contact us at:</p>
                <a href="mailto:thebalecompany@gmail.com" className="text-[#e5a93c] hover:underline font-medium hover:text-white transition-colors">thebalecompany@gmail.com</a>
              </div>

            </div>
          </div>

        </div>

      </motion.div>
      
    </div>
  );
}
