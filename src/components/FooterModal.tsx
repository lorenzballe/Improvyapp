import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Check, Send, Sparkles, Mail, Link as LinkIcon, MessageSquare, AlertCircle } from "lucide-react";

interface FooterModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "about" | "affiliates" | "feedback" | "newsletter" | "privacy" | "terms" | null;
}

export const FooterModal: React.FC<FooterModalProps> = ({ isOpen, onClose, type }) => {
  // Local form states
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [textValue, setTextValue] = useState("");
  const [category, setCategory] = useState("feature");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const resetForm = () => {
    setEmail("");
    setWebsite("");
    setTextValue("");
    setCategory("feature");
    setIsSubmitting(false);
    setIsSuccess(false);
    setErrorMessage("");
  };

  const handleApplyAffiliate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter an email address.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textValue) {
      setErrorMessage("Please provide feedback notes.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleSubscribeNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1100);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !type) return null;

  const renderContent = () => {
    switch (type) {
      case "about":
        return (
          <div className="space-y-4 text-zinc-300 font-sans font-light leading-relaxed text-xs">
            <p>
              Founded in Florence, Italy, the <strong className="text-white font-semibold">Improvy Research Lab</strong> is an avant-garde collective of cognitive-behavioral scientists, music theorists, and spatial software engineers. Our pursuit is dedicated to mapping the human pitch-space relationship.
            </p>
            <p>
              Conventional music pedagogy forces performers to route notes through mathematical transcription before they can express emotion. Improvy bypasses the symbolic cognitive layer, targeting the raw visual, tactile, and spatial-geometric intuition within the musician's motor neural pathways.
            </p>
            <p>
              By fusing the geometry of the circular tonnetz with interactive pitch-field isolations, we free the active improviser's mind. Once intervals are calculated instantaneously on our mental spatial grids, the conscious analytical loop satisfies its bounds, enabling genuine flow, unrestricted play, and pure artistic freedom.
            </p>
            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500 font-sans tracking-wider">
              <span>EST. 2024 / FLORENCE</span>
              <span>VERSIO 2.4.9</span>
            </div>
          </div>
        );

      case "affiliates":
        return (
          <div className="space-y-4">
            <p className="text-zinc-300 font-sans font-light leading-relaxed text-xs">
              Help us expand the boundary of intuitive interval play. Instructors, academy leaders, content producers, and music creators earn up to <strong className="text-[#e5a93c] font-black">30% lifetime recurring commissions</strong> for every student or peer they introduce to Improvy Pro.
            </p>
            
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-5 text-center text-xs text-emerald-400 font-sans space-y-2 mt-2"
              >
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm">Application Logged</h4>
                <p className="font-light text-emerald-400/80">
                  Our development outreach team will review your channel and contact you within 48 standard business hours. Welcome to the loop.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleApplyAffiliate} className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-sans block">Professional Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-600" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. you@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrorMessage(""); }}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-sans text-white focus:outline-none focus:border-[#e5a93c] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-sans block">Conservatory, Channel, or Web URL</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3.5 top-3 w-4 h-4 text-zinc-600" />
                    <input
                      type="url"
                      required
                      placeholder="e.g. youtube.com/c/pianobinds"
                      value={website}
                      onChange={(e) => { setWebsite(e.target.value); setErrorMessage(""); }}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-sans text-white focus:outline-none focus:border-[#e5a93c] transition-all"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="text-[10px] text-rose-400 font-sans flex items-center gap-1.5 bg-rose-950/20 p-2 rounded-lg border border-rose-500/10">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-zinc-100 to-white hover:from-[#e5a93c] hover:to-amber-400 active:scale-98 transition-all duration-200 text-zinc-950 font-sans font-extrabold uppercase text-[10px] tracking-widest rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
                >
                  {isSubmitting ? "Processing..." : "Submit Partnership Request"}
                </button>
              </form>
            )}
          </div>
        );

      case "feedback":
        return (
          <div className="space-y-4">
            <p className="text-zinc-300 font-sans font-light leading-relaxed text-xs">
              Help us optimize the cognitive engine. Log a feature suggestion, layout bug, or harmonic design parameter directly with our lead acoustic engineer.
            </p>

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-purple-950/30 border border-purple-500/20 rounded-xl p-5 text-center text-xs text-purple-400 font-sans space-y-2 mt-2"
              >
                <div className="w-10 h-10 bg-purple-500/10 text-purple-300 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm">Feedback Captured</h4>
                <p className="font-light text-purple-300/80">
                  Your entry has been formatted into our weekly build sprint queue. Thank you for refining Improvy.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSendFeedback} className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-sans block">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "feature", label: "Feature proposal" },
                      { key: "layout", label: "Visual design" },
                      { key: "harmonic", label: "Acoustics" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setCategory(opt.key)}
                        className={`py-2 text-[9px] uppercase tracking-wider font-extrabold rounded-lg font-sans border transition-all cursor-pointer focus:outline-none ${
                          category === opt.key 
                            ? "bg-[#e5a93c]/15 text-[#e5a93c] border-[#e5a93c]/50" 
                            : "bg-zinc-950 text-zinc-500 border-white/5 hover:border-white/10"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-sans block">Acoustic Insights / Logs</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-zinc-600" />
                    <textarea
                      required
                      rows={3}
                      placeholder="e.g. The circular Tonnetz pitch isolate feels elegant, but could we add customizable key signature locks for post-tonal composition?"
                      value={textValue}
                      onChange={(e) => { setTextValue(e.target.value); setErrorMessage(""); }}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-sans text-white focus:outline-none focus:border-[#e5a93c] transition-all resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="text-[10px] text-rose-400 font-sans flex items-center gap-1.5 bg-rose-950/20 p-2 rounded-lg border border-rose-500/10">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-zinc-900 border border-white/15 text-white hover:border-[#e5a93c] active:scale-98 transition-all duration-200 font-sans font-extrabold uppercase text-[10px] tracking-widest rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
                >
                  <Send className="w-3 h-3 text-zinc-400" />
                  <span>{isSubmitting ? "Transmitting..." : "Send Acoustic Feed"}</span>
                </button>
              </form>
            )}
          </div>
        );

      case "newsletter":
        return (
          <div className="space-y-4">
            <p className="text-zinc-300 font-sans font-light leading-relaxed text-xs">
              Join <strong className="text-white font-semibold">12,000+ conservatory pianists, modular synthesists, and avant-garde jazz artists</strong> receiving weekly geometric drill patterns, pitch-space logs, and developmental insights directly from the laboratory.
            </p>

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-purple-950/30 to-rose-950/30 border border-[#e5a93c]/20 rounded-xl p-5 text-center text-xs text-zinc-300 font-sans space-y-2 mt-2"
              >
                <div className="w-10 h-10 bg-[#e5a93c]/10 text-[#e5a93c] rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-white text-sm">Harmonically Calibrated</h4>
                <p className="font-light text-zinc-400/90 leading-relaxed">
                  You have been registered for next Tuesday's premium print. Keep your ear tuned and your spatial grid sharp.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribeNewsletter} className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 font-sans block">Receiver Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-600" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. you@example.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setErrorMessage(""); }}
                      className="w-full bg-zinc-950 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-sans text-white focus:outline-none focus:border-[#e5a93c] transition-all"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="text-[10px] text-rose-400 font-sans flex items-center gap-1.5 bg-rose-950/20 p-2 rounded-lg border border-rose-500/10">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-rose-500 via-purple-600 to-[#e5a93c] relative overflow-hidden active:scale-98 transition-all duration-200 text-white font-sans font-black uppercase text-[10px] tracking-widest rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                  <span>{isSubmitting ? "Syncing..." : "Subscribe to Weekly Feed"}</span>
                </button>
              </form>
            )}
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-4 text-zinc-300 font-sans font-light leading-relaxed text-xs max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            <p>
              Your geometric signature is personal. At <strong className="text-white font-semibold">Improvy Labs</strong>, we prioritize structural privacy architecture.
            </p>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-sans">1. Metadata Autonomy</h4>
            <p>
              All speed calibrations, interval error metrics, custom 12-tone isolations, scale mappings, and key signatures are saved locally within your client storage ecosystem. We do not aggregate individual performance telemetry.
            </p>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-sans">2. Analytical Isolation</h4>
            <p>
              When sync features are enabled, transactions are executed through decentralized web storage and secured partition structures. We do not distribute database slices to advertising algorithms or profiling programs.
            </p>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-sans">3. Security Metrics</h4>
            <p>
              All personal credentials, billing parameters, and payment vectors are handled directly by stripe PCI-compliant interfaces. Improvy never keeps or scans credit cards, addresses, or financial metadata.
            </p>
            <p className="text-[10px] text-zinc-500 pt-2 border-t border-white/5 font-sans tracking-wider">
              LAST CALIBRATED: JUNE 2026 / GDPR + COPPA COMPLIANT
            </p>
          </div>
        );

      case "terms":
        return (
          <div className="space-y-4 text-zinc-300 font-sans font-light leading-relaxed text-xs max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            <p>
              Welcome to Improvy. By engaging our cognitive pitch system, dynamic circular tonnetz interfaces, or analytical dashboards, you subscribe to these terms.
            </p>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-sans">1. Absolute Creative Sovereignty</h4>
            <p>
              All melodic patterns, chord progressions, microtonal tuning mappings, or MIDI signals structured while practicing with Improvy are 100% owned by you. There are no royalty streams, licenses, or credits due to Improvy Labs for tracks composed using this applet.
            </p>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-sans">2. Spatial System Utilization</h4>
            <p>
              The harmonic geometry, analytical animations, design structure, and proprietary interval grids in our suite are patent systems intellectual property of Improvy Labs. You agree not to distribute modified versions or clone our custom SVG/Canvas relational matrices.
            </p>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-sans">3. Account Integrity</h4>
            <p>
              Pro active membership packages are for individual musicians, composing labs, and direct students. Sharing credentials to bypass access locks terminates current licenses instantly.
            </p>
            <p className="text-[10px] text-zinc-500 pt-2 border-t border-white/5 font-sans tracking-wider">
              COMPOSITE COPYRIGHT AGREEMENT 2026. ALL RIGHTS RESERVED.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const titles: Record<string, string> = {
    about: "About Improvy Labs",
    affiliates: "Partners & Affiliates",
    feedback: "Acoustic Feedback System",
    newsletter: "Cognitive Harmonics",
    privacy: "Privacy Architecture",
    terms: "Harmonic Agreements",
  };

  const subtitles: Record<string, string> = {
    about: "Theoretical Framework of the Geometric Mind",
    affiliates: "Spread the Spatial Resonance / Earn 30%",
    feedback: "Refining the 12-Tone Analytical Relational Engine",
    newsletter: "Weekly Drills, Cognitive Papers & Pitch-Maps",
    privacy: "Sovereignty of Individual Pitch-Training Data",
    terms: "Creative Freedom Warranty & Domain Use Clauses",
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-md bg-[#0a0614] border border-white/10 rounded-2xl p-6 md:p-8 shadow-[0_24px_60px_rgba(0,0,0,0.8)] z-10 overflow-hidden"
        >
          {/* Top aesthetic lights */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-rose-500 via-[#e5a93c] to-indigo-500" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#e5a93c]/5 rounded-full blur-2xl pointer-events-none" />

          {/* Modal Header */}
          <div className="flex justify-between items-start mb-5 relative z-10">
            <div className="text-left">
              <h3 className="text-sm font-sans font-black uppercase tracking-widest text-white leading-none">
                {titles[type] || ""}
              </h3>
              <p className="text-[9px] uppercase tracking-wider text-[#e5a93c] font-bold font-sans mt-1.5 opacity-80 leading-snug">
                {subtitles[type] || ""}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-white/5 focus:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="relative z-10 mt-1">
            {renderContent()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
