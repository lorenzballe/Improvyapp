import { Fragment, useState, type CSSProperties, type ReactNode } from "react";
import { NoteText } from "./NoteText";
import { APP_BG, LEXEND, noteColor } from "./appColors";
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

const WHITE10 = "rgba(255,255,255,0.10)";
const ROSE = "#F43F5E";

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
}

export function TrainerScreen(p: TrainerScreenProps) {
  const [piano, setPiano] = useState(true);
  const q = p.question;
  return (
    <div
      style={{
        width: SCREEN_W,
        height: SCREEN_H,
        position: "relative",
        overflow: "hidden",
        background: APP_BG,
        fontFamily: LEXEND,
        color: "#fff",
        WebkitTapHighlightColor: "transparent",
        userSelect: "none",
      }}
    >
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", paddingTop: 62, paddingBottom: 12 }}>
        <TopBar {...p} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 0" }}>
          <div style={{ opacity: p.feedback ? 0 : 1, transition: "opacity 140ms" }}>
            {/* Keyed by the question, so each new one pops in as the app's does. */}
            <Fragment key={`${q.key}-${q.degree}-${p.answered}`}>
              <QuestionDisplay degree={q.degree} streak={p.streak} />
            </Fragment>
          </div>
        </div>
        {piano ? (
          <Keyboard question={q} feedback={p.feedback} onPick={p.onPick} />
        ) : (
          <Grid question={q} feedback={p.feedback} onPick={p.onPick} />
        )}
        <div style={{ padding: "4px 16px 30px", display: "flex", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => setPiano((v) => !v)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              borderRadius: 30,
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.20)",
              boxShadow: "0 -10px 30px rgba(0,0,0,0.5)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              color: "#fff",
              cursor: "pointer",
              fontFamily: LEXEND,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: 4.8 }}>{piano ? "GRID VIEW" : "PIANO KEYBOARD"}</span>
            {piano ? <GridIcon /> : <PianoIcon />}
          </button>
        </div>
      </div>
      {p.feedback && <FeedbackCard feedback={p.feedback} question={q} />}
      {p.overlay}
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
          style={{ ...circle, boxShadow: "0 0 20px rgba(0,0,0,0.25)", cursor: p.onExit ? "pointer" : "default", padding: 0 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.4" strokeLinecap="round">
            <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
          </svg>
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 5, height: 20 }}>
            {timed ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={barColour} strokeWidth="2.4" strokeLinecap="round">
                  <circle cx="12" cy="13" r="8" />
                  <path d="M12 9v4l2.5 2M9.5 2.5h5" />
                </svg>
                <span style={{ fontSize: 17, fontWeight: 900, color: barColour, letterSpacing: 0.5, fontVariantNumeric: "tabular-nums" }}>
                  0:{String(secs).padStart(2, "0")}
                </span>
              </>
            ) : (
              <span style={{ fontSize: 10, fontWeight: 900, color: "rgba(255,255,255,0.7)", letterSpacing: 4 }}>PROGRESS</span>
            )}
          </div>
          <div
            style={{
              marginTop: 3,
              height: 6,
              borderRadius: 3,
              background: "rgba(0,0,0,0.39)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "0 auto 0 0",
                width: `${fill * 100}%`,
                borderRadius: 3,
                background: timed ? barColour : "linear-gradient(90deg, #60A5FA, #A855F7, #EC4899)",
                boxShadow: timed ? `0 0 12px ${barColour}73` : "0 0 12px rgba(168,85,247,0.4)",
                transition: timed ? "width 100ms linear, background-color 300ms" : "width 300ms ease-out",
              }}
            />
          </div>
        </div>
        <div style={{ ...circle, borderRadius: "50%", border: "1.2px solid rgba(255,255,255,0.2)", flexDirection: "column" }}>
          <span style={{ fontSize: 7, fontWeight: 900, color: "rgba(255,255,255,0.6)", letterSpacing: 1.5, lineHeight: 1.2 }}>KEY</span>
          <NoteText text={p.question.key} style={{ fontSize: 16, fontWeight: 900, lineHeight: 1.1 }} />
        </div>
      </div>
      <div
        style={{
          marginTop: 12,
          padding: 16,
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
      <span style={{ fontSize: 9, fontWeight: 900, color: "rgba(255,255,255,0.6)", letterSpacing: 2, lineHeight: 1.2 }}>{label}</span>
      <span style={{ fontSize: 18, fontWeight: 900, color, fontVariantNumeric: "tabular-nums", lineHeight: 1.2 }}>{value}</span>
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

function QuestionDisplay({ degree, streak }: { degree: string; streak: number }) {
  const badge = streak > 4 && (
    <span
      style={{
        marginTop: 6,
        padding: "5px 10px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.10)",
        background:
          streak >= 10 ? "linear-gradient(135deg, #facc15, #f97316, #dc2626)" : "linear-gradient(135deg, #22c55e, #10b981)",
        boxShadow: streak >= 10 ? "0 0 15px rgba(249,115,22,0.4)" : "0 0 15px rgba(34,197,94,0.4)",
        fontSize: 13,
        fontWeight: 900,
        color: streak >= 10 ? "#fff" : "#000",
        alignSelf: "flex-start",
        lineHeight: 1.2,
        transform: "translateX(-2px)",
      }}
    >
      x{streak}
    </span>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <span style={{ fontSize: 12, fontWeight: 900, color: "rgba(255,255,255,0.8)", letterSpacing: 7.2, lineHeight: 1, paddingLeft: 7.2 }}>
        DEGREE
      </span>
      <div className="app-pop" style={{ marginTop: 8, display: "flex", alignItems: "flex-start" }}>
        {badge && <span style={{ visibility: "hidden", display: "flex" }}>{badge}</span>}
        <NoteText
          text={degree}
          lift={0.36}
          scale={0.66}
          style={{ fontSize: 181, fontWeight: 900, lineHeight: 1, textShadow: "0 20px 80px rgba(0,0,0,0.54)" }}
        />
        {badge}
      </div>
    </div>
  );
}

// ── The keyboard ─────────────────────────────────────────────────────────────

const KEYS_H = 270;

function Keyboard({ question, feedback, onPick }: { question: Question; feedback: Feedback | null; onPick: (pc: number) => void }) {
  const W = SCREEN_W - 32 - 16 - 2; // the frame's padding and border
  const whiteW = W / 7;
  const blackW = whiteW * 0.62;
  const blackH = KEYS_H * 0.65;
  return (
    <div style={{ padding: "8px 16px" }}>
      <div
        style={{
          padding: 8,
          borderRadius: 28,
          background: "rgba(0,0,0,0.20)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            position: "relative",
            height: KEYS_H,
            borderRadius: 16,
            overflow: "hidden",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)",
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
              style={{ left: i * whiteW, top: 0, width: whiteW, height: KEYS_H }}
            />
            </Fragment>
          ))}
          {WHITES.slice(1).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: (i + 1) * whiteW - 0.5, top: 0, width: 1, height: KEYS_H, background: "#CBD5E1" }} />
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
  let shadow = black ? "0 6px 10px rgba(0,0,0,0.5)" : "none";
  if (feedback && pitch === question.answerPc) {
    bg = color;
    label = "#fff";
    shadow = `0 0 30px ${color}88`;
  } else if (feedback && !feedback.right && pitch === feedback.picked) {
    bg = ROSE;
    label = "#fff";
    shadow = "0 0 30px rgba(244,63,94,0.7)";
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
        zIndex: black ? 2 : 1,
        padding: 0,
        border: black ? "1px solid rgba(255,255,255,0.10)" : "none",
        borderRadius: black ? "0 0 6px 6px" : 0,
        background: bg,
        boxShadow: shadow,
        transform: `translateY(${dy}px)`,
        transition: "transform 80ms, background-color 120ms, box-shadow 120ms",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: black ? 10 : 16,
        cursor: tappable ? "pointer" : "default",
        fontFamily: LEXEND,
      }}
    >
      <NoteText text={name} style={{ fontSize: black ? 12 : 16, fontWeight: 900, color: label, lineHeight: 1.2 }} />
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
    <div style={{ minHeight: KEYS_H + 32, display: "flex", flexDirection: "column", justifyContent: "center", gap, padding: "8px 16px 12px" }}>
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
  let shadow = "0 8px 24px rgba(0,0,0,0.25)";
  let tint = true;
  if (feedback && isAnswer && isPicked) {
    bg = "#fff";
    ink = "#020617";
    shadow = "0 0 50px rgba(255,255,255,0.5)";
    tint = false;
  } else if (feedback && isAnswer) {
    bg = "rgba(16,185,129,0.5)";
    ink = "#fff";
    shadow = "0 0 40px rgba(16,185,129,0.6)";
    tint = false;
  } else if (feedback && isPicked) {
    bg = ROSE;
    ink = "#fff";
    shadow = "0 0 50px rgba(244,63,94,0.7)";
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
        position: "relative",
        background: bg,
        boxShadow: shadow,
        transform: pressed ? "scale(0.93)" : "scale(1)",
        transition: "transform 80ms, background-color 120ms, box-shadow 120ms",
        cursor: feedback ? "default" : "pointer",
        fontFamily: LEXEND,
      }}
    >
      {tint && <span style={{ position: "absolute", inset: 0, borderRadius: 24, background: color, opacity: 0.1 }} />}
      <NoteText text={note.name} style={{ position: "relative", fontSize: 26, fontWeight: 900, color: ink }} />
    </button>
  );
}

