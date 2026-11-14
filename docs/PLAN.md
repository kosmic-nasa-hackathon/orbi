# PLAN — ORBI

Plan vivo para ejecutar lo que falta en paralelo con varios agentes.
El estado actual y los bloqueos están en `HANDOFF.md`; el producto, en `docs/BRIEF.md` y
`docs/CONCEPTO-ORBI.md`.

**Fecha:** 2026-11-14
**Base:** `main`
**Estado:** motor, datos, coach, Home, EVA, consola, pitch, deploy y documentación del giro de
producto (salud de la mujer + entrenamiento en tierra) listos. El código sigue con basal de 14
días, 3 correlaciones y 4 escenarios; el objetivo documentado es basal de 90 días, 4 correlaciones
y 5 escenarios (lo cierra P3). Falta el producto interactivo (Nivel 0), Trends/Mission Control,
tema light, rediseño y entrega.

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

- **Código actual:** motor determinista con 6 sistemas + halo, 3 correlaciones, basal de 14 días,
  4 escenarios, coach template + adapter local opcional + guardrails.
- **Objetivo documentado:** basal de 90 días de entrenamiento en tierra, basal por fase del ciclo
  (opt-in y privada), 4 correlaciones y 5 escenarios. P3 cierra esta brecha.
- Home `/`, demo EVA `?view=eva`, consola `?view=console` y pitch `/pitch/`.
- Nav sticky, responsive, con iconos y rutas por query.
- CI, Docker, nginx, Dokploy, Cloudflare y auto-deploy.
- **36/36 tests**, `npm run check` y `npm run build` verdes; `npm run gen` reproducible.
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

### Ampliación de contrato propuesta (P3)

Pendiente de anunciar a todo el equipo antes de tocar `src/domain/types.ts`:

- `Phase`: `TRAINING | TRANSIT | SURFACE | RETURN`.
- `CrewProfile` con `sex`, `cycle`, `contraception` y `shareReproductiveWithGround`.
- `DailyReading.phase/menses/cycleDay`, `Scenario.crew/trainingDays` y
  `evaluate(..., { cycleAware })`.
- Detalle en `docs/CONCEPTO-ORBI.md` §8. **No está aplicada al código hasta que P3 se mergee.**

**Archivos de P3:** `src/domain/baseline.ts`, `src/domain/evaluate.ts`, `src/domain/rules.ts`,
tests de dominio, `scripts/generate-mission.ts` y `src/data/scenarios/*.json`.

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

| Wave | Lane | Issue | Rama | Alcance | Depende de | Estado |
|---|---|---|---|---|---|---|
| 0 | **P0 · Pitch light + motion** | #8 | `pitch/light-motion` | Toggle de tema, tokens light y animaciones del deck | — | todo |
| 0 | **P1 · Threshold audit** | #9 | `engine/threshold-audit` | Revisión de umbrales, tests de límites, 600 mSv con fuente y aviso de `verified` | — | todo |
| 0 | **P2 · Submission groundwork** | #10 | `docs/submission` | `docs/DEMO.md`, storyboard, README final y formulario | — | todo |
| 1 | **F0 · Fundación** | #11 | `design/theme-foundation` | Tema dark/light, switch, tokens, tipografía, UI primitives, motion, nav/rutas y store skeleton | — | todo |
| 1 | **P3 · Engine: basal de tierra + ciclo** | #12 | `engine/cycle-baseline` | Contrato, basal de 90 días y por fase, `cycle-aware`, `luteal-phase`, 600 mSv y tests | P1 | todo |
| 2 | **A · Today** | #13 | `today/checkin` | Check-in 7 campos + ciclo opt-in, DemoBar, racha y Confirm | F0 + P3 | todo |
| 2 | **B · Body** | #14 | `body/map` | SVG 6 sistemas + halo, ficha, sparkline 30 días y banda basal de tierra | F0 + P3 | todo |
| 2 | **C · Decision** | #15 | `decision/triage` | Nivel, “Because…”, action card, escalado, coach y packet privado | F0 + P3 | todo |
| 2 | **E · Visual polish** | #16 | `design/motion-polish` | Rediseño de Home/EVA/Console, menos densidad y animaciones | F0 | todo |
| 3 | **D · Trends** | #18 | `trends/charts` | 30 días, selector de sistema, banda “Your ground baseline” y ciclo | F0 + P3 + gate Nivel 0 | todo |
| 3 | **F · Mission Control** | #19 | `mission-control/window` | `?view=ground`, BroadcastChannel, countdown y packet privado | F0 + C + P3 + gate Nivel 0 | todo |
| 3 | **G · Level 2** | #20 | `level2/extras` | Amsler, procedimientos, avisos de ciclo y PWA offline | F0 + A/B/C + P3 + gate Nivel 0 | todo |
| 3 | **H · Integración/QA** | #17 | `integration/level0` | Rutas/nav, conflictos, tests, screenshots, privacidad y deploy | A–G | todo |
| 4 | **I · Submission final** | #21 | `docs/submission` | Vídeo, README, formulario y ensayo | H | todo |

