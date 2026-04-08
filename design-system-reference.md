# Design System Reference — Bizzzup AI Labs

> Source of truth for all UI color, surface, typography, and interaction decisions.
> Light-theme only. No dark-mode assumptions.

---

## Core Principles

1. **Premium and calm** — The palette should feel refined, not loud. Avoid startup-generic aesthetics.
2. **Warm neutrals over pure white** — Pure `#FFFFFF` backgrounds feel flat and clinical. Use off-whites and warm grays to add depth.
3. **No generic SaaS blue** — Bright blues (`#0066FF`, `#2563EB`, etc.) are overused. Our accent palette is restrained, desaturated, and intentional.
4. **Hierarchy through surface, not color** — Differentiate sections with subtle background shifts, not colored blocks.
5. **Quiet confidence** — Interactions (hover, focus, active) should feel responsive but never flashy.

---

## Color Palette

### Backgrounds (Surface Layers)

Use these to create visual depth between page sections without relying on borders or color blocks.

| Token              | Value       | Usage                                                  |
| ------------------ | ----------- | ------------------------------------------------------ |
| `bg-base`          | `#FAFAF9`   | Page-level background. Warm off-white.                 |
| `bg-section`       | `#F5F4F1`   | Alternating sections, feature blocks, content wells.   |
| `bg-card`          | `#FFFFFF`   | Cards, modals, dropdowns — elevated surfaces only.     |
| `bg-card-hover`    | `#F9F8F6`   | Card hover state. Subtle warmth shift.                 |
| `bg-inset`         | `#EFEEEB`   | Code blocks, input fields, inset containers.           |
| `bg-overlay`       | `#00000008`  | Translucent overlays for layered UI.                  |

**Rules:**
- `bg-base` is the default. Never use pure `#FFFFFF` as a page background.
- Reserve `bg-card` (`#FFFFFF`) for elevated elements that need to "lift" off the surface.
- Alternate between `bg-base` and `bg-section` for adjacent page sections to create rhythm.

### Text Hierarchy

| Token              | Value       | Usage                                                  |
| ------------------ | ----------- | ------------------------------------------------------ |
| `text-primary`     | `#1C1B19`   | Headings, body copy, primary content.                  |
| `text-secondary`   | `#57534E`   | Subheadings, supporting text, descriptions.            |
| `text-muted`       | `#A8A29E`   | Captions, timestamps, helper text, placeholders.       |
| `text-on-accent`   | `#FFFFFF`   | Text on filled accent buttons or badges.               |
| `text-link`        | `#6B7280`   | Default inline link color (muted, not blue).           |
| `text-link-hover`  | `#1C1B19`   | Hovered links darken to primary.                       |

**Rules:**
- Use `text-primary` for anything the user must read.
- Use `text-secondary` for context and supporting information.
- `text-muted` is for non-essential metadata only — never for body paragraphs.
- Links are understated by default. They gain presence on hover, not at rest.

### Borders and Dividers

| Token              | Value       | Usage                                                  |
| ------------------ | ----------- | ------------------------------------------------------ |
| `border-default`   | `#E7E5E4`   | Card borders, input outlines, subtle separators.       |
| `border-strong`    | `#D6D3D1`   | Emphasized dividers, section breaks.                   |
| `border-focus`     | `#78716C`   | Focus rings on inputs and interactive elements.        |

**Rules:**
- Borders should be barely visible — structure, not decoration.
- Prefer background shifts over borders to separate sections.
- Use `border-focus` for all keyboard-accessible focus states.

### Accent Colors

The accent palette is intentionally narrow. Each color has a defined role.

| Token              | Value       | Role                                                   |
| ------------------ | ----------- | ------------------------------------------------------ |
| `accent-primary`   | `#44403C`   | Primary actions (CTA buttons, key links). Warm charcoal. |
| `accent-primary-hover` | `#292524` | Hover state for primary actions. Deepens, doesn't shift hue. |
| `accent-subtle`    | `#78716C`   | Secondary actions, icon accents, active nav items.     |
| `accent-tint`      | `#F5F0EB`   | Tinted badges, tag backgrounds, soft highlights.       |
| `accent-warm`      | `#B45309`   | Sparingly — status indicators, premium badges, warmth moments. Amber. |
| `accent-warm-soft` | `#FEF3C7`   | Background for warm callouts or highlighted features.  |
| `accent-cool`      | `#6B8A9E`   | Sparingly — informational badges, subtle differentiators. Desaturated slate-blue. |
| `accent-cool-soft` | `#F0F4F7`   | Background for cool-toned callouts.                    |

