# PLAN — ORBI

Plan vivo para ejecutar lo que falta en paralelo con varios agentes.
El estado actual y los bloqueos están en `HANDOFF.md`; el producto, en `docs/BRIEF.md` y
`docs/CONCEPTO-ORBI.md`.

**Fecha:** 2026-11-14
**Base:** `main`
**Estado:** motor, datos, coach, Home, EVA, consola, pitch y deploy listos. Falta el producto
interactivo (Nivel 0), Trends/Mission Control, tema light, rediseño y entrega.

---

## 1. Cómo usar este documento

1. Leer `AGENTS.md`, `HANDOFF.md` y la sección de tu lane.
2. **Reclamar el issue de la lane** antes de escribir código: si no existe, crearlo; después
   `gh issue edit <n> --add-assignee @me` y comentar agente, rama y worktree. Si ya está asignado
   a otra persona, no empezar.
3. Trabajar **una lane por rama y, si se puede, por worktree**.
4. Tocar solo los archivos permitidos de la lane. Si necesitás un archivo compartido, pedirlo al
   integrador; no lo edites por tu cuenta.
5. Antes de abrir el PR: `npm run check` y `npm run build`.
6. PR con título `[lane-id] descripción corta`, `Closes #<n>`, screenshots dark/light y viewport
   tablet.
7. No cambiar contratos, datos generados, secretos ni configuración de deploy.
8. El integrador es el único que actualiza la tabla de estado de §4 y mergea a `main`.

### Regla de oro

**No se empieza Trends ni Mission Control hasta que Today + Body + Decision estén en la URL
desplegada.** Primero Nivel 0; después Nivel 1.

---

## 2. Estado actual

- Motor determinista, baseline, reglas, correlaciones, estimaciones y escalado.
- 4 escenarios deterministas y `npm run gen` reproducible.
- Coach template + adapter local opcional + guardrails.
- Home `/`, demo EVA `?view=eva`, consola `?view=console` y pitch `/pitch/`.
- Nav sticky, responsive, con iconos y rutas por query.
- CI, Docker, nginx, Dokploy, Cloudflare y auto-deploy.
- **36/36 tests**, `npm run check` y `npm run build` verdes.
- Producción: `/`, `?view=eva`, `?view=console` y `/pitch/` responden `200`.

Lo que falta está en las lanes de §4.

---

## 3. Contratos y archivos compartidos

### Contratos congelados

No cambiar sin anunciarlo a todo el equipo:

- `src/domain/types.ts`
- `src/ai/types.ts`
- `src/content/systems.ts`
- La forma de los JSON de `src/data/scenarios/*.json`

### Archivos de Fundación/Integración

Solo F0 y el integrador tocan estos archivos. Las demás lanes deben pedir cambios:

- `src/App.tsx`
- `src/navigation.ts`
- `src/components/SiteNav.tsx`
- `src/index.css`
- `src/main.tsx`
- `index.html`
- `package.json` / `package-lock.json`
- `vite.config.ts`
- `nginx.conf`
- `.github/*`
- `docs/PLAN.md` (tabla de estado)

### Reglas de UI

- Consumir `evaluate()` y `askCoach()`; nunca reimplementar reglas clínicas.
- Usar tokens semánticos (`surface`, `ink`, `muted`, `line`, `accent`, `nominal`, etc.).
- No hardcodear `#05070d`, `text-white/40` ni colores de nivel en las pantallas nuevas.
- Todo estado usa color + icono + texto.
- El tema light es ciudadano de primera: cada pantalla se verifica en dark y light.

---

## 4. Lanes

La columna **Estado** la actualiza solo el integrador.

