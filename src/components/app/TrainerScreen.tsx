import { Fragment, useState, type CSSProperties, type ReactNode } from "react";
import { NoteText } from "./NoteText";
import { LEXEND, noteColor } from "./appColors";
import type { Feedback } from "./useTrainer";
import type { Question } from "../../lib/quiz";

/**
 * The app's trainer screen (lib/screens/trainer_screen.dart), drawn at the
 * app's own size — an iPhone's 402 points across — with its own type sizes,
 * radii and colours, and scaled as a whole to wherever it is shown. Drawn at
 * any other size, every number below would be a guess.
 */
export const SCREEN_W = 402;
export const SCREEN_H = 863;
/**
 * The phone's whole height. The screen above is its top 863 points — the
 * strip under the home indicator is left off — but whatever the app places by
 * the height of the screen (the lights behind it, the halo, the verdict card,
 * the input zone) is placed by this.
 */
const PHONE_H = 874;

const WHITE10 = "rgba(255,255,255,0.10)";
const ROSE = "#F43F5E";

/** Flutter blurs a shadow with a sigma of 0.57735 × its blurRadius + 0.5… */
const sigma = (blurRadius: number) => 0.57735 * blurRadius + 0.5;
/** …and a CSS shadow by half its length: the length that blurs the same. */
const blur = (blurRadius: number) => `${(2 * sigma(blurRadius)).toFixed(1)}px`;

/**
 * Letter spacing as Flutter sets it: half a step before each letter and half
 * after, where a browser puts the whole step after. Moved over by half a step,
 * the letters land where the app has them.
 */
const tracking = (spacing: number): CSSProperties => ({ letterSpacing: spacing, position: "relative", left: spacing / 2 });

/**
 * A line of text at [size] and Flutter's [height] factor (the app's default,
 * Material 3's bodyMedium, is 1.43), laid out as Flutter lays it out: a line
 * box of whole points, the baseline where the font's ascent plus half the
 * leading puts it. A browser floors that half-leading to a whole pixel and
 * would set the letters up to a point higher; the nudge puts them back.
 * Lexend: ascent 1 em, descent ¼ em, which a browser rounds to whole pixels.
 */
function line(size: number, height = 1.43): CSSProperties {
  const L = size * height;
  const box = Math.round(L);
  const flutter = size + (L - 1.25 * size) / 2;
  const ascent = Math.round(size);
  const descent = Math.round(size / 4);
  const browser = ascent + Math.floor((box - ascent - descent) / 2);
  const dy = Math.round((flutter - browser) * 100) / 100;
  return { fontSize: size, lineHeight: `${box}px`, ...(dy ? { position: "relative", top: dy } : {}) };
}

interface BoxShadow {
  color: string;
  blurRadius: number;
  dy?: number;
  spread?: number;
}

/**
 * A Flutter BoxDecoration on a see-through box, painted in Flutter's order:
 * the shadows first — whole, so through a translucent fill they darken or tint
 * the box itself, which a CSS box-shadow never does — then the fill, then the
 * border. It goes first inside a positioned box with a transparent border of
 * the same width; what follows it is positioned, to paint on top. Where the
 * app does not clip the box, a CSS box-shadow draws the part outside.
 */
function Decoration({
  radius,
  clipRadius = radius,
  border = 0,
  borderColor,
  fill,
  shadows = [],
}: {
  radius: number;
  /** A ClipRRect around the box, where its radius differs from the box's. */
  clipRadius?: number;
  border?: number;
  borderColor?: string;
  fill?: string;
  shadows?: BoxShadow[];
}) {
  const box: CSSProperties = { position: "absolute", inset: -border, pointerEvents: "none" };
  return (
    <>
      {shadows.length > 0 && (
        <span aria-hidden="true" style={{ ...box, borderRadius: clipRadius, overflow: "hidden" }}>
          {shadows.map((sh, i) => {
            const spread = sh.spread ?? 0;
            const dy = sh.dy ?? 0;
            return (
              <span
                key={i}
                style={{
                  position: "absolute",
                  left: -spread,
                  right: -spread,
                  top: dy - spread,
                  bottom: -dy - spread,
                  borderRadius: radius,
                  backgroundColor: sh.color,
                  filter: `blur(${sigma(sh.blurRadius).toFixed(2)}px)`,
                }}
              />
            );
          })}
        </span>
      )}
      {fill && <span aria-hidden="true" style={{ ...box, borderRadius: radius, backgroundColor: fill }} />}
      {borderColor && border > 0 && (
        <span aria-hidden="true" style={{ ...box, borderRadius: radius, border: `${border}px solid ${borderColor}` }} />
      )}
    </>
  );
}

