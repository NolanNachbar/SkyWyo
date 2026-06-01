# Apex Horizon Media — Strategic Style Guide

> Wyoming Properties. Elevated.

---

## 1. Brand Positioning

### What This Site Is For

Apex Horizon Media operates two distinct revenue tracks from one website. The design system must serve both without diluting either:

| Track | Audience | Goal | Tone |
|---|---|---|---|
| **Consumer** | Realtors, brokers, listing agents | Book a single shoot | Cinematic, fast, results-driven |
| **Enterprise B2B** | Construction PMs, Ranch Owners, Data Center operators | Win a recurring monthly retainer or large mapping project | Authoritative, technical, reliability-focused |

### Brand Pillars

1. **Cinematic premium** — The aerial footage is the product. Every design choice should make the media look better, not compete with it. The entire UI is built on a dark, editorial "Ink & Paper" aesthetic.
2. **Wyoming local authority (The Anti-Aggregator)** — Not a national aggregator. Built here, flies here, knows here. We actively contrast our in-house team against out-of-state dispatchers.
3. **Operational reliability** — The wind badge is the single most important trust signal. We fly when others don't.
4. **Speed** — 24–48 hr delivery is a differentiator. The site should feel fast to match it.

---

## 2. Color System: Ink & Paper

The site uses a unified, editorial color palette designed to make footage look expensive. We have abandoned the "blue vs gold" dual-track styling in favor of a universally premium aesthetic that works for both luxury ranches and industrial sites.

### Core Palette

```css
/* Backgrounds — Deep, layered darkness */
--color-ink:         #0a0a0b   /* main page background */
--color-ink-2:       #111113   /* secondary backgrounds, cards */

/* Text — Warm, readable contrast */
--color-paper:       #efeae1   /* primary text, headings */
--color-paper-2:     #d8d2c6   /* secondary text */
--color-paper-dim:   #a5a096   /* muted text, captions */
--color-paper-mute:  #726d64   /* deeply muted text, placeholder */

/* Structural */
--color-rule:        rgba(239, 234, 225, 0.12) /* subtle dividers */
--color-rule-strong: rgba(239, 234, 225, 0.22) /* strong borders, active inputs */

/* Primary Conversion Accent */
--color-accent:      #c2a574   /* champagne / gold — all CTAs, active states, key data points */
```

### Color Usage Rules

| Token | Allowed Uses | Never Use For |
|---|---|---|
| `ink` | Hero sections, page `<body>`, fullscreen overlays | Primary readable text |
| `ink-2` | Alternating content sections, footer, form containers | Overusing as a page background |
| `paper` | Headings, active nav items, body text | Background fills |
| `paper-dim` | Captions, card descriptions, form placeholders | Headings, CTA labels |
| `accent` | All Primary CTAs, active selections, scrollbar thumb, highlighting key stats | General body text, error states |
| `rule` | Card outlines, section dividers, form field borders | Text |

---

## 3. Typography

### Font Stack

| Role | Family | Weight Range | Use |
|---|---|---|---|
| **Display / Functional** | Space Grotesk (or Instrument Sans) | 400, 500, 600, 700 | UI elements, small caps (`tracking-nav`), card titles, CTA labels |
| **Body** | Inter | 300, 400, 500, 600 | Body copy, form labels, long-form reading |
| **Serif / Editorial** | Cinzel (or Instrument Serif) | 400, 500 | Page h1s, hero taglines, location names, massive numbers. Adds cinematic gravity. |

### Fluid Type Scale

```css
--text-xs:   clamp(0.75rem,  0.7rem  + 0.25vw, 0.875rem)  /* 12–14px  labels, badges */
--text-sm:   clamp(0.875rem, 0.8rem  + 0.375vw, 1rem)     /* 14–16px  captions, micro copy */
--text-base: clamp(1rem,     0.9rem  + 0.5vw,   1.125rem) /* 16–18px  body text */
--text-lg:   clamp(1.125rem, 1rem    + 0.625vw, 1.25rem)  /* 18–20px  lead paragraphs */
--text-xl:   clamp(1.25rem,  1.1rem  + 0.75vw,  1.5rem)   /* 20–24px  card titles */
--text-2xl:  clamp(1.5rem,   1.3rem  + 1vw,     2rem)     /* 24–32px  section subheadings */
--text-3xl:  clamp(2rem,     1.6rem  + 2vw,     3rem)     /* 32–48px  section headings */
--text-4xl:  clamp(2.5rem,   2rem    + 2.5vw,   4rem)     /* 40–64px  page h1s */
--text-hero: clamp(3.5rem,   2.5rem  + 5vw,     7rem)     /* 56–112px hero tagline */
```

