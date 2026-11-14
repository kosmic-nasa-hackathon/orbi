# DESIGN — ORBI design system

> Direction approved on 14 Nov 2026: **"Body in orbit"** (*Órbita del cuerpo*).
> Structure, cleanliness and type come from the *Orbit* proposal; colour, the human figure and the grid
> come from *Living body*.
> Code: `src/index.css` (tokens), `src/theme/*` (theme), `src/components/ui/*` and
> `src/components/motion/*` (primitives).

## 1. The idea in one sentence

**The astronaut's body sits in the centre and the day's readings orbit around it.** It is an
instrument interface: clean, serious and readable at a glance. The personality comes from the orbit,
the cyan light and the grid, not from decoration.

Principles:

1. **Clean before dense.** One question or one decision per screen. The check-in takes 4 taps and 90 s.
2. **The body is the interface.** Today, Body and Decision share the same figure and orbit.
3. **Colour is never alone.** Every level has colour, icon and text.
4. **Realistic, not a video game.** No pixel art, scanlines or CRT effects.
5. **Dark and light matter equally.** Dark is the cabin; light is a lit room with a projector.

## 2. Colour

Tokens are used through Tailwind utilities (`bg-canvas`, `text-muted`, `border-line`…).
**Do not write hex colours in components.**

| Token | Use | Dark | Light |
|---|---|---|---|
| `canvas` | App background | `#04070b` | `#eef4f7` |
| `surface` | Panels | `#0a121a` | `#ffffff` |
| `surface-strong` | Cards inside panels, hover | `#101c26` | `#e3edf1` |
| `ink` | Primary text | `#e6f1f5` | `#0d1b22` |
| `muted` | Secondary text | `#8fa3ad` | `#45606b` |
| `faint` | Labels, metadata | `#7d929c` | `#4f6974` |
| `line` / `line-strong` | Borders and dividers | cyan-grey 20 % / 36 % | ink 12 % / 24 % |
| `accent` | Primary action, progress, focus | `#67e8f9` | `#0e7490` |
| `accent-soft` | Background of active elements | accent 12 % | accent 10 % |
| `on-accent` | Text on `accent` | `#032027` | `#ffffff` |
| `figure` | Stroke of the human figure and the halo | `#67e8f9` | `#0e7490` |

**Triage levels** (text with `text-<level>`, background with `bg-<level>-soft`):

| Level | Dark | Light | Icon (lucide) |
|---|---|---|---|
| NOMINAL | `#34d399` | `#047857` | `CircleCheck` |
| WATCH | `#fbbf24` | `#8a5300` | `Eye` |
| CONCERN | `#fb923c` | `#b93c0b` | `TriangleAlert` |
| URGENT | `#f87171` | `#b91c1c` | `OctagonAlert` |

All text passes **WCAG AA (≥ 4.5:1)** on `canvas`, `surface` and `surface-strong` in both themes,
including level text on its `-soft` background. Check any new colour before adding it.

**Background:** `body` has a soft glow and the **28 px grid** (`--orbi-grid`). To repeat it inside a
container, use the `orbi-backdrop` class.

## 3. Typography

| Role | Font | Class |
|---|---|---|
| Headings and text | **Sora** (`@fontsource-variable/sora`) | `font-sans` / `font-display` |
| Data, units, labels | **IBM Plex Mono** | `font-mono` |

Scale (defined in `@theme`):

| Class | Size | Use |
|---|---|---|
| `text-label` | 11 px, 0.08em tracking | Uppercase labels (`font-mono uppercase`). **Never smaller.** |
| `text-caption` | 13 px | Notes, sources, metadata |
| `text-body` | 15 px | Running text |
| `text-lead` | 18 px | Lead paragraphs |
| `text-title` | 24 px | Panel or question title |
| `text-headline` | 36 px | Main number (`tabular-nums`) |
| `text-display` | 56 px | Home only |

Vital-sign numbers always use `tabular-nums`, with the unit smaller and in `text-muted`.

