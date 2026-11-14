# HANDOFF — ORBI scaffold

**Fecha:** 2026-11-14 11:30 UTC
**Rama:** `feat/scaffold-baseline` (esta rama)
**Base:** `main` @ `4a9c36b` (solo docs)
**Estado:** motor de dominio + capa de coach implementados y testeados. **La UI, Docker/CI y el deploy todavía no están.**

---

## 1. Cómo arrancar en local

```bash
git fetch origin
git checkout feat/scaffold-baseline
npm ci
npm run gen      # regenera los 4 escenarios JSON (determinista)
npm run dev      # Vite
npm test         # 20 tests
npm run check    # typecheck + Biome + tests
```

Node 22 (`.nvmrc`). No hace falta backend, base de datos ni variables de entorno.

---

## 2. Qué está hecho y verificado

### Scaffold
- Vite 8 + React 19 + TypeScript 5.9 + Tailwind 4 + Vitest 5 + Biome.
- `index.html`, `vite.config.ts`, `tsconfig.json`, `biome.json`, `.nvmrc`, `.dockerignore`.

### Dominio (`src/domain/`, cero imports de React)
- `types.ts` — contrato congelado entre motor, UI y coach.
- `baseline.ts` — media ± σ de los 14 días pre-vuelo.
- `rules.ts` — umbrales con fuente y flag `verified`; un solo archivo auditable.
- `levels.ts` — orden de niveles y etiquetas.
- `escalation.ts` — nivel × latencia (ISS / Luna / Marte).
- `evaluate.ts` — 6 sistemas + halo, 3 correlaciones, 2 reglas de hueso, estimaciones y facts para el coach.
- `engine.test.ts` — 11 tests (nominal, infección temprana, CO₂ de cabina, SPE, escalado, hueso, facts).

### Datos
- `scripts/generate-mission.ts` → `src/data/scenarios/*.json`.
- 4 escenarios: `nominal`, `early-infection`, `cabin-co2`, `solar-event`.
- 14 días pre-vuelo + 30 días de misión (días 119–148). RNG sembrado: el día 148 es siempre el mismo.
- `src/data/scenarios/index.ts` carga los JSON.

### Coach (`src/ai/`)
- `types.ts` — `CoachProvider`, `CoachSuggestion`, `CoachRequest`.
- `providers/template.ts` — coach determinista (default y fallback).
- `providers/llm.ts` — adapter para un modelo local inyectado (WebLLM, etc.).
- `guardrails.ts` — prohíbe diagnóstico/medicación, rechaza números no presentes en los facts/acciones y acciones no disparadas.
- `coach.ts` — `askCoach()` valida y cae al template si el modelo falla o alucina.
- `coach.test.ts` — 9 tests, incluidos casos adversarios de alucinación.

**Verificación actual:** `tsc --noEmit` limpio, **20/20 tests verdes**.

---

## 3. Qué falta (en orden de prioridad)

| # | Tarea | Estimación | Archivos |
|---|---|---|---|
| 1 | **UI Level 0**: reemplazar la consola por App shell + DemoBar + Today + Body + Decision | 2–3 h | `src/App.tsx`, `src/screens/*`, `src/components/*`, `src/store/orbiStore.ts` |
| 2 | **Trends** con banda basal (nivel 1) | 1 h | `src/screens/Trends.tsx`, `src/components/Sparkline.tsx` |
| 3 | **Dockerfile + nginx.conf** | 30 min | raíz |
| 4 | **CI + deploy Dokploy** | 30–45 min | `.github/workflows/` |
| 5 | Página del proyecto, README final, vídeo | — | lane E |
| 6 | Nivel 2 opcional: Amsler, Mission Control, PWA offline | — | — |

La UI debe consumir `evaluate()` y `askCoach()`, **no reimplementar reglas**.

---

## 4. Paralelización y contratos

| Lane | Entregable | Dueño sugerido | Zona |
|---|---|---|---|
| **A · Motor + datos** | `src/domain/*`, tests, generador, escenarios | 1 persona | `src/domain/`, `src/data/`, `scripts/` |
| **B · Body + Trends** | `BodyMap`, ficha por sistema, sparkline, gráficas | 1 persona | `src/components/body/`, `src/screens/Body.tsx`, `src/screens/Trends.tsx` |
| **C · Today + Decision** | Check-in “Synced”, racha, action card, escalado, DemoBar | 1 persona | `src/screens/Today.tsx`, `src/screens/Decision.tsx`, `src/components/DemoBar.tsx` |
| **D · Coach + Mission Control** | Integración WebLLM, vista tierra, procedimientos | 1 persona | `src/ai/`, `src/screens/MissionControl.tsx` |
| **E · Diseño + pitch** | Bocetos, textos, página, vídeo, slides | 1–2 personas | `docs/`, `public/` |

**Contratos que no se tocan sin avisar a todo el equipo:**
- `src/domain/types.ts`
- `src/ai/types.ts`
- `src/content/systems.ts`
- El formato de los JSON de escenarios.