| Wave | Lane | Rama | Alcance | Depende de | Estado |
|---|---|---|---|---|---|
| 0 | **P0 · Pitch light + motion** | `pitch/light-motion` | Toggle de tema, tokens light y animaciones del deck | — | todo |
| 0 | **P1 · Threshold audit** | `engine/threshold-audit` | Revisión de umbrales, tests de límites y aviso de `verified` | — | todo |
| 0 | **P2 · Submission groundwork** | `docs/submission` | `docs/DEMO.md`, storyboard, README final y formulario | — | todo |
| 1 | **F0 · Fundación** | `design/theme-foundation` | Tema dark/light, switch, tokens, tipografía, UI primitives, motion, nav/rutas y store skeleton | — | todo |
| 2 | **A · Today** | `today/checkin` | Check-in 7 campos, DemoBar, racha y Confirm | F0 | todo |
| 2 | **B · Body** | `body/map` | SVG 6 sistemas + halo, ficha, sparkline 30 días y banda basal | F0 | todo |
| 2 | **C · Decision** | `decision/triage` | Nivel, “Because…”, action card, escalado, coach y packet | F0 | todo |
| 2 | **D · Trends** | `trends/charts` | 30 días, selector de sistema, banda basal y umbrales | F0 | todo |
| 2 | **E · Visual polish** | `design/motion-polish` | Rediseño de Home/EVA/Console, menos densidad y animaciones | F0 | todo |
| 3 | **F · Mission Control** | `mission-control/window` | `?view=ground`, BroadcastChannel y countdown de latencia | F0 + C | todo |
| 3 | **G · Level 2** | `level2/extras` | Amsler, procedimientos y PWA offline | F0 + A/B/C | todo |
| 3 | **H · Integración/QA** | `integration/level0` | Rutas/nav, conflictos, tests, screenshots y deploy | A–G | todo |
| 4 | **I · Submission final** | `docs/submission` | Vídeo, README, formulario y ensayo | H | todo |

### Orden de merge

1. P0, P1 y P2 pueden ir en paralelo desde ya.
2. F0 (bloqueante).
3. A, B, C, D y E en paralelo.
4. F y G.
5. H (integración y QA).
6. I (entrega).

---

## 5. Detalle por lane

### P0 · Pitch light + motion

**Objetivo:** que `/pitch/` tenga tema light/dark y se sienta más vivo.

**Archivos permitidos:** `public/pitch/*`.

**Entregables:**

- Toggle Sun/Moon en el topbar del deck.
- `public/pitch/theme-init.js` para evitar flash; misma clave `orbi-theme` que la app.
- Tokens light/dark en `public/pitch/theme.css`.
- Animación de entrada por slide, progreso y transiciones suaves.
- Verificar que respeta la CSP (`script-src 'self'`) y funciona en `?view=scroll` y print.

**Criterios de aceptación:**

- Tema persiste al recargar y sigue el sistema si no hay preferencia.
- 15 slides, notas (`S`), overview (`G`) y print siguen funcionando.
- Sin errores de consola en producción (salvo el script de Cloudflare, que es externo).

### P1 · Threshold audit

**Objetivo:** cerrar la deuda de umbrales sin inventar números.

**Archivos permitidos:** `src/domain/rules.ts`, `src/domain/*.test.ts`, `docs/recursos/*` (lectura).

**Entregables:**

- Revisar cada `verified: false` contra `docs/recursos/`.
- Marcar `verified: true` solo con fuente primaria.
- Dejar `TODO verify` donde siga faltando evidencia.
- Tests de límites exactos WATCH/CONCERN/URGENT y del caso hueso con buena adherencia.
- Aviso visible de umbrales pendientes en la UI (coordinarlo con E).

**Criterios de aceptación:**

- `npm run check` verde y `npm run gen` sin diff.
- Cada regla conserva `SourceRef`.
- Ningún número nuevo sin fuente.

### P2 · Submission groundwork

**Objetivo:** preparar la entrega mientras se construye el producto.

**Archivos permitidos:** `docs/DEMO.md`, `docs/PITCH.md`, `README.md`, `docs/submission/*`.

