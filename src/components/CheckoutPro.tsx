import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Check, 
  Lock, 
  ShieldCheck, 
  CreditCard, 
  Sparkle, 
  Mail, 
  User, 
  CheckCircle2, 
  PartyPopper,
  QrCode
} from "lucide-react";
import { AppLogo } from "./AppLogo";

interface CheckoutProProps {
  onBack: () => void;
}

export function CheckoutPro({ onBack }: CheckoutProProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "apple">("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activationCode, setActivationCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate high-fidelity purchase process and token generation
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      // Generate a random academic license key
      const randomKey = "IMP-PRO-" + Math.random().toString(36).substring(2, 6).toUpperCase() + "-" + Math.random().toString(36).substring(2, 6).toUpperCase() + "-2026";
      setActivationCode(randomKey);
    }, 2200);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-16 text-zinc-300 font-sans relative z-30">
      
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/5">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all duration-300 cursor-pointer active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-2">
          <AppLogo size={28} />
          <span className="font-display text-sm font-black text-white italic tracking-tight">Improvy Pro</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div 
            key="checkout-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start"
          >
            {/* Left Box: Product Benefits Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] font-sans font-extrabold uppercase tracking-[0.2em] text-[#e5a93c] px-2.5 py-1 rounded bg-[#e5a93c]/10 border border-[#e5a93c]/20 w-fit block">
                  FULL PERMANENT ACCESS
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight leading-none uppercase">
                  YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5a93c] via-purple-500 to-rose-500">LIFETIME PRO</span> PASS
                </h2>
                <p className="text-xs text-zinc-400 font-light leading-relaxed">
                  You're unlocking the foundational keys to 12-tone harmonic relativity. Single lifetime access fee, no recurring monthly subscriptions.
                </p>
              </div>

              {/* Bullet points benefits */}
              <div className="bg-[#0b0617]/50 border border-white/5 rounded-2xl p-6 space-y-5 backdrop-blur-3xl">
                <h4 className="text-[10px] text-zinc-500 font-extrabold tracking-widest uppercase border-b border-white/5 pb-2">IMPROVY PRO INCLUDES:</h4>
                
                <ul className="space-y-4">
                  {[
                    "Complete unlock of all 12 keys",
                    "Chromatic Mode + jazz extensions (9, 11, 13, altered)",
                    "Note-to-Number, Custom, …Of What? & Pocket unlocks",
                    "Real-time Adaptive Difficulty algorithm",
                    "Deep Analytics: keyboard heatmap and reaction times",
                    "No subscription, seamless lifetime access"
                  ].map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs text-zinc-300 font-light leading-snug">
                      <div className="w-4 h-4 rounded-full bg-[#e5a93c]/10 border border-[#e5a93c]/30 flex items-center justify-center mt-0.5 shrink-0">
                        <Check className="w-2.5 h-2.5 text-[#e5a93c]" />
                      </div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="text-[10px] text-zinc-400 tracking-wide font-sans font-medium">30-day money-back guarantee</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Secure SSL</span>
                </div>
              </div>

              {/* Price block */}
              <div className="bg-gradient-to-r from-[#e5a93c]/10 to-purple-500/5 border border-white/5 rounded-2xl p-6 flex justify-between items-center">
                <div>
                  <p className="text-[9px] text-zinc-400 font-bold tracking-widest uppercase">IMPROVY PRO SINGLE LICENSE</p>
                  <p className="text-xl font-black text-white mt-1">One-time payment, forever</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-[#e5a93c] tracking-tight">€16.99</p>
                  <p className="text-[9px] text-zinc-500 tracking-wider">VAT Included</p>
                </div>
              </div>

            </div>

            {/* Right Box: Elegant Payment Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handlePay} className="bg-zinc-950/85 border border-white/[0.06] rounded-3xl p-6 sm:p-8 backdrop-blur-3xl shadow-2xl relative overflow-hidden group hover:border-[#e5a93c]/20 transition-all duration-500">
                {/* Golden ambient background glow */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#e5a93c]/2 rounded-full blur-3xl pointer-events-none" />
                <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                
                {/* Visual Glassmorphic Credit Card Preview (hidden on small device, beautiful layout details) */}
                <div className="relative h-44 rounded-2xl bg-gradient-to-br from-zinc-800 via-indigo-950 to-zinc-900 border border-white/10 p-5 overflow-hidden shadow-xl mb-8 hidden sm:flex flex-col justify-between">
                  <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-[-30px] right-20 w-32 h-32 bg-rose-500/15 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-1">
                      <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-extrabold block">PRO MEMBER CARD</span>
                      <span className="text-sm font-semibold tracking-wide text-white">IMPROVY ACADEMY</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AppLogo size={20} />
                      <span className="font-display text-[10px] font-black text-white italic">PRO</span>
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10 mt-auto">
                    <div className="font-sans text-lg tracking-[0.18em] text-white font-bold">
                      {cardNumber ? cardNumber : "••••  ••••  ••••  ••••"}
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                        <span className="text-[7px] text-zinc-500 uppercase tracking-widest font-bold block">Cardholder</span>
                        <span className="text-xs tracking-wide text-zinc-200 capitalize font-medium">{name ? name : "YOUR NAME"}</span>
                      </div>
                      <div className="space-y-0.5 shrink-0 text-right">
                        <span className="text-[7px] text-zinc-500 uppercase tracking-widest font-bold block">Expiration</span>
                        <span className="text-xs tracking-wide text-zinc-200 font-sans">{expiry ? expiry : "MM/YY"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[9.5px] uppercase tracking-wider text-zinc-400 font-bold block">Choose payment method</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                          paymentMethod === "card" 
                            ? "bg-white/10 text-white border-rose-500/50 shadow-md shadow-rose-500/5" 
                            : "bg-white/[0.02] text-zinc-400 border-white/5 hover:border-white/10"
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Card</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("paypal")}
                        className={`py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                          paymentMethod === "paypal" 
                            ? "bg-white/10 text-white border-purple-500/50 shadow-md shadow-purple-500/5" 
                            : "bg-white/[0.02] text-zinc-400 border-white/5 hover:border-white/10"
                        }`}
                      >
                        <span className="font-sans italic font-bold text-sm tracking-tighter text-blue-400">Pay<span className="text-cyan-400">Pal</span></span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("apple")}
                        className={`py-3 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                          paymentMethod === "apple" 
                            ? "bg-white/10 text-white border-indigo-500/50 shadow-md shadow-indigo-500/5" 
                            : "bg-white/[0.02] text-zinc-400 border-white/5 hover:border-white/10"
                        }`}
                      >
                        <span className="font-sans font-bold text-xs text-white"> Pay</span>
                      </button>
                    </div>
                  </div>

                  {paymentMethod === "card" ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5 text-left">
                          <label className="text-[9.5px] uppercase tracking-wider text-zinc-400 font-bold block">Cardholder Name</label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                              <User className="w-4 h-4" />
                            </span>
                            <input 
                              type="text" 
                              required
                              placeholder="John Doe"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 text-xs bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5 text-left">
                          <label className="text-[9.5px] uppercase tracking-wider text-zinc-400 font-bold block">Activation Email</label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                              <Mail className="w-4 h-4" />
                            </span>
                            <input 
                              type="email" 
                              required
                              placeholder="you@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 text-xs bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-left">
                        <label className="text-[9.5px] uppercase tracking-wider text-zinc-400 font-bold block">Card Number</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                            <CreditCard className="w-4 h-4" />
                          </span>
                          <input 
                            type="text" 
                            required
                            maxLength={19}
                            placeholder="4000 1234 5678 9010"
                            value={cardNumber}
                            onChange={(e) => {
                              // Auto format with spaces each 4 chars
                              let val = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
                              let formatted = val.match(/.{1,4}/g)?.join(" ") || val;
                              setCardNumber(formatted);
                            }}
                            className="w-full pl-10 pr-4 py-3 text-xs bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5 text-left">
                          <label className="text-[9.5px] uppercase tracking-wider text-zinc-400 font-bold block">Expiration</label>
                          <input 
                            type="text" 
                            required
                            maxLength={5}
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={(e) => {
                              let val = e.target.value.replace(/[^0-9]/g, "");
                              if (val.length >= 2) {
                                val = val.substring(0, 2) + "/" + val.substring(2, 4);
                              }
                              setExpiry(val);
                            }}
                            className="w-full px-4 py-3 text-xs bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 transition-all text-center"
                          />
                        </div>

                        <div className="space-y-1.5 text-left">
                          <label className="text-[9.5px] uppercase tracking-wider text-zinc-400 font-bold block">CVV Code</label>
                          <input 
                            type="password" 
                            required
                            maxLength={3}
                            placeholder="•••"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ""))}
                            className="w-full px-4 py-3 text-xs bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 transition-all text-center"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 py-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[9.5px] uppercase tracking-wider text-zinc-400 font-bold block">Activation Email</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                            <Mail className="w-4 h-4" />
                          </span>
                          <input 
                            type="email" 
                            required
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 text-xs bg-zinc-900 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 transition-all"
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed font-sans font-light">
                        You will be securely redirected to our licensed payment portal upon pressing the button below. Your Improvy Pro lifetime license will be associated with the email address provided above.
                      </p>
                    </div>
                  )}

                  {/* Payment Button */}
                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 via-purple-500 to-[#e5a93c] disabled:opacity-50 hover:opacity-95 text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-rose-600/20"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Secure processing...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Pay Now €16.99 & Activate</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[9px] text-zinc-500 font-sans tracking-widest uppercase font-bold">
                      <Lock className="w-3 h-3 text-zinc-600" />
                      <span>secure 256-bit ssl encrypted transactions</span>
                    </div>
                  </div>

                </div>

              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="success-message"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="max-w-2xl mx-auto text-center space-y-8 bg-zinc-950/80 border border-white/5 rounded-3xl p-8 sm:p-12 backdrop-blur-3xl shadow-3xl relative"
          >
            {/* Top Confetti & Celebration */}
            <div className="flex flex-col items-center justify-center relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-44 h-44 bg-[#e5a93c]/10 rounded-full blur-3xl animate-pulse" />
              
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 relative">
                <CheckCircle2 className="w-8 h-8" />
                <motion.span 
                  className="absolute -top-1 -right-1"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <PartyPopper className="w-5 h-5 text-[#e5a93c]" />
                </motion.span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
                WELCOME TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-[#e5a93c]">IMPROVY PRO</span>
              </h2>
              <p className="text-xs text-zinc-400 font-light max-w-md mx-auto leading-relaxed mt-2">
                Your payment of €16.99 has been processed successfully. Your lifetime pro license is now unlocked and active. A receipt and confirmation has been sent to <span className="text-white font-medium">{email ? email : "you@example.com"}</span>.
              </p>
            </div>

            {/* Generated License Panel */}
            <div className="bg-[#0b0617]/50 border border-white/5 rounded-2xl p-6 space-y-4 max-w-md mx-auto text-left relative overflow-hidden">
              <div className="absolute top-[-40px] right-[-45px] opacity-15 pointer-events-none">
                <QrCode className="w-32 h-32 text-[#e5a93c]" />
              </div>

              <div>
                <span className="text-[8px] font-sans font-extrabold uppercase tracking-[0.2em] text-[#e5a93c]">LICENSE ACTIVATION KEY</span>
                <div className="mt-1 flex items-center gap-3">
                  <span className="font-sans text-sm font-semibold tracking-wider text-white select-all">
                    {activationCode}
                  </span>
                  <button 
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(activationCode);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 3000);
                    }}
                    className="px-2.5 py-1 text-[8.5px] font-extrabold font-sans rounded bg-[#e5a93c]/10 hover:bg-[#e5a93c]/20 border border-[#e5a93c]/20 text-[#e5a93c] transition-all cursor-pointer uppercase tracking-wider shrink-0 min-w-[70px] flex items-center justify-center"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 space-y-2">
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Next Steps for Activation:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-zinc-400 font-sans font-light">
                  <li>Open the <span className="text-white font-semibold">Improvy</span> app on your smartphone.</li>
                  <li>Navigate to the Settings or Profile section.</li>
                  <li>Tap on "Redeem Pro License" and enter the code above.</li>
                  <li>You will instantly unlock full, lifetime unlimited access to all Pro features.</li>
                </ol>
              </div>
            </div>

            {/* Extra sparkle decorative particles */}
            <div className="flex justify-center items-center gap-6 text-[10px] text-zinc-500 font-sans tracking-widest uppercase font-bold">
              <span className="flex items-center gap-1">
                <Sparkle className="w-3.5 h-3.5 text-rose-400 animate-spin-slow" />
                <span>Anchoring Unlocked</span>
              </span>
              <span className="flex items-center gap-1">
                <Sparkle className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                <span>12-Tone Systems Active</span>
              </span>
            </div>

            {/* Back CTA */}
            <div className="pt-4">
              <button
                onClick={onBack}
                className="px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer active:scale-95"
              >
                Back to Homepage
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