**Flujo:** una rama por lane (`engine/…`, `body/…`, `today/…`, `ai/…`, `deploy/…`), PRs pequeños a `main`, CI en verde. La integradora mergea cada 3–4 h.

---

## 5. Deploy con la infra actual

**Subdominio propuesto:** `orbi.agustinpane.xyz`.

Cadena completa (la misma que Servido/PDFToolkit):

```
Cloudflare DNS (CNAME orbi → 0bbb0bcf-…cfargotunnel.com, proxied)
  → Cloudflare Tunnel BCN (nginx-cf 192.168.1.114)
  → Nginx 114 (vhost orbi → 192.168.1.115:80)
  → Traefik/Dokploy BCN (115)
  → contenedor ORBI (nginx:alpine, puerto 80)
```

### 5.1 Dokploy

Proyecto `Aplicaciones` (`FLGNQAu7z6UkAazPxu9r9`), entorno `production` (`uYxpUkNVX3jzl0fyehPy-`).

```bash
# 1. Crear app
curl -s -X POST "$DOKPLOY_URL/api/application.create" \
  -H "x-api-key: $DOKPLOY_API_KEY" -H 'Content-Type: application/json' \
  -d '{"projectId":"FLGNQAu7z6UkAazPxu9r9","environmentId":"uYxpUkNVX3jzl0fyehPy-","name":"ORBI"}'

# 2. Linkear al repo (reemplazar <APP_ID>)
curl -s -X POST "$DOKPLOY_URL/api/application.saveGithubProvider" \
  -H "x-api-key: $DOKPLOY_API_KEY" -H 'Content-Type: application/json' \
  -d '{"applicationId":"<APP_ID>","githubAppGitProviderId":"TE6DZFA-GBljtQ-0q0q8m","repository":"kosmic-nasa-hackathon/orbi","branch":"main","owner":"kosmic-nasa-hackathon","buildPath":"/"}'

# 3. Build type + dominio
curl -s -X POST "$DOKPLOY_URL/api/application.saveBuildType" \
  -H "x-api-key: $DOKPLOY_API_KEY" -H 'Content-Type: application/json' \
  -d '{"applicationId":"<APP_ID>","buildType":"dockerfile"}'

curl -s -X POST "$DOKPLOY_URL/api/domain.create" \
  -H "x-api-key: $DOKPLOY_API_KEY" -H 'Content-Type: application/json' \
  -d '{"applicationId":"<APP_ID>","host":"orbi.agustinpane.xyz","port":80,"https":false,"path":"/"}'

# 4. Deploy
curl -s -X POST "$DOKPLOY_URL/api/application.deploy" \
  -H "x-api-key: $DOKPLOY_API_KEY" -H 'Content-Type: application/json' \
  -d '{"applicationId":"<APP_ID>","title":"Initial deploy"}'
```

**Bloqueante probable:** el repo es privado y vive en la org `kosmic-nasa-hackathon`. El GitHub App de Dokploy
(`TE6DZFA-…`) tiene que estar instalado en esa org. Si no lo está, hay dos salidas:
1. Instalarlo desde Dokploy → Git → GitHub (una vez).
2. Forkear a `Agupane/orbi` y deployar desde ahí (el App ya está instalado en Agupane).

### 5.2 Nginx 114

```nginx
server {
    listen 80;
    server_name orbi.agustinpane.xyz;
    location / {
        proxy_pass http://192.168.1.115:80;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

```bash
ln -s /etc/nginx/sites-available/orbi.agustinpane.xyz /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### 5.3 Túnel y DNS

- Añadir `orbi.agustinpane.xyz → http://127.0.0.1:80` en `/root/.cloudflared/config.yml` (antes del catch-all) y `systemctl restart cloudflared`.
- CNAME `orbi` → `0bbb0bcf-863a-4f57-9b3a-353761b91799.cfargotunnel.com`, proxied.
- Sin Cloudflare Access: el jurado tiene que entrar sin login.

**Ventanas sin deploys:** 20:30–22:30 y 01:30–02:50 UTC.

### 5.4 CI/CD

Opción recomendada (la de Servido/Portfolio):
- `ci.yml` en PRs: `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, gitleaks.
- `deploy.yml` en push a `main`, `runs-on: self-hosted` (runner en la LAN), `curl` al webhook token de Dokploy:
  `http://192.168.1.115:3000/api/deploy/${{ secrets.DOKPLOY_TOKEN }}` con `X-GitHub-Event: push` y `{"ref":"refs/heads/main"}`.

Hace falta registrar un runner para el repo (el runner 100 ya tiene 6; sería el séptimo) y cargar `DOKPLOY_TOKEN`.
Alternativa sin runner: `autoDeploy` con el GitHub App + webhook `/api/deploy/github` (ya tiene bypass de Access).

---

## 6. Evaluación: modelo local de IA en la tablet

**Recomendación: sí, pero como capa de explicación, nunca como fuente de decisión.**

### Arquitectura propuesta

```
motor determinista (evaluate) → facts estructurados → coach (template | LLM local) → guardrails → UI
```

