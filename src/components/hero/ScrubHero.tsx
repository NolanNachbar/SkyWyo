import React, { useEffect, useRef } from 'react';

// SkyWyo landing — scroll-scrubbed canvas hero.
// Frames live in /public/hero/frames/ (frame_0001..frame_0120.jpg, 1920x1080).
// Canvas + scroll scrub, with a static-image fallback for reduced-motion and
// small touch devices.
const FRAME_COUNT = 120;
const framePath = (i: number) =>
  `/hero/frames/frame_${String(i + 1).padStart(4, '0')}.jpg`;

function useSimpleHero() {
  const [simple] = React.useState(() =>
    typeof window !== 'undefined' &&
    (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      (window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 900))
  );
  return simple;
}

interface Props {
  headline: string;
  sub: string;
}

export default function ScrubHero({ headline, sub }: Props) {
  const simple = useSimpleHero();
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (simple) return;
    const track = trackRef.current;
    const canvas = canvasRef.current;
    if (!track || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const images = new Array<HTMLImageElement>(FRAME_COUNT);
    const loaded = new Array<boolean>(FRAME_COUNT).fill(false);
    let raf = 0;
    let currentIdx = -1;
    let killed = false;

    function sizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas!.width = Math.round(canvas!.clientWidth * dpr);
      canvas!.height = Math.round(canvas!.clientHeight * dpr);
      currentIdx = -1; // force redraw
      update();
    }

    function drawCover(img: HTMLImageElement) {
      const cw = canvas!.width, ch = canvas!.height;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * s, h = img.naturalHeight * s;
      ctx!.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    }

    function nearestLoaded(idx: number) {
      if (loaded[idx]) return idx;
      for (let d = 1; d < FRAME_COUNT; d++) {
        if (loaded[idx - d]) return idx - d;
        if (loaded[idx + d]) return idx + d;
      }
      return -1;
    }

    function update() {
      raf = 0;
      const rect = track!.getBoundingClientRect();
      const total = track!.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, -rect.top / total));

      const want = Math.min(FRAME_COUNT - 1, Math.floor(p * FRAME_COUNT));
      const idx = nearestLoaded(want);
      if (idx !== -1 && idx !== currentIdx) {
        drawCover(images[idx]);
        currentIdx = idx;
      }

      // headline fades out 0.45 -> 0.68; closing line in 0.74 -> 0.9
      const copy = copyRef.current, close = closeRef.current, cue = cueRef.current;
      if (copy) {
        const o = p < 0.45 ? 1 : p > 0.68 ? 0 : 1 - (p - 0.45) / 0.23;
        copy.style.opacity = o.toFixed(3);
        copy.style.transform = `translateY(${(-28 * (1 - o)).toFixed(1)}px)`;
        copy.style.pointerEvents = o < 0.4 ? 'none' : 'auto';
      }
      if (close) {
        const o = p < 0.74 ? 0 : p > 0.9 ? 1 : (p - 0.74) / 0.16;
        close.style.opacity = o.toFixed(3);
        close.style.transform = `translateY(${(20 * (1 - o)).toFixed(1)}px)`;
      }
      if (cue) cue.style.opacity = p > 0.06 ? '0' : '1';
    }

    function schedule() {
      if (raf) return;
      raf = requestAnimationFrame(update);
    }

    // progressive load: first frame immediately, rest in order
    function loadFrame(i: number) {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => { if (killed) return; loaded[i] = true; images[i] = img; update(); };
      img.src = framePath(i);
      images[i] = img;
    }
    loadFrame(0);
    let next = 1;
    function loadRest() {
      if (killed || next >= FRAME_COUNT) return;
      loadFrame(next++);
      setTimeout(loadRest, 22);
    }
    // three parallel load chains so the full sequence is ready fast
    setTimeout(loadRest, 80);
    setTimeout(loadRest, 105);
    setTimeout(loadRest, 130);

    sizeCanvas();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', sizeCanvas);
    return () => {
      killed = true;
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', sizeCanvas);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [simple]);

  return (
    <div className={'hero-track' + (simple ? ' static' : '')} ref={trackRef}>
      <div className="hero-pin">
        {simple
          ? <img className="static-img" src={framePath(78)} alt="Aerial drone view over a Wyoming property" />
          : <canvas ref={canvasRef} aria-hidden="true"></canvas>}
        <div className="hero-shade" aria-hidden="true"></div>

        <nav className="hero-nav" aria-label="Site">
          <a className="logo" href="#top">SKY<span>WYO</span></a>
          <div className="nav-right">
            <span className="nav-cred">FAA Part 107 Certified · Wyoming</span>
            <a className="btn" href="#book">Book a free shoot</a>
          </div>
        </nav>

        <div className="hero-copy" ref={copyRef}>
          <h1>{headline}</h1>
          <p className="sub">{sub}</p>
          <a className="btn btn--lg btn--on-dark" href="#book">
            Book your free first shoot
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"></path></svg>
          </a>
          <div className="micro">FAA Part 107 certified · Wyoming owned &amp; operated · First shoot free</div>
        </div>

        {!simple && (
          <div className="hero-close" ref={closeRef} aria-hidden="true">
            <div className="big">This is one pass of the actual drone.</div>
            <div className="small">Shot over Wyoming — scrubbed by your scroll, frame by frame.</div>
          </div>
        )}

        {!simple && (
          <div className="scroll-cue" ref={cueRef} aria-hidden="true">
            <span>Scroll to fly</span>
            <span className="line"></span>
          </div>
        )}
      </div>
    </div>
  );
}
