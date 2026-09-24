/**
 * The creator who sent this visitor: improvy.app/?ref=marco.
 *
 * Read once on arrival and kept for the tab only (sessionStorage, which the
 * browser clears when the tab closes — the privacy policy promises nothing
 * outlives it). It rides along to three places: PostHog, so visits and the
 * funnel split by creator; the Stripe payment, so each sale names who earned
 * it; and the store badges, so Play Console and App Store Connect count the
 * installs.
 */
const KEY = "improvy.ref";
const SHAPE = /^[a-z0-9][a-z0-9_-]{1,31}$/;

let current: string | null = null;

function clean(v: string | null): string | null {
  if (!v) return null;
  const s = v.trim().toLowerCase();
  return SHAPE.test(s) ? s : null;
}

export function captureRef(): string | null {
  try {
    const fromUrl = clean(new URLSearchParams(window.location.search).get("ref"));
    if (fromUrl) {
      current = fromUrl;
      try {
        sessionStorage.setItem(KEY, fromUrl);
      } catch {
        /* private mode: the ref still lives in memory for this page */
      }
    } else {
      try {
        current = clean(sessionStorage.getItem(KEY));
      } catch {
        current = null;
      }
    }
  } catch {
    current = null;
  }
  return current;
}

export function getRef(): string | null {
  return current;
}

/**
 * Apple's campaign links need a provider token from App Store Connect
 * (App Analytics → Acquisition → Campaigns → Generate a campaign link: it is
 * the `pt=` number). Empty means App Store installs are not split by creator;
 * Play works without anything.
 */
const APPLE_PROVIDER_TOKEN = "";

export function withCampaign(url: string): string {
  const ref = current;
  if (!ref) return url;
  if (url.includes("play.google.com")) {
    return `${url}&referrer=${encodeURIComponent(`utm_source=${ref}&utm_medium=creator`)}`;
  }
  if (url.includes("apps.apple.com") && APPLE_PROVIDER_TOKEN) {
    return `${url}?pt=${APPLE_PROVIDER_TOKEN}&ct=${encodeURIComponent(ref)}&mt=8`;
  }
  return url;
}
