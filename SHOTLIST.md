# Apex Horizon Media — Master Shot List

Every image and video slot in the site is listed here with exact flight/capture instructions. Assets are organized by **priority** — the homepage hero sequence unlocks the most value first. Each entry includes the Cloudinary public ID to use when uploading, so the site auto-populates the moment the file is live.

---

## Camera & Settings Reference (DJI Air 3)

**Photo mode:** 48MP RAW + JPEG simultaneous. Manual exposure. ISO 100–200 preferred. Shoot RAW, deliver JPEG.

**Video mode:** 4K/60fps, 10-bit D-Log M. ND filter (ND16 or ND64 depending on sun). Target 180° shutter rule (e.g. 1/120 at 60fps).

**Color profile:** D-Log M for all video. Standard picture profile for JPEG stills if post time is tight; otherwise RAW.

**Framing rule (all shots):** Primary architectural subject must stay within the **center third** of the horizontal frame at all times. The site crops all images with `object-cover` on mobile — anything near the horizontal edges will be clipped.

**Wind badge threshold:** Log sustained wind speed for every flight block. Any block with **≥15 mph sustained** earns a wind badge in the portfolio. Record via DJI flight logs or a $20 anemometer.

---

## Priority 1 — Homepage Canvas Hero Sequence

This is the single highest-impact deliverable. The homepage hero is a scroll-scrubbed 60-frame JPEG sequence loaded via canvas. Until real frames exist, the site shows a solid dark placeholder.

### Shot 1-A: The Orbit

**Purpose:** 60-frame canvas hero — the primary homepage experience.

**Subject:** A visually strong Wyoming property (luxury ranch, large acreage, or mountain-view home). Secondary option: a high-elevation landmark with no private property if the first flight is test/practice.

**Flight plan:**
1. Fly to 250–280 ft AGL
2. Center the property in frame
3. Execute a **slow 180° orbit** (clockwise) over ~60–90 seconds — slow enough that 60 frames extracted at 1fps cover the full arc
4. Maintain constant altitude and radius throughout — any altitude drift creates a jarring jump between frames
5. If using video-to-frames workflow: record at 24fps for 60+ seconds, extract 1 frame per second in post

**Composition:** Property centered horizontally. Wyoming sky fills upper 40% of frame. Horizon line sits roughly at the rule-of-thirds lower line.

**Lighting:** Golden hour or 2–3 hours before sunset. Avoid harsh midday sun — the shadow detail in D-Log M will thank you.

**Post:** Extract 60 JPEGs from the video. Name them `frame-001.jpg` through `frame-060.jpg`. Upload to Vercel Blob storage or keep in `public/placeholder/hero-frames/` (replace the solid-color placeholders already there).

**Wind note:** This is the shot most exposed to wind shake. If sustained winds exceed 20 mph, fly it anyway — the GSAP scrub hides minor drift. Log the wind speed.

---

## Priority 2 — Homepage Hero Video (Background Loop)

Used as the fallback behind the canvas hero on slow networks / reduced-motion, and on the industrial page.

### Shot 2-A: Slow Push-In Over Laramie Valley

**Purpose:** `VideoHero` component background, homepage fallback, industrial-progress page hero.

**Cloudinary public ID:** `ahm-video-hero-main`

**Flight plan:**
1. 350–400 ft AGL, pointed slightly downward (gimbal -30°)
2. Slow forward movement (5–8 mph) over open Wyoming landscape — rolling terrain, no structures
3. Duration: 30–45 seconds clean
4. No sharp turns, no sudden altitude changes

**Post:** Export as H.264 MP4, target ~5MB for Vercel Blob delivery. Upload to Cloudinary as `ahm-video-hero-main`.

---

## Priority 3 — Location Hero Images (6 Shots)

These populate the background of every `/locations/[slug]` page. Each is a static image with a dark gradient overlay — less critical than video, but important for SEO and first impression.

Each photo should make a strong case for why someone would want drone media **in that specific place**.

### Shot 3-A: Laramie

**Cloudinary public ID:** `ahm-hero-laramie`

**Subject:** Wide cityscape from above — the University of Wyoming campus with the Laramie Range in the background. Alternatively: a residential neighborhood with clear mountain horizon.

**Altitude:** 400 ft AGL. **Direction:** Face northwest to capture both the city and the Medicine Bow peaks behind.

**Time of day:** Late afternoon — long shadows across the grid street layout reads beautifully from above.

---

### Shot 3-B: Cheyenne

**Cloudinary public ID:** `ahm-hero-cheyenne`

**Subject:** Capitol dome or central Cheyenne with the Front Range visible on the horizon. The legislative district with I-25 visible creates strong leading lines.

