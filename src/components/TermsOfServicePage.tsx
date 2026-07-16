import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, Scale, CheckCircle } from "lucide-react";

interface TermsOfServicePageProps {
  onBack: () => void;
}

export default function TermsOfServicePage({ onBack }: TermsOfServicePageProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-6 pt-28 pb-16 md:pt-36 md:pb-24 text-zinc-350 font-sans relative z-30">
      
      {/* Main Content Animation Wrapper */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="space-y-14 text-left"
      >
        
        {/* Header Block */}
        <div className="space-y-6 pb-10 border-b border-white/[0.08]">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#e5a93c]">
            LEGAL AGREEMENT
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight uppercase leading-[1.1] select-none">
            IMPROVY MUSIC TRAINER <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5a93c] via-rose-500 to-purple-500">
              TERMS OF SERVICE
            </span>
          </h1>
          <div className="space-y-4 text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-2xl pt-2">
            <p>
              Welcome to Improvy Music Trainer! The Improvy Music Trainer app provides a game-like experience to teach functional music theory — instantly recognising and locating scale degrees across every key — and improve your musical skills in an engaging and interactive way.
            </p>
            <p>
              Read these Terms of Service (“Terms”) carefully. These Terms govern the use of the Improvy Music Trainer app and related services (“Service”). By accessing or using the Service, you agree to these Terms. If you do not agree, do not use the Service.
            </p>
            <p className="text-xs text-zinc-500 font-medium pt-1">
              These Terms form a binding agreement between you (“Subscriber” or “User”) and Improvy Music Trainer Ltd. (“Improvy”). Apple Inc. and Google LLC are third-party beneficiaries of these Terms.
            </p>
          </div>
        </div>

        {/* Bulletproof Single Column Point-By-Point Layout */}
        <div className="space-y-12">
          
          {/* Section 1 */}
          <div className="space-y-4 border-b border-white/[0.04] pb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-[#e5a93c]/90 leading-none">01</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">Definitions</h2>
            </div>
            <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-3.5">
              <p><strong className="text-white font-medium">Improvy:</strong> Refers to Improvy Music Trainer Ltd.</p>
              <p><strong className="text-white font-medium">Service:</strong> The Improvy Music Trainer app and any related services.</p>
              <p><strong className="text-white font-medium">Subscriber:</strong> The individual who creates an account and subscribes to the Service.</p>
              <p><strong className="text-white font-medium">User:</strong> The Subscriber or any person authorized by the Subscriber to use the Service.</p>
              <p><strong className="text-white font-medium">Intellectual Property Rights:</strong> Includes copyrights, patents, trademarks, and other proprietary rights.</p>
              <p><strong className="text-white font-medium">Personal Data:</strong> As defined under applicable data protection laws, including the GDPR.</p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-4 border-b border-white/[0.04] pb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-rose-500/90 leading-none">02</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">Right to Use the Service</h2>
            </div>
            <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-3.5">
              <p><strong className="text-white font-medium">2.1</strong> Improvy grants you a limited, non-exclusive, non-transferable, and non-sublicensable license to use the Service for personal, non-commercial purposes.</p>
              <p><strong className="text-white font-medium">2.2</strong> Access to the Service requires a valid subscription for the “Pro” version or a one-time lifetime payment. Free content is available without a subscription or sign-up.</p>
              <p><strong className="text-white font-medium">2.3</strong> You are responsible for ensuring that all Users comply with these Terms.</p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-4 border-b border-white/[0.04] pb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-purple-500/90 leading-none">03</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">User Accounts</h2>
            </div>
            <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-3.5">
              <p><strong className="text-white font-medium">3.1</strong> When creating an account, you must provide accurate and up-to-date information.</p>
              <p><strong className="text-white font-medium">3.2</strong> Keep your account credentials secure. You are responsible for all activity under your account.</p>
              <p><strong className="text-white font-medium">3.3</strong> Improvy reserves the right to suspend or terminate accounts that breach these Terms or engage in unauthorized use of the Service.</p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-4 border-b border-white/[0.04] pb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-blue-500/90 leading-none">04</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">Subscription and Payment</h2>
            </div>
            <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-3.5">
              <p><strong className="text-white font-medium">4.1</strong> Access to premium features requires a subscription or a one-time lifetime payment. Pricing details are available on our website or within the app.</p>
              <p><strong className="text-white font-medium">4.2</strong> Payments are processed through third-party providers. Ensure your payment details are accurate and updated.</p>
              <p><strong className="text-white font-medium">4.3</strong> Subscriptions automatically renew unless canceled before the end of the current billing period. No refunds are provided for unused portions of a subscription unless required by law.</p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="space-y-4 border-b border-white/[0.04] pb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-emerald-500/90 leading-none">05</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">Restrictions on Use</h2>
            </div>
            <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-3.5">
              <p><strong className="text-white font-medium">5.1</strong> You may not:</p>
              <ul className="list-disc list-inside space-y-2 pl-2 text-zinc-400 text-sm">
                <li>Reverse engineer or decompile the Service.</li>
                <li>Use bots or automated tools to interact with the Service.</li>
                <li>Share your account credentials with unauthorized parties.</li>
                <li>Use the Service for commercial purposes without explicit permission.</li>
              </ul>
              <p><strong className="text-white font-medium">5.2</strong> Any unauthorized use may result in account suspension or termination.</p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="space-y-4 border-b border-white/[0.04] pb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-teal-500/90 leading-none">06</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">Modifications to the Service</h2>
            </div>
            <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-3.5">
              <p><strong className="text-white font-medium">6.1</strong> Improvy reserves the right to modify or discontinue any part of the Service without prior notice, provided such changes do not materially reduce the functionality of the Service.</p>
              <p><strong className="text-white font-medium">6.2</strong> Material changes will be communicated in advance, and you may terminate your subscription if you disagree with such changes.</p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="space-y-4 border-b border-white/[0.04] pb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-[#e5a93c]/90 leading-none">07</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">Personal Data</h2>
            </div>
            <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-3.5">
              <p><strong className="text-white font-medium">7.1</strong> Improvy processes your Personal Data in accordance with our Privacy Policy. By using the Service, you consent to such processing.</p>
            </div>
          </div>

          {/* Section 8 */}
          <div className="space-y-4 border-b border-white/[0.04] pb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-rose-500/90 leading-none">08</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">Intellectual Property Rights</h2>
            </div>
            <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-3.5">
              <p><strong className="text-white font-medium">8.1</strong> Improvy retains all rights, title, and interest in the Service and its content. You may not copy, distribute, or create derivative works without explicit permission.</p>
              <p><strong className="text-white font-medium">8.2</strong> If you believe your Intellectual Property Rights are being infringed, contact us at <a href="mailto:thebalecompany@gmail.com" className="text-[#e5a93c] hover:underline hover:text-white font-medium transition-colors">thebalecompany@gmail.com</a>.</p>
            </div>
          </div>

          {/* Section 9 */}
          <div className="space-y-4 border-b border-white/[0.04] pb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-purple-500/90 leading-none">09</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">Availability, Warranties, and Liability</h2>
            </div>
            <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-3.5">
              <p><strong className="text-white font-medium">9.1</strong> The Service is provided “as is” and without warranties of any kind.</p>
              <p><strong className="text-white font-medium">9.2</strong> Improvy is not liable for:</p>
              <ul className="list-disc list-inside space-y-2 pl-2 text-zinc-400 text-sm">
                <li>Interruptions or unavailability of the Service.</li>
                <li>Damages resulting from the use of the Service, to the extent permitted by law.</li>
              </ul>
            </div>
          </div>

          {/* Section 10 */}
          <div className="space-y-4 border-b border-white/[0.04] pb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-blue-500/90 leading-none">10</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">Term and Termination</h2>
            </div>
            <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-3.5">
              <p><strong className="text-white font-medium">10.1</strong> These Terms remain in effect until terminated by you or Improvy.</p>
              <p><strong className="text-white font-medium">10.2</strong> You may terminate your subscription at any time through your account settings. Termination does not entitle you to a refund unless required by law.</p>
              <p><strong className="text-white font-medium">10.3</strong> Improvy may terminate these Terms if you breach any provision or misuse the Service.</p>
            </div>
          </div>

          {/* Section 11 */}
          <div className="space-y-4 pb-4">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-emerald-500/90 leading-none">11</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">Governing Law and Dispute Resolution</h2>
            </div>
            <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-3.5">
              <p><strong className="text-white font-medium">11.1</strong> These Terms are governed by the laws of Canada.</p>
              <p><strong className="text-white font-medium">11.2</strong> Any disputes will be resolved through negotiation. If unresolved, disputes will be subject to the exclusive jurisdiction of the courts in Canada.</p>
            </div>
          </div>

        </div>



      </motion.div>
      
    </div>
  );
}