**Entregables:**

- Guion de demo de 3 minutos alineado con `CONCEPTO-ORBI.md` §13.
- Storyboard del vídeo y lista de planos.
- README final en inglés (se completa al final).
- Borrador de respuestas del formulario y mapeo al jurado.
- Checklist de ensayo y plan B si falla la URL.

**Criterios de aceptación:**

- El guion usa la app real y no promete pantallas que no existen.
- Todos los links y comandos son verificables.

### F0 · Fundación

**Objetivo:** una base visual y de navegación para que el resto trabaje en paralelo.

**Archivos permitidos:** los compartidos de §3, más `src/theme/*`, `src/components/ui/*`,
`src/components/motion/*`, `src/store/orbiStore.ts`.

**Entregables:**

- `ThemeProvider` + `useTheme` + `ThemeToggle` (sistema + `localStorage`, fallback dark).
- `public/theme-init.js` y `meta theme-color` dinámico.
- Tokens dark/light: `canvas`, `surface`, `surface-strong`, `ink`, `muted`, `faint`, `line`,
  `accent`, `accent-soft`, `nominal/watch/concern/urgent` con variantes accesibles.
- Escala tipográfica: labels ≥ 11px, cuerpo 15–16px, títulos con saltos grandes.
- UI primitives: `Panel`, `Card`, `Badge`, `Button`, `Tabs`, `Metric`, `Reveal`.
- Motion primitives con `motion/react` y `useReducedMotion`.
- `View` extendido y subnav de misión: Today, Body, Decision, Trends, Mission Control.
- `orbiStore` skeleton con selectores de escenario/día/misión.
- `App.tsx` con routing shell y placeholders de las pantallas nuevas.

**Criterios de aceptación:**

- Toggle visible, accesible, persiste y no produce flash.
- Dark y light con contraste AA en texto y estados.
- `prefers-reduced-motion` respetado.
- No se rompe ninguna ruta existente.

### A · Today

**Objetivo:** el check-in de 90 segundos.

**Archivos permitidos:** `src/screens/Today.tsx`, `src/components/DemoBar.tsx`,
`src/store/orbiStore.ts` (solo acciones de check-in), `src/screens/Today.test.tsx`.

**Entregables:**

- 4 campos prellenados “Synced from wearable”: sueño, FC, temperatura, SpO₂.
- 3 campos manuales: ánimo, fatiga, glucosa.
- Confirm actualiza el store, la racha y el estado del día.
- DemoBar: escenario, misión, Next day, Reset.
- Estados vacío, confirmado y error.

**Criterios de aceptación:**

- No se teclean los campos automáticos.
- Cambiar de escenario/día actualiza los datos.
- Tests de prefill, edición manual, Confirm y Next day.
- Dark/light y tablet 1180×820.

### B · Body

**Objetivo:** el mapa corporal interactivo.

**Archivos permitidos:** `src/screens/Body.tsx`, `src/components/body/*`,
`src/components/charts/Sparkline.tsx`, `src/screens/Body.test.tsx`.

**Entregables:**

- SVG con 6 sistemas + halo, color + icono + texto.
- Ficha al pulsar: estado, `why`, fuente y sparkline de 30 días con banda basal.
- Hueso: estimación y adherencia al ejercicio.
- Halo: dosis vs presupuesto.
- Navegación por teclado y táctil.

**Criterios de aceptación:**

- Se entiende sin color.
- Tests de click/teclado, estado nominal y WATCH+.
- Dark/light y tablet.

### C · Decision

**Objetivo:** la pantalla de decisión explicada.

**Archivos permitidos:** `src/screens/Decision.tsx`, `src/components/decision/*`,
`src/screens/Decision.test.tsx`, acciones de packet en `src/store/orbiStore.ts`.

**Entregables:**

- Nivel, “Because…”, action card y escalado por latencia.
- Cambio de misión sin recargar.
- “Explain” con `askCoach()` y fallback template.
- “Send to flight surgeon” marca el packet para Mission Control.

