'use client'
import React, { useState, useRef, useLayoutEffect, useEffect, Fragment } from 'react';
import '@/app/main.css';
import './how.css';
import SectionParticlesBackground from '@/components/ui/SectionParticlesBackground';

const TOTAL = 4;
const STORY_MS = 5000;
const MOBILE_MQ = '(max-width: 767px)';
const STORY_CARD_BG = '/how/hoT.png';

interface Step {
  num: string;
  title: string;
  desc: string;
  imageUrl: string;
}

const STEPS: Step[] = [
  {
    num: '01',
    title: 'Cannabis-Therapie starten.',
    desc: 'Fülle einfach unseren medizinischen Online-Fragebogen in 2 Minuten aus - unkompliziert von zuhause oder unterwegs. DSGVO-konform und geschützt.',
    imageUrl: '/how/how1.png',
  },
  {
    num: '02',
    title: 'Cannabis-Blüten auswählen.',
    desc: 'Entdecke unser vielfältiges Sortiment an ausgewählten medizinischen Cannabis Blüten - geprüfte Qualität ab 4,99 €',
    imageUrl: '/how/how2.png',
  },
  {
    num: '03',
    title: 'Cannabis-Rezept online erhalten.',
    desc: 'Ein approbierter Arzt oder Ärztin prüft digital deine Angaben und stellt dir bei Eignung ein Cannabis Rezept aus.',
    imageUrl: '/how/how3.png',
  },
  {
    num: '04',
    title: 'Deine Lieferung ist unterwegs.',
    desc: 'Dein medizinisches Cannabis wird aus einer Apotheke zu dir geliefert - per Cannabis Express Lieferung in 60 Minuten, per Cannabis Sofort Lieferung in 1-3 Tagen oder hole es einfach in der nächstgelegenen Apotheke ab.',
    imageUrl: '/how/how4.png',
  },
];

const PROG_LABELS: string[] = ['Fragebogen', 'Sortiment', 'Rezept', 'Lieferung'];

type SlideDir = 1 | -1;

function resolveSlideDir(from: number, to: number): SlideDir {
  if (from === to) return 1;
  if (from === TOTAL - 1 && to === 0) return 1;
  if (from === 0 && to === TOTAL - 1) return -1;
  return to > from ? 1 : -1;
}

interface HowProps {
  landingTheme: 'dark' | 'light';
  setDialogOpen: (open: boolean) => void;
}

interface HowStepCardProps {
  step: Step;
  active: boolean;
  cardRef?: (el: HTMLDivElement | null) => void;
}

function HowStepCard({ step, active, cardRef }: HowStepCardProps): React.JSX.Element {
  return (
    <div
      ref={cardRef}
      className={`how-col-card ${active ? 'active' : ''}`}
    >
      <img
        src={step.imageUrl}
        alt={step.title}
        className="how-col-image"
        loading={active ? 'eager' : 'lazy'}
        onError={(e) => {
          e.currentTarget.src = '/map/map-1.png';
        }}
      />
      <span className="how-col-ghost-num" aria-hidden>{step.num}</span>
      <div className="how-col-body">
        <span className="how-col-num">Schritt {step.num}</span>
        <h3 className="how-col-title">{step.title}</h3>
        <p className="how-col-desc">{step.desc}</p>
      </div>
    </div>
  );
}

