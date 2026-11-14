# ORBI — Brief de equipo (léelo en 2 minutos)

**Reto:** NASA Space Apps 2026 · *Create Health Monitoring Software for Astronauts on Space Missions*
**Entrega:** domingo 16:00 (nosotros enviamos a las **14:00**) · **Código congelado domingo 12:00**

## Qué es
Una app de tablet en la que el astronauta hace un **check-in diario de 90 segundos**. El reloj y la camiseta biométrica ya traen sueño, FC, SpO₂ y temperatura; él confirma y añade ánimo, fatiga y glucosa. Después ORBI le muestra:
1. **Body**: una figura con 6 sistemas en colores y un **halo** de radiación alrededor.
2. **Decision**: qué tan grave es, **por qué** (la regla que se disparó) y **qué hacer**.
3. **A quién avisar**, según la latencia de la misión (ISS ≈ 0 s · Luna ≈ 1,3 s · Marte hasta 20 min por sentido; en la demo, 14 min).

> *From drift to decision.* ORBI no diagnostica: prioriza, explica y escala.

## Por qué gana
- Cada elemento del cuerpo corresponde a una de las **5 amenazas de NASA**.
- **Reglas explicables** con fuente, no una caja negra.
- **La latencia es una variable clínica**: en Marte se actúa a bordo primero.
- Distingue **el cuerpo del entorno**: "Cabin issue, not you" (CO₂).
- **Pensado también para la mujer astronauta.** En la fase lútea suben la temperatura y la FC, y ORBI no lo confunde con una infección: *"Expected cycle variation, not infection."* El dato es opt-in y **no viaja a la Tierra sin su permiso**. Los umbrales clínicos absolutos no se relajan nunca.
- **"Train like you fly":** ORBI se usa desde el entrenamiento en tierra (90 días), y ahí aprende la **línea base personal** con la que compara cada lectura en vuelo.
- **Es honesto con lo que no se puede medir:** la pérdida ósea se **estima** con evidencia de NASA (1–1,5 %/mes) y la radiación se muestra frente a un **presupuesto**, porque NASA reconoce que aún no hay límites para misiones largas.
- **Todo con fuentes**: las oficiales de NASA y la CSA, más revisiones científicas sobre salud femenina y entrenamiento (`recursos/08` y `09`).

## Alcance por niveles
**Nivel 0 · Núcleo (obligatorio)**
- 3 pantallas: **Today** (check-in + racha), **Body**, **Decision**
- 7 campos diarios: sueño, ánimo, fatiga, FC, temperatura, SpO₂, glucosa, más un campo opt-in de ciclo ("period today?")
- 4 correlaciones: infección temprana · **ciclo (falsa alarma evitada)** · aire de cabina · evento solar
- 2 reglas de hueso: adherencia al ejercicio en misiones de más de 90 días / más de 6 meses o en superficie
- 2 estimaciones: **pérdida ósea estimada** (Musculoskeletal) y **% del presupuesto de radiación** (halo)
- Barra de demo: escenario · misión · "Next day ▶" · Reset · interruptor "Cycle-aware baseline"
- Datos sintéticos de una comandante: **90 días de entrenamiento en tierra** (basal) + 30 de misión (días 119–148 de camino a Marte); **5 escenarios** (nominal, early-infection, luteal-phase, cabin-co2, solar-event); sin backend

**Nivel 1 · Si somos 4–5:** **Trends** (gráficas con la banda *"Your ground baseline"* y el ciclo superpuesto) + **Mission Control**: nave y tierra en dos ventanas, y el paquete del cirujano viaja con la cuenta atrás de la latencia.
**Nivel 2 · Si sobra tiempo:** procedimientos guiados (incl. ecografía yugular) · test de visión (rejilla de Amsler) · vista CMO · offline.

No se empieza un nivel hasta que el anterior funciona en la URL desplegada.

## Stack
Vite + React 19 + TypeScript · Tailwind + shadcn/ui · Recharts 3 · Zustand · Vitest · Dokploy · Node 22. **UI y entrega en inglés.** Detalle en `STACK.md`.

## Bloques (elige uno)
| Bloque | Qué | Perfil |
|---|---|---|
| A · Motor + datos | Reglas, correlaciones, estimaciones, `evaluate()`, basal por fase del ciclo, tests (las 6 reglas + la regla de seguridad del ciclo), escenarios JSON | TS lógico |
| B · Body + Trends | Figura SVG clicable, sparkline, gráficas | Front / diseño |
| C · Today + Decision | Check-in, racha, action card, escalado | Front React |
| D · Mission Control + extras | Ventana de tierra, procedimientos, Amsler | Front React |
| E · Diseño + pitch | Bocetos, textos, página del proyecto, vídeo, slides | Comunicación / diseño |

El contrato entre bloques es `src/domain/types.ts`: **no se cambia sin avisar a todo el equipo.** PR pequeños con CI en verde; `@Agupane` integra en `main` cada 3–4 h (`@atapiamallea` como backup). Reparto en `docs/TEAM.md`.

## Hitos
- **Viernes:** repo + CI + URL desplegada, motor con tests en verde
- **Sábado tarde:** nivel 0 completo en la URL
- **Sábado noche:** nivel 1 (si somos 4–5)
- **Domingo 12:00:** código congelado → vídeo + envío

Detalle completo en `CONCEPTO-ORBI.md`. Fuentes resumidas en `recursos/README.md`.

---

### Project summary (EN, para el formulario de envío)
ORBI is a health autonomy console for astronauts on long-duration missions. Wearables pre-fill sleep, heart rate, SpO₂ and temperature; in a 90-second daily check-in the astronaut confirms them and adds mood, fatigue and blood glucose. This feeds an auditable rules engine that compares each reading against the astronaut's personal baseline, learned during ground training ("train like you fly"). The baseline is cycle-aware: when a crew member opts in, ORBI knows that temperature and resting heart rate rise naturally in the luteal phase and doesn't mistake that for an infection, while absolute clinical thresholds always apply. Reproductive data stays with her unless she chooses to share it with the ground. The result is shown on an interactive body map: six physiological systems, each mapped to one of NASA's five hazards of human spaceflight, plus a radiation "halo". When a pattern emerges, ORBI explains why, gives a step-by-step action card and adapts escalation to communication delay: on Mars, act on board first. It also tells cabin problems apart from crew health problems. Where something can't be measured in flight, ORBI says so: bone loss is estimated from NASA Human Research Program evidence and tracked through exercise adherence, and radiation is shown against an exposure budget, since NASA notes that deep-space limits are still an open question. ORBI doesn't diagnose: it prioritizes, explains and escalates.