**Criterios de aceptación:**

- La UI solo muestra `Assessment`; no recalcula umbrales.
- Cambiar ISS/Luna/Marte cambia el escalado.
- Test de fallback del coach.
- Dark/light.

### D · Trends

**Objetivo:** gráficas dinámicas con banda basal.

**Archivos permitidos:** `src/screens/Trends.tsx`, `src/components/charts/*`,
`src/domain/series.ts` (helper puro), tests.

**Entregables:**

- Selector de sistema.
- 30 días de lecturas con línea base y banda ±σ.
- Umbrales y nivel actual.
- Animación de dibujo del chart.

**Criterios de aceptación:**

- Usa `computeBaseline()` y `evaluate()`; no duplica reglas.
- Test del helper de series.
- Dark/light y responsive.

### E · Visual polish

**Objetivo:** que la app se vea más grande, moderna y menos cargada.

**Archivos permitidos:** `src/screens/Home.tsx`, `src/screens/Eva.tsx`,
`src/screens/Console.tsx`, `src/components/eva/*`, `src/components/ui/*` (consumo).

**Entregables:**

- Eliminar textos de 8–10px; mínimo 11–12px en labels.
- Menos densidad visible:
  - Home: menos métricas simultáneas y CTA principal a Today.
  - Console: tabs Overview / Assessments / Facts.
  - EVA: telemetría y audit log colapsables o en tabs.
- Animaciones: entrada escalonada, hover lift y transición entre vistas.
- Revisar jerarquía, espaciado y contraste en dark/light.

**Criterios de aceptación:**

- No hay overflow horizontal en 390px.
- `prefers-reduced-motion` funciona.
- Screenshots antes/después en 1440×900 y 1180×820.

### F · Mission Control

**Objetivo:** hacer tangible la latencia.

**Archivos permitidos:** `src/screens/MissionControl.tsx`,
`src/components/mission-control/*`, `src/lib/comms.ts`, tests.

**Entregables:**

- `?view=ground`.
- Split nave/tierra.
- `BroadcastChannel('orbi-comms')`.
- Countdown de 14 min acelerado.
- Paquete del cirujano y respuesta con la misma latencia.

**Criterios de aceptación:**

- Funciona con dos ventanas y sin backend.
- Test de countdown y mensajes.
- Dark/light.

### G · Level 2

**Objetivo:** extras si el Nivel 0 y 1 están en la URL.

**Archivos permitidos:** `src/screens/Amsler.tsx`, `src/screens/Procedures.tsx`,
`public/manifest.webmanifest`, `public/sw.js`, tests.

**Entregables:**

- Amsler grid (`?view=amsler`) con instrucciones y disclaimer.
- Procedimientos guiados: PA en microgravedad y test ortostático.
- PWA offline feature-flagged: manifest, service worker y aviso de modo offline.

**Criterios de aceptación:**

- Amsler y procedimientos no diagnostican.
- El service worker no rompe el deploy ni la caché de assets.
- Las rutas nuevas las integra H.

### H · Integración/QA

**Objetivo:** unir todo y dejarlo estable en producción.

**Archivos permitidos:** todos los compartidos de §3.

**Entregables:**

- Rutas y subnav finales.
- Resolución de conflictos entre lanes.
- Tests de humo de todas las rutas.
- Playwright: dark/light, 1440/1180/390, sin overflow.
- `npm run check`, `npm run build`, nginx + CSP y deploy.
- Actualización de la tabla de estado de este documento.

**Criterios de aceptación:**

- CI verde y producción `200` en todas las rutas.
- Sin errores de consola propios.
- Screenshots finales dark/light.

### I · Submission final

**Objetivo:** cerrar la entrega.

**Archivos permitidos:** `README.md`, `docs/DEMO.md`, `docs/submission/*`.

