import type { ReactNode } from "react";
import { LEXEND } from "./appColors";
import { NoteText } from "./NoteText";
import type { TrainerResult } from "./useTrainer";

/** The four results the app's Daily Challenge gives, and their colours. */
export function tierOf(r: TrainerResult, timed: boolean) {
  const wrong = r.answered - r.correct;
  if (r.answered >= (timed ? 10 : 5) && wrong === 0) return { name: "FLAWLESS", color: "#FBBF24" };
  const sharp = timed ? r.correct >= 25 : r.correct >= r.answered * 0.8;
  if (sharp) return { name: "SHARP", color: "#10B981" };
  const solid = timed ? r.correct >= 12 : r.correct >= r.answered * 0.5;
  if (solid) return { name: "SOLID", color: "#F97316" };
  return { name: "WARMING UP", color: "#F43F5E" };
}

/**
 * The result, on the card the app shares after a Daily Challenge: a ring with
 * one segment per answer, the score in the middle, the verdict under it.
 */
export function ResultCard({
  title,
  subtitle,
  result,
  timed,
  actions,
}: {
  title: string;
  /** "Key of E♭", "Every key". */
  subtitle: string;
  result: TrainerResult;
  timed: boolean;
  actions: ReactNode;
}) {
  const tier = tierOf(result, timed);
  const flawless = tier.name === "FLAWLESS";
  const n = Math.max(result.marks.length, 1);
  const R = 92;
  const stroke = 12;
  const C = 2 * Math.PI * R;
  const gap = Math.min(0.07, (2 * Math.PI) / n / 3);
  const seg = (2 * Math.PI) / n - gap;
  const accuracy = result.answered ? Math.round((100 * result.correct) / result.answered) : 0;
  const label = { fontSize: 9.5, fontWeight: 900, letterSpacing: 1.6, color: "rgba(255,255,255,0.38)" } as const;
  const value = { fontSize: 21, fontWeight: 900, color: "#fff", letterSpacing: -0.5, fontVariantNumeric: "tabular-nums" } as const;

  return (
    <div
      className="app-feedback"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10,
        background: "rgba(9,6,15,0.86)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "78px 20px 30px",
        fontFamily: LEXEND,
        color: "#fff",
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 900, letterSpacing: 3, color: "#FBBF24", paddingLeft: 3 }}>{title}</span>
      <NoteText text={subtitle} style={{ marginTop: 6, fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.8)" }} />

      {/* The card, with the app's rainbow edge. */}
      <div
        style={{
          marginTop: 22,
          width: "100%",
          padding: 2,
          borderRadius: 30,
          background: "linear-gradient(135deg, #A855F7, #EC4899 35%, #F97316 65%, #22C55E)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
        }}
      >
        <div
          style={{
            borderRadius: 28,
            padding: "20px 22px 18px",
            background:
              "radial-gradient(circle at 50% 42%, rgba(124,58,237,0.22), rgba(124,58,237,0) 60%), linear-gradient(180deg, #1D1533, #110C1F 55%, #09060F)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: 3 }}>IMPROVY</span>
            <span style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: 2, color: "rgba(255,255,255,0.38)" }}>
              {timed ? "60 SECONDS" : `${result.answered} QUESTIONS`}
            </span>
          </div>

          <div style={{ position: "relative", width: 2 * R + stroke + 8, height: 2 * R + stroke + 8, marginTop: 14 }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${2 * R + stroke + 8} ${2 * R + stroke + 8}`}>
              <circle cx="50%" cy="50%" r={R - stroke / 2 - 2} fill="#120D20" />
              {result.marks.length === 0 ? (
                <circle cx="50%" cy="50%" r={R} fill="none" stroke="#2A2340" strokeWidth={stroke} />
              ) : (
                result.marks.map((right, i) => {
                  const color = flawless ? "#FBBF24" : right ? "#34D399" : "#FB7185";
                  const len = (seg / (2 * Math.PI)) * C;
                  const offset = -((i * (2 * Math.PI)) / n / (2 * Math.PI)) * C;
                  return (
                    <circle
                      key={i}
                      cx="50%"
                      cy="50%"
                      r={R}
                      fill="none"
                      stroke={color}
                      strokeWidth={stroke}
                      strokeLinecap="round"
                      strokeDasharray={`${Math.max(len - stroke, 0.5)} ${C}`}
                      strokeDashoffset={offset}
                      transform={`rotate(-90 ${R + stroke / 2 + 4} ${R + stroke / 2 + 4})`}
                      style={{ filter: `drop-shadow(0 0 4px ${color}66)` }}
                    />
                  );
                })
              )}
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ display: "flex", alignItems: "baseline" }}>
                <span
                  style={{
                    fontSize: 64,
                    fontWeight: 900,
                    letterSpacing: -3,
                    lineHeight: 1,
                    backgroundImage: flawless ? "linear-gradient(180deg, #FDE68A, #F59E0B)" : "linear-gradient(180deg, #FFFFFF, #CFC6EA)",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {result.correct}
                </span>
                <span style={{ fontSize: 20, fontWeight: 900, color: "rgba(255,255,255,0.35)", marginLeft: 3 }}>/{result.answered}</span>
              </div>
              <span style={{ ...label, marginTop: 6 }}>SCORE</span>
            </div>
          </div>

          <span
            style={{
              marginTop: 14,
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              padding: "8px 16px",
              borderRadius: 99,
              background: `${tier.color}1f`,
              border: `1px solid ${tier.color}59`,
              boxShadow: `0 0 18px ${tier.color}26`,
              color: tier.color,
              fontSize: 11.5,
              fontWeight: 900,
              letterSpacing: 1.6,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill={tier.color}>
              <circle cx="12" cy="12" r="11" />
              <path d="M7 12.5l3.2 3.2L17.2 8.7" stroke="#120D20" strokeWidth="2.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {tier.name}
          </span>

          <div
            style={{
              marginTop: 16,
              width: "100%",
              display: "flex",
              padding: "12px 4px",
              borderRadius: 18,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {[
              { k: "ACCURACY", v: `${accuracy}%` },
              { k: "PER ANSWER", v: result.avgMs === null ? "—" : `${(result.avgMs / 1000).toFixed(1)}s` },
              { k: "STREAK", v: String(result.bestStreak) },
            ].map((s, i) => (
              <div key={s.k} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, borderLeft: i ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
                <span style={value}>{s.v}</span>
                <span style={label}>{s.k}</span>
              </div>
            ))}
          </div>
          <span style={{ marginTop: 12, fontSize: 10, fontWeight: 800, letterSpacing: 1, color: "rgba(255,255,255,0.3)" }}>improvy.app</span>
        </div>
      </div>

      <div style={{ marginTop: "auto", width: "100%", display: "flex", flexDirection: "column", gap: 10 }}>{actions}</div>
    </div>
  );
}

/** The app's primary button: amber, dark ink. */
export function AppButton({ children, onClick, variant = "gold" }: { children: ReactNode; onClick: () => void; variant?: "gold" | "dark" }) {
  const gold = variant === "gold";
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        height: 56,
        borderRadius: 18,
        border: gold ? "none" : "1px solid rgba(255,255,255,0.12)",
        background: gold ? "linear-gradient(180deg, #FBBF24, #F59E0B)" : "rgba(255,255,255,0.05)",
        boxShadow: gold ? "0 6px 0 #B45309, 0 10px 28px rgba(245,158,11,0.35)" : "none",
        color: gold ? "#2A1B04" : "#fff",
        fontFamily: LEXEND,
        fontSize: 13,
        fontWeight: 900,
        letterSpacing: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}
