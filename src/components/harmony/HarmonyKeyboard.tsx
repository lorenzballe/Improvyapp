import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "../../lib/utils";

/**
 * A dark keyboard whose keys light up in the colour of their degree, with the
 * number floating above each lit key on a thin beam of light — the picture of
 * a note "lighting up in your mind" that the Method page talks about.
 *
 * Positions run 0 … (12 × octaves − 1) from the C at the left edge. Lights are
 * keyed by [id] so a new chord fades the old one out and arpeggiates the new
 * one in, root first.
 *
 * A black key's number floats one step higher than a white key's, the way the
 * keys themselves sit: two notes a semitone apart — every scale has them —
 * never cover each other, even on a phone.
 */

export interface KeyLight {
  /** Unique per light within a frame; a changed id re-animates the light. */
  id: string;
  position: number;
  color: string;
  ink: string;
  /** The number above the key: "1", "♭3", "♯11". */
  label: string;
  /** The note name inside the key: "E♭". */
  name?: string;
  /** Order of appearance, for the arpeggio. */
  order?: number;
}

const WHITE_OF: Record<number, number> = { 0: 0, 2: 1, 4: 2, 5: 3, 7: 4, 9: 5, 11: 6 };
// Black keys sit a little off the boundary between their white neighbours, as
// on a real keyboard: C♯ and F♯ lean left, D♯ and A♯ lean right.
const BLACK_AFTER: Record<number, { white: number; nudge: number }> = {
  1: { white: 0, nudge: -0.1 },
  3: { white: 1, nudge: 0.1 },
  6: { white: 3, nudge: -0.12 },
  8: { white: 4, nudge: 0 },
  10: { white: 5, nudge: 0.12 },
};

interface Geometry {
  isBlack: boolean;
  /** Left edge and width, in % of the keyboard's width. */
  left: number;
  width: number;
}

function geometry(position: number, whites: number): Geometry {
  const w = 100 / whites;
  const octave = Math.floor(position / 12);
  const s = ((position % 12) + 12) % 12;
  if (s in WHITE_OF) {
    return { isBlack: false, left: (octave * 7 + WHITE_OF[s]) * w, width: w };
  }
  const { white, nudge } = BLACK_AFTER[s];
  const bw = w * 0.6;
  return { isBlack: true, left: (octave * 7 + white + 1 + nudge) * w - bw / 2, width: bw };
}

