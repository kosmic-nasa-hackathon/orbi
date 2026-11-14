# ORBI — Concepto (alcance de hackatón)

> Health Autonomy Console para astronautas en misiones de larga duración.
> NASA Space Apps 2026 · Reto: *Create Health Monitoring Software for Astronauts on Space Missions*
> Entrega: **domingo 16:00** · Envío objetivo: **domingo 14:00**

Este documento sustituye al concepto original (AURA) como documento de trabajo. El original lo conserva Andrea y no está en el repo. Si algo no está aquí, **no está en el MVP**.

---

## 0. En una frase

**ORBI convierte mediciones diarias simples en una lectura del cuerpo, una decisión de triaje explicada y un plan de acción, con la Tierra cerca o a 20 minutos de distancia.**

> *"La salud en el espacio no falla de golpe: falla por acumulación silenciosa. No construimos un panel de constantes: construimos un sistema que vigila la deriva, la traduce a un cuerpo y la convierte en una decisión."*

Tagline en inglés (para la UI y la entrega): ***"From drift to decision."*** · Pitch: *"ORBI keeps your body in orbit."*

**Por qué ORBI y no AURA:** "Aura" suena casi igual que *Oura*, un anillo de salud comercial muy conocido, y un juez podría pensar que es una copia. ORBI es cercano, suena a compañero de tripulación, evoca la órbita y encaja con la gamificación. El anillo alrededor de la figura se sigue llamando **halo** de radiación.

---

## Cómo se usa en la nave

### Qué mide cada cosa

No hay un único aparato: los wearables y la estación miden solos, y el astronauta **confirma** y añade lo que solo puede aportar él. Por eso el check-in dura 90 segundos y no consiste en teclear siete números.

| Dispositivo | Qué mide | Cómo llega a ORBI |
|---|---|---|
| **Camiseta biométrica** (en la ISS: *Bio-Monitor* de la CSA) | FC, respiración, SpO₂, temperatura de la piel, actividad | ✅ Automático, continuo |
| **Reloj actígrafo** | Horas y calidad de sueño, actividad | ✅ Automático, continuo |
| **Glucómetro** (pinchazo en el dedo) | Glucosa (mg/dL) | ✋ Manual |
| **Termómetro** del kit médico | Temperatura (si no hay camiseta) | ✋ Manual |
| **Manguito automático** | Presión arterial (semanal) | 🔌 Dispositivo |
| **SLAMMD** (en microgravedad no hay básculas: la masa se mide por aceleración) | Masa corporal (semanal) | 🔌 Dispositivo |
| **Equipo de ejercicio resistivo** (en la ISS: ARED) | Minutos y carga de ejercicio → adherencia a la contramedida ósea | ✅ Automático |
| **Dosímetro pasivo personal** (CPD, una chapa que lleva cada tripulante) | Dosis acumulada personal | 🔌 Lectura periódica |
| **Monitores de radiación de área** (RAM, TEPC) + **espectrómetro de neutrones** tipo CANS (CSA) | Tasa de dosis en tiempo real, neutrones | ✅ Estación, continuo |
| **Monitorización solar** (en tierra: SRAG de NASA, 24/7) | Aviso de tormenta solar (SPE) | ✅ Estación. En Marte, la alerta se genera **a bordo**: desde tierra llegaría hasta 20 min tarde |
| **Sensores de cabina** | CO₂, calidad del aire | ✅ Estación |
| **Tablet** | Ánimo, fatiga, síntomas | ✋ Astronauta |

### Dónde están las pantallas

| Pantalla | Para quién | Qué muestra | MVP |
|---|---|---|---|
| **Tablet personal** | El astronauta | ORBI completo: Today, Body, Decision | ✅ (*tablet-first*) |
| **Reloj** | El astronauta | Solo avisos: "check-in due", alertas | Solo en el pitch |
| **Panel del módulo médico** | CMO | Estado de toda la tripulación | Solo en el pitch |
| **Consola en tierra** | Cirujano de vuelo | El paquete recibido en la ventana de comunicación | Solo en el pitch |

