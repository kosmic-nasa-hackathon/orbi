@AGENTS.md

# Claude Code — ORBI

The rules in `AGENTS.md` apply here too. This file only adds Claude-specific workflow notes.

## Before coding

- Read `docs/PLAN.md` to find the active lane, branch and file ownership.
- Read `HANDOFF.md` for the current state and blockers.
- For UI work, read `docs/CONCEPTO-ORBI.md` §6 (screens), `docs/STACK.md` §5 (body map),
  `src/screens/Home.tsx` (landing and nav) and `src/screens/Console.tsx` (engine reference).
- For engine work, read `src/domain/types.ts` and `src/domain/rules.ts` before touching `evaluate()`.

## Working style

- Keep diffs small; one lane per branch. Do not mix UI, engine and docs in one PR.
- Prefer explicit code over new abstractions. No comments that restate the code.
- Do not add a dependency unless it is already listed in `docs/STACK.md` or the task needs it.
- If a task requires changing a contract file, stop and announce it first.
- For generated data, run `npm run gen` and commit the JSON with the code change.

## Verification

- Run `npm run check` and `npm run build` before reporting done.
- For UI changes, also run `npm run dev` and check the tablet viewport (1180 × 820).
- If you cannot verify something (no access, no runner), say so explicitly in `HANDOFF.md`.

## Skills and tools

- Use the project docs, not memory: thresholds and demo numbers live in the repo.
- The coach template is the source of truth for user-facing explanations until the optional
  on-device model is feature-flagged and validated by `src/ai/guardrails.ts`.
