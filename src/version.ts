/** Injected by vite.config.ts at build time: package.json version and the short git SHA, if any. */
declare const __APP_VERSION__: string;
declare const __APP_COMMIT__: string;

export const REPO_URL = "https://github.com/kosmic-nasa-hackathon/orbi";

export interface BuildInfo {
  label: string;
  commit?: string;
  commitUrl?: string;
}

/** "ORBI v0.1.0", plus the short commit and its GitHub link when the build had git metadata. */
export function formatVersion(version: string, commit = ""): BuildInfo {
  const label = `ORBI v${version}`;
  const sha = commit.trim().toLowerCase();
  if (!/^[0-9a-f]{7,40}$/.test(sha)) return { label };
  const short = sha.slice(0, 7);
  return { label, commit: short, commitUrl: `${REPO_URL}/commit/${short}` };
}

export const BUILD = formatVersion(__APP_VERSION__, __APP_COMMIT__);