### Orden de merge

1. P0, P1 y P2 pueden ir en paralelo desde ya.
2. F0 y P3 (P3 espera a P1 por `rules.ts`; anunciar el contrato antes de empezar).
3. A, B, C y E en paralelo contra F0 + P3.
4. Checkpoint de Nivel 0 en H: integrar A/B/C y desplegar; eso desbloquea D, F y G.
5. F y G; después, cerrar H con la integración final.
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
- Incorporar `docs/recursos/08`: el límite de carrera de 600 mSv es único para todos los sexos y
  edades desde 2022; actualizar la fuente de radiación y retirar el `TODO verify`.
- Reconciliar `docs/recursos/06` con esa fuente.
- Dejar `TODO verify` donde siga faltando evidencia.
- Tests de límites exactos WATCH/CONCERN/URGENT y del caso hueso con buena adherencia.
- Aviso visible de umbrales pendientes en la UI (coordinarlo con E).

**Criterios de aceptación:**

- `npm run check` verde y `npm run gen` sin diff.
- Cada regla conserva `SourceRef`.
- Ningún número nuevo sin fuente.
- El conteo de fuentes pendientes queda documentado (hoy 6; tras verificar radiación, 5).

### P2 · Submission groundwork

**Objetivo:** preparar la entrega mientras se construye el producto.

**Archivos permitidos:** `docs/DEMO.md`, `docs/PITCH.md`, `README.md`, `docs/submission/*`.

**Entregables:**

- Guion de demo de 3 minutos alineado con `CONCEPTO-ORBI.md` §13, con el beat `luteal-phase` y
  “Train like you fly”.
- Storyboard del vídeo y lista de planos.
- README final en inglés (se completa al final).
- Borrador de respuestas del formulario y mapeo al jurado.
- Checklist de ensayo y plan B si falla la URL.
- Revisar que `docs/PITCH.md` y el deck reflejen el giro sin prometer como live lo que aún no está
  en `main`.

**Criterios de aceptación:**

- El guion usa la app real y no promete pantallas que no existen.
- Todos los links y comandos son verificables.
- Los conteos live (escenarios/correlaciones) son ciertos hasta que P3 esté desplegado.

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
- `orbiStore` skeleton con selectores de escenario/día/misión/racha y flag `cycleAware`.
- `App.tsx` con routing shell y placeholders de las pantallas nuevas.

**Criterios de aceptación:**

- Toggle visible, accesible, persiste y no produce flash.
- Dark y light con contraste AA en texto y estados.
- `prefers-reduced-motion` respetado.
- No se rompe ninguna ruta existente.

### P3 · Engine: basal de tierra + ciclo

