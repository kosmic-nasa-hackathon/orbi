# TEAM — ORBI

Reparto vivo del equipo para NASA Space Apps 2026. Las lanes, dependencias y criterios de
aceptación están en `docs/PLAN.md`; el estado y los bloqueos, en `HANDOFF.md`.

**Actualizado:** 2026-11-14
**Integrador:** `@Agupane` · **Backup:** `@atapiamallea`
**Equipo:** 5 personas, los miembros actuales de la org de ORBI. `@nagicome03` (Nayeli) y
`@Feito-18` están en Servido/HackMeridian, no en ORBI.

---

## 1. Roster

| Persona | GitHub | Rol | Skills | Foco en ORBI |
|---|---|---|---|---|
| Agustín Pane | `@Agupane` | Maintainer / integrador | Arquitectura, Vite + React, infra, deploy, pitch | Motor (P1, P3), integración y deploy (H), reviews |
| Andrea Tapia | `@atapiamallea` | Fullstack frontend | React/TS, Tailwind, investigación de salud de la mujer | Fundación (F0), Today (A), Decision (C); backup de integración |
| Elena Almansa | `@elenaalmansacampos` | Fullstack | Java/Spring, React, JS, SQL, tests y datos | Landing/deck/submission (P0, P2, E, I) |
| Yery Rodríguez | `@Yeryalex` | Frontend | JS/TS, 42 C, Odin/JS30, CSS | Body (B) y Trends (D) |
| Andrea | `@amilege` | Programación (42 C) | Base de C; en ORBI trabaja UI con apoyo | Visual (E), Mission Control (F) y Level 2 (G) |

> Hay dos Andreas: `@atapiamallea` es Andrea Tapia; `@amilege` es Andrea. Usar siempre el handle.

---

## 2. Reparto

| Issue | Lane | Owner | Support | Rama | Worktree | Puerto | Tamaño | Arranca |
|---|---|---|---|---|---|---|---|---|
| #8 | P0 · Pitch light + motion | `@elenaalmansacampos` | `@Agupane` | `pitch/light-motion` | `../orbi-pitch` | 5317 | S | Ya |
| #9 | P1 · Threshold audit | `@Agupane` | `@atapiamallea` | `engine/threshold-audit` | `../orbi-thresholds` | — | M | Ya |
| #10 | P2 · Submission groundwork | `@elenaalmansacampos` | `@Agupane`, `@atapiamallea` | `docs/submission` | `../orbi-submission` | — | M | Ya |
| #11 | F0 · Fundación | `@atapiamallea` | `@Agupane`, `@Yeryalex` | `design/theme-foundation` | `../orbi-foundation` | 5310 | L | Ya |
| #12 | P3 · Basal de tierra + ciclo | `@Agupane` | `@atapiamallea`, `@Yeryalex` | `engine/cycle-baseline` | `../orbi-engine-cycle` | 5309 | L | Tras #9 |
| #13 | A · Today | `@atapiamallea` | `@amilege`, `@Agupane` | `today/checkin` | `../orbi-today` | 5311 | M | Tras #11 + #12 |
| #14 | B · Body | `@Yeryalex` | `@atapiamallea`, `@Agupane` | `body/map` | `../orbi-body` | 5312 | L | Tras #11 + #12; SVG antes |
| #15 | C · Decision | `@atapiamallea` | `@Agupane`, `@elenaalmansacampos` | `decision/triage` | `../orbi-decision` | 5313 | M | Tras #11 + #12 |
| #16 | E · Visual polish | `@amilege` | `@elenaalmansacampos`, `@Yeryalex` | `design/motion-polish` | `../orbi-polish` | 5315 | M | Tras #11 |
| #17 | H · Integración/QA | `@Agupane` | Todo el equipo | `integration/level0` | `../orbi-integration` | 5318 | L | Checkpoint tras A/B/C |
| #18 | D · Trends | `@Yeryalex` | `@Agupane`, `@atapiamallea` | `trends/charts` | `../orbi-trends` | 5314 | M | Tras gate Nivel 0 + #14 |
| #19 | F · Mission Control | `@amilege` | `@Agupane`, `@Yeryalex` | `mission-control/window` | `../orbi-mission-control` | 5316 | M | Tras gate Nivel 0 + #15 |
| #20 | G · Level 2 | `@amilege` | `@Agupane`, `@elenaalmansacampos` | `level2/extras` | `../orbi-level2` | 5319 | M | Tras gate Nivel 0 + A/B/C; stretch |
| #21 | I · Submission final | `@elenaalmansacampos` | `@Agupane`, `@Yeryalex`, `@atapiamallea` | `docs/submission` | `../orbi-submission` | — | M | Tras #17 |

