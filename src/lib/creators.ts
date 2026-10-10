import { getRef } from "./referral";

/**
 * Creators whose partnership is agreed, and so may greet their audience by
 * name on the home page: "Recommended by …", their code and what it takes off.
 *
 * Empty until one is agreed. A creator's link (improvy.app/josh →
 * /?ref=josh) still credits the sale and the install either way — see
 * referral.ts — but the site speaks for nobody it has not agreed to speak
 * for. Adding an entry here is all it takes to switch one on; the key is the
 * ref in their link.
 */
export interface ConfirmedCreator {
  /** As their audience knows them: "Josh Walsh". */
  name: string;
  /** The channel, when it is not their own name: "Jazz Library". */
  channel?: string;
  /** Their discount code, e.g. "JOSH10". */
  code: string;
  /** What the code takes off Pro, in percent. */
  pct: number;
}

export const CONFIRMED_CREATORS: Record<string, ConfirmedCreator> = {};

/** The agreed creator whose link brought this visitor, if any. */
export function confirmedCreator(): ConfirmedCreator | null {
  const ref = getRef();
  return ref ? CONFIRMED_CREATORS[ref] ?? null : null;
}
