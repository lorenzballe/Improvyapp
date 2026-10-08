import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "../../lib/utils";
import {
  KEYS_BY_FOURTHS,
  MODES,
  QUALITIES,
  buildChord,
  buildScale,
  degreeColor,
  degreeInk,
  degreeLabel,
  noteName,
  parseDegree,
  parseNote,
  type Quality,
} from "../../lib/harmony";
import { HarmonyKeyboard } from "./HarmonyKeyboard";
import { useTicker } from "./useTicker";

/**
 * A degree chip that sits higher when the degree is raised and lower when it
 * is flattened — a ♭ you can see before you read it.
 */
function DegreeChip({ token, emphasis = false, size = "md" }: { token: string; emphasis?: boolean; size?: "md" | "sm" }) {
  const reduce = useReducedMotion();
  const d = parseDegree(token);
  const color = degreeColor(d);
  const lift = d.acc === 0 ? 0 : d.acc > 0 ? -7 : 7;
  return (
    <motion.div
      className={cn(
        "relative flex items-center justify-center rounded-xl border font-black tabular-nums [perspective:400px]",
        size === "md" ? "h-11 w-11 sm:h-12 sm:w-12 text-[13px] sm:text-[15px]" : "h-9 w-9 text-[12px]"
      )}
      animate={{
        y: reduce ? 0 : lift,
        borderColor: color + (emphasis ? "CC" : "55"),
        backgroundColor: color + (emphasis ? "2E" : "14"),
        boxShadow: emphasis ? `0 0 22px ${color}66` : `0 0 0px ${color}00`,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={token}
          style={{ color: degreeInk(d) }}
          initial={{ rotateX: reduce ? 0 : 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: reduce ? 0 : -90, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {token}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

// ── 1. Any chord, decoded ───────────────────────────────────────────────────

const QUALITY_CYCLE: Quality[] = ["maj7", "7", "m7", "m7♭5"];

export function ChordQualitiesDemo() {
  const reduce = useReducedMotion();
  const { ref, tick } = useTicker(2300);
  const quality = QUALITY_CYCLE[tick % QUALITY_CYCLE.length];
  const c = parseNote("C");
  const chord = buildChord(c, quality, c);
  const tokens = QUALITIES[quality].degrees;
  const base = QUALITIES.maj7.degrees;

  return (
    <div ref={ref} className="flex h-full flex-col items-center justify-between gap-4">
      <div className="flex h-12 items-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={quality}
            className="flex items-start font-black leading-none text-white"
            initial={{ opacity: 0, y: reduce ? 0 : 10, filter: reduce ? "none" : "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: reduce ? 0 : -10, filter: reduce ? "none" : "blur(6px)" }}
            transition={{ duration: 0.35 }}
          >
            <span className="text-4xl">C</span>
            <span className="mt-0.5 text-xl text-transparent bg-clip-text bg-gradient-to-br from-[#e5a93c] to-rose-400">
              {QUALITIES[quality].symbol}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex gap-2 sm:gap-2.5 py-2">
        {tokens.map((t, i) => (
          <span key={i} className="contents">
            <DegreeChip token={t} emphasis={t !== base[i]} />
          </span>
        ))}
      </div>
      <div className="w-full max-w-[260px]">
        <HarmonyKeyboard
          octaves={1}
          size="sm"
          lights={chord.tones.map((t, i) => ({
            id: `${quality}-${t.position}`,
            position: t.position,
            color: degreeColor(t.ownDegree),
            ink: degreeInk(t.ownDegree),
            label: noteName(t.note),
            order: i,
          }))}
        />
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={quality}
          className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-zinc-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {QUALITIES[quality].name}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

// ── 2. Every scale, in numbers ──────────────────────────────────────────────

export function ScaleMapDemo() {
  const reduce = useReducedMotion();
  const { ref, tick } = useTicker(2500);
  const mode = MODES[tick % MODES.length];
  const ionian = MODES[1].degrees;
  const c = parseNote("C");
  // Seven notes on one octave: the octave on top would fall off the keyboard.
  const tones = buildScale(c, mode, c).tones.slice(0, 7);

  return (
    <div ref={ref} className="flex h-full flex-col items-center justify-between gap-4">
      <div className="flex h-12 flex-col items-center justify-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={mode.name}
            className="text-center"
            initial={{ opacity: 0, y: reduce ? 0 : 10, filter: reduce ? "none" : "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: reduce ? 0 : -10, filter: reduce ? "none" : "blur(6px)" }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-2xl font-black tracking-tight text-white">{mode.name}</p>
            <p className="mt-1 text-[11px] font-light text-zinc-400">{mode.character}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-1.5 sm:gap-2 py-2">
        {mode.degrees.map((t, i) => (
          <span key={i} className="contents">
            <DegreeChip token={t} size="sm" emphasis={t !== ionian[i]} />
          </span>
        ))}
      </div>

      <div className="w-full max-w-[260px]">
        <HarmonyKeyboard
          octaves={1}
          size="sm"
          numbers={false}
          lights={tones.map((t, i) => ({
            id: `${mode.name}-${t.position}`,
            position: t.position,
            color: degreeColor(t.ownDegree),
            ink: degreeInk(t.ownDegree),
            label: degreeLabel(t.ownDegree),
            name: noteName(t.note),
            order: i,
          }))}
        />
      </div>

      {/* Brighter to darker: the seven modes in order, one marker moving. */}
      <div className="w-full max-w-[260px]">
        <div className="relative h-2 rounded-full bg-gradient-to-r from-[#fde68a] via-[#e5a93c] via-40% to-[#4338ca]">
          <motion.span
            className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-white bg-[#0b0716] shadow-[0_0_14px_rgba(255,255,255,0.6)]"
            animate={{ left: `calc(${(mode.darkness / 6) * 100}% - 8px)` }}
            transition={{ type: "spring", stiffness: 160, damping: 20 }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[9px] font-extrabold uppercase tracking-[0.2em] text-zinc-500">
          <span>Brighter</span>
          <span>Darker</span>
        </div>
      </div>
    </div>
  );
}

// ── 3. Same numbers, any key ────────────────────────────────────────────────

export function KeysDemo() {
  const reduce = useReducedMotion();
  const { ref, tick } = useTicker(1900);
  const keyName = KEYS_BY_FOURTHS[tick % KEYS_BY_FOURTHS.length];
  const root = parseNote(keyName);
  const chord = buildChord(root, "maj7", root);

  return (
    <div ref={ref} className="flex h-full flex-col items-center justify-between gap-4">
      <div className="flex h-12 items-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={keyName}
            className="flex items-start font-black leading-none text-white"
            initial={{ opacity: 0, y: reduce ? 0 : 10, filter: reduce ? "none" : "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: reduce ? 0 : -10, filter: reduce ? "none" : "blur(6px)" }}
            transition={{ duration: 0.35 }}
          >
            <span className="text-4xl">{keyName}</span>
            <span className="mt-0.5 text-xl text-transparent bg-clip-text bg-gradient-to-br from-[#e5a93c] to-rose-400">maj7</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="w-full">
        <HarmonyKeyboard
          size="sm"
          lights={chord.tones.map((t, i) => ({
            id: `${keyName}-${t.position}`,
            position: t.position,
            color: degreeColor(t.ownDegree),
            ink: degreeInk(t.ownDegree),
            label: degreeLabel(t.ownDegree),
            name: noteName(t.note),
            order: i,
          }))}
        />
      </div>
      <p className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-zinc-500">1 · 3 · 5 · 7, in all 12 keys</p>
    </div>
  );
}
