# TASKS — ORBI (histórico)

Este documento conserva los briefs originales por lane como contexto de producto.
El plan vivo, las ramas y el reparto paralelo están en **[`docs/PLAN.md`](PLAN.md)**.
El roster, owner/support y onboarding están en **[`docs/TEAM.md`](TEAM.md)**.
El estado actual y los bloqueos están en `HANDOFF.md`; el deploy, en `docs/DEPLOYMENT.md`.

**No usar este archivo para coordinar el trabajo actual.** Las lanes, waves y criterios de
aceptación vigentes están en `docs/PLAN.md`.

Los conteos de este documento (14 días de basal, 3 correlaciones, 4 escenarios) son históricos.
El objetivo documentado actual es basal de 90 días de entrenamiento en tierra, 4 correlaciones,
5 escenarios y basal por fase del ciclo (P3 en `docs/PLAN.md`).

## Reparto (5 personas)

| Lane | Dueño/a | Rama | Primer PR |
|---|---|---|---|
| A · Motor + datos | _(nombre)_ | `engine/…` | `engine/threshold-audit` |
| B · Body + Trends | _(nombre)_ | `body/…` | `body/skeleton` |
| C · Today + Decision | _(nombre)_ | `today/…` | `today/checkin` |
| D · Coach + Mission Control | _(nombre)_ | `ai/…` o `mission-control/…` | `ai/coach-panel` |
| E · Diseño + pitch | _(nombre)_ | `design/…` | `design/tokens` |
| Integración + deploy | Andrea / Agustín | `main`, `deploy/…` | — |

Los nombres se completan en la primera reunión. Mientras tanto, cada lane puede avanzar
contra los contratos ya congelados.

## Regla de niveles

**No se empieza el nivel 1 hasta que Today + Body + Decision funcionen en la URL desplegada.**
El orden es: nivel 0 → deploy → nivel 1 → extras.

## Lane A · Motor + datos

Zona: `src/domain/`, `src/data/`, `scripts/`, `src/domain/*.test.ts`.

Hecho: contrato, baseline, reglas simples, correlaciones, hueso, estimaciones, escalado,
evaluación, datos y tests.

Primer PR (`engine/threshold-audit`):

- Revisar cada umbral de `src/domain/rules.ts` contra `docs/recursos/` y marcar `verified`
  solo cuando haya fuente primaria. Los que no, quedan `false` y con nota `TODO verify`.
- Añadir tests para los límites exactos (WATCH/CONCERN/URGENT) y para el caso de hueso con
  buena adherencia en misión larga.
- Revisar que `evaluate()` no dependa de la UI y que `npm run gen` no cambie los JSON.

Criterios de aceptación:

- `npm run check` verde y sin cambios en los JSON generados.
- Cada regla tiene `SourceRef`; los no verificados son visibles para la UI.
- No hay imports de React/DOM en `src/domain/`.

## Lane B · Body + Trends

Zona: `src/components/body/`, `src/components/charts/`, `src/screens/Body.tsx`,
`src/screens/Trends.tsx`.

Primer PR (`body/skeleton`):

- `BodyMap` SVG con las 6 zonas + halo, colores desde `LEVEL_COLOR`/`LEVEL_BG`, icono y texto
  por estado (nunca solo color).
- Ficha de sistema al pulsar: estado, `why`, fuente, sparkline de 30 días con banda basal.
- Datos desde `evaluate(scenario, day, mission)`; no recalcular reglas.

Criterios:

- Funciona a 1180 × 820 (tablet) y con teclado/táctil.
- Si un sistema está en WATCH+ se entiende sin color.
- Tests de componente para la ficha y el estado vacío.

## Lane C · Today + Decision

Zona: `src/screens/Today.tsx`, `src/screens/Decision.tsx`, `src/components/DemoBar.tsx`,
`src/store/orbiStore.ts`.

Primer PR (`today/checkin`):

- Check-in de 7 campos con etiquetas “Synced from wearable” / “Manual”.
- Racha y estado general; `Confirm` actualiza el store y el día.
- DemoBar: escenario, misión ISS/Moon/Mars, “Next day ▶”, Reset.
- Decision: nivel, “Because…”, action card y escalado por latencia.

Criterios:

- 90 segundos de check-in, sin teclear los campos automáticos.
- El cambio de misión cambia el escalado sin recargar.
- La UI no reimplementa umbrales: solo muestra `Assessment`.

## Lane D · Coach + Mission Control

Zona: `src/ai/`, `src/screens/MissionControl.tsx`, `src/components/decision/`.

Primer PR (`ai/coach-panel`):

- Conectar el coach determinista a la UI (badge “On-device”, botón “Explain”).
- Feature flag para el adapter local: si no hay WebGPU/modelo, template y mensaje claro.
- No bloquear la UI mientras “piensa”.

### Demo EVA (adelanto del lane D)

Hecho: `src/simulation/eva.ts`, `src/screens/Eva.tsx`, mapa Traje/Central, sync loss,
retorno inercial, audit log y controles de demo. La raíz abre la demo; la consola del motor
queda en `?view=console`.

Segundo PR (`mission-control/window`):

- Ventana `?view=ground` con `BroadcastChannel('orbi-comms')` y cuenta atrás de latencia
  acelerada en demo (14 min).
- Paquete del cirujano y respuesta con la misma latencia.

Criterios:

- 0 violaciones de guardrails en los 4 escenarios.
- La app se comporta igual que el template si el modelo falla.
- Mission Control no necesita backend.

## Lane E · Diseño + pitch

Zona: `docs/`, `public/`, página del proyecto, vídeo y slides.

Primer PR (`design/tokens`):

- Tokens visuales (color, tipografía, espaciado), estados y componentes base.
- Bocetos de Today/Body/Decision para que B y C no inventen layout.
- Textos “Why we ask” y “Why this matters” en inglés.

Criterios:

- Contraste y estados accesibles; color + icono + texto.
- Créditos de ilustraciones (Servier CC BY 4.0) visibles.
- Guion de demo alineado con `CONCEPTO-ORBI.md` §13.

## Integración + deploy

- CI en verde en cada PR; `main` solo por PR.
- ✅ Dokploy (`ORBI`) y Cloudflare (`orbi.agustinpane.xyz`) provisionados.
- ✅ Auto-deploy activo: push a `main` → CI → workflow `deploy` en runner self-hosted → Dokploy.
- Mantener `HANDOFF.md` y `docs/DEPLOYMENT.md` al día.

## Contratos

No cambiar sin avisar al equipo:

- `src/domain/types.ts`
- `src/ai/types.ts`
- `src/content/systems.ts`
- Forma de los JSON de escenarios

## Calendario

| Cuándo | Qué | Hecho cuando… |
|---|---|---|
| Viernes | Scaffold, motor, datos, CI, docs | `npm run check` verde; deploy provisionado |
| Sábado mañana | Onboarding, bocetos, B y C en paralelo | Body y Today muestran datos reales del motor |
| Sábado tarde | Decision + DemoBar + racha | Nivel 0 completo en la URL |
| Sábado noche | Trends + Mission Control (si hay 5) | Nivel 1 demostrable |
| Domingo 12:00 | Código congelado | Solo ensayo y envío |
| Domingo 14:00 | Envío | Formulario completo |

## Definition of done

- `npm run check` y `npm run build` pasan.
- El cambio se ve en la UI o en el motor, no solo en un test.
- Tests cubren la regla/correlación/estimación o el guardrail.
- UI en inglés, docs internos actualizados.
- Sin secretos ni deriva de datos generados.
- `HANDOFF.md` refleja el estado y la siguiente acción.
