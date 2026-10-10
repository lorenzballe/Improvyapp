import { cn } from "../lib/utils";
import { withCampaign } from "../lib/referral";
import { track } from "../lib/analytics";
import type { Platform } from "../lib/platform";

/**
 * The two store badges. One place, because they appear on the home page and
 * on the Pro page and the two used to be typed out twice.
 *
 * No locale in the App Store URL: Apple routes each visitor to their own
 * storefront, which /it/ would not do.
 */
export const APP_STORE_URL = "https://apps.apple.com/app/id6775236759";
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.improvy.app";

export function StoreBadges({ className, compact = false }: { className?: string; compact?: boolean }) {
  const base = cn(
    "flex items-center gap-4 bg-zinc-900 border border-white/10 text-white rounded-2xl transition-all duration-300 active:scale-95 cursor-pointer shadow-lg group relative overflow-hidden focus:outline-none focus:ring-0",
    compact ? "px-5 py-3 w-full sm:w-[200px]" : "px-6 py-4 w-full sm:w-[220px]"
  );
  return (
    <div className={cn("flex flex-wrap gap-4", className)}>
      <a
        href={withCampaign(APP_STORE_URL)}
        // The step between a creator's video and an install: the one number
        // the site can see that says the visit was worth something.
        onClick={() => track("store_clicked", { store: "app_store" })}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download Improvy on the App Store"
        className={cn(base, "hover:border-[#e5a93c]/50 hover:shadow-[0_0_20px_rgba(229,169,60,0.15)]")}
      >
        <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
        <AppleLogo className="w-7 h-7 text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
        <div className="flex flex-col items-start leading-none text-left">
          <span className="text-[10.5px] text-zinc-500 font-sans tracking-[0.12em] font-bold uppercase mb-1 whitespace-nowrap">Download on the</span>
          <span className="text-base font-sans font-bold text-white">App Store</span>
        </div>
      </a>

      <a
        href={withCampaign(PLAY_STORE_URL)}
        onClick={() => track("store_clicked", { store: "google_play" })}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get Improvy on Google Play"
        className={cn(base, "hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]")}
      >
        <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
        <PlayLogo className="w-7 h-7 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300" />
        <div className="flex flex-col items-start leading-none text-left">
          <span className="text-[10.5px] text-zinc-500 font-sans tracking-[0.12em] font-bold uppercase mb-1 whitespace-nowrap">Get it on</span>
          <span className="text-base font-sans font-bold text-white">Google Play</span>
        </div>
      </a>
    </div>
  );
}

function AppleLogo({ className }: { className?: string }) {
  return (
    <svg className={cn("fill-current shrink-0", className)} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 1.15-3.27 1.2-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5 1.07 3.29 1.07.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.02.07-.43 1.44-1.38 2.82M15.97 4.17c.66-.8 1.1-1.89 1.08-3.17-.91.04-2.01.6-2.67 1.38-.56.66-1.05 1.76-.9 3.01 1.05.08 2.06-.51 2.49-1.22z" />
    </svg>
  );
}

function PlayLogo({ className }: { className?: string }) {
  return (
    <svg className={cn("shrink-0", className)} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3.25 1.75C3.06 1.93 2.95 2.22 2.95 2.6V21.4C2.95 21.78 3.06 22.07 3.25 22.25L3.32 22.32L13.84 11.8V11.53L3.32 1.01L3.25 1.75Z" fill="#00A0FF" />
      <path d="M17.34 15.33L13.84 11.82V11.51L17.34 8L17.42 8.04L21.57 10.4C22.75 11.07 22.75 12.26 21.57 12.93L17.42 15.29L17.34 15.33Z" fill="#FFE000" />
      <path d="M13.84 11.66L3.25 22.25C3.59 22.59 4.19 22.61 4.88 22.22L17.34 15.14L13.84 11.66Z" fill="#FF2C00" />
      <path d="M13.84 11.66L17.34 8.18L4.88 1.1C4.19 0.71 3.59 0.73 3.25 1.07L13.84 11.66Z" fill="#00E676" />
    </svg>
  );
}

/**
 * The page's first ask: the free download, from the store this device uses.
 * On a phone, one button straight to that store; on a computer, where nothing
 * installs, the two badges. Pro is the second step, never the first — a
 * stranger asked to pay before trying mostly leaves.
 */
export function DownloadFree({ platform, placement, className }: { platform: Platform; placement: string; className?: string }) {
  if (platform === "desktop") return <StoreBadges className={className} />;
  const ios = platform === "ios";
  return (
    <a
      href={withCampaign(ios ? APP_STORE_URL : PLAY_STORE_URL)}
      onClick={() => track("store_clicked", { store: ios ? "app_store" : "google_play", placement })}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group relative flex w-full sm:w-auto items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white px-7 py-4 text-zinc-950 shadow-[0_8px_40px_rgba(255,255,255,0.18)] transition-all duration-300 active:scale-95 focus:outline-none",
        className
      )}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-indigo-300/0 via-rose-300/30 to-amber-200/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
      {ios ? <AppleLogo className="relative w-6 h-6 text-zinc-950" /> : <PlayLogo className="relative w-6 h-6" />}
      <span className="relative flex flex-col items-start leading-none text-left">
        <span className="text-[15px] font-black tracking-tight">Download free</span>
        <span className="mt-1 text-[10.5px] font-bold uppercase tracking-[0.14em] text-zinc-500">{ios ? "on the App Store" : "on Google Play"}</span>
      </span>
    </a>
  );
}
