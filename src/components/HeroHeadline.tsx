import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/** The verbs the second headline types, one after another. */
const WORDS = ["improvise", "visualize", "compose", "transpose"];

const HOLD_NUMBER_MS = 6000;
const TYPE_MS = 70;
const HOLD_WORD_MS = 1700;
const DELETE_MS = 28;

const GRADIENT =
  "italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#e5a93c] via-rose-500 to-purple-500 font-serif";
const EYEBROW =
  "text-[11px] sm:text-xs font-sans uppercase tracking-[0.24em] bg-gradient-to-r from-[#f43f5e] via-[#d946ef] to-[#6366f1] bg-clip-text text-transparent font-black";
const H1 = "font-display text-5xl sm:text-7xl xl:text-8xl font-extrabold text-white leading-[1.05] tracking-tight";

/**
 * The hero's headline, in two takes that alternate: what Improvy is ("Every
 * note is a number.") and what it is for ("Train your Mind to improvise…",
 * the verbs typed one after another, as the site has always done).
 *
 * Both takes are laid out in the same cell, so the block keeps the height of
 * the taller one and the text and the buttons below never move. The shorter
 * take sits at the bottom of the cell, against the line beneath it. Readers
 * and crawlers get one plain sentence instead; with reduced motion, the first
 * take stays.
 */
export function HeroHeadline() {
  const reduce = useReducedMotion();
  const [take, setTake] = useState<"number" | "train">("number");
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (reduce) return;
    let alive = true;
    const timers = new Set<number>();
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timers.delete(id);
          resolve();
        }, ms);
        timers.add(id);
      });
    (async () => {
      while (alive) {
        setTake("number");
        await wait(HOLD_NUMBER_MS);
        if (!alive) return;
        setTyped("");
        setTake("train");
        await wait(450);
        for (let i = 0; i < WORDS.length && alive; i++) {
          const w = WORDS[i];
          for (let c = 1; c <= w.length && alive; c++) {
            setTyped(w.slice(0, c));
            await wait(TYPE_MS);
          }
          await wait(HOLD_WORD_MS);
          // The last verb is not deleted: the whole take fades out instead.
          if (i < WORDS.length - 1) {
            for (let c = w.length - 1; c >= 0 && alive; c--) {
              setTyped(w.slice(0, c));
              await wait(DELETE_MS);
            }
            await wait(160);
          }
        }
      }
    })();
    return () => {
      alive = false;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [reduce]);

  const shown = (on: boolean, dir: 1 | -1) => ({
    opacity: on ? 1 : 0,
    y: on ? 0 : 18 * dir,
    filter: on ? "blur(0px)" : "blur(10px)",
  });
  const fade = { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div>
      <h1 className="sr-only">Every note is a number. Train your mind to improvise, visualize, compose and transpose in every key.</h1>
      <div className="grid" aria-hidden="true">
        {/* What Improvy is. */}
        <motion.div
          className="[grid-area:1/1] self-end space-y-8"
          initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          animate={shown(take === "number", -1)}
          transition={fade}
          style={{ pointerEvents: take === "number" ? "auto" : "none" }}
        >
          <p className={EYEBROW}>The scale-degree trainer for improvisers</p>
          <p className={H1}>
            Every note is
            <br />
            <span className={`${GRADIENT} pr-3`}>a number.</span>
          </p>
        </motion.div>

        {/* What it is for: the site's first headline, typed as it always was. */}
        <motion.div
          className="[grid-area:1/1] self-end space-y-8"
          initial={false}
          animate={shown(take === "train", 1)}
          transition={fade}
          style={{ pointerEvents: take === "train" ? "auto" : "none" }}
        >
          <p className={EYEBROW}>Now on iOS and Android — free to start</p>
          <p className={H1}>
            Train your
            <br />
            <HoverWord text="Mind" /> to
            <br />
            <TypedWord text={typed} />
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/** A word whose letters lift one after another under the pointer. */
function HoverWord({ text }: { text: string }) {
  const [hover, setHover] = useState(false);
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-block cursor-pointer font-extrabold text-white select-none whitespace-nowrap"
    >
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block text-white"
          animate={{ y: hover ? -6 : 0, scale: hover ? 1.15 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 12, delay: i * 0.03 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

/** The typed verb, with the site's glow, its sparkles and an amber cursor. */
function TypedWord({ text }: { text: string }) {
  return (
    <span className="relative inline-flex items-center pr-2">
      <span className="absolute inset-x-0 -inset-y-2 bg-gradient-to-r from-[#e5a93c]/20 via-rose-500/20 to-purple-600/20 rounded-full blur-xl opacity-80 animate-pulse pointer-events-none" />
      <Sparkle className="-top-4 -right-4 w-4 h-4 text-amber-300 drop-shadow-[0_0_8px_#e5a93c] animate-bounce" />
      <Sparkle className="-bottom-3 left-0 w-3.5 h-3.5 text-rose-400 drop-shadow-[0_0_6px_#f43f5e] animate-pulse" />
      <Sparkle className="-top-2 -left-4 w-3 h-3 text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)] animate-bounce [animation-delay:0.7s]" />
      <Sparkle className="-bottom-2 -right-1 w-3 h-3 text-purple-400 drop-shadow-[0_0_6px_#8b5cf6] animate-pulse [animation-duration:1.5s]" />
      {/* A zero-width space holds the line's height while the verb is empty. */}
      <span className={`${GRADIENT} relative`}>{text || "​"}</span>
      <span className="relative animate-pulse font-normal ml-0.5 font-sans" style={{ WebkitTextFillColor: "#e5a93c", color: "#e5a93c" }}>
        |
      </span>
    </span>
  );
}

function Sparkle({ className }: { className: string }) {
  return (
    <svg className={`absolute pointer-events-none ${className}`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
    </svg>
  );
}
