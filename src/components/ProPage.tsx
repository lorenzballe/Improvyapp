import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Check, ShieldCheck, Lock, Mail, RefreshCw, Sparkle, LogOut, CircleCheck, Hourglass } from "lucide-react";
import { cn } from "../lib/utils";
import { PRO_PRICE_WEB, PRO_PRICE_STORE } from "../lib/pricing";
import { StoreBadges } from "./StoreBadges";
import {
  watchUser,
  finishRedirectSignIn,
  signInWithApple,
  signInWithGoogle,
  signInWithEmail,
  createWithEmail,
  resetPassword,
  signOutUser,
  proStatus,
  createCheckoutSession,
  describeAuthError,
  type User,
} from "../lib/firebase";

interface ProPageProps {
  onBack: () => void;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}

/**
 * Where Pro is bought on the site.
 *
 * Three steps, on one page, in the order they have to happen: an account
 * (because a licence has to belong to someone the app can recognise), the
 * payment (Stripe, in a page of its own), and the app (which finds the
 * licence the moment that account signs in). The page reads its own state
 * off the hash — #pro/success?session_id=… and #pro/cancel are where Stripe
 * sends people back — so it needs no router.
 *
 * The site never touches money and never grants anything. The Cloud Function
 * checks who is asking and hands back a Stripe URL; the webhook writes the
 * licence after the money moves; this page only asks whether it has landed.
 */
export default function ProPage({ onBack, onOpenTerms, onOpenPrivacy }: ProPageProps) {
  const route = readProRoute();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    // A redirect sign-in (mobile Safari) lands back here with the answer.
    finishRedirectSignIn();
    return watchUser((u) => setUser(u));
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-6 pt-24 pb-16 md:pt-32 md:pb-24 font-sans relative z-30">
      <button
        onClick={onBack}
        className="group mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-400 hover:text-white transition-colors duration-200 cursor-pointer focus:outline-none"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </button>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {route.kind === "success" ? (
          <SuccessView user={user} sessionId={route.sessionId} onBack={onBack} />
        ) : (
          <BuyView
            user={user}
            cancelled={route.kind === "cancel"}
            onOpenTerms={onOpenTerms}
            onOpenPrivacy={onOpenPrivacy}
          />
        )}
      </motion.div>
    </div>
  );
}

// ── The hash, read ──────────────────────────────────────────────────────────

type ProRoute = { kind: "buy" } | { kind: "cancel" } | { kind: "success"; sessionId: string | null };

