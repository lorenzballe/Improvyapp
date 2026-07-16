import React from "react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

export default function PrivacyPolicyPage({ onBack }: PrivacyPolicyPageProps) {
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
            DATA PROTECTION
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white font-display tracking-tight uppercase leading-[1.1] select-none">
            IMPROVY MUSIC TRAINER <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5a93c] via-rose-500 to-purple-500">
              PRIVACY POLICY
            </span>
          </h1>
          <div className="space-y-4 text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-2xl pt-2">
            <p>
              This privacy policy (“Privacy Policy”) describes how Improvy Music Trainer (“we,” “our,” or “us”) collects, processes, and protects your information when you use the Improvy Music Trainer mobile and web applications (“App”) and related services.
            </p>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. The current version of this Privacy Policy will always be available within the App and on our website.
            </p>
          </div>
        </div>

        {/* Bulletproof Single Column Point-By-Point Layout */}
        <div className="space-y-12">
          
          {/* Section 1 */}
          <div className="space-y-4 border-b border-white/[0.04] pb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-[#e5a93c]/90 leading-none">01</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">Contact Details</h2>
            </div>
            <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-3.5">
              <p><strong className="text-white font-medium">Name:</strong> Improvy Music Trainer Education Ltd.</p>
              <p><strong className="text-white font-medium">Correspondence Address:</strong> PO Box 54523 Highgate PO, 7155 Kingsway Burnaby, BC V5E 4J6 Canada</p>
              <p><strong className="text-white font-medium">Email Address:</strong> <a href="mailto:thebalecompany@gmail.com" className="text-[#e5a93c] hover:underline hover:text-white font-medium transition-colors">thebalecompany@gmail.com</a></p>
              <p className="text-zinc-500 text-xs mt-2 italic">For privacy-related inquiries, please contact us via the email address provided above.</p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-4 border-b border-white/[0.04] pb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-rose-500/90 leading-none">02</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">Information We Collect and How We Use It</h2>
            </div>
            
            <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-8">
              
              {/* Item A */}
              <div className="space-y-2 border-l border-white/5 pl-4 py-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Device ID</h3>
                <p><strong className="text-zinc-300">What we collect:</strong> A randomly generated device ID connected to your purchase.</p>
                <p><strong className="text-zinc-300">Purpose:</strong> To help with support cases and manage app subscriptions.</p>
              </div>

              {/* Item B */}
              <div className="space-y-2 border-l border-white/5 pl-4 py-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Purchase Information</h3>
                <p><strong className="text-zinc-300">What we collect:</strong> Purchase-related information.</p>
                <p><strong className="text-zinc-300">Purpose:</strong> To handle subscription and purchase services.</p>
                <p><strong className="text-zinc-300">Processing Providers:</strong> Qonversion, App Store, Play Store, Stripe.</p>
                <p className="text-zinc-500 text-xs italic">Note: Qonversion, App Store, Play Store and Stripe process only the necessary information required to provide this service.</p>
              </div>

              {/* Item C */}
              <div className="space-y-2 border-l border-white/5 pl-4 py-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Analytics Data</h3>
                <p><strong className="text-zinc-300">What we collect:</strong> Non-personal analytical data related to app usage (e.g., which games were played and performance metrics).</p>
                <p><strong className="text-zinc-300">Purpose:</strong> To improve the app and provide insights into its functionality.</p>
                <p><strong className="text-zinc-300">Processing Provider:</strong> PostHog.</p>
                <p><strong className="text-[#e5a93c]">User Choice:</strong> Users may opt out of analytics data collection via the App’s account settings.</p>
              </div>

              {/* Item D */}
              <div className="space-y-2 border-l border-white/5 pl-4 py-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Crash Data and Metrics</h3>
                <p><strong className="text-zinc-300">What we collect:</strong> Non-personal crash-related data and DNS metrics.</p>
                <p><strong className="text-zinc-300">Purpose:</strong> To identify and resolve technical issues.</p>
                <p><strong className="text-zinc-300">Processing Provider:</strong> Sentry, Cloudflare.</p>
                <p><strong className="text-[#e5a93c]">User Choice:</strong> Users may opt out of App crash data collection via the App’s account settings.</p>
              </div>

              {/* Item E */}
              <div className="space-y-2 border-l border-white/5 pl-4 py-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Email Addresses</h3>
                <p><strong className="text-zinc-300">What we collect:</strong> Email addresses of users who sign up for our email list.</p>
                <p><strong className="text-zinc-300">Purpose:</strong> To send updates, tips, news, and promotional materials.</p>
                <p><strong className="text-zinc-300">Processing Provider:</strong> Brevo.</p>
                <p><strong className="text-[#e5a93c]">User Choice:</strong> Users may unsubscribe at any time by following the instructions in the email.</p>
              </div>

              {/* Item F */}
              <div className="space-y-2 border-l border-white/5 pl-4 py-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Signed-in Account Information</h3>
                <p><strong className="text-zinc-300">What we collect:</strong> When you create a signed-in account, we collect your email address (used as your login identifier). Once logged in and using the app, we collect and store your game progress data (e.g., levels completed, scores, unlocks) and your premium status.</p>
                <p><strong className="text-zinc-300">Purpose:</strong> To allow you to securely log in to your account, sync your game progress and premium status across devices, and provide you with the full features of the Improvy Music Trainer service as per our terms.</p>
                <p><strong className="text-zinc-300">Processing Provider(s):</strong> Our own backend servers & Postmark.</p>
                <p><strong className="text-[#e5a93c]">User Choice:</strong> Users may request account deletion within the app or by contacting <a href="mailto:thebalecompany@gmail.com" className="text-[#e5a93c] hover:underline">thebalecompany@gmail.com</a>.</p>
              </div>

            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-4 border-b border-white/[0.04] pb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-purple-500/90 leading-none">03</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">Purposes of Processing and Legal Basis</h2>
            </div>
            <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-3.5">
              <p><strong className="text-white font-medium">To provide the service:</strong> performance of a contract (our Terms of Service with you), including account creation, login, progress syncing, and premium features.</p>
              <p><strong className="text-white font-medium">For analytics and improvements:</strong> legitimate interest, with an opt-out option provided.</p>
              <p><strong className="text-white font-medium">To ensure app functionality and address crashes:</strong> legitimate interest, with user controls for opting out.</p>
              <p><strong className="text-white font-medium">For email marketing:</strong> consent-based; users can withdraw consent at any time.</p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-4 border-b border-white/[0.04] pb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-blue-500/90 leading-none">04</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">Data Storage and Retention</h2>
            </div>
            <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-4">
              <p>
                We retain personal data only as long as necessary for the specific purposes for which it was collected, as outlined in this Privacy Policy. The retention period depends on the type of data and the purpose of processing.
              </p>
              
              <div className="space-y-4 pt-2">
                <p>
                  <strong className="text-white font-medium block mb-1">Signed-in Account Data (Email, Game Progress, Premium Status):</strong>
                  We retain this data for as long as your account is considered active. Your account is considered inactive if there have been no logins for a continuous period of two (2) years. If your account becomes inactive, we will send you notifications (one month and three days prior) to inform you that your account is scheduled for deletion. If you do not log in during this notification period, your account and the associated personal data (email, game progress, premium status) will be automatically and permanently deleted. We have determined this 2-year period based on the typical usage patterns of our app by musicians, balancing the possibility of users returning after breaks with the principle of not retaining data longer than necessary.
                </p>
                <p>
                  <strong className="text-white font-medium block mb-1">Data Retained for Legal Obligations:</strong>
                  Certain data, such as records related to purchases, may be retained for a period required by applicable laws (e.g., for accounting or tax purposes in Canada). This retention is based on a legal obligation and is separate from the account’s active status.
                </p>
                <p>
                  <strong className="text-white font-medium block mb-1">Email Addresses (for Marketing List):</strong>
                  Email addresses collected for our marketing list are stored until you unsubscribe using the link in the emails or until the information is no longer needed for marketing purposes. We periodically review our marketing lists and cease sending communications to subscribers who show prolonged inactivity with our emails, independent of app login activity.
                </p>
                <p>
                  <strong className="text-white font-medium block mb-1">Analytics and Crash Data:</strong>
                  Non-personal analytics and crash data may be retained as long as necessary to monitor app performance, identify trends, and improve the service. Note that analytical data we retain after account deletion is anonymized and cannot be linked back to you personally.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="space-y-4 border-b border-white/[0.04] pb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-emerald-500/90 leading-none">05</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">Sharing and Transfers</h2>
            </div>
            <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-3.5">
              <p>We share data with the following service providers:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-zinc-400 text-[13px]">
                <li><strong className="text-zinc-200">Qonversion</strong> (purchase processing)</li>
                <li><strong className="text-zinc-200">App Store</strong> (purchase processing)</li>
                <li><strong className="text-zinc-200">Play Store</strong> (purchase processing)</li>
                <li><strong className="text-zinc-200">Stripe</strong> (purchase processing)</li>
                <li><strong className="text-zinc-200">PostHog</strong> (analytics)</li>
                <li><strong className="text-zinc-200">Sentry</strong> (crash reporting)</li>
                <li><strong className="text-zinc-200">Cloudflare</strong> (dns metrics and crash reporting)</li>
                <li><strong className="text-zinc-200">Brevo</strong> (email list)</li>
                <li><strong className="text-zinc-200">Postmark</strong> (account email for up to 45 days)</li>
              </ul>
              <p className="pt-2 text-zinc-500 text-xs italic">These providers process data in compliance with applicable data protection laws.</p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="space-y-4 border-b border-white/[0.04] pb-10">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-teal-500/90 leading-none">06</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">Your Rights</h2>
            </div>
            <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-3">
              <p>You have the absolute right to:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-zinc-400 text-[13px] mb-4">
                <li>Access your data.</li>
                <li>Correct or update inaccuracies.</li>
                <li>Opt-out of analytics and crash data collection.</li>
                <li>Unsubscribe from email communications.</li>
              </ul>
              
              <div className="space-y-3 pt-2">
                <p>
                  <strong className="text-white font-medium block">Request Data Deletion (Right to Erasure):</strong>
                  You have the right to request the deletion of your personal data when it is no longer necessary for the purposes for which it was collected, or when you withdraw consent (where applicable), or object to processing, or when the data has been unlawfully processed. This includes the right to request the deletion of your Improvy Music Trainer account and all associated personal data.
                </p>
                <p>
                  <strong className="text-white font-medium block">How to Request Deletion:</strong>
                  You can exercise your right to deletion at any time by using the account deletion option within the App found in the account settings or by contacting us directly at <a href="mailto:thebalecompany@gmail.com" className="text-[#e5a93c] hover:underline">thebalecompany@gmail.com</a>.
                </p>
                <p>
                  <strong className="text-white font-medium block">Upon Deletion:</strong>
                  When your account is deleted (either at your request or automatically due to inactivity as described in Section 4), all personal data associated with your account, including your email address, game progress, and premium status, will be permanently removed, except for any limited data we are legally required to retain for purposes like accounting.
                </p>
              </div>
            </div>
          </div>

          {/* Section 7 */}
          <div className="space-y-4 pb-4">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl font-black font-display text-[#e5a93c]/90 leading-none">07</span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-display">Information Security</h2>
            </div>
            <div className="text-sm text-zinc-400 font-light leading-relaxed pl-10 space-y-3.5">
              <p>
                We use encryption, pseudonymization, and access controls to protect your data. In case of a data breach, we will notify affected users and relevant authorities as required by law.
              </p>
            </div>
          </div>

        </div>



      </motion.div>
      
    </div>
  );
}
