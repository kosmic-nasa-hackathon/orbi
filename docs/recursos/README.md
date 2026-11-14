# Recursos del reto

Recursos publicados por NASA Space Apps 2026 para *Create Health Monitoring Software for Astronauts on Space Missions*. Un archivo por recurso, cada uno con su resumen y una sección **"Cómo lo usamos en ORBI"**.

| # | Recurso | Organismo | Para qué nos sirve sobre todo |
|---|---|---|---|
| 01 | [5 Hazards of Human Spaceflight](01-nasa-hrp-hazards.md) (+ las 5 subpáginas) | NASA HRP | Base del mapa corporal; citas sobre sueño/circadiano/carga, latencia de hasta 20 min y pérdida ósea de 1–1,5 %/mes |
| 02 | [Risks of Human Spaceflight](02-nasa-hrp-risks.md) | NASA HRP | Correspondencia sistema → riesgo oficial; *Inadequate Systems Operations Support* = el problema que resuelve ORBI |
| 03 | [Ongoing HRP Research](03-nasa-hrp-ongoing-research.md) | NASA HRP | ARCHeR y Standard Measures validan el check-in; Tempus Pro como precedente |
| 04 | [Monitoring radiation for astronaut health](04-csa-monitoring-radiation.md) | CSA | Fuente del halo (CANS, continuo y autónomo); ~30 % de la radiación en la ISS son neutrones |
| 05 | [Why do we conduct science in space?](05-csa-why-science-in-space.md) | CSA | Latencia y falta de asistencia médica como riesgos; impacto en la Tierra |
| 06 | [Space Radiation – monitorización](06-nasa-space-radiation-monitoring.md) | NASA JSC | Dosímetros reales (CPD, RAM, TEPC); NASA reconoce que **no hay límites de dosis para misiones largas** |
| 07 | [Evidence Report: Bone Fracture](07-hrp-evidence-report-bone-fracture.md) | NASA HRP | Pérdida ósea de 1–1,5 %/mes, duraciones de misión, factor de riesgo tras volver de Marte; reglas para Musculoskeletal |

### Recursos externos (no oficiales del reto)

Se añadieron cuando el equipo decidió tener en cuenta a la mujer astronauta y la fase de entrenamiento en tierra. Son revisiones científicas y documentos de NASA; cada archivo cita sus fuentes.

| # | Recurso | Fuentes | Para qué nos sirve sobre todo |
|---|---|---|---|
| 08 | [Salud de la mujer astronauta](08-salud-mujer-astronauta.md) | NASA/NSBRI (J Women's Health 2014), Front. Physiol. 2025, NTRS, JMIR | La fase lútea sube temperatura y FC → **línea base consciente del ciclo**; supresión menstrual, trombosis de 2019, límite de radiación único de 600 mSv desde 2022 |
| 09 | [Entrenamiento en tierra](09-entrenamiento-en-tierra.md) | NASA Standard Measures, HERA, LSAH | Los datos de tierra **sí** se correlacionan con el vuelo: son la línea base personal. Calendario L-180…R+30 y "Train like you fly" |

## Conclusiones para el equipo

1. **Los recursos confirman el concepto y amplían el alcance.** Las 5 amenazas, los riesgos del HRP y los estudios en marcha (ARCHeR, Standard Measures) encajan con el diseño de ORBI. Los recursos externos (08, 09) añaden el giro de producto: basal de entrenamiento en tierra y basal por fase del ciclo.
2. **Casi ningún recurso da umbrales numéricos.** La excepción es el hueso (07: 1–1,5 %/mes, > 90 días, > 6 meses). Para la radiación, NASA dice que **no hay límites para misiones largas** (06): el halo muestra un presupuesto configurable, no un umbral inventado. El valor de 600 mSv sí tiene fuente primaria (08: límite único desde 2022). El resto de valores de `src/domain/rules.ts` siguen saliendo de NASA-STD-3001 y de criterios clínicos estándar. Si hay tiempo, revisar las fichas individuales de riesgo enlazadas en el 02 (sueño, inmune, nutrición).
3. **Tres frases de pitch con respaldo oficial:**
   - *"NASA says the five hazards feed off one another. That's why ORBI correlates signals instead of showing isolated numbers."* (01)
   - *"ORBI addresses a named HRP risk: inadequate systems operations support."* (02)
   - *"Deep-space crews can rely less on Earth for emergency medical assistance, so ORBI decides on board."* (05)
4. **Los recursos externos (08, 09) añaden el giro del proyecto.** La fase lútea puede imitar el inicio de una infección (+0,28–0,56 °C, +2–7 lpm), así que la basal tiene en cuenta el ciclo. Los datos del entrenamiento en tierra son la línea base personal (uso operativo), no solo histórico. Los 600 mSv por defecto quedan confirmados como límite único para todos los sexos y edades.
5. **Citar las dos agencias** (NASA y CSA) en la página del proyecto y en los créditos de la app.

Las referencias se pueden enlazar desde `content/explain.ts` (campo `source`) para que cada texto "Why this matters" muestre su fuente.
