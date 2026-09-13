import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { firebaseConfig, firebaseReady } from "./firebase-config";

/**
 * Signing in, and the two calls to the server. The project's own values live
 * in firebase-config.ts; see there for why a browser needs its own.
 */
export { firebaseReady };

/** Thrown when the project has not been wired up yet. Never shown raw. */
export class NotConfigured extends Error {
  constructor() {
    super("Firebase is not configured for this site yet.");
    this.name = "NotConfigured";
  }
}

let app: FirebaseApp | null = null;
function firebaseApp() {
  if (!firebaseReady) throw new NotConfigured();
  if (!app) app = initializeApp(firebaseConfig);
  return app;
}

export function auth() {
  return getAuth(firebaseApp());
}

/** The functions live in europe-west1; the default would look in us-central1. */
function functions() {
  return getFunctions(firebaseApp(), "europe-west1");
}

export type { User };

/** Watches the signed-in user. Returns the unsubscribe. */
export function watchUser(cb: (u: User | null) => void) {
  if (!firebaseReady) {
    cb(null);
    return () => {};
  }
  return onAuthStateChanged(auth(), cb);
}

/**
 * A popup where one will open, a redirect where it will not. Mobile Safari
 * and some in-app browsers refuse popups outright; the redirect lands back
 * on this page and getRedirectResult below picks the answer up.
 */
async function withProvider(provider: GoogleAuthProvider | OAuthProvider) {
  try {
    await signInWithPopup(auth(), provider);
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code ?? "";
    if (code === "auth/popup-blocked" || code === "auth/operation-not-supported-in-this-environment") {
      await signInWithRedirect(auth(), provider);
      return;
    }
    throw e;
  }
}

export async function signInWithGoogle() {
  const p = new GoogleAuthProvider();
  p.setCustomParameters({ prompt: "select_account" });
  await withProvider(p);
}

export async function signInWithApple() {
  const p = new OAuthProvider("apple.com");
  p.addScope("email");
  await withProvider(p);
}

export function finishRedirectSignIn() {
  if (!firebaseReady) return Promise.resolve(null);
  return getRedirectResult(auth()).catch(() => null);
}

export async function signInWithEmail(email: string, password: string) {
  await signInWithEmailAndPassword(auth(), email.trim(), password);
}

export async function createWithEmail(email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth(), email.trim(), password);
  // Best effort: a verified address is what lets the licence be found by
  // email on a phone where the same person signed in another way.
  try {
    await sendEmailVerification(cred.user);
  } catch {
    /* the account works either way */
  }
}

export function resetPassword(email: string) {
  return sendPasswordResetEmail(auth(), email.trim());
}

export function signOutUser() {
  return signOut(auth());
}

// ── The server ─────────────────────────────────────────────────────────────

export interface ProStatus {
  pro: boolean;
  via: "uid" | "email" | null;
  grantedAt: string | null;
  email: string | null;
}

export async function proStatus(): Promise<ProStatus> {
  const call = httpsCallable<Record<string, never>, ProStatus>(functions(), "proStatus");
  return (await call({})).data;
}

export interface CheckoutAnswer {
  url?: string;
  sessionId?: string;
  alreadyPro?: boolean;
}

/** Opens a Stripe Checkout for the signed-in account. Consent is required. */
export async function createCheckoutSession(): Promise<CheckoutAnswer> {
  const call = httpsCallable<{ consent: true }, CheckoutAnswer>(functions(), "createCheckoutSession");
  return (await call({ consent: true })).data;
}

/** One sentence for each way Firebase Auth can say no. */
export function describeAuthError(e: unknown): string {
  if (e instanceof NotConfigured) return "Sign-in is not set up on this site yet.";
  const code = (e as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Wrong email or password.";
    case "auth/email-already-in-use":
    case "auth/account-exists-with-different-credential":
      return "That email already has an account. Sign in instead.";
    case "auth/weak-password":
      return "Password too short: use at least 6 characters.";
    case "auth/invalid-email":
    case "auth/missing-email":
      return "That does not look like an email address.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "";
    case "auth/network-request-failed":
      return "No connection. Try again.";
    case "auth/unauthorized-domain":
      // This site's address is not in Firebase Auth → Settings → Authorized
      // domains. Every sign-in fails until it is.
      return "Sign-in is not switched on for this address yet. We are on it — try again later, or write to us.";
    case "auth/operation-not-allowed":
      return "That way of signing in is not switched on yet. Try another one.";
    case "auth/api-key-not-valid":
    case "auth/invalid-api-key":
    case "auth/app-deleted":
      return "Sign-in is not set up on this site yet. Write to us and we will sort it out.";
    case "auth/web-storage-unsupported":
      return "Your browser is blocking the storage sign-in needs. Try another browser, or turn off private mode.";
    default:
      return "Sign-in failed. Try again.";
  }
}
