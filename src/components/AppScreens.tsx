import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { DownloadFree } from "./StoreBadges";
import type { Platform } from "../lib/platform";
import { SCREENS_INTRO, STORE_SCREENSHOTS } from "../lib/appImages";

/**
 * The app's five store screenshots, on the home page.
 *
 * The home page is the page a search for "Improvy" finds, and an image search
 * shows the pictures of the pages it finds: with only a phone drawn in HTML
 * and the share card, it had nothing of the app to show. These are real
 * files under images/, each with words that say what is in it — the same
 * ones /app/ shows, listed in the sitemap for this page too.
 *
 * On a phone they scroll sideways, one and a bit at a time; on a computer
 * the five stand in a row, as on the App Store.
 */
export function AppScreens({ platform }: { platform: Platform }) {
  return (
    <section
      id="screens"
      aria-labelledby="screens-title"
      className="relative z-30 max-w-7xl mx-auto px-6 md:px-12 pb-6 scroll-mt-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center space-y-4 mb-10 sm:mb-14"
      >
        <p className="inline-block text-[11px] sm:text-xs font-sans uppercase tracking-[0.24em] bg-gradient-to-r from-[#f43f5e] via-[#d946ef] to-[#6366f1] bg-clip-text text-transparent font-black">
          On iPhone and Android
        </p>
        <h2
          id="screens-title"
          className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight uppercase leading-none"
        >
          Inside{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500">
            the app.
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed max-w-xl mx-auto">{SCREENS_INTRO}</p>
      </motion.div>

      <motion.ul
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="m-0 p-0 list-none flex lg:grid lg:grid-cols-5 gap-5 lg:gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scroll-px-6 md:scroll-px-12 -mx-6 px-6 md:-mx-12 md:px-12 lg:mx-0 lg:px-0 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {STORE_SCREENSHOTS.map((s) => (
          <li key={s.file} className="snap-start shrink-0 w-[70%] sm:w-[40%] md:w-[30%] lg:w-auto">
            <figure className="m-0">
              <img
                src={`images/${s.file}`}
                width={s.w}
                height={s.h}
                alt={s.alt}
                loading="lazy"
                decoding="async"
                className="block w-full h-auto rounded-[22px] sm:rounded-[26px] border border-white/[0.06] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)]"
              />
              <figcaption className="mt-4 text-left">
                <span className="block text-xs sm:text-sm font-black text-white font-display tracking-wide uppercase">
                  {s.name}
                </span>
                <span className="mt-1.5 block text-xs text-zinc-400 font-light leading-relaxed">{s.text}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </motion.ul>

      <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-8">
        <DownloadFree platform={platform} placement="screens" />
        <a
          href="app/"
          className="group inline-flex items-center gap-2 text-sm font-sans text-zinc-300 hover:text-white transition-colors duration-200"
        >
          <span>Every screen, on its own page</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
}
