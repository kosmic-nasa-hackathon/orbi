## What changes

<!-- One sentence. Link the docs/TASKS.md task or the issue. -->

Closes #

Target branch: `development` (not `main`). `main` is release-only and is promoted by the integrator.

## Lane

- [ ] A · Engine + data
- [ ] B · Body + Trends
- [ ] C · Today + Decision
- [ ] D · Coach + Mission Control
- [ ] E · Design + pitch
- [ ] Integration / deploy / docs

## Checklist

- [ ] Issue claimed/assigned and referenced with `Closes #<number>`
- [ ] PR targets `development` (not `main`)
- [ ] `npm run check` green (typecheck + check:domain + Biome CI + tests)
- [ ] `npm run build` passes
- [ ] I have not changed `src/domain/types.ts` or `src/ai/types.ts` without notifying the team
- [ ] New UI is in English; all project docs are in English
- [ ] No secrets, tokens or `.env` in the diff
- [ ] If it touches UI, I attach a screenshot or a description of how to test it
- [ ] I have updated `HANDOFF.md` if the state changes or blockers remain

## Risks / notes

<!-- What can break, what is missing, what decision needs to be made. -->