export default function How({ landingTheme, setDialogOpen }: HowProps): React.JSX.Element {
  const [current, setCurrent] = useState<number>(0);
  const [slideDir, setSlideDir] = useState<SlideDir>(1);
  const [slideTick, setSlideTick] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardsContainerRef = useRef<HTMLDivElement | null>(null);
  const autoScrollRafRef = useRef<number | null>(null);
  const autoScrollTargetIdxRef = useRef<number | null>(null);
  const isAutoScrollingRef = useRef(false);

  const transitionTo = (getNext: (c: number) => number, explicitDir?: SlideDir): void => {
    setCurrent((c) => {
      const next = getNext(c);
      if (next === c) return c;
      const dir = explicitDir ?? resolveSlideDir(c, next);
      setSlideDir(dir);
      setSlideTick((t) => t + 1);
      return next;
    });
  };

  const goTo = (idx: number): void => {
    const clamped = Math.max(0, Math.min(TOTAL - 1, idx));
    transitionTo(() => clamped);
  };

  const goNext = (): void => {
    transitionTo((c) => (c < TOTAL - 1 ? c + 1 : 0), 1);
  };

  const goPrev = (): void => {
    transitionTo((c) => (c > 0 ? c - 1 : TOTAL - 1), -1);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mobileMql = window.matchMedia(MOBILE_MQ);
    const motionMql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMobile = (): void => setIsMobile(mobileMql.matches);
    const syncMotion = (): void => setReducedMotion(motionMql.matches);
    syncMobile();
    syncMotion();
    mobileMql.addEventListener('change', syncMobile);
    motionMql.addEventListener('change', syncMotion);
    return () => {
      mobileMql.removeEventListener('change', syncMobile);
      motionMql.removeEventListener('change', syncMotion);
    };
  }, []);

  /** Auto-advance stories on mobile (respects reduced motion). */
  useEffect(() => {
    if (!isMobile || reducedMotion) return;
    const id = window.setTimeout(goNext, STORY_MS);
    return () => clearTimeout(id);
  }, [isMobile, reducedMotion, current]);

  /** Preload mobile story card background. */
  useEffect(() => {
    if (!isMobile) return;
    const img = new Image();
    img.src = STORY_CARD_BG;
  }, [isMobile]);

  /** Desktop: rAF-throttled scroll model for `current`. */
  useLayoutEffect(() => {
    if (isMobile) return;

    let scheduled = false;
    let rafId: number | null = null;

    const computeActive = (): void => {
      if (isAutoScrollingRef.current) {
        const lockedIdx = autoScrollTargetIdxRef.current;
        if (lockedIdx !== null) {
          setCurrent((c) => (c === lockedIdx ? c : lockedIdx));
        }
        return;
      }

      const cards = cardRefs.current;
      const vh = window.innerHeight;
      const focusY = vh * 0.32;
      let bestIdx = 0;
      let bestDist = Infinity;

      for (let i = 0; i < cards.length; i++) {
        const el = cards[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const center = (rect.top + rect.bottom) / 2;
        const dist = Math.abs(center - focusY);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      }

      setCurrent((c) => (c === bestIdx ? c : bestIdx));
    };

    const schedule = (): void => {
      if (scheduled) return;
      scheduled = true;
      rafId = requestAnimationFrame(() => {
        scheduled = false;
        computeActive();
      });
    };

    schedule();
    const container = cardsContainerRef.current;
    window.addEventListener('scroll', schedule, { passive: true });
    container?.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    return () => {
      window.removeEventListener('scroll', schedule);
      container?.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      if (autoScrollRafRef.current !== null) {
        cancelAnimationFrame(autoScrollRafRef.current);
      }
    };
  }, [isMobile]);

  const scrollToCard = (idx: number): void => {
    if (isMobile) {
      goTo(idx);
      return;
    }

    const target = cardRefs.current[idx];
    if (!target) return;

    const stickyTopRaw = sectionRef.current
      ? getComputedStyle(sectionRef.current).getPropertyValue('--how-sticky-top')
      : '';
    const stickyTop = Number.parseFloat(stickyTopRaw);
    const topOffset = Number.isFinite(stickyTop) ? stickyTop : 120;
    const endY = Math.max(0, window.scrollY + target.getBoundingClientRect().top - topOffset - 12);
    const startY = window.scrollY;
    const distance = endY - startY;

    if (Math.abs(distance) < 1) {
      setCurrent(idx);
      return;
    }

    if (autoScrollRafRef.current !== null) {
      cancelAnimationFrame(autoScrollRafRef.current);
    }

    isAutoScrollingRef.current = true;
    autoScrollTargetIdxRef.current = idx;
    setCurrent(idx);

    const duration = 420;
    const start = performance.now();
    const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

    const tick = (now: number): void => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      window.scrollTo(0, startY + distance * eased);

      if (t < 1) {
        autoScrollRafRef.current = requestAnimationFrame(tick);
        return;
      }

      isAutoScrollingRef.current = false;
      autoScrollTargetIdxRef.current = null;
      autoScrollRafRef.current = null;
    };

    autoScrollRafRef.current = requestAnimationFrame(tick);
  };

  const activeStep = STEPS[current];

  return (
    <section
      ref={sectionRef}
      id="ablauf"
      className={`how-funktioniert section-container how-column ${landingTheme === 'light' ? 'theme-light' : 'theme-dark'}`}
      aria-label="So funktioniert der Ablauf"
    >
      <div className="how-funktioniert__bg" aria-hidden>
        <div className="how-funktioniert__bg-base" />
        <SectionParticlesBackground className="how-funktioniert__particles" />
        <div className="how-funktioniert__glow-radial" />
        <div className="how-funktioniert__grid" />
      </div>

      <div className="section how-funktioniert__shell">
        <div className="how-layout">

          <aside className="how-sidebar" aria-label="Ablauf Navigation">
            <div className="how-sidebar-sticky">
              <div className="how-header">
                <div className="eyebrow">So funktioniert&apos;s</div>
                <h2 className="title">Dein Rezept in 4 Schritten</h2>
              </div>

              <div className="progress-wrap">
                {STEPS.map((_, i) => (
                  <Fragment key={i}>
                    <div
                      className={`prog-step ${i === current ? 'active' : ''} ${i < current ? 'done' : ''}`}
                      onClick={() => scrollToCard(i)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent) => (e.key === 'Enter' || e.key === ' ') && scrollToCard(i)}
                    >
                      <div className="prog-dot">{i + 1}</div>
                      <div className="prog-label">{PROG_LABELS[i]}</div>
                    </div>
                    {i < TOTAL - 1 && (
                      <div className={`prog-connector ${i < current ? 'done' : ''}`} />
                    )}
                  </Fragment>
                ))}
              </div>

              <div className="cta-block">
                <p className="cta-note">Kostenlos starten.</p>
                <button type="button" className="btn-cta" onClick={() => setDialogOpen(true)}>
                  Jetzt Rezept beantragen →
                </button>
                <div className="trust">
                  <div className="trust-item"><span className="trust-dot" />Lizenzierte Ärzte</div>
                  <div className="trust-item"><span className="trust-dot" />DSGVO-konform</div>
                  <div className="trust-item"><span className="trust-dot" />Diskrete Verpackung</div>
                  <div className="trust-item"><span className="trust-dot" />CanG 2024</div>
                </div>
              </div>
            </div>
          </aside>

          <div ref={cardsContainerRef} className={`how-right ${isMobile ? 'how-right--stories' : ''}`}>
            {isMobile ? (
              <div
                className="how-stories"
                role="region"
                aria-roledescription="Karussell"
                aria-label={`Schritt ${current + 1} von ${TOTAL}`}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    goNext();
                  } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    goPrev();
                  }
                }}
                tabIndex={0}
              >
                <div className="how-stories-slide" aria-live="polite">
                  <article className="how-col-card how-col-card--story active">
                    <div className="how-stories-progress how-stories-progress--inset" aria-hidden>
                      {STEPS.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          className="how-stories-seg"
                          onClick={() => goTo(i)}
                          aria-label={`Schritt ${i + 1}: ${PROG_LABELS[i]}`}
                        >
                          <span
                            key={i === current ? `active-${current}` : `seg-${i}`}
                            className={`how-stories-fill${i < current ? ' is-done' : ''}${i === current ? ' is-active' : ''}${reducedMotion && i === current ? ' is-static' : ''}`}
                            style={
                              reducedMotion && i === current
                                ? { width: '100%' }
                                : { animationDuration: `${STORY_MS}ms` }
                            }
                          />
                        </button>
                      ))}
                    </div>

                    <div
                      key={slideTick}
                      className={`how-stories-card-anim how-stories-card-anim--${slideDir > 0 ? 'next' : 'prev'}`}
                    >
                      <div className="how-story-content">
                        <span className="how-story-num" aria-label={`Schritt ${activeStep.num}`}>
                          {activeStep.num}
                        </span>
                        <h3 className="how-story-title">{activeStep.title}</h3>
                        <p className="how-story-desc">{activeStep.desc}</p>
                      </div>
                    </div>
                  </article>
                </div>

                <button
                  type="button"
                  className="how-stories-hit how-stories-hit--prev"
                  aria-label="Vorheriger Schritt"
                  onClick={goPrev}
                />
                <button
                  type="button"
                  className="how-stories-hit how-stories-hit--next"
                  aria-label="Nächster Schritt"
                  onClick={goNext}
                />
              </div>
            ) : (
              STEPS.map((step, i) => (
                <HowStepCard
                  key={`card-${i}`}
                  step={step}
                  active={i === current}
                  cardRef={(el) => { cardRefs.current[i] = el; }}
                />
              ))
            )}

            <div className="cta-block cta-block-mobile">
              <p className="cta-note">Kostenlos starten.</p>
              <button type="button" className="btn-cta" onClick={() => setDialogOpen(true)}>
                Jetzt Rezept beantragen
              </button>
              <div className="trust">
                <div className="trust-item"><span className="trust-dot" />Lizenzierte Ärzte</div>
                <div className="trust-item"><span className="trust-dot" />DSGVO-konform</div>
                <div className="trust-item"><span className="trust-dot" />Diskrete Verpackung</div>
                <div className="trust-item"><span className="trust-dot" />CanG 2024</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
