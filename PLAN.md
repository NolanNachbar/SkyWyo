# Apex Horizon Media — Wyoming Drone Real Estate Website

## Context

A drone real estate media company in Laramie, Wyoming needs a high-converting cinematic website. The business services Laramie, Cheyenne, and Casper — plus surrounding luxury and industrial hubs (Ranchettes, Iron Mountain, Bar Nunn). Primary revenue drivers: direct shoot bookings, ongoing realtor/broker contracts, and enterprise B2B retainers (construction progress / data center monitoring). Fresh project — no existing code, no assets, no branding yet.

**Placeholder business name:** Apex Horizon Media  
**Tagline:** "Wyoming Properties. Elevated."

---

## Tech Stack ($0 Budget)

| Layer | Technology | Free Tier |
|---|---|---|
| Meta-framework | Astro (Islands Architecture, SSG + ISR) | Free / open-source |
| Interactive runtime | React (islands only) | Free / open-source |
| Styling | Tailwind CSS | Free / open-source |
| Scroll | Lenis (`autoRaf: false`, synced to GSAP ticker) | Free / open-source |
| Animation | GSAP + ScrollTrigger | Free / open-source |
| CMS | Sanity (GROQ queries, ISR webhook) | Free tier: 3 datasets, generous bandwidth |
| Images | Cloudinary (`f_auto`, `q_auto`, srcset) | Free tier: 25 credits/month |
| Video | Cloudinary (video) + Vercel Blobs (short MP4s) | Cloudinary: 25 credits; Blobs: 250MB / 5GB bandwidth |
| UI primitives | shadcn/ui | Free / open-source |
| Deployment | Vercel | Free hobby tier |
| Email / Forms | Resend API | Free: 3,000 emails/month |
| Analytics | Cloudflare Web Analytics | Free, unlimited, cookie-free |
| Automation | Make.com (optional) | Free: 1,000 ops/month |

**Removed:** Mux (paid on first encode), Plausible (paid after trial), Zapier (100 tasks/month cap). All replaced with free alternatives that cover early-stage traffic volumes.

---

## Design System

### Color Palette (Ink & Paper)
```css
--color-ink:         #0a0a0b   /* main background */
--color-ink-2:       #111113   /* secondary backgrounds */
--color-paper:       #efeae1   /* primary text / headings */
--color-paper-2:     #d8d2c6   /* secondary text */
--color-paper-dim:   #a5a096   /* muted text, captions */
--color-paper-mute:  #726d64   /* deeply muted text */
--color-rule:        rgba(239, 234, 225, 0.12) /* subtle borders */
--color-rule-strong: rgba(239, 234, 225, 0.22) /* strong borders */
--color-accent:      #c2a574   /* champagne / gold — all CTAs */
```
The "Ink & Paper" system provides a deeply cinematic, editorial contrast. The dark `--ink` background maximizes aerial footage impact, while the warm `--paper` text feels premium and readable.

### Typography
- **Space Grotesk** (or Instrument Sans) — UI, functional text, display caps
- **Inter** — body, forms
- **Cinzel** (or Instrument Serif) — page h1s, location hero headlines, package names
- Fluid type scale via `clamp()` from `--text-xs` (0.75rem) to `--text-hero` (7rem max)

### Hero Layout: Asymmetric Lower-Left
Text blocks are pinned to the **lower-left quadrant** — never centered. The aerial footage occupies the full canvas as the dominant visual element.

```
┌────────────────────────────────────────────────────────┐
│  [Logo]                                     [Book Now] │
│                                                        │
│         [Canvas Hero: aerial orbit footage]            │
│                                                        │
│  Wyoming Properties.                                   │
│  Elevated.                                             │
│  [CTA buttons]                                         │
└────────────────────────────────────────────────────────┘
```

---

## File Architecture

