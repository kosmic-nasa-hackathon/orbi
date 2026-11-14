# STACK — ORBI

> Qué instalar, en qué orden y por qué. Sin teoría: decisiones y comandos.
> Alcance y producto: `CONCEPTO-ORBI.md` · Resumen para el equipo: `BRIEF.md`

---

## Decisión en una línea

**Una SPA en React + TypeScript con Vite. Tailwind + shadcn/ui para la piel, Recharts para las gráficas, el motor de reglas en TypeScript puro, los datos en JSON local y despliegue estático en Dokploy (Cloudflare delante). Sin backend, sin base de datos, sin autenticación. Diseño *tablet-first* y UI en inglés.**

Es el stack con el que un equipo pequeño puede tener algo impresionante y *estable* en 48 horas, y el que menos falla en una demo en vivo.

---

## 1. El stack, capa por capa

| Capa | Herramienta | Por qué esta y no otra | Alternativa | Setup |
|---|---|---|---|---|
| **Runtime** | **Node 22 LTS** fijado con `.nvmrc` | Con 4–5 personas, cada una tendrá una versión de Node distinta. Node 25 es demasiado nuevo. | — | 5 min |
| **Build** | **Vite** | Arranque instantáneo, cero configuración, salida estática. Sin SSR ni errores de hidratación a las 3 a.m. | Next.js (solo si el equipo ya lo domina) | 2 min |
| **Lenguaje** | **TypeScript** | El motor de reglas necesita tipos, y los tipos son el contrato entre bloques. | JS | 0 |
| **UI** | **React 19** | Ecosistema, familiaridad, y todas las librerías de gráficas y SVG lo asumen. | — | 0 |
| **Estilos** | **Tailwind CSS v4** + **shadcn/ui** | Aspecto profesional sin diseñar desde cero. shadcn copia el código a tu repo: no es una dependencia, es tu código. | Tailwind a mano | 20 min |
| **Gráficas** | **Recharts 3** | Declarativo, sparklines en 10 líneas. La v3 es la compatible con React 19 (la 2.x da problemas de dependencias). | visx | 15 min |
| **Animación** | **Motion** (antes framer-motion) | Transiciones de panel y cambio a modo emergencia. Mejor 3 animaciones bien hechas que 20. | CSS transitions | 10 min |
| **Mapa corporal** | **SVG propio** + ilustraciones de **Servier Medical Art** | Control de capas, color por sistema, accesible, animable. | three.js (bonito, caro y frágil en una demo) | 1–2 h |
| **Estado** | **Zustand** + `persist` | 1 KB y sin boilerplate. Guarda en localStorage la racha y el día actual. | Context API | 10 min |
| **Validación** | **Zod** | Valida el archivo de reglas clínicas: una regla mal escrita falla en el test, no en la demo. *Opcional*: si a quien lleva el motor le frena, se usan tipos TS planos. | nada | 10 min |
| **Motor de reglas** | **TypeScript puro** | Explicable, testeable, sin dependencias. | `json-rules-engine` (sobra) | 0 |
| **Tests** | **Vitest** | Comparte la config de Vite. Los tests del motor son credibilidad ante el jurado. | Jest | 15 min |
| **Scripts** | **tsx** | Ejecuta `scripts/generate-mission.ts` directamente con `npm run gen`. | vite-node | 2 min |
| **Fechas** | **date-fns** | Ligero. Para las horas de las ventanas de comunicación. | dayjs | 2 min |
| **Iconos** | **lucide-react** | Mismo trazo que shadcn. También sirven para los iconos de estado (ver §5). | heroicons | 2 min |
| **Fuentes** | **@fontsource** | Las fuentes van en el repo, no por CDN: funcionan sin wifi. | Google Fonts | 5 min |
| **Datos** | **Generador TS con RNG sembrado → JSON** | Demo determinista: siempre el mismo día 148, siempre la misma curva. | mocks a mano (frágiles) | 1 h |
| **Calidad** | **Biome** | Lint + format en una herramienta y en milisegundos. | ESLint + Prettier | 5 min |
| **Repo** | **GitHub** + **GitHub Actions** | CI con `test` + `build` en cada PR: nadie rompe `main` sin enterarse. | — | 15 min |
| **Deploy** | **Dokploy BCN** | App Dockerfile + nginx en `orbi.agustinpane.xyz`, auto-deploy en `main` y TLS en Cloudflare. Sin previews por PR. | Vercel (previews) | 15 min |
| **Bocetos** | **Figma** o **Excalidraw** | 30 minutos el sábado para bocetar las pantallas antes de programar. Se discute el diseño en un dibujo, no en el código. | papel | 30 min |
| **Offline** (nivel 2) | **vite-plugin-pwa** | Hace verificable la promesa de funcionar sin la Tierra (modo avión en la demo). | — | 15 min |

