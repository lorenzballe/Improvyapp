import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  KEYS_BY_FOURTHS,
  QUALITIES,
  chordOnDegree,
  degreeColor,
  degreeInk,
  degreeLabel,
  noteName,
  scaleOnDegree,
  type Tone,
} from "../../lib/harmony";
import { HarmonyKeyboard, type KeyLight } from "./HarmonyKeyboard";
import { useTicker } from "./useTicker";

type View = "chords" | "scales";
type Frame = "own" | "key";

const HOLD_MS = 2600;
const DEGREES = [1, 2, 3, 4, 5, 6, 7];

/**
 * The page's centrepiece: every chord and every scale of a key, lit up on the
 * keyboard with their numbers. It plays the seven chords of the key, then its
 * seven scales, then moves round the circle of fourths. The reader can count
 * the numbers from the chord or scale's own root or from the key, and change
 * the key to watch the notes move while the numbers stay.
 */
export function HarmonyLens({ compact = false }: { compact?: boolean }) {
  const reduce = useReducedMotion();
  const [pos, setPos] = useState<{ key: number; view: View; step: number }>({ key: 0, view: "chords", step: 0 });
  const [frame, setFrame] = useState<Frame>("own");
  const [steering, setSteering] = useState(false);
  const { ref, tick, running } = useTicker(HOLD_MS, steering);

  useEffect(() => {
    if (tick === 0) return;
    setPos((p) =>
      p.step < 6
        ? { ...p, step: p.step + 1 }
        : p.view === "chords"
          ? { ...p, view: "scales", step: 0 }
          : { key: (p.key + 1) % 12, view: "chords", step: 0 }
    );
  }, [tick]);

  const keyName = KEYS_BY_FOURTHS[pos.key];
  const degree = pos.step + 1;
  const isChord = pos.view === "chords";
  const item = isChord ? chordOnDegree(keyName, degree) : scaleOnDegree(keyName, degree);
  const rootName = noteName(item.root);
  const suffix = "quality" in item ? QUALITIES[item.quality].symbol : item.mode.name;
  const caption = "quality" in item ? QUALITIES[item.quality].name : item.mode.character;

  const degreeIn = (t: Tone) => (frame === "own" ? t.ownDegree : t.keyDegree);
  const lights: KeyLight[] = item.tones.map((t, i) => ({
    id: `${keyName}-${pos.view}-${degree}-${frame}-${t.position}`,
    position: t.position,
    color: degreeColor(degreeIn(t)),
    ink: degreeInk(degreeIn(t)),
    label: degreeLabel(degreeIn(t)),
    name: noteName(t.note),
    order: i,
  }));
  // The glow behind the keyboard takes the colour of the root's place in the key.
  const glow = degreeColor(item.tones[0].keyDegree);
  // A scale's numbers without its octave on top: seven, as it is written.
  const numbers = item.tones
    .slice(0, isChord ? undefined : 7)
    .map((t) => degreeLabel(degreeIn(t)))
    // En spaces: they keep their width where ordinary spaces would collapse.
    .join("\u2002");

  const steer = (next: Partial<typeof pos>) => {
    setSteering(true);
    setPos((p) => ({ ...p, ...next }));
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative overflow-hidden rounded-[32px] border border-white/[0.07] bg-[#0b0716]/75 backdrop-blur-2xl",
        compact ? "p-5 sm:p-6" : "p-5 sm:p-8 md:p-10",
        "shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]"
      )}
    >
      {/* Ambient light in the colour of the root. */}
      <motion.div
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full blur-[110px]"
        animate={{ backgroundColor: glow, opacity: 0.22 }}
        transition={{ duration: reduce ? 0 : 0.9, ease: "easeOut" }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/[0.04]" />

      <div className="relative z-10">
        {/* Chords or scales, and the play button. */}
        <div className="flex items-center justify-between gap-3">
          <LayoutGroup id={compact ? "lens-view-compact" : "lens-view"}>
            <div className="relative grid grid-cols-2 rounded-full border border-white/[0.08] bg-black/40 p-1">
              {(["chords", "scales"] as View[]).map((v) => (
                <button
                  key={v}
                  onClick={() => !compact && steer({ view: v })}
                  tabIndex={compact ? -1 : 0}
                  className={cn(
                    "relative z-10 rounded-full px-4 sm:px-5 py-1.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.18em] transition-colors focus:outline-none",
                    compact ? "cursor-default" : "cursor-pointer",
                    pos.view === v ? "text-zinc-950" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {pos.view === v && (
                    <motion.span
                      layoutId="lens-view-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white shadow-[0_0_18px_rgba(255,255,255,0.25)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  {v === "chords" ? "Chords" : "Scales"}
                </button>
              ))}
            </div>
          </LayoutGroup>
          {!compact && (
            <button
              onClick={() => setSteering((s) => !s)}
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white cursor-pointer focus:outline-none"
              aria-label={running ? "Pause the demo" : "Play the demo"}
            >
              {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{running ? "Pause" : "Play"}</span>
            </button>
          )}
        </div>

        {/* Which of the key's seven: built on 1, on 2 … */}
        <p className={cn("text-left text-[10px] font-extrabold uppercase tracking-[0.24em] text-zinc-500", compact ? "mt-4" : "mt-5 sm:mt-6")}>
          The seven {isChord ? "chords" : "scales"} of{" "}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={keyName}
              className="inline-block text-[#e5a93c]"
              initial={{ opacity: 0, y: reduce ? 0 : 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduce ? 0 : -6 }}
              transition={{ duration: 0.3 }}
            >
              {keyName} major
            </motion.span>
          </AnimatePresence>
        </p>
        <LayoutGroup id={compact ? "lens-steps-compact" : "lens-steps"}>
          <div className="mt-2.5 grid grid-cols-7 gap-1 sm:gap-2">
            {DEGREES.map((d) => {
              const active = d === degree;
              const color = degreeColor({ num: d, acc: 0 });
              const name = isChord ? chordOnDegree(keyName, d).symbol : scaleOnDegree(keyName, d).mode.name;
              return (
                <button
                  key={d}
                  onClick={() => !compact && steer({ step: d - 1 })}
                  tabIndex={compact ? -1 : 0}
                  aria-label={name}
                  className={cn(
                    "relative rounded-xl sm:rounded-2xl px-1 py-2 sm:py-2.5 text-center transition-colors focus:outline-none",
                    compact ? "cursor-default" : "cursor-pointer",
                    active ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="lens-step"
                      className="absolute inset-0 rounded-xl sm:rounded-2xl border bg-white/[0.06]"
                      style={{ borderColor: color + "66", boxShadow: `0 0 18px ${color}33` }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span
                    className="relative block text-sm sm:text-lg font-black tabular-nums leading-none"
                    style={{ color: active ? degreeInk({ num: d, acc: 0 }) : undefined }}
                  >
                    {d}
                  </span>
                  {!compact && (
                    <span className="relative mt-1 hidden truncate text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.12em] opacity-70 sm:block">
                      {name}
                    </span>
                  )}
                  {active && (
                    <span className="absolute inset-x-2 sm:inset-x-3 bottom-1 h-[2px] overflow-hidden rounded-full bg-white/10">
                      <motion.span
                        key={`${keyName}-${pos.view}-${degree}-${running}`}
                        className="block h-full rounded-full bg-gradient-to-r from-[#e5a93c] via-rose-500 to-purple-500"
                        initial={{ width: running ? "0%" : "100%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: running ? HOLD_MS / 1000 : 0, ease: "linear" }}
                      />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        {/* The chord or scale, written the way a chart writes it. */}
        <div className={cn("flex flex-col items-center", compact ? "mt-4" : "mt-6 sm:mt-8")}>
          <div className={cn("relative flex w-full items-center justify-center", compact ? "h-[54px]" : "h-[64px] sm:h-[96px]")}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={`${pos.view}-${rootName}-${suffix}`}
                className="flex items-start whitespace-nowrap font-display font-black text-white leading-none tracking-tight"
                initial={{ opacity: 0, y: reduce ? 0 : 16, filter: reduce ? "none" : "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: reduce ? 0 : -16, filter: reduce ? "none" : "blur(10px)" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                {isChord ? (
                  <>
                    <span className={compact ? "text-5xl" : "text-6xl sm:text-8xl"}>{rootName}</span>
                    <span
                      className={cn(
                        "text-transparent bg-clip-text bg-gradient-to-br from-[#e5a93c] via-rose-400 to-purple-400",
                        compact ? "mt-1 text-2xl" : "mt-1 sm:mt-2 text-3xl sm:text-5xl"
                      )}
                    >
                      {suffix}
                    </span>
                  </>
                ) : (
                  <span className={cn("flex items-baseline gap-2 sm:gap-4", compact ? "text-[26px] sm:text-4xl" : "text-[32px] sm:text-6xl")}>
                    <span>{rootName}</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#e5a93c] via-rose-400 to-purple-400 pb-1">
                      {suffix}
                    </span>
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={caption}
              className="mt-1.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.22em] text-zinc-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {caption}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* The keyboard. */}
        <div className={cn("mx-auto max-w-[880px]", compact ? "mt-2" : "-mx-2 mt-3 sm:mx-auto sm:mt-5")}>
          <HarmonyKeyboard lights={lights} size={compact ? "sm" : "lg"} />
        </div>

        {!compact && (
          <>
            {/* Two ways to count the same notes. */}
            <div className="mt-6 sm:mt-8 flex flex-col items-center gap-4">
              <div className="relative grid w-full max-w-[420px] grid-cols-2 rounded-2xl border border-white/[0.07] bg-black/40 p-1">
                {(["own", "key"] as Frame[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFrame(f)}
                    className={cn(
                      "relative z-10 rounded-xl py-2.5 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.18em] transition-colors cursor-pointer focus:outline-none",
                      frame === f ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {frame === f && (
                      <motion.span
                        layoutId="lens-frame"
                        className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-purple-600/70 to-indigo-600/70 shadow-[0_4px_20px_rgba(124,58,237,0.35)]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    {/* On a phone the toggle is too narrow for the whole label. */}
                    <span className="hidden sm:inline">Numbers </span>
                    {f === "key" ? "in the key" : isChord ? "in the chord" : "in the scale"}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={`${frame}-${pos.view}-${keyName}-${degree}`}
                  className="min-h-[2.5rem] max-w-[560px] text-center text-xs sm:text-sm font-light leading-relaxed text-zinc-400"
                  initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -6 }}
                  transition={{ duration: 0.25 }}
                >
                  {frame === "own" ? (
                    <>
                      <strong className="font-semibold text-white">{item.symbol}</strong> is{" "}
                      <strong className="font-semibold text-white">{numbers}</strong> —{" "}
                      {isChord ? <>a {caption}, in any key.</> : <>{caption.charAt(0).toLowerCase() + caption.slice(1)}, in any key.</>}
                    </>
                  ) : isChord ? (
                    <>
                      In {keyName} major, <strong className="font-semibold text-white">{item.symbol}</strong> sits on{" "}
                      <strong className="font-semibold text-white">{numbers}</strong> — and it does in every key.
                    </>
                  ) : (
                    <>
                      In {keyName} major, <strong className="font-semibold text-white">{item.symbol}</strong> plays the key's own
                      notes from {degree} up to {degree}: <strong className="font-semibold text-white">{numbers}</strong>.
                    </>
                  )}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Change the key: the notes move, the numbers stay. */}
            <div className="mt-6 sm:mt-8 border-t border-white/[0.06] pt-5 sm:pt-6">
              <p className="mb-3 text-center text-[10px] font-extrabold uppercase tracking-[0.24em] text-zinc-500">
                Change the key — the notes move, the numbers stay
              </p>
              <LayoutGroup id="lens-keys">
                <div className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:px-0">
                  <div className="mx-auto flex w-max gap-1.5 sm:gap-2">
                    {KEYS_BY_FOURTHS.map((k, i) => {
                      const active = i === pos.key;
                      return (
                        <button
                          key={k}
                          onClick={() => steer({ key: i })}
                          className={cn(
                            "relative h-9 min-w-[42px] sm:h-10 sm:min-w-[48px] rounded-xl px-2 text-[12px] sm:text-[13px] font-black transition-colors cursor-pointer focus:outline-none",
                            active ? "text-zinc-950" : "text-zinc-400 hover:text-white bg-white/[0.03] border border-white/[0.06]"
                          )}
                          aria-pressed={active}
                        >
                          {active && (
                            <motion.span
                              layoutId="lens-key"
                              className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#f3c66b] to-[#e5a93c] shadow-[0_0_20px_rgba(229,169,60,0.45)]"
                              transition={{ type: "spring", stiffness: 420, damping: 34 }}
                            />
                          )}
                          <span className="relative">{k}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </LayoutGroup>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