```
apex-horizon-media/
├── astro.config.mjs              # Astro + React + Vercel adapter + View Transitions
├── tailwind.config.mjs           # Extended theme: colors, fonts, spacing tokens
├── sanity.config.ts              # Sanity Studio config
├── sanity/
│   ├── schemas/                  # CMS schemas (see Schema section)
│   └── lib/
│       ├── client.ts             # Sanity CDN client
│       └── queries.ts            # Centralized GROQ queries
├── src/
│   ├── pages/
│   │   ├── index.astro           # Homepage
│   │   ├── services.astro        # Consumer real estate services
│   │   ├── services/
│   │   │   └── industrial-progress.astro  # Enterprise B2B: construction tracking
│   │   │   └── agricultural-ranch.astro   # Enterprise B2B: ranch & land mapping
│   │   ├── portfolio/
│   │   │   ├── index.astro       # Portfolio grid
│   │   │   └── [slug].astro      # Dynamic portfolio item
│   │   ├── locations/
│   │   │   └── [slug].astro      # DYNAMIC — all cities/hubs from Sanity
│   │   ├── about.astro
│   │   ├── book.astro            # Primary conversion page
│   │   ├── pricing.astro
│   │   └── api/
│   │       ├── revalidate.ts     # Sanity ISR webhook handler
│   │       └── contact.ts        # Form submission → Resend email
│   ├── layouts/
│   │   ├── BaseLayout.astro      # HTML shell, ViewTransitions, JSON-LD slot, CF Analytics
│   │   ├── PageLayout.astro      # Nav + footer wrapper
│   │   └── PortfolioLayout.astro # Full-bleed for portfolio items
│   ├── components/
│   │   ├── global/
│   │   │   ├── Navbar.astro
│   │   │   ├── NavbarIsland.tsx  # React: mobile drawer, scroll-aware transparency
│   │   │   ├── Footer.astro      # Location links, schema data
│   │   │   ├── CTABanner.astro   # Sticky mobile bottom bar
│   │   │   └── SmoothScroll.tsx  # Lenis init (client:only)
│   │   ├── hero/
│   │   │   ├── CanvasHero.tsx    # React: canvas image sequence, GSAP scrub + pin
│   │   │   ├── VideoHero.tsx     # React: Cloudinary MP4 loop fallback
│   │   │   └── HeroTypography.astro  # Lower-left asymmetric text block
│   │   ├── sections/
│   │   │   ├── ServicesGrid.astro        # Includes industrial/B2B card
│   │   │   ├── PortfolioShowcase.astro
│   │   │   ├── StatsBar.astro
│   │   │   ├── TestimonialsCarousel.tsx  # React island
│   │   │   ├── PricingCards.astro
│   │   │   ├── LocationsMap.astro        # Wyoming SVG, pins from Sanity locations[]
│   │   │   ├── ProcessSteps.astro
│   │   │   ├── TrustBadges.astro         # FAA Part 107 badge prominent
│   │   │   ├── LocalAdvantage.astro      # Anti-aggregator block (Wyoming-owned)
│   │   │   └── FaqAccordion.tsx          # React island
│   │   ├── portfolio/
│   │   │   ├── PortfolioGrid.tsx         # React: filter tabs + masonry
│   │   │   ├── PortfolioCard.astro       # Shows wind badge if sustainedWindMPH present
│   │   │   ├── PortfolioHero.tsx         # React: Cloudinary <video> element
│   │   │   └── PortfolioMeta.astro
│   │   ├── forms/
│   │   │   ├── BookingForm.tsx           # React: 4-step form + UTM passthrough + Interactive Estimator
│   │   │   └── FormSuccess.tsx
│   │   ├── seo/
│   │   │   ├── LocalBusinessSchema.astro # JSON-LD — driven by Sanity locationPage
│   │   │   ├── BreadcrumbSchema.astro
│   │   │   └── OpenGraphMeta.astro
│   │   └── ui/                           # shadcn: Button, Badge, Card, Dialog
│   ├── lib/
│   │   ├── gsap.ts               # GSAP + ScrollTrigger setup, Lenis ticker sync
│   │   ├── lenis.ts              # Lenis factory (autoRaf: false)
│   │   ├── cloudinary.ts         # Image + video URL builders, srcset, poster frame
│   │   ├── resend.ts             # Email send helper wrapping Resend API
│   │   ├── sanity.ts             # Re-exports from sanity/lib
│   │   └── motion.ts             # prefers-reduced-motion gate + GSAP defaults
│   └── styles/
│       ├── global.css            # CSS custom properties, fluid type scale, resets
│       ├── animations.css        # Line-mask keyframes, fade-up utilities
│       └── fonts.css
└── public/
    ├── placeholder/hero-frames/  # 60 WebP frames for canvas hero (placeholder)
    └── placeholder/portfolio/    # Placeholder property images
```

