import type { PostHog } from "posthog-js";

/**
 * What happens on this site, in the same place as what happens in the app.
 *
 * The project is the app's, so a person who lands here, makes an account and
 * then plays on their phone is one person rather than two halves of a funnel
 * nobody can join. That only works because both sides identify by the Firebase
 * account id — see identifyVisitor below.
 *
 * **Cookieless on purpose.** Nothing is written to the browser: no cookie, no
 * localStorage entry, no identifier that outlives the tab. Under the EU rules
 * that is what makes a consent banner unnecessary, and a banner on a page
 * whose whole job is to sell one thing costs more than the attribution it
 * buys. The price is that somebody who comes back tomorrow counts as new — so
 * "visitors" here reads as "visits", and that is the honest reading anyway.
 */
const KEY = "phc_xWTwCXAdzGvKo9Qp4cfNoDwbrLssrnGFJVZQhQmxcrHP";
const HOST = "https://eu.i.posthog.com";

let started = false;

/**
 * The SDK is ~180 KB, and nothing on screen needs it: it used to sit in the
 * first bundle, ahead of the hero, on the one metric Google ranks a landing
 * page by. Now it loads after the page is up, and every call made before it
 * arrives waits in this queue instead of being lost.
 */
let client: PostHog | null = null;
const pending: Array<(ph: PostHog) => void> = [];

function withClient(fn: (ph: PostHog) => void) {
  if (client) {
    try {
      fn(client);
    } catch {
      /* ignore */
    }
  } else {
    pending.push(fn);
  }
}

export function startAnalytics() {
  if (started || typeof window === "undefined") return;
  started = true;
  const load = () =>
    import("posthog-js")
      .then(({ default: posthog }) => {
        posthog.init(KEY, {
          api_host: HOST,
          // Europe, like the app's. Data does not leave the EU.
          ui_host: "https://eu.posthog.com",
          persistence: "memory",
          disable_session_recording: true,
          // The page is one document with a hash router, so PostHog's own
          // pageview detection would see a single visit forever. track()
          // below reports each view instead.
          capture_pageview: false,
          capture_pageleave: false,
          autocapture: false,
          // No cookie means no cross-site anything; saying so explicitly
          // keeps it true if a later version of the SDK changes its defaults.
          cross_subdomain_cookie: false,
          // IP becomes a coarse city server-side, as in the app. The privacy
          // policy already says so.
          ip: true,
        });
        client = posthog;
        for (const fn of pending.splice(0)) {
          try {
            fn(posthog);
          } catch {
            /* ignore */
          }
        }
      })
      .catch(() => {
        /* analytics must never be the reason a page does not load */
      });
  // After the page has painted, when the browser has nothing better to do.
  const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => void })
    .requestIdleCallback;
  if (idle) idle(load);
  else window.setTimeout(load, 1500);
}

/** Properties every later event of this visit carries — e.g. the creator ref. */
export function tagVisit(props: Record<string, string>) {
  withClient((posthog) => posthog.register(props));
}

/** One view of one screen. The hash is the screen. */
export function trackView(screen: string) {
  // The address now, not when the SDK arrives: by then the hash may be
  // another screen's.
  const url = window.location.href;
  withClient((posthog) => posthog.capture("$pageview", { screen, $current_url: url }));
}

/** Anything worth counting that is not a view. */
export function track(event: string, properties?: Record<string, unknown>) {
  withClient((posthog) => posthog.capture(event, properties));
}

/**
 * The same id the app identifies with, so the two halves are one person.
 *
 * Never the email: an address can change, and every event recorded under the
 * old one would then belong to nobody.
 */
export function identifyVisitor(uid: string) {
  withClient((posthog) => posthog.identify(uid, { signed_in_on: "web" }));
}

/** Back to nobody on sign-out. */
export function resetVisitor() {
  withClient((posthog) => posthog.reset());
}
