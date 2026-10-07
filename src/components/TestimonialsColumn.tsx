import React from "react";
import { motion } from "motion/react";

export interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

export const testimonialsList: Testimonial[] = [
  {
    text: "Improvy is extremely effective. I have never seen anything like it. Thank you for this app.",
    name: "Sarah Fratai",
    role: "Theory & Ear Training · The Juilliard School",
    image: ""
  },
  {
    text: "The interface is fast, with no lag like you get with other similar apps. I like that there are no subscriptions — we're all tired of paying for everything every month by now. The keyboard maps are precise and help me see where my harmonic weak spots are. Sometimes the questions get too fast in advanced mode if you're already good, but I understand it's part of the challenge to push you further. Great work.",
    name: "Marco V.",
    role: "Producer & Sound Designer · Milan",
    image: ""
  },
  {
    text: "It truly works, and it's excellent, especially at the start. It really unlocks improvisation.",
    name: "Roberto Bisi",
    role: "Jazz Composition · Conservatorio Vecchi-Tonelli, Modena",
    image: ""
  },
  {
    text: "Measuring my processing lag has taught me to eliminate hesitation during live jazz improvisations. Absolutely indispensable.",
    name: "Alex Chen",
    role: "Bedroom Producer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&fit=crop"
  },
  {
    text: "It really helps you visualize. A tool that helps a lot with visualization.",
    name: "Esther Shanti",
    role: "Civica Scuola di Musica, Milan",
    image: ""
  },
  {
    text: "The ultimate tool for my daily cognitive alignment. It allows me to calculate and improvise through highly complex chord progressions in seconds with total awareness.",
    name: "David Martinez",
    role: "Session Bassist",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=256&fit=crop"
  }
];

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, name, role }, i) => (
                <div 
                  className="p-8 sm:p-10 rounded-3xl bg-[#0b0617]/45 border border-white/5 backdrop-blur-3xl space-y-5 text-left hover:border-rose-500/20 transition-all duration-300 shadow-xl shadow-black/20" 
                  key={`${index}-${i}`}
                >
                  <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                    "{text}"
                  </p>
                  <div className="flex items-center gap-3">
                    {/* Initials, not a photo: the portraits that stood here were
                        stock images of other people. A reviewer's own photo,
                        given with their consent, can replace this. */}
                    <div
                      aria-hidden
                      className="h-10 w-10 shrink-0 rounded-full border border-white/10 bg-gradient-to-br from-rose-500/80 via-purple-500/80 to-indigo-500/80 flex items-center justify-center font-display font-bold text-white text-[12px] tracking-wide"
                    >
                      {name.replace(/^Prof\.\s*/, "").split(/\s+/).map((w) => w[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex flex-col">
                      <div className="font-display font-bold text-white text-[11px] sm:text-xs tracking-wide">
                        {name}
                      </div>
                      <div className="text-[9.5px] font-sans font-medium text-zinc-500 uppercase tracking-widest mt-0.5">
                        {role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