---

## Sanity CMS Schemas

### `portfolio` (core content type)
Key fields: `title`, `slug`, `location` (string — matches any locationPage slug), `propertyType`, `cloudinaryPublicId`, `gallery[]`, `services[]`, `featured`, `caseStudyEnabled`, `caseStudyBody` (Portable Text), `agentName`, `brokerageName`, `seo{}`

`cloudinaryPublicId` field description (set in schema to enforce at content-entry time):
```typescript
{
  name: 'cloudinaryPublicId',
  type: 'string',
  description: 'Only store the raw public ID string (e.g. "ahm-portfolio-laramie-01"). Do NOT paste full URLs. Responsive cropping rule: keep core architectural subjects within the center-third of the horizontal frame so object-cover crops cleanly on mobile.'
}
```

**Operational metadata object** (Wyoming wind trust badge):
```typescript
operationalMetadata: {
  faaPart107Compliant: boolean,   // always true post-certification; shown as badge
  sustainedWindMPH: number,       // e.g. 24 → renders "Captured in 24 mph sustained winds"
  flightAltitudeFt: number,       // optional, shown in industrial/commercial case studies
}
```
When `sustainedWindMPH >= 15`, renders trust overlay: _"Captured in {N} mph sustained winds — Stable Transmission."_ Competitive moat against out-of-state aggregators who ground in Wyoming conditions.

### `testimonial`
Key fields: `quote`, `authorName`, `authorTitle`, `brokerage`, `location`, `rating`, `featured`, `portfolioRef` (reference)

### `servicePackage`
Key fields: `name`, `tier` (starter/standard/premium/enterprise), `price`, `features[]`, `deliverables[]`, `turnaroundDays`, `highlighted` (Most Popular), `addOns[]`, `ctaType`

### `locationPage` (powers dynamic `[slug].astro`)
Key fields: `city` (slug — e.g. `laramie`, `ranchettes`, `iron-mountain`, `bar-nunn`), `heroHeadline`, `heroCloudinaryId`, `bodyContent` (500+ word SEO block), `stats[]`, full LocalBusiness JSON-LD fields (`streetAddress`, `geo{latitude,longitude}`, `telephone`), `areaType` (enum: `city` | `suburb` | `luxury-hub` | `industrial-zone`), `seo{}`

New locations are added via Sanity Studio only — zero frontend code changes required.

### `industrialProject` (B2B enterprise content type)
Key fields: `title`, `slug`, `client` (e.g. "Microsoft Data Center Expansion"), `location`, `projectType` (enum: `construction-progress` | `orthomosaic` | `volumetric-mapping` | `inspection` | `agricultural-survey`), `frequency` (enum: `weekly` | `monthly` | `milestone-based`), `coverImage`, `cloudinaryVideoId`, `deliverables[]`, `caseStudyBody`, `featured`

### `teamMember`
Key fields: `name`, `role`, `bio`, `photo`, `certifications[]` (e.g. "FAA Part 107 Remote Pilot Certificate")

---

## Video Strategy (Free Alternatives to Mux)

**Cloudinary video** (primary): Short aerial clips uploaded to Cloudinary. `f_auto,q_auto` handles format optimization (MP4/WebM by browser). Fits within 25 free credits/month at early-stage traffic.

**Vercel Blobs** (hero loops): Very short loops (< 10 seconds, < 5MB) served directly from Vercel Blobs as optimized MP4. Zero encoding cost, edge delivery. Free up to 250MB / 5GB bandwidth.

