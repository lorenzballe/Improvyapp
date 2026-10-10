/**
 * The app's own colours (lib/constants/app_colors.dart), so a note on the
 * site is the colour it is on a phone: C red, D amber, E green… by pitch,
 * whichever way it is spelled.
 */
const BY_PITCH = [
  "#ff4d4d", // C
  "#ff944d", // C♯ / D♭
  "#ffdb4d", // D
  "#ffff4d", // D♯ / E♭
  "#4dff4d", // E
  "#00dcdc", // F
  "#4d94ff", // F♯ / G♭
  "#4d4dff", // G
  "#944dff", // G♯ / A♭
  "#ff4dff", // A
  "#ff4d94", // A♯ / B♭
  "#ff4d4d", // B — the wheel comes back round to red
];

const NATURAL: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/** Pitch class of a spelled name: "E♭" → 3, "B♯" → 0, "F𝄪" → 7. */
export function pitchOf(name: string): number {
  let p = NATURAL[name[0]] ?? 0;
  for (const ch of name.slice(1)) {
    if (ch === "♯" || ch === "#") p += 1;
    else if (ch === "♭" || ch === "b") p -= 1;
    else if (ch === "𝄪") p += 2;
    else if (ch === "𝄫") p -= 2;
  }
  return ((p % 12) + 12) % 12;
}

export function noteColor(name: string): string {
  return BY_PITCH[pitchOf(name)];
}

export const LEXEND = '"Lexend", "Plus Jakarta Sans", system-ui, sans-serif';
