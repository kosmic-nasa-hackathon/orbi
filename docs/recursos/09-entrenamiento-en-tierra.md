# Fase de entrenamiento en tierra: ¿sirven los datos para el vuelo?

- **Tipo:** recurso **externo** (no está entre los oficiales del reto). Responde a la pregunta del equipo: *¿los datos del entrenamiento en tierra se pueden correlacionar con los del espacio, o solo sirven como histórico o para investigación?*
- **Consultado:** 14 nov 2026
- **Fuentes principales:**
  - NASA, *Spaceflight Standard Measures*. https://www.nasa.gov/reference/standard-measures/ (ver también `03-nasa-hrp-ongoing-research.md`)
  - Estudio en HERA de la prenda biométrica AstroSkin (NASA NTRS). https://ntrs.nasa.gov/api/citations/20190001996/downloads/20190001996.pdf
  - Tolerancia ortostática tras el vuelo, con familiarización a L-180 y medidas a L-90 y L-60. **Frontiers in Physiology** 2020. https://www.frontiersin.org/articles/10.3389/fphys.2020.00784/pdf
  - *Lifetime Surveillance of Astronaut Health* (LSAH) y estudios de visión (NASA NTRS). https://ntrs.nasa.gov/api/citations/20180004705/downloads/20180004705.pdf
  - Mark et al. 2014, *J Women's Health* (variabilidad individual). https://pmc.ncbi.nlm.nih.gov/articles/PMC4236030
  - `07-hrp-evidence-report-bone-fracture.md` (DXA antes y después del vuelo)

## Respuesta corta

**Las dos cosas, con distinto peso:**

| Capa | Para qué | ¿En tiempo real? | Solidez de la evidencia |
|---|---|---|---|
| **1. Línea base personal** | Comparar cada lectura en vuelo con *el rango normal de esa persona*, medido en tierra | ✅ Sí, es el uso operativo | **Alta.** Es lo que ya hace NASA con sus medidas antes del vuelo |
| **2. Calibración / predicción** | Usar la respuesta a pruebas del entrenamiento para ajustar umbrales o anticipar quién tiene más riesgo | ⚠️ Con prudencia | **Media-baja.** Hay indicios, no modelos validados |
| **3. Histórico e investigación** | Comparar antes, durante y después del vuelo, y alimentar estudios a largo plazo | ❌ No | **Alta**, pero solo sirve para el futuro |

## Datos clave

### NASA ya mide mucho antes del lanzamiento
"L-180" significa 180 días antes del lanzamiento, "FD14" el día 14 de vuelo y "R+30" 30 días después del regreso.

| Medida | Antes del vuelo | En vuelo | Después |
|---|---|---|---|
| Capacidad aeróbica (VO2peak) | L-180, L-60 | Sí | Sí |
| Fuerza muscular | L-90, L-30 | FD14 y antes del regreso | R+5, R+14, R+30 |
| Standard Measures (actigrafía, cognición, microbioma, grosor carotídeo, sensoriomotor) | L-180, L-90 | Sí | Sí |
| Tolerancia ortostática | Familiarización ~L-180, medidas a L-90 y L-60 | — | Tras el aterrizaje |
| Densidad ósea (DXA) | En los 45 días previos | **No se puede** | ~R+5 |
| Medidas corporales (requisito de 2026) | L-30 | Días 7, 90, 180 y R-14 | R+1 a R+5 |

- El objetivo de Standard Measures es construir un **archivo común**: *"The data from these measures will be placed in an archive managed by HRP."*
- Las puntuaciones cognitivas se expresan como **desviación respecto a la basal previa al vuelo** de cada persona. Es la misma lógica que ORBI.
- Un informe menciona tres sujetos con datos en vuelo **sin medidas previas**: los autores no pudieron saber si esos datos eran válidos. **Sin basal de tierra, el dato de vuelo pierde valor.**

### Los análogos en tierra se usan precisamente para esto
- En **HERA** (misiones de aislamiento de 30 días en Houston), la prenda AstroSkin se probó con una **basal previa a la misión** (entrenamiento + ejercicio submáximo) y otra posterior de 24 h. Uno de los objetivos: *"obtain baseline data used for further development of algorithms and tools that facilitate decision making for medical support"*. Conclusión: puede usarla *"autonomous crew for health monitoring, evaluating countermeasure efficacy, and fitness evaluations"*.
- Otros análogos: CHAPEA (hábitat de Marte simulado durante un año), NEEMO (bajo el agua) y el entrenamiento de EVA en piscina (NBL).

### Indicios de predicción (capa 2)
- La respuesta del músculo y el hueso a la falta de carga **varía unas 10 veces entre personas** (Mark 2014). Por eso la comparación personal importa más que la de población.
- Quienes desarrollaron **edema de papila** (SANS) tenían un **diámetro de vaina del nervio óptico mayor antes del vuelo** (LSAH). Es un indicio de que un valor medido en tierra señala riesgo.
- En un estudio, la prueba en vuelo **no predijo** quién tendría hipotensión ortostática al volver (2 de 8 sujetos). **La predicción no siempre funciona.**

### Para una mujer astronauta, la fase en tierra es imprescindible
- Para aprender *su* patrón de ciclo (cuánto le suben la temperatura y la FC en la fase lútea), ORBI necesita **2–3 ciclos registrados** (~90 días). Eso solo puede salir del entrenamiento. Ver `08-salud-mujer-astronauta.md`.

### Una laguna que ORBI cubre
- *"Information about inflight astronaut health is also obtained in multiple research protocols but the data is not available to astronauts until after the mission is completed"* (UCSF Space Health). ORBI devuelve el dato a la astronauta **durante** la misión.

## Cómo lo usamos en ORBI

1. **Cronología de la misión:** `TRAINING → TRANSIT → SURFACE → RETURN` (`Phase` en los tipos). ORBI se usa ya en tierra, con la idea de **"Train like you fly"**:
   - la astronauta se acostumbra al check-in de 90 s;
   - se genera su línea base (y la del ciclo, si la activa);
   - el cirujano de vuelo prueba las reglas con ella antes de despegar.
2. **Datos sintéticos:** **90 días de entrenamiento** (días −90 a −1), no 14. La basal sale de ahí.
3. **Capa 1 en la UI (nivel 1):** en Trends, la banda *"Your ground baseline"* detrás de cada gráfica, con el ciclo superpuesto si está activo.
4. **Capa 2, solo como etiqueta prudente:** cuando un umbral se ajusta con datos del entrenamiento, se muestra *"Calibrated on your training data"*. Nunca se presenta como predicción ni diagnóstico. Ejemplo para el pitch: la recuperación de FC en el entrenamiento de EVA en piscina como referencia para las EVA en Marte.
5. **Capa 3 (roadmap):** exportar los datos anonimizados, con consentimiento, para LSAH y Standard Measures, y mostrar el antes/después del regreso (R+5, R+30).
6. **Pitch:** *"Ground training isn't just history. It's how ORBI learns what normal looks like for you, before you leave Earth."*
