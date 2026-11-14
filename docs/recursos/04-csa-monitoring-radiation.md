# CSA — Monitoring radiation for astronaut health

- **Fuente:** https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp
- **Organismo:** Agencia Espacial Canadiense (CSA)
- **Fecha del artículo:** 26 feb 2026 · **Consultado:** 13 nov 2026

## Resumen

La radiación es uno de los retos clave fuera de la atmósfera terrestre. De cara a las misiones a la Luna y Marte, la CSA ha adjudicado **5,5 millones de dólares** a Bubble Technology Industries para seguir desarrollando el **CANS** (*Canadian Active Neutron Spectrometer*), un instrumento **compacto y autónomo** que mide la exposición a la radiación de neutrones.

## Datos clave

- **Los neutrones suponen ~30 % de la radiación total en la ISS** y son especialmente dañinos: pueden causar daño biológico grave y requieren protección específica.
- **Lo nuevo del CANS:** mide **de forma continua y autónoma**. Su predecesor eran los *bubble detectors* (en la foto, el astronauta David Saint-Jacques en la ISS).
- **Experiencia previa de Canadá** en detección de radiación en la ISS: MOSFET, EVARM, Radi-N y Radi-N2.
- **Aplicaciones en la Tierra:** terapia contra el cáncer, protección de tripulaciones aéreas, detección de amenazas nucleares y seguridad pública.
- La ISS lleva **más de 25 años** como banco de pruebas de nuevas tecnologías.

## Cómo lo usamos en ORBI

- **Fuente del halo de radiación:** en "Cómo se usa en la nave", la fila de dosímetros pasa a ser concreta. **Dosímetros personales + un espectrómetro de neutrones continuo y autónomo tipo CANS** alimentan el halo sin que el astronauta haga nada (`EnvReading.doseMSv`).
- **"Continuo y autónomo"** es justo nuestro modelo: la estación mide y ORBI interpreta. Frase de pitch: *"Instruments like CSA's CANS already measure radiation continuously and autonomously. ORBI turns that stream into a decision."*
- **Dato del 30 %** para el texto "Why this matters" del halo: *"About 30% of the radiation on the ISS comes from neutrons, which are especially harmful."*
- **Ejemplo de que la NASA no es la única fuente:** el enunciado permite usar recursos de otras agencias. Citar la CSA demuestra que los hemos usado.
- Posible detalle en la ficha del halo: separar la dosis por **tipo** (total / neutrones). Solo si sobra tiempo; no está en el MVP.

⚠️ El artículo **no da límites de dosis**. El límite de carrera sigue viniendo de NASA-STD-3001 (`CONCEPTO-ORBI.md` §4.2).
