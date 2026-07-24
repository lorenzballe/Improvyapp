import React from "react";
import { motion } from "motion/react";

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

/** Section wrapper matching the site's About / legal visual language. */
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

export default function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
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
            DATA PROTECTION
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight uppercase leading-[1.1] select-none">
            IMPROVY <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5a93c] via-rose-500 to-purple-500">
              PRIVACY POLICY
            </span>
          </h1>
          <div className="space-y-4 text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-2xl pt-2">
            <p className="text-xs uppercase tracking-widest text-zinc-500">Last updated: 24 July 2026</p>
            <p>
              Improvy (“App”, “we”, “us”) is developed and operated by Lorenzo Ballestrazzi (“Developer”). This
              Privacy Policy explains what information we collect, how we use it, and your rights.
            </p>
            <p>
              The short version: Improvy has no accounts and collects no personal data. Everything below simply
              spells that out.
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <Section n="01" title="Information We Collect" color="text-[#e5a93c]/90">
            <p>
              Improvy does not require you to create an account. We do not collect your name, email address, phone
              number, contacts, photos, or precise location.
            </p>
            <p>We collect:</p>
            <Point title="Anonymous usage events">
              Sessions started and completed, the training mode selected, accuracy and average response time, the
              key and difficulty chosen, and level-up or streak milestones. These events contain no personally
              identifiable information and cannot be traced back to you.
            </Point>
            <Point title="Purchase status">
              Whether you have activated Improvy Pro. This is stored on your device and managed by RevenueCat. We
              never receive or store your payment details — those stay with Apple or Google.
            </Point>
            <Point title="Device metadata (via PostHog)">
              Our analytics provider may automatically record app version, operating system version, device model,
              screen resolution, and a country derived from your IP address at the time of the request. Your IP
              address is not stored by PostHog.
            </Point>
          </Section>

          <Section n="02" title="How We Use Your Information" color="text-rose-500/90">
            <p>We use anonymous usage data only to:</p>
            <Point title="Improve the app">Understand which training features are most useful.</Point>
            <Point title="Fix problems">Identify and resolve bugs.</Point>
            <Point title="Plan ahead">Prioritise future improvements.</Point>
            <p className="pt-1">
              We do not use your data for advertising, and we never sell, rent, or share it with third parties for
              marketing purposes.
            </p>
          </Section>

          <Section n="03" title="Third-Party Services" color="text-purple-500/90">
            <Point title="PostHog (analytics)">
              Collects anonymous usage events and may process data on servers located in the EU. No personal data
              is sent to PostHog, and you can opt out of analytics in the app’s Settings at any time.
            </Point>
            <Point title="Apple / Google (in-app purchases)">
              In-app purchases are processed directly by Apple (App Store) or Google (Play Store) under their own
              privacy policies.
            </Point>
            <Point title="RevenueCat (purchase management)">
              Verifies and manages your purchase status. It receives your store purchase receipt — a non-personal
              cryptographic token — and nothing more.
            </Point>
          </Section>

          <Section n="04" title="Data Retention" color="text-[#e5a93c]/90">
            <p>
              Anonymous analytics events are kept for up to 12 months and then permanently deleted. Your local app
              data — training history, settings, and streak — is stored only on your device and is removed when
              you uninstall the app.
            </p>
          </Section>

          <Section n="05" title="Your Rights (GDPR)" color="text-rose-500/90">
            <p>
              If you are in the European Economic Area, you have the right to access, correct, or delete your
              personal data, to object to or restrict its processing, and to lodge a complaint with your national
              data protection authority.
            </p>
            <p>
              Because Improvy collects only anonymous data with no account or identity, there is typically no
              personal data to access, correct, or delete. For any privacy concern, contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#e5a93c] hover:text-white hover:underline">
                {CONTACT_EMAIL}
              </a>{" "}
              and we will respond within 30 days.
            </p>
            <p className="text-xs text-zinc-500">
              Legal basis for processing: legitimate interests (improving the app), applied only to fully anonymous
              events.
            </p>
          </Section>

          <Section n="06" title="Children’s Privacy" color="text-purple-500/90">
            <p>
              Improvy is suitable for all ages. We do not knowingly collect personal information from children under
              13. If you believe a child has provided personal data, contact us and we will delete it promptly.
            </p>
          </Section>

          <Section n="07" title="Security" color="text-[#e5a93c]/90">
            <p>
              We use reasonable technical measures to protect data in transit and at rest. Because we collect no
              personal data, the risk to you is minimal.
            </p>
          </Section>

          <Section n="08" title="Changes to This Policy" color="text-rose-500/90">
            <p>
              We may update this Privacy Policy. When we do, we will revise the “Last updated” date above and, for
              material changes, notify you within the app. The latest version is always available in the app and on
              this website.
            </p>
          </Section>

          <div id="get-in-touch" className="space-y-4 pb-4 scroll-mt-28">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-purple-500/90 leading-none">09</span>
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