**Regla de oro:** no se mergea D ni F hasta que Today + Body + Decision estén en la URL
desplegada. G es stretch: si el Nivel 0 se atrasa, se corta primero.

---

## 3. Secuencia por persona

| Persona | Secuencia |
|---|---|
| `@Agupane` | #9 → #12 → reviews/merges → #17 → apoyo #21 |
| `@atapiamallea` | #11 → #13/#15 → backup de integración y reviews |
| `@elenaalmansacampos` | #8 → #10 → #21; apoya #16 y #15 |
| `@Yeryalex` | #14 (pre-work SVG) → #16 support → #18; apoya #19 |
| `@amilege` | #16 → #19 → #20; apoya #13 |

Camino crítico: `#9 → #12 → #13/#14/#15 → gate #17 → #18/#19/#20 → cierre #17 → #21`.

---

## 4. Reglas de trabajo

- **El assignee es el lock.** Los issues ya están asignados; no reasignar sin hablar con el owner
  y el integrador. Al arrancar, comentar rama, worktree y puerto en el issue.
- **Un PR por issue**, título `[lane-id] …` y `Closes #<n>` en el cuerpo.
- **Antes del PR:** `npm run check` y `npm run build`. Si tocaste datos, `npm run gen` sin diff.
- **Archivos permitidos:** los del issue y `docs/PLAN.md` §5. Los compartidos de §3 los tocan solo
  F0 (`#11`) y el integrador. Si necesitás uno, pedilo; no lo edites.
- **Contratos:** no cambiar `src/domain/types.ts`, `src/ai/types.ts`, `src/content/systems.ts` ni la
  forma de los JSON sin anunciarlo. P3 (`#12`) tiene el aviso de contrato en su issue.
- **Bloqueos:** si estás trabado más de 30 min, comentá en el issue el blocker y la próxima acción.
- **UI en inglés**, docs internos en español. Color + icono + texto; nunca solo color.
- **Sin secretos** en el repo, logs, capturas ni docs.

---

## 5. Worktrees y puertos

```bash
git fetch origin
git switch main

git worktree add ../orbi-pitch          pitch/light-motion
git worktree add ../orbi-thresholds     engine/threshold-audit
git worktree add ../orbi-submission     docs/submission
git worktree add ../orbi-foundation     design/theme-foundation
git worktree add ../orbi-engine-cycle   engine/cycle-baseline
git worktree add ../orbi-today          today/checkin
git worktree add ../orbi-body           body/map
git worktree add ../orbi-decision       decision/triage
git worktree add ../orbi-polish         design/motion-polish
git worktree add ../orbi-trends         trends/charts
git worktree add ../orbi-mission-control mission-control/window
git worktree add ../orbi-level2         level2/extras
git worktree add ../orbi-integration    integration/level0

# En cada worktree
npm ci
npm run dev -- --port 53xx
```

| Puerto | Lane |
|---|---|
| 5309 | P3 · engine/cycle-baseline |
| 5310 | F0 · foundation |
| 5311 | A · today |
| 5312 | B · body |
| 5313 | C · decision |
| 5314 | D · trends |
| 5315 | E · polish |
| 5316 | F · mission-control |
| 5317 | P0 · pitch |
| 5318 | H · integration |
| 5319 | G · level2 |

No compartir `node_modules` entre worktrees. Rebase frecuente sobre `main`.

---

## 6. Onboarding (primer día)

1. `nvm use && npm ci && npm run gen && npm run dev`
2. Leer `AGENTS.md`, `docs/PLAN.md`, `HANDOFF.md` y este documento.
3. `gh auth status` y `gh issue list --state open`: verificar que tu issue esté asignado a vos.
4. En `main`: `npm run check` y `npm run build` antes de crear la rama.
5. Crear rama/worktree, comentar en el issue y abrir un PR pequeño.
6. Si es tu primer PR, pedir pairing a `@Agupane` o `@atapiamallea`.

---

## 7. Estado

La tabla de estado y los PRs se mantienen en `docs/PLAN.md` §10 y `HANDOFF.md` §9. Solo el
integrador las actualiza al mergear.
