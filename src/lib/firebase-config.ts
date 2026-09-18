/**
 * The Firebase project this site signs people into.
 *
 * It is the SAME project as the app — improvy-f470f — so an account made
 * here is the account in the app, and a licence bought here is found the
 * moment that account signs in on a phone.
 *
 * The apiKey and appId below are the project's **Web** registration, which
 * is its own thing: the Android and iOS registrations carry keys restricted
 * to those platforms, and a browser handed one of them is refused.
 *
 * They can also arrive from the build instead of from this file — set
 * VITE_FIREBASE_API_KEY and VITE_FIREBASE_APP_ID and they win. Either way
 * none of it is a secret: these values identify the project and authorise
 * nothing. What protects the data is the Firestore rules and the fact that
 * every function checks who is asking. They ship in the page regardless.
 */
const env = import.meta.env as Record<string, string | undefined>;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyB3iTsYccxr0YzgY6kL-fKZOheKPnjf3Co",
  appId: env.VITE_FIREBASE_APP_ID || "1:376089080639:web:a383ab70d5ebe5c32c198a",
  // Sign-in happens on a domain of ours, so the page that completes the
  // exchange with Google or Apple reads auth.improvy.app rather than a
  // project id nobody recognises. It is a Firebase Hosting domain of this
  // same project: Firebase serves /__/auth/handler on it, as it does on
  // improvy-f470f.firebaseapp.com, which stays authorised as a way back.
  authDomain: "auth.improvy.app",
  projectId: "improvy-f470f",
  messagingSenderId: "376089080639",
  storageBucket: "improvy-f470f.firebasestorage.app",
};

/**
 * Whether the values above are real. They are — this stays so that swapping
 * the project, or a build with the env vars pointing at nothing, fails in
 * words rather than in a stack trace.
 *
 * The page does not hide behind it either way: every button is live, and a
 * registration Firebase does not recognise is reported on the attempt, in a
 * sentence, by describeAuthError.
 */
export const firebaseReady = !firebaseConfig.apiKey.startsWith("REPLACE_ME");