export function HarmonyKeyboard({
  octaves = 2,
  lights,
  size = "lg",
  numbers = true,
  className,
}: {
  octaves?: number;
  lights: KeyLight[];
  size?: "lg" | "sm";
  /** The numbers above the keys; without them only the keys light up. */
  numbers?: boolean;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const whites = octaves * 7;
  const positions = Array.from({ length: octaves * 12 }, (_, i) => i);
  const whiteKeys = positions.filter((p) => !geometry(p, whites).isBlack);
  const blackKeys = positions.filter((p) => geometry(p, whites).isBlack);
  const byPosition = new Map(lights.map((l) => [l.position, l]));

  const lg = size === "lg";
  const keyH = lg ? "h-[118px] sm:h-[150px]" : "h-[74px]";
  const lane = lg ? "h-[60px] sm:h-[88px]" : "h-[50px]";
  const beam = (black: boolean) =>
    lg ? (black ? "h-[36px] sm:h-[52px]" : "h-[12px] sm:h-[16px]") : black ? "h-[28px]" : "h-[6px]";
  const stagger = (l: KeyLight) => (reduce ? 0 : (l.order ?? 0) * 0.09);

  return (
    <div className={cn("relative w-full select-none", className)} aria-hidden="true">
      {/* The lane above the keys, where the numbers float. */}
      {numbers && <div className={cn("relative w-full", lane)}>
        <AnimatePresence>
          {lights.map((l) => {
            const g = geometry(l.position, whites);
            const center = g.left + g.width / 2;
            return (
              <motion.div
                key={l.id}
                className="absolute bottom-0 flex flex-col items-center"
                style={{ left: `${center}%`, x: "-50%" }}
                initial={{ opacity: 0, y: reduce ? 0 : 10, scale: reduce ? 1 : 0.6 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: reduce ? 0 : -6, scale: reduce ? 1 : 0.8, transition: { duration: 0.18 } }}
                transition={{ type: "spring", stiffness: 420, damping: 24, delay: stagger(l) }}
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full font-black tabular-nums leading-none border backdrop-blur-sm",
                    lg ? "min-w-[22px] h-[22px] sm:min-w-[34px] sm:h-[34px] px-1 sm:px-1.5 text-[10px] sm:text-[14px]" : "min-w-[20px] h-[20px] px-1 text-[9px]"
                  )}
                  style={{
                    color: l.ink,
                    borderColor: l.color + "AA",
                    background: `radial-gradient(circle at 50% 30%, ${l.color}40, ${l.color}14 70%)`,
                    boxShadow: `0 0 18px ${l.color}66, inset 0 0 8px ${l.color}33`,
                  }}
                >
                  {l.label}
                </span>
                {/* The beam down to the key. */}
                <motion.span
                  className={cn("w-px origin-top", beam(g.isBlack))}
                  style={{ background: `linear-gradient(${l.color}, ${l.color}00)` }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.25, delay: stagger(l) + 0.08 }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>}

      {/* The keys. */}
      <div
        className={cn(
          "relative w-full rounded-b-[14px] overflow-hidden",
          keyH,
          "shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)]"
        )}
      >
        {/* The felt strip at the top of a real piano. */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-rose-500/60 via-purple-500/60 to-[#e5a93c]/60 z-30" />

        <div className="absolute inset-0 flex">
          {whiteKeys.map((p) => {
            const light = byPosition.get(p);
            return (
              <div
                key={p}
                className="relative h-full border-r border-black/50 last:border-r-0 rounded-b-[7px] overflow-hidden"
                style={{
                  width: `${100 / whites}%`,
                  background: "linear-gradient(180deg, #221c33 0%, #1b1629 55%, #15111f 100%)",
                  boxShadow: "inset 0 -6px 0 rgba(0,0,0,0.35), inset 1px 0 0 rgba(255,255,255,0.05)",
                }}
              >
                <AnimatePresence>
                  {light && (
                    <motion.div
                      key={light.id}
                      className="absolute inset-0 origin-bottom"
                      initial={{ opacity: 0, scaleY: reduce ? 1 : 0.2 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: stagger(light) }}
                      style={{
                        background: `linear-gradient(180deg, ${light.color}40 0%, ${light.color}8C 45%, ${light.color}E6 100%)`,
                        boxShadow: `inset 0 0 22px ${light.color}88, inset 0 -10px 18px ${light.color}`,
                      }}
                    >
                      {light.name && (
                        <span
                          className={cn(
                            "absolute inset-x-0 text-center font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]",
                            lg ? "bottom-2 sm:bottom-3 text-[9px] sm:text-[12px]" : "bottom-1 text-[8px]"
                          )}
                        >
                          {light.name}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {blackKeys.map((p) => {
          const g = geometry(p, whites);
          const light = byPosition.get(p);
          return (
            <div
              key={p}
              className="absolute top-0 h-[62%] rounded-b-[5px] z-20 overflow-hidden"
              style={{
                left: `${g.left}%`,
                width: `${g.width}%`,
                background: "linear-gradient(180deg, #050309 0%, #0b0812 70%, #15111f 100%)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.6), inset 0 -3px 0 rgba(255,255,255,0.04)",
              }}
            >
              <AnimatePresence>
                {light && (
                  <motion.div
                    key={light.id}
                    className="absolute inset-0 origin-bottom"
                    initial={{ opacity: 0, scaleY: reduce ? 1 : 0.2 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: stagger(light) }}
                    style={{
                      background: `linear-gradient(180deg, ${light.color}80 0%, ${light.color}D9 55%, ${light.color} 100%)`,
                      boxShadow: `0 0 18px ${light.color}AA`,
                    }}
                  >
                    {light.name && lg && (
                      <span className="hidden sm:block absolute inset-x-0 bottom-1.5 text-center text-[10px] font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)]">
                        {light.name}
                      </span>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
