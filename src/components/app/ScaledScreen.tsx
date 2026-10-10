import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { SCREEN_H, SCREEN_W } from "./TrainerScreen";

/**
 * The app's screen, drawn at its own 402-point width and scaled as a whole
 * to the width it is given — a phone mockup's 284 pixels, or a card the
 * width of a visitor's own phone. Scaling the finished screen keeps every
 * proportion the app has, where re-flowing it would not.
 */
export function ScaledScreen({ width, children }: { width?: number; children: ReactNode }) {
  const box = useRef<HTMLDivElement | null>(null);
  const [measured, setMeasured] = useState<number | null>(null);

  useLayoutEffect(() => {
    if (width !== undefined || !box.current) return;
    const el = box.current;
    const update = () => setMeasured(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);

  const w = width ?? measured ?? SCREEN_W;
  const scale = w / SCREEN_W;
  return (
    <div ref={box} style={{ width: width ?? "100%", height: SCREEN_H * scale, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, transform: `scale(${scale})`, transformOrigin: "top left" }}>{children}</div>
    </div>
  );
}
