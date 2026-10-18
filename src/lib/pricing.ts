/**
 * The Pro price, in one place — in the visitor's own currency, written the
 * way their own country writes prices.
 *
 * A buyer pays in their own money, as they do in the app stores. Each price
 * below is the euro price carried across the way Apple and Google carry a
 * price between storefronts: €18.99 less the 22% VAT inside it, at the day's
 * exchange rate, plus the tax that market shows inside its prices (VAT or
 * GST; none in the US and Canada, where prices are quoted before tax),
 * rounded up to the kind of price that market is used to — $17.99, CHF 15.90,
 * 219 kr. The app's functions/tools/local-prices.mjs does the arithmetic from
 * current rates, and functions/lib/catalog.js holds this same table: the
 * checkout charges exactly the figure shown here. Rates of 9 October 2026.
 *
 * Anywhere without a price of its own the page shows dollars, and Stripe
 * offers the buyer their local currency on its checkout page.
 *
 * Where the visitor is comes from the time zone their device is set to: it
 * needs no permission, no cookie and no request, and it is right for almost
 * everyone. Somebody travelling sees the price of where they are, which is
 * also what the stores do.
 *
 * Anything that prints a price imports it from here. It used to be written
 * out by hand in more than one place, and the copies drifted.
 */
export type Currency = "eur" | "usd" | "gbp" | "cad" | "aud" | "nzd" | "chf" | "sek" | "nok" | "dkk";

/** Pro on this site, in minor units (cents, pence, öre). */
export const PRO_PRICES: Record<Currency, number> = {
  eur: 1899,
  usd: 1799,
  gbp: 1599,
  cad: 2499,
  aud: 2799,
  nzd: 3599,
  chf: 1590,
  sek: 21900,
  nok: 20900,
  dkk: 14900,
};

/**
 * Pro in the app stores in the euro zone, in cents. The stores set every
 * other country's price themselves, so only this one is known here — and the
 * site compares itself with the stores only where it can say by how much.
 */
export const PRO_STORE_EUR = 1999;

/** A classroom pack, in minor units: one payment, Pro for life for every student. */
export const PACK_PRICES: Record<Currency, { class: number; school: number }> = {
  eur: { class: 9900, school: 24900 },
  usd: { class: 9900, school: 22900 },
  gbp: { class: 8900, school: 20900 },
  cad: { class: 13900, school: 32900 },
  aud: { class: 14900, school: 36900 },
  nzd: { class: 18900, school: 46900 },
  chf: { class: 8900, school: 20900 },
  sek: { class: 113900, school: 285900 },
  nok: { class: 108900, school: 273900 },
  dkk: { class: 75900, school: 190900 },
};

/** Time zones whose country has a price of its own, by currency. */
const ZONES: Record<string, Currency> = {};
const zones = (currency: Currency, list: string) => list.split(" ").forEach((z) => (ZONES[z] = currency));
zones("gbp", "Europe/London Europe/Belfast Europe/Guernsey Europe/Isle_of_Man Europe/Jersey Europe/Gibraltar");
zones("chf", "Europe/Zurich Europe/Vaduz Europe/Busingen");
zones("sek", "Europe/Stockholm");
zones("nok", "Europe/Oslo Arctic/Longyearbyen");
zones("dkk", "Europe/Copenhagen Atlantic/Faroe America/Nuuk America/Godthab America/Danmarkshavn America/Scoresbysund America/Thule");
zones(
  "cad",
  "America/Toronto America/Montreal America/Vancouver America/Edmonton America/Winnipeg America/Regina America/Halifax " +
    "America/St_Johns America/Moncton America/Glace_Bay America/Goose_Bay America/Whitehorse America/Dawson " +
    "America/Dawson_Creek America/Fort_Nelson America/Creston America/Cambridge_Bay America/Iqaluit America/Rankin_Inlet " +
    "America/Resolute America/Inuvik America/Yellowknife America/Swift_Current America/Atikokan America/Blanc-Sablon " +
    "America/Thunder_Bay America/Nipigon America/Rainy_River America/Pangnirtung Canada/Eastern Canada/Pacific " +
    "Canada/Central Canada/Mountain Canada/Atlantic Canada/Newfoundland Canada/Saskatchewan Canada/Yukon"
);
zones("aud", "Antarctica/Macquarie");
zones("nzd", "Pacific/Auckland Pacific/Chatham NZ NZ-CHAT");
// The euro zone, the Canaries, Madeira, the Azores, Ceuta and France overseas.
zones(
  "eur",
  "Europe/Rome Europe/Paris Europe/Berlin Europe/Madrid Europe/Lisbon Europe/Amsterdam Europe/Brussels Europe/Vienna " +
    "Europe/Dublin Europe/Helsinki Europe/Mariehamn Europe/Athens Europe/Luxembourg Europe/Malta Europe/Monaco " +
    "Europe/San_Marino Europe/Vatican Europe/Andorra Europe/Bratislava Europe/Ljubljana Europe/Tallinn Europe/Riga " +
    "Europe/Vilnius Europe/Zagreb Europe/Sofia Europe/Nicosia Asia/Nicosia Europe/Podgorica " +
    "Atlantic/Canary Atlantic/Madeira Atlantic/Azores Africa/Ceuta Indian/Reunion Indian/Mayotte " +
    "America/Martinique America/Guadeloupe America/Cayenne America/St_Barthelemy America/Marigot America/Miquelon"
);
// Where the dollar is the money people use.
zones(
  "usd",
  "America/New_York America/Detroit America/Chicago America/Denver America/Phoenix America/Los_Angeles " +
    "America/Anchorage America/Juneau America/Sitka America/Metlakatla America/Yakutat America/Nome America/Adak " +
    "America/Boise America/Menominee Pacific/Honolulu America/Puerto_Rico America/St_Thomas Pacific/Guam " +
    "Pacific/Saipan Pacific/Pago_Pago America/Panama America/Guayaquil America/El_Salvador"
);

