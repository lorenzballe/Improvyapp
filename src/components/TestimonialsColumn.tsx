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
    text: "Improvy's relational tuning has completely transformed my approach to improvisation. I can now visualize and calculate harmonic relationships instantly across the keyboard.",
    name: "Marco Valeri",
    role: "Jazz Pianist",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&h=256&fit=crop"
  },
  {
    text: "An extraordinarily polished application for avant-garde composition. The 12-tone relational processing system unlocks a stunning sense of spatial awareness.",
    name: "Elena Rossini",
    role: "Composer & Sound Designer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&fit=crop"
  },
  {
    text: "Measuring my processing lag has taught me to eliminate hesitation during live jazz improvisations. Absolutely indispensable.",
    name: "Alex Chen",
    role: "Bedroom Producer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&h=256&fit=crop"
  },
  {
    text: "I use Improvy daily with my Conservatory students. The seamless transition between melodic geometry and relational sound vectors is simply genius.",
    name: "Prof. Julian Sterling",
    role: "Harmony Professor",
    image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=256&h=256&fit=crop"
  },
  {
    text: "The dynamic visual curves and chromatic calibration offer a spectacular visual layer for composition. I have never seen anything like this.",
    name: "Charlotte Dubois",
    role: "Classical Violinist",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&fit=crop"
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
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div 
                  className="p-8 sm:p-10 rounded-3xl bg-[#0b0617]/45 border border-white/5 backdrop-blur-3xl space-y-5 text-left hover:border-rose-500/20 transition-all duration-300 shadow-xl shadow-black/20" 
                  key={`${index}-${i}`}
                >
                  <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">
                    "{text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      referrerPolicy="no-referrer"
                      className="h-10 w-10 rounded-full object-cover border border-white/10"
                    />
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