### Un día con ORBI

1. **07:00, al despertar.** El reloj y la camiseta ya registraron la noche: 4,5 h de sueño, FC y SpO₂.
2. **Today.** En la tablet, los campos automáticos aparecen rellenos con la etiqueta *"Synced"*. Solo se pincha el dedo para la glucosa, mueve dos controles (ánimo y fatiga) y confirma. Son 90 s y la racha suma +1 🔥.
3. **Body.** La figura se colorea: Immune y Behavioral en ámbar. Al tocar Immune aparece la tendencia de 30 días frente a su línea base: *"Your temperature has been above baseline for 3 days."*
4. **Decision.** Nivel CONCERN, el "Because…" y 3 pasos concretos. ORBI sabe que la nave está a 14 min de la Tierra: *"Start local protocol now."*
5. **Escalado.** Llega un aviso al reloj del CMO. El paquete para el cirujano de vuelo queda en cola para la siguiente ventana de comunicación.
6. **Durante el día.** El reloj recuerda las tareas: el lunes toca presión arterial y masa, y la adherencia al ejercicio se cuenta sola.
7. **Evento solar.** Los sensores de la estación detectan una tormenta solar. Todas las tablets y relojes pasan a modo emergencia: halo rojo, ruta al refugio y checklist.

---

## 1. Cómo cubrimos el enunciado

Los jueces comparan contra el enunciado. Esta tabla es nuestro checklist.

| El enunciado pide / sugiere | Dónde está en ORBI | MVP |
|---|---|---|
| Herramienta visual de autoevaluación | Pantalla **Body** | ✅ |
| Figura humana clicable con estado y función | 6 sistemas + halo de radiación | ✅ |
| Guía de tratamiento y mejora | **Action card** en Decision | ✅ |
| Indicadores: PA, FC, **glucosa**, temperatura, sueño, ánimo | Check-in diario (todos menos PA, que es semanal) | ✅ (PA en datos sintéticos) |
| Pedir mediciones periódicamente | Check-in diario + recordatorio "Today" | ✅ |
| Código de colores | NOMINAL / WATCH / CONCERN / URGENT | ✅ |
| Gráficas dinámicas en el tiempo | Sparkline 30 días por sistema | ✅ |
| Gamificación | Racha de check-ins y contramedidas | ✅ (ligera) |
| Distintos entornos (nave, estación, base) | Selector de misión: ISS / Luna / Marte | ✅ |
| Cuándo avisar a la tripulación o a los cirujanos de vuelo | Escalado L0–L4 según latencia | ✅ |
| No asumir que el astronauta sabe | "Why this matters" + "Why we ask" en cada campo | ✅ |
| Entrada por cámara / imágenes | Foto adjunta en un check-in (sin análisis) | ⏳ deseable |

---

## 2. Las 5 amenazas → los 7 elementos del cuerpo

Cada elemento de la figura existe porque responde a una amenaza del NASA Human Research Program.

| Amenaza HRP | Elemento en ORBI | Indicadores (MVP) |
|---|---|---|
| **Space radiation** | **Halo** alrededor de la figura | Dosis acumulada vs. presupuesto de exposición, tasa de dosis, alerta SPE |
| **Isolation & confinement** | **Behavioral** (cerebro) | Sueño, ánimo, fatiga |
| **Distance from Earth** | No es un órgano: es el **escalado** | Latencia de la misión |
| **Gravity fields** | **Cardiovascular** · **Musculoskeletal** | FC en reposo, PA · masa corporal, adherencia al ejercicio, **pérdida ósea estimada** |
| **Hostile closed environment** | **Respiratory** (+ badge de cabina) | SpO₂, CO₂ de cabina |
| *(transversal: inmunidad y nutrición)* | **Immune** · **Metabolic** | Temperatura · glucosa |

**Los 6 sistemas del MVP:** Cardiovascular, Musculoskeletal, Immune, Metabolic, Respiratory, Behavioral. **Más el halo** de radiación.
Fuera del MVP (trabajo futuro, se menciona en el pitch): neuro-ocular (SANS), neurovestibular, piel.

