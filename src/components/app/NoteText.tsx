import type { CSSProperties } from "react";

const ACCIDENTAL = /(𝄪|𝄫|♯|♭)/u;

/**
 * A note or a degree the way the app draws it (lib/widgets/note_text.dart):
 * the ♯ and ♭ come from Noto Music, smaller than the letter and lifted, with
 * a hairline stroke so they carry the same weight as the heavy type beside
 * them. A plain font's ♭ sits low and thin next to a black-weight letter.
 */
export function NoteText({
  text,
  style,
  lift = 0.14,
  scale = 0.78,
}: {
  text: string;
  style?: CSSProperties;
  /** How far the accidental rises, in ems of the letter. */
  lift?: number;
  /** The accidental's size against the letter's. */
  scale?: number;
}) {
  const parts = text.split(ACCIDENTAL).filter((p) => p !== "");
  return (
    <span style={{ whiteSpace: "nowrap", ...style }}>
      {parts.map((p, i) =>
        ACCIDENTAL.test(p) ? (
          <span
            key={i}
            style={{
              fontFamily: '"Noto Music", "Apple Symbols", "Segoe UI Symbol", serif',
              fontWeight: 400,
              fontSize: `${scale}em`,
              position: "relative",
              top: `${-lift / scale}em`,
              lineHeight: 1,
              WebkitTextStroke: "0.032em currentColor",
            }}
          >
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </span>
  );
}
