/**
 * An iPhone screen, drawn to the proportions of the real thing.
 *
 * The screenshots are rendered from the app itself at the exact geometry of
 * an iPhone 16 Pro — 402×874 points, with 62 points left clear under the
 * Dynamic Island and 34 over the home indicator — so this only has to add
 * what iOS draws on top: the island, the status bar and the home indicator.
 * Every size below is that phone's, in points, as a fraction of its width or
 * height, so the frame stays true at any width it is given.
 *
 * The parent sets the width; the screen takes its height from the aspect
 * ratio, so a screenshot is never cropped or stretched.
 */
const W = 402;
const H = 874;
const pctW = (pt: number) => `${(pt / W) * 100}%`;
const pctH = (pt: number) => `${(pt / H) * 100}%`;
// Text and icons scale with the screen's width (container query units).
const cq = (pt: number) => `${(pt / W) * 100}cqw`;

export function PhoneScreen({
  src,
  alt,
  radius,
  eager = false,
  className,
}: {
  src: string;
  alt: string;
  /** Corner radius of the glass, in px — 55 pt on the real phone. */
  radius: number;
  eager?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-[#0f0a1a] select-none ${className ?? ""}`}
      style={{ aspectRatio: `${W} / ${H}`, borderRadius: radius, containerType: "inline-size" }}
    >
      <img
        src={src}
        alt={alt}
        width={804}
        height={1748}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        className="absolute inset-0 w-full h-full"
      />

      {/* Status bar: 9:41 on the left, signal, Wi-Fi and battery on the right,
          centred on the island's line as iOS does. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 flex items-center justify-between text-white pointer-events-none"
        style={{ height: pctH(59), paddingLeft: pctW(38), paddingRight: pctW(30) }}
      >
        <span style={{ fontSize: cq(17), fontWeight: 600, letterSpacing: "-0.01em", fontFamily: "-apple-system, 'SF Pro Text', system-ui, sans-serif" }}>
          9:41
        </span>
        <span className="flex items-center" style={{ gap: cq(6) }}>
          <svg viewBox="0 0 18 12" style={{ width: cq(18), height: cq(12) }} fill="currentColor">
            <rect x="0" y="8" width="3" height="4" rx="0.8" />
            <rect x="5" y="5.5" width="3" height="6.5" rx="0.8" />
            <rect x="10" y="3" width="3" height="9" rx="0.8" />
            <rect x="15" y="0" width="3" height="12" rx="0.8" />
          </svg>
          <svg viewBox="0 0 16 12" style={{ width: cq(16), height: cq(12) }} fill="currentColor">
            <path d="M8 2.4c2.3 0 4.4.9 6 2.4l1.1-1.2A10.4 10.4 0 0 0 8 .7C5.2.7 2.7 1.8.9 3.6L2 4.8a8.6 8.6 0 0 1 6-2.4Z" />
            <path d="M8 5.7c1.4 0 2.7.5 3.7 1.4l1.1-1.2A7 7 0 0 0 8 4c-1.9 0-3.6.7-4.8 1.9l1.1 1.2c1-.9 2.3-1.4 3.7-1.4Z" />
            <path d="M8 9c.6 0 1.1.2 1.5.6L8 11.3 6.5 9.6C6.9 9.2 7.4 9 8 9Z" />
          </svg>
          <svg viewBox="0 0 27 13" style={{ width: cq(27), height: cq(13) }} fill="none">
            <rect x="0.5" y="0.5" width="23" height="12" rx="3.6" stroke="currentColor" strokeOpacity="0.4" />
            <rect x="2" y="2" width="20" height="9" rx="2.3" fill="currentColor" />
            <path d="M25 4.4v4.2c.9-.3 1.5-1.2 1.5-2.1s-.6-1.8-1.5-2.1Z" fill="currentColor" fillOpacity="0.4" />
          </svg>
        </span>
      </div>

      {/* Dynamic Island: 126×37 pt, 11 pt from the top. */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 bg-black rounded-full pointer-events-none"
        style={{ top: pctH(11), width: pctW(126), height: pctH(37) }}
      />

      {/* Home indicator: 134×5 pt, 8 pt from the bottom. */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 -translate-x-1/2 rounded-full bg-white/80 pointer-events-none"
        style={{ bottom: pctH(8), width: pctW(134), height: pctH(5) }}
      />
    </div>
  );
}