**Altitude:** 400 ft AGL. **Direction:** West or southwest to capture the Front Range.

**Time of day:** Golden hour — the Front Range catches orange light while the city grid is in the foreground.

---

### Shot 3-C: Casper

**Cloudinary public ID:** `ahm-hero-casper`

**Subject:** North Platte River bend with Casper Mountain rising in the background. The river curve creates a natural compositional anchor.

**Altitude:** 350 ft AGL over the river. **Direction:** South-southwest toward Casper Mountain.

**Time of day:** Morning light hits the mountain face well before it gets harsh.

---

### Shot 3-D: Ranchettes

**Cloudinary public ID:** `ahm-hero-ranchettes`

**Subject:** 5–40 acre lots from above — the property boundary lines, fencing, and open pasture. Equestrian fencing is particularly strong visually.

**Altitude:** 300 ft AGL. Show at least 2–3 adjacent properties to convey scale and lot size.

**Composition:** Horizon line at upper quarter. Sky takes a back seat here — the land tells the story.

---

### Shot 3-E: Iron Mountain

**Cloudinary public ID:** `ahm-hero-iron-mountain`

**Subject:** High-elevation terrain with dramatic topographic relief. Rocky outcrops, scrub pine, and a visible road winding through the hills.

**Altitude:** 400 ft AGL (you'll be at ~6,200 ft elevation — check airspace). **Direction:** Toward the most dramatic relief.

**Wind note:** Iron Mountain regularly runs 25–35 mph. Log wind speed. This is a prime wind-badge candidate.

---

### Shot 3-F: Bar Nunn

**Cloudinary public ID:** `ahm-hero-bar-nunn`

**Subject:** Mixed residential/industrial landscape north of Casper. Airport proximity and grid development pattern from above.

**Altitude:** 300 ft AGL. **Note:** Check airport TFRs — Casper-Natrona County International (CPR) is within 2 miles. Class D airspace requires authorization via LAANC.

---

## Priority 4 — Portfolio Cover Images (9 Shots)

One cover shot per portfolio item. These appear in the portfolio grid and on individual portfolio pages. Each should be the single strongest frame from that shoot.

**Shared rule:** Primary subject centered. No strong horizontal lines within 20% of the left or right edge (these get clipped on mobile portrait crop).

---

### Shot 4-1: Luxury Ranch Estate — Laramie Foothills

**Cloudinary public ID:** `ahm-portfolio-laramie-01`

**Target property:** Large acreage home, 280 ft AGL, 45° orbit position showing the home, outbuildings, and the foothills behind.

**Wind note:** This item has `sustainedWindMPH: 24` in the data — confirm during flight and update if different.

---

### Shot 4-2: Modern Family Home — Cheyenne

**Cloudinary public ID:** `ahm-portfolio-cheyenne-01`

**Target property:** Single-family residential, 200 ft AGL, straight overhead or slight forward angle. Clean neighborhood context.

---

### Shot 4-3: Commercial Retail Center — Casper

**Cloudinary public ID:** `ahm-portfolio-casper-01`

**Target property:** Strip mall or standalone commercial building with parking lot. 300 ft AGL showing rooftop, signage, and parking configuration.

---

### Shot 4-4: 40-Acre Equestrian Estate — Ranchettes

**Cloudinary public ID:** `ahm-portfolio-ranchettes-01`

**Target property:** Ranch/equestrian property. 280 ft AGL showing full parcel — fencing lines, barn, arena, main structure all visible. This is the site's marquee luxury shot.

**Wind note:** Item has `sustainedWindMPH: 28`. Confirm and update.

---

### Shot 4-5: New Construction Subdivision — Laramie

**Cloudinary public ID:** `ahm-portfolio-laramie-02`

**Target property:** Active construction or recently completed subdivision. 300 ft AGL — the grid of new lots and framed homes from a near-nadir perspective shows progress clearly.

---

### Shot 4-6: Mountain View Acreage — Iron Mountain

**Cloudinary public ID:** `ahm-portfolio-iron-mountain-01`

**Target property:** Undeveloped or lightly developed acreage parcel with mountain views. 400 ft AGL. The property lines and mountain backdrop in the same frame is the money shot.

**Wind note:** Item has `sustainedWindMPH: 31`. This is your highest-wind badge. Confirm during flight.

---

### Shot 4-7: Downtown Cheyenne Mixed-Use

**Cloudinary public ID:** `ahm-portfolio-cheyenne-02`

**Target property:** Multi-story commercial/mixed-use building in Cheyenne's downtown core. 250 ft AGL, slight forward angle to show the street-level context and rooftop.

---

### Shot 4-8: Casper Mountain Retreat

**Cloudinary public ID:** `ahm-portfolio-casper-02`

**Target property:** Mountain cabin or retreat property on the Casper Mountain approach. 320 ft AGL with mountain terrain as backdrop.

---

### Shot 4-9: Industrial Warehouse Complex — Bar Nunn

**Cloudinary public ID:** `ahm-portfolio-bar-nunn-01`

**Target property:** Large warehouse or light-industrial facility. 200 ft AGL, near-nadir angle. Rooftop and loading docks visible. This establishes the B2B / industrial portfolio category.

---

## Priority 5 — Industrial Project Cover Images (3 Shots)

These appear on the `/services/industrial-progress` page and in the industrial portfolio.

### Shot 5-A: Data Center Expansion Progress

**Cloudinary public ID:** `ahm-industrial-datacenter-01`

**Subject:** Active large-scale construction site (data center, commercial building, or equivalent). 300–400 ft AGL, slightly forward-facing angle showing the full site footprint. Steel framing or concrete pour in progress is ideal.

**Note:** If a real data center project isn't available yet, a commercial construction site of any type works for launch. Replace when the real project begins.

---

### Shot 5-B: Orthomosaic Survey — Industrial Park

**Cloudinary public ID:** `ahm-industrial-casper-01`

**Subject:** Overhead near-nadir shot of an industrial park, warehouse cluster, or large commercial site. This should look like the top-down "map view" that a project manager would expect from an orthomosaic deliverable.

**Altitude:** 300 ft AGL. **Gimbal:** -90° (straight down).

---

### Shot 5-C: Volumetric Analysis Site — Bar Nunn

**Cloudinary public ID:** `ahm-industrial-barnunn-01`

**Subject:** Any site with visible stockpiles, earthworks, cut/fill terrain, or grading activity. Gravel pit, construction site, or aggregate yard.

**Altitude:** 250 ft AGL, 45° angle showing both the topographic relief and surrounding context.

---

## Priority 6 — Static Social / OG Image

### Shot 6-A: Open Graph Default Image

**Filename:** `public/og-default.jpg` (1200×630px)

**Purpose:** Appears as the link preview when anyone shares the site on social media or iMessage.

**Subject:** Single strongest aerial frame — ideally the same property as the hero orbit, or the most dramatic landscape shot from any of the above.

**Specs:** Export at exactly 1200×630px. The primary subject must be in the center 600×630px zone (Facebook and Twitter both crop the sides on mobile).

---

## Pre-Flight Checklist (Per Session)

- [ ] FAA LAANC authorization confirmed for flight area
- [ ] Battery: 3 charged, ND filters packed (ND16 + ND64)
- [ ] DJI Air 3 firmware current
- [ ] SD card formatted
- [ ] Wind speed at site < 28 mph (Air 3 max spec); note actual sustained speed
- [ ] D-Log M color profile active, 10-bit confirmed in metadata
- [ ] Memory: 60 frames @ ~12KB each = ~720KB — shoot liberally, cull in post

## Post-Production Checklist (Per Session)

- [ ] Log sustained wind speed for each flight block — values ≥15 mph earn a wind badge
- [ ] Review all clips: minimum 12 seconds of clean movement per clip?
- [ ] Mobile safe zone check: primary subject stays in center third of horizontal frame?
- [ ] Histograms: sky highlights not clipped? Shadow recesses clean?
- [ ] All video files confirmed 10-bit D-Log M in metadata before LUT application?
- [ ] Hero frames: exactly 60 JPEGs, named `frame-001.jpg` → `frame-060.jpg`, ~1920×1080px

## Post-Production Priority Order

1. **Hero orbit → 60 JPEG sequence** — site's most complex component is waiting for this
2. **Location hero images (3-A through 3-F)** — all 6 location pages read as placeholder until filled
3. **Portfolio covers (4-1 through 4-9)** — portfolio grid shows placeholder cards until uploaded
4. **Industrial project covers (5-A through 5-C)** — B2B landing page
5. **OG image** — social sharing

## Cloudinary Upload Instructions

1. Log into Cloudinary → Media Library
2. Upload each file
3. **Rename the public ID** to exactly match the ID listed above (e.g. `ahm-hero-laramie`, `ahm-portfolio-laramie-01`)
4. Add tag `ahm` to all assets for easy filtering
5. Set `.env` `PUBLIC_CLOUDINARY_CLOUD_NAME` to your cloud name
6. The site will automatically serve real images the next time it deploys — no code changes required

---

*Wind badge threshold: any flight block with ≥15 mph sustained winds gets logged. The site renders: "Captured in [N] mph sustained winds — Stable Transmission." This is the competitive moat against out-of-state aggregators who ground in Wyoming conditions.*
