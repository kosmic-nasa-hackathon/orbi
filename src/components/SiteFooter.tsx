import { Presentation, Route, SquareTerminal } from "lucide-react";
import type { View } from "../navigation";
import { BUILD, REPO_URL } from "../version";
import { GithubMark } from "./GithubMark";

const LINK_CLASS = "inline-flex items-center gap-1.5 transition-colors hover:text-ink";

/** One footer for every view: the deployed version, the disclaimer and the secondary links. */
export function SiteFooter({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <footer className="mx-auto w-full max-w-[1180px] px-4 pt-10 pb-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-5 border-t border-line pt-6">
        <div>
          <p className="font-mono text-label text-muted uppercase">
            {BUILD.label}
            {BUILD.commit && BUILD.commitUrl && (
              <>
                {" · "}
                <a
                  href={BUILD.commitUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline hover:text-ink"
                >
                  {BUILD.commit}
                </a>
              </>
            )}
          </p>
          <p className="mt-1 max-w-[64ch] text-caption text-faint">
            Deterministic engine · no diagnosis, no treatment · synthetic day-148 data. Built for
            NASA Space Apps Challenge 2026 by Team Kosmic.
          </p>
        </div>
        <nav
          aria-label="Footer"
          className="flex flex-wrap items-center gap-4 text-caption text-muted"
        >
          <button type="button" onClick={() => onNavigate("home")} className={LINK_CLASS}>
            Home
          </button>
          <button type="button" onClick={() => onNavigate("eva")} className={LINK_CLASS}>
            <Route className="h-3.5 w-3.5" aria-hidden="true" />
            EVA
          </button>
          <button type="button" onClick={() => onNavigate("console")} className={LINK_CLASS}>
            <SquareTerminal className="h-3.5 w-3.5" aria-hidden="true" />
            Console
          </button>
          <a href="/pitch/" className={LINK_CLASS}>
            <Presentation className="h-3.5 w-3.5" aria-hidden="true" />
            Pitch
          </a>
          <a href={REPO_URL} target="_blank" rel="noreferrer" className={LINK_CLASS}>
            <GithubMark className="h-3.5 w-3.5" />
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
