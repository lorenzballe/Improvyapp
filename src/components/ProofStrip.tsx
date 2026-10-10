import { testimonialsList } from "./TestimonialsColumn";

/** The two teachers quoted right under the headline, by name. */
const QUOTED = ["Sarah Fratai", "Roberto Bisi"];

/**
 * Two teachers' words where a visitor is still deciding whether to read on.
 * The full wall of testimonials is further down the page; these are the same
 * words, word for word, just met sooner.
 */
export function ProofStrip() {
  const quotes = QUOTED.map((name) => testimonialsList.find((t) => t.name === name)).filter(
    (t): t is (typeof testimonialsList)[number] => !!t
  );
  return (
    <section aria-label="What teachers say" className="relative z-30 max-w-5xl mx-auto px-6 md:px-12 -mt-10 sm:-mt-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quotes.map((t) => (
          <figure
            key={t.name}
            className="rounded-2xl border border-white/[0.06] bg-[#0b0617]/50 backdrop-blur-3xl px-5 py-4 sm:px-6 sm:py-5 text-left"
          >
            <blockquote className="text-sm text-zinc-200 font-light leading-relaxed">“{t.text}”</blockquote>
            <figcaption className="mt-3 text-[9.5px] font-sans font-bold uppercase tracking-widest text-zinc-500">
              <span className="text-white">{t.name}</span> · {t.role}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
