# PITCH — ORBI

Deck navegable en **`/pitch/`** (misma URL de la app). Es una página estática dentro de
`public/pitch/`, así que Vite la copia tal cual a `dist/` y no necesita backend ni build aparte.

- Producción: `https://orbi.agustinpane.xyz/pitch/`
- Local: `npm run dev` y abrir `http://localhost:5173/pitch/`
- Modo lectura: `/pitch/?view=scroll`
- Fuente de contenido: `public/pitch/deck.json`
- Motor y estilos: `public/pitch/deck.js` + `public/pitch/theme.css`

La arquitectura replica la de `agents-101`: un `index.html` mínimo, el contenido en `deck.json`
y un motor que renderiza slides. La diferencia es que acá el motor es propio y liviano, sin
dependencias externas, para respetar la CSP de nginx (`script-src 'self'`).

## Cómo presentar

| Tecla | Acción |
|---|---|
| `→` · `↓` · `Espacio` | Siguiente slide |
| `←` · `↑` | Slide anterior |
| `Home` / `End` | Primera / última |
| `G` | Grilla de slides |
| `S` | Notas del orador |
| `F` | Pantalla completa |
| `P` | Imprimir / guardar como PDF |
| `Esc` | Cerrar paneles |
| `?` | Ayuda de teclado |

En tablet o teléfono se puede pasar de slide con swipe horizontal.

## Guion (15 slides)

1. **Cover** — ORBI, from drift to decision.
2. **The problem** — Day 148, 14 minutos de latencia, sin clínica a bordo.
3. **The insight** — la latencia es una variable clínica.
4. **The product** — check-in de 90 s → basal de tierra + ciclo opt-in → motor → decisión → escalado.
5. **Challenge fit** — tabla enunciado → ORBI.
6. **Body** — 6 sistemas + halo, mapeados a las 5 amenazas de NASA.
7. **Decision** — nivel, “Because…”, action card, escalado.
8. **Correlations** — infección temprana, ciclo (`cycle-aware`), aire de cabina, evento solar.
9. **Honesty** — hueso estimado, radiación como presupuesto, umbrales auditables.
10. **Architecture** — dominio puro, UI consumidora, coach opcional con guardrails.
11. **Evidence** — NASA HRP, NASA-STD-3001, CSA, salud de la mujer y entrenamiento en tierra.
12. **Live now** — qué se puede abrir hoy y los 4 escenarios actuales del demo.
13. **Roadmap** — Nivel 0 + P3 (basal de 90 días y ciclo), Trends/Mission Control, extras.
14. **Team** — qué traemos, qué necesitamos (revisión clínica y un piloto).
15. **Close** — “ORBI doesn't diagnose. It prioritizes, explains and escalates.”

Las notas completas de cada slide están en `deck.json` (`notes`) y se ven con `S`.

## Antes de presentar

- [ ] Abrir `/pitch/` en la tablet o en la laptop que se va a usar y probar `F`, `S` y `G`.
- [ ] Verificar que `/?view=console` responde en producción.
- [ ] Tener el video de respaldo de la demo descargado, no solo el link.
- [ ] Confirmar el escenario del demo: `early-infection`, día 148, Mars → ISS.
- [ ] Revisar que los números del deck sigan alineados con `src/domain/rules.ts` y `HANDOFF.md`.
- [ ] No prometer Today/Body/Decision como terminadas si todavía no están en la URL.
- [ ] No presentar `cycle-aware`/`luteal-phase` como live hasta que P3 esté desplegado; el deck los
  muestra como diseño/roadmap.
- [ ] Verificar que los conteos live sigan siendo 4 escenarios y 3 correlaciones hasta P3.

## Reglas de honestidad

- Decir **“decision support”**, **“prioritizes, explains and escalates”**, **“auditable rules”**.
- No decir **“diagnoses”**, **“replaces the doctor”**, **“AI predicts”**.
- La pérdida ósea se **estima** (DXA solo en Tierra); la radiación se muestra contra un
  **presupuesto** porque NASA reconoce que los límites de espacio profundo siguen abiertos. El
  valor por defecto de 600 mSv tiene fuente (límite único desde 2022, `recursos/08`).
- El dato del ciclo es **opt-in y privado**; los umbrales absolutos nunca se relajan para ocultar
  una fiebre real.
- Los umbrales no verificados se muestran como tales. No inventar números en la charla.

## Mantenimiento

Para cambiar el pitch, editar `public/pitch/deck.json` y recargar. No hace falta tocar el motor
salvo que se agregue un tipo nuevo de slide. Si se agrega un layout, actualizar también el CSS y
probar en `1280×720`, `1180×820` (tablet) y mobile.

El deck no reemplaza `docs/CONCEPTO-ORBI.md` ni `docs/BRIEF.md`: es la capa de presentación.
Si cambia una regla, un escenario o el estado del producto, actualizar ambos.
