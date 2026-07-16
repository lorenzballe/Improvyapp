import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { BackgroundGradientAnimation } from "./components/BackgroundGradientAnimation";
import { ButtonColorful } from "./components/ButtonColorful";
import { ShineBorder } from "./components/ShineBorder";
import { TypeWriter } from "./components/TypeWriter";
import { AppLogo } from "./components/AppLogo";
import { TestimonialsColumn, testimonialsList } from "./components/TestimonialsColumn";
import { 
  Music, 
  Smartphone, 
  ChevronRight, 
  Sparkle,
  Lock,
  ShieldCheck,
  Check,
  X,
  KeyRound,
  Brain,
  LineChart,
  SlidersHorizontal,
  Coins,
  HelpCircle
} from "lucide-react";
import { CheckoutPro } from "./components/CheckoutPro";
import { WhyImprovySection } from "./components/WhyImprovySection";
import { WhyImprovyPage } from "./components/WhyImprovyPage";
import TermsOfServicePage from "./components/TermsOfServicePage";
import PrivacyPolicyPage from "./components/PrivacyPolicyPage";
import AboutPage from "./components/AboutPage";
import FeedbackPage from "./components/FeedbackPage";
import { cn } from "./lib/utils";
import { FooterModal } from "./components/FooterModal";

const revealVariants = {
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.12,
      duration: 0.5,
    },
    transitionEnd: {
      transform: "none",
      filter: "none"
    }
  }),
  hidden: {
    filter: "blur(10px)",
    y: -20,
    opacity: 0,
  },
};

interface AnimatedTextProps {
    text?: string;
    className?: string;
}