**Video component pattern:**
```html
<video
  src="https://res.cloudinary.com/{cloud}/video/upload/f_auto,q_auto/{publicId}.mp4"
  poster="https://res.cloudinary.com/{cloud}/video/upload/so_0,w_1280/{publicId}.jpg"
  preload="metadata"
  controls
  playsinline
/>
```

---

## Page Breakdown

### Homepage (`/`)
1. **CanvasHero** — 60-frame scroll-scrubbed aerial orbit, pinned. Text lower-left (`pb-32 pl-16`). Gold "Book Your Shoot" CTA + ghost "View Portfolio" CTA. Line-mask headline reveal.
2. **StatsBar** — shoots completed, cities covered, avg days-on-market reduction, rating.
3. **ServicesGrid** — 5 cards: Aerial Photo, Aerial Video, Twilight, Mapping, **Industrial Progress** ("Enterprise" badge → `/services/industrial-progress`).
4. **PortfolioShowcase** — 6 `featured=true` items, hover reveals Cloudinary video thumbnail (first-frame via `so_0`).
5. **TestimonialsCarousel** — broker testimonials with photo, brokerage, star rating.
6. **CTA Banner** — "Ready to sell faster? Book your shoot today."
7. **LocationsMap** — Wyoming SVG with city pins pulled dynamically from Sanity.
8. **TrustBadges** — FAA Part 107, Licensed & Insured, 24-48hr Delivery, 5-Star.

### Services — Industrial Progress (`/services/industrial-progress`)
Dedicated B2B page for construction project managers and corporate facilities teams.
- Hero: Cloudinary-hosted MP4 of construction site aerial mapping
- Value props: weekly progress documentation, orthomosaic deliverables, volumetric change analysis, compliance photography
- CTA: "Request Enterprise Consultation" → `/book?type=industrial`

### Portfolio (`/portfolio` and `/portfolio/[slug]`)
Filter tabs include `Industrial` alongside residential/commercial/land/luxury.
Item page: renders wind telemetry badge in `PortfolioMeta` if `sustainedWindMPH` is set.

### Locations — Dynamic (`/locations/[slug]`)
Single `[slug].astro` generates all city/hub pages via `getStaticPaths()` from Sanity.
- Initial seed: laramie, cheyenne, casper
- Added via Sanity Studio later: ranchettes, iron-mountain, bar-nunn
- Each page: aerial video hero, local stats, filtered portfolio, local testimonials, 500+ word SEO body, `LocalBusinessSchema` JSON-LD

### Book (`/book`)
4-step React BookingForm with UTM passthrough:
- Step 1: Name, email, phone
- Step 2: Location (pre-filled from `?location=`), property/project type (switches for `?type=industrial`), date
- Step 3: Package selection (visual radio cards)
- Step 4: Summary + submit → Resend email to owner inbox

### Pricing (`/pricing`)
3 consumer tiers (Summit / Horizon★ / Apex) + "Enterprise" card → `/services/industrial-progress`.

---

## Critical Technical Patterns

### Dynamic Location Routes
```typescript
// src/pages/locations/[slug].astro
export async function getStaticPaths() {
  const locations = await sanityClient.fetch(
    `*[_type == "locationPage"]{ city, slug }`
  );
  return locations.map(loc => ({
    params: { slug: loc.slug.current },
    props: { city: loc.city }
  }));
}
```

### Lenis + GSAP Ticker Sync
```typescript
// src/lib/lenis.ts
export function createLenis() {
  const lenis = new Lenis({ autoRaf: false, lerp: 0.08, syncTouch: true });
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}
```

### Canvas Hero Scroll Scrub
```typescript
gsap.to(frameRef, {
  currentFrame: TOTAL_FRAMES - 1,
  snap: 'currentFrame',
  ease: 'none',
  scrollTrigger: {
    trigger: containerRef.current,
    start: 'top top',
    end: `+=${TOTAL_FRAMES * 20}px`,
    scrub: 0.5,
    pin: true,
  },
  onUpdate: () => drawFrame(Math.round(frameRef.current.currentFrame)),
});
```