### Typographic Hierarchy
- **Hero tagline:** Serif, `--text-hero`, `font-weight: 400`, `line-height: 0.95`.
- **Eyebrow label:** Sans, `--text-xs`, `uppercase`, `tracking-[0.32em]`, color `paper-dim`.
- **Primary CTAs:** Sans, `--text-xs`, `uppercase`, `tracking-[0.22em]`.

---

## 4. Design & Component Patterns

### Film Grain Overlay (Cinematic Grade)
The entire site is overlaid with a subtle SVG fractal noise grain to make digital aerial footage feel analog and expensive.
```css
body::after {
  content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 200;
  opacity: 0.05; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg ...><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}
```

### Buttons
All buttons use the `accent` (champagne/gold) or `rule-strong` for borders.

**Primary CTA**
```html
<a class="inline-block px-8 py-4 bg-accent text-ink font-display uppercase tracking-nav text-xs font-semibold rounded-sm transition-all duration-300 hover:brightness-110">
  Book Your Shoot
</a>
```

**Ghost CTA**
```html
<a class="inline-block px-8 py-4 border border-rule-strong text-paper font-display uppercase tracking-nav text-xs transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-ink">
  View Portfolio
</a>
```

### Section Eyebrows
Instead of plain text, eyebrows are prefixed with a small accent indicator.
```html
<div class="flex items-center gap-3 mb-8">
  <span class="block w-2 h-2 rounded-full bg-accent flex-shrink-0"></span>
  <span class="text-paper-dim text-[11px] uppercase tracking-[0.32em]">What We Do</span>
</div>
```

### The Wind Badge
The most critical trust signal on the site.
```html
<div class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink-2/80 backdrop-blur-sm border border-rule rounded-sm text-paper text-xs">
  <svg ...wind icon... class="w-3.5 h-3.5 text-paper-dim" />
  Captured in 24 mph sustained winds
</div>
```

---

## 5. Conversion Architecture & The Funnel

### The "Anti-Aggregator" Block
Somewhere on the homepage and services page, explicitly call out that Apex is **Wyoming Owned and Operated**. Out-of-state aggregators dispatch cheap, unlicensed pilots. We use our local presence as a competitive weapon.

### Form Abandonment & The Interactive Estimator
The booking form (`/book`) uses a 4-step progressive disclosure model:
1. **Contact:** Name, Email, Phone.
2. **Details:** Location, Property/Project Type.
3. **Interactive Estimator:** Users select a base tier (e.g., Horizon) and can toggle Add-Ons (Twilight, 3D Mapping). A sticky "Estimated Total" updates dynamically at the bottom.
4. **Summary & Submit:** No surprises.

**Why this works:** It provides the psychological satisfaction of a calculator (which users love) while keeping them trapped inside the booking funnel.

### Enterprise B2B Tracks
- **Industrial Progress:** Focused on construction, data centers, and commercial development. Deliverables: Orthomosaics, weekly progress tracking.
- **Agricultural & Ranch:** Focused on massive acreage, fence line inspections, and luxury ranch real estate sales. 
- *Both tracks use the same Ink & Paper aesthetic, but the copy shifts to technical capabilities rather than rapid real estate turnarounds.*

---

## 6. Motion & Animation

### Timing Standards
We replaced standard Tailwind easings with custom, premium curves:
```css
--ease-out-spring: cubic-bezier(0.16, 1, 0.3, 1);    /* snappy spring — card lifts, reveals */
--ease-luxury:     cubic-bezier(0.25, 0.46, 0.45, 0.94); /* smooth decelerate — nav, overlays */
--ease-soft:       cubic-bezier(0.4, 0.0, 0.2, 1);   /* Ken Burns hero zooms */
```

### Animations
- **Ken Burns Hero:** The `CanvasHero` or background imagery should slowly scale up (`transform: scale(1.06) -> scale(1.14)`) using `--ease-soft`.
- **Text Reveal:** Use a `clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%)` line-mask reveal for h1s and section headers.
- **`prefers-reduced-motion`:** Always wrap GSAP/Lenis logic with a check to disable complex motion if requested by the user.

---

## 7. Photography & Media Guidelines

- **Dark Context:** Aerial photography always sits on `ink` or `ink-2`. Never use light backgrounds.
- **Responsive Cropping:** Subjects must remain in the **center-third** of the horizontal frame to ensure `object-cover` works on mobile.
- **Cinematic Grade:** Apply a subtle CSS filter to inline images if they are too raw: `filter: saturate(0.88) contrast(1.04) brightness(0.88);` to match the moody tone.
- **Video Over Gifs:** Use Cloudinary MP4s optimized with `f_auto,q_auto`. Set the poster frame to `so_0` (frame 0) for instant perceived performance.