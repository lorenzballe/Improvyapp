import React from "react";
import { motion } from "motion/react";
import { Music, Repeat, Sparkles, Headphones, Piano, Flame, type LucideIcon } from "lucide-react";

/**
 * The scrolling columns at the foot of the home page.
 *
 * They used to hold six reviews from people who do not exist, with stock
 * photos for faces. These cards say instead who Improvy is for and what it
 * does for them — same design, same motion. When there are real reviews,
 * with the reviewers' consent, they go here in the same shape.
 */
export interface Voice {
  text: string;
  who: string;
  what: string;
  icon: LucideIcon;
  tint: string;
}

export const voicesList: Voice[] = [
  {
    text: "Find the ♭7 of any key before the chord changes, not after it. Chromatic Mode drills every degree, with the 9, 11 and 13.",
    who: "For improvisers",
    what: "Chromatic Mode",
    icon: Music,
    tint: "from-purple-500 to-indigo-500",
  },
  {
    text: "Move a melody to a new key by keeping its numbers. Note to Number trains the direction you read in: a note, and the degree it is.",
    who: "For singers & arrangers",
    what: "Note to Number",
    icon: Repeat,
    tint: "from-emerald-400 to-teal-500",
  },
  {
    text: "Hear a melody note and know which keys it belongs to — the ♭3 of what? The question behind every reharmonisation.",
    who: "For songwriters",
    what: "…Of What?",
    icon: Sparkles,
    tint: "from-cyan-400 to-sky-500",
  },
  {
    text: "Train on the bus with the screen off: a voice asks the question, you answer in your head, the voice gives the note.",
    who: "For busy players",
    what: "Pocket Mode",
    icon: Headphones,
    tint: "from-indigo-400 to-violet-500",
  },
  {
    text: "Every scale degree on the keyboard, in all twelve keys, until your hand goes there before you have worked it out.",
    who: "For pianists",
    what: "Piano keyboard",
    icon: Piano,
    tint: "from-rose-500 to-pink-500",
  },
  {
    text: "A few minutes a day is enough: one Daily Challenge, the same for everyone, and a streak worth keeping.",
    who: "For every musician",
    what: "Daily Challenge",
    icon: Flame,
    tint: "from-amber-400 to-orange-500",
  },
];

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Voice[];
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
              {props.testimonials.map(({ text, who, what, icon: Icon, tint }, i) => (
                <div
                  className="p-8 sm:p-10 rounded-3xl bg-[#0b0617]/45 border border-white/5 backdrop-blur-3xl space-y-5 text-left hover:border-rose-500/20 transition-all duration-300 shadow-xl shadow-black/20"
                  key={`${index}-${i}`}
                >
                  <p className="text-xs sm:text-sm text-zinc-300 font-light leading-relaxed">{text}</p>
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${tint} flex items-center justify-center border border-white/10 shadow-lg shadow-black/30`}>
                      <Icon className="w-[18px] h-[18px] text-white" />
                    </div>
                    <div className="flex flex-col">
                      <div className="font-display font-bold text-white text-[11px] sm:text-xs tracking-wide">{who}</div>
                      <div className="text-[9.5px] font-sans font-medium text-zinc-500 uppercase tracking-widest mt-0.5">{what}</div>
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