function readProRoute(): ProRoute {
  const hash = window.location.hash.replace(/^#\/?/, "");
  if (hash.startsWith("pro/success")) {
    const q = hash.split("?")[1] ?? "";
    return { kind: "success", sessionId: new URLSearchParams(q).get("session_id") };
  }
  if (hash.startsWith("pro/cancel")) return { kind: "cancel" };
  return { kind: "buy" };
}

// ── Buying ──────────────────────────────────────────────────────────────────

function BuyView({
  user,
  cancelled,
  onOpenTerms,
  onOpenPrivacy,
}: {
  user: User | null | undefined;
  cancelled: boolean;
  onOpenTerms: () => void;
  onOpenPrivacy: () => void;
}) {
  const [status, setStatus] = useState<"unknown" | "checking" | "pro" | "free">("unknown");
  const [consent, setConsent] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  // Signed in: is this account Pro already? Nobody should pay twice.
  useEffect(() => {
    let alive = true;
    if (!user) {
      setStatus("unknown");
      return;
    }
    setStatus("checking");
    proStatus()
      .then((s) => alive && setStatus(s.pro ? "pro" : "free"))
      .catch(() => alive && setStatus("free"));
    return () => {
      alive = false;
    };
  }, [user]);

  const pay = async () => {
    if (!user || !consent || paying) return;
    setPaying(true);
    setPayError(null);
    try {
      const answer = await createCheckoutSession();
      if (answer.alreadyPro) {
        setStatus("pro");
        return;
      }
      if (!answer.url) throw new Error("no url");
      window.location.assign(answer.url);
    } catch (e: unknown) {
      const msg = (e as { message?: string })?.message ?? "";
      setPayError(
        /unauthenticated/i.test(msg)
          ? "Sign in first, then try again."
          : "Could not open the checkout. Nothing was charged — try again in a moment."
      );
      setPaying(false);
    }
  };

  const signedIn = !!user;
  const step2Open = signedIn && status === "free";

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-5 max-w-3xl">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#e5a93c]">IMPROVY PRO · LIFETIME</span>
        <h1 className="text-4xl sm:text-6xl font-black text-white font-display tracking-tight leading-[1.05]">
          Every key. Every mode.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5a93c] via-rose-500 to-purple-500">Yours, once.</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
          One payment of <span className="text-white font-semibold">{PRO_PRICE_WEB}</span>, no subscription, and the licence lives on
          your account — so it follows you to any phone, iPhone or Android. Here it costs a euro less than in the app
          stores ({PRO_PRICE_STORE}), because there is no store in between.
        </p>
      </div>

      <AnimatePresence>
        {cancelled && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 text-sm text-zinc-300"
          >
            You backed out of the checkout. <span className="text-white font-semibold">Nothing was charged.</span> Whenever you are ready, the button below is still here.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: the three steps */}
        <div className="lg:col-span-7 space-y-5">
          {/* Step 1 */}
          <StepCard n="1" title="Your account" done={signedIn} active={!signedIn}>
            {user === undefined ? (
              <p className="text-xs text-zinc-500">Checking…</p>
            ) : user ? (
              <SignedInRow user={user} />
            ) : (
              <SignInForm />
            )}
            {!signedIn && (
              <p className="text-[11px] text-zinc-500 leading-relaxed pt-1">
                The licence is tied to this account, not to a phone. Use the same account later in the app — Apple, Google or
                email, whichever you pick here.
              </p>
            )}
          </StepCard>

          {/* Step 2 */}
          <StepCard n="2" title={`Pay ${PRO_PRICE_WEB}`} done={status === "pro"} active={step2Open} dim={!signedIn}>
            {status === "pro" ? (
              <div className="space-y-4">
                <p className="text-sm text-white font-medium">This account already has Pro. There is nothing to pay.</p>
                <p className="text-xs text-zinc-400 leading-relaxed">Install the app and sign in with the same account — it is unlocked.</p>
                <StoreBadges compact />
              </div>
            ) : status === "checking" ? (
              <p className="text-xs text-zinc-500">Checking this account…</p>
            ) : (
              <div className="space-y-5">
                <label className={cn("flex items-start gap-3 cursor-pointer select-none", !signedIn && "pointer-events-none")}>
                  <span
                    className={cn(
                      "mt-0.5 w-5 h-5 shrink-0 rounded-md border flex items-center justify-center transition-colors",
                      consent ? "bg-[#e5a93c] border-[#e5a93c]" : "bg-white/[0.03] border-white/20"
                    )}
                  >
                    <input type="checkbox" className="sr-only" checked={consent} onChange={(e) => setConsent(e.target.checked)} disabled={!signedIn} />
                    {consent && <Check className="w-3.5 h-3.5 text-black stroke-[3.5]" />}
                  </span>
                  <span className="text-xs text-zinc-300 leading-relaxed">
                    I agree to the{" "}
                    <button type="button" onClick={onOpenTerms} className="text-[#e5a93c] hover:text-white hover:underline cursor-pointer">Terms of Service</button>, I ask for the licence to be delivered to my account immediately, and I understand that once it is delivered I lose the 14-day right of withdrawal.
                  </span>
                </label>

                <PayButton disabled={!signedIn || !consent || paying} busy={paying} onClick={pay} />

                {payError && <p className="text-xs text-rose-400 font-medium">{payError}</p>}

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] text-zinc-500">
                  <span className="inline-flex items-center gap-1.5"><Lock className="w-3 h-3" /> Cards, Apple Pay, Google Pay</span>
                  <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Handled by Stripe — your card never reaches us</span>
                  <span>VAT included where it applies</span>
                </div>
              </div>
            )}
          </StepCard>

          {/* Step 3 */}
          <StepCard n="3" title="Play" active={false} dim={status !== "pro"}>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Install Improvy, open Settings, and sign in with this same account. Pro is on. Nothing to restore, nothing to type.
            </p>
            {status !== "pro" && <StoreBadges compact className="pt-3" />}
          </StepCard>
        </div>

        {/* Right: what you get */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24">
          <div className="relative overflow-hidden p-[2px] rounded-[28px] rainbow-gold-glow">
            <div className="absolute -inset-[200%] bg-[conic-gradient(from_0deg,#e5a93c_0deg,#f43f5e_60deg,#a855f7_120deg,#3b82f6_180deg,#10b981_240deg,#e5a93c_300deg)] animate-spin-slow opacity-85" />
            <div className="bg-[#07050d] rounded-[26.5px] p-7 sm:p-8 relative z-10 space-y-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#e5a93c]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
              <div className="relative flex items-end justify-between gap-4">
                <div>
                  <span className="text-[9px] font-sans font-extrabold uppercase tracking-[0.22em] text-[#e5a93c]">LIFETIME PRO UNLOCK</span>
                  <h2 className="text-2xl font-black font-display tracking-tight text-white mt-1">Improvy Pro</h2>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-black text-white font-sans tracking-tight leading-none">{PRO_PRICE_WEB}</div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">once · forever</div>
                </div>
              </div>

              <ul className="relative space-y-3 text-xs text-zinc-100 font-sans font-light border-t border-white/[0.05] pt-5">
                {[
                  ["All 12 keys", "unlocked, every mode"],
                  ["Chromatic Mode", "with the jazz extensions — 9 · 11 · 13, altered"],
                  ["Note-to-Number, Custom, …Of What? and Pocket", "the whole set"],
                  ["Adaptive Difficulty", "the clock tightens while you are sharp"],
                  ["Deep analytics", "keyboard heatmaps, response times, weak spots"],
                  ["Home-screen widgets", "twelve of them"],
                ].map(([b, rest]) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-[#e5a93c]/12 border border-[#e5a93c]/25 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#e5a93c] stroke-[3]" />
                    </span>
                    <span><span className="font-semibold text-white">{b}</span> — {rest}</span>
                  </li>
                ))}
              </ul>

              <div className="relative border-t border-white/[0.05] pt-5 space-y-3">
                <Faq q="Is this a subscription?" a="No. One payment, and it is yours for good. There is nothing to cancel." />
                <Faq q="I already bought Pro inside the app." a="Then you have it. Do not pay again — sign in in the app and tap Restore Purchases if it ever looks locked." />
                <Faq q="Which account do I use in the app?" a="This one. Same method — Apple, Google or email — same address. The app finds the licence on sign-in." />
                <Faq q="Refunds?" a={<>By paying you ask for immediate delivery and give up the 14-day withdrawal right, as the law allows for digital content. If something is wrong, write to us within 14 days anyway and we will sort it out. See the <button type="button" onClick={onOpenTerms} className="text-[#e5a93c] hover:text-white hover:underline cursor-pointer">Terms</button> and <button type="button" onClick={onOpenPrivacy} className="text-[#e5a93c] hover:text-white hover:underline cursor-pointer">Privacy Policy</button>.</>} />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ── After Stripe ────────────────────────────────────────────────────────────

function SuccessView({ user, sessionId, onBack }: { user: User | null | undefined; sessionId: string | null; onBack: () => void }) {
  // The webhook usually beats the buyer back to this page, but not always:
  // ask a few times over half a minute before saying anything discouraging.
  const [landed, setLanded] = useState<"waiting" | "yes" | "slow">("waiting");
  const tries = useRef(0);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    let timer: number | undefined;
    const ask = async () => {
      try {
        const s = await proStatus();
        if (!alive) return;
        if (s.pro) {
          setLanded("yes");
          return;
        }
      } catch {
        /* keep asking */
      }
      tries.current += 1;
      if (tries.current >= 12) {
        setLanded("slow");
        return;
      }
      timer = window.setTimeout(ask, 2500);
    };
    ask();
    return () => {
      alive = false;
      if (timer) window.clearTimeout(timer);
    };
  }, [user]);

  const signedOut = user === null;

  return (
    <div className="max-w-2xl mx-auto text-center space-y-8 py-6">
      <div
        className={cn(
          "inline-flex items-center justify-center w-20 h-20 rounded-full border mb-2 transition-colors",
          landed === "yes" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-white/[0.03] border-white/10 text-zinc-400"
        )}
      >
        {landed === "yes" ? (
          <CircleCheck className="w-10 h-10" />
        ) : landed === "slow" || signedOut ? (
          <Hourglass className="w-9 h-9" />
        ) : (
          <RefreshCw className="w-9 h-9 animate-spin [animation-duration:2.5s]" />
        )}
      </div>

      <div className="space-y-3">
        <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#e5a93c]">IMPROVY PRO</span>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight leading-[1.1]">
          {landed === "yes" ? "Pro is on your account." : signedOut ? "Thank you." : landed === "slow" ? "Almost there." : "Thank you — one moment."}
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed max-w-lg mx-auto">
          {landed === "yes" && (
            <>Signed in as <span className="text-white font-medium">{user?.email ?? "your account"}</span>. Install the app, sign in with the same account, and everything is unlocked.</>
          )}
          {landed === "waiting" && !signedOut && <>Your payment went through. The licence is being written to your account right now; this page will update by itself.</>}
          {landed === "slow" && (
            <>Your payment went through, but the licence is taking longer than usual to show up. It will. If it is not there in a few minutes, write to{" "}
              <a href="mailto:thebalecompany@gmail.com" className="text-[#e5a93c] hover:text-white hover:underline">thebalecompany@gmail.com</a>
              {sessionId ? <> and quote <code className="text-zinc-300">{sessionId.slice(0, 18)}…</code></> : null}.</>
          )}
          {signedOut && <>Your payment went through. Sign in on this page with the account you used, and you will see Pro on it.</>}
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-zinc-500">Now get the app</p>
        <StoreBadges className="justify-center" />
      </div>

      <div className="pt-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl font-bold text-xs uppercase tracking-wider text-white cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>
    </div>
  );
}