## 4. Shape and spacing

- Radii: panels `rounded-3xl`, cards `rounded-2xl`, buttons and badges `rounded-full`.
- Touch targets **≥ 44 px** (`Button` size `md` or `lg`). Nothing depends on hover.
- Design for a landscape tablet, **1180 × 820**. On narrow screens, one column.
- Spacing with `gap` in grid or flex, not with stray margins.

## 5. Components

| Component | File | Purpose |
|---|---|---|
| `Panel` | `ui/Panel.tsx` | Screen block with kicker, title and actions |
| `Card` | `ui/Card.tsx` | Block inside a panel; `interactive` when clickable |
| `Badge`, `LevelBadge` | `ui/Badge.tsx` | State; `LevelBadge` renders the level's colour, icon and text |
| `Button` | `ui/Button.tsx` | `primary` (one per screen), `secondary`, `ghost` |
| `Tabs` | `ui/Tabs.tsx` | Accessible tabs (arrows, Home, End) |
| `Metric` | `ui/Metric.tsx` | One reading: label, value, unit, level and hint |
| `ScreenPlaceholder` | `ui/ScreenPlaceholder.tsx` | Screen under construction |
| `Reveal`, `ScreenTransition` | `motion/*` | Soft entrance and screen change |
| `ThemeToggle` | `theme/ThemeToggle.tsx` | Dark/light switch |

Import from `@/components/ui` and `@/components/motion`. For missing controls (slider, dialog,
tooltip, progress) use native elements with the tokens: `<input type="range">`, `<dialog>`,
`title`/`aria-describedby`, `<progress>`. shadcn/ui is not used.

## 6. Product patterns

### Body in orbit (Today and Body)
- The human figure in the centre (`figure` stroke) with zones: brain (sleep, mood, fatigue →
  Behavioral), lungs (SpO₂ → Respiratory), heart (HR → Cardio), abdomen (glucose → Metabolic) and the
  whole outline (temperature → Immune).
- The **7 check-in readings** are satellites on a ring around it. During the check-in, each answer
  lights its satellite and its zone, joined by a dashed line. A second outer ring shows progress.
- When done, satellites and zones take their level colour. On Body, tapping a zone or a system opens
  its sheet.
- The **radiation halo** is a dashed ellipse around the figure.

### 90-second check-in (Today)
1. Confirm the 4 wearable readings (sleep, HR, temperature, SpO₂), tagged *"Synced"* → **Looks right**.
2. Mood: 5 large buttons (1–5, each with a word).
3. Fatigue: 5 large buttons.
4. Glucose: − / + stepper → **Confirm check-in**.
5. Cycle (opt-in, only when `cycle === "tracked"`): one tap, *"Period today? yes/no"*. Not a step.

The countdown starts on the first tap.

### System sheet (Body)
Today's reading, a 14-day sparkline with the **ground-training range as a band**, "Why this matters"
and the source.

### Decision (Decision)
Level, *"Because…"* (technical detail in `font-mono`), the procedure as a numbered checklist and the
escalation ladder with latency. One primary action.

## 7. Motion

- Transitions of 0.3–0.5 s with `EASE_OUT` (`[0.22, 1, 0.36, 1]`).
- A soft pulse only on what is happening now (the active satellite, URGENT).
- **`prefers-reduced-motion`**: no movement or pulses, only fades. The `motion/` primitives already
  respect it.

## 8. Theme

- `ThemeProvider` in `main.tsx`; read it with `useTheme()`.
- Follows the system by default; with no preference, dark. The choice is stored in `localStorage`
  under **`orbi-theme`** (the pitch deck should use the same key).
- `public/theme-init.js` applies the theme before React loads, so there is no flash.
- Home, EVA and Console are forced to dark until lane E (#16) moves them to tokens.

## 9. Visual reference

Approved prototype (interactive, with Today, Body and Decision):
https://claude.ai/artifact/4HAYUj57nE9eUVzRqvnFRn. It is private to Andrea; ask her for access.
