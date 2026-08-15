/**
 * The Pro price, in one place.
 *
 * It used to be written out by hand in more than one place, and those copies
 * drifted: a price change updated one and left the other saying something else.
 * Anything that prints the price imports it from here.
 *
 * What a customer actually pays is set in App Store Connect / Play Console and
 * shown live by the app's own paywall, which reads it from the store. This is
 * the marketing figure — the euro-zone price — which is why it is published
 * next to a note that it varies by region rather than as a universal number.
 */
export const PRO_PRICE = "€20.99";

/** Sits beside the figure, so a reader outside the euro zone is not misled. */
export const PRO_PRICE_NOTE = "/ one-time · price varies by region";
