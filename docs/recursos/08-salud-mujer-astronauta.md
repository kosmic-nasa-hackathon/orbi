# Salud de la mujer astronauta: ciclo, hormonas y anticoncepción

- **Tipo:** recurso **externo** (no está entre los oficiales del reto). Lo buscamos porque el equipo decidió tener en cuenta a la mujer astronauta.
- **Consultado:** 14 nov 2026
- **Fuentes principales:**
  - Mark, Scott, Donoviel, Leveton, Mahoney, Charles & Siegel. *The Impact of Sex and Gender on Adaptation to Space: Executive Summary.* **J Women's Health** 2014;23(11):941–947. Revisión encargada por NASA y NSBRI. https://pmc.ncbi.nlm.nih.gov/articles/PMC4236030
  - Cutigni, Cucina, Galante, Cerri & Bizzarri. *Microgravity impairs endocrine signaling and reproductive health of women. A narrative review.* **Frontiers in Physiology** 2025. https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2025.1558711/full
  - Jain & Wotring. *Menstrual Cycle Control in Female Astronauts* (NASA NTRS). https://ntrs.nasa.gov/api/citations/20150008176/downloads/20150008176.pdf
  - Goodale et al. *Wearable sensors reveal menses-driven changes in physiology…* **JMIR** 2019 (n=237). https://www.jmir.org/2019/4/e13404/
  - *Tracking sleep, temperature, heart rate and daily symptoms across the menstrual cycle* (anillo Oura). **Int J Women's Health** 2022. https://www.dovepress.com/tracking-sleep-temperature-heart-rate-and-daily-symptoms-across-the-me-peer-reviewed-fulltext-article-IJWH
  - Trombosis yugular en la ISS: Auñón-Chancellor et al., **NEJM** 2020;382:89-90. Resumen en https://www.auntminnie.com/clinical-news/ultrasound/article/15624993/ultrasound-detects-astronauts-blood-clot-in-space
  - Límite de radiación único desde 2022: https://www.nationalacademies.org/news/nasa-should-update-astronaut-radiation-exposure-limits-improve-communication-of-cancer-risks · https://www.frontiersin.org/articles/10.3389/fnume.2022.997718

> Ninguna de estas fuentes da umbrales clínicos para un software. Son evidencia para **diseñar** ORBI, no para diagnosticar. La mayor parte de lo que se sabe sobre hormonas en microgravedad viene de **roedores y células**. Hay muy pocos datos humanos.

## La idea clave en una línea

Si ORBI usa la misma línea base todo el mes, **la fase lútea del ciclo puede parecer el inicio de una infección**: sube la temperatura y sube la FC en reposo. Una línea base que tenga en cuenta el ciclo evita esa falsa alarma y es un "no eres tú" del mismo tipo que *"Cabin issue, not you"*.

## Datos clave

### 1. El ciclo cambia las constantes que vigila ORBI
- Tras la ovulación, la progesterona sube la **temperatura de la piel de la muñeca 0,28–0,56 °C** (Goodale 2019, wearable de muñeca; también cambian la FC y la frecuencia respiratoria, todo con *p* < 0,001).
- La **FC en reposo sube 2–7 lpm** de la fase folicular a la lútea. En un estudio prospectivo con 91 mujeres fue **+3,8 lpm** a mitad de la fase lútea frente a la menstruación.
- El estudio con Oura (2022) encuentra un patrón **bifásico**: la temperatura distal y la FC durante el sueño son más altas en la fase lútea media y tardía.
- 👉 En ORBI, la regla de temperatura "+2σ sobre la basal" y la de FC "+10 lpm" pueden saltar por el ciclo y no por enfermedad.

### 2. Muchas astronautas suprimen la regla, pero no es obligatorio
- Opción habitual: **anticonceptivo oral combinado tomado de forma continua** (sin semana de descanso) para no menstruar. *"There is no official requirement to do so"* (Cutigni 2025).
- Motivo práctico: en el segmento estadounidense, el sistema que recicla el agua **no se diseñó para procesar sangre menstrual** (Jain & Wotring).
- Problemas abiertos:
  - No se ha probado la **estabilidad de los fármacos hormonales** durante tanto tiempo ni con la radiación del espacio profundo. Para una misión a Marte de unos 3 años habría que llevar **~1.100 pastillas**.
  - Los **DIU e implantes** (anticoncepción de larga duración) se ven como alternativa, pero apenas se han estudiado en astronautas. Se recomienda colocarlos **1,5–2 años antes** de la misión.
  - Algunos métodos inyectables (**DMPA / Depo-Provera**) se asocian en la Tierra a **menor densidad ósea**, que en el espacio ya se pierde a 1–1,5 %/mes.

### 3. Trombosis venosa: el caso de 2019
- Dos meses después de empezar una misión de 6 meses en la ISS, una astronauta encontró un **trombo en la vena yugular** con una **ecografía que se hizo ella misma** para un estudio. Radiólogos en tierra guiaron la confirmación.
- La trataron desde tierra: enoxaparina del botiquín y después apixabán, que llegó en una nave de carga. En la ISS **no había fármaco para revertir el anticoagulante**.
- Tras el caso, NASA puso en marcha vigilancia ocupacional de la trombosis venosa.
- La anticoncepción hormonal aumenta el riesgo de trombosis en la Tierra. Una revisión de NASA concluye que las astronautas que la toman no tienen más riesgo que la población general que la toma.
- 👉 Es el ejemplo perfecto del reto: **detección temprana a bordo + decisión con la Tierra lejos**.

