/**
 * The Firebase project this site signs people into.
 *
 * It is the SAME project as the app — improvy-f470f — so an account made
 * here is the account in the app, and a licence bought here is found the
 * moment that account signs in on a phone.
 *
 * A browser needs the project's **Web** app registration, which is its own
 * thing: the Android and iOS registrations carry keys restricted to those
 * platforms, and a browser handed one of them is refused. Firebase console →
 * ⚙️ Project settings → Your apps → Add app → Web. Two values come out of it
 * and go below; STRIPE_SETUP.md has the walkthrough.
 *
 * They can also arrive from the build instead of from this file — set
 * VITE_FIREBASE_API_KEY and VITE_FIREBASE_APP_ID and they win. Either way
 * none of it is a secret: these values identify the project and authorise
 * nothing. What protects the data is the Firestore rules and the fact that
 * every function checks who is asking. They ship in the page regardless.
 */
const env = import.meta.env as Record<string, string | undefined>;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "REPLACE_ME_WEB_API_KEY",
  appId: env.VITE_FIREBASE_APP_ID || "REPLACE_ME_WEB_APP_ID",
  authDomain: "improvy-f470f.firebaseapp.com",
  projectId: "improvy-f470f",
  messagingSenderId: "376089080639",
  storageBucket: "improvy-f470f.firebasestorage.app",
};

/**
 * Whether the two values above are real yet.
 *
 * The page does not hide behind this. Every button is live and the flow is
 * the finished one; if the registration is still missing, Firebase says so
 * on the attempt and describeAuthError turns that into a sentence. A page
 * that refuses to try is harder to finish than one that tries and reports.
 */
export const firebaseReady = !firebaseConfig.apiKey.startsWith("REPLACE_ME");