**Objetivo:** implementar en el dominio puro la basal de 90 días, la basal por fase del ciclo
(opt-in y privada), la correlación `cycle-aware` y el escenario `luteal-phase`.

**Archivos permitidos:** `src/domain/types.ts` (contrato; anunciar antes), `src/domain/baseline.ts`,
`src/domain/evaluate.ts`, `src/domain/rules.ts`, `src/domain/*.test.ts`,
`scripts/generate-mission.ts` y `src/data/scenarios/*.json`.

**Entregables:**

- Anunciar la ampliación del contrato de §3 antes de tocar `types.ts`.
- `Phase`, `CrewProfile` y los campos de ciclo en `DailyReading`, `Scenario` y `evaluate()`.
- Basal de 90 días de entrenamiento (días −90 a −1) y, si `cycle === "tracked"`, basal por fase
  folicular/lútea; fallback de 14 lecturas para escenarios legacy.
- Generador: 90 días de entrenamiento + 30 de misión, ciclo 28 ± 2, regla días 1–5, fase lútea
  +0,4 °C ± 0,1 y +4 lpm ± 1.
- Escenario determinista `luteal-phase` (5 escenarios en total).
- Correlación `cycle-aware` → NOMINAL con explicación “Expected cycle variation, not infection”
  cuando la subida queda dentro de la fase, el sueño es normal y no se supera un umbral absoluto.
- Regla de seguridad: el ajuste solo afecta a reglas relativas; los umbrales absolutos no se
  relajan nunca.
- Packet privado: sin `menses`/`cycleDay` salvo `shareReproductiveWithGround`.
- `rules.ts`: radiación a `docs/recursos/08` (600 mSv único desde 2022) y `verified: true`.
- Tests de basal por fase, toggle on/off, fiebre real en fase lútea, privacidad y determinismo.
- `npm run gen` y commit de los JSON.

**Criterios de aceptación:**

- `npm run check` y `npm run build` verdes; `npm run gen` sin diff.
- 5 escenarios y 4 correlaciones disponibles desde el motor.
- La UI no reimplementa reglas clínicas.
- Día 148 fijo; sin aleatoriedad en runtime.

### A · Today

**Objetivo:** el check-in de 90 segundos.

**Archivos permitidos:** `src/screens/Today.tsx`, `src/components/DemoBar.tsx`,
`src/store/orbiStore.ts` (solo acciones de check-in), `src/screens/Today.test.tsx`.

**Entregables:**

- 4 campos prellenados “Synced from wearable”: sueño, FC, temperatura, SpO₂.
- 3 campos manuales: ánimo, fatiga, glucosa.
- Campo opt-in “period today? yes/no” solo si `cycle === "tracked"`; no cuenta como uno de los 7.
- Confirm actualiza el store, la racha y el estado del día.
- DemoBar: escenario, misión, Next day, Reset y toggle “Cycle-aware baseline”.
- El toggle escribe `cycleAware` en el store y llega a `evaluate()`.
- Estados vacío, confirmado y error.

**Criterios de aceptación:**

- No se teclean los campos automáticos.
- Cambiar de escenario/día actualiza los datos.
- Tests de prefill, edición manual, Confirm, Next day y toggle de ciclo.
- El campo de ciclo se oculta si `cycle` es `suppressed` o `n/a`.
- Dark/light y tablet 1180×820.

### B · Body

**Objetivo:** el mapa corporal interactivo.

**Archivos permitidos:** `src/screens/Body.tsx`, `src/components/body/*`,
`src/components/charts/Sparkline.tsx`, `src/screens/Body.test.tsx`.

**Entregables:**

- SVG con 6 sistemas + halo, color + icono + texto.
- Ficha al pulsar: estado, `why`, fuente y sparkline de 30 días con banda “Your ground baseline”.
- Hueso: estimación y adherencia al ejercicio.
- Halo: dosis vs presupuesto.
- Si el ciclo está activo, marcar la fase sin exponer datos reproductivos fuera de la tablet.
- Navegación por teclado y táctil.