**Frase del pitch:** *"Six systems and a halo. Every element on this body maps to one of NASA's five hazards of human spaceflight."*

---

## 3. Cadencia de medición

| Cadencia | Qué se mide | En el MVP |
|---|---|---|
| **Diario (~90 s)** | Los 7 campos del check-in (ver abajo) | **Se introduce a mano** |
| **Semanal** | PA, masa corporal, adherencia a contramedidas, dosis de la semana | Viene en los datos sintéticos |
| **Mensual** | Agudeza visual, dosis acumulada vs. presupuesto | Solo se menciona (trabajo futuro) |
| **Pre/post-vuelo (en Tierra)** | **Densidad ósea por DXA** (no se puede medir en vuelo) | En vuelo, ORBI muestra una **estimación** (§4.3) |
| **Evento** | SPE, lectura fuera de rango, síntoma agudo | Lo dispara el escenario |
| **Sensores de cabina** | CO₂, dosímetro de área | Datos sintéticos (no los introduce el astronauta) |

### Check-in diario: los 7 campos (lista cerrada)

| # | Campo | Unidad | "Why we ask" (texto corto en la UI) |
|---|---|---|---|
| 1 | Sleep | horas | La deuda de sueño es la primera señal de deterioro, antes de enfermar. |
| 2 | Mood | 1–5 | El aislamiento erosiona el ánimo poco a poco; lo medimos para verlo venir. |
| 3 | Fatigue / workload | 1–5 | La carga sostenida combinada con poco sueño es un factor de riesgo. |
| 4 | Resting heart rate | bpm | En microgravedad el corazón se desacondiciona; una subida puede indicar infección o estrés. |
| 5 | Body temperature | °C | Detección temprana de infección; en vuelo el sistema inmune cambia. |
| 6 | SpO₂ | % | Oxigenación; si baja junto al CO₂ de cabina, el problema puede ser el aire. |
| 7 | Blood glucose | mg/dL | Balance metabólico y nutricional, uno de los riesgos del HRP. |

Opcional: síntomas en texto libre (no lo usa el motor; va al paquete del cirujano).

---

## 4. Motor de decisión: reglas explicables, sin ML

### 4.1 Niveles

| Nivel | Color | Significado | Acción |
|---|---|---|---|
| **NOMINAL** | verde | Dentro de tu rango | Nada |
| **WATCH** | amarillo | Deriva incipiente | Repetir medición en 24 h, autocuidado |
| **CONCERN** | ámbar | Patrón que requiere atención | Action card + escalar al CMO |
| **URGENT** | rojo | Riesgo agudo | Protocolo inmediato + toda la tripulación |

### 4.2 Reglas simples (una señal → un nivel)

Los umbrales son **orientativos y van marcados con su fuente**. Los recursos oficiales ya están revisados (`recursos/`): solo el informe de fracturas da números aplicables. El resto sigue pendiente de contrastar con NASA-STD-3001 y criterios clínicos. Lo que no se pueda verificar se marca como `TODO verify` y se dice en el pitch.

| Indicador | WATCH | CONCERN | URGENT | Fuente (a verificar) |
|---|---|---|---|---|
| Temperatura | ≥ 37.5 °C o +2σ sobre la basal | ≥ 38.0 °C | ≥ 39.5 °C | Criterio clínico estándar de fiebre |
| SpO₂ | < 95 % | < 92 % | < 90 % | Criterio clínico estándar |
| FC en reposo | +10 bpm sobre la basal (2 días) | > 100 bpm | > 130 bpm | Criterio clínico + basal personal |
| Glucosa | > 140 o < 70 mg/dL | > 180 o < 54 mg/dL | < 40 mg/dL | Rangos ADA de hiper/hipoglucemia |
| Sueño | < 6 h × 2 noches | < 6 h × 3 noches | — | HRP: riesgo de sueño y fatiga |
| Ánimo | ≤ 2 × 3 días | ≤ 2 × 5 días | — | HRP: riesgo conductual |
| CO₂ cabina | Por encima del límite de NASA | — | — | NASA-STD-3001 Vol. 2 (`TODO verify` valor exacto) |
| Dosis acumulada | > 50 % del presupuesto | > 80 % del presupuesto | SPE activo | Presupuesto configurable (§4.3). Referencia: límite de carrera de NASA-STD-3001 Vol. 1, 600 mSv (`TODO verify`) |
| Hueso (adherencia al ejercicio) | Misión > 90 días y adherencia < objetivo 2 semanas seguidas | Lo anterior + misión > 6 meses **o** fase de superficie (gravedad parcial) | — | HRP Evidence Report – Fracture (`recursos/07`) |
| Hueso (actividad de riesgo) | — | Aviso en Decision si hay EVA o construcción planificada con Musculoskeletal en CONCERN | — | Fracture report: caídas laterales y saltos, eventos de más riesgo |

