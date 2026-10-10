import { confirmedCreator } from "../lib/creators";

/**
 * The line a creator's audience sees first: the click continues the video it
 * came from — who recommended Improvy, their code, and where it goes. Shown
 * only for creators listed in lib/creators.ts; for anyone else, nothing.
 */
export function CreatorWelcome() {
  const c = confirmedCreator();
  if (!c) return null;
  return (
    <div className="inline-flex max-w-full flex-col gap-1.5 rounded-2xl border border-[#e5a93c]/30 bg-[#e5a93c]/[0.07] px-4 py-3 text-left">
      <span className="text-[10px] font-black uppercase tracking-[0.22em] text-[#e5a93c]">
        Recommended by {c.name}
        {c.channel ? ` · ${c.channel}` : ""}
      </span>
      <span className="text-xs leading-relaxed text-zinc-300">
        Code <strong className="font-black text-white">{c.code}</strong>: {c.pct}% off Pro. On this site it is applied for you; in the app, enter it in{" "}
        <span className="text-white">Settings → Have a code?</span>
      </span>
    </div>
  );
}
