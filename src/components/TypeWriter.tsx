import { useState, useEffect, useRef } from "react";

interface TypeWriterProps {
  strings: string[];
  className?: string;
  holdDelay?: number; // Delay in ms before starting to delete
}

export function TypeWriter({ strings, className, holdDelay = 10000 }: TypeWriterProps) {
  const [currentText, setCurrentText] = useState("");
  const [stringIndex, setStringIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  const stringsRef = useRef(strings);
  
  // Keep the ref updated without triggering the typing effect reset
  useEffect(() => {
    stringsRef.current = strings;
  }, [strings]);

  useEffect(() => {
    const list = stringsRef.current;
    if (!list || list.length === 0) return;

    // Reset index if out of bounds due to list changes
    const activeIndex = stringIndex >= list.length ? 0 : stringIndex;
    const currentString = list[activeIndex] || "";
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setCurrentText(currentString.substring(0, charIndex - 1));
          setCharIndex((prev) => prev - 1);
        }, 20); // Faster deletion
      } else {
        // End of deleting, start next word
        setIsDeleting(false);
        setStringIndex((prev) => (prev + 1) % list.length);
      }
    } else {
      if (charIndex < currentString.length) {
        timer = setTimeout(() => {
          setCurrentText(currentString.substring(0, charIndex + 1));
          setCharIndex((prev) => prev + 1);
        }, 50); // Faster typing
      } else {
        // End of typing, hold/pause for holdDelay ms (e.g. 10 seconds)
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, holdDelay);
      }
    }

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, stringIndex, holdDelay]);

  return (
    <span className="relative inline-flex items-center mx-1 px-2 group">
      {/* Dynamic Magical Ambient Backglow */}
      <span className="absolute inset-x-0 -inset-y-2 bg-gradient-to-r from-[#e5a93c]/20 via-rose-500/20 to-purple-600/20 rounded-full blur-xl opacity-80 animate-pulse pointer-events-none" />

      {/* Magical Floating Particles */}
      {/* Particle 1: Golden Star Sparkle Top Right */}
      <span className="absolute -top-4 -right-4 w-4 h-4 pointer-events-none animate-spin" style={{ animationDuration: "10s" }}>
        <svg className="w-4 h-4 text-amber-300 drop-shadow-[0_0_8px_#e5a93c] animate-bounce" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
        </svg>
      </span>

      {/* Particle 2: Purple/Rose Tiny Sparkle Bottom Left */}
      <span className="absolute -bottom-4 -left-4 w-3.5 h-3.5 pointer-events-none animate-pulse">
        <svg className="w-3.5 h-3.5 text-rose-400 drop-shadow-[0_0_6px_#f43f5e] [animation-delay:0.3s]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l2.5 7.5 7.5 2.5-7.5 2.5-2.5 7.5-2.5-7.5-7.5-2.5 7.5-2.5z" />
        </svg>
      </span>

      {/* Particle 3: Cyan/Teal Sparkly Tiny Star Top Left */}
      <span className="absolute -top-3 -left-5 w-3 h-3 pointer-events-none animate-bounce [animation-delay:0.7s]">
        <svg className="w-3 h-3 text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
        </svg>
      </span>

      {/* Particle 4: Yellow/Orange Tiny Star Sparkle Bottom Right */}
      <span className="absolute -bottom-3 -right-3 w-3 h-3 pointer-events-none animate-pulse">
        <svg className="w-3 h-3 text-purple-400 drop-shadow-[0_0_6px_#8b5cf6] [animation-duration:1.5s]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
        </svg>
      </span>

      {/* Particle 5: Magenta Fast Sparkle Center Top */}
      <span className="absolute -top-5 left-1/2 -translate-x-1/2 w-2 h-2 pointer-events-none animate-bounce [animation-delay:0.5s]">
        <svg className="w-2.5 h-2.5 text-fuchsia-400 drop-shadow-[0_0_5px_#e879f9]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />
        </svg>
      </span>

      {/* The Text Itself */}
      <span className={className || "font-sans font-bold z-10"}>
        {currentText}
      </span>
      
      {/* Blinking Premium Amber Cursor */}
      <span className="animate-pulse text-amber-400 font-normal ml-0.5 select-none font-sans z-10" style={{ WebkitTextFillColor: "#e5a93c" }}>|</span>
    </span>
  );
}

