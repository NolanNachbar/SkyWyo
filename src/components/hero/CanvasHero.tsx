import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Scroll-scrubbed drone footage. Frames are extracted from the source video
// into /public/hero/frames/ (see scripts/extract-hero-frames.sh) and drawn to a
// canvas as the scroll position advances — the "Apple-style" technique.
const FRAME_COUNT = 120;
const framePath = (i: number) =>
  `/hero/frames/frame_${String(i + 1).padStart(4, '0')}.jpg`;
const POSTER = framePath(0);

interface Chapter {
  label: string;
  headline: React.ReactNode;
  body: string | null;
  gps: string;
  location: string;
  alt: string;
  code: string;
}

const CHAPTERS: Chapter[] = [
  {
    label: 'Open',
    headline: (
      <>
        Aerial real estate<br />
        <em style={{ fontStyle: 'italic', color: '#e8dcc2', fontWeight: 'inherit' }}>photography.</em>
      </>
    ),
    body: null,
    gps: "42°51'N 106°19'W",
    location: 'CASPER, WY',
    alt: 'GND · SITE SURVEY',
    code: 'SW-2025-001',
  },
];

function getChapterFromProgress(_progress: number): number {
  return 0;
}

export default function CanvasHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isLowMotion, setIsLowMotion] = useState(false);
  const imagesRef = useRef<(HTMLImageElement | undefined)[]>([]);
  const loadedRef = useRef(0);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const currentFrameRef = useRef(0);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isDataSaver = (navigator as any).connection?.saveData;

    if (motionQuery.matches || isDataSaver) {
      setIsLowMotion(true);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;
    ctxRef.current = context;

    // Size the backing store to the viewport (done on init + resize, not per-frame).
    function sizeCanvas() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
    }

    // Draw frame `index`, or the nearest already-loaded frame so the scrub
    // never flashes blank while later frames are still downloading.
    function drawFrame(index: number) {
      if (!canvas || !context) return;
      let img = imagesRef.current[index];
      if (!img) {
        for (let d = 1; d < FRAME_COUNT; d++) {
          if (imagesRef.current[index - d]) { img = imagesRef.current[index - d]; break; }
          if (imagesRef.current[index + d]) { img = imagesRef.current[index + d]; break; }
        }
      }
      if (!img) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const imgRatio = img.width / img.height;
      const canvasRatio = cw / ch;

      let drawWidth, drawHeight, offsetX, offsetY;
      if (imgRatio > canvasRatio) {
        drawHeight = ch;
        drawWidth = ch * imgRatio;
        offsetX = (cw - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = cw;
        drawHeight = cw / imgRatio;
        offsetX = 0;
        offsetY = (ch - drawHeight) / 2;
      }

      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    sizeCanvas();

    // Concurrent preloader: a small pool of workers pulls frames in ascending
    // order so the earliest (first seen) frames arrive first.
    let cancelled = false;
    let nextIndex = 0;
    const CONCURRENCY = 6;

    function startWorker() {
      if (cancelled || nextIndex >= FRAME_COUNT) return;
      const idx = nextIndex++;
      const img = new Image();
      (img as any).decoding = 'async';
      const done = () => {
        if (cancelled) return;
        if (img.naturalWidth) {
          imagesRef.current[idx] = img;
          loadedRef.current++;
        }
        if (idx === 0) {
          drawFrame(0);
          setIsInteractive(true);
        }
        // Keep the visible frame fresh as nearby frames finish loading.
        if (Math.abs(idx - currentFrameRef.current) <= CONCURRENCY) {
          drawFrame(currentFrameRef.current);
        }
        startWorker();
      };
      img.onload = done;
      img.onerror = done;
      img.src = framePath(idx);
    }
    for (let i = 0; i < CONCURRENCY; i++) startWorker();

    const isMobile = window.innerWidth < 768;

    const scrollTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: isMobile ? '+=160%' : '+=220%',
      pin: true,
      scrub: isMobile ? 1 : 0.5,
      onUpdate: (self) => {
        const progress = self.progress;
        const index = Math.min(
          FRAME_COUNT - 1,
          Math.round(progress * (FRAME_COUNT - 1))
        );
        currentFrameRef.current = index;
        setCurrentChapter(getChapterFromProgress(progress));
        drawFrame(index);
      },
    });

    const handleResize = () => {
      sizeCanvas();
      drawFrame(currentFrameRef.current);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelled = true;
      scrollTrigger.kill();
      window.removeEventListener('resize', handleResize);
      imagesRef.current = [];
      loadedRef.current = 0;
    };
  }, []);

  if (isLowMotion) {
    return (
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <img
          src={POSTER}
          className="absolute inset-0 h-full w-full object-cover cinematic-grade"
          alt="Aerial drone cinematography over Wyoming at first light"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/80" />
        <HeroContent currentChapter={0} />
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative h-screen w-full bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="h-full w-full object-cover cinematic-grade"
        />
        {!isInteractive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
            <div className="w-16 h-[1px] bg-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-1/3 bg-white animate-pulse" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-black/10 to-black/80" />
        <HeroContent currentChapter={currentChapter} />
      </div>
    </section>
  );
}

function HeroContent({ currentChapter }: { currentChapter: number }) {
  return (
    <>
      {/* Top-left brand plate */}
      <div
        className="absolute top-24 left-6 md:left-10 z-10 text-white/70"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase' }}
      >
        <span>LARAMIE, WY</span>
      </div>

      {/* Chapter text — all chapters stacked at same anchor */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-14 pb-24 text-white z-5">
        <div className="relative min-h-[200px] md:min-h-[380px]">
          {CHAPTERS.map((ch, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                opacity: currentChapter === i ? 1 : 0,
                transform: currentChapter === i ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 0.8s cubic-bezier(.4,0,.2,1), transform 0.8s cubic-bezier(.4,0,.2,1)',
                pointerEvents: currentChapter === i ? 'auto' : 'none',
              }}
            >
              <h1
                className="serif m-0 max-w-[14ch]"
                style={{ fontSize: 'clamp(38px, 5.5vw, 92px)', lineHeight: 0.94, letterSpacing: '-0.025em', textShadow: '0 2px 24px rgba(0,0,0,0.55)' }}
              >
                {ch.headline}
              </h1>
              {ch.body && (
                <p
                  className="font-body text-white/70 leading-relaxed m-0"
                  style={{ marginTop: '1.5rem', fontSize: 'var(--text-sm)', maxWidth: '42ch', textShadow: '0 1px 14px rgba(0,0,0,0.5)' }}
                >
                  {ch.body}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute left-1/2 bottom-8 -translate-x-1/2 z-10 flex flex-col items-center gap-3.5 text-white/55 animate-bounce"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.22em', textTransform: 'uppercase' }}
      >
        <span>Scroll</span>
        <span className="w-[1px] h-9 bg-gradient-to-b from-white/70 to-transparent" />
      </div>
    </>
  );
}
