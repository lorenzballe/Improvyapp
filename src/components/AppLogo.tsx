import React from "react";

interface AppLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  hideBg?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({ 
  className = "", 
  size = 40,
  showText = false,
  hideBg = false
}) => {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div 
        className="relative flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 512 512"
          className="w-full h-full drop-shadow-[0_8px_20px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:scale-[1.03]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* SQUIRCLE BACKGROUND */}
          {!hideBg && (
            <rect
              x="0"
              y="0"
              width="512"
              height="512"
              rx="110"
              fill="#101012"
            />
          )}

          {/* DEFINITIONS OF GRADIENTS */}
          <defs>
            {/* Key 1: Purple to Teal (Mint) */}
            <linearGradient id="key-1-grad" x1="256" y1="104" x2="256" y2="408" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#7e3ff2" />
              <stop offset="50%" stopColor="#26bcff" />
              <stop offset="100%" stopColor="#13f5ab" />
            </linearGradient>

            {/* Key 2: Violet/Blue to Lime */}
            <linearGradient id="key-2-grad" x1="256" y1="104" x2="256" y2="408" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#923ff2" />
              <stop offset="40%" stopColor="#668bf6" />
              <stop offset="100%" stopColor="#85f33d" />
            </linearGradient>

            {/* Key 3: Pink to Yellow */}
            <linearGradient id="key-3-grad" x1="256" y1="104" x2="256" y2="408" gradientUnits="userSpaceOnUse">
               <stop offset="0%" stopColor="#d633af" />
               <stop offset="45%" stopColor="#f5527a" />
               <stop offset="100%" stopColor="#ecf52a" />
            </linearGradient>

            {/* Key 4: Pink-Orange to Yellow */}
            <linearGradient id="key-4-grad" x1="256" y1="104" x2="256" y2="408" gradientUnits="userSpaceOnUse">
               <stop offset="0%" stopColor="#f52d50" />
               <stop offset="45%" stopColor="#fa7f23" />
               <stop offset="100%" stopColor="#fbcb18" />
            </linearGradient>
          </defs>

          {/* KEY 1 */}
          <path
            d="M 110,104 L 130,104 A 12,12 0 0 1 142,116 L 142,276 C 142,284 156,284 156,292 L 156,392 A 16,16 0 0 1 140,408 L 93,408 A 16,16 0 0 1 77,392 L 77,120 A 16,16 0 0 1 93,104 Z"
            fill="url(#key-1-grad)"
          />

          {/* KEY 2 */}
          <path
            d="M 196,104 L 223,104 A 12,12 0 0 1 235,116 L 235,276 C 235,284 249,284 249,292 L 249,392 A 16,16 0 0 1 233,408 L 186,408 A 16,16 0 0 1 170,392 L 170,292 C 170,284 184,284 184,276 L 184,116 A 12,12 0 0 1 196,104 Z"
            fill="url(#key-2-grad)"
          />

          {/* KEY 3 */}
          <path
            d="M 289,104 L 316,104 A 12,12 0 0 1 328,116 L 328,276 C 328,284 342,284 342,292 L 342,392 A 16,16 0 0 1 326,408 L 279,408 A 16,16 0 0 1 263,392 L 263,292 C 263,284 277,284 277,276 L 277,116 A 12,12 0 0 1 289,104 Z"
            fill="url(#key-3-grad)"
          />

          {/* KEY 4 */}
          <path
            d="M 382,104 L 419,104 A 16,16 0 0 1 435,120 L 435,392 A 16,16 0 0 1 419,408 L 372,408 A 16,16 0 0 1 356,392 L 356,292 C 356,284 370,284 370,276 L 370,116 A 12,12 0 0 1 382,104 Z"
            fill="url(#key-4-grad)"
          />
        </svg>
      </div>

      {showText && (
        <div>
          <span className="font-display text-xl font-bold text-white tracking-widest uppercase transition-colors group-hover:text-rose-400">Improvy</span>
          <span className="font-sans text-[10px] text-[#fbbf24] tracking-[0.15em] block font-semibold leading-none uppercase mt-1">Music Trainer</span>
        </div>
      )}
    </div>
  );
};