**Total real de setup:** ~2,5 h (incluyendo repo, CI y deploy). Se hace **el viernes**, no el sábado.

> **Estado real (14 nov 2026):** el scaffold ya existe (Vite 8, React 19.3, TypeScript 5.9,
> Tailwind 4, Vitest 5, Biome 2), el motor y el coach están implementados, y CI/Dockerfile/nginx
> están en el repo. Falta la UI de las pantallas y provisionar Dokploy/Cloudflare. Ver `HANDOFF.md`.

---

## 2. Cómo montarlo (comandos, en orden)

```bash
# 0. Node 22 (una vez por persona)
nvm install 22 && nvm use 22

# 1. Crear el proyecto en la raíz del repo (ya existe, con docs/ dentro)
git clone https://github.com/kosmic-nasa-hackathon/orbi.git   # si aún no lo tienes
cd orbi
npm create vite@latest . -- --template react-ts
#   → Vite avisa de que la carpeta no está vacía: elegir "Ignore files and continue"
#   → revisa después que no haya sobrescrito README.md ni .gitignore (git diff)
echo "22" > .nvmrc
npm install

# 2. Tailwind v4 (plugin de Vite, sin postcss config)
npm install tailwindcss @tailwindcss/vite

# 3. Dependencias de producto
npm install zustand zod recharts motion date-fns lucide-react clsx tailwind-merge @fontsource-variable/inter

# 4. Dependencias de desarrollo
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @biomejs/biome tsx
```

Scripts en `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc --noEmit && vite build",
  "typecheck": "tsc --noEmit",
  "lint": "biome check .",
  "test": "vitest run",
  "gen": "tsx scripts/generate-mission.ts",
  "check": "npm run typecheck && npm run lint && npm run test"
}
```

