import React from "react";
import { cn } from "../lib/utils";

type TColorProp = string | string[];

interface ShineBorderProps {
  borderRadius?: number;
  borderWidth?: number;
  duration?: number;
  color?: TColorProp;
  className?: string;
  children: React.ReactNode;
}

export function ShineBorder({
  borderRadius = 24,
  borderWidth = 1.5,
  duration = 8,
  color = ["#f43f5e", "#ec4899", "#6366f1"], // Premium metallic/neon palette for ear training
  className,
  children,
}: ShineBorderProps) {
  const gradientColor = Array.isArray(color) ? color.join(", ") : color;

  return (
    <div
      style={
        {
          "--border-radius": `${borderRadius}px`,
        } as React.CSSProperties
      }
      className={cn(
        "relative rounded-3xl p-[1px] text-zinc-100 bg-zinc-950/80 overflow-hidden",
        className,
      )}
    >
      <div
        style={
          {
            "--border-width": `${borderWidth}px`,
            "--border-radius": `${borderRadius}px`,
            "--shine-pulse-duration": `${duration}s`,
            "--mask-linear-gradient": `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
            "--background-radial-gradient": `radial-gradient(transparent, transparent, ${gradientColor}, transparent, transparent)`,
          } as React.CSSProperties
        }
        className={`before:bg-shine-size before:absolute before:inset-0 before:aspect-square before:size-full before:rounded-[var(--border-radius)] before:p-[var(--border-width)] before:will-change-[background-position] before:content-[""] before:![-webkit-mask-composite:xor] before:[background-image:var(--background-radial-gradient)] before:[background-size:250%_250%] before:![mask-composite:exclude] before:[mask:var(--mask-linear-gradient)] motion-safe:before:animate-shine-pulse`}
      ></div>
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
