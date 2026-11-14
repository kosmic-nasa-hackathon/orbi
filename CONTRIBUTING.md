# Contribuir a ORBI

Guía corta para el equipo. El contrato técnico está en `AGENTS.md`; las tareas, en `docs/TASKS.md`.

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
agentes no trabajen lo mismo:

1. Buscá el issue de tu lane (`gh issue list --state open`) o el enlazado en `docs/PLAN.md`.
2. Si no existe, creálo con la lane, alcance, archivos permitidos y criterios de aceptación.
3. Reclamalo antes de escribir código:

   ```bash
   gh issue edit <número> --add-assignee @me
   gh issue comment <número> --body "Claimed by <agente/modelo> on <rama> (worktree <ruta>)."
   ```

4. Si ya está asignado a otra persona, no empieces: coordiná en el issue.
5. En el PR, referencialo con `Closes #<número>`.

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

No mezcles dos lanes en un PR. PRs pequeños; la integradora mergea cada 3–4 h.

## Contratos que no se tocan sin avisar

- `src/domain/types.ts`
- `src/ai/types.ts`
- `src/content/systems.ts`
- La forma de los JSON de escenarios

Si necesitas cambiarlos, avisa en el canal del equipo antes de abrir el PR y actualiza
`docs/TASKS.md`/`HANDOFF.md` con el motivo.

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
