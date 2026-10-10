/**
 * Which store this visitor's own device installs from.
 *
 * The first thing the home page asks of anyone is the free download, and a
 * phone can only take it from one of the two stores: an iPhone owner offered
 * Google Play beside the App Store has to look past it to find theirs. A
 * computer installs nothing itself, so it is offered both.
 */
export type Platform = "ios" | "android" | "desktop";

export function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  // iPadOS asks for the desktop site and calls itself a Mac; only touch gives it away.
  if (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return "ios";
  return "desktop";
}
