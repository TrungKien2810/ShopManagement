---
name: ui-ember-bistro-direction
description: client-app UI design direction — "Ember Bistro" warm-dark theme
metadata:
  type: project
---

The client-app UI was redirected (2026-06-15) from the old cold "Linear purple" theme to a warm dark **"Ember Bistro"** aesthetic, applying the Anthropic frontend-design skill (avoid purple-gradient cliché, distinctive fonts, cohesive palette).

- Primary accent = deep terracotta/ember `#c2410c` (legacy token name `--color-brand-purple` was kept but repointed, so the whole app re-skins via tokens without renaming class usages across 33 files). Bright saffron-amber `#f4b541` (`--color-brand-purple-light` / new `--color-amber`) is used for glows/headings/icons on dark.
- Warm bases: `--color-void` `#0c0a09`, `--color-slate-deep` `#18130f`. Success/money `--color-brand-emerald` `#2fb97a`.
- Display font **Fraunces** (serif) on h1–h4 via `--font-display`; body stays Plus Jakarta Sans.
- Atmosphere: warm radial gradient mesh + film-grain `body::after` overlay.

**Why:** User asked to apply a top-rated UI/UX skill and redo the whole app's look; chose a new aesthetic over keeping Linear-dark.
**How to apply:** Edit tokens/utilities in [index.css](../../../client-app/src/index.css) to re-skin globally. Don't reintroduce cold purple/blue (`#7c3aed`, `rgba(94,106,210)`). New semantic tokens available: `bg-ember`, `bg-ember-bright`, `bg-amber`, `text-clay`.
