/**
 * The app's own pictures, under public/images: what an image search for
 * "Improvy" should find. Each is a named file at an address that never
 * changes, with words that say what is in it. Google ties an image to the
 * page that shows it, so the home page shows them as well as /app/.
 *
 * One list for the page and for the build: the home page draws it, and
 * tools/ writes the same files into /app/, the sitemap and the structured
 * data, so neither can list a picture the other does not show.
 */
export interface AppImage {
  file: string;
  w: number;
  h: number;
  alt: string;
  /** A short title under a screenshot, and its name for Google. */
  name?: string;
  /** One line under a screenshot: what the screen is for. */
  text?: string;
}

export const APP_ICON: AppImage = { file: "improvy-app-icon.png", w: 512, h: 512, alt: "Improvy app icon" };

/** The app's home screen, as the phone at the top of the home page shows it. */
export const HOME_SCREEN: AppImage = {
  file: "improvy-app-home-screen.webp",
  w: 720,
  h: 1558,
  alt: "Improvy app: the training home screen, with total progress and mastery in all 12 keys",
  name: "The home screen",
};

/** The five screens on the App Store and Google Play, in their order. */
export const STORE_SCREENSHOTS: AppImage[] = [
  {
    file: "improvy-app-chromatic-scale-degree-trainer.jpg", w: 660, h: 1434,
    alt: "Improvy app: the chromatic scale-degree trainer",
    name: "The trainer",
    text: "A degree is asked — ♭3, ♯11, 13 — and you find its note in the key, against the clock.",
  },
  {
    file: "improvy-app-daily-challenge.jpg", w: 660, h: 1434,
    alt: "Improvy app: the Daily Challenge",
    name: "The Daily Challenge",
    text: "The same run for everyone, once a day, with a score to share and a streak to keep.",
  },
  {
    file: "improvy-app-progress-stats.jpg", w: 660, h: 1434,
    alt: "Improvy app: progress and statistics",
    name: "Stats",
    text: "Mastery in each of the 12 keys, your response time, and the degrees that still cost you.",
  },
  {
    file: "improvy-app-pocket-mode.jpg", w: 660, h: 1434,
    alt: "Improvy app: Pocket Mode, hands-free audio training",
    name: "Pocket Mode",
    text: "A voice asks, waits and answers — training on a walk, with the screen off.",
  },
  {
    file: "improvy-app-home-screen-widgets.jpg", w: 660, h: 1434,
    alt: "Improvy app: Home Screen widgets",
    name: "Widgets",
    text: "A question, the Daily Challenge and your weakest key, right on the Home Screen.",
  },
];

export const APP_BANNER: AppImage = {
  file: "improvy-app-banner.jpg", w: 1920, h: 823,
  alt: "Improvy — every note is a number: the scale degrees 1 to 7 on a keyboard",
};

/** The line under "Inside the app", on the page and in its plain HTML. */
export const SCREENS_INTRO =
  "The screens from the App Store and Google Play: the trainer, the Daily Challenge, your stats, Pocket Mode and the widgets.";

/** Every picture on the home page, in the order it shows them. */
export const HOME_IMAGES: AppImage[] = [HOME_SCREEN, ...STORE_SCREENSHOTS, APP_ICON];

/** Every picture on /app/. */
export const APP_PAGE_IMAGES: AppImage[] = [APP_ICON, ...STORE_SCREENSHOTS, APP_BANNER];
