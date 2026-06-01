import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const IMAGES = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2600&q=85',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2600&q=85',
  'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=2600&q=85',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2600&q=85',
];

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
        The land<br />
        as a <em style={{ fontStyle: 'italic', color: '#e8dcc2', fontWeight: 'inherit' }}>film.</em>
      </>
    ),
    body: null,
    gps: "42°51'N 106°19'W",
    location: 'CASPER, WY',
    alt: 'GND · SITE SURVEY',
    code: 'SW-2025-001',
  },
  {
    label: 'I · The pass',
    headline: (
      <>
        Photographed<br />
        in <em style={{ fontStyle: 'italic', color: '#e8dcc2', fontWeight: 'inherit' }}>motion.</em>
      </>
    ),
    body: 'One continuous orbit. Eight kilometres of flight path.',
    gps: "43°28'N 110°42'W",
    location: 'JACKSON HOLE, WY',
    alt: 'ALT 3,400 FT AGL',
    code: 'SW-2025-002',
  },
  {
    label: 'II · The vantage',
    headline: (
      <>
        From eleven<br />
        <em style={{ fontStyle: 'italic', color: '#e8dcc2', fontWeight: 'inherit' }}>thousand feet.</em>
      </>
    ),
    body: 'The land is the listing. We photograph the ranch, the river, the sightline — then the house as the inevitable result.',
    gps: "44°23'N 107°15'W",
    location: 'BIGHORN BASIN, WY',
    alt: 'ALT 11,000 FT AGL',
    code: 'SW-2025-003',
  },
  {
    label: 'III · The outcome',
    headline: (
      <>
        A film that<br />
        moves <em style={{ fontStyle: 'italic', color: '#e8dcc2', fontWeight: 'inherit' }}>markets.</em>
      </>
    ),
    body: 'Our 2025 films closed an average of twenty-one days sooner than category.',
    gps: "42°51'N 106°19'W",
    location: 'CASPER, WY',
    alt: 'RTH · FINAL DELIVERY',
    code: 'SW-2025-004',
  },
];

const CHAPTER_BOUNDS = [0, 0.22, 0.46, 0.70, 1.0];

function getChapterFromProgress(progress: number): number {
  for (let i = CHAPTER_BOUNDS.length - 2; i >= 0; i--) {
    if (progress >= CHAPTER_BOUNDS[i]) return i;
  }
  return 0;
}