### 4. Otras diferencias por sexo (Mark 2014)
| Sistema | Qué se observa | Relevancia |
|---|---|---|
| **Cardiovascular** | Las mujeres sufren más **intolerancia ortostática** al volver a la gravedad (pierden más plasma y tienen menos resistencia vascular en las piernas) | Llegada a Marte: la astronauta debe ponerse de pie tras ~6 meses de tránsito |
| **Visión (VIIP/SANS)** | Afecta al 82 % de los hombres y al 62 % de las mujeres estudiados (sin diferencia significativa). *"All clinically significant cases described thus far have occurred in male astronauts"* | No hace falta tratarlo distinto |
| **Inmune** | Respuesta inmune más fuerte en mujeres: menos infecciones, más autoinmunidad | — |
| **Urinario** | **Infecciones urinarias más frecuentes en mujeres** en vuelo; solo mujeres necesitaron sondaje | Causa posible a considerar cuando hay fiebre |
| **Mareo espacial** | 50 % de las mujeres frente a 38 % de los hombres al llegar a microgravedad (sin diferencia significativa) | — |
| **Hueso** | **Sin diferencia por sexo** en el ritmo de pérdida: ~1,5 %/mes en misiones de 49–215 días (Smith 2014, citado en Cutigni) | La fórmula ósea de ORBI vale para todos |
| **Conducta** | *"There is no evidence of sex differences in terms of behavioral or psychological responses to spaceflight"* | — |

### 5. Radiación: el límite ya no depende del sexo
- **Antes de 2022:** el límite dependía de la edad y el sexo. A los 45 años, la duración máxima de misión por radiación era de **187 días para mujeres** y **344 para hombres** (Mark 2014).
- **Desde 2022:** NASA fija un **límite de carrera único de 600 mSv para todas las edades y sexos**. Sigue la recomendación de las Academias Nacionales (2021), calculada sobre el caso más sensible: una mujer de 35 años (3 % de riesgo de muerte por cáncer inducido).
- Hay críticas: F. Cucinotta (exresponsable de radiación de NASA) avisa de que una mujer de 35 años en el límite tendría *"over 10 percent chance of dying in 15 to 20 years"* tras una misión a Marte.
- 👉 Esto **confirma el valor por defecto de 600 mSv** del presupuesto de exposición de ORBI.

### 6. Faltan datos, y eso también es un argumento
- **155 de 681** personas que han ido al espacio son mujeres (**22,7 %**) (Cutigni 2025).
- **No hay medidas directas** de hormonas ováricas en vuelo, solo *"some anecdotal cases"*. Además, el anticonceptivo enmascara cualquier medida.
- *"The impact of the space environment outside of LEO on gynecological concerns remains unknown."* (Steller 2020, citado en Cutigni)
- *"These findings reinforce the need for a specific women's health database."* (Cutigni 2025)
- En el estudio de HERA, la camiseta biométrica de prueba **no se ajustaba bien a las tripulantes**: *"current prototype garment design is less than optimal for female crew"*. El hardware también tiene sesgo.

## Cómo lo usamos en ORBI

1. **Línea base consciente del ciclo** (`baseline.ts`). Si la astronauta lo activa (`cycle: "tracked"`), la basal se calcula **por fase** (folicular / lútea) con los ciclos registrados en el entrenamiento en tierra. Las reglas "+Nσ" usan la basal de la fase en la que está.
   - **Regla de seguridad:** el ajuste solo afecta a las reglas relativas a la basal. **Los umbrales clínicos absolutos (≥ 38,0 °C, > 100 lpm…) no se relajan nunca.**
2. **Escenario `luteal-phase`.** La temperatura y la FC suben como al principio de `early-infection`, pero el sueño está bien y las subidas encajan con su fase lútea. ORBI muestra *"Expected cycle variation, not infection"* en NOMINAL, con el "Because…".
3. **Perfil de tripulante** con `cycle: tracked / suppressed / n/a` y el método anticonceptivo (opcional).
   - Si es `suppressed`: aviso logístico de que la reserva de medicación debe cubrir la misión con margen (nivel 2).
   - Si es `dmpa`: nota en la ficha ósea (nivel 2).
4. **Privacidad.** El dato reproductivo es *opt-in*, solo lo ve ella y **no viaja a Mission Control** salvo que lo autorice (`shareReproductiveWithGround`). Al centro de control llega la conclusión ("expected cycle variation"), no el dato.
5. **Trabajo futuro con respaldo:** procedimiento guiado de ecografía yugular (caso de 2019), preparación ortostática antes de la llegada a la superficie e infección urinaria como causa posible en `early-infection`.
6. **Pitch:** *"Most spaceflight data comes from men. ORBI treats a woman's cycle as part of her baseline, not as noise, and she decides who sees it."*