// ── Pieces ──────────────────────────────────────────────────────────────────

function StepCard({ n, title, children, done = false, active = false, dim = false }: { n: string; title: string; children: React.ReactNode; done?: boolean; active?: boolean; dim?: boolean }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[24px] border p-6 sm:p-7 transition-all duration-300 bg-[#07040f]/60 backdrop-blur-3xl",
        active ? "border-[#e5a93c]/40 shadow-[0_0_40px_rgba(229,169,60,0.08)]" : "border-white/[0.06]",
        dim && "opacity-55"
      )}
    >
      <div className="flex items-center gap-4 mb-4">
        <span
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center text-sm font-black font-display shrink-0 border",
            done ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400" : active ? "bg-[#e5a93c] border-[#e5a93c] text-black" : "bg-white/[0.04] border-white/10 text-zinc-400"
          )}
        >
          {done ? <Check className="w-4 h-4 stroke-[3.5]" /> : n}
        </span>
        <h3 className="text-base sm:text-lg font-black text-white font-display tracking-tight">{title}</h3>
      </div>
      <div className="pl-0 sm:pl-13 space-y-3">{children}</div>
    </div>
  );
}

function SignedInRow({ user }: { user: User }) {
  const provider = user.providerData[0]?.providerId ?? "password";
  const label = provider === "apple.com" ? "Apple" : provider === "google.com" ? "Google" : "Email";
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white truncate">{user.email ?? "Signed in"}</p>
        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mt-0.5">via {label}</p>
      </div>
      <button
        onClick={() => signOutUser()}
        className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400 hover:text-white cursor-pointer shrink-0"
      >
        <LogOut className="w-3.5 h-3.5" /> Not you?
      </button>
    </div>
  );
}

