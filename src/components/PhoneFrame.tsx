import { PhoneScreen } from "./PhoneScreen";

/**
 * The whole phone for the home page: a 10px black bezel, the titanium edge
 * and the side buttons where an iPhone 16 Pro has them, around a
 * true-to-scale screen. 300px wide; the height follows from the screen.
 */
export function PhoneFrame({ src, alt, eager = false }: { src: string; alt: string; eager?: boolean }) {
  return (
    <div className="relative w-[300px] max-w-[78vw] rounded-[48px] bg-[#0a0a0c] p-[10px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.85)]">
      {/* The metal band: a thin light edge outside, a dark one inside. */}
      <div className="absolute inset-0 rounded-[48px] ring-1 ring-white/[0.14] pointer-events-none" />
      <div className="absolute inset-[3px] rounded-[45px] ring-1 ring-black pointer-events-none" />

      {/* Action button, volume up and down on the left; side button on the right. */}
      <span className="absolute -left-[3px] top-[112px] h-[26px] w-[3px] rounded-l bg-zinc-700" />
      <span className="absolute -left-[3px] top-[158px] h-[46px] w-[3px] rounded-l bg-zinc-700" />
      <span className="absolute -left-[3px] top-[214px] h-[46px] w-[3px] rounded-l bg-zinc-700" />
      <span className="absolute -right-[3px] top-[178px] h-[72px] w-[3px] rounded-r bg-zinc-700" />

      <PhoneScreen src={src} alt={alt} radius={38} eager={eager} />
    </div>
  );
}
