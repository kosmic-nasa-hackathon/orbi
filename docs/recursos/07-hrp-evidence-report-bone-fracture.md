# HRP Evidence Report — Risk of Bone Fracture due to Spaceflight-induced Changes to Bone

- **Fuente (PDF, 34 páginas):** https://humanresearchroadmap.nasa.gov/Evidence/reports/Fracture.pdf
- **Organismo:** NASA · Human Research Program · Exploration Medical Capabilities Element · Johnson Space Center
- **Publicado:** 12 may 2017 (*Approved for Public Release*) · **Consultado:** 13 nov 2026
- **Autores:** Jean D. Sibonga (NASA JSC), Harlan J. Evans, Scott A. Smith, Elisabeth R. Spector, Greg Yardley (KBRwyle)
- **Llegamos aquí desde:** la subpágina *Gravity Fields* de los Hazards (cita la pérdida de 1–1,5 %/mes)

> Es un informe de evidencia científica, no una guía clínica. Es de 2017: puede haber datos más recientes.

## Declaración del riesgo

*"Given that spaceflight may induce adverse changes in bone ultimate strength... there is a possibility a fracture may occur for activities otherwise unlikely to induce fracture prior to initiating spaceflight."*

## Datos clave

### Ritmo de pérdida ósea
- **Pérdida de densidad mineral ósea (BMD) de 1–1,5 % al mes** en zonas que en la Tierra soportan peso (**cadera, columna lumbar, piernas**). Medida por DXA antes y después de misiones típicas de **4–6 meses**.
- Hay **mucha variación** entre zonas del esqueleto y entre tripulantes.
- La pérdida mensual de un astronauta es **casi igual a la pérdida anual** de una persona mayor en las mismas zonas.
- **No se sabe** si la pérdida se estabiliza o sigue en misiones más largas, ni si es **lineal o exponencial**. Como la recuperación en Tierra es asintótica, se especula que la pérdida sigue un patrón parecido.
- **No se sabe** si la gravedad parcial (Luna, Marte) la mitiga. Estudios en roedores sugieren que la carga parcial **no la previene** o solo la **reduce de forma proporcional**.
- En misiones de **menos de 90 días** no se detectan pérdidas significativas.

### Qué se mide hoy (requisitos médicos)
- **DXA** de cadera, columna lumbar, cuerpo entero, antebrazo y calcáneo: **dentro de los 45 días antes del lanzamiento** y **~5 días después del aterrizaje**. *No se hace en vuelo.*
- **Biomarcadores de recambio óseo** en sangre y orina: antes, durante y después del vuelo (las muestras se analizan en la Tierra).
  - Los marcadores de **resorción** (destrucción de hueso) **suben al principio del vuelo** y se mantienen altos hasta la vuelta.
  - Los de **formación** no cambian o bajan en vuelo, y suben ~1 mes después del aterrizaje.
- **Estándar de NASA:** ningún astronauta debe volver con un **T-score ≤ −2,0** (cuello femoral, trocánter o columna). Ningún astronauta de larga duración lo ha superado.

### Recuperación
- Recuperar el hueso cuesta **mucho más** que perderlo; en algunos casos se recupera la BMD a los **6 meses** de la vuelta, según la edad, la nutrición y la actividad.
- En 8 tripulantes de la ISS persistían déficits en cadera y columna **2–4 años después** de volver.

### Contramedidas que funcionan
- El **ARED** (Advanced Resistive Exercise Device, desde 2009) junto con una **nutrición adecuada** han **reducido de forma suficiente** las pérdidas observadas tras el vuelo.
- **Vitamina D:** se observan déficits tras misiones de ~6 meses; pueden afectar la coordinación neuromuscular y aumentar el riesgo de caída si no se mantiene la suplementación fuera de la órbita baja.
- El **calcio**: el esqueleto es la reserva de calcio del cuerpo. En misiones de más de un año, el **equilibrio de calcio podría ser un problema mayor que las fracturas**.

### Riesgo de fractura por misión (Tabla 5 y Figura 4)

| Misión | Ida (días) | Estancia (días) | Vuelta (días) |
|---|---|---|---|
| Luna corta | 3 | 8 | 3 |
| Luna larga | 5 | 170 | 5 |
| Marte corta | 162 | 40 | 162 |
| Marte larga | 189 | 540 | 189 |

- La probabilidad de fractura **aumenta con la duración**: **0,02 % (Luna) → 2,0 % (Marte)**.
- La gravedad de la Luna es ~1/6 g y la de Marte ~1/3 g (el informe usa **0,38 g** para Marte).
- Las actividades con más riesgo son las **caídas laterales** y los **saltos desde 2 m**.

