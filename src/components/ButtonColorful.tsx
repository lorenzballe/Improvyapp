import React from "react";
import { cn } from "../lib/utils";
import { ArrowUpRight } from "lucide-react";

export interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  className?: string;
  variant?: "default" | "white";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function ButtonColorful({
  className,
  label = "Explore Components",
  variant = "default",
  ...props
}: ButtonColorfulProps) {
  const isWhite = variant === "white";
  return (
    <button
      className={cn(
        isWhite 
          ? "relative h-11 px-6 overflow-hidden rounded-xl flex items-center justify-center font-bold tracking-wider uppercase font-sans text-xs active:scale-95 cursor-pointer transition-all duration-200 group bg-white text-[#06030b] border border-white hover:bg-[#f4f3f6] shadow-[0_4px_25px_rgba(255,255,255,0.25)] hover:shadow-[0_4px_35px_rgba(255,255,255,0.4)]" 
          : "relative h-11 px-6 overflow-hidden rounded-xl flex items-center justify-center font-bold tracking-wider uppercase font-sans text-xs active:scale-95 cursor-pointer border border-white/5 bg-zinc-100 text-zinc-900 transition-all duration-200 group",
        className
      )}
      {...props}
    >
      {/* Gradient background effect */}
      <div
        className={cn(
          "absolute inset-0",
          isWhite 
            ? "bg-gradient-to-r from-indigo-300/10 via-purple-300/10 to-pink-300/10 opacity-0 group-hover:opacity-100 blur transition-opacity duration-300 pointer-events-none" 
            : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-40 group-hover:opacity-80 blur transition-opacity duration-500 pointer-events-none"
        )}
      />

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2 z-10">
        <span 
          className={cn(
            isWhite 
              ? "font-sans tracking-widest font-extrabold text-[#06030b]" 
              : "text-zinc-900 font-sans tracking-widest"
          )}
        >
          {label}
        </span>
        <ArrowUpRight 
          className={cn(
            isWhite 
              ? "w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#06030b] stroke-[2.5]" 
              : "w-3.5 h-3.5 text-zinc-900/90 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
          )} 
        />
      </div>
    </button>
  );
}
