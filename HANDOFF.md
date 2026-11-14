# HANDOFF — ORBI

**Fecha:** 2026-11-14
**Rama:** `main`
**Estado:** scaffold, motor, coach, CI, deploy, auto-deploy, demo EVA con pérdida de sync y retorno inercial, y pitch navegable en `/pitch/`.
**Falta:** UI de las pantallas (Today/Body/Decision), Trends/Mission Control, ensayo y vídeo del pitch.

Runbook: `docs/DEPLOYMENT.md` · Tareas: `docs/TASKS.md` · Reglas para agentes: `AGENTS.md`.

Producción: **https://orbi.agustinpane.xyz** · App Dokploy `ORBI`
(`pnNCsfPVhaq6_lgsFDTEF`) · `appName` `app-input-open-source-panel-hqyoop`.

---

## 1. Cómo arrancar

```bash
git fetch origin
git checkout main
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

### EVA demo (`src/simulation/eva.ts`, `src/screens/Eva.tsx`)

- Simulación 2D determinista: posición real, estimación inercial, deriva, cola de eventos y retorno a la esclusa.
- Vista dividida Traje/Central: la central congela la última posición conocida cuando se pierde el sync.
- Animaciones de sync perdido/recuperado, cono de deriva, línea de retorno y audit log autónomo.
- Controles de demo: auto timeline, perder sync, reconectar, auto-return, 1x/2x/4x, pausa y reset.
- La salud sale de `evaluate()` (early-infection, día 148, MARS); no se reimplementan reglas.
- La demo abre por defecto; la consola del motor queda en `?view=console`.
- Deep links de demo: `/` (inicio), `/?t=18` (sin sync), `/?t=24` (retorno inercial activo).

### Pitch (`public/pitch/`, `docs/PITCH.md`)

- Deck estático en **`/pitch/`**: 15 slides, notas del orador (`S`), overview (`G`), fullscreen
  (`F`), print a PDF (`P`) y modo lectura en `?view=scroll`.
- Contenido en `public/pitch/deck.json`; motor y estilos propios en `deck.js` y `theme.css`.
- Sin dependencias externas ni backend: Vite copia `public/pitch/` a `dist/` y nginx sirve el
  directorio. La CSP existente (`script-src 'self'`) se respeta.
- `vite.config.ts` reescribe `/pitch/` a `/pitch/index.html` en dev y preview para que la URL sea
  la misma que en producción.
- Guion, atajos y checklist de ensayo en `docs/PITCH.md`.

### Deploy/CI

- `Dockerfile` multi-stage (Node 22 → nginx:alpine, puerto 80).
- `nginx.conf` con fallback SPA, cache de assets y healthcheck.
- `.github/workflows/ci.yml`: `npm ci`, `npm run gen` + diff, `npm run check`, `npm run build`.
- `.github/workflows/deploy.yml`: auto-deploy activo tras CI en `main`, en un runner self-hosted.
- Producción verificada: **https://orbi.agustinpane.xyz** responde `200`.
- Dokploy: app `ORBI`, `appName` `app-input-open-source-panel-hqyoop`, origen Git SSH con deploy key
  `orbi-deploy`, dominio HTTP detrás de Cloudflare.
- Runner: `dokploy` en la VM de Dokploy, label `orbi`, servicio `actions-runner-orbi.service`.
- Repo: secret `DOKPLOY_TOKEN`, variable `DOKPLOY_AUTO_DEPLOY=true`.
- `docs/DEPLOYMENT.md`: Dokploy, Cloudflare, túnel, nginx, auto-deploy, verificación y rollback.

**Verificación actual:** `npm run check` verde, **32/32 tests**, `npm run build` OK. El deploy
automático se probó con `workflow_dispatch` y con un push real a `main`; ambos terminaron en `done`.

---

## 3. Qué falta

| # | Tarea | Estimación | Zona |
|---|---|---|---|
| 1 | **UI Level 0**: App shell + DemoBar + Today + Body + Decision | 2–3 h | `src/App.tsx`, `src/screens/*`, `src/components/*`, `src/store/` |
| 2 | **Trends** con banda basal (nivel 1) | 1 h | `src/screens/Trends.tsx`, `src/components/charts/` |
| 3 | **Mission Control** (nivel 1) | 1–2 h | `src/screens/MissionControl.tsx` |
| 4 | Página del proyecto, README final, vídeo y slides | — | lane E |
| 5 | Nivel 2 opcional: Amsler, procedimientos, PWA offline | — | — |

La UI debe consumir `evaluate()` y `askCoach()`, **no reimplementar reglas**.

---

## 4. Bloqueos actuales

No hay bloqueos de infraestructura: el repo tiene write, el deploy está en producción y el
auto-deploy funciona. Pendiente de producto: UI, Trends/Mission Control y material de pitch.

Notas de infraestructura:

- La org tiene deploy keys habilitadas (`deploy_keys_enabled_for_repositories=true`).
- El origen de Dokploy es Git SSH (`git@github.com:kosmic-nasa-hackathon/orbi.git`) con la deploy key
  `orbi-deploy`; no usa la GitHub App.
- El token webhook de Dokploy está detrás de Cloudflare Access, por eso el deploy corre desde el
  runner self-hosted de la LAN y no desde un runner GitHub-hosted.
- Rotar la deploy key o el `DOKPLOY_TOKEN` si se comparten fuera de la infra.

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
- **Deploy**: Dokploy BCN + origen Git SSH con deploy key + runner self-hosted para el auto-deploy.
  Sin previews por PR. La GitHub App de Dokploy queda como alternativa si se instala en la org.

---

## 6. Próximas 3 acciones

1. **Verificar la demo EVA en la URL**: push a `main` → CI → deploy → abrir la raíz y `?view=console`.
2. **UI Level 0**: App shell + DemoBar + Today + Body + Decision, conectando `evaluate()` y `askCoach()`.
3. **Trends + Mission Control** cuando el nivel 0 ya esté en la URL; después, material de pitch.

---

## 7. Reparto

Ver `docs/TASKS.md`. Resumen: 5 lanes (A motor/datos, B Body/Trends, C Today/Decision,
D Coach/Mission Control, E diseño/pitch) + integración/deploy de Andrea/Agustín.

Contratos que no se tocan sin avisar: `src/domain/types.ts`, `src/ai/types.ts`,
`src/content/systems.ts` y la forma de los JSON.

---

## 8. Branch y PR

Todo está en `main`. PRs integrados:

- #1 Scaffold, engine, coach and deployment baseline.
- #2 ci: add gated Dokploy auto-deploy fallback.

Repositorio: https://github.com/kosmic-nasa-hackathon/orbi
