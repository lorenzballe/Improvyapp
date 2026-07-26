import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, Check, Bell, ShieldCheck, Apple, Smartphone } from "lucide-react";
import { AppLogo } from "./AppLogo";

interface CheckoutProProps {
  onBack: () => void;
}

const CONTACT_EMAIL = "thebalecompany@gmail.com";

const PRO_FEATURES = [
  "Complete unlock of all 12 keys",
  "Chromatic Mode + jazz extensions (9, 11, 13, altered)",
  "Note-to-Number, Custom, …Of What? & Pocket unlocks",
  "Real-time Adaptive Difficulty algorithm",
  "Deep Analytics: keyboard heatmap and reaction times",
  "No subscription — one payment, yours for life",
];

/**
 * Pre-launch Pro page.
 *
 * Improvy Pro is an in-app purchase handled by the App Store / Play Store, so
 * there is no card form here: before launch the only honest action is to let
 * people ask to be told when it ships.
 */
export function CheckoutPro({ onBack }: CheckoutProProps) {
  const mailto =
    `mailto:${CONTACT_EMAIL}` +
    `?subject=${encodeURIComponent("Improvy — notify me at launch")}` +
    `&body=${encodeURIComponent(
      "Hi! I'd like to be notified as soon as Improvy is available.\n\n(You can just send this email as-is.)"
    )}`;

  return (
    <div className="w-full max-w-3xl mx-auto px-6 pt-28 pb-16 md:pt-32 md:pb-24 text-zinc-300 font-sans relative z-30">
      <button
        onClick={onBack}
        className="group mb-10 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </button>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative overflow-hidden p-[2px] rounded-[30px] group"
      >
        {/* Rotating rainbow-gold halo, matching the pricing card */}
        <div className="absolute -inset-[200%] bg-[conic-gradient(from_0deg,#e5a93c_0deg,#f43f5e_60deg,#a855f7_120deg,#3b82f6_180deg,#10b981_240deg,#e5a93c_300deg)] animate-spin-slow opacity-80" />

        <div className="relative bg-[#07050d] rounded-[28px] p-8 sm:p-12 overflow-hidden backdrop-blur-3xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#e5a93c]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 shrink-0">
                <AppLogo />
              </div>
              <div>
                <span className="text-[9px] font-sans font-extrabold uppercase tracking-[0.22em] text-[#e5a93c]">
                  LIFETIME PRO UNLOCK
                </span>
                <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white leading-none mt-1">
                  Improvy Pro
                </h1>
              </div>
            </div>

            <p className="text-sm text-zinc-350 font-light leading-relaxed">
              Improvy is launching soon on the App Store and Google Play. Pro unlocks with a
              single in-app purchase — no subscription, no recurring fees, yours for life.
            </p>

            {/* Price */}
            <div className="py-5 border-t border-b border-white/[0.06]">
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white font-sans tracking-tight">€16.99</span>
                <span className="text-xs text-zinc-500 font-sans font-medium">/ one-time, at launch</span>
              </div>
              <span className="text-[9px] text-[#e5a93c] block mt-2 uppercase tracking-widest font-extrabold">
                The app itself is free to download and start
              </span>
            </div>

            {/* What's included */}
            <div className="space-y-4">
              <p className="text-[9px] text-[#e5a93c] font-black uppercase tracking-widest font-sans">
                What Pro includes:
              </p>
              <ul className="space-y-3.5 text-xs text-zinc-100 font-sans font-light">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#e5a93c]/12 border border-[#e5a93c]/25 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#e5a93c] stroke-[3]" />
                    </div>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Primary action — the only thing that can honestly happen today */}
            <div className="pt-2 space-y-3">
              <a
                href={mailto}
                className="relative w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 via-purple-600 via-[#e5a93c] to-amber-500 text-white text-xs font-black uppercase tracking-widest transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-white/10 shadow-xl shadow-rose-600/10 hover:brightness-110"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Tell me when Improvy launches</span>
              </a>
              <p className="text-[10.5px] text-zinc-500 text-center leading-relaxed">
                We'll only write once, on release day. No card details are collected here —
                Pro is purchased inside the app, through Apple or Google.
              </p>
            </div>

            {/* Reassurance */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {[
                { icon: Apple, label: "iOS at launch" },
                { icon: Smartphone, label: "Android at launch" },
                { icon: ShieldCheck, label: "No subscription" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3"
                >
                  <Icon className="w-4 h-4 text-[#e5a93c] shrink-0" />
                  <span className="text-[11px] text-zinc-300 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