const WHITES = [
  { pc: 0, name: "C" },
  { pc: 2, name: "D" },
  { pc: 4, name: "E" },
  { pc: 5, name: "F" },
  { pc: 7, name: "G" },
  { pc: 9, name: "A" },
  { pc: 11, name: "B" },
];
const BLACKS = [
  { pc: 1, frac: 1 / 7, name: "C♯" },
  { pc: 3, frac: 2 / 7, name: "E♭" },
  { pc: 6, frac: 4 / 7, name: "F♯" },
  { pc: 8, frac: 5 / 7, name: "A♭" },
  { pc: 10, frac: 6 / 7, name: "B♭" },
];

export interface TrainerScreenProps {
  question: Question;
  feedback: Feedback | null;
  correct: number;
  answered: number;
  streak: number;
  /** A session's length: CORRECT reads n/length and the bar fills. */
  length?: number;
  /** A timed run: the bar drains and the label is the clock. */
  leftMs?: number;
  totalMs?: number;
  onPick: (pitch: number) => void;
  onExit?: () => void;
  /** What the ✕ does, for a screen reader: "Start again", "Stop". */
  exitLabel?: string;
  /** Laid over the screen: the ready card, the result. */
  overlay?: ReactNode;
  /** How the last answer went: the colour of the halo behind the screen. */
  lastRight?: boolean;
}

/** The phone's own reply to an answer, where a browser can give one (Android). */
function buzz(right: boolean) {
  try {
    navigator.vibrate?.(right ? 20 : 45);
  } catch {
    // No vibration here: nothing to do.
  }
}

export function TrainerScreen(p: TrainerScreenProps) {
  const [piano, setPiano] = useState(true);
  const q = p.question;
  const pick = (pitch: number) => {
    buzz(pitch === q.answerPc);
    p.onPick(pitch);
  };
  return (
    <div
      style={{
        width: SCREEN_W,
        height: SCREEN_H,
        position: "relative",
        overflow: "hidden",
        background: "#0F0A1A",
        fontFamily: LEXEND,
        color: "#fff",
        WebkitTapHighlightColor: "transparent",
        userSelect: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: SCREEN_W,
          height: PHONE_H,
          // The app's default text style, Material 3's bodyMedium: a line set
          // without a height of its own is 1.43 of its size, and letters sit a
          // quarter point apart.
          lineHeight: 1.43,
          letterSpacing: 0.25,
        }}
      >
        <TrainerBackground />
        {/* The halo: one per answer, green or rose, outliving a right answer's
            feedback as it does in the app. */}
        {p.answered > 0 && (
          <Fragment key={p.answered}>
            <div
              className="app-halo"
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background: towardTransparent(p.lastRight === false ? [244, 63, 94] : [16, 185, 129], 50 / 255, "50% 50%", SCREEN_W),
              }}
            />
          </Fragment>
        )}
        {/* The safe area: 62 points under the Dynamic Island, 34 over the home indicator. */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", paddingTop: 62, paddingBottom: 34 }}>
          <TopBar {...p} />
          <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 0" }}>
            <div style={{ opacity: p.feedback ? 0 : 1, transition: "opacity 140ms linear" }}>
              {/* Keyed by the degree, as the app's AnimatedSwitcher is: a new
                  degree pops in, the same one asked again in another key does
                  not, and neither does a run's first question. */}
              <Fragment key={q.degree}>
                <QuestionDisplay degree={q.degree} streak={p.streak} pop={p.answered > 0} />
              </Fragment>
            </div>
          </div>
          {piano ? (
            <Keyboard question={q} feedback={p.feedback} onPick={pick} />
          ) : (
            <Grid question={q} feedback={p.feedback} onPick={pick} />
          )}
          <div style={{ padding: "4px 16px 30px", display: "flex", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => setPiano((v) => !v)}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                borderRadius: 30,
                background: "transparent",
                border: "1px solid transparent",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                color: "#fff",
                cursor: "pointer",
                fontFamily: LEXEND,
                lineHeight: "inherit",
                letterSpacing: "inherit",
              }}
            >
              {/* Its shadow is clipped to the pill: only the part under the
                  frosted fill is left, darkening it. */}
              <Decoration
                radius={30}
                border={1}
                fill="rgba(255,255,255,0.102)"
                borderColor="rgba(255,255,255,0.2)"
                shadows={[{ color: "rgba(0,0,0,0.502)", blurRadius: 30, dy: -10 }]}
              />
              <span style={{ ...line(12), fontWeight: 900, ...tracking(4.8) }}>{piano ? "GRID VIEW" : "PIANO KEYBOARD"}</span>
              <span style={{ position: "relative", display: "flex" }}>{piano ? <GridIcon /> : <PianoIcon />}</span>
            </button>
          </div>
        </div>
        {p.feedback && <FeedbackCard feedback={p.feedback} question={q} />}
      </div>
      {p.overlay}
    </div>
  );
}

