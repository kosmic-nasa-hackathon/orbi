# Submission access

The repository is **private** today. This page records the options and the checks required before
the jury receives access. Do not change visibility until the decision and the secret scan are
complete.

## Recommended: public repository after a clean history scan

1. Run a full-history scanner (for example `gitleaks detect --source . --log-opts=--all`).
2. Confirm there are no tokens, private keys, `.env` files, deploy keys or personal data.
3. Change visibility to public in GitHub repository settings.
4. Open `https://github.com/kosmic-nasa-hackathon/orbi` in a private window without a GitHub
   session and verify it returns `200`.
5. Put the same URL in the README, the deck and the submission form.
6. Record the change in `CHECKLIST.md` and `HANDOFF.md`.

The current targeted scan found no obvious secret patterns, but it is not a replacement for the
dedicated scanner in step 1.

## Fallback: private repository plus judge access

Use this if there is not enough time for a clean public release.

- Add the judges' GitHub accounts as read-only collaborators, or
- publish a signed/zip archive of the repository without `.git` and without internal deployment
  details, or
- provide a read-only mirror and a checksum.

The submission form must explain exactly how a judge opens the code without belonging to the
Kosmic organisation. The link must work from an unauthenticated browser or from the documented
judge account.

## Do not publish

- `.env` files, tokens, deploy keys or `DOKPLOY_TOKEN`.
- Internal IPs, runner labels or infrastructure credentials beyond what the deployment docs already
  describe.
- Personal data from the team or from the synthetic crew scenarios.

## Final verification

- [ ] Unauthenticated URL or documented judge path works.
- [ ] `LICENSE` is visible and linked from the README.
- [ ] Credits are visible.
- [ ] The submission form, README and deck point to the same access path.