**Criterios de aceptación:**

- Se entiende sin color.
- Tests de click/teclado, estado nominal y WATCH+.
- La banda basal usa la basal de P3, no una media hardcodeada.
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
- Caso `cycle-aware`: “Expected cycle variation, not infection” con el “Because…” cuando aplique.
- Packet privado: sin día de ciclo ni días de regla si `shareReproductiveWithGround === false`.

**Criterios de aceptación:**

- La UI solo muestra `Assessment`; no recalcula umbrales.
- Cambiar ISS/Luna/Marte cambia el escalado.
- Test de fallback del coach y de privacidad del packet.
- Dark/light.

### D · Trends

**Objetivo:** gráficas dinámicas con banda basal.

**Archivos permitidos:** `src/screens/Trends.tsx`, `src/components/charts/*`,
`src/domain/series.ts` (helper puro), tests.

**Entregables:**

- Selector de sistema.
- 30 días de lecturas con línea base y banda ±σ de “Your ground baseline”.
- Ciclo superpuesto si `cycle === "tracked"` y el toggle está activo; privado por defecto.
- Umbrales y nivel actual.
- Animación de dibujo del chart.

**Criterios de aceptación:**

- Usa `computeBaseline()` y `evaluate()`; no duplica reglas.
- Test del helper de series.
- Entrenamiento y misión se distinguen visualmente.
- Dark/light y responsive.
- **Gate:** no se mergea antes del checkpoint de Nivel 0 desplegado de H.

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
- Privacidad: sin día de ciclo ni días de regla si `shareReproductiveWithGround === false`.

**Criterios de aceptación:**

- Funciona con dos ventanas y sin backend.
- Test de countdown, mensajes y privacidad del packet.
- Dark/light.
- **Gate:** no se mergea antes del checkpoint de Nivel 0 desplegado de H.

### G · Level 2

**Objetivo:** extras si el Nivel 0 y 1 están en la URL.

**Archivos permitidos:** `src/screens/Amsler.tsx`, `src/screens/Procedures.tsx`,
`public/manifest.webmanifest`, `public/sw.js`, tests.

**Entregables:**

- Amsler grid (`?view=amsler`) con instrucciones y disclaimer.
- Procedimientos guiados: PA en microgravedad y test ortostático.
- Ecografía yugular guiada (caso de trombosis de 2019).
- Aviso de reserva de anticonceptivo si `cycle === "suppressed"`; nota de densidad ósea si `dmpa`.
- PWA offline feature-flagged: manifest, service worker y aviso de modo offline.

**Criterios de aceptación:**

- Amsler y procedimientos no diagnostican.
- El service worker no rompe el deploy ni la caché de assets.
- Los avisos de ciclo son informativos y no exponen datos reproductivos.
- Las rutas nuevas las integra H.
- **Gate:** no se mergea antes del checkpoint de Nivel 0 desplegado de H.

### H · Integración/QA

**Objetivo:** unir todo y dejarlo estable en producción.

**Archivos permitidos:** todos los compartidos de §3.

**Entregables:**

- Rutas y subnav finales.
- Resolución de conflictos entre lanes.
- **Checkpoint Nivel 0:** integrar A/B/C y desplegar; desbloquea D/F/G.
- Tests de humo de todas las rutas.
- Playwright: dark/light, 1440/1180/390, sin overflow.
- Verificar 5 escenarios, 4 correlaciones y privacidad del ciclo.
- `npm run check`, `npm run build`, `npm run gen` sin diff, nginx + CSP y deploy.
- Actualización de las tablas de estado de §4 y §10, y de `HANDOFF.md`.

**Criterios de aceptación:**

- CI verde y producción `200` en todas las rutas.
- Sin errores de consola propios.
- Screenshots finales dark/light.
- El packet de Mission Control no filtra datos reproductivos sin consentimiento.
- No queda drift entre docs y código en escenarios/correlaciones.