function Text_03({
    text = "Mente",
    className = "",
}: AnimatedTextProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <span
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={cn(
                "inline-block cursor-pointer font-extrabold text-white select-none whitespace-nowrap",
                className
            )}
        >
            {text.split("").map((char, index) => (
                <motion.span
                    key={index}
                    className="inline-block text-white"
                    animate={{
                        y: isHovered ? -6 : 0,
                        scale: isHovered ? 1.15 : 1,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 12,
                        delay: index * 0.03,
                    }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </span>
    );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "checkout" | "why" | "terms" | "privacy" | "about" | "feedback">("home");
  const [aboutPageScrollTo, setAboutPageScrollTo] = useState<"top" | "get-in-touch" | null>(null);
  const [aboutScrollTrigger, setAboutScrollTrigger] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [footerModalOpen, setFooterModalOpen] = useState(false);
  const [footerModalType, setFooterModalType] = useState<"about" | "affiliates" | "feedback" | "newsletter" | "privacy" | "terms" | null>(null);

  const openFooterModal = (type: "about" | "affiliates" | "feedback" | "newsletter" | "privacy" | "terms") => {
    setFooterModalType(type);
    setFooterModalOpen(true);
  };

  const logoRef = useRef<HTMLDivElement | null>(null);
  const [mousePct, setMousePct] = useState({ x: 50, y: 50 });
  const [isHoveringLogo, setIsHoveringLogo] = useState(false);
  const [keysHeight, setKeysHeight] = useState<number | null>(null);
  const [logoHeight, setLogoHeight] = useState<number | null>(null);

  useEffect(() => {
    const updateKeysHeight = () => {
      if (logoRef.current) {
        const height = logoRef.current.offsetHeight;
        setLogoHeight(height);
        // Visual keys are drawn between Y=104 and Y=408 in a 512px height viewBox
        const calculatedKeysHeight = (304 / 512) * height;
        setKeysHeight(calculatedKeysHeight);
      }
    };

    updateKeysHeight();
    window.addEventListener("resize", updateKeysHeight);
    
    const timers = [
      setTimeout(updateKeysHeight, 100),
      setTimeout(updateKeysHeight, 500),
      setTimeout(updateKeysHeight, 1500)
    ];

    return () => {
      window.removeEventListener("resize", updateKeysHeight);
      timers.forEach(t => clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!logoRef.current) return;
      const rect = logoRef.current.getBoundingClientRect();
      
      const isInside = (
        e.clientX >= rect.left - 150 &&
        e.clientX <= rect.right + 150 &&
        e.clientY >= rect.top - 150 &&
        e.clientY <= rect.bottom + 150
      );
      
      setIsHoveringLogo(isInside);
      
      if (isInside) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const pctX = Math.max(0, Math.min(100, (x / rect.width) * 100));
        const pctY = Math.max(0, Math.min(100, (y / rect.height) * 100));
        setMousePct({ x: pctX, y: pctY });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Morph header bar beautifully when user starts scrolling (scrolled > 30px)
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleInstallClick = (store: string) => {
    console.log(`Inizializzazione del download gratuito di Improvy su ${store}...`);
  };

  return (
    <BackgroundGradientAnimation 
      gradientBackgroundStart="rgb(6, 3, 12)"
      gradientBackgroundEnd="rgb(2, 1, 4)"
      interactive={true}
      containerClassName=""
    >
      <div className="w-full relative z-20 min-h-screen text-[#d4d4db] font-sans pb-0">
        {/* ULTRA-PREMIUM DYNAMIC SCROLL FLOATING HEADER */}
        <header className={cn(
          "fixed top-0 inset-x-0 z-50 w-full bg-transparent px-4 sm:px-6 py-4 flex justify-center transition-all duration-500 ease-out transform",
          (isScrolled || currentPage !== "home")
            ? "opacity-100 translate-y-0 pointer-events-auto" 
            : "opacity-0 -translate-y-12 pointer-events-none"
        )}>
          <div className="w-auto max-w-[95vw] bg-[#07040f]/85 backdrop-blur-xl border border-white/[0.08] py-1.5 px-2.5 sm:py-2.5 sm:px-6 rounded-full shadow-[0_16px_50px_rgba(7,4,15,0.7)] flex items-center justify-center gap-2 sm:gap-7">
            <button onClick={() => {
              if (currentPage !== "home") {
                setCurrentPage("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }} className="hover:text-white flex items-center gap-1.5 text-[8.5px] sm:text-[10.5px] font-sans font-extrabold uppercase tracking-[0.10em] sm:tracking-[0.18em] text-zinc-350 transition-colors duration-200 cursor-pointer focus:outline-none">
              <span>HOME</span>
            </button>
            <button onClick={() => {
              if (currentPage !== "why") {
                setCurrentPage("why");
                window.scrollTo({ top: 0, behavior: "smooth" });
              } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }} className={cn(
              "hover:text-white text-[8.5px] sm:text-[10.5px] font-sans font-extrabold uppercase tracking-[0.10em] sm:tracking-[0.18em] transition-colors duration-200 cursor-pointer focus:outline-none",
              currentPage === "why" ? "text-[#e5a93c]" : "text-zinc-400"
            )}>Method</button>
            <button onClick={() => {
              if (currentPage !== "home") {
                setCurrentPage("home");
                setTimeout(() => scrollToSection("testimonials"), 100);
              } else {
                scrollToSection("testimonials");
              }
            }} className="hover:text-white text-[8.5px] sm:text-[10.5px] font-sans font-extrabold uppercase tracking-[0.10em] sm:tracking-[0.18em] text-zinc-400 transition-colors duration-200 cursor-pointer focus:outline-none">Reviews</button>
            <div className="relative group/btn p-[1.5px] rounded-xl bg-gradient-to-r from-rose-500/50 via-purple-500/50 to-[#e5a93c]/60 hover:from-rose-500 hover:via-purple-500 hover:to-[#e5a93c] bg-[length:200%_auto] animate-rainbow-shift transition-all duration-500">
              <div className="absolute -inset-[3px] rounded-xl bg-gradient-to-r from-rose-500 via-purple-500 to-[#e5a93c] opacity-0 group-hover/btn:opacity-60 blur-[8px] transition-all duration-500 bg-[length:200%_auto] group-hover/btn:animate-rainbow-shift" />
              
              <button 
                onClick={() => {
                  if (currentPage === "checkout") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else if (currentPage !== "home") {
                    setCurrentPage("home");
                    setTimeout(() => scrollToSection("pricing"), 100);
                  } else {
                    scrollToSection("pricing");
                  }
                }}
                className="relative px-2 py-1 sm:px-4 sm:py-2 rounded-[11px] text-[8px] sm:text-[10px] font-black uppercase tracking-widest transition-all duration-350 active:scale-95 cursor-pointer whitespace-nowrap bg-white text-zinc-950 hover:bg-transparent hover:text-white focus:outline-none"
              >
                {currentPage === "checkout" ? (
                  "Check-out Pro"
                ) : (
                  <>
                    <span className="inline sm:hidden">Improvy Pro</span>
                    <span className="hidden sm:inline">Get Improvy Pro</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* PAGES COMPONENT */}
        {currentPage === "checkout" ? (
          <CheckoutPro onBack={() => {
            setCurrentPage("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }} />
        ) : currentPage === "why" ? (
          <WhyImprovyPage onBack={() => {
            setCurrentPage("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }} />
        ) : currentPage === "terms" ? (
          <TermsOfServicePage onBack={() => {
            setCurrentPage("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }} />
        ) : currentPage === "privacy" ? (
          <PrivacyPolicyPage onBack={() => {
            setCurrentPage("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }} />
        ) : currentPage === "about" ? (
          <AboutPage 
            scrollToSection={aboutPageScrollTo}
            scrollTrigger={aboutScrollTrigger}
            onBack={() => {
              setCurrentPage("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }} 
          />
        ) : currentPage === "feedback" ? (
          <FeedbackPage onBack={() => {
            setCurrentPage("home");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }} />
        ) : (
          <>

             {/* HERO SECTION */}
        <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-6 md:px-12 pt-10 sm:pt-14 md:pt-16 pb-24 max-w-7xl mx-auto z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full items-center">
            
            {/* Left Column: Copywriting and CTAs */}
            <div className="lg:col-span-7 space-y-8 text-left">
              
              {/* Asymmetrical Master Heading */}
              <motion.h1 
                initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.12, duration: 0.5 }}
                className="font-display text-5xl sm:text-7xl xl:text-8xl font-extrabold text-white leading-[1.05] tracking-tight"
              >
                Train your <Text_03 text="Mind" />{" "}
                to{" "}
                <TypeWriter 
                  className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#e5a93c] via-rose-500 to-purple-500 font-serif"
                  strings={["improvise", "visualize", "compose", "transpose"]}
                  holdDelay={10000}
                />
              </motion.h1>

              {/* Subheading text in clean neural tone */}
              <motion.p 
                initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.24, duration: 0.5 }}
                className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl font-sans font-light"
              >
                A synthetic relational methodology tuned to 12 keys. Instantly translate harmonic structures into spatial geometric vectors to unlock total awareness during improvisation, mental calculation, and composition.
              </motion.p>

              {/* Actions with glowing custom premium buttons */}
              <motion.div 
                initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.36, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 pt-2 items-stretch sm:items-center"
              >
                <ButtonColorful
                  onClick={() => scrollToSection("pricing")}
                  label="Explore Memberships"
                  className="sm:w-auto"
                />
              </motion.div>

              {/* App Stores badges section (as requested: "metter su gli store, cioè i bollettini degli store") */}
              <motion.div 
                initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.48, duration: 0.5 }}
                className="pt-6 space-y-4"
              >
                <div className="flex items-center gap-2">
                  <p className="text-[12.5px] sm:text-sm font-sans uppercase tracking-[0.22em] bg-gradient-to-r from-[#f43f5e] via-[#d946ef] to-[#6366f1] bg-clip-text text-transparent font-black">Download for free</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  {/* Premium Apple App Store Button */}
                  <button 
                    onClick={() => handleInstallClick("App Store iOS")}
                    className="flex items-center w-full sm:w-[220px] gap-4 bg-zinc-900 border border-white/10 hover:border-[#e5a93c]/50 text-white px-6 py-4 rounded-2xl transition-all duration-300 active:scale-95 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(229,169,60,0.15)] group relative overflow-hidden focus:outline-none focus:ring-0"
                  >
                    {/* Magic sweep glass reflex beam */}
                    <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                    
                    <svg className="w-7 h-7 text-white fill-current shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 1.15-3.27 1.2-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5 1.07 3.29 1.07.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.02.07-.43 1.44-1.38 2.82M15.97 4.17c.66-.8 1.1-1.89 1.08-3.17-.91.04-2.01.6-2.67 1.38-.56.66-1.05 1.76-.9 3.01 1.05.08 2.06-.51 2.49-1.22z"/>
                    </svg>
                    <div className="flex flex-col items-start leading-none text-left">
                      <span className="text-[10.5px] text-zinc-500 font-sans tracking-[0.12em] font-bold uppercase mb-1">Download on</span>
                      <span className="text-base font-sans font-bold text-white">App Store</span>
                    </div>
                  </button>

                  {/* Premium Google Play Button */}
                  <button 
                    onClick={() => handleInstallClick("Google Play Android")}
                    className="flex items-center w-full sm:w-[220px] gap-4 bg-zinc-900 border border-white/10 hover:border-indigo-500/50 text-white px-6 py-4 rounded-2xl transition-all duration-300 active:scale-95 cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] group relative overflow-hidden focus:outline-none focus:ring-0"
                  >
                    {/* Magic sweep glass reflex beam */}
                    <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

                    <svg className="w-7 h-7 shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.25 1.75C3.06 1.93 2.95 2.22 2.95 2.6V21.4C2.95 21.78 3.06 22.07 3.25 22.25L3.32 22.32L13.84 11.8V11.53L3.32 1.01L3.25 1.75Z" fill="#00A0FF" />
                      <path d="M17.34 15.33L13.84 11.82V11.51L17.34 8L17.42 8.04L21.57 10.4C22.75 11.07 22.75 12.26 21.57 12.93L17.42 15.29L17.34 15.33Z" fill="#FFE000" />
                      <path d="M13.84 11.66L3.25 22.25C3.59 22.59 4.19 22.61 4.88 22.22L17.34 15.14L13.84 11.66Z" fill="#FF2C00" />
                      <path d="M13.84 11.66L17.34 8.18L4.88 1.1C4.19 0.71 3.59 0.73 3.25 1.07L13.84 11.66Z" fill="#00E676" />
                    </svg>
                    <div className="flex flex-col items-start leading-none text-left">
                      <span className="text-[10.5px] text-zinc-500 font-sans tracking-[0.12em] font-bold uppercase mb-1">Available on</span>
                      <span className="text-base font-sans font-bold text-white">Google Play</span>
                    </div>
                  </button>
                </div>
              </motion.div>

            </div>

            {/* Right Column: Premium Mobile iPhone Mockup (gently floating) */}
            <motion.div 
              custom={5}
              initial="hidden"
              animate="visible"
              variants={revealVariants}
              className="lg:col-span-5 flex justify-center items-center relative z-10 pt-10 lg:pt-0"
            >
              <motion.div 
                initial={{ y: 15 }}
                animate={{ y: -15 }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
                className="flex-shrink-0"
              >
                <div className="card">
                  <div className="card-int">
                    <div className="top"></div>
                    <div className="speaker"></div>
                    <div className="camera"></div>
                    <div className="int"></div>
                    
                    <div className="btn1"></div>
                    <div className="btn2"></div>
                    <div className="btn3"></div>
                    <div className="btn4"></div>
 
                    <div className="hello flex flex-col items-center justify-center">
                      <AppLogo size={120} className="mb-6 drop-shadow-[0_16px_32px_rgba(0,0,0,0.7)]" />
                      <span className="font-display text-4xl font-extrabold tracking-tight text-white italic">Improvy</span>
                      <span className="font-sans text-[10px] text-[#e5a93c] tracking-[0.16em] block font-bold leading-none uppercase mt-2.5">Music Trainer</span>

                      <div className="hidden-item mt-10 space-y-4 px-3 text-center w-full">
                        <div className="h-[1px] w-12 bg-white/10 mx-auto"></div>
                        <p className="text-[10px] text-zinc-300 leading-relaxed font-sans font-light">
                          Total harmonic awareness and instant geometric calculation across all 12 keys.
                        </p>
                        <div className="flex items-center justify-center gap-1.5 pt-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse animate-duration-1000"></span>
                          <span className="text-[8.5px] font-sans tracking-[0.12em] text-emerald-400 uppercase font-bold">READY TO PLAY</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </section>
        {/* INTERACTIVE BACKGROUND BRAND KEYS CONTAINER */}
        <div className="relative w-full overflow-hidden mt-16 bg-transparent">


          {/* IMPROVY PEDAGOGICAL EDUCATIONAL METHOD SHOWCASE */}
          <motion.div
            id="why"
            custom={6}
            initial="hidden"
            animate="visible"
            variants={revealVariants}
          >
            <WhyImprovySection onLearnMoreClick={() => {
              setCurrentPage("why");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }} />
          </motion.div>
          {/* SECTION 3: SIGNATURE LIFE-TIME ACCESS PRICING (Side-by-side comparison) */}
          <motion.section 
            id="pricing" 
            custom={7}
            initial="hidden"
            animate="visible"
            variants={revealVariants}
            className="pt-20 pb-20 sm:pt-24 sm:pb-24 max-w-7xl mx-auto px-6 md:px-12 relative z-30 scroll-mt-6 bg-transparent"
          >
            {/* Section Header */}
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight leading-[1.3] sm:leading-[1.2] uppercase">
                CHOOSE YOUR{" "}
                <span className="relative inline-block ml-6 sm:ml-8 mr-2 px-6 py-2">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 font-black">
                    FLOW
                  </span>
                  <div className="absolute -inset-x-3 -inset-y-3 pointer-events-none z-0">
                    <motion.svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 200 80"
                      preserveAspectRatio="none"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="w-full h-full overflow-visible"
                    >
                      <motion.path
                        d="M 180 16 
                           C 205 34, 195 72, 100 74
                           C 30 76, 5 65, 5 40
                           C 5 15, 30 8, 100 8
                           C 155 8, 185 16, 175 28"
                        fill="none"
                        strokeWidth="3.5"
                        stroke="#ffffff"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={{
                          hidden: { pathLength: 0, opacity: 0 },
                          visible: {
                            pathLength: 1,
                            opacity: 0.9,
                            transition: {
                              pathLength: { duration: 2.2, ease: [0.43, 0.13, 0.23, 0.96], delay: 0.15 },
                              opacity: { duration: 0.4, delay: 0.15 },
                            },
                          },
                        }}
                      />
                      <defs>
                        <linearGradient id="rainbow-gradient-sintonia-new" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#f43f5e" />
                          <stop offset="50%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#6366f1" />
                        </linearGradient>
                      </defs>
                    </motion.svg>
                  </div>
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-xl mx-auto leading-relaxed">
                From essential basic training to full twelve-tone chromatic mastery. Single lifetime access fee, no subscription.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
              {/* RETTANGOLO 1: Improvy Standard (Base) */}
              <div className="group relative overflow-hidden bg-[#07040f]/60 border border-white/[0.05] p-8 sm:p-10 rounded-[28px] backdrop-blur-3xl flex flex-col justify-between text-left hover:border-white/15 transition-all duration-500 hover:-translate-y-1.5 shadow-2xl">
                {/* Subtle shine sweep */}
                <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
                <div className="absolute top-0 left-0 w-64 h-64 bg-[#e5a93c]/2 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] font-sans font-extrabold uppercase tracking-[0.2em] text-zinc-500">STANDARD VERSION</span>
                      <h4 className="text-3xl font-black font-display tracking-tight text-white mt-1">Improvy</h4>
                    </div>
                    <span className="text-[9px] font-extrabold text-zinc-400 bg-white/5 border border-white/10 px-3 py-1 rounded-md uppercase font-sans tracking-wide">
                      Free
                    </span>
                  </div>

                  <p className="text-xs text-zinc-450 font-sans font-light leading-relaxed">
                    Perfect for your first steps. Train mental calculations and practice scale degree relationships in the key of C.
                  </p>

                  <div className="py-5 border-t border-b border-white/[0.05]">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-white font-sans tracking-tight">€0</span>
                      <span className="text-xs text-zinc-500 font-sans font-medium">/ lifetime</span>
                    </div>
                    <span className="text-[9px] text-[#e5a93c] block mt-1.5 uppercase tracking-widest font-extrabold">RECOMMENDED TO START</span>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[9px] text-zinc-400 font-extrabold uppercase tracking-widest">What's Included:</p>
                    <ul className="space-y-3.5 text-xs text-zinc-350 font-sans font-light">
                      <li className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                        </div>
                        <span>C Major / Minor key training</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                        </div>
                        <span>Visualize scale degree logic on the keyboard</span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                        </div>
                        <span>Basic tracking and core diagnostics</span>
                      </li>
                      <li className="flex items-center gap-3 text-zinc-650 opacity-45">
                        <div className="w-5 h-5 rounded-full bg-zinc-800/20 border border-white/5 flex items-center justify-center shrink-0">
                          <X className="w-3 h-3 text-zinc-500" />
                        </div>
                        <span className="line-through">Other 11 keys locked (desaturated)</span>
                      </li>
                      <li className="flex items-center gap-3 text-zinc-650 opacity-45">
                        <div className="w-5 h-5 rounded-full bg-zinc-800/20 border border-white/5 flex items-center justify-center shrink-0">
                          <X className="w-3 h-3 text-zinc-500" />
                        </div>
                        <span className="line-through">PRO trainings and customization</span>
                      </li>
                      <li className="flex items-center gap-3 text-zinc-650 opacity-45">
                        <div className="w-5 h-5 rounded-full bg-zinc-800/20 border border-white/5 flex items-center justify-center shrink-0">
                          <X className="w-3 h-3 text-zinc-500" />
                        </div>
                        <span className="line-through">Adaptive difficulty and detailed analytics</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="relative z-10 pt-8 mt-8 border-t border-white/[0.05]">
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="w-full py-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] text-white border border-white/10 text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 active:scale-95 focus:outline-none focus:ring-0"
                  >
                    <span>Start for Free</span>
                  </button>
                </div>
              </div>

              {/* RETTANGOLO 2: Improvy Pro (Premium) */}
              <div className="relative overflow-hidden p-[2px] rounded-[28px] flex flex-col justify-between text-left group hover:-translate-y-1.5 transition-all duration-500 rainbow-gold-glow">
                
                {/* Stunning rotating conic gradient (creates the active rainbow-gold glowing halo border effect requested by the user) */}
                <div className="absolute -inset-[200%] bg-[conic-gradient(from_0deg,#e5a93c_0deg,#f43f5e_60deg,#a855f7_120deg,#3b82f6_180deg,#10b981_240deg,#e5a93c_300deg)] animate-spin-slow opacity-85 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Luxury gradient shine sweep overlay */}
                <span className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] ease-out pointer-events-none z-10" />
                
                {/* Inner Obsidian Black Card */}
                <div className="bg-[#07050d] rounded-[26.5px] p-8 sm:p-10 flex flex-col justify-between h-full relative overflow-hidden backdrop-blur-3xl z-10">
                  {/* Subtle solar flare gold background radial bleed to tone down the purple/cold neon */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#e5a93c]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="relative z-10 space-y-6">
                     <div className="flex justify-between items-start">
                       <div>
                         {/* Symmetrical Elite Golden Label */}
                         <span className="text-[9px] font-sans font-extrabold uppercase tracking-[0.22em] text-[#e5a93c]">LIFETIME PRO UNLOCK</span>
                         <h4 className="text-3xl font-black font-display tracking-tight text-white mt-1">Improvy Pro</h4>
                       </div>
                       <span className="text-[9px] font-black text-white bg-gradient-to-r from-amber-600 via-[#e5a93c] to-amber-500 border border-amber-400/20 px-3 py-1.5 rounded-full uppercase font-sans tracking-widest shadow-lg shadow-amber-950/20 animate-pulse">
                         Recommended
                       </span>
                     </div>

                    <p className="text-xs text-zinc-350 font-sans font-light leading-relaxed">
                      Unlock the entire chromatic keyboard, cognitive stimulation modes, and intelligent self-assessment algorithms.
                    </p>

                    {/* Elite Gold pricing block with exactly the same font-size layout as Section 1 */}
                    <div className="py-5 border-t border-b border-white/[0.05]">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-black text-white font-sans tracking-tight">€16.99</span>
                        <span className="text-xs text-zinc-500 font-sans font-medium">/ single payment</span>
                      </div>
                      <span className="text-[9px] text-[#e5a93c] block mt-1.5 uppercase tracking-widest font-extrabold">PRO ACCESS FOR LIFE • NO RECURRING SUBSCRIPTIONS</span>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[9px] text-[#e5a93c] font-black uppercase tracking-widest font-sans">Everything in Standard, plus:</p>
                      <ul className="space-y-3.5 text-xs text-zinc-100 font-sans font-light">
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-[#e5a93c]/12 border border-[#e5a93c]/25 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-[#e5a93c] stroke-[3]" />
                          </div>
                          <span className="font-semibold text-white">Complete unlock of all 12 keys</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-[#e5a93c]/12 border border-[#e5a93c]/25 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-[#e5a93c] stroke-[3]" />
                          </div>
                          <span>Exclusive: <span className="font-semibold text-white">Note-to-Number</span> Mode (Note to scale degree)</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-[#e5a93c]/12 border border-[#e5a93c]/25 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-[#e5a93c] stroke-[3]" />
                          </div>
                          <span>Custom configuration of notes and scale degrees</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-[#e5a93c]/12 border border-[#e5a93c]/25 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-[#e5a93c] stroke-[3]" />
                          </div>
                          <span>Real-time <span className="font-semibold text-[#e5a93c]">Adaptive Difficulty</span> algorithm</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-[#e5a93c]/12 border border-[#e5a93c]/25 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-[#e5a93c] stroke-[3]" />
                          </div>
                          <span>Deep Analytics with keyboard heatmaps</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-[#e5a93c]/12 border border-[#e5a93c]/25 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-[#e5a93c] stroke-[3]" />
                          </div>
                          <span className="text-[#e5a93c] font-medium">No future subscriptions - Lifetime access</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="relative z-10 pt-8 mt-8 border-t border-white/[0.04]">
                    <div className="relative group/btn w-full rounded-xl">
                      <div className="absolute -inset-[3.5px] rounded-xl bg-gradient-to-r from-rose-500 via-purple-600 via-[#e5a93c] to-amber-500 opacity-0 group-hover/btn:opacity-75 blur-[10px] transition-all duration-500 bg-[length:100%_auto] group-hover/btn:bg-[length:200%_auto] group-hover/btn:animate-rainbow-shift" />
                      
                      <button
                        onClick={() => {
                          setCurrentPage("checkout");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="relative w-full py-4 rounded-xl bg-gradient-to-r from-rose-500 via-purple-600 via-[#e5a93c] to-amber-500 bg-[length:100%_auto] group-hover/btn:bg-[length:200%_auto] group-hover/btn:animate-rainbow-shift text-white text-xs font-black uppercase tracking-widest transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-white/10 shadow-xl shadow-rose-600/10 z-10 focus:outline-none focus:ring-0"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Get Improvy PRO</span>
                      </button>
                    </div>
                    <span className="text-[8.5px] font-sans text-zinc-500 block text-center mt-2.5 uppercase tracking-widest">
                      One-time purchase forever - No Recurring Fees
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </motion.section>

          {/* SECTION 2.5: UNLIMITED SCROLLING TESTIMONIALS */}
          <motion.section 
            id="testimonials"
            custom={8}
            initial="hidden"
            animate="visible"
            variants={revealVariants}
            className="pt-20 pb-0 sm:pt-24 sm:pb-0 relative z-30 max-w-7xl mx-auto px-6 md:px-12 bg-transparent overflow-hidden"
          >
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight leading-none uppercase">
                WHAT PEOPLE SAY ABOUT <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500">IMPROVY</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-xl mx-auto leading-relaxed">
                Musicians, educators, and creatives who built their harmonic awareness and improvisation skills on our 12-key relational system.
              </p>
            </div>

            {/* Testimonials Vertical Columns Layout */}
            <div 
              className="relative overflow-hidden mt-10 transition-all duration-300 w-full"
              style={{ height: keysHeight ? `${keysHeight}px` : "600px" }}
            >
              {/* Real-time Interactive Glowing Keys Logo in background layer - mathematically mapped to keysHeight boundaries */}
              <div 
                className="absolute inset-x-0 pointer-events-none select-none flex items-center justify-center -z-10"
                style={{ 
                  height: logoHeight ? `${logoHeight}px` : "100%",
                  top: logoHeight ? `-${(104 / 512) * logoHeight}px` : "0px",
                }}
              >
                <div ref={logoRef} className="relative w-full max-w-6xl aspect-square overflow-hidden flex items-center justify-center">
                  {/* LAYER 2: INTERACTIVE ILLUMINATED MULTI-COLOR KEYS */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      opacity: isHoveringLogo ? 1.0 : 0,
                      filter: isHoveringLogo ? "saturate(1.45)" : "none",
                      maskImage: `radial-gradient(ellipse 35% 35% at ${mousePct.x}% ${mousePct.y}%, black 0%, rgba(0, 0, 0, 0.8) 25%, rgba(0, 0, 0, 0.45) 55%, rgba(0, 0, 0, 0.12) 80%, transparent 100%)`,
                      WebkitMaskImage: `radial-gradient(ellipse 35% 35% at ${mousePct.x}% ${mousePct.y}%, black 0%, rgba(0, 0, 0, 0.8) 25%, rgba(0, 0, 0, 0.45) 55%, rgba(0, 0, 0, 0.12) 80%, transparent 100%)`,
                      transition: "opacity 0.4s ease-out, filter 0.3s ease-out"
                    }}
                    className="absolute inset-0 select-none pointer-events-none"
                  >
                    <svg
                      viewBox="0 0 512 512"
                      className="w-full h-full max-h-[1100px] object-contain absolute inset-0 select-none pointer-events-none"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <linearGradient id="bg-key-1-grad" x1="256" y1="104" x2="256" y2="408" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#7e3ff2" />
                          <stop offset="50%" stopColor="#26bcff" />
                          <stop offset="100%" stopColor="#13f5ab" />
                        </linearGradient>
                        <linearGradient id="bg-key-2-grad" x1="256" y1="104" x2="256" y2="408" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#923ff2" />
                          <stop offset="40%" stopColor="#668bf6" />
                          <stop offset="100%" stopColor="#85f33d" />
                        </linearGradient>
                        <linearGradient id="bg-key-3-grad" x1="256" y1="104" x2="256" y2="408" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#d633af" />
                          <stop offset="45%" stopColor="#f5527a" />
                          <stop offset="100%" stopColor="#ecf52a" />
                        </linearGradient>
                        <linearGradient id="bg-key-4-grad" x1="256" y1="104" x2="256" y2="408" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#f52d50" />
                          <stop offset="45%" stopColor="#fa7f23" />
                          <stop offset="100%" stopColor="#fbcb18" />
                        </linearGradient>
                      </defs>

                      {/* KEY 1 */}
                      <path
                        d="M 110,104 L 130,104 A 12,12 0 0 1 142,116 L 142,276 C 142,284 156,284 156,292 L 156,392 A 16,16 0 0 1 140,408 L 93,408 A 16,16 0 0 1 77,392 L 77,120 A 16,16 0 0 1 93,104 Z"
                        fill="url(#bg-key-1-grad)"
                      />

                      {/* KEY 2 */}
                      <path
                        d="M 196,104 L 223,104 A 12,12 0 0 1 235,116 L 235,276 C 235,284 249,284 249,292 L 249,392 A 16,16 0 0 1 233,408 L 186,408 A 16,16 0 0 1 170,392 L 170,292 C 170,284 184,284 184,276 L 184,116 A 12,12 0 0 1 196,104 Z"
                        fill="url(#bg-key-2-grad)"
                      />

                      {/* KEY 3 */}
                      <path
                        d="M 289,104 L 316,104 A 12,12 0 0 1 328,116 L 328,276 C 328,284 342,284 342,292 L 342,392 A 16,16 0 0 1 326,408 L 279,408 A 16,16 0 0 1 263,392 L 263,292 C 263,284 277,284 277,276 L 277,116 A 12,12 0 0 1 289,104 Z"
                        fill="url(#bg-key-3-grad)"
                      />

                      {/* KEY 4 */}
                      <path
                        d="M 382,104 L 419,104 A 16,16 0 0 1 435,120 L 435,392 A 16,16 0 0 1 419,408 L 372,408 A 16,16 0 0 1 356,392 L 356,292 C 356,284 370,284 370,276 L 370,116 A 12,12 0 0 1 382,104 Z"
                        fill="url(#bg-key-4-grad)"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Fade out top and bottom */}
              <div 
                className="absolute top-0 inset-x-0 h-24 md:h-32 bg-gradient-to-b from-black to-transparent z-40 pointer-events-none select-none" 
              />
              <div 
                className="absolute bottom-0 inset-x-0 h-24 md:h-32 bg-gradient-to-t from-black to-transparent z-40 pointer-events-none select-none" 
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full items-start">
                {/* Column 1 */}
                <TestimonialsColumn 
                  testimonials={testimonialsList.slice(0, 2)} 
                  duration={16} 
                  className="flex flex-col gap-6"
                />

                {/* Column 2 - Hidden on Mobile but visible on desktop */}
                <TestimonialsColumn 
                  testimonials={testimonialsList.slice(2, 4)} 
                  duration={22} 
                  className="hidden md:flex flex-col gap-6"
                />

                {/* Column 3 - Hidden on tablet, visible on desktop */}
                <TestimonialsColumn 
                  testimonials={testimonialsList.slice(4, 6)} 
                  duration={18} 
                  className="hidden lg:flex flex-col gap-6"
                />
              </div>
            </div>
          </motion.section>
        </div>
          </>
        )}

        {/* EDITORIAL PREMIUM FOOTER */}
        <motion.footer 
          custom={9}
          initial="hidden"
          animate="visible"
          variants={revealVariants}
          className="border-t border-white/5 pt-10 pb-6 md:pt-12 md:pb-8 px-6 md:px-12 relative z-30 bg-[#07040f]/95 backdrop-blur-xl overflow-hidden mt-8 w-full"
        >
          {/* Ambient light flares inside the footer */}
          <div className="absolute top-0 right-1/4 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto font-sans text-zinc-400">
            
            {/* Main Footer Clean Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-left mb-0">
              
              {/* Column 1: Brand Manifesto & Core Mission */}
              <div className="col-span-2 md:col-span-1 flex flex-col gap-3">
                <div>
                  <span className="font-display text-xl sm:text-2xl font-black text-white italic tracking-tight">Improvy</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed font-light">
                  Train your mind to see every note before you play it. Instant scale-degree mastery across all 12 keys for real musical fluency.
                </p>
              </div>

              {/* Column 2: Explore */}
              <div className="flex flex-col gap-3.5">
                <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#e5a93c]">Explore</h4>
                <div className="flex flex-col gap-2 text-xs font-medium text-zinc-400 font-normal">
                  <button 
                    onClick={() => {
                      if (currentPage !== "home") {
                        setCurrentPage("home");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      } else {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className="hover:text-white transition-colors duration-200 cursor-pointer text-left focus:outline-none"
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => {
                      if (currentPage !== "why") {
                        setCurrentPage("why");
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      } else {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className={cn(
                      "hover:text-white transition-colors duration-200 cursor-pointer text-left focus:outline-none",
                      currentPage === "why" ? "text-[#e5a93c]" : "text-zinc-300"
                    )}
                  >
                    The Method
                  </button>
                  <button 
                    onClick={() => {
                      if (currentPage !== "home") {
                        setCurrentPage("home");
                        setTimeout(() => scrollToSection("pricing"), 100);
                      } else {
                        scrollToSection("pricing");
                      }
                    }}
                    className="hover:text-white transition-colors duration-200 cursor-pointer text-left focus:outline-none"
                  >
                    Pricing
                  </button>
                </div>
              </div>

              {/* Column 3: Engage */}
              <div className="flex flex-col gap-3.5">
                <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-rose-400">Engage</h4>
                <div className="flex flex-col gap-2 text-xs font-medium text-zinc-400">
                  <button 
                    onClick={() => {
                      setAboutPageScrollTo("get-in-touch");
                      setAboutScrollTrigger(prev => prev + 1);
                      setCurrentPage("about");
                    }}
                    className="hover:text-white transition-colors duration-200 cursor-pointer text-left focus:outline-none"
                  >
                    About Us
                  </button>
                  <button 
                    onClick={() => {
                      setAboutPageScrollTo("get-in-touch");
                      setAboutScrollTrigger(prev => prev + 1);
                      setCurrentPage("about");
                    }}
                    className="hover:text-white transition-colors duration-200 cursor-pointer text-left focus:outline-none"
                  >
                    Affiliates
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentPage("feedback");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-white transition-colors duration-200 cursor-pointer text-left focus:outline-none"
                  >
                    Feedback
                  </button>
                </div>
              </div>

              {/* Column 4: Harmonics & Legal */}
              <div className="flex flex-col gap-3.5">
                <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-indigo-400">Harmonics & Legal</h4>
                <div className="flex flex-col gap-2 text-xs font-medium text-zinc-400">
                  <button 
                    onClick={() => {
                      setAboutPageScrollTo("get-in-touch");
                      setAboutScrollTrigger(prev => prev + 1);
                      setCurrentPage("about");
                    }}
                    className="hover:text-white transition-colors duration-200 cursor-pointer text-left focus:outline-none"
                  >
                    Contact Us
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentPage("privacy");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-white transition-colors duration-200 cursor-pointer text-left focus:outline-none"
                  >
                    Privacy Policy
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentPage("terms");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="hover:text-white transition-colors duration-200 cursor-pointer text-left focus:outline-none"
                  >
                    Terms of Service
                  </button>
                </div>
                <div className="pt-6 mt-2 text-[11px] text-zinc-500 font-light">
                  <p>2026 Imprivilabs Inc. All Rights Reserved</p>
                </div>
              </div>

            </div>

          </div>
        </motion.footer>

        {/* Footer dynamic overlay modals */}
        <FooterModal 
          isOpen={footerModalOpen}
          type={footerModalType}
          onClose={() => setFooterModalOpen(false)}
        />

      </div>
    </BackgroundGradientAnimation>
  );
}
