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
            <p className="text-xs uppercase tracking-widest text-zinc-500">Last updated: 24 September 2026</p>
            <p>Please read these Terms of Service (“Terms”) carefully before using Improvy or buying Improvy Pro.</p>
          </div>
        </div>

        <div className="space-y-12">
          <Section n="01" title="Acceptance" color="text-[#e5a93c]/90">
            <p>
              By downloading, installing, or using the Improvy app (“App”), or by creating an account or buying
              Improvy Pro on this website, you confirm that you have read and agree to these Terms. If you do not
              agree, do not use the App or the website.
            </p>
          </Section>

          <Section n="02" title="Description" color="text-rose-500/90">
            <p>
              Improvy is a music-training application that helps you master where every scale degree lives across
              all 12 keys — building the instant recall used for improvisation, transposition, and composition. The
              App is available on iOS and Android; this website presents it and sells Improvy Pro.
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
            <Point title="Automation">Use bots, scrapers, or other automated tools to interact with the App or the website.</Point>
          </Section>

          <Section n="04" title="Accounts" color="text-[#e5a93c]/90">
            <p>
              An account is optional. You need one only for a Pro licence to follow you across devices, to redeem a
              promotional code, or to buy Pro on this website. You may sign in with Apple, Google, or an email
              address and password.
            </p>
            <Point title="Your responsibility">Keep your sign-in credentials to yourself and tell us if you believe your account has been used without your permission.</Point>
            <Point title="One person">An account is for one person, aged 13 or over, and is not transferable.</Point>
            <Point title="Deleting it">You can delete your account at any time from the App’s Settings. This gives up any licence or code tied to it.</Point>
            <Point title="Abuse">We may suspend or close an account used to breach these Terms, to obtain licences improperly, or to interfere with the service.</Point>
          </Section>

          <Section n="05" title="Improvy Pro" color="text-rose-500/90">
            <p>
              Certain features (“Improvy Pro”) are unlocked with a <span className="text-white font-semibold">one-time
              payment</span> — a lifetime licence, not a subscription. There are no recurring fees. Pro can be obtained
              in three ways:
            </p>
            <Point title="In the App">As an in-app purchase processed by Apple (App Store) or Google (Play Store), at the price shown there in your local currency. Refunds for these purchases are handled by Apple or Google under their own policies — contact Apple Support or Google Play Support directly.</Point>
            <Point title="On this website">By card or wallet through Stripe, under section 6 below.</Point>
            <Point title="With a promotional code">A code we issue unlocks Pro on the account that redeems it. One code per account; codes are non-transferable, may carry a use limit or an expiry, and may be withdrawn if obtained or used improperly.</Point>
            <p className="pt-1">
              A Pro licence obtained by any route is recognised in the App on any device where you sign in with the
              same account (for in-app purchases, the same Apple ID or Google account also restores it from
              Settings). We may add, modify, or discontinue features at any time; existing Pro users keep access to
              the features available at the time of their purchase.
            </p>
          </Section>

          <Section n="06" title="Buying on This Website" color="text-purple-500/90">
            <Point title="Seller">Lorenzo Ballestrazzi, Italy. Contact details are at the end of these Terms.</Point>
            <Point title="Price">The price is shown at checkout in euro and includes VAT where it applies. It may differ from the in-app price.</Point>
            <Point title="Payment">Payments are processed by Stripe. We never see your card details. You receive Stripe’s receipt by email.</Point>
            <Point title="Delivery">The licence is delivered immediately after payment, by being attached to the account you signed in with. It appears in the App the next time that account signs in.</Point>
            <Point title="Right of withdrawal">
              EU consumers normally have 14 days to withdraw from a distance purchase. Because Pro is digital content
              delivered immediately, the checkout asks you to request immediate delivery and to acknowledge that,
              once delivered, you lose that right of withdrawal (Directive 2011/83/EU, art. 16(m)). You cannot pay
              without giving that consent.
            </Point>
            <Point title="Refunds">
              Even so, if something is wrong with your purchase, write to us within 14 days and we will help — including
              a refund at our discretion. A refunded or charged-back payment removes the licence from the account.
            </Point>
            <Point title="Use the right account">The licence belongs to the account you paid with. Sign in with that same account in the App.</Point>
          </Section>

          <Section n="07" title="Conduct" color="text-[#e5a93c]/90">
            <p>
              Improvy has no user-generated content or social features. You agree to use the App and the website only
              for lawful purposes, and not to attempt to obtain Pro other than as described above.
            </p>
          </Section>

          <Section n="08" title="Intellectual Property" color="text-rose-500/90">
            <p>
              All content within the App and this website — including the music-engine logic, user interface,
              graphics, animations, and text — is owned by Lorenzo Ballestrazzi and protected by Italian and
              international copyright, trademark, and other intellectual property laws.
            </p>
            <p>
              “Improvy” and the Improvy logo are trademarks of Lorenzo Ballestrazzi. You may not use them without
              prior written permission.
            </p>
          </Section>

          <Section n="09" title="Disclaimer of Warranties" color="text-purple-500/90">
            <p className="uppercase text-xs tracking-wide text-zinc-400">
              The App and the website are provided “as is” and “as available” without warranty of any kind, express or
              implied, including warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>
            <p>
              We do not warrant that the App will always be available or error-free, that defects will be corrected,
              or that it is free of harmful components. Nothing here limits the rights you have as a consumer under
              the law that applies to you.
            </p>
          </Section>

          <Section n="10" title="Limitation of Liability" color="text-[#e5a93c]/90">
            <p>
              To the maximum extent permitted by law, Lorenzo Ballestrazzi shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising from your use of, or inability to use,
              the App or the website.
            </p>
            <p>
              Our total liability for any claim shall not exceed the amount you paid for Improvy Pro (or €0 if you
              have not purchased Pro).
            </p>
          </Section>

          <Section n="11" title="Governing Law & Jurisdiction" color="text-rose-500/90">
            <p>
              These Terms are governed by the laws of Italy. Any dispute shall be subject to the jurisdiction of the
              courts of Italy, without prejudice to the mandatory protections of the country where you live if you
              are a consumer.
            </p>
            <p>
              If you are a consumer resident in the EU, you may also use the EU Online Dispute Resolution platform at{" "}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" className="text-[#e5a93c] hover:text-white hover:underline">
                ec.europa.eu/consumers/odr
              </a>.
            </p>
          </Section>

          <Section n="12" title="Changes to These Terms" color="text-purple-500/90">
            <p>
              We may update these Terms at any time. We will note significant changes in the App or by updating the
              “Last updated” date above. Continued use after changes take effect means you accept the revised Terms.
              Changes do not affect a licence you have already paid for.
            </p>
          </Section>

          <div className="space-y-4 pb-4">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-[#e5a93c]/90 leading-none">13</span>
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