**Línea base personal:** media ± desviación de los 14 días de pre-vuelo de los datos sintéticos. Las reglas de "+Nσ" usan esa basal.

### 4.3 Dos indicadores que ORBI estima en lugar de medir

Las fuentes oficiales dejan claro que hay dos cosas que **no se pueden medir o fijar con precisión en vuelo**. ORBI no finge: lo muestra como **estimación** o **presupuesto**, con su fuente. Eso es un punto fuerte ante el jurado.

**Pérdida ósea estimada (Musculoskeletal)**
- La densidad ósea solo se mide con DXA **en la Tierra**, antes y después del vuelo.
- ORBI calcula `meses en microgravedad × 1–1,5 %` y lo muestra como un **rango**, siempre etiquetado como *"Estimated · NASA HRP evidence"*.
- La adherencia al ejercicio resistivo cambia el **estado**, no el número: *"On track with countermeasures"* o *"At risk: low exercise adherence"*. El informe dice que ejercicio + nutrición *"sufficiently reduced"* las pérdidas, pero no da un porcentaje, así que no lo inventamos.
- Demo (día 148, ~4,9 meses): **~4,9–7,4 % estimado sin contramedidas**.

**Presupuesto de exposición a la radiación (halo)**
- NASA reconoce que no hay conocimiento suficiente para fijar límites de exposición en misiones largas (`recursos/06`).
- ORBI muestra la dosis acumulada como **% de un presupuesto que fija el equipo médico de la misión** (`Scenario.exposureBudgetMSv`), con la tendencia y la tasa de dosis actual.
- Los 600 mSv de NASA-STD-3001 se usan como **valor por defecto** del presupuesto, presentados como *"current NASA career limit"*.
- Los escenarios de demo usan un presupuesto de **400 mSv** para que el halo sea legible en la tablet;
  600 mSv sigue siendo la referencia del límite de carrera y el valor por defecto del contrato.

**Textos "Why this matters" con respaldo oficial:**
- **Musculoskeletal:** *"In weightlessness, weight-bearing bones lose 1–1.5% of their mineral density every month, roughly what an elderly person loses in a year. Resistance exercise and good nutrition are the countermeasures that work."*
- **Halo:** *"You can't see or feel space radiation. It raises cancer risk and can affect your nervous system. NASA itself says deep-space exposure limits are still an open question, so ORBI tracks your budget and trend."*

### 4.4 Las 3 correlaciones del MVP (aquí se gana el jurado)

| Id | Señales | Lectura | Nivel | Action card |
|---|---|---|---|---|
| `early-infection` | Sueño < 6 h × 3 + temp ≥ 37.5 + FC ↑ | Posible infección temprana favorecida por la deuda de sueño | CONCERN | Medir temp cada 4 h · aislarse en el área de descanso · preparar paquete para el cirujano |
| `cabin-air` | SpO₂ ↓ **y** CO₂ de cabina ↑ en el mismo periodo | **No es el cuerpo, es el entorno** | WATCH (persona) + alerta de cabina | Revisar ventilación/scrubber · notificar · no tratar al paciente |
| `solar-event` | SPE activo (evento) | Exposición aguda a radiación | URGENT | Ir al refugio · checklist · registrar dosis · posponer EVA |

