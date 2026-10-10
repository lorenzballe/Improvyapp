/** One octave, C to B: seven white keys and the five black ones between. */
const WHITES = [
  { pc: 0, name: "C" },
  { pc: 2, name: "D" },
  { pc: 4, name: "E" },
  { pc: 5, name: "F" },
  { pc: 7, name: "G" },
  { pc: 9, name: "A" },
  { pc: 11, name: "B" },
];
/** Each black key and the white key it sits just after. */
const BLACKS = [
  { pc: 1, after: 0, name: "C♯ or D♭" },
  { pc: 3, after: 1, name: "D♯ or E♭" },
  { pc: 6, after: 3, name: "F♯ or G♭" },
  { pc: 8, after: 4, name: "G♯ or A♭" },
  { pc: 10, after: 5, name: "A♯ or B♭" },
];

/** A key lit after an answer: the right one in its degree's colour, a wrong tap in red. */
export interface KeyMark {
  pc: number;
  color: string;
}

/**
 * The keyboard the site's questions are answered on. Only the white keys are
 * named, the way a player knows them; a black key is whichever name the key
 * asks for, and either sounds right.
 */
export function MiniKeyboard({
  onPick,
  marks = [],
  disabled = false,
}: {
  onPick: (pc: number) => void;
  marks?: KeyMark[];
  disabled?: boolean;
}) {
  const markOf = (pc: number) => marks.find((m) => m.pc === pc)?.color;
  return (
    <div className="relative w-full select-none touch-manipulation" style={{ aspectRatio: "7 / 3.3" }}>
      <div className="absolute inset-0 flex gap-[3px]">
        {WHITES.map((k) => {
          const mark = markOf(k.pc);
          return (
            <button
              key={k.pc}
              type="button"
              aria-label={k.name}
              disabled={disabled}
              onClick={() => onPick(k.pc)}
              className="relative flex-1 rounded-b-xl rounded-t-[3px] bg-zinc-100 enabled:hover:bg-white enabled:active:bg-zinc-300 transition-colors duration-150 flex items-end justify-center pb-2 cursor-pointer disabled:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e5a93c]"
              style={mark ? { background: mark } : undefined}
            >
              <span className={mark ? "text-[11px] font-black text-white" : "text-[11px] font-bold text-zinc-400"}>{k.name}</span>
            </button>
          );
        })}
      </div>
      {BLACKS.map((k) => {
        const mark = markOf(k.pc);
        return (
          <button
            key={k.pc}
            type="button"
            aria-label={k.name}
            disabled={disabled}
            onClick={() => onPick(k.pc)}
            className="absolute top-0 z-10 h-[60%] w-[9.5%] -translate-x-1/2 rounded-b-lg bg-zinc-900 border border-white/10 enabled:hover:bg-zinc-800 enabled:active:bg-zinc-700 transition-colors duration-150 cursor-pointer disabled:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e5a93c]"
            style={{ left: `${((k.after + 1) / 7) * 100}%`, ...(mark ? { background: mark, borderColor: mark } : {}) }}
          />
        );
      })}
    </div>
  );
}