`vite.config.ts` mínimo:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
```

`src/index.css`:

```css
@import "tailwindcss";
```

### shadcn/ui

```bash
npx shadcn@latest init
```

Antes de ejecutarlo hay que preparar **dos cosas**; si no, falla sin dar error:

1. El alias `@/*` en `tsconfig.json` y en `tsconfig.app.json` (`"baseUrl": "."`, `"paths": { "@/*": ["./src/*"] }`).
2. El alias en `vite.config.ts` (arriba).

Componentes que se usarán de verdad: `card`, `button`, `badge`, `dialog`, `sheet`, `progress`, `tabs`, `tooltip`, `separator`, `slider` (ánimo y fatiga).

> **Si shadcn os frena más de 20 minutos, abandonadlo.** Un `Card` con Tailwind a mano son 8 líneas.

### CI (`.github/workflows/ci.yml`)

```yaml
name: ci
on:
  push: { branches: [main] }
  pull_request:
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: npm }
      - run: npm ci
      - run: npm run gen && git diff --exit-code -- src/data/scenarios
      - run: npm run check
      - run: npm run build
```

### Reglas del repo

- `main` solo se actualiza por PR con la CI en verde. El repo privado free no permite branch
  protection: el gate real es el PR + la integradora.
- **Una persona integradora** (Andrea) revisa y mergea los PR. Así no se discute qué entra.
- Ramas por bloque: `engine/…`, `body/…`, `today/…`, `ai/…`, `mission-control/…`, `design/…`, `deploy/…`.
- PR pequeños e integración cada 3–4 h. **Cambiar `src/domain/types.ts` exige avisar a todo el equipo.**

---

## 3. Estructura de carpetas

```
orbi/                            # = raíz del repo kosmic-nasa-hackathon/orbi
├─ README.md
├─ docs/                         # BRIEF, CONCEPTO-ORBI, STACK, recursos/
├─ .nvmrc
├─ .github/workflows/ci.yml
├─ public/
│  └─ body/body-base.svg
├─ scripts/
│  └─ generate-mission.ts        # npm run gen → src/data/scenarios/*.json
├─ src/
│  ├─ domain/                    # ⚠️ CERO imports de React aquí
│  │  ├─ types.ts                # el contrato (ver CONCEPTO-ORBI.md §8)
│  │  ├─ baseline.ts             # media ± σ de los 14 días pre-vuelo
│  │  ├─ rules.ts                # umbrales, fuentes y action cards
│  │  ├─ levels.ts               # orden y etiquetas de nivel
│  │  ├─ escalation.ts           # nivel × latencia
│  │  ├─ evaluate.ts             # correlaciones, estimaciones, facts y evaluate()
│  │  └─ *.test.ts
│  ├─ ai/                        # coach determinista + adapter local + guardrails
│  │  ├─ types.ts
│  │  ├─ coach.ts
│  │  ├─ guardrails.ts
│  │  └─ providers/
│  ├─ data/
│  │  ├─ rng.ts                  # mulberry32 sembrado
│  │  ├─ generate.ts             # generador de escenarios
│  │  └─ scenarios/*.json        # generados (se suben al repo)
│  ├─ content/
│  │  └─ systems.ts              # etiquetas, "why this matters" y colores
│  ├─ store/
│  │  └─ orbiStore.ts            # Zustand: escenario, día, misión, racha
│  ├─ components/
│  │  ├─ DemoBar.tsx             # escenario · misión · Next day ▶ · Reset
│  │  ├─ LevelBadge.tsx          # color + icono + texto
│  │  ├─ body/BodyMap.tsx
│  │  ├─ body/SystemSheet.tsx
│  │  ├─ charts/Sparkline.tsx
│  │  ├─ decision/BecauseList.tsx
│  │  ├─ decision/ActionCard.tsx
│  │  ├─ decision/EscalationPanel.tsx
│  │  └─ ui/                     # shadcn
│  └─ screens/
│     ├─ Today.tsx               # nivel 0
│     ├─ Body.tsx                # nivel 0
│     ├─ Decision.tsx            # nivel 0
│     ├─ Trends.tsx              # nivel 1
│     ├─ MissionControl.tsx      # nivel 1 (segunda ventana: tierra)
│     ├─ Procedures.tsx          # nivel 2
│     ├─ VisionTest.tsx          # nivel 2 (rejilla de Amsler)
│     └─ CrewPanel.tsx           # nivel 2 (vista del CMO)
```

**La regla de oro arquitectónica:** `src/domain/` no importa nada de React.

Eso da tres cosas: el motor se testea con Vitest sin montar componentes, la lógica clínica se puede defender como "independiente de la interfaz", y si la UI se rompe, el cerebro sigue funcionando. Es el argumento que más impresiona a un jurado técnico.

**Navegación:** un `useState<Screen>` + `AnimatePresence`. La única excepción es Mission Control, que se abre en otra ventana con `?view=ground`, sin router.

---

## 4. Niveles de alcance (qué se construye según el equipo)

Regla: **no se empieza un nivel hasta que el anterior se puede demostrar completo en la URL desplegada.**

| Nivel | Qué entra | Horas | Con cuántas personas |
|---|---|---|---|
| **0 · Núcleo** | Today (check-in + racha), Body (6 sistemas + halo), Decision (because, action card, escalado), DemoBar, 3 correlaciones + 2 reglas de hueso + 2 estimaciones, 4 escenarios | ~26,5 h | 2–3 |
| **1 · Diferencial** | **Trends** (gráficas con banda basal) + **Mission Control** (nave ↔ tierra en dos ventanas, §8) | +8 h | 4–5 |
| **2 · Extra** | 2 procedimientos guiados, **test de visión con rejilla de Amsler**, vista CMO con 3 tripulantes, PWA offline | +10 h | 5, y solo si el nivel 1 está el sábado por la noche |

### Presupuesto del nivel 0

| Componente | Horas | ¿Recortable? |
|---|---|---|
| Setup + repo + CI + deploy | 2,5 | No |
| `types.ts` + baseline + reglas con fuente | 3 | **No** |
| Generador de datos + 4 escenarios | 2 | **No** |
| Correlaciones + reglas de hueso + estimaciones + escalado + tests | 4 | **No** |
| Body (SVG + interacción + halo + ficha) | 4 | Parcialmente (silueta simple) |
| Decision | 3 | **No** |
| Today (check-in con "Synced" + racha) | 2 | Parcialmente |
| DemoBar + reset | 1 | **No** |
| Pulido visual en tablet | 2 | Parcialmente |
| Guion, slides, vídeo de respaldo | 3 | **No** |
| **Total** | **~26,5 h** | |

---

## 5. El mapa corporal: la decisión más delicada

Es lo que más se ve y lo que más fácil se estropea.

### Opción A — Servier Medical Art *(recomendada)*
Ilustraciones anatómicas gratuitas bajo **CC BY 4.0**, pensadas para divulgación médica. Se recolorean en un editor SVG.
- ✅ Calidad clínica real, coherente entre piezas
- ⚠️ Requiere atribución visible ("Illustrations: Servier Medical Art, CC BY 4.0") en el pie y en los créditos.

### Opción B — Silueta propia *(plan B, preparado desde el viernes)*
Figura estilizada en Figma con 6 zonas. **45 minutos, riesgo cero**, menos impactante.

### Implementación

Un **único SVG** con grupos identificados por sistema. El color lo pone la clase:

```html
<svg viewBox="0 0 400 800">
  <ellipse class="halo" cx="200" cy="400" rx="170" ry="380" />
  <g data-system="cardio"      class="system-fill cursor-pointer">…</g>
  <g data-system="msk"         class="system-fill cursor-pointer">…</g>
  <g data-system="immune"      class="system-fill cursor-pointer">…</g>
  <g data-system="metabolic"   class="system-fill cursor-pointer">…</g>
  <g data-system="respiratory" class="system-fill cursor-pointer">…</g>
  <g data-system="behavioral"  class="system-fill cursor-pointer">…</g>
</svg>
```

```tsx
<svg onClick={(e) => {
  const g = (e.target as Element).closest('[data-system]')
  if (g) selectSystem(g.getAttribute('data-system') as SystemId)
}}>
```

```css
.system-fill { fill: var(--state-color); transition: fill 400ms ease; }
.halo { filter: blur(28px); opacity: var(--radiation-opacity); }
```

### Accesibilidad del código de colores

El reto pide código de colores, pero **el color nunca va solo**. Cada estado lleva color + icono + texto, para que un juez daltónico o un proyector lavado no lo confundan:

| Nivel | Color | Icono (lucide) | Texto |
|---|---|---|---|
| NOMINAL | verde | `CircleCheck` | Nominal |
| WATCH | amarillo | `Eye` | Watch |
| CONCERN | ámbar | `TriangleAlert` | Concern |
| URGENT | rojo | `Siren` | Urgent |

En el mapa: además del color, un pequeño marcador con el icono sobre el sistema afectado.

### Tablet-first

- Diseñar a **1180 × 820** (iPad horizontal) y probar en DevTools con ese viewport.
- Áreas táctiles de ≥ 44 px; nada depende de hover.
- En el portátil del proyector se ve igual de bien.

---

## 6. Datos sintéticos

Sin datos no hay demo, y con datos malos la demo miente.

```ts
// mulberry32: RNG sembrado → la misma curva siempre
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
```

**Un tripulante, 14 días de pre-vuelo (basal) + 30 días de misión.** Por día: los 7 indicadores del check-in + minutos de ejercicio resistivo (dispositivo) + entorno (CO₂ de cabina, dosis, SPE). Los 30 días corresponden a los días **119–148** de la misión a Marte (campo `firstMissionDay`): siguen en tránsito, porque la ida dura 162–189 días según el HRP, así que el gancho "Day 148 on the way to Mars" cuadra.

Campos de escenario que necesitan las estimaciones (ver `CONCEPTO-ORBI.md` §4.3 y §8):

| Campo | Valor por defecto | Para qué |
|---|---|---|
| `exposureBudgetMSv` | 600 (límite de carrera actual de NASA, `TODO verify`); los escenarios demo usan 400 para que el halo sea legible | % del presupuesto en el halo |
| `priorDoseMSv` | la dosis acumulada en los días 1–118 | Que el halo no empiece en 0 el día 119 |
| `exerciseTargetMinPerDay` | el objetivo de la misión | Regla de adherencia al ejercicio (hueso) |

**Pérdida ósea estimada** (`evaluate.ts`): `mesesEnMicrogravedad × [1 %, 1,5 %]` → se devuelve como **rango**, nunca como un número único, y la UI lo etiqueta como *"Estimated · NASA HRP evidence"*. La adherencia cambia el estado (*on track* / *at risk*), no el porcentaje.

Los mismos 4 escenarios que en `CONCEPTO-ORBI.md` §7:

| Escenario | Qué cuenta | Qué demuestra |
|---|---|---|
| `nominal` | Todo dentro de rango | Cuerpo en verde, racha activa |
| `early-infection` | Deuda de sueño → temperatura y FC suben | La correlación de conductual a fisiológico |
| `cabin-co2` | Sube el CO₂ de cabina, baja algo la SpO₂ | **"Cabin issue, not you"** |
| `solar-event` | SPE el último día | Halo rojo, protocolo de refugio |

**Regla de calidad:** nada de valores planos. Ruido diario realista + una deriva lenta + un punto de inflexión. Si la curva parece una recta, el jurado sabe que es inventada.

Cada valor lleva su `sources` (`wearable` / `device` / `manual`) para que Today muestre "Synced" o "Manual".

**Detalle para la demo:** en `early-infection`, que la adherencia al ejercicio también caiga en los últimos días (la fatiga hace saltarse sesiones). Así Musculoskeletal pasa a WATCH con la regla de hueso, y la demo enseña las dos reglas nuevas sin un escenario extra.

---

## 7. Lo que NO hay que instalar

| No | Por qué |
|---|---|
| Backend (Express, Spring, FastAPI) | No hay nada que servir. Todo corre en el cliente. |
| Base de datos (Postgres, Supabase, Firebase) | `localStorage` + JSON bastan para un fin de semana. |
| Autenticación | No hay usuarios en una demo. |
| three.js / react-three-fiber | El 3D se come 8 horas y falla en el proyector. El SVG da el 90 % del efecto. |
| ML de decisión | El jurado premia explicabilidad; el motor es determinista. El coach local es solo una capa de explicación opcional. |
| MUI / Ant Design | Pesados y con una personalidad visual que no es la vuestra. |
| Docker para desarrollo | La app es estática; Docker solo se usa como artefacto de deploy (nginx + `dist/`). |
| React Router | Una pantalla extra en otra ventana se resuelve con `?view=ground`. |

---

## 8. Mission Control: nave ↔ tierra sin backend (nivel 1)

La latencia de comunicaciones es una **simulación de interfaz**, no un hecho de red. En la demo controláis el reloj: podéis acelerar 14 minutos en 5 segundos delante del jurado.

```ts
// Ventana A — ORBI a bordo (tablet)
const comms = new BroadcastChannel('orbi-comms')
comms.postMessage({ type: 'surgeon-packet', payload, sentAt: Date.now(), latencyMin: 14 })

// Ventana B — Mission Control / Flight Surgeon (?view=ground)
comms.onmessage = (e) => setInbox(prev => [...prev, e.data])
```

Dos ventanas del navegador, una junto a otra: la nave a la izquierda y la tierra a la derecha. El paquete viaja con una barra de progreso y una cuenta atrás de la latencia (acelerada ×100 en modo demo). El cirujano responde y su respuesta tarda lo mismo en volver. **Es el momento wow de la demo**: el jurado *ve* la distancia a la Tierra, una de las 5 amenazas.

> Limitación: `BroadcastChannel` solo funciona entre pestañas del **mismo navegador y el mismo origen**. Para la demo es justo lo que se necesita.

| Si algún día… | Necesitaríais | ¿En la hackatón? |
|---|---|---|
| Varios tripulantes reales sincronizados | Base de datos + backend | No |
| Envío real de datos a tierra | Backend + cola | No |
| Solo enseñarlo y que funcione | `npm run build` y desplegar `dist/` | **Sí, esto** |

---

## 9. Riesgos técnicos y mitigación

| Riesgo | Mitigación |
|---|---|
| Versiones de Node distintas en el equipo | `.nvmrc` + `nvm use` + CI con la misma versión. |
| Conflictos de dependencias con React 19 | Recharts 3. Si un paquete se queja, `npm ls` y fijar la versión. **Nada de `--force`** sin avisar a la integradora. |
| shadcn no arranca por los alias | Seguir la §2 al pie de la letra. Si falla, Tailwind a mano. |
| Alguien rompe `main` | CI + revisión de la integradora. El repo privado free no permite branch protection; el gate es el PR. |
| Repo privado en una org sin GitHub App | Instalar la GitHub App de Dokploy en la org; fallback temporal: fork en una cuenta con la App. |
| El SVG anatómico no está listo | Silueta de 6 zonas como plan B desde el viernes. |
| Licencia de las ilustraciones | Servier es CC BY 4.0: atribución visible desde el primer commit. |
| La demo no es reproducible | RNG sembrado + botón Reset. Nunca datos aleatorios en vivo. |
| La demo depende del wifi | Deploy estático + build local (`npx serve dist`) + vídeo grabado. Triple red. |
| Fuentes que no cargan | `@fontsource` en el repo. |
| Se rompe algo a última hora | Código congelado el domingo a las 12:00. Después solo se ensaya. |

---

## 10. ¿Next.js? ¿Backend? No y no

- **Next.js:** enrutado por archivos, Server Components, API routes y SSR no aportan nada a una app 100 % interactiva sin servidor. Solo tendría sentido si el equipo ya lo domina, y aun así exportado como SPA (`output: 'export'`).
- **Backend:** guardar datos → `localStorage`; calcular el triaje → JS en microsegundos; servir datos → JSON en el build; enviar el paquete a tierra → `BroadcastChannel` + temporizador.
- **Java:** aunque Andrea lo domina, un backend Spring añade despliegue, CORS y un punto de fallo a cambio de nada visible para el jurado.

---

## 11. Checklist de "esto se puede enseñar"

- [ ] `npm run check` y `npm run build` pasan; CI en verde en cada PR
- [ ] `npm run gen` reproduce los JSON sin diff (`git diff --exit-code -- src/data/scenarios`)
- [ ] `src/domain/` no importa React, DOM ni APIs del navegador
- [ ] URL pública desplegada + QR en un slide
- [ ] Botón **Reset demo** visible en la DemoBar
- [ ] Funciona con el wifi apagado después de cargar
- [ ] Tests verdes: correlaciones, 2 reglas de hueso, 2 estimaciones y guardrails del coach
- [ ] Cada umbral de `rules.ts` tiene su `source`; los no verificados, marcados `TODO verify`
- [ ] Estados con color + icono + texto
- [ ] Probado en viewport de tablet **y** en la resolución del proyector
- [ ] Toda la UI en inglés
- [ ] Créditos de ilustraciones visibles
- [ ] Vídeo de respaldo grabado
- [ ] README final en inglés (qué es, cómo ejecutarlo, fuentes de los umbrales)