/** The same by the region in the browser's language, when there is no time zone. */
const REGIONS: Record<string, Currency> = {};
const regions = (currency: Currency, list: string) => list.split(" ").forEach((r) => (REGIONS[r] = currency));
regions("gbp", "GB UK GG JE IM");
regions("chf", "CH LI");
regions("sek", "SE");
regions("nok", "NO SJ");
regions("dkk", "DK FO GL");
regions("cad", "CA");
regions("aud", "AU");
regions("nzd", "NZ");
regions("eur", "AT BE BG HR CY EE FI FR DE GR IE IT LV LT LU MT NL PT SK SI ES AD MC SM VA ME XK");
regions("usd", "US PR GU VI AS MP EC SV PA");

/**
 * The visitor's currency, and whether it is the money of their own country.
 * Elsewhere in Europe the page shows euro, and anywhere else dollars — and in
 * both cases Stripe offers the buyer their own currency at checkout.
 */
export function visitorCurrency(): { currency: Currency; home: boolean } {
  if (typeof window === "undefined") return { currency: "eur", home: true };
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    if (ZONES[zone]) return { currency: ZONES[zone], home: true };
    if (zone.startsWith("Australia/")) return { currency: "aud", home: true };
    if (/^(America\/(Indiana|Kentucky|North_Dakota)\/|US\/)/.test(zone)) return { currency: "usd", home: true };
    if (zone.startsWith("Europe/")) return { currency: "eur", home: false };
    if (zone && zone !== "UTC" && !zone.startsWith("Etc/")) return { currency: "usd", home: false };
  } catch {
    // No time zone to read: the language's region, below.
  }
  const region = (navigator.language ?? "").split("-")[1]?.toUpperCase() ?? "";
  if (REGIONS[region]) return { currency: REGIONS[region], home: true };
  return { currency: region ? "usd" : "eur", home: false };
}

const VISITOR = visitorCurrency();

/** This visitor's currency, settled once for the visit. */
export const CURRENCY: Currency = VISITOR.currency;

/** Whether that is the money of the visitor's own country. */
export const HOME_CURRENCY = VISITOR.home;

/** The visitor's own way of writing numbers: "18,99 €" in Italy, "$17.99" in the US. */
const LOCALE = typeof navigator === "undefined" ? "en" : navigator.language || "en";

/**
 * Minor units to a price written the visitor's way: 1899 → "18,99 €" for an
 * Italian, 1799 → "$17.99" for an American, 21900 → "219 kr" for a Swede.
 * A whole amount has no decimals. Dollars shown to someone whose own dollar
 * is another (or who has none) say so: "USD 17,99".
 */
export function money(minor: number, currency: Currency): string {
  const whole = minor % 100 === 0;
  const foreign = currency === CURRENCY && !HOME_CURRENCY && currency !== "eur";
  const opts = (display: "narrowSymbol" | "symbol" | "code"): Intl.NumberFormatOptions => ({
    style: "currency",
    currency: currency.toUpperCase(),
    currencyDisplay: display,
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  });
  try {
    return new Intl.NumberFormat(LOCALE, opts(foreign ? "code" : "narrowSymbol")).format(minor / 100);
  } catch {
    try {
      return new Intl.NumberFormat("en", opts("symbol")).format(minor / 100);
    } catch {
      return `${(minor / 100).toFixed(whole ? 0 : 2)} ${currency.toUpperCase()}`;
    }
  }
}

/** Pro on this site, for this visitor: "18,99 €", "$17.99", "£15.99", "219 kr". */
export const PRO_PRICE_WEB = money(PRO_PRICES[CURRENCY], CURRENCY);

/** Sits beside the figure on the pricing card. */
export const PRO_PRICE_NOTE = "one-time · lifetime";

/**
 * The comparison with the stores, in the euro zone only: there the store
 * price is known (€19.99) and the site's is a euro less. Elsewhere the stores
 * set their own price, in their own currency, and the site does not guess it.
 */
export const PRO_PRICE_STORE: string | null =
  CURRENCY === "eur" && HOME_CURRENCY ? money(PRO_STORE_EUR, "eur") : null;
export const PRO_PRICE_STORE_NOTE: string | null = PRO_PRICE_STORE
  ? `${PRO_PRICE_STORE} in the App Store and on Google Play`
  : null;

/** Whether [code] is a currency this site prices in. */
export function isCurrency(code: string): code is Currency {
  return Object.prototype.hasOwnProperty.call(PRO_PRICES, code);
}
