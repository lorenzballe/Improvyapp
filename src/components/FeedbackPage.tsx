import React, { useEffect, useState } from "react";
import { ReturnHome } from "./ReturnHome";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Send, Sparkles, MessageSquare, CheckCircle, Bug, Star, Heart, Lightbulb, Mail } from "lucide-react";
import { deliver, track } from "../lib/analytics";
import { getRef } from "../lib/referral";

interface FeedbackPageProps {
  onBack: () => void;
}

type FeedbackCategory = "feature" | "bug" | "curriculum" | "other" | null;

const SUPPORT_EMAIL = "thebalecompany@gmail.com";

// The app's three kinds, so feedback from the site and from the app read as
// one list. The site's finer category travels alongside.
const KIND: Record<Exclude<FeedbackCategory, null>, "idea" | "bug" | "other"> = {
  feature: "idea",
  bug: "bug",
  curriculum: "other",
  other: "other",
};

export default function FeedbackPage({ onBack }: FeedbackPageProps) {
  const [category, setCategory] = useState<FeedbackCategory>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  // Set when the message could not leave the page (most often an ad blocker):
  // it is kept, and email is offered with it already written.
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    track("feedback_opened", { source: "website" });
  }, []);

  const categories = [
    { id: "feature" as const, label: "Feature Suggestion", icon: Lightbulb, color: "text-[#e5a93c]" },
    { id: "bug" as const, label: "Bug Report", icon: Bug, color: "text-rose-500" },
    { id: "curriculum" as const, label: "Curriculum Feedback", icon: Sparkles, color: "text-purple-500" },
    { id: "other" as const, label: "General & Hello", icon: MessageSquare, color: "text-emerald-500" },
  ];

  const label = categories.find((c) => c.id === category)?.label ?? "Feedback";

  // Only the fallback: the message, and whatever the visitor chose to add.
  const mailtoHref = () => {
    const body = [
      message.trim(),
      "",
      "—",
      name.trim() ? `From: ${name.trim()}` : null,
      email.trim() ? `Reply to: ${email.trim()}` : null,
      rating > 0 ? `Rating: ${rating}/5` : null,
    ]
      .filter((line) => line !== null)
      .join("\n");
    return (
      `mailto:${SUPPORT_EMAIL}` +
      `?subject=${encodeURIComponent(`Improvy — ${label}`)}` +
      `&body=${encodeURIComponent(body)}`
    );
  };

  // Straight to us, like the feedback box in the app: the same event in the
  // same project, so nothing opens and no address is required.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !message.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setFailed(false);
    const text = message.trim();
    const reply = email.trim();
    const ref = getRef();
    const ok = await deliver("feedback_submitted", {
      kind: KIND[category],
      category,
      message: text,
      length: text.length,
      has_email: reply.length > 0,
      ...(reply ? { email: reply } : {}),
      ...(name.trim() ? { name: name.trim() } : {}),
      ...(rating > 0 ? { rating } : {}),
      ...(ref ? { ref } : {}),
      source: "website",
    });
    setIsSubmitting(false);
    if (ok) setIsSuccess(true);
    else setFailed(true);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-6 pt-28 pb-8 md:pt-36 md:pb-16 text-zinc-300 font-sans relative z-30">
      
      <ReturnHome onBack={onBack} />

      {/* Main Content Animation Wrapper */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-zinc-950/40 border border-white/[0.06] rounded-2xl p-6 sm:p-10 backdrop-blur-md relative overflow-hidden"
      >
        {/* Subtle decorative background light */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#e5a93c]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="feedback-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 relative z-10"
            >
              {/* Header */}
              <div className="space-y-3 border-b border-white/[0.08] pb-6">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#e5a93c]">
                  WE VALUE YOUR VOICE
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight uppercase leading-none select-none">
                  SHARE YOUR <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5a93c] via-rose-500 to-purple-500">
                    FEEDBACK
                  </span>
                </h1>
                <p className="text-sm text-zinc-400 font-light max-w-xl">
                  We are constantly refining Improvy. Whether you found a bug, have an idea for a feature, or want to share your learning breakthroughs, we are here to listen!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Category Selection */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-white">
                    1. Select Feedback Category <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = category === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setCategory(cat.id)}
                          aria-pressed={isSelected}
                          className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-white/[0.05] border-[#e5a93c] shadow-[0_0_15px_rgba(229,169,60,0.1)] text-white"
                              : "bg-zinc-950/20 border-white/[0.06] hover:border-white/[0.15] text-zinc-300 hover:text-white"
                          }`}
                        >
                          <div className={`p-2 rounded-lg bg-white/[0.03] ${cat.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{cat.label}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Rating Selector (Optional) */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-white flex justify-between">
                    <span>2. How is your learning experience with Improvy?</span>
                    <span className="text-zinc-500 font-normal normal-case">Optional</span>
                  </label>
                  <p className="text-xs text-zinc-500 font-light">Rate your overall experience with our platform so far.</p>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = star <= (hoveredRating || rating);
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          aria-label={`${star} out of 5`}
                          aria-pressed={star === rating}
                          className="p-1 rounded-md cursor-pointer transition-transform hover:scale-110 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#e5a93c]"
                        >
                          <Star
                            className={`w-7 h-7 transition-colors ${
                              isFilled 
                                ? "fill-[#e5a93c] text-[#e5a93c] filter drop-shadow-[0_0_4px_rgba(229,169,60,0.4)]" 
                                : "text-zinc-600"
                            }`}
                          />
                        </button>
                      );
                    })}
                    {rating > 0 && (
                      <span className="text-xs font-semibold text-[#e5a93c] ml-2">
                        {rating === 5 ? "Amazing!" : rating === 4 ? "Very good" : rating === 3 ? "Decent" : rating === 2 ? "Could be better" : "Needs work"}
                      </span>
                    )}
                  </div>
                </div>

                {/* 3. Detailed feedback message */}
                <div className="space-y-3">
                  <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-white flex justify-between">
                    <span>3. Your Message <span className="text-rose-500">*</span></span>
                    <span className={`text-xs ${message.length > 800 ? "text-rose-400" : "text-zinc-500"}`}>
                      {message.length} / 1000
                    </span>
                  </label>
                  <textarea
                    id="message"
                    required
                    maxLength={1000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us everything. What works? What is confusing? What feature would elevate Improvy for you?"
                    rows={5}
                    className="w-full bg-zinc-950/50 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#e5a93c] focus:ring-1 focus:ring-[#e5a93c] transition-all resize-none font-light"
                  />
                </div>

                {/* 4. Credentials (Optional & Lazy) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-white flex justify-between">
                      <span>Name</span>
                      <span className="text-zinc-500 font-normal normal-case">Optional</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Lorenzo"
                      className="w-full bg-zinc-950/50 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#e5a93c] transition-all font-light"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-white flex justify-between">
                      <span>Email</span>
                      <span className="text-zinc-500 font-normal normal-case">Optional</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. you@example.com"
                      className="w-full bg-zinc-950/50 border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#e5a93c] transition-all font-light"
                    />
                  </div>
                </div>
                <p className="-mt-2 text-xs text-zinc-500 font-light">
                  Leave an email only if you'd like an answer. It's used for nothing else.
                </p>

                {/* Submission button */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className={`text-xs font-light ${message.trim() && !category ? "text-[#e5a93c]" : "text-zinc-500"}`}>
                    {message.trim() && !category
                      ? "Pick a category above, and it's ready to send."
                      : "Every message is read by the people who make Improvy."}
                  </p>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting || !category || !message.trim()}
                    className={`relative overflow-hidden w-full sm:w-auto shrink-0 whitespace-nowrap inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider select-none transition-all duration-300 ${
                      !category || !message.trim()
                        ? "bg-zinc-800 text-zinc-500 border border-transparent cursor-not-allowed"
                        : "bg-white text-black hover:bg-zinc-100 border border-transparent hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send feedback</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

                <AnimatePresence>
                  {failed && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      role="alert"
                      className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl border border-rose-500/25 bg-rose-500/[0.06] p-4"
                    >
                      <p className="text-xs text-zinc-300 font-light leading-relaxed flex-1">
                        It couldn't be sent from this page — an ad blocker is the usual reason. Your message is still here:
                        try again, or send it by email, already written.
                      </p>
                      <a
                        href={mailtoHref()}
                        className="inline-flex items-center justify-center gap-2 shrink-0 px-4 py-2.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-xs font-bold uppercase tracking-wider text-white transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Send by email
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="py-12 text-center space-y-6 relative z-10"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mb-2">
                <CheckCircle className="w-8 h-8" />
              </div>
              
              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight">
                  THANK YOU{name.trim() ? `, ${name.trim().toUpperCase()}` : ""}
                </h2>
                <p className="text-sm text-zinc-400 font-light leading-relaxed">
                  Your message has reached us, and every one is read personally.
                  {email.trim()
                    ? ` If there's something to answer, we'll write to ${email.trim()}.`
                    : " You didn't leave an email, so we can't reply — but it will be read all the same."}
                </p>
              </div>

              <div className="bg-zinc-950/50 border border-white/[0.04] p-6 rounded-xl max-w-sm mx-auto text-left space-y-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">The Improvy DNA</span>
                </div>
                <p className="text-xs text-zinc-400 font-light leading-normal">
                  Improvy grows with the musicians who use it — the best ideas come straight from your practice, and we build around them.
                </p>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl font-bold text-xs uppercase tracking-wider text-white cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return to Home
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