- **Tier 0 (hecho):** template determinista. Siempre funciona, cero descarga, cero alucinación. Es el default y el fallback.
- **Tier 1 (opcional):** LLM pequeño local vía **WebLLM + WebGPU**.
  - `Qwen2.5-1.5B-Instruct` q4f16 (~1.0–1.2 GB, Apache-2.0) — mejor calidad multilingual.
  - `Llama-3.2-1B-Instruct` q4f16 (~0.7–0.9 GB, Llama 3.2 Community License).
  - `Gemma-3-1B-it` q4f16 (~0.7 GB, Gemma Terms) o `SmolLM2-1.7B-Instruct` (Apache-2.0).
  - WebGPU: Chrome Android 121+, Safari 26+/iOS 26. Fallback WASM (más lento) o template.
  - Primera carga ~1 GB; cachear en OPFS/Cache API. En la demo, precargar antes de empezar.
  - Rendimiento esperado en tablet: ~15–30 tok/s, respuesta de 150–250 tokens en 8–15 s. **Nunca bloquear la UI**: mostrar skeleton y permitir cancelar.
- **Tier 2 (no para este hackatón):** RAG con `all-MiniLM-L6-v2` (~23 MB) sobre `docs/recursos/` para citar fuentes. Se puede mencionar en el pitch como trabajo futuro.

### Reglas de seguridad (ya implementadas y testeadas)

1. El LLM **no calcula umbrales ni niveles**; recibe los facts del motor.
2. Debe devolver JSON con `summary`, `actionId`, `factIds`, `confidence`.
3. `actionId` tiene que ser una regla realmente disparada.
4. Todo número del resumen tiene que existir en los facts/acciones (no inventar cifras).
5. Prohibido: “diagnose”, “prescribe”, “medication”, “cancer”, “cure”, “you have”.
6. Si falla cualquier chequeo → fallback al template y se muestra “model output rejected”.

### Cómo integrarlo (30–60 min)

```bash
npm i @mlc-ai/web-llm
```

```ts
// src/ai/providers/webllm.bootstrap.ts (ejemplo, no incluido aún)
import { CreateMLCEngine } from "@mlc-ai/web-llm";
import { createLlmCoach } from "./llm";

const engine = await CreateMLCEngine("Qwen2.5-1.5B-Instruct-q4f16_1-MLC", {
  initProgressCallback: (p) => console.log(p.text),
});

export const localCoach = createLlmCoach({
  name: "Qwen2.5-1.5B",
  complete: async (prompt) => {
    const reply = await engine.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 220,
    });
    return reply.choices[0]?.message?.content ?? "";
  },
});
```

Luego:

```ts
const suggestion = await askCoach(buildCoachRequest(evaluation), localCoach);
```

Feature flag: si `navigator.gpu` no existe o el modelo no cargó, usar `createTemplateCoach()`.
Mostrar badge **“On-device”** y el nombre del modelo. En el pitch: *“It explains on board, but the decision stays auditable.”*

### Eval mínima antes de mostrarlo

- 4 escenarios × 3 seeds.
- Casos adversarios: diagnóstico, medicación, número inventado, acción no disparada.
- Medir: latencia, tokens/s, RAM, temperatura/batería, tamaño de descarga.
- Criterio de aceptación: 0 violaciones de guardrails y < 15 s p95 en la tablet de demo.

---

## 7. Decisiones tomadas y riesgos

| Decisión | Por qué |
|---|---|
| **Single Vite app**, no monorepo | Menos fricción para 4–5 personas en 48 h; los límites se mantienen por carpetas + CODEOWNERS. |
| Motor puro, sin React | Testeable, defendible ante jurado, la UI puede romperse sin romper la lógica. |
| Sin ML/visión/3D/backend | El reto premia explicabilidad y una demo estable. |
| Modelo local sólo como coach | Evita alucinaciones médicas y dependencia de WebGPU. |
| Umbrales con `verified` | Honestidad: lo que no está verificado se marca; el jurado puede auditar. |

**Riesgos abiertos:**
- El repo es privado en una org: el GitHub App de Dokploy puede no estar instalado → ver §5.1.
- Casi ningún umbral tiene fuente numérica oficial (sólo hueso y el límite de 600 mSv). Completar `TODO verify` antes del envío.
- El nivel 0 son ~26 h: no empezar Trends/Mission Control hasta que Today + Body + Decision estén en la URL.
- PA es semanal en el concepto, no diaria: explicarlo en la UI o cambiarlo.

---

## 8. Próximas 3 acciones (para quien siga)

1. **UI shell + conectar `evaluate()`** a Body y Decision; DemoBar con escenario/misión/día. (2–3 h)
2. **Dockerfile + CI** y deploy preview en `orbi.agustinpane.xyz`. (1 h)
3. Completar **action cards con fuente** y los textos “Why we ask” en Today. (1–2 h)

Cuando esté la UI, el guion de demo de `docs/CONCEPTO-ORBI.md` §13 se puede ensayar sin cambios.
