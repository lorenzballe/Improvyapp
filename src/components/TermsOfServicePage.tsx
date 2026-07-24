import React from "react";
import { motion } from "motion/react";

interface TermsOfServicePageProps {
  onBack: () => void;
}

function Section({ n, title, color, children }: { n: string; title: string; color: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4 border-b border-white/[0.04] pb-10">
      <div className="flex items-baseline gap-4">
        <span className={`text-3xl font-black font-display ${color} leading-none`}>{n}</span>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">{title}</h2>
      </div>
      <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-4">
        {children}
      </div>
    </div>
  );
}

function Point({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1 border-l border-white/5 pl-4 py-1">
      <h3 className="text-sm font-bold text-white uppercase tracking-wider">{title}</h3>
      <p className="text-zinc-400">{children}</p>
    </div>
  );
}

const CONTACT_EMAIL = "thebalecompany@gmail.com";

export default function TermsOfServicePage({ onBack }: TermsOfServicePageProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-6 pt-28 pb-16 md:pt-36 md:pb-24 text-zinc-350 font-sans relative z-30">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-14 text-left"
      >
        {/* Header */}
        <div className="space-y-6 pb-10 border-b border-white/[0.08]">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#e5a93c]">
            THE FINE PRINT
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight uppercase leading-[1.1] select-none">
            IMPROVY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5a93c] via-rose-500 to-purple-500">
              TERMS OF SERVICE
            </span>
          </h1>
          <div className="space-y-4 text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-2xl pt-2">
            <p className="text-xs uppercase tracking-widest text-zinc-500">Last updated: 24 July 2026</p>
            <p>Please read these Terms of Service (“Terms”) carefully before using Improvy.</p>
          </div>
        </div>

        <div className="space-y-12">
          <Section n="01" title="Acceptance" color="text-[#e5a93c]/90">
            <p>
              By downloading, installing, or using the Improvy app (“App”), you confirm that you have read and agree
              to these Terms. If you do not agree, do not use the App.
            </p>
          </Section>

          <Section n="02" title="Description of the App" color="text-rose-500/90">
            <p>
              Improvy is a music-training application that helps you master where every scale degree lives across
              all 12 keys — building the instant recall used for improvisation, transposition, and composition. The
              App is available on iOS and Android.
            </p>
          </Section>

          <Section n="03" title="License" color="text-purple-500/90">
            <p>
              Subject to these Terms, we grant you a limited, personal, non-exclusive, non-transferable, revocable
              licence to use the App on devices you own or control, solely for personal, non-commercial training.
            </p>
            <p>You may not:</p>
            <Point title="Copy or modify">Copy, modify, distribute, or create derivative works of the App.</Point>
            <Point title="Reverse-engineer">Reverse-engineer, decompile, or disassemble the App.</Point>
            <Point title="Commercial use">Use the App for any commercial purpose without our prior written consent.</Point>
            <Point title="Automation">Use bots, scrapers, or other automated tools to interact with the App.</Point>
          </Section>

          <Section n="04" title="Improvy Pro" color="text-[#e5a93c]/90">
            <p>
              Certain features (“Improvy Pro”) are unlocked with a <span className="text-white font-semibold">one-time
              in-app purchase</span> — a lifetime upgrade, not a subscription. There are no recurring fees.
            </p>
            <Point title="Price">Displayed in your local currency at the time of purchase.</Point>
            <Point title="Payment & refunds">
              Purchases and refunds are handled by Apple (App Store) or Google (Play Store) under their own
              policies. For a refund, contact Apple Support or Google Play Support directly.
            </Point>
            <Point title="Restoring purchases">
              If you reinstall the App or switch devices, restore Pro from the Settings screen using the same Apple
              ID or Google account — no additional payment is required.
            </Point>
            <p className="pt-1">
              We may add, modify, or discontinue features at any time. Existing Pro users keep access to the
              features available at the time of their purchase.
            </p>
          </Section>

          <Section n="05" title="Conduct" color="text-rose-500/90">
            <p>
              Improvy has no user-generated content or social features. You agree to use the App only for lawful
              purposes.
            </p>
          </Section>

          <Section n="06" title="Intellectual Property" color="text-purple-500/90">
            <p>
              All content within the App — including the music-engine logic, user interface, graphics, animations,
              and text — is owned by Lorenzo Ballestrazzi and protected by Italian and international copyright,
              trademark, and other intellectual property laws.
            </p>
            <p>
              “Improvy” and the Improvy logo are trademarks of Lorenzo Ballestrazzi. You may not use them without
              prior written permission.
            </p>
          </Section>

          <Section n="07" title="Disclaimer of Warranties" color="text-[#e5a93c]/90">
            <p className="uppercase text-xs tracking-wide text-zinc-400">
              The App is provided “as is” and “as available” without warranty of any kind, express or implied,
              including warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>
            <p>
              We do not warrant that the App will always be available or error-free, that defects will be corrected,
              or that it is free of harmful components.
            </p>
          </Section>

          <Section n="08" title="Limitation of Liability" color="text-rose-500/90">
            <p>
              To the maximum extent permitted by law, Lorenzo Ballestrazzi shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising from your use of, or inability to use,
              the App.
            </p>
            <p>
              Our total liability for any claim shall not exceed the amount you paid for Improvy Pro (or €0 if you
              have not purchased Pro).
            </p>
          </Section>

          <Section n="09" title="Governing Law & Jurisdiction" color="text-purple-500/90">
            <p>
              These Terms are governed by the laws of Italy, and any dispute shall be subject to the exclusive
              jurisdiction of the courts of Italy.
            </p>
            <p>
              If you are a consumer resident in the EU, you may also use the EU Online Dispute Resolution platform at{" "}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" className="text-[#e5a93c] hover:text-white hover:underline">
                ec.europa.eu/consumers/odr
              </a>.
            </p>
          </Section>

          <Section n="10" title="Changes to These Terms" color="text-[#e5a93c]/90">
            <p>
              We may update these Terms at any time. We will note significant changes in the App or by updating the
              “Last updated” date above. Continued use after changes take effect means you accept the revised Terms.
            </p>
          </Section>

          <div className="space-y-4 pb-4">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-rose-500/90 leading-none">11</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">Contact</h2>
            </div>
            <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-2">
              <p className="font-semibold text-white">Lorenzo Ballestrazzi</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#e5a93c] hover:text-white hover:underline font-medium">
                {CONTACT_EMAIL}
              </a>
              <div className="pt-6">
                <button
                  onClick={onBack}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl font-bold text-xs uppercase tracking-wider text-white cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
