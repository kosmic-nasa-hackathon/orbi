# HANDOFF — ORBI

**Fecha:** 2026-11-14
**Rama:** `main`
**Estado:** motor, datos, coach, tests, Home, EVA, consola, pitch y deploy funcionando en producción.
**Falta:** ejecutar las lanes de `docs/PLAN.md`: tema light, rediseño, Nivel 0, Trends/Mission Control, extras y entrega.
**Plan de ejecución paralela:** `docs/PLAN.md`
**Producción:** **https://orbi.agustinpane.xyz** · App Dokploy `ORBI`
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

## 2. Estado actual (verificado)

- Motor determinista con 6 sistemas + halo, 3 correlaciones, reglas de hueso y estimaciones.
- 4 escenarios deterministas; `npm run gen` reproduce los JSON sin diff.
- Coach template (default y fallback) + adapter local opcional + guardrails.
- Home `/`, demo EVA `?view=eva`, consola `?view=console` y pitch `/pitch/`.
- Nav sticky con iconos, rutas por query y back/forward.
- CI, Docker, nginx, Dokploy, Cloudflare y auto-deploy funcionando.
- **36/36 tests**; `npm run check` y `npm run build` verdes.
- Producción responde `200` en `/`, `?view=eva`, `?view=console` y `/pitch/`.

**Caveat conocido:** Cloudflare inyecta un script inline de challenge que la CSP bloquea. Es
externo a la app; no relajar `script-src 'self'`.

---

## 3. Lo que falta

El detalle, archivos permitidos y criterios de aceptación están en `docs/PLAN.md`.

| Wave | Lane | Estado |
|---|---|---|
| 0 | P0 · Pitch light + motion | todo |
| 0 | P1 · Threshold audit | todo |
| 0 | P2 · Submission groundwork | todo |
| 1 | F0 · Fundación (tema light, switch, tokens, UI, motion, nav, store) | todo |
| 2 | A · Today | todo |
| 2 | B · Body | todo |
| 2 | C · Decision | todo |
| 2 | D · Trends | todo |
| 2 | E · Visual polish (menos densidad, más animaciones) | todo |
| 3 | F · Mission Control | todo |
| 3 | G · Level 2 (Amsler, procedimientos, PWA) | todo |
| 3 | H · Integración/QA | todo |
| 4 | I · Submission final | todo |

**Regla:** no se empieza Trends ni Mission Control hasta que Today + Body + Decision estén en la
URL desplegada.

---

## 4. Bloqueos y riesgos

No hay bloqueos de infraestructura: el repo tiene write, el deploy está en producción y el
auto-deploy funciona.

Riesgos conocidos:

- **Umbrales sin verificar:** 5 fuentes siguen `verified: false` con nota `TODO verify`. Es
  deliberado; no inventar números. Lo cubre P1.
- **Tema light:** el refactor toca todas las pantallas; usar tokens y screenshots dark/light.
- **Conflictos en paralelo:** los archivos compartidos los toca solo F0/Integración.
- **PWA/service worker:** puede romper la caché; va al final y feature-flagged.
- **Cloudflare + CSP:** el script inline de challenge queda bloqueado; no afecta la app.

Infraestructura:

- La org tiene deploy keys habilitadas (`deploy_keys_enabled_for_repositories=true`).
- El origen de Dokploy es Git SSH (`git@github.com:kosmic-nasa-hackathon/orbi.git`) con la deploy key
  `orbi-deploy`; no usa la GitHub App.
- El token webhook de Dokploy está detrás de Cloudflare Access, por eso el deploy corre desde el
  runner self-hosted de la LAN y no desde un runner GitHub-hosted.
- Rotar la deploy key o el `DOKPLOY_TOKEN` si se comparten fuera de la infra.

---

## 5. Contratos y archivos compartidos

**Contratos congelados** (no cambiar sin avisar):

- `src/domain/types.ts`
- `src/ai/types.ts`
- `src/content/systems.ts`
- La forma de los JSON de escenarios

**Solo F0/Integración:**

- `src/App.tsx`, `src/navigation.ts`, `src/components/SiteNav.tsx`, `src/index.css`,
  `src/main.tsx`, `index.html`, `package.json`, `package-lock.json`, `vite.config.ts`,
  `nginx.conf`, `.github/*` y la tabla de estado de `docs/PLAN.md`.

**Regla de UI:** consumir `evaluate()` y `askCoach()`; nunca reimplementar reglas clínicas.
Cada estado usa color + icono + texto.

---

## 6. Decisiones de esta fase

- **Coach local:** capa de explicación opcional, nunca de decisión. Template determinista por
  defecto y fallback.
- **Hueso:** CONCERN exige baja adherencia **y** misión > 6 meses.
- **Fuentes:** solo `bone` y `ada` verificadas; el resto queda `false` con `TODO verify`.
- **Datos demo:** presupuesto de radiación de 400 mSv para que el halo sea legible; 600 mSv sigue
  siendo la referencia del límite de carrera.
- **Tema:** sistema + `localStorage`, fallback dark. Light en app y pitch.
- **Paralelización:** worktrees + agentes CLI; Fundación e integración a cargo del integrador.
- **Vídeo:** guion + auto-grabación con Playwright, sin commitear el binario.

---

## 7. Próxima acción

1. Lanzar Wave 0 en paralelo: P0 (pitch light + motion), P1 (threshold audit) y P2 (submission
   groundwork).
2. Ejecutar F0 (Fundación) y mergearla.
3. Abrir A/B/C/D/E en paralelo contra F0.
4. Después de C, abrir F (Mission Control); después de A/B/C, abrir G (Level 2).
5. Integrar todo en H y cerrar I.

---

## 8. Reparto paralelo

| Lane | Rama | Zona principal |
|---|---|---|
| P0 · Pitch light + motion | `pitch/light-motion` | `public/pitch/*` |
| P1 · Threshold audit | `engine/threshold-audit` | `src/domain/rules.ts`, tests |
| P2 · Submission groundwork | `docs/submission` | `docs/DEMO.md`, README, formulario |
| F0 · Fundación | `design/theme-foundation` | tema, tokens, UI, nav, store |
| A · Today | `today/checkin` | `src/screens/Today.tsx`, DemoBar, store |
| B · Body | `body/map` | `src/screens/Body.tsx`, `components/body/` |
| C · Decision | `decision/triage` | `src/screens/Decision.tsx`, `components/decision/` |
| D · Trends | `trends/charts` | `src/screens/Trends.tsx`, `components/charts/` |
| E · Visual polish | `design/motion-polish` | Home, EVA, Console |
| F · Mission Control | `mission-control/window` | `src/screens/MissionControl.tsx` |
| G · Level 2 | `level2/extras` | Amsler, procedimientos, PWA |
| H · Integración/QA | `integration/level0` | rutas, tests, deploy |
| I · Submission final | `docs/submission` | vídeo, README, formulario |

---

## 9. PRs y ramas

Todo lo integrado está en `main`.

- #1 Scaffold, engine, coach and deployment baseline.
- #2 ci: add gated Dokploy auto-deploy fallback.
- #3 feat: add navigable pitch deck at `/pitch/`.
- #4 feat: add product home with icon navigation and landing.

Repositorio: https://github.com/kosmic-nasa-hackathon/orbi