export default function CanvasHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isLowMotion, setIsLowMotion] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const animationState = useRef({ currentFrame: 0 });

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

    function render(index: number) {
      if (!canvas || !context || !imagesRef.current[index]) return;

      const img = imagesRef.current[index];
      const canvasWidth = window.innerWidth * window.devicePixelRatio;
      const canvasHeight = window.innerHeight * window.devicePixelRatio;

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const imgRatio = img.width / img.height;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgRatio > canvasRatio) {
        drawHeight = canvasHeight;
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
      } else {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
      }

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }

    const isMobile = window.innerWidth < 768;

    const initializeSequence = async () => {
      const firstImg = new Image();
      firstImg.src = IMAGES[0];
      await new Promise((resolve) => {
        firstImg.onload = () => {
          imagesRef.current[0] = firstImg;
          resolve(null);
        };
      });

      render(0);
      setIsInteractive(true);

      const loadRest = () => {
        IMAGES.slice(1).forEach((src, i) => {
          const img = new Image();
          img.src = src;
          img.onload = () => {
            imagesRef.current[i + 1] = img;
          };
        });
      };

      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(loadRest);
      } else {
        setTimeout(loadRest, 100);
      }
    };

    initializeSequence();

    let scrollTrigger: globalThis.ScrollTrigger | null = null;
    let autoPlayInterval: number | null = null;

    if (isMobile) {
      let frame = 0;
      autoPlayInterval = window.setInterval(() => {
        frame = (frame + 1) % IMAGES.length;
        setCurrentChapter(frame);
        render(frame);
      }, 4000);

      scrollTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1.5,
        onUpdate: (self) => {
          const shift = Math.floor(self.progress * 2);
          const targetFrame = (frame + shift) % IMAGES.length;
          render(targetFrame);
        },
      });
    } else {
      scrollTrigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${(IMAGES.length - 1) * 100}%`,
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress;
          const index = Math.min(IMAGES.length - 1, Math.floor(progress * IMAGES.length));
          const chapter = getChapterFromProgress(progress);
          setCurrentChapter(chapter);
          animationState.current.currentFrame = index;
          render(index);
        },
      });
    }

    const handleResize = () => {
      render(Math.floor(animationState.current.currentFrame || 0));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (scrollTrigger) scrollTrigger.kill();
      if (autoPlayInterval) clearInterval(autoPlayInterval);
      window.removeEventListener('resize', handleResize);
      imagesRef.current = [];
    };
  }, []);

  if (isLowMotion) {
    return (
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <img
          src={IMAGES[0]}
          className="absolute inset-0 h-full w-full object-cover cinematic-grade"
          alt="Aerial drone cinematography over Wyoming ranch land at first light"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/65" />
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
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/55 via-transparent to-black/65" />
        <HeroContent currentChapter={currentChapter} />
      </div>
    </section>
  );
}

function ChapterIndex({ currentChapter }: { currentChapter: number }) {
  return (
    <div
      className="absolute right-14 z-10 hidden md:flex flex-col gap-5"
      style={{ top: '50%', transform: 'translateY(-50%)' }}
    >
      {CHAPTERS.map((chapter, i) => (
        <div
          key={i}
          className="flex items-center gap-3"
          style={{
            opacity: currentChapter === i ? 1 : 0.38,
            transition: 'opacity 0.6s cubic-bezier(.4,0,.2,1)',
          }}
        >
          <span
            className="block h-[1px]"
            style={{
              width: currentChapter === i ? '64px' : '8px',
              backgroundColor: currentChapter === i ? '#c2a574' : 'rgba(255,255,255,0.55)',
              transition: 'width 0.6s cubic-bezier(.4,0,.2,1), background-color 0.6s cubic-bezier(.4,0,.2,1)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase' as const,
              color: 'white',
              whiteSpace: 'nowrap',
            }}
          >
            {chapter.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function HeroContent({ currentChapter }: { currentChapter: number }) {
  const chapter = CHAPTERS[currentChapter];

  return (
    <>
      {/* Top-left brand plate */}
      <div
        className="absolute top-24 left-6 md:left-14 z-10 text-white/70"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.18em', textTransform: 'uppercase' }}
      >
        <strong className="block text-white font-medium mb-1">
          APEX <span style={{ color: '#c2a574' }}>/</span> WYOMING
        </strong>
        <span>CASPER <span style={{ color: '#c2a574' }}>·</span> LARAMIE <span style={{ color: '#c2a574' }}>·</span> STATEWIDE</span>
      </div>

      {/* Top-right GPS + production HUD — transitions with chapter */}
      <div
        className="absolute top-24 right-6 md:right-14 z-10 text-right hidden md:block text-white/60"
        style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.14em', textTransform: 'uppercase' }}
      >
        {CHAPTERS.map((ch, i) => (
          <div
            key={i}
            style={{
              position: i === 0 ? 'relative' : 'absolute',
              top: i === 0 ? undefined : 0,
              right: i === 0 ? undefined : 0,
              opacity: currentChapter === i ? 1 : 0,
              transition: 'opacity 0.6s cubic-bezier(.4,0,.2,1)',
              pointerEvents: 'none',
            }}
          >
            <div className="text-white/80 mb-1">{ch.gps} <span style={{ color: '#c2a574' }}>·</span> {ch.location}</div>
            <div>{ch.alt} <span style={{ color: '#c2a574' }}>·</span> {ch.code}</div>
          </div>
        ))}
      </div>

      {/* Right-edge chapter index */}
      <ChapterIndex currentChapter={currentChapter} />

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
              <div
                className="flex items-center gap-3.5 text-white/60"
                style={{
                  marginBottom: '1.5rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                }}
              >
                <span className="inline-block h-[1px] bg-white/50" style={{ width: '54px' }} />
                <span>Wyoming Drone Cinematography · Est. 2014</span>
              </div>
              <h1
                className="serif m-0 max-w-[14ch]"
                style={{ fontSize: 'clamp(48px, 7.5vw, 128px)', lineHeight: 0.94, letterSpacing: '-0.025em' }}
              >
                {ch.headline}
              </h1>
              {ch.body && (
                <p
                  className="font-body text-white/70 leading-relaxed m-0"
                  style={{ marginTop: '1.5rem', fontSize: 'var(--text-sm)', maxWidth: '42ch' }}
                >
                  {ch.body}
                </p>
              )}
            </div>
          ))}
        </div>

        <div
          className="flex justify-between items-center pt-5 border-t border-white/18"
          style={{ marginTop: '2rem' }}
        >
          <span
            className="text-white/55 hidden md:block"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.14em', textTransform: 'uppercase' }}
          >
            FAA Part 107 Certified · Fully Insured
          </span>
          <span
            className="text-white/40 hidden md:block"
            style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', letterSpacing: '0.14em', textTransform: 'uppercase' }}
          >
            8K · 24FPS · PRORES RAW
          </span>
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