### Canvas Fallback (network-aware)
```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const connection = (navigator as any).connection;
const slowNetwork =
  connection?.saveData ||
  ['text', '2g', '3g'].includes(connection?.effectiveType ?? '');

if (prefersReducedMotion || slowNetwork) {
  return <StaticHeroImage />; // static Cloudinary image, no canvas
}
```
`saveData` catches data-saver mode; `3g` catches marginal rural connections common in Wyoming.

### UTM Passthrough
```typescript
// BookingForm.tsx — on mount
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  ['utm_source','utm_medium','utm_campaign','utm_content'].forEach(key => {
    const val = params.get(key) || sessionStorage.getItem(key);
    if (val) sessionStorage.setItem(key, val);
  });
}, []);

// On submit — merge into payload
const utmData = Object.fromEntries(
  ['utm_source','utm_medium','utm_campaign','utm_content']
    .map(k => [k, sessionStorage.getItem(k) ?? ''])
);
const payload = { ...formData, ...utmData };
```

### Form Handler (Resend, no Zapier)
```typescript
// src/pages/api/contact.ts
import { Resend } from 'resend';
const resend = new Resend(import.meta.env.RESEND_API_KEY);

// NOTE: Free tier requires `from: 'onboarding@resend.dev'` until you verify a custom domain.
// After verifying apexhorizonmedia.com in Resend dashboard, switch to bookings@apexhorizonmedia.com.

export async function POST({ request }) {
  try {
    const data = await request.json();

    await resend.emails.send({
      from: 'onboarding@resend.dev', // swap to verified domain address post-setup
      to: import.meta.env.OWNER_EMAIL,
      subject: `Apex Horizon — New Inquiry [${data.location}]`,
      html: `
        <h3>New Booking Inquiry</h3>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p><strong>Type:</strong> ${data.propertyType}</p>
        <p><strong>Package:</strong> ${data.package}</p>
        <p><strong>Preferred Date:</strong> ${data.preferredDate}</p>
        <hr />
        <p><strong>UTM Source:</strong> ${data.utm_source || 'Direct'}</p>
        <p><strong>UTM Medium:</strong> ${data.utm_medium || '—'}</p>
        <p><strong>UTM Campaign:</strong> ${data.utm_campaign || '—'}</p>
      `,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
```

### Analytics (Cloudflare Web Analytics)
```html
<!-- BaseLayout.astro — no npm package, no cookie banner -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js'
  data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>
```

### Wyoming Wind Badge
```astro
{item.operationalMetadata?.sustainedWindMPH >= 15 && (
  <div class="wind-badge">
    Captured in {item.operationalMetadata.sustainedWindMPH} mph sustained winds — Stable Transmission
  </div>
)}
```

### Responsive Cropping Rule
All drone photography must keep the primary subject within the **middle 33% of the horizontal frame** at capture time. Ensures `object-cover` / `bg-cover` CSS never clips key structural elements on mobile vertical crops. Document this in the Sanity `coverImage` field description.

---

## CTA Conversion Strategy

### Hierarchy
- **Primary** (gold, 6+ per page): "Book Your Shoot" / "Book a Shoot in [City]"
- **Industrial primary**: "Request Enterprise Consultation"
- **Secondary** (ghost): "See Our Work" / "View Packages"
- **Micro**: "Get a free quote" / "Call us" (tel: link on mobile)

### Below every CTA
```
✓ FAA Part 107 Certified  ✓ 24–48hr Delivery  ✓ No Weather Cancellation Fees
```

### Location-specific CTAs
| Location | CTA |
|---|---|
| Laramie | "Laramie Listings Sell Faster — Book Now" |
| Cheyenne | "Stand Out in Cheyenne's Market — Book Your Shoot" |
| Casper | "Dominate Casper Real Estate — Aerial Media That Converts" |
| Ranchettes | "Luxury Acreage Demands Aerial Perspective — Book Now" |

### 4-Step Booking Form Psychology
Step-gating captures contact info at lowest commitment level (Step 1: name/email/phone only). By Step 3 (package selection), users are invested. shadcn Progress bar shows 75% complete before submit — reduces abandonment significantly.

