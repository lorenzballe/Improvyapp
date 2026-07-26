import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";

type Faq = { q: string; a: string };

/**
 * Objection-handling FAQ, closing the Method page: once the modes have been
 * explained, this answers what's left. Every answer describes what the app
 * actually does today.
 */
const FAQS: Faq[] = [
  {
    q: "Do I need to read sheet music?",
    a: "No. Improvy works entirely with note names and scale degrees — the numbers musicians actually think in. There's no notation to decode, so you can start on day one.",
  },
  {
    q: "Which instrument is it for?",
    a: "Any of them. Scale degrees are instrument-independent: the 3rd of B♭ is the same note whether you play piano, guitar, sax or sing. The on-screen keyboard is just a visual anchor — what you're training is the mental map you carry to your own instrument.",
  },
  {
    q: "Is this ear training?",
    a: "No, and that's the point. Ear training asks what you're hearing; Improvy trains the step right after it — instantly knowing where any degree lives in any key, so you can play the idea before the moment passes.",
  },
  {
    q: "Do I need my instrument to practise?",
    a: "Never. Every session is mental, so a queue or a commute is enough. Pocket Mode goes further: a voice calls the degrees and answers out loud, hands-free, even with the screen locked.",
  },
  {
    q: "How much time does it take?",
    a: "A few minutes. Sessions are short and self-contained on purpose — daily consistency builds this kind of recall far better than the occasional long practice.",
  },
  {
    q: "I'm a complete beginner. Is it too advanced?",
    a: "Start free in the key of C with the seven diatonic degrees, at the gentlest difficulty. The chromatic degrees, jazz extensions and faster timers are there when you want them, not before.",
  },
  {
    q: "What do I get for free?",
    a: "Diatonic training in the key of C, plus the …Of What? and Pocket modes in full. It's a real practice tool, not a demo — Pro adds the other 11 keys, Chromatic Mode with extensions, Note-to-Number, Custom Mode, adaptive difficulty and deep analytics.",
  },
  {
    q: "Why one payment instead of a subscription?",
    a: "Because this is a skill you build once and keep. Pro is a single in-app purchase through Apple or Google — no renewals, no expiry, and it restores free on any device you own.",
  },
  {
    q: "Do I need an account?",
    a: "No. Improvy has no sign-up and no login: your progress lives on your device, and the only data collected is anonymous usage that helps fix bugs — which you can switch off in Settings.",
  },
];

function FaqItem({ faq, isOpen, onToggle }: { faq: Faq; isOpen: boolean; onToggle: () => void }) {
  return (
    <div
      className={
        "group rounded-2xl border transition-all duration-300 " +
        (isOpen
          ? "bg-white/[0.04] border-[#e5a93c]/25"
          : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.14]")
      }
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-5 text-left px-5 sm:px-7 py-5 cursor-pointer focus:outline-none"
      >
        <span
          className={
            "text-sm sm:text-base font-semibold transition-colors duration-200 " +
            (isOpen ? "text-white" : "text-zinc-200 group-hover:text-white")
          }
        >
          {faq.q}
        </span>
        <span
          className={
            "shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 " +
            (isOpen
              ? "bg-[#e5a93c]/15 border-[#e5a93c]/40 rotate-45"
              : "border-white/15 group-hover:border-white/30")
          }
        >
          <Plus className={"w-3.5 h-3.5 " + (isOpen ? "text-[#e5a93c]" : "text-zinc-400")} />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 sm:px-7 pb-6 -mt-1 text-xs sm:text-[13.5px] text-zinc-400 font-light leading-relaxed max-w-3xl">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FaqSection({ onContact }: { onContact?: () => void }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="pt-24 pb-20 sm:pt-28 sm:pb-24 max-w-4xl mx-auto px-6 md:px-12 relative z-30 scroll-mt-6 bg-transparent"
    >
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight uppercase leading-none">
          COMMON{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500">
            QUESTIONS
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-xl mx-auto leading-relaxed">
          Everything worth knowing before you start training.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, i) => (
          <div key={faq.q}>
            <FaqItem faq={faq} isOpen={open === i} onToggle={() => setOpen(open === i ? null : i)} />
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-xs text-zinc-500 font-light">
          Still wondering about something?{" "}
          {onContact ? (
            <button
              onClick={onContact}
              className="text-[#e5a93c] hover:text-white hover:underline font-medium transition-colors cursor-pointer focus:outline-none"
            >
              Ask us directly
            </button>
          ) : (
            <a
              href="mailto:thebalecompany@gmail.com?subject=Improvy%20%E2%80%94%20a%20question"
              className="text-[#e5a93c] hover:text-white hover:underline font-medium transition-colors"
            >
              Ask us directly
            </a>
          )}
          {" "}— we answer every message.
        </p>
      </div>
    </section>
  );
}
