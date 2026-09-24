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

/** Outbound link to a processor's own policy, styled like the rest of the page. */
function Ext({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-[#e5a93c] hover:text-white hover:underline">
      {children}
    </a>
  );
}

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
            <p className="text-xs uppercase tracking-widest text-zinc-500">Last updated: 24 September 2026</p>
            <p>
              Improvy (“App”, “we”, “us”) — the app and this website — is developed and operated by Lorenzo
              Ballestrazzi (“Developer”). This Privacy Policy explains what information we collect, how we use it,
              and your rights.
            </p>
            <p>
              The short version: you can use Improvy without an account, and then we hold nothing that identifies
              you — only anonymous usage data and a coarse, IP-based location. If you choose to create an account
              (so that Pro follows you across devices, to redeem a code, or to buy Pro on this site), we hold the
              little an account needs: an identifier, your email address, and how you signed in. Everything below
              simply spells that out.
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <Section n="01" title="Information We Collect" color="text-[#e5a93c]/90">
            <p>
              We never collect your name, phone number, contacts, photos, or precise location. Depending on how you
              use Improvy, we collect:
            </p>
            <Point title="Anonymous usage events">
              Sessions started and completed, the training mode selected, accuracy and average response time, the
              key and difficulty chosen, and level-up or streak milestones. For a purchase in the app we also record
              its outcome — the product, its price and currency, the store's transaction reference, and whether it
              was a test purchase — and, when the store refuses one, which app store installed Improvy. On their own
              these contain nothing that identifies you.
            </Point>
            <Point title="Account data (only if you sign in)">
              Signing in with Apple, Google or an email address creates an account with a unique identifier, your
              email address, the sign-in method, and the times the account was created and last used. Email
              passwords are handled by Firebase Authentication and are never visible to us. With Sign in with Apple
              you may hide your address, in which case we receive Apple’s private relay address instead.
            </Point>
            <Point title="Purchase and licence status">
              Whether Improvy Pro is active and how it was obtained: an app-store purchase (managed by RevenueCat,
              which receives the store receipt), a promotional code redeemed on your account (we store which code
              and when), or a purchase on this website (we store the Stripe payment reference, the amount, the
              currency, the time, and the email address you gave at checkout). We never receive or store your card
              details — those stay with Apple, Google or Stripe.
            </Point>
            <Point title="Device metadata (via PostHog)">
              Our analytics provider may automatically record app version, operating system version, device model,
              and screen resolution, under a random per-install identifier. If you sign in, that identifier is
              linked to your account identifier and your email is stored as a property of the profile, so your usage
              across devices is one record rather than several strangers.
            </Point>
            <Point title="Approximate location">
              PostHog derives a coarse location — roughly your city, region, and country — from the IP address of
              each request, so we can see broadly where Improvy is used. The app itself never asks for location
              access and cannot read your device’s GPS. It is used only for analytics, never for advertising.
            </Point>
            <Point title="Feedback you choose to send">
              The app has a feedback box in Settings and this site has a feedback page. We receive only what you
              type: the message, the category, and — if you fill it in — a reply address. Leaving it blank keeps the
              message anonymous.
            </Point>
            <Point title="Cookies on this website">
              This website sets no advertising or analytics cookies, and its analytics keep nothing in your browser
              once the tab is closed — which is why there is no cookie banner. If you sign in to buy Pro, Firebase
              keeps your sign-in in your browser's storage so that you stay signed in; that storage is strictly
              necessary for the purchase and is removed when you sign out.
            </Point>
          </Section>

          <Section n="02" title="How We Use Your Information" color="text-rose-500/90">
            <p>We use this information only to:</p>
            <Point title="Run your account">Sign you in, keep your Pro licence attached to it, and honour promotional codes.</Point>
            <Point title="Deliver what you bought">Recognise a licence on any device you sign in on, and handle refunds and disputes where they arise.</Point>
            <Point title="Improve the app">Understand which training features are most useful, find and fix bugs, plan ahead.</Point>
            <Point title="Answer you">Read and, where you asked for one, reply to your feedback.</Point>
            <p className="pt-1">
              We do not use your data for advertising, and we never sell, rent, or share it with third parties for
              marketing purposes.
            </p>
          </Section>

          <Section n="03" title="Third-Party Services" color="text-purple-500/90">
            <Point title="Firebase (Google) — accounts and licences">
              Firebase Authentication signs you in; Cloud Firestore stores account data, code redemptions and
              licences. Google processes this on its servers in the EU and the United States under its data
              processing terms.{" "}
              <Ext href="https://firebase.google.com/support/privacy">Firebase Privacy and Security</Ext>.
            </Point>
            <Point title="Stripe — payments on this website">
              Stripe processes payments made here. Your card details go to Stripe, never to us; we receive the payment
              reference, amount, and the email you gave at checkout.{" "}
              <Ext href="https://stripe.com/privacy">Stripe Privacy Policy</Ext>.
            </Point>
            <Point title="Apple / Google — in-app purchases">
              Purchases made inside the app are processed by Apple (App Store) or Google (Play Store) under their own
              privacy policies: <Ext href="https://www.apple.com/legal/privacy">Apple</Ext> ·{" "}
              <Ext href="https://policies.google.com/privacy">Google</Ext>.
            </Point>
            <Point title="RevenueCat — purchase management">
              Verifies and manages in-app purchase status from the store receipt. If you sign in, your account
              identifier is used as the RevenueCat customer identifier so the purchase follows you, and your email
              address is attached to it.{" "}
              <Ext href="https://www.revenuecat.com/privacy">RevenueCat Privacy Policy</Ext>.
            </Point>
            <Point title="PostHog — analytics">
              Collects the usage events, device metadata and coarse location described above, and carries the
              feedback you send. May process data on servers in the EU.{" "}
              <Ext href="https://posthog.com/privacy">PostHog Privacy Policy</Ext>.
            </Point>
          </Section>

          <Section n="04" title="Data Retention" color="text-[#e5a93c]/90">
            <p>
              Anonymous analytics events are kept for up to 12 months and then deleted. Account data is kept for as
              long as the account exists. Licence and payment records are kept for as long as the licence is valid
              and, afterwards, for as long as accounting and tax law require. Your local app data — training history,
              settings, streak — is stored only on your device and is removed when you uninstall the app.
            </p>
            <p>
              You can delete your account from the app’s Settings at any time. Doing so removes your sign-in and
              account data and gives up any licence tied to it; anonymised usage data and legally required payment
              records may remain.
            </p>
          </Section>

          <Section n="05" title="Your Rights (GDPR)" color="text-rose-500/90">
            <p>
              If you are in the European Economic Area, you have the right to access, correct, or delete your
              personal data, to object to or restrict its processing, to receive it in a portable form, and to lodge
              a complaint with your national data protection authority.
            </p>
            <p>
              Without an account there is typically no personal data to act on. With one, most of this you can do
              yourself in Settings; for anything else, contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#e5a93c] hover:text-white hover:underline">
                {CONTACT_EMAIL}
              </a>{" "}
              and we will respond within 30 days.
            </p>
            <p className="text-xs text-zinc-500">
              Legal bases: performance of a contract (your account and your licence), legitimate interests (improving
              the app, applied to anonymous events), and legal obligation (keeping payment records).
            </p>
          </Section>

          <Section n="06" title="Children’s Privacy" color="text-purple-500/90">
            <p>
              Improvy is suitable for all ages. We do not knowingly collect personal information from children under
              13, and accounts are for people 13 and over. If you believe a child has provided personal data, contact
              us and we will delete it promptly.
            </p>
          </Section>

          <Section n="07" title="Security" color="text-[#e5a93c]/90">
            <p>
              We use reasonable technical measures to protect data in transit and at rest, and we hold as little of
              it as the service needs. Access to account and licence data is restricted to what the app and the
              website require to work.
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