### Broker Contract Acquisition
Portfolio case studies display: _"Sold in 6 days at full ask price with aerial media."_ This is the highest-converting asset for realtor partnerships. Add "For Teams" section on `/pricing` for bulk packages.

### Enterprise/B2B Acquisition
`/services/industrial-progress` targets Microsoft, data center contractors, commercial developers. Target: recurring monthly retainers, not one-off shoots.

---

## Placeholder Media Strategy

**Hero canvas frames** — extract 60 JPEGs from stock Wyoming aerial footage:
```bash
ffmpeg -i source.mp4 -vf fps=1 -frames:v 60 public/placeholder/hero-frames/frame-%03d.jpg
```

**Portfolio images** — upload 15–20 stock aerial property images to Cloudinary (`ahm-portfolio-{city}-{index}`).

**Videos** — upload stock aerial clips to Cloudinary for real `publicId` values during development.

**Testimonials** — 6 placeholder entries in Sanity with realistic Wyoming realtor names/brokerages (Coldwell Banker, RE/MAX, Mossy Oak Properties). Mark `placeholder: true` for easy removal post-launch.

---

## Build Phases

| Phase | Focus | Days | Milestone |
|---|---|---|---|
| 1 | Foundation: Astro init, Tailwind tokens, BaseLayout, Nav, Footer, Vercel deploy | 1–5 | Live URL with branding |
| 2 | Sanity CMS: all schemas, seed data, GROQ queries, ISR webhook | 6–10 | All pages render Sanity data |
| 3 | Core pages: all routes (dynamic `[slug]`, industrial page), SEO meta, JSON-LD | 11–20 | Full site navigable, JSON-LD validates |
| 4 | Canvas hero + scroll animations: Lenis sync, GSAP reveals, View Transitions, fallbacks | 21–27 | Lighthouse 85+ desktop, 60fps hero |
| 5 | Conversion: BookingForm 4-step + UTM passthrough, Resend email handler, location pre-fill | 28–33 | End-to-end booking funnel |
| 6 | Launch: Cloudflare Analytics, sitemap, robots.txt, final audits, DNS | 34–40 | Live on production domain |

---

## Verification Checklist

1. **Lighthouse** — Performance 90+, SEO 100, Accessibility 95+ on all routes
2. **Canvas hero** — smooth 60fps scrub on desktop; static fallback on `prefers-reduced-motion`
3. **Dynamic location routes** — adding a new `locationPage` in Sanity Studio triggers ISR and creates `/locations/[slug]` without a code deploy
4. **Booking form** — 4-step flow completes; `?utm_source=google` appears in email payload; `?location=cheyenne` pre-fills Step 2; `?type=industrial` switches to enterprise flow
5. **Wind badge** — item with `sustainedWindMPH: 24` shows badge; item with value < 15 shows nothing
6. **JSON-LD** — all location pages validate at `search.google.com/test/rich-results`
7. **Cloudinary video** — `<video>` loads MP4; poster frame appears before play; `preload="metadata"` in DevTools
8. **Cloudinary images** — `f_auto` serves AVIF on Chrome, WebP on Safari; correct srcset widths
9. **Resend email** — booking form submission arrives in owner inbox with UTM params in body
10. **Cloudflare analytics** — page visit registers in dashboard

---

## Critical Files

| File | Why critical |
|---|---|
| `src/pages/locations/[slug].astro` | Dynamic routing — `getStaticPaths()` must enumerate all Sanity location slugs correctly |
| `src/components/hero/CanvasHero.tsx` | Most complex component; drives the entire homepage experience |
| `src/lib/gsap.ts` | GSAP + Lenis sync — all animation components depend on this being initialized first |
| `sanity/schemas/index.ts` | Schema registry — all CMS functionality blocked until schemas are registered here |
| `src/layouts/BaseLayout.astro` | HTML shell — errors here break the entire site |
| `src/components/forms/BookingForm.tsx` | Primary revenue conversion; UTM passthrough; highest business impact |
| `src/pages/services/industrial-progress.astro` | Enterprise B2B moat; route to recurring retainer revenue |
