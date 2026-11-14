# Submission checklist

Last updated: 14 Nov 2026.

## Access

- [x] Repository currently private; do not expose it until the access model is confirmed.
- [ ] Decide the access model: public repository, judge access, or downloadable archive.
- [ ] If public, run a full-history secret scan with a dedicated tool and confirm the unauthenticated URL.
- [ ] If private, provide a verifiable judge/archive path and document it here.
- [x] Targeted full-history pattern scan completed with **0 hits** (tokens, private keys, `.env`,
  Dokploy token patterns). This is not a substitute for a dedicated scanner before making the repo
  public.
- [x] No `.env`, credentials or deploy keys are tracked in the current tree.

## License and credits

- [x] `LICENSE` added: MIT for the ORBI source code.
- [x] README explains that third-party material keeps its original terms.
- [x] Visible credits added for NASA, CSA, Servier Medical Art, fonts and open-source libraries.
- [x] Detailed attribution in `docs/submission/CREDITS.md`.

## Submission package

- [ ] Final README links to the public repository or access path.
- [ ] Demo video recorded and uploaded (`#49`).
- [ ] Pitch deck and project page match the generated data (`#48`).
- [ ] Screenshots at tablet size in light and dark.
- [ ] Final project description checked against the app.
- [ ] Submission form completed and submitted before the deadline (`#21`).

## Verification

- [ ] `npm run check` green.
- [ ] `npm run build` green.
- [ ] Production responds on all shipped routes.
- [ ] No secrets in screenshots, logs, docs or the submission form.
