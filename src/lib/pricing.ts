/**
 * The Pro price, in one place — in the visitor's own currency.
 *
 * A buyer pays in their own money, as they do in the app stores: euro in
 * Europe, pounds in the UK, dollars everywhere else. The page shows the price
 * in that currency, and the checkout charges exactly that figure, in that
 * currency (functions/lib/catalog.js in the app's repository holds the same
 * table — keep them in step).
 *
 * Where the visitor is comes from the time zone their device is set to: it
 * needs no permission, no cookie and no request, and it is right for almost
 * everyone. Somebody travelling sees the price of where they are, which is
 * also what the stores do.
 *
 * Anything that prints a price imports it from here. It used to be written
 * out by hand in more than one place, and the copies drifted.
 */
export type Currency = "eur" | "usd" | "gbp";

/** Pro on this site, in cents. */
export const PRO_PRICES: Record<Currency, number> = { eur: 1899, usd: 1899, gbp: 1599 };

/**
 * Pro in the app stores in the euro zone, in cents. The stores set every
 * other country's price themselves, so only this one is known here — and the
 * site compares itself with the stores only where it can say by how much.
 */
export const PRO_STORE_EUR = 1999;

/** A classroom pack, by currency: one payment, Pro for life for every student. */
export const PACK_PRICES: Record<Currency, { class: number; school: number }> = {
  eur: { class: 9900, school: 24900 },
  usd: { class: 9900, school: 24900 },
  gbp: { class: 8900, school: 21900 },
};

const UK_ZONES = new Set(["Europe/London", "Europe/Belfast", "Europe/Guernsey", "Europe/Isle_of_Man", "Europe/Jersey"]);
// Euro outside the Europe/ zones: the Canaries, Madeira and the Azores, Ceuta.
const EURO_ELSEWHERE = new Set(["Atlantic/Canary", "Atlantic/Madeira", "Atlantic/Azores", "Africa/Ceuta"]);
const UK_REGIONS = new Set(["GB", "UK", "GG", "JE", "IM"]);
// The EU and the rest of Europe, which is shown euro.
const EURO_REGIONS = new Set(
  "AT BE BG HR CY CZ DK EE FI FR DE GR HU IE IT LV LT LU MT NL PL PT RO SK SI ES SE AD MC SM VA ME XK CH LI NO IS AL BA MK RS MD UA".split(" ")
);

/** The visitor's currency. */
export function visitorCurrency(): Currency {
  if (typeof window === "undefined") return "eur";
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    if (UK_ZONES.has(zone)) return "gbp";
    if (zone.startsWith("Europe/") || EURO_ELSEWHERE.has(zone)) return "eur";
    if (zone && zone !== "UTC" && zone !== "Etc/UTC") return "usd";
  } catch {
    // No time zone to read: the language's region, below.
  }
  const region = (navigator.language ?? "").split("-")[1]?.toUpperCase() ?? "";
  if (UK_REGIONS.has(region)) return "gbp";
  if (EURO_REGIONS.has(region)) return "eur";
  return region ? "usd" : "eur";
}

const SYMBOL: Record<Currency, string> = { eur: "€", usd: "$", gbp: "£" };

/** Cents to the site's own price style: 1899 → "€18.99", 9900 → "$99". */
export function money(cents: number, currency: Currency): string {
  const whole = cents % 100 === 0;
  return `${SYMBOL[currency]}${whole ? cents / 100 : (cents / 100).toFixed(2)}`;
}

/** This visitor's currency, settled once for the visit. */
export const CURRENCY: Currency = visitorCurrency();

/** Pro on this site, for this visitor: "€18.99", "$18.99", "£15.99". */
export const PRO_PRICE_WEB = money(PRO_PRICES[CURRENCY], CURRENCY);

/** Sits beside the figure on the pricing card. */
export const PRO_PRICE_NOTE = "one-time · lifetime";

/**
 * The comparison with the stores, in the euro zone only: there the store
 * price is known (€19.99) and the site's is a euro less. Elsewhere the stores
 * set their own price, and the site does not guess it.
 */
export const PRO_PRICE_STORE: string | null = CURRENCY === "eur" ? money(PRO_STORE_EUR, "eur") : null;
export const PRO_PRICE_STORE_NOTE: string | null = PRO_PRICE_STORE
  ? `${PRO_PRICE_STORE} in the App Store and on Google Play`
  : null;
