/**
 * The Pro price, in one place.
 *
 * Two figures now. Pro bought on this site goes through Stripe and costs a
 * euro less than the same licence bought inside the app, where Apple and
 * Google take their share. Both are the euro-zone price: what a buyer in
 * the stores actually pays is set in App Store Connect and Play Console and
 * shown live by the app; what a buyer here pays is set on the Stripe price
 * the server uses, and Stripe shows it at checkout.
 *
 * Anything that prints a price imports it from here. It used to be written
 * out by hand in more than one place, and the copies drifted.
 */
export const PRO_PRICE_WEB = "€18.99";
export const PRO_PRICE_STORE = "€19.99";

/** Sits beside the figure on the pricing card. */
export const PRO_PRICE_NOTE = "one-time · lifetime";

/** The app's own price, for the comparison line. */
export const PRO_PRICE_STORE_NOTE = `${PRO_PRICE_STORE} in the app stores`;
