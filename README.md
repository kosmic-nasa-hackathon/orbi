# ORBI

> *From drift to decision.* Health autonomy console for astronauts on long-duration missions · NASA Space Apps Challenge 2026

**Reto:** [Create Health Monitoring Software for Astronauts on Space Missions](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/)
**Equipo:** Kosmic

ORBI es una app de tablet para astronautas. El reloj y la camiseta biométrica ya traen los datos, y en un check-in diario de 90 segundos el astronauta los confirma. ORBI los convierte en una lectura del cuerpo (6 sistemas + un halo de radiación), una decisión de triaje explicada y un plan de acción, con un escalado que se adapta al retraso de comunicación con la Tierra.

## Documentación

| Documento | Para qué |
|---|---|
| **[docs/BRIEF.md](docs/BRIEF.md)** | **Empieza por aquí.** El proyecto en 2 minutos, los niveles de alcance y los bloques de trabajo |
| [docs/CONCEPTO-ORBI.md](docs/CONCEPTO-ORBI.md) | Concepto completo: uso en la nave, reglas, escenarios, contrato de tipos, guion de demo |
| [docs/STACK.md](docs/STACK.md) | Stack técnico, comandos de instalación, estructura de carpetas, CI y riesgos |
| [docs/TASKS.md](docs/TASKS.md) | Reparto por lanes, primeros PRs y criterios de aceptación |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Runbook de Dokploy + Cloudflare y auto-deploy |
| [docs/recursos/](docs/recursos/README.md) | Resúmenes de los recursos oficiales de NASA y CSA, y cómo los usamos |
| **[HANDOFF.md](HANDOFF.md)** | Estado actual, bloqueos y próximas acciones |
| [AGENTS.md](AGENTS.md) · [CLAUDE.md](CLAUDE.md) | Reglas para agentes de código (OpenCode, Claude Code, Codex) |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Setup, ramas, PRs y commits |

## Estado

- ✅ Concepto, stack y recursos documentados
- ✅ Scaffold Vite + React 19 + TS + Tailwind + Vitest
- ✅ Motor de dominio (`src/domain/`) y datos deterministas
- ✅ Coach determinista + adapter local opcional (`src/ai/`)
- ✅ Dockerfile, nginx y CI
- ✅ Desplegado en **https://orbi.agustinpane.xyz** con auto-deploy en `main`
- ⏳ UI de Today/Body/Decision

## Desarrollo

```bash
nvm use            # Node 22
npm ci
npm run gen        # regenera los escenarios deterministas
npm run dev        # Vite
npm run check      # typecheck + Biome + tests
npm run build      # build de producción en dist/
```

## Deploy

Producción: **https://orbi.agustinpane.xyz** (Dokploy BCN, Cloudflare delante).
El build usa el `Dockerfile` de la raíz y se publica con auto-deploy en `main`.
Detalle y troubleshooting: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Fechas clave

| Hito | Cuándo |
|---|---|
| Nivel 0 (núcleo) funcionando en la URL | Sábado por la tarde |
| Código congelado | **Domingo 12:00** |
| Envío del proyecto | **Domingo 14:00** (plazo oficial: 16:00) |

## Cómo trabajamos

- Una rama por bloque y PR pequeños hacia `main`. La integradora (Andrea) revisa y mergea.
- El contrato entre bloques es `src/domain/types.ts`: **no se cambia sin avisar a todo el equipo.**
- UI, README final y entrega **en inglés**; la documentación interna, en español.
- Antes de cada PR: `npm run check` y `npm run build`.