Las otras correlaciones del documento original (ortostática, nutricional, riesgo conductual) quedan como **trabajo futuro** y se mencionan en el pitch.

### 4.5 Salida del motor

```ts
{
  level: "CONCERN",
  system: "immune",
  ruleId: "early-infection",
  because: [
    "Temperature 37.9 °C (watch ≥ 37.5)",
    "Sleep 4.5 h × 5 nights (2.1σ below your baseline)",
    "Resting HR +11 bpm vs. your baseline"
  ],
  actions: ["Measure temperature every 4 h", "Rest in crew quarters, mask in common areas", "Prepare flight surgeon packet"],
  escalation: { now: "L1_CMO", next: "L2_FLIGHT_SURGEON", note: "Mars: 14 min one-way · reply in ~28 min+" }
}
```

---

## 5. Escalado × latencia

La latencia cambia la respuesta: el mismo CONCERN no se maneja igual a 0 segundos que a 14 minutos.

| Misión | Latencia (un sentido) | CONCERN | URGENT |
|---|---|---|---|
| **ISS** | ~0 s | Cirujano de vuelo ahora | Cirujano + equipo de tierra en vivo |
| **Luna** | ~1,3 s | Cirujano de vuelo ahora | Cirujano + equipo de tierra |
| **Marte** | hasta 20 min (NASA; demo: 14 min) | **Protocolo local primero** + paquete al cirujano | **Actuación local inmediata**, la decisión se toma a bordo |

**Escalera:** L0 autocuidado guiado → L1 CMO (compañero con formación médica) → L2 cirujano de vuelo → L3 especialistas en tierra → L4 emergencia (toda la tripulación).

> *"Communication delay isn't a network detail: it's a clinical variable."*

---

## 6. Pantallas del MVP (UI en inglés)

| # | Pantalla | Pregunta | Contenido |
|---|---|---|---|
| 1 | **Today** | ¿Qué me toca hacer? | Check-in de 7 campos: sueño, FC, SpO₂ y temperatura llegan prerellenados con la etiqueta *"Synced from wearable"*; ánimo, fatiga y glucosa son manuales. Botón "Confirm". Racha 🔥, estado general, misión/latencia actual |
| 2 | **Body** | ¿Cómo estoy? | SVG con 6 sistemas + halo. Al pulsar: estado, sparkline de 30 días con banda basal, "Why this matters" |
| 3 | **Decision** | ¿Qué tan grave es y qué hago? | Nivel, "Because…", action card, escalado según latencia, botón "Generate flight surgeon packet" |

**Barra de demo** (siempre visible, arriba): selector de escenario · selector de misión (ISS/Moon/Mars) · botón **"Next day ▶"**.

**Gamificación ligera:** racha de días con check-in + contador de contramedidas de la semana. Nada de puntos vacíos.

---

## 7. Datos y escenarios

Un tripulante, **14 días de pre-vuelo (basal) + 30 días de misión**, generados por script con ruido realista.

| Escenario | Qué pasa | Qué debe mostrar ORBI |
|---|---|---|
| `nominal` | Todo dentro de rango | Cuerpo en verde, racha activa |
| `early-infection` | Días 24–30: el sueño cae, la temperatura y la FC suben | Immune + Behavioral en ámbar → CONCERN, paquete para el cirujano |
| `cabin-co2` | Días 26–30: el CO₂ de cabina sube y la SpO₂ baja un poco | Respiratory en amarillo + **"Cabin issue, not you"** |
| `solar-event` | Día 30: SPE | Halo rojo, modo emergencia, protocolo de refugio |

---

## 8. Contrato de tipos (congelado)

El contrato canónico vive en **`src/domain/types.ts`**; los tipos del coach, en **`src/ai/types.ts`**.
Este documento no duplica la definición para evitar deriva: la fuente de verdad es el código.

Incluye, como mínimo:

