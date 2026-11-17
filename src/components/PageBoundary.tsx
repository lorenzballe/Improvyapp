import { Component, type ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { isLoadFailure, reloadOnce } from "../lib/reload";
import { track } from "../lib/analytics";

/**
 * Around every part of the site that is downloaded when it is first opened.
 *
 * Without it, a page that fails to arrive (see lib/reload.ts) takes the whole
 * site down with it: React leaves a blank screen, header and footer included,
 * and nothing to press. With it, the page loads itself again, once; and if
 * that is not enough, the header and footer stay, and the place where the
 * page should be says what happened and offers the button that fixes it.
 *
 * `quiet` is for the extras inside a page, like the teaser on the home page:
 * if one of those fails, it is simply left out.
 */
interface Props {
  children: ReactNode;
  quiet?: boolean;
}

interface State {
  failed: null | "load" | "error";
  reloading: boolean;
}

export class PageBoundary extends Component<Props, State> {
  // The project has no React type package, so the class's own fields are
  // spelled out for the type checker. (Only a class component can catch.)
  declare props: Readonly<Props>;
  declare setState: (state: Partial<State>) => void;
  state: State = { failed: null, reloading: false };

  static getDerivedStateFromError(error: unknown): Partial<State> {
    return { failed: isLoadFailure(error) ? "load" : "error" };
  }

  componentDidCatch(error: unknown) {
    const kind = isLoadFailure(error) ? "load" : "error";
    track("page_failed", { kind, quiet: this.props.quiet === true, message: String((error as Error)?.message ?? error).slice(0, 200) });
    if (kind === "load" && !this.props.quiet && reloadOnce()) this.setState({ reloading: true });
  }

  render() {
    const { failed, reloading } = this.state;
    if (!failed) return this.props.children;
    if (this.props.quiet) return null;
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16" role="alert">
        <div className="max-w-md text-center space-y-5">
          <h1 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
            {reloading ? "Loading the latest version…" : failed === "load" ? "This page didn't load." : "Something went wrong on this page."}
          </h1>
          {!reloading && (
            <>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                {failed === "load"
                  ? "The connection may have dropped for a moment, or the site was updated while this tab was open. Loading the page again fixes it."
                  : "Loading the page again usually fixes it. If it keeps happening, write to thebalecompany@gmail.com and say which page."}
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-zinc-200 active:scale-95 transition cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Load the page again
              </button>
            </>
          )}
        </div>
      </div>
    );
  }
}
