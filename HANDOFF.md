# HANDOFF — ORBI

**Fecha:** 2026-11-14
**Rama:** `feat/scaffold-baseline`
**Base:** `main` @ `4a9c36b` (solo docs)
**Estado:** scaffold, motor y coach listos y verificados. CI y artefactos de deploy añadidos.
**Falta:** UI de las pantallas, provisión de Dokploy/Cloudflare y activar el auto-deploy.

Runbook: `docs/DEPLOYMENT.md` · Tareas: `docs/TASKS.md` · Reglas para agentes: `AGENTS.md`.

---

## 1. Cómo arrancar

```bash
git fetch origin
git checkout feat/scaffold-baseline
npm ci
npm run gen
npm run dev
```

Verificación:

```bash
npm run check    # typecheck + Biome + tests
npm run build    # tsc --noEmit + vite build
```

Node 22 (`.nvmrc`). No hay backend, base de datos ni variables de entorno.

---

## 2. Qué está hecho y verificado

### Scaffold

- Vite 8 + React 19 + TypeScript 5.9 + Tailwind 4 + Vitest 5 + Biome.
- `.nvmrc`, `vite.config.ts`, `tsconfig.json`, `biome.json`, `.dockerignore`.
- Dependencias de UI preparadas: Recharts, Motion, lucide-react, date-fns, clsx,
  tailwind-merge e Inter. Testing: jsdom + Testing Library.

### Dominio (`src/domain/`, cero imports de React)

- `types.ts` — contrato del motor, UI y coach.
- `baseline.ts` — media ± σ de los 14 días pre-vuelo.
- `rules.ts` — umbrales con fuente y flag `verified`; un solo archivo auditable.
- `levels.ts`, `escalation.ts` — niveles y escalado por latencia (ISS/Luna/Marte).
- `evaluate.ts` — 6 sistemas + halo, 3 correlaciones, 2 reglas de hueso, estimaciones y facts.
- `engine.test.ts` — tests de escenarios, correlaciones, escalado, hueso y facts.

### Datos

- `scripts/generate-mission.ts` → `src/data/scenarios/*.json`.
- 4 escenarios: `nominal`, `early-infection`, `cabin-co2`, `solar-event`.
- 14 días pre-vuelo + 30 de misión (días 119–148). RNG sembrado: el día 148 siempre es el mismo.
- `npm run gen` reproduce los JSON sin diff.

### Coach (`src/ai/`)

- `types.ts` — `CoachProvider`, `CoachSuggestion`, `CoachRequest`.
- `providers/template.ts` — coach determinista (default y fallback).
- `providers/llm.ts` — adapter para un modelo local inyectado (WebLLM, etc.).
- `guardrails.ts` — prohíbe diagnóstico/medicación, números no presentes en los facts y acciones
  no disparadas.
- `coach.ts` — `askCoach()` valida y cae al template si el modelo falla o alucina.
- Tests adversarios de alucinación incluidos.

### Deploy/CI

- `Dockerfile` multi-stage (Node 22 → nginx:alpine, puerto 80).
- `nginx.conf` con fallback SPA, cache de assets y healthcheck.
- `.github/workflows/ci.yml`: `npm ci`, `npm run gen` + diff, `npm run check`, `npm run build`.
- `docs/DEPLOYMENT.md`: Dokploy, Cloudflare, túnel, nginx, auto-deploy, verificación y rollback.

**Verificación actual:** `npm run check` verde, **21/21 tests**, `npm run build` OK.

---

## 3. Qué falta

| # | Tarea | Estimación | Zona |
|---|---|---|---|
| 1 | **UI Level 0**: App shell + DemoBar + Today + Body + Decision | 2–3 h | `src/App.tsx`, `src/screens/*`, `src/components/*`, `src/store/` |
| 2 | **Trends** con banda basal (nivel 1) | 1 h | `src/screens/Trends.tsx`, `src/components/charts/` |
| 3 | **Mission Control** (nivel 1) | 1–2 h | `src/screens/MissionControl.tsx` |
| 4 | **Provisión Dokploy + Cloudflare** y auto-deploy | 45–60 min | `docs/DEPLOYMENT.md` |
| 5 | Página del proyecto, README final, vídeo y slides | — | lane E |
| 6 | Nivel 2 opcional: Amsler, procedimientos, PWA offline | — | — |

La UI debe consumir `evaluate()` y `askCoach()`, **no reimplementar reglas**.

---

## 4. Bloqueos actuales

1. **Write en el repo**: la cuenta `Agupane` tiene solo READ en
   `kosmic-nasa-hackathon/orbi`. Hace falta que un admin dé write o que se pushee desde otra cuenta.
2. **GitHub App de Dokploy**: debe estar instalada en la org `kosmic-nasa-hackathon` para clonar el
   repo privado. Si no, el fallback es un fork en `Agupane/orbi` (temporal).
3. **Acceso a Dokploy/Cloudflare**: el panel está detrás de Cloudflare Access y desde la estación de
   trabajo no se llega a la LAN. Para provisionar hace falta API key + acceso, o ejecutar los
   comandos del runbook desde la VM/LAN.
4. **Runner self-hosted** (solo si no se usa la GitHub App): el runner 100 ya tiene 6; sería el
   séptimo. Requiere registrar el runner y cargar `DOKPLOY_TOKEN`.

---

## 5. Decisiones tomadas (y cambios de esta sesión)

- **Coach local**: se mantiene como capa de explicación opcional, nunca de decisión. El template
  determinista es el default y el fallback; los guardrails ya están testeados.
- **Hueso**: se corrigió la regla para que CONCERN exija baja adherencia **y** misión > 6 meses;
  antes se disparaba siempre a partir del día 180.
- **Fuentes**: solo `bone` y `ada` quedan `verified: true`; el resto se marca `false` con nota
  `TODO verify` (incluido el límite de 600 mSv). Es deliberado y se explica en el pitch.
- **Contrato**: el canónico es `src/domain/types.ts`; `CONCEPTO-ORBI.md §8` se actualiza para no
  duplicar tipos.
- **Datos demo**: los escenarios usan un presupuesto de radiación de 400 mSv para que el halo sea
  legible; 600 mSv sigue siendo la referencia del límite de carrera de NASA.
- **Deploy**: Dokploy BCN + GitHub App + `autoDeploy` en `main`; sin previews por PR.

---

## 6. Próximas 3 acciones

1. **Desbloquear write/admin** y provisionar `ORBI` en Dokploy + `orbi.agustinpane.xyz` en
   Cloudflare (ver `docs/DEPLOYMENT.md`).
2. **UI Level 0**: reemplazar la consola por App shell + DemoBar + Today + Body + Decision,
   conectando `evaluate()` y `askCoach()`.
3. **Verificar el auto-deploy**: push de prueba a `main` → CI verde → deploy → URL 200.

---

## 7. Reparto

Ver `docs/TASKS.md`. Resumen: 5 lanes (A motor/datos, B Body/Trends, C Today/Decision,
D Coach/Mission Control, E diseño/pitch) + integración/deploy de Andrea/Agustín.

Contratos que no se tocan sin avisar: `src/domain/types.ts`, `src/ai/types.ts`,
`src/content/systems.ts` y la forma de los JSON.

---

## 8. Branch y PR

```
feat/scaffold-baseline -> origin/feat/scaffold-baseline
```

PR: https://github.com/kosmic-nasa-hackathon/orbi/pull/new/feat/scaffold-baseline