- `Level`, `SystemId`, `Mission`, `MISSION_LATENCY_SECONDS`.
- `DailyReading`, `EnvReading`, `Scenario` (con `description`, `exposureBudgetMSv`, `priorDoseMSv`
  y `exerciseTargetMinPerDay`).
- `Assessment` (nivel, sistema, regla, `title`, `because`, `actions`, `escalation`, `source`).
- `Evaluation` (`bySystem`, `assessments`, `estimates`, `facts`, `latencySeconds`).
- `CoachFact`, `Estimates`; el coach añade `CoachSuggestion` y `CoachRequest`.

Reglas del contrato:

- `src/domain/` no importa React, DOM ni APIs del navegador.
- El formato de los JSON de escenarios se genera con `npm run gen` y se commitea.
- Cambiar `src/domain/types.ts`, `src/ai/types.ts`, `src/content/systems.ts` o la forma del JSON
  exige avisar a todo el equipo.

---

## 9. Stack y estructura

Todo el detalle (dependencias, comandos, carpetas, CI y riesgos) está en **`STACK.md`**. En resumen: Vite + React 19 + TypeScript, Tailwind, Recharts 3, Zustand, Vitest y Dokploy (Cloudflare delante). Sin backend. Node 22 fijado con `.nvmrc`. El motor vive en `src/domain/` y no importa React.

---

## 10. Niveles de alcance y reparto

**Regla: no se empieza un nivel hasta que el anterior se puede demostrar completo en la URL desplegada.**

| Nivel | Qué entra | Con cuántas personas |
|---|---|---|
| **0 · Núcleo** | Today, Body, Decision, DemoBar, 3 correlaciones, 4 escenarios | 2–3 |
| **1 · Diferencial** | **Trends** (gráficas con banda basal: el reto pide "dynamic charts") + **Mission Control** (nave ↔ tierra en dos ventanas con la cuenta atrás de la latencia) | 4–5 |
| **2 · Extra** | 2 procedimientos guiados (PA en microgravedad, test ortostático) · **test de visión con rejilla de Amsler** (SANS, cubre "camera/images") · vista CMO con 3 tripulantes · PWA offline | 5, y solo si el nivel 1 está el sábado por la noche |

**Mission Control es el momento wow:** el jurado *ve* la distancia a la Tierra. El paquete del cirujano viaja de la ventana de la nave a la de tierra con una cuenta atrás de 14 min (acelerada), y la respuesta tarda lo mismo en volver.

### Reparto

| Bloque | Entregable | Equipo de 3 | Equipo de 5 |
|---|---|---|---|
| **A · Motor + datos** | `src/domain/*`, tests, generador, escenarios JSON | 1 persona | 1 persona |
| **B · Body + Trends** | `BodyMap`, ficha de sistema, sparkline · (n1) `Trends` | 1 persona (sin Trends) | 1 persona |
| **C · Today + Decision** | Check-in con "Synced", racha, action card, escalado, DemoBar | 1 persona | 1 persona |
| **D · Mission Control + extras** | (n1) `MissionControl` · (n2) procedimientos, Amsler | — | 1 persona |
| **E · Diseño + pitch** | Bocetos, textos "explain", página del proyecto, vídeo, slides | Lo reparten todos el domingo | 1 persona |

**Integradora:** Andrea revisa y mergea los PR en `main`. Reglas del equipo en `STACK.md` §2. **Cambiar `src/domain/types.ts` exige avisar a todo el equipo.**

---

## 11. Calendario

| Cuándo | Qué | Hecho cuando… |
|---|---|---|
| **Jueves noche** | Cerrar esta v2 + BRIEF | Cabe en una página |
| **Viernes** | Leer recursos publicados · ajustar umbrales/fuentes · scaffold Vite + repo + CI + Dokploy · `types.ts` · motor + tests · generador de datos | CI en verde, URL pública |
| **Sábado mañana** | Onboarding (15 min con BRIEF) · bocetos en Figma/Excalidraw (30 min) · reparto de bloques · B y C en paralelo | Body muestra colores reales del motor |
| **Sábado tarde** | Decision + escalado + DemoBar + racha | **Nivel 0 completo en la URL** |
| **Sábado noche** | Si hay 4–5 personas: nivel 1 (Trends + Mission Control) | Nivel 1 demostrable |
| **Domingo hasta 12:00** | Pulido visual, textos, vídeo, página del proyecto en inglés | Código congelado |
| **Domingo 12:00–14:00** | Formulario de envío (revisar requisitos en *Participant Guides*) | **Enviado a las 14:00** |
| **Domingo 14:00–16:00** | Margen para imprevistos | — |

