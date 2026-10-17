import { ArrowLeft } from "lucide-react";

/**
 * The way back to the home page, drawn the same on every page that has one
 * (the static pages in tools/degree-pages.ts draw it with the same classes).
 */
export function ReturnHome({ onBack, className = "mb-10" }: { onBack: () => void; className?: string }) {
  return (
    <div className={`${className} text-left`}>
      <button
        onClick={onBack}
        className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-zinc-900/80 px-3.5 py-2 text-[10px] font-black uppercase tracking-widest text-rose-500 transition-all duration-200 hover:bg-zinc-800 hover:text-white active:scale-95 cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5 text-rose-500 transition-transform group-hover:-translate-x-0.5" />
        <span>Return to Home</span>
      </button>
    </div>
  );
}
