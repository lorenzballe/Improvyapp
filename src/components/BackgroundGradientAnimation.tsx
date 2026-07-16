"use client";
import { cn } from "../lib/utils";
import React, { useEffect, useRef, useState, ReactNode } from "react";

export interface BackgroundGradientAnimationProps {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(7, 7, 10)",
  gradientBackgroundEnd = "rgb(2, 2, 4)",
  firstColor = "67, 56, 202", // #4338ca (Indigo)
  secondColor = "234, 83, 88", // #ea5358 (Red)
  thirdColor = "247, 186, 43", // #f7ba2b (Yellow)
  fourthColor = "147, 51, 234", // Purple accent
  fifthColor = "59, 130, 246",  // Blue accent
  pointerColor = "234, 83, 88", // Red pointer trail
  size = "60%",
  blendingValue = "screen", // Smooth blends in webgl style
  children,
  className,
  interactive = true,
  containerClassName,
}: BackgroundGradientAnimationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const interactiveRef = useRef<HTMLDivElement>(null);

  const curXRef = useRef(0);
  const curYRef = useRef(0);
  const tgXRef = useRef(0);
  const tgYRef = useRef(0);

  const clientXRef = useRef(window.innerWidth / 2);
  const clientYRef = useRef(window.innerHeight / 2);
  const curClientXRef = useRef(window.innerWidth / 2);
  const curClientYRef = useRef(window.innerHeight / 2);

  useEffect(() => {
    document.body.style.setProperty(
      "--gradient-background-start",
      gradientBackgroundStart
    );
    document.body.style.setProperty(
      "--gradient-background-end",
      gradientBackgroundEnd
    );
    document.body.style.setProperty("--first-color", `rgb(${firstColor})`);
    document.body.style.setProperty("--second-color", `rgb(${secondColor})`);
    document.body.style.setProperty("--third-color", `rgb(${thirdColor})`);
    document.body.style.setProperty("--fourth-color", `rgb(${fourthColor})`);
    document.body.style.setProperty("--fifth-color", `rgb(${fifthColor})`);
    document.body.style.setProperty("--pointer-color", `rgb(${pointerColor})`);
    document.body.style.setProperty("--size", size);
    document.body.style.setProperty("--blending-value", blendingValue);
  }, [
    gradientBackgroundStart,
    gradientBackgroundEnd,
    firstColor,
    secondColor,
    thirdColor,
    fourthColor,
    fifthColor,
    pointerColor,
    size,
    blendingValue,
  ]);

  useEffect(() => {
    let animationFrameId: number;

    const updatePosition = () => {
      // Smooth interpolation coefficient of 11 provides a gorgeous, buttery lag
      curXRef.current += (tgXRef.current - curXRef.current) / 11;
      curYRef.current += (tgYRef.current - curYRef.current) / 11;

      curClientXRef.current += (clientXRef.current - curClientXRef.current) / 11;
      curClientYRef.current += (clientYRef.current - curClientYRef.current) / 11;

      if (interactiveRef.current && containerRef.current) {
        // Shift absolute coordinate so center of the 400x400 gradient circle is directly under mouse
        interactiveRef.current.style.transform = `translate(${Math.round(
          curXRef.current - 200
        )}px, ${Math.round(curYRef.current - 200)}px)`;

        // Compute percentages relative to the screen size (viewport) which is immediately responsive and works at any scroll depth!
        const viewWidth = window.innerWidth || 800;
        const viewHeight = window.innerHeight || 600;
        
        const pctX = Math.min(Math.max(curClientXRef.current / viewWidth, 0), 1);
        const pctY = Math.min(Math.max(curClientYRef.current / viewHeight, 0), 1);

        // Blending corner colors corresponding to site palette:
        // Top-Left: Indigo (67, 56, 202)
        // Top-Right: Red (234, 83, 88)
        // Bottom-Right: Yellow (247, 186, 43)
        // Bottom-Left: Violet/Magenta (147, 51, 234)
        
        // Interpolate perfectly from the signature Blue color on the left to Violet, Red, Orange, and Yellow on the right
        const colors = [
          { r: 59, g: 130, b: 246 },  // Blue
          { r: 147, g: 51, b: 234 },  // Violet
          { r: 234, g: 83, b: 88 },   // Red
          { r: 249, g: 115, b: 22 },   // Orange
          { r: 247, g: 186, b: 43 }   // Yellow
        ];
        
        const segmentCount = colors.length - 1;
        const scaledX = pctX * segmentCount;
        const index = Math.floor(scaledX);
        const fraction = scaledX - index;
        
        let r = 0, g = 0, b = 0;
        if (index >= segmentCount) {
          const lastColor = colors[segmentCount];
          r = lastColor.r;
          g = lastColor.g;
          b = lastColor.b;
        } else {
          const cStart = colors[index];
          const cEnd = colors[index + 1];
          // Smoothstep interpolation for seamless transition warmth
          const easeFraction = fraction * fraction * (3 - 2 * fraction);
          r = Math.round(cStart.r + (cEnd.r - cStart.r) * easeFraction);
          g = Math.round(cStart.g + (cEnd.g - cStart.g) * easeFraction);
          b = Math.round(cStart.b + (cEnd.b - cStart.b) * easeFraction);
        }

        interactiveRef.current.style.setProperty("--pointer-color", `rgb(${r}, ${g}, ${b})`);
      }
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    updatePosition();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      tgXRef.current = event.clientX - rect.left;
      tgYRef.current = event.clientY - rect.top;

      clientXRef.current = event.clientX;
      clientYRef.current = event.clientY;
    }
  };

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={interactive ? handleMouseMove : undefined}
      className={cn(
        "min-h-screen w-full relative overflow-hidden bg-[linear-gradient(to_bottom,var(--gradient-background-start)_0%,var(--gradient-background-end)_55%,#000000_80%)]",
        containerClassName
      )}
    >
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="12"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      
      {/* Content wrapper always placed cleanly relative above the background elements */}
      <div className={cn("relative z-20 w-full h-full", className)}>{children}</div>
      
      <div
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 45%, transparent 68%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 45%, transparent 68%)"
        }}
        className={cn(
          "absolute inset-0 pointer-events-none z-10 select-none overflow-hidden",
          isSafari ? "blur-3xl opacity-30" : "[filter:url(#blurMe)_blur(60px)] opacity-40"
        )}
      >
        <div
          className={cn(
            "absolute [background:radial-gradient(circle_at_center,_var(--first-color)_0,_var(--first-color)_50%)_no-repeat]",
            "[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]",
            "[transform-origin:center_center]",
            "animate-first"
          )}
        ></div>
        <div
          className={cn(
            "absolute [background:radial-gradient(circle_at_center,_var(--second-color)_0,_var(--second-color)_50%)_no-repeat]",
            "[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]",
            "animate-second"
          )}
        ></div>
        <div
          className={cn(
            "absolute [background:radial-gradient(circle_at_center,_var(--third-color)_0,_var(--third-color)_50%)_no-repeat]",
            "[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]",
            "animate-third"
          )}
        ></div>
        <div
          className={cn(
            "absolute [background:radial-gradient(circle_at_center,_var(--fourth-color)_0,_var(--fourth-color)_50%)_no-repeat]",
            "[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]",
            "animate-fourth"
          )}
        ></div>
        <div
          className={cn(
            "absolute [background:radial-gradient(circle_at_center,_var(--fifth-color)_0,_var(--fifth-color)_50%)_no-repeat]",
            "[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]",
            "animate-fifth"
          )}
        ></div>

        {interactive && (
          <div
            ref={interactiveRef}
            className={cn(
              "absolute [background:radial-gradient(circle_at_center,_var(--pointer-color)_0,_var(--pointer-color)_50%)_no-repeat]",
              "[mix-blend-mode:var(--blending-value)] w-[400px] h-[400px] top-0 left-0 pointer-events-none",
              "opacity-60"
            )}
          ></div>
        )}
      </div>
    </div>
  );
};