// ── Background ───────────────────────────────────────────────────────────────

/**
 * A Flutter RadialGradient from a colour to Colors.transparent. Flutter fades
 * towards transparent black without premultiplying, so the colour darkens as
 * it fades; a browser fades it at full colour. The stops below put Flutter's
 * curve back: colour × (1 − t) at alpha (1 − t).
 */
function towardTransparent(rgb: [number, number, number], alpha: number, at: string, radius: number) {
  const stops = [0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => {
    const k = 1 - t;
    const [r, g, b] = rgb.map((v) => Math.round(v * k));
    return `rgba(${r},${g},${b},${(alpha * k).toFixed(4)}) ${t * 100}%`;
  });
  return `radial-gradient(circle ${radius}px at ${at}, ${stops.join(", ")})`;
}

/**
 * The trainer's background, layer by layer: the base, three corner gradients
 * (slate, indigo, violet) at a radius of 1.5 × the screen's width, a 25 %
 * black veil, and three blurred lights (pink, teal, blue) where the app puts
 * them.
 */
function TrainerBackground() {
  const R = SCREEN_W * 1.5;
  const glow = (size: number, color: string, style: CSSProperties): CSSProperties => ({
    position: "absolute",
    width: size,
    height: size,
    borderRadius: "50%",
    background: color,
    filter: "blur(60px)",
    ...style,
  });
  const small = Math.min(SCREEN_W * 0.6, 400);
  const big = Math.min(SCREEN_W * 0.8, 512);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div style={{ position: "absolute", inset: 0, background: towardTransparent([30, 41, 59], 1, "0% 0%", R) }} />
      <div style={{ position: "absolute", inset: 0, background: towardTransparent([49, 46, 129], 1, "100% 0%", R) }} />
      <div style={{ position: "absolute", inset: 0, background: towardTransparent([76, 29, 149], 1, "100% 100%", R) }} />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />
      <div style={glow(small, "rgba(236,72,153,0.15)", { top: PHONE_H * 0.2, right: -SCREEN_W * 0.1 })} />
      <div style={glow(small, "rgba(20,184,166,0.15)", { bottom: PHONE_H * 0.2, left: -SCREEN_W * 0.1 })} />
      <div style={glow(big, "rgba(59,130,246,0.10)", { top: PHONE_H / 2 - big / 2, left: SCREEN_W / 2 - big / 2 })} />
    </div>
  );
}

// ── Top bar ──────────────────────────────────────────────────────────────────