**Entregables:**

- Vídeo de demo (guion + auto-grabación con Playwright o grabación manual).
- README final en inglés con screenshots dark/light, arquitectura, fuentes y comandos.
- Formulario completo y mapeo al jurado.
- Ensayo cronometrado y plan B.

**Criterios de aceptación:**

- Todos los links funcionan.
- El vídeo muestra la app real.
- No se promete nada que no esté en la URL.

---

## 6. Paralelización con worktrees

Ejemplo de arranque:

```bash
git fetch origin
git switch main

git worktree add ../orbi-foundation design/theme-foundation
git worktree add ../orbi-today today/checkin
git worktree add ../orbi-body body/map
git worktree add ../orbi-decision decision/triage
git worktree add ../orbi-trends trends/charts
git worktree add ../orbi-polish design/motion-polish

# En cada worktree:
npm ci
npm run dev -- --port 53xx
```

Puertos sugeridos: 5310 fundación, 5311 today, 5312 body, 5313 decision, 5314 trends, 5315
polish, 5316 mission-control, 5317 pitch.

Reglas:

- Un agente por worktree.
- No compartir `node_modules` entre worktrees salvo que se acuerde.
- Rebase frecuente sobre `main`.
- Si dos lanes necesitan el mismo componente, el integrador lo mueve a `src/components/ui/`.

---

## 7. Verificación global

```bash
npm run check
npm run build
```

Matriz mínima:

| Qué | Cómo |
|---|---|
| Temas | Dark y light en todas las rutas |
| Viewports | 1440×900, 1180×820, 390×844 |
| Overflow | `scrollWidth === innerWidth` |
| Accesibilidad | Foco visible, teclado, contraste AA |
| Movimiento | `prefers-reduced-motion` |
| Rutas | `/`, `?view=today`, `?view=body`, `?view=decision`, `?view=trends`, `?view=eva`, `?view=console`, `?view=ground`, `/pitch/` |
| Deploy | nginx + CSP real y producción |

---

## 8. Riesgos

- **El tema toca todas las pantallas.** Mitigación: tokens y screenshots dark/light.
- **Colores de nivel en light.** Usar variantes accesibles, no los neones actuales.
- **Conflictos entre lanes.** Mitigación: contratos de §3 y un integrador.
- **PWA/service worker** puede romper la caché. Va al final y feature-flagged.
- **Vídeo pesado.** No commitear binarios grandes; enlazar o guardar fuera del repo.
- **Cloudflare inyecta un script inline** que la CSP bloquea. Es externo; no relajar la CSP.

---

## 9. Decisiones de esta fase

- Tema: sistema + `localStorage`, fallback dark.
- Light theme: app y pitch deck.
- Nivel 2: Amsler y procedimientos; PWA offline al final.
- Vídeo: guion + auto-grabación con Playwright, sin commitear el binario.
- Paralelización: worktrees + agentes CLI; Fundación e integración a cargo del integrador.

---

## 10. Estado de las lanes

Solo el integrador actualiza esta tabla.

| Lane | Rama | Estado | PR |
|---|---|---|---|
| P0 · Pitch light + motion | `pitch/light-motion` | todo | — |
| P1 · Threshold audit | `engine/threshold-audit` | todo | — |
| P2 · Submission groundwork | `docs/submission` | todo | — |
| F0 · Fundación | `design/theme-foundation` | todo | — |
| A · Today | `today/checkin` | todo | — |
| B · Body | `body/map` | todo | — |
| C · Decision | `decision/triage` | todo | — |
| D · Trends | `trends/charts` | todo | — |
| E · Visual polish | `design/motion-polish` | todo | — |
| F · Mission Control | `mission-control/window` | todo | — |
| G · Level 2 | `level2/extras` | todo | — |
| H · Integración/QA | `integration/level0` | todo | — |
| I · Submission final | `docs/submission` | todo | — |