---

## 12. Roadmap (lo que no llegue, se cuenta al jurado como trabajo futuro)

Lo que no se construya de los niveles 1 y 2 (§10), más: calendario de cadencia, score de confianza, modo "explain" completo, correlaciones ortostática/nutricional/conductual, sistemas vestibular y piel, integración con wearables reales, voz.
**No construir:** ML de decisión, visión por computador, figura 3D, wearables reales, backend.
El coach local opcional es una capa de explicación, no un modelo de decisión.

---

## 13. Guion de demo (3 min)

1. **Gancho (20 s):** *"Day 148 on the way to Mars. 14 minutes from Earth, each way. The commander slept 4.5 hours for the fifth night in a row and has a temperature of 37.9 °C. No hospital. No evacuation."*
2. **Today (20 s):** *"07:00. The watch has already logged her sleep; the shirt, her heart rate and SpO₂."* Mostrar las etiquetas "Synced", introducir la glucosa y el ánimo, pulsar Confirm: la racha sube. *"90 seconds. She confirms, she doesn't type."*
3. **Body (40 s):** Immune y Behavioral en ámbar; pulsar → sparkline con la basal. *"Six systems and a halo, each mapped to a NASA hazard."*
4. **Decision (50 s):** CONCERN, "Because…", action card. Cambiar el selector de Mars a ISS: el escalado cambia. *"Delay is a clinical variable."*
   - *Con nivel 1:* pulsar "Send to flight surgeon". En la ventana de tierra, a la derecha, el paquete llega tras la cuenta atrás de 14 min (acelerada). *"This is what distance from Earth looks like."*
5. **Cabin CO₂ (20 s):** *"Cabin issue, not you."* El sistema distingue el cuerpo del entorno.
6. **Solar event (20 s):** halo rojo, protocolo de refugio.
7. **Cierre (10 s):** *"ORBI doesn't diagnose. It prioritizes, explains and escalates."*

Respaldo: grabar el vídeo de la demo el domingo por la mañana.

---

## 14. Preguntas del jurado (respuestas cortas)

- **¿Diagnostica?** No. Es soporte a la decisión: prioriza, explica y deriva.
- **¿Por qué no ML?** Porque en medicina espacial la explicabilidad pesa más que la precisión: cada alerta muestra su regla, su umbral y su fuente. El motor de decisión es determinista. Un modelo local puede añadirse solo como capa de explicación opcional, validada por guardrails y con fallback al template; nunca calcula umbrales ni niveles.
- **¿De dónde salen los umbrales?** De criterios clínicos estándar y de NASA-STD-3001, ajustados a la basal personal. Están en un solo archivo con su fuente, para que un médico pueda revisarlos.
- **¿Y si se cae la comunicación?** ORBI está pensado para funcionar sin la Tierra: decide a bordo y el paquete se envía en la siguiente ventana.
- **¿Cómo medís la densidad ósea en vuelo?** No la medimos: solo se puede con DXA en la Tierra. ORBI la **estima** con la evidencia del HRP (1–1,5 %/mes) y vigila la contramedida que sí se puede medir, el ejercicio.
- **¿Cuál es el límite de radiación para Marte?** NASA reconoce que todavía no se puede fijar. ORBI muestra la dosis contra un presupuesto que decide el equipo médico (por defecto, el límite de carrera actual de NASA).

**Vocabulario:** di "prioritizes and escalates", "decision support", "auditable rules on your personal baseline". No digas "diagnoses", "replaces the doctor", "AI predicts".