function TopBar(p: TrainerScreenProps) {
  const timed = p.totalMs !== undefined && p.leftMs !== undefined && p.totalMs > 0;
  const timePct = timed ? Math.min(1, Math.max(0, p.leftMs! / p.totalMs!)) : 0;
  const fill = timed ? timePct : Math.min(1, p.length ? p.answered / p.length : 0);
  const secs = timed ? Math.ceil(p.leftMs! / 1000) : 0;
  const barColour = timed ? (timePct > 0.5 ? "#22C55E" : timePct > 0.2 ? "#F59E0B" : "#EF4444") : "#fff";
  const accuracy = p.answered ? Math.round((100 * p.correct) / p.answered) : 0;

  const circle: CSSProperties = {
    position: "relative",
    width: 48,
    height: 48,
    flexShrink: 0,
    borderRadius: 24,
    background: WHITE10,
    border: `1.2px solid ${WHITE10}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
  return (
    <div style={{ padding: "16px 16px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          type="button"
          aria-label={p.exitLabel ?? "Start again"}
          onClick={p.onExit}
          style={{
            ...circle,
            background: "transparent",
            borderColor: "transparent",
            boxShadow: `0 0 ${blur(20)} rgba(0,0,0,0.251)`,
            cursor: p.onExit ? "pointer" : "default",
            padding: 0,
          }}
        >
          <Decoration radius={24} border={1.2} fill={WHITE10} borderColor={WHITE10} shadows={[{ color: "rgba(0,0,0,0.251)", blurRadius: 20 }]} />
          <span style={{ position: "relative", display: "flex" }}>
            <MaterialIcon path={CLOSE_ROUNDED} size={24} color="rgba(255,255,255,0.7)" />
          </span>
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 5 }}>
            {timed ? (
              <>
                <MaterialIcon path={TIMER_OUTLINED} size={14} color={barColour} />
                <span style={{ ...line(17, 1.15), fontWeight: 900, color: barColour, ...tracking(0.5), fontVariantNumeric: "tabular-nums" }}>
                  0:{String(secs).padStart(2, "0")}
                </span>
              </>
            ) : (
              <span style={{ ...line(10), fontWeight: 900, color: "rgba(255,255,255,0.7)", ...tracking(4) }}>PROGRESS</span>
            )}
          </div>
          {/* The bar clips its fill, glow and all: the glow shows only inside
              the track, past the end of the fill. */}
          <div style={{ marginTop: 3, height: 6, borderRadius: 3, background: "rgba(0,0,0,0.392)", position: "relative", overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                inset: "0 auto 0 0",
                width: `${fill * 100}%`,
                borderRadius: 3,
                background: timed ? barColour : "linear-gradient(90deg, #60A5FA, #A855F7, #EC4899)",
                boxShadow: timed ? `0 0 ${blur(12)} ${barColour}73` : `0 0 ${blur(12)} rgba(168,85,247,0.4)`,
                transition: timed ? "width 100ms linear, background-color 300ms" : "width 300ms ease-out",
              }}
            />
            <div style={{ position: "absolute", inset: 0, borderRadius: 3, border: "1px solid rgba(255,255,255,0.051)" }} />
          </div>
        </div>
        <div style={{ ...circle, borderRadius: "50%", border: "1.2px solid rgba(255,255,255,0.2)", flexDirection: "column" }}>
          <span style={{ ...line(7), fontWeight: 900, color: "rgba(255,255,255,0.6)", ...tracking(1.5) }}>KEY</span>
          <NoteText text={p.question.key} style={{ ...line(16, 1.1), fontWeight: 900 }} />
        </div>
      </div>
      <div
        style={{
          marginTop: 12,
          // 16, and the 0.2 of the 1.2 border that a browser rounds away: the
          // card keeps the app's height, and everything under it its place.
          padding: 16.2,
          borderRadius: 32,
          background: "rgba(26,22,37,0.10)",
          border: `1.2px solid ${WHITE10}`,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Stat label="CORRECT" value={p.length ? `${p.correct}/${p.length}` : String(p.correct)} color="#fff" />
        <div style={{ width: 1, height: 30, background: WHITE10 }} />
        <Stat label="ACCURACY" value={`${accuracy}%`} color={accuracyColor(p.correct, p.answered)} />
        <div style={{ width: 1, height: 30, background: WHITE10 }} />
        <Stat label="STREAK" value={p.streak >= 10 ? `🔥${p.streak}` : String(p.streak)} color={streakColor(p.streak)} />
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <span style={{ ...line(9), fontWeight: 900, color: "rgba(255,255,255,0.6)", ...tracking(2) }}>{label}</span>
      <span style={{ ...line(18), fontWeight: 900, color, fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );
}

function mix(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(",")})`;
}

/** Red through yellow to green as the score climbs, as in the app. */
function accuracyColor(correct: number, answered: number) {
  if (answered === 0) return "rgba(255,255,255,0.7)";
  const r = correct / answered;
  return r < 0.5 ? mix("#EF4444", "#FACC15", r * 2) : mix("#FACC15", "#22C55E", (r - 0.5) * 2);
}

/** Cyan warming to orange, and gold from ten in a row. */
function streakColor(streak: number) {
  if (streak === 0) return "#06B6D4";
  if (streak >= 10) return "#FACC15";
  return mix("#06B6D4", "#F97316", Math.min(1, streak / 10));
}

// ── The question ─────────────────────────────────────────────────────────────

function QuestionDisplay({ degree, streak, pop: popNow }: { degree: string; streak: number; pop: boolean }) {
  // Whether it pops is settled when the degree comes in: the answer that
  // follows must not set it off again.
  const [pop] = useState(popNow);
  const badge = streak > 4 && (
    <span
      style={{
        marginTop: 6,
        padding: "5px 10px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.10)",
        background:
          streak >= 10 ? "linear-gradient(135deg, #facc15, #f97316, #dc2626)" : "linear-gradient(135deg, #22c55e, #10b981)",
        boxShadow: `0 0 ${blur(15)} ${streak >= 10 ? "rgba(249,115,22,0.4)" : "rgba(34,197,94,0.4)"}`,
        fontSize: 13,
        lineHeight: "19px",
        fontWeight: 900,
        color: streak >= 10 ? "#fff" : "#000",
        alignSelf: "flex-start",
        transform: "translateX(-2px)",
      }}
    >
      x{streak}
    </span>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <span style={{ ...line(12, 1), fontWeight: 900, color: "rgba(255,255,255,0.8)", ...tracking(7.2) }}>DEGREE</span>
      <div className={pop ? "app-pop" : undefined} style={{ marginTop: 8, display: "flex", alignItems: "flex-start" }}>
        {badge && <span style={{ visibility: "hidden", display: "flex" }}>{badge}</span>}
        <NoteText
          text={degree}
          lift={0.36}
          scale={0.66}
          // min(0.45 × width, 0.22 × height) of the phone, as the app sizes it.
          style={{ ...line(180.9, 1), fontWeight: 900, textShadow: `0 20px ${blur(80)} rgba(0,0,0,0.541)` }}
        />
        {badge}
      </div>
    </div>
  );
}

// ── The keyboard ─────────────────────────────────────────────────────────────

/** The app's input zone: 0.35 of the phone's height. */
const INPUT_H = PHONE_H * 0.35;
/** The keyboard's own height: the input zone less its 32 points of frame. */
const KEYS_H = INPUT_H - 32;

function Keyboard({ question, feedback, onPick }: { question: Question; feedback: Feedback | null; onPick: (pc: number) => void }) {
  // Inside the frame's padding and both borders: 402 − 2 × (16 + 1 + 8 + 1).
  const W = SCREEN_W - 2 * (16 + 1 + 8 + 1);
  const H = KEYS_H - 2;
  const whiteW = W / 7;
  const blackW = whiteW * 0.62;
  const blackH = H * 0.65;
  return (
    <div style={{ padding: "8px 16px" }}>
      <div
        style={{
          position: "relative",
          padding: 8,
          borderRadius: 28,
          border: "1px solid transparent",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Its shadow is clipped to the frame: what is left of it darkens the rim. */}
        <Decoration
          radius={28}
          border={1}
          fill="rgba(0,0,0,0.2)"
          borderColor="rgba(255,255,255,0.102)"
          shadows={[{ color: "rgba(0,0,0,0.4)", blurRadius: 30, dy: 12 }]}
        />
        <div
          style={{
            position: "relative",
            height: KEYS_H,
            borderRadius: 16,
            overflow: "hidden",
            background: "rgba(255,255,255,0.051)",
            border: "1px solid rgba(255,255,255,0.102)",
          }}
        >
          {WHITES.map((k, i) => (
            <Fragment key={k.pc}>
            <PianoKey
              black={false}
              name={k.name}
              pitch={k.pc}
              question={question}
              feedback={feedback}
              onPick={onPick}
              style={{ left: i * whiteW, top: 0, width: whiteW, height: H }}
            />
            </Fragment>
          ))}
          {WHITES.slice(1).map((_, i) => (
            <div key={i} style={{ position: "absolute", zIndex: 2, left: (i + 1) * whiteW - 0.5, top: 0, width: 1, height: H, background: "#CBD5E1" }} />
          ))}
          {BLACKS.map((k) => (
            <Fragment key={k.pc}>
            <PianoKey
              black
              name={question.scale[k.pc] ?? k.name}
              pitch={k.pc}
              question={question}
              feedback={feedback}
              onPick={onPick}
              style={{ left: k.frac * 7 * whiteW - blackW / 2, top: 0, width: blackW, height: blackH }}
            />
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

function PianoKey({
  black,
  name,
  pitch,
  question,
  feedback,
  onPick,
  style,
}: {
  black: boolean;
  name: string;
  pitch: number;
  question: Question;
  feedback: Feedback | null;
  onPick: (pc: number) => void;
  style: CSSProperties;
}) {
  const [pressed, setPressed] = useState(false);
  // Apprentice, the app's first level: the key's seven notes are lit and live.
  const active = pitch in question.scale;
  const tappable = active && !feedback;
  const color = noteColor(name);
  let bg = black ? "#1E293B" : "#FFFFFF";
  let label = active ? color : black ? "#64748B" : "#94A3B8";
  let shadow = black ? `0 6px ${blur(10)} rgba(0,0,0,0.502)` : "none";
  if (feedback && pitch === question.answerPc) {
    bg = color;
    label = "#fff";
    shadow = `0 0 ${blur(30)} ${color}88`;
  } else if (feedback && !feedback.right && pitch === feedback.picked) {
    bg = ROSE;
    label = "#fff";
    shadow = `0 0 ${blur(30)} rgba(244,63,94,0.702)`;
  }
  const dy = pressed && tappable ? (black ? 6 : 10) : 0;
  return (
    <button
      type="button"
      aria-label={name}
      disabled={!tappable}
      onPointerDown={() => tappable && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onClick={() => tappable && onPick(pitch)}
      style={{
        position: "absolute",
        ...style,
        zIndex: black ? 3 : 1,
        padding: 0,
        border: black ? "1px solid rgba(255,255,255,0.10)" : "none",
        borderRadius: black ? "0 0 6px 6px" : 0,
        background: bg,
        boxShadow: shadow,
        transform: `translateY(${dy}px)`,
        transition: "transform 80ms linear, background-color 80ms linear, box-shadow 80ms linear",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: black ? 10 : 16,
        cursor: tappable ? "pointer" : "default",
        fontFamily: LEXEND,
      }}
    >
      <NoteText text={name} style={{ ...line(black ? 12 : 16), fontWeight: 900, color: label }} />
    </button>
  );
}

// ── The grid ─────────────────────────────────────────────────────────────────

function Grid({ question, feedback, onPick }: { question: Question; feedback: Feedback | null; onPick: (pc: number) => void }) {
  // The key's seven notes in keyboard order, four over three, as in the app.
  const notes = Object.entries(question.scale)
    .map(([pc, name]) => ({ pc: Number(pc), name }))
    .sort((a, b) => a.pc - b.pc);
  const gap = 12;
  const bw = (SCREEN_W - 32 - 3 * gap) / 4;
  const row = (items: typeof notes) => (
    <div style={{ display: "flex", justifyContent: "center", gap }}>
      {items.map((n) => (
        <Fragment key={n.pc}>
          <GridButton note={n} size={bw} question={question} feedback={feedback} onPick={onPick} />
        </Fragment>
      ))}
    </div>
  );
  return (
    <div style={{ minHeight: INPUT_H, display: "flex", flexDirection: "column", justifyContent: "center", gap, padding: "8px 16px 12px" }}>
      {row(notes.slice(0, 4))}
      {row(notes.slice(4))}
    </div>
  );
}

function GridButton({
  note,
  size,
  question,
  feedback,
  onPick,
}: {
  note: { pc: number; name: string };
  size: number;
  question: Question;
  feedback: Feedback | null;
  onPick: (pc: number) => void;
}) {
  const [pressed, setPressed] = useState(false);
  const color = noteColor(note.name);
  const isAnswer = note.pc === question.answerPc;
  const isPicked = feedback?.picked === note.pc;
  let bg = "rgba(255,255,255,0.05)";
  let ink = color;
  let shadow: BoxShadow = { color: "rgba(0,0,0,0.251)", blurRadius: 24, dy: 8 };
  let tint = true;
  if (feedback && isAnswer && isPicked) {
    bg = "#fff";
    ink = "#020617";
    shadow = { color: "rgba(255,255,255,0.5)", blurRadius: 50 };
    tint = false;
  } else if (feedback && isAnswer) {
    bg = "rgba(16,185,129,0.5)";
    ink = "#fff";
    shadow = { color: "rgba(16,185,129,0.6)", blurRadius: 40 };
    tint = false;
  } else if (feedback && isPicked) {
    bg = ROSE;
    ink = "#fff";
    shadow = { color: "rgba(244,63,94,0.7)", blurRadius: 50 };
    tint = false;
  }
  return (
    <button
      type="button"
      aria-label={note.name}
      disabled={!!feedback}
      onPointerDown={() => !feedback && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onClick={() => !feedback && onPick(note.pc)}
      className={feedback && isPicked ? (isAnswer ? "app-bounce" : "app-shake") : undefined}
      style={{
        width: size,
        height: size,
        borderRadius: 24,
        border: "none",
        padding: 0,
        position: "relative",
        background: "transparent",
        // The part of the shadow outside the button; the part under it, seen
        // through the fill, is the Decoration's.
        boxShadow: `0 ${shadow.dy ?? 0}px ${blur(shadow.blurRadius)} ${shadow.color}`,
        transform: pressed ? "scale(0.93)" : "scale(1)",
        // In the app the answer's colours land at once, and leave at once: the
        // button that shows one is wrapped anew (a Transform for the hop and
        // the shake, a Stack for the tick), so nothing of it is left to animate
        // from. Only the press eases, and only until then.
        transition: feedback && (isPicked || isAnswer) ? "none" : "transform 80ms linear",
        cursor: feedback ? "default" : "pointer",
        fontFamily: LEXEND,
      }}
    >
      <Decoration radius={24} fill={bg} shadows={[shadow]} />
      {tint && <span style={{ position: "absolute", inset: 0, borderRadius: 24, background: color, opacity: 26 / 255 }} />}
      <NoteText text={note.name} style={{ position: "relative", ...line(26), fontWeight: 900, color: ink }} />
      {feedback && isAnswer && !isPicked && (
        <span
          style={{
            position: "absolute",
            top: -8,
            right: -8,
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#10B981",
            boxShadow: `0 0 ${blur(10)} rgba(16,185,129,0.314)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialIcon path={CHECK_ROUNDED} size={14} color="#fff" />
        </span>
      )}
    </button>
  );
}

// ── The answer, confirmed ────────────────────────────────────────────────────

function FeedbackCard({ feedback, question }: { feedback: Feedback; question: Question }) {
  const accent = feedback.right ? "#10B981" : ROSE;
  const glow = feedback.right ? "rgba(16,185,129,0.18)" : "rgba(244,63,94,0.18)";
  return (
    // Centred over the phone less its lowest 35 %, wherever the question is.
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: SCREEN_W,
        height: PHONE_H,
        paddingBottom: PHONE_H * 0.35,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 5,
      }}
    >
      <div
        className="app-feedback"
        style={{
          position: "relative",
          padding: "26px 34px 28px",
          borderRadius: 30,
          border: "1px solid transparent",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* A ClipRRect of 30 around a card of 32: its glow and its drop
            shadow are cut off at the card's edge, and what is left of them
            tints and darkens the frosted glass. */}
        <Decoration
          radius={32}
          clipRadius={30}
          border={1}
          fill="rgba(255,255,255,0.05)"
          borderColor="rgba(255,255,255,0.12)"
          shadows={[
            { color: glow, blurRadius: 56, spread: -8 },
            { color: "rgba(0,0,0,0.4)", blurRadius: 30, dy: 16 },
          ]}
        />
        <div
          style={{
            position: "relative",
            width: 60,
            height: 60,
            borderRadius: "50%",
            // Color.lerp(accent, white, 0.35) at Alignment(-0.3, -0.4), radius 0.5.
            background: `radial-gradient(circle 30px at 35% 30%, ${feedback.right ? "#64D2AD" : "#F88296"}, ${accent})`,
            boxShadow: `0 0 ${blur(24)} -2px ${accent}8c`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialIcon path={feedback.right ? CHECK_ROUNDED : CLOSE_ROUNDED} size={34} color="#fff" />
        </div>
        <span style={{ marginTop: 16, ...line(16), fontWeight: 900, color: accent, ...tracking(4) }}>
          {feedback.right ? "CORRECT" : "WRONG"}
        </span>
        {!feedback.right && (
          <>
            <div style={{ position: "relative", marginTop: 16, height: 1, width: 64, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ marginTop: 16, ...line(9), fontWeight: 900, color: "rgba(255,255,255,0.45)", ...tracking(2) }}>
              CORRECT ANSWER
            </span>
            <NoteText
              text={question.answer}
              style={{ position: "relative", marginTop: 8, ...line(34, 1), fontWeight: 900, color: noteColor(question.answer) }}
            />
          </>
        )}
      </div>
    </div>
  );
}

// ── Icons ────────────────────────────────────────────────────────────────────

// The app's icons are Material's rounded set: the same outlines, here.
const CLOSE_ROUNDED =
  "M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 0 0 5.7 5.7a.996.996 0 0 0 0 1.41L10.59 12 5.7 16.89a.996.996 0 0 0 0 1.41c.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0a.996.996 0 0 0 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z";
const CHECK_ROUNDED =
  "M9 16.17 5.53 12.7a.996.996 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0L9 16.17z";
const TIMER_OUTLINED =
  "M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61 1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A8.962 8.962 0 0 0 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z";
const GRID_VIEW_ROUNDED =
  "M5 11h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2zm0 10h4c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2zM13 5v4c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2zm2 16h4c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2z";
const PIANO_ROUNDED =
  "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5.5 11.5h.25V19h-3.5v-4.5h.25c.55 0 1-.45 1-1V5h1v8.5c0 .55.45 1 1 1zM5 5h1v8.5c0 .55.45 1 1 1h.25V19H5V5zm14 14h-2.25v-4.5H17c.55 0 1-.45 1-1V5h1v14z";

function MaterialIcon({ path, size, color }: { path: string; size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
      <path d={path} />
    </svg>
  );
}

function GridIcon() {
  return <MaterialIcon path={GRID_VIEW_ROUNDED} size={20} color="#fff" />;
}

function PianoIcon() {
  return <MaterialIcon path={PIANO_ROUNDED} size={20} color="#fff" />;
}
