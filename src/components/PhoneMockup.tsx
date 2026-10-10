import type { ReactNode } from "react";

/**
 * The phone the site shows the app in: an iPhone 16 Pro's outline, with the
 * island, the status bar and the home indicator drawn where a real one has
 * them. The screen is 284 × 610 CSS pixels; whatever goes in it is laid out
 * for that.
 */
export function PhoneMockup({ children }: { children: ReactNode }) {
  return (
    <div className="card">
      <div className="card-int">
        <div className="btn1"></div>
        <div className="btn2"></div>
        <div className="btn3"></div>
        <div className="btn4"></div>
        <div className="phone-screen">
          {children}
          <div className="phone-island" />
          <div className="phone-status" aria-hidden="true">
            <span className="phone-time">9:41</span>
            <span className="phone-icons">
              <svg width="17" height="11" viewBox="0 0 17 11" fill="white">
                <rect x="0" y="7" width="3" height="4" rx="0.8" />
                <rect x="4.6" y="5" width="3" height="6" rx="0.8" />
                <rect x="9.2" y="2.6" width="3" height="8.4" rx="0.8" />
                <rect x="13.8" y="0" width="3" height="11" rx="0.8" />
              </svg>
              <svg width="15" height="11" viewBox="0 0 15 11" fill="white">
                <path d="M7.5 2.3c2.2 0 4.2.85 5.7 2.25l1.1-1.1A9.6 9.6 0 0 0 7.5.7 9.6 9.6 0 0 0 .7 3.45l1.1 1.1A8.1 8.1 0 0 1 7.5 2.3Z" />
                <path d="M7.5 5.4c1.35 0 2.6.5 3.55 1.35l1.1-1.1A6.6 6.6 0 0 0 7.5 3.8a6.6 6.6 0 0 0-4.65 1.85l1.1 1.1A5.1 5.1 0 0 1 7.5 5.4Z" />
                <path d="M7.5 8.5c.5 0 .95.18 1.3.48L7.5 10.3 6.2 8.98c.35-.3.8-.48 1.3-.48Z" />
              </svg>
              <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
                <rect x="0.5" y="0.5" width="21" height="11" rx="3.4" stroke="white" strokeOpacity="0.4" />
                <rect x="2" y="2" width="18" height="8" rx="2.1" fill="white" />
                <path d="M23 4v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2Z" fill="white" fillOpacity="0.45" />
              </svg>
            </span>
          </div>
          <div className="phone-home" />
        </div>
      </div>
    </div>
  );
}
