import { ArrowLeft, BarChart3, CalendarCheck, Headphones, Mail, SlidersHorizontal } from "lucide-react";
import { DownloadFree } from "./StoreBadges";
import type { Platform } from "../lib/platform";

const EMAIL = "thebalecompany@gmail.com";

const mailto = (subject: string, body: string) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

const TEACHER_PRO = mailto(
  "Improvy Pro for teachers",
  "Hi Lorenzo,\n\nI teach (instrument / subject): \nAt (school, conservatory, or privately): \nA link to my school or teaching page: \n\nThanks!"
);

const CLASS_PACK = mailto(
  "Improvy classroom pack",
  "Hi Lorenzo,\n\nI'd like Pro for my students.\nHow many students: \nSchool or studio: \nName and address for the invoice: \n\nThanks!"
);

/** What a pack costs. One payment, Pro for life for every student in it. */
const PACKS = [
  { name: "Class", students: 10, price: "€99", each: "€9.90 a student" },
  { name: "School", students: 30, price: "€249", each: "€8.30 a student" },
];

const USES = [
  {
    icon: SlidersHorizontal,
    title: "Homework that takes five minutes",
    text: "Custom Mode drills exactly what you are working on: this week's keys, the 3s and 7s for guide tones, the 9s and 13s for voicings.",
  },
  {
    icon: CalendarCheck,
    title: "A Daily Challenge to open the lesson",
    text: "Fifteen questions on one clock, the same for everyone in the world that day. Compare times at the start of the lesson; the streak does the rest at home.",
  },
  {
    icon: BarChart3,
    title: "Where each student is slow",
    text: "Per-key stats on every student's phone show the keys and degrees that still take time. That is next week's homework.",
  },
  {
    icon: Headphones,
    title: "Practice away from the instrument",
    text: "Pocket Mode asks and answers out loud with the screen off: on the bus, on a walk, the morning of an exam.",
  },
];

const FAQ = [
  {
    q: "Which instruments is it for?",
    a: "Any. The degrees are the same on piano, guitar, sax or bass; the keyboard on screen is only where the notes are shown.",
  },
  {
    q: "iPhone, iPad and Android?",
    a: "All three. The code works in the app from either store, and Pro stays with the student's account on any phone.",
  },
  {
    q: "Do students need an account?",
    a: "To use a code, yes: they sign in with Apple, Google or an email, then enter it in Settings → Have a code? — so Pro follows them to a new phone.",
  },
  {
    q: "What does Pro add to the free app?",
    a: "The free app already trains the major scale in every key. Pro adds the chromatic degrees in all 12 keys, the jazz extensions (9, 11, 13 and the altered ones), Custom Mode, adaptive difficulty and per-key stats.",
  },
];

/**
 * For teachers: Pro free for them to try, and Pro for a whole class at once.
 * A teacher is one person who brings twenty; the page asks them for nothing
 * but an email.
 */
export default function TeachersPage({ onBack, platform }: { onBack: () => void; platform: Platform }) {
  return (
    <div className="relative z-30 mx-auto w-full max-w-5xl px-4 pt-24 pb-16 md:pt-28 text-zinc-300 font-sans">
      <div className="mb-10 text-left">
        <button
          onClick={onBack}
          className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.06] bg-zinc-900/80 px-3.5 py-2 text-[10px] font-black uppercase tracking-widest text-rose-500 transition-all duration-200 hover:bg-zinc-800 hover:text-white active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-rose-500 transition-transform group-hover:-translate-x-0.5" />
          <span>Return to Home</span>
        </button>
      </div>

      {/* Hero */}
      <header className="text-left max-w-3xl">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#e5a93c]">For teachers</p>
        <h1 className="mt-4 font-display text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.05]">
          You teach the numbers.
          <br />
          <span className="italic font-normal font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#e5a93c] via-rose-500 to-purple-500 pr-2">
            Improvy makes them instant.
          </span>
        </h1>
        <p className="mt-6 text-base sm:text-lg text-zinc-400 font-light leading-relaxed">
          Your students know why the ♭7 matters. Knowing which note it is — in E♭, in B, at tempo — takes a kind of repetition
          no lesson has time for. Improvy is that repetition: a few minutes a day, in all 12 keys, on their phone.
        </p>
      </header>

      {/* Free Pro for the teacher */}
      <section className="mt-14 rounded-[28px] border border-[#e5a93c]/25 bg-[#e5a93c]/[0.05] p-6 sm:p-10">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">Pro for you, free</h2>
            <p className="mt-3 text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-2xl">
              If you teach — privately, at a school or at a conservatory — write and you get a code that unlocks Pro on your
              account. Use it in your own practice and with a student or two before you recommend it to anyone.
            </p>
          </div>
          <a
            href={TEACHER_PRO}
            className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white text-zinc-950 text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors duration-200"
          >
            <Mail className="w-4 h-4" />
            Ask for your free Pro
          </a>
        </div>
      </section>

      {/* Classroom packs */}
      <section className="mt-16">
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Pro for the whole class</h2>
        <p className="mt-3 text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-2xl">
          One code for your class: write it on the board. Each student enters it in the app and Pro unlocks for good on their
          own account. One payment — no subscription, nothing to renew, nothing for you to manage.
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl">
          {PACKS.map((p) => (
            <div
              key={p.name}
              className="rounded-[24px] border border-white/[0.06] bg-[#07040f]/60 backdrop-blur-3xl p-6 sm:p-8 text-left"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">{p.name}</p>
              <p className="mt-2 text-white">
                <span className="text-5xl font-black tracking-tight">{p.price}</span>
                <span className="ml-2 text-sm text-zinc-400">{p.students} students</span>
              </p>
              <p className="mt-2 text-[10px] font-extrabold uppercase tracking-widest text-[#e5a93c]">{p.each} · Pro for life</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-zinc-400 font-light">
          More students, or a whole department? Write, and you get a pack that fits.
        </p>
        <a
          href={CLASS_PACK}
          className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-black uppercase tracking-widest transition-colors duration-200"
        >
          <Mail className="w-4 h-4" />
          Order a classroom pack
        </a>
        <p className="mt-3 text-xs text-zinc-400">You get an invoice by email, and the code as soon as it is paid.</p>
      </section>

      {/* How teachers use it */}
      <section className="mt-20">
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">How it fits a lesson</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {USES.map((u) => (
            <div key={u.title} className="rounded-[24px] border border-white/[0.06] bg-[#07040f]/60 backdrop-blur-3xl p-6 sm:p-7">
              <u.icon className="w-5 h-5 text-[#e5a93c]" />
              <h3 className="mt-4 text-lg font-bold text-white">{u.title}</h3>
              <p className="mt-2 text-sm text-zinc-400 font-light leading-relaxed">{u.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Questions */}
      <section className="mt-20 max-w-3xl">
        <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Questions</h2>
        <dl className="mt-8 space-y-6">
          {FAQ.map((f) => (
            <div key={f.q} className="border-b border-white/[0.06] pb-6">
              <dt className="text-base font-bold text-white">{f.q}</dt>
              <dd className="mt-2 text-sm text-zinc-400 font-light leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Try it first */}
      <section className="mt-16 text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">Try it yourself first</h2>
        <p className="mt-2 text-sm text-zinc-400 font-light">The app is free to download. Pro for teachers is one email away.</p>
        <div className="mt-6 flex justify-center">
          <DownloadFree platform={platform} placement="teachers" />
        </div>
      </section>
    </div>
  );
}
