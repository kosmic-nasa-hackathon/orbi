# NASA JSC — Space Radiation (monitorización)

- **Fuente:** https://www.nasa.gov/directorates/esdmd/hhp/space-radiation/
- **Organismo:** NASA · Johnson Space Center · Human Health and Performance
- **Publicado:** 16 mar 2023 · **Actualizado:** 13 mar 2026 · **Consultado:** 13 nov 2026
- **Llegamos aquí desde:** la subpágina *Space Radiation* de los Hazards (`01-nasa-hrp-hazards.md`)

## Resumen

Explica cómo protege y monitoriza NASA a los astronautas frente a la radiación: la vigilancia continua 24/7 del **Space Radiation Analysis Group (SRAG)**, los dosímetros que llevan los tripulantes, el hardware de medición y la investigación del Radiation Biophysics Laboratory.

## Protecting Against the Unseen

- La exposición a la radiación es *"one of the greatest threats to an astronaut's health"*.
- **Riesgos asociados:** carcinogénesis, efectos degenerativos en tejidos, efectos en el sistema nervioso central y **síndromes agudos por radiación**.
- Fuera de la atmósfera, el entorno lo forman **protones energéticos y núcleos pesados**, que producen un daño biológico distinto al de la radiación en la Tierra. De ahí la gran incertidumbre al proyectar los riesgos.
- ⚠️ **Dato clave:** *"Although information exists to recommend crew exposure limits... for missions in low Earth orbit, there is **insufficient knowledge**... to provide recommendations on crew exposure limits and design requirements for **long-duration missions**."*

## Continuous Monitoring: 24/7/365

- El **SRAG** (Johnson Space Center) mantiene a la tripulación *"within acceptable levels of risk"* con **monitorización continua del entorno de radiación solar** y soporte a las operaciones **24 horas al día**.
- **Dosímetros**, a veces en forma de **chapas** (*badges*) que lleva cada tripulante. Se devuelven a la Tierra para analizarlos. Tipos: TLD (termoluminiscentes), OSLD (ópticamente estimulados) y PNTD (detectores de trazas nucleares).
- **Hardware y herramientas:**
  - Modelos del campo magnético terrestre resueltos en el tiempo
  - Mapas del flujo de radiación atrapada en la magnetosfera
  - Algoritmos de propagación de trayectoria
  - **TEPC** (Tissue Equivalent Proportional Counter)
  - **CPDS** (Charged Particle Directional Spectrometer)
  - **RAM** (Radiation Area Monitor)
  - **CPD** (Crew Passive Dosimeter)
- En el Mission Control Center hay una sala dedicada (*Space Radiation Analysis Multipurpose Support Room*).

## How Safe is Safe Enough?

El **Radiation Biophysics Laboratory** investiga para reducir la incertidumbre, sobre todo el **efecto combinado de radiación + microgravedad**: daño en el ADN, transcriptómica en tripulantes de la ISS y radiación de LET bajo y alto en células y animales (con el acelerador del NSRL en Brookhaven). También desarrolla **modelos computacionales para proyectar el riesgo de cáncer y de síndrome agudo por radiación**.

## Cómo lo usamos en ORBI

**Lo que buscábamos (límites de dosis): esta página NO los da.** Al contrario, dice explícitamente que **no hay conocimiento suficiente para recomendar límites para misiones largas**. Consecuencias:

1. **Cambiar el enfoque del halo en `rules.ts`:**
   - El "% del límite de carrera" debe presentarse como **"exposure budget set by mission medical ops"**: un valor configurable, no una cifra de NASA para Marte.
   - El valor de 600 mSv que tenemos en `CONCEPTO-ORBI.md` §4.2 viene de NASA-STD-3001 Vol. 1 (límite de carrera vigente). Hay que mantenerlo marcado como `TODO verify` y explicarlo así: *"current NASA career limit; deep-space limits are still an open research question."*
   - Esto **juega a favor** en el pitch: *"NASA itself says deep-space exposure limits are still unknown. That's why ORBI shows the budget, the trend and the uncertainty, not a fake precise threshold."*
2. **Fuente de datos del halo más realista** (para "Cómo se usa en la nave"):
   - **CPD** (dosímetro pasivo personal) → **dosis acumulada**, leída periódicamente: es una lectura semanal, no en tiempo real.
   - **RAM / TEPC** (monitores de área en la nave) → **tasa de dosis** en tiempo real.
   - **Alerta de SPE** → de la monitorización solar continua tipo SRAG. En Marte, con hasta 20 min de retraso, la alerta debe generarse **a bordo** con los monitores de la nave.
3. **Riesgos para "Why this matters" del halo:** cáncer, daño tisular degenerativo, sistema nervioso central y **síndrome agudo por radiación** (este último es el que justifica el modo URGENT en un SPE).
4. **Radiación + microgravedad combinadas** es otra cita oficial a favor de las correlaciones entre sistemas.

**Corrección para "Cómo se usa en la nave" (`CONCEPTO-ORBI.md`):** en la fila de dosímetros, nombrar CPD (personal) + RAM/TEPC (área) + CANS (neutrones, CSA, ver `04-csa-monitoring-radiation.md`).
