/**
 * When a part of the site fails to download.
 *
 * Each page of the site is its own file, fetched the first time it is
 * opened. Two things make that fetch fail: a new version of the site went
 * up while this tab was open, and the old files it asks for are gone from
 * the server; or the connection dropped for a moment. Either way, loading
 * the page again cures it — the first case gets the new version, the second
 * a second try — so the site does it by itself, once.
 */

/** Whether [error] is one of the site's own files failing to arrive, in Chrome's, Safari's or Firefox's words. */
export function isLoadFailure(error: unknown): boolean {
  const message = String((error as { message?: unknown } | null)?.message ?? error ?? "");
  return /dynamically imported module|Importing a module script failed|module script|Unable to preload CSS|Loading chunk|ChunkLoadError/i.test(
    message
  );
}

const KEY = "improvy.reloadedAt";

/**
 * Load the page again, unless that was already tried a moment ago — a
 * connection that is really down must not turn into a page reloading itself
 * for ever. True when the page is reloading.
 */
export function reloadOnce(): boolean {
  try {
    const last = Number(sessionStorage.getItem(KEY) ?? 0);
    if (Date.now() - last < 30_000) return false;
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    // No storage to remember the first try in (private mode, blocked): the
    // visitor gets the button instead.
    return false;
  }
  window.location.reload();
  return true;
}