function SignInForm() {
  const [emailOpen, setEmailOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const run = async (go: () => Promise<void>) => {
    if (busy) return;
    setBusy(true);
    setMessage(null);
    try {
      await go();
    } catch (e) {
      const text = describeAuthError(e);
      if (text) setMessage({ text, ok: false });
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    if (!email.trim()) {
      setMessage({ text: "Type your email first.", ok: false });
      return;
    }
    await run(async () => {
      await resetPassword(email);
      setMessage({ text: `Reset email sent to ${email.trim()}.`, ok: true });
    });
  };

  return (
    <div className="space-y-3">
      <BrandButton label="Continue with Apple" onClick={() => run(signInWithApple)} disabled={busy} icon="apple" />
      <BrandButton label="Continue with Google" onClick={() => run(signInWithGoogle)} disabled={busy} icon="google" />

      <button
        type="button"
        onClick={() => setEmailOpen((v) => !v)}
        className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-zinc-300 hover:text-white cursor-pointer transition-colors"
      >
        <Mail className="w-4 h-4" /> Continue with email
        <span className={cn("transition-transform text-zinc-500", emailOpen && "rotate-180")}>⌄</span>
      </button>

      <AnimatePresence initial={false}>
        {emailOpen && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              run(() => (creating ? createWithEmail(email, password) : signInWithEmail(email, password)));
            }}
          >
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-zinc-950/50 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#e5a93c] transition-all"
            />
            <input
              type="password"
              autoComplete={creating ? "new-password" : "current-password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-zinc-950/50 border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#e5a93c] transition-all"
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full py-3.5 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-zinc-100 disabled:opacity-50 cursor-pointer transition-all active:scale-[0.98]"
            >
              {busy ? "…" : creating ? "Create account" : "Sign in"}
            </button>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-zinc-400">
              <button type="button" onClick={() => setCreating((v) => !v)} className="hover:text-white underline underline-offset-2 cursor-pointer">
                {creating ? "Already have an account? Sign in" : "New here? Create an account"}
              </button>
              {!creating && (
                <button type="button" onClick={reset} className="hover:text-white underline underline-offset-2 cursor-pointer">
                  Forgot password?
                </button>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {message && <p className={cn("text-xs font-medium", message.ok ? "text-emerald-400" : "text-rose-400")}>{message.text}</p>}
    </div>
  );
}

/** The brand buttons as both firms publish them: white, their mark, black label. */
function BrandButton({ label, onClick, disabled, icon }: { label: string; onClick: () => void; disabled?: boolean; icon: "apple" | "google" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full h-[52px] rounded-2xl bg-white text-black flex items-center justify-center gap-2.5 text-[15px] font-semibold cursor-pointer transition-all hover:bg-zinc-100 active:scale-[0.985] disabled:opacity-60"
    >
      {icon === "apple" ? (
        <svg className="w-5 h-5 fill-current -mt-0.5" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
          <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
          <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z" />
          <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
        </svg>
      )}
      {label}
    </button>
  );
}

function PayButton({ disabled, busy, onClick }: { disabled: boolean; busy: boolean; onClick: () => void }) {
  return (
    <div className="relative group/btn w-full rounded-xl">
      <div className={cn("absolute -inset-[3.5px] rounded-xl bg-gradient-to-r from-rose-500 via-purple-600 via-[#e5a93c] to-amber-500 blur-[10px] transition-all duration-500", disabled ? "opacity-0" : "opacity-40 group-hover/btn:opacity-75")} />
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "relative w-full py-4 rounded-xl text-white text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 border border-white/10 shadow-xl z-10 focus:outline-none",
          disabled
            ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            : "bg-gradient-to-r from-rose-500 via-purple-600 via-[#e5a93c] to-amber-500 bg-[length:100%_auto] group-hover/btn:bg-[length:200%_auto] group-hover/btn:animate-rainbow-shift active:scale-95 cursor-pointer"
        )}
      >
        {busy ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkle className="w-3.5 h-3.5" />}
        <span>{busy ? "Opening Stripe…" : `Pay ${PRO_PRICE_WEB} with Stripe`}</span>
      </button>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-bold text-white uppercase tracking-wider">{q}</p>
      <p className="text-[11.5px] text-zinc-400 font-light leading-relaxed">{a}</p>
    </div>
  );
}
