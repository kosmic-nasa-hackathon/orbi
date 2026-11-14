# Contribuir a ORBI

Guía corta para el equipo. El contrato técnico está en `AGENTS.md`; el reparto y onboarding, en
`docs/TEAM.md`; las lanes, en `docs/PLAN.md`.

## Setup

```bash
nvm use            # Node 22 (.nvmrc); npm 10 fijado en package.json
npm ci
npm run gen        # datos sintéticos deterministas
npm run dev
```

No hace falta backend, base de datos ni variables de entorno. El stack es Vite + React 19:
no agregues Next.js ni SSR.

## Antes de empezar: reclamá tu issue

Cada lane tiene que estar ligada a un issue de GitHub. El assignee es el candado para que dos
agentes no trabajen lo mismo. Los issues ya están creados y asignados en `docs/TEAM.md`:

1. Buscá tu issue en `docs/TEAM.md` o con `gh issue list --assignee @me --state open`.
2. Confirmá que el assignee seas vos; si no, no empieces: coordiná en el issue.
3. Comentá rama, worktree y puerto antes de escribir código:

   ```bash
   gh issue comment <número> --body "Arranco en <rama> (worktree <ruta>, puerto <puerto>)."
   ```

4. En el PR, referencialo con `Closes #<número>`.
5. No reasignes el issue de otra persona. Si necesitás moverlo, hablá con el owner y el integrador.

## Antes de abrir un PR

```bash
npm run check      # typecheck + check:domain + Biome CI + tests
npm run build
```

Si tocaste `src/data/generate.ts` o los escenarios, ejecuta `npm run gen` y commitea el JSON.
Si tocaste la UI, pruébala en viewport de tablet (1180 × 820) y adjunta captura.

## Ramas

Una rama por lane, con prefijo:

```text
engine/…          motor, reglas, datos, tests
body/…            BodyMap, ficha de sistema, sparkline, Trends
today/…           check-in, racha, DemoBar
ai/…              coach, guardrails, integración local opcional
mission-control/… ventana de tierra, procedimientos
design/…          estilos, textos, pitch
deploy/…          Docker, CI, Dokploy, Cloudflare
docs/…            documentación
```

No mezcles dos lanes en un PR. PRs pequeños; el integrador (`@Agupane`, backup
`@atapiamallea`) mergea cada 3–4 h.

## Contratos que no se tocan sin avisar

- `src/domain/types.ts`
- `src/ai/types.ts`
- `src/content/systems.ts`
- La forma de los JSON de escenarios

Si necesitas cambiarlos, avisa en el canal del equipo antes de abrir el PR y actualiza
`docs/PLAN.md`/`HANDOFF.md` con el motivo.

## Reglas de producto

- La UI en inglés; los docs internos en español.
- El motor no diagnostica: prioriza, explica y escala.
- Cada umbral tiene fuente y flag `verified` en `src/domain/rules.ts`. No inventes números.
- El color nunca es la única señal: color + icono + texto.
- Sin backend, base de datos, auth, ML de decisión, visión por computador ni 3D.

## Commits

Conventional Commits:

```text
feat: add early-infection correlation to Decision
fix: only raise bone WATCH below exercise target
test: cover coach guardrails against invented numbers
docs: update handoff and deployment runbook
chore: pin Node 22
refactor: extract baseline statistics
```

## Handoff

Si terminas una sesión con trabajo a medias, actualiza `HANDOFF.md`: estado, qué falta,
bloqueos y siguiente acción concreta. No dejes el contexto solo en el chat.

## Deploy

Producción: `https://orbi.agustinpane.xyz` (Dokploy BCN, Cloudflare delante).
Runbook completo: `docs/DEPLOYMENT.md`. No hay previews por PR.