// ── The answer, confirmed ────────────────────────────────────────────────────

function FeedbackCard({ feedback, question }: { feedback: Feedback; question: Question }) {
  const accent = feedback.right ? "#10B981" : ROSE;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        paddingBottom: SCREEN_H * 0.35,
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
          padding: "26px 34px 28px",
          borderRadius: 32,
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          boxShadow: `0 0 56px -8px ${accent}2e, 0 16px 30px rgba(0,0,0,0.4)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: `radial-gradient(circle at 35% 30%, ${feedback.right ? "#6EE7C0" : "#F98DA0"}, ${accent})`,
            boxShadow: `0 0 24px -2px ${accent}8c`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            {feedback.right ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />}
          </svg>
        </div>
        <span style={{ marginTop: 16, fontSize: 16, fontWeight: 900, letterSpacing: 4, color: accent, paddingLeft: 4 }}>
          {feedback.right ? "CORRECT" : "WRONG"}
        </span>
        {!feedback.right && (
          <>
            <div style={{ marginTop: 16, height: 1, width: 64, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ marginTop: 16, fontSize: 9, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.45)" }}>
              CORRECT ANSWER
            </span>
            <NoteText
              text={question.answer}
              style={{ marginTop: 8, fontSize: 34, fontWeight: 900, lineHeight: 1, color: noteColor(question.answer) }}
            />
          </>
        )}
      </div>
    </div>
  );
}

// ── Icons ────────────────────────────────────────────────────────────────────

function GridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
      <rect x="3" y="3" width="8" height="8" rx="2.5" />
      <rect x="13" y="3" width="8" height="8" rx="2.5" />
      <rect x="3" y="13" width="8" height="8" rx="2.5" />
      <rect x="13" y="13" width="8" height="8" rx="2.5" />
    </svg>
  );
}

function PianoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="2.5" y="3" width="19" height="18" rx="3" stroke="#fff" strokeWidth="2" />
      <path d="M8 3v18M12 3v18M16 3v18" stroke="#fff" strokeWidth="1.6" />
      <rect x="6.5" y="3" width="3" height="10" rx="1" fill="#fff" />
      <rect x="14.5" y="3" width="3" height="10" rx="1" fill="#fff" />
    </svg>
  );
}