### I · Submission final

**Objetivo:** cerrar la entrega.

**Archivos permitidos:** `README.md`, `docs/DEMO.md`, `docs/submission/*`.

**Entregables:**

- Vídeo de demo (guion + auto-grabación con Playwright o grabación manual).
- README final en inglés con screenshots dark/light, arquitectura, fuentes y comandos.
- Formulario completo y mapeo al jurado.
- Ensayo cronometrado y plan B.
- El vídeo muestra el beat `luteal-phase`, “Train like you fly” y la privacidad del ciclo.

**Criterios de aceptación:**

- Todos los links funcionan.
- El vídeo muestra la app real.
- No se promete nada que no esté en la URL.
- Los conteos live coinciden con el código desplegado.

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
| Rutas | `/`, `?view=today`, `?view=body`, `?view=decision`, `?view=trends`, `?view=eva`, `?view=console`, `?view=ground`, `?view=amsler`, `/pitch/` |
| Deploy | nginx + CSP real y producción |

---

## 8. Riesgos

- **El tema toca todas las pantallas.** Mitigación: tokens y screenshots dark/light.
- **Colores de nivel en light.** Usar variantes accesibles, no los neones actuales.
- **Conflictos entre lanes.** Mitigación: contratos de §3 y un integrador.
- **Ampliación de contrato (P3).** Toca `types.ts`, JSON generados y tests; anunciar antes y no
  empezar hasta cerrar P1 para evitar conflictos en `rules.ts`.
- **Drift docs/código.** La documentación ya describe 90 días, 4 correlaciones y 5 escenarios, pero
  el código sigue en 14/3/4 hasta P3. `HANDOFF.md` debe mantener esa distinción visible.
- **Privacidad del ciclo.** El dato reproductivo es opt-in; ni el packet ni Mission Control lo
  exponen sin `shareReproductiveWithGround`.
- **PWA/service worker** puede romper la caché. Va al final y feature-flagged.
- **Vídeo pesado.** No commitear binarios grandes; enlazar o guardar fuera del repo.
- **Cloudflare inyecta un script inline** que la CSP bloquea. Es externo; no relajar la CSP.

---

## 9. Decisiones de esta fase

- Tema: sistema + `localStorage`, fallback dark.
- Light theme: app y pitch deck.
- Giro de producto: basal de 90 días de entrenamiento en tierra y basal por fase del ciclo
  (opt-in, privada, sin relajar umbrales absolutos); se implementa en P3.
- Nivel 2: Amsler, procedimientos y avisos de ciclo; PWA offline al final.
- Vídeo: guion + auto-grabación con Playwright, sin commitear el binario.
- Paralelización: worktrees + agentes CLI; Fundación e integración a cargo del integrador.

---

## 10. Estado de las lanes

Solo el integrador actualiza esta tabla.

| Lane | Issue | Rama | Estado | PR |
|---|---|---|---|---|
| P0 · Pitch light + motion | #8 | `pitch/light-motion` | todo | — |
| P1 · Threshold audit | #9 | `engine/threshold-audit` | todo | — |
| P2 · Submission groundwork | #10 | `docs/submission` | todo | — |
| F0 · Fundación | #11 | `design/theme-foundation` | todo | — |
| P3 · Engine: basal + ciclo | #12 | `engine/cycle-baseline` | todo | — |
| A · Today | #13 | `today/checkin` | todo | — |
| B · Body | #14 | `body/map` | todo | — |
| C · Decision | #15 | `decision/triage` | todo | — |
| E · Visual polish | #16 | `design/motion-polish` | todo | — |
| D · Trends | #18 | `trends/charts` | todo | — |
| F · Mission Control | #19 | `mission-control/window` | todo | — |
| G · Level 2 | #20 | `level2/extras` | todo | — |
| H · Integración/QA | #17 | `integration/level0` | todo | — |
| I · Submission final | #21 | `docs/submission` | todo | — |