**Rules:**
- `accent-primary` is the workhorse. Use it for the single most important action on any screen.
- Never use bright blue (`#2563EB`, `#3B82F6`, etc.) as an accent. If blue is needed, use `accent-cool` — desaturated and muted.
- `accent-warm` and `accent-cool` are seasoning, not the main dish. One instance per section maximum.
- Accent backgrounds (`accent-tint`, `accent-warm-soft`, `accent-cool-soft`) are for large soft areas. Never pair them with heavy borders.

---

## Interaction States

All interactive elements follow this consistent state model:

| State      | Treatment                                                                 |
| ---------- | ------------------------------------------------------------------------- |
| **Rest**   | Default appearance. Quiet, readable, no visual noise.                     |
| **Hover**  | Subtle background shift or text darkening. No color hue changes.          |
| **Focus**  | `border-focus` ring (`#78716C`), 2px offset. Visible on keyboard nav.     |
| **Active** | Slight scale reduction (`scale-[0.98]`) or background darkening.          |
| **Disabled** | 40% opacity. No pointer events. No cursor change tricks.               |

**Rules:**
- Hover transitions: `150ms ease` minimum. No instant snaps.
- Never change hue on hover (e.g., gray button turning blue). Darken or lighten within the same tone.
- Focus states must be visible. Do not remove outlines without replacing them.
- Disabled elements should look clearly inactive, not just lighter.

---

## Button Hierarchy

| Variant        | Background         | Text              | Border             | When to use                        |
| -------------- | ------------------ | ----------------- | ------------------ | ---------------------------------- |
| **Primary**    | `accent-primary`   | `text-on-accent`  | none               | One per section. The main CTA.     |
| **Secondary**  | transparent        | `accent-primary`  | `border-default`   | Supporting actions beside primary. |
| **Ghost**      | transparent        | `text-secondary`  | none               | Tertiary actions, nav links.       |
| **Danger**     | `#DC2626`          | `#FFFFFF`          | none               | Destructive actions only.          |

**Rules:**
- One primary button per visible section. If everything is primary, nothing is.
- Secondary buttons should not compete visually with the primary.
- Ghost buttons are for low-priority actions — they should nearly blend into the page at rest.

---

## Shadows and Elevation

| Token            | Value                                      | Usage                              |
| ---------------- | ------------------------------------------ | ---------------------------------- |
| `shadow-sm`      | `0 1px 2px rgba(28, 27, 25, 0.04)`        | Inputs, small cards.               |
| `shadow-md`      | `0 2px 8px rgba(28, 27, 25, 0.06)`        | Cards, popovers.                   |
| `shadow-lg`      | `0 8px 24px rgba(28, 27, 25, 0.08)`       | Modals, floating panels.           |

**Rules:**
- Shadows use warm-tinted `rgba` based on `text-primary`, not pure black.
- Shadows should be barely perceptible. If you can obviously see the shadow, it's too strong.
- Combine shadow with `bg-card` for elevated surfaces. Never shadow a `bg-section` element.

---

## Typography Guidance

This file does not define font sizes or families (see `tailwind.config.*`), but establishes tone rules:

- **Headings** — Confident, not shouty. Sentence case preferred over ALL CAPS.
- **Body** — `text-primary` at comfortable line height (1.6–1.75 for body, 1.2–1.3 for headings).
- **Captions and labels** — `text-muted`, smaller size. Functional, not decorative.
- **No underlines on links** — Use color shift and weight change for link affordance. Underline only on hover if needed.

---

## Anti-Patterns (Do Not)

| Do not                                         | Instead                                                      |
| ---------------------------------------------- | ------------------------------------------------------------ |
| Use `#FFFFFF` as page background               | Use `bg-base` (`#FAFAF9`)                                    |
| Use bright blue (`#2563EB`) as primary accent   | Use `accent-primary` (`#44403C`) or `accent-cool` (`#6B8A9E`) |
| Add colored section backgrounds                | Alternate `bg-base` / `bg-section` for rhythm                |
| Put borders on everything                      | Use background layering and spacing for separation            |
| Make multiple buttons "primary" in one section | One primary CTA per visible viewport area                    |
| Use heavy drop shadows                         | Keep shadows warm-tinted, subtle, barely visible             |
| Use bright colors for status without purpose   | Reserve `accent-warm` and `accent-cool` for meaningful signals |
| Style hover states with hue shifts             | Darken or lighten within the same tone family                |