### Factor de riesgo (carga aplicada / carga de fractura; > 1 = fractura probable)

| Situación | Factor de riesgo |
|---|---|
| Astronauta antes del vuelo | 0,89 ± 0,21 |
| **Astronauta en la Tierra tras una misión a Marte** | **1,07 ± 0,30** |
| Mujeres de 70–80 años | 1,04 ± 0,37 |
| Astronauta en Marte (0,38 g) | 0,66 ± 0,15 |

**Conclusión del informe:** un tripulante que vuelve de Marte tendría un riesgo de fractura en la Tierra **comparable al de una mujer posmenopáusica mayor** (sobre todo en caídas posterolaterales).

### Otros factores que aumentan el riesgo de caída/fractura
Problemas de **visión**, pérdida de **coordinación neuromuscular**, **atrofia muscular**, problemas de movilidad, menor cognición o juicio; trajes EVA pesados; tareas en superficie (construir hábitats, saltar de escaleras, salidas del vehículo). Tras volver: inestabilidad postural, alteraciones de la marcha y de la agudeza visual dinámica.

### Lagunas de conocimiento (Gaps)
1. No se sabe cómo afecta el vuelo a la **curación de fracturas** en vuelo (la microgravedad podría impedirla y causar complicaciones como **sepsis o trombos**).
2. Hay que caracterizar las cargas sobre el hueso en las actividades normales de la misión.
3. Falta un método validado para estimar el riesgo de fractura.

## Cómo lo usamos en ORBI

**Umbrales y datos para el sistema Musculoskeletal:**

1. **Lo que NO se puede medir a diario:** la densidad ósea solo se mide con DXA en la Tierra. ORBI **no debe fingir que mide la BMD en vuelo**. En su lugar:
   - **Estimación de la pérdida ósea** = días en microgravedad × 1–1,5 %/mes, **modulada por la adherencia al ejercicio**. Etiquetarla siempre como *"estimated, based on NASA HRP evidence"*.
   - En la demo (día 148, ~4,9 meses): **~4,9–7,4 % estimado sin contramedidas**. Con buena adherencia al ejercicio resistivo, el texto dice que ARED + nutrición *"sufficiently reduced"* las pérdidas.
   - ⚠️ No inventar un % de reducción por ejercicio: el informe no lo da. Mostrar dos estados: *"on track with countermeasures"* / *"at risk: low exercise adherence"*.
2. **Reglas posibles para `rules.ts` (Musculoskeletal):**

   | Regla | Nivel | Fuente |
   |---|---|---|
   | Misión > 90 días y adherencia al ejercicio < objetivo 2 semanas seguidas | WATCH | Fracture report: sin pérdidas < 90 días; ARED como contramedida |
   | Lo anterior + misión > 6 meses o fase de superficie (gravedad parcial) | CONCERN | Fracture report: *"missions >6 months or fractional gravity could create higher fracture risk"* |
   | Actividad planificada de alto riesgo (EVA, construcción) con estado CONCERN | Aviso en Decision | Fracture report: caídas y saltos como eventos de mayor riesgo |

3. **"Why this matters" de Musculoskeletal** (texto con respaldo):
   *"In weightlessness, weight-bearing bones lose 1–1.5% of their mineral density every month, roughly what an elderly person loses in a year. Resistance exercise and good nutrition are the countermeasures that work."*
4. **Argumento fuerte para el pitch (Mars return):** *"After a Mars mission, an astronaut's hip-fracture risk on Earth is estimated to be comparable to a woman in her 70s."* (Factor de riesgo 1,07 frente a 1,04, Tabla 6.)
5. **Correlaciones nuevas (roadmap):** baja adherencia al ejercicio + mareo/alteración de la marcha → **riesgo de caída** (une Musculoskeletal con Cardiovascular/Vestibular).
6. **Fases de misión:** la Tabla 5 da **duraciones reales** de referencia (Marte larga: 189 + 540 + 189 días). Sirven para el selector de misión y para el día de la demo: el día 148 cae **en tránsito a Marte** (la ida dura 162–189 días), coherente con el gancho *"Day 148 on the way to Mars"*.
7. **Metabolic / nutrición:** la **vitamina D** y el **calcio** son candidatos a action cards (*"Take vitamin D supplement as prescribed"*) y conectan hueso con nutrición.
8. **Curación de fracturas incierta + riesgo de sepsis/trombos** respalda la idea central: en Marte, **prevenir** es mucho más importante que tratar.
