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
 * None of this is a secret. These values identify the project and authorise
 * nothing: what protects the data is the Firestore rules and the fact that
 * every function checks who is asking. They ship in the page either way.
 */
export const firebaseConfig = {
  apiKey: "REPLACE_ME_WEB_API_KEY",
  appId: "REPLACE_ME_WEB_APP_ID",
  authDomain: "improvy-f470f.firebaseapp.com",
  projectId: "improvy-f470f",
  messagingSenderId: "376089080639",
  storageBucket: "improvy-f470f.firebasestorage.app",
};

/**
 * Whether the two values above are real yet.
 *
 * Until they are, nothing here tries to reach Firebase. The Pro page says so
 * in words rather than offering buttons that answer with an internal error —
 * an unconfigured site that looks broken is worse than one that is honest.
 */
export const firebaseReady = !firebaseConfig.apiKey.startsWith("REPLACE_ME");
