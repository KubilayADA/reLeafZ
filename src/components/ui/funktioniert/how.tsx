'use client'
import React, { useState, useEffect, Fragment } from 'react';
import '@/app/main.css';
import './how.css';
import SectionParticlesBackground from '@/components/ui/SectionParticlesBackground';

const TOTAL = 4;
const STORY_MS = 5000;
const STORY_CARD_BG = '/how/hoT.png';

interface Step {
  num: string;
  title: string;
  desc: string;
}

const STEPS: Step[] = [
  {
    num: '01',
    title: 'Cannabis-Therapie starten.',
    desc: 'Fülle einfach unseren medizinischen Online-Fragebogen in 2 Minuten aus - unkompliziert von zuhause oder unterwegs. DSGVO-konform und geschützt.',
  },
  {
    num: '02',
    title: 'Cannabis-Blüten auswählen.',
    desc: 'Entdecke unser vielfältiges Sortiment an ausgewählten medizinischen Cannabis Blüten - geprüfte Qualität ab 4,99 €',
  },
  {
    num: '03',
    title: 'Cannabis-Rezept online erhalten.',
    desc: 'Ein approbierter Arzt oder Ärztin prüft digital deine Angaben und stellt dir bei Eignung ein Cannabis Rezept aus.',
  },
  {
    num: '04',
    title: 'Deine Lieferung ist unterwegs.',
    desc: 'Dein medizinisches Cannabis wird aus einer Apotheke zu dir geliefert - per Cannabis Express Lieferung in 60 Minuten, per Cannabis Sofort Lieferung in 1-3 Tagen oder hole es einfach in der nächstgelegenen Apotheke ab.',
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

interface HowStoriesPanelProps {
  current: number;
  slideDir: SlideDir;
  slideTick: number;
  reducedMotion: boolean;
  storyPaused: boolean;
  activeStep: Step;
  onGoTo: (idx: number) => void;
  onGoNext: () => void;
  onGoPrev: () => void;
  onTogglePause: () => void;
}

function HowStoriesPanel({
  current,
  slideDir,
  slideTick,
  reducedMotion,
  storyPaused,
  activeStep,
  onGoTo,
  onGoNext,
  onGoPrev,
  onTogglePause,
}: HowStoriesPanelProps): React.JSX.Element {
  return (
    <div
      className={`how-stories${storyPaused ? ' how-stories--paused' : ''}`}
      role="region"
      aria-roledescription="Karussell"
      aria-label={`Schritt ${current + 1} von ${TOTAL}`}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          onGoNext();
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          onGoPrev();
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
                onClick={() => onGoTo(i)}
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
        onClick={onGoPrev}
      />
      <button
        type="button"
        className="how-stories-hit how-stories-hit--pause"
        aria-label={storyPaused ? 'Automatischen Wechsel fortsetzen' : 'Automatischen Wechsel anhalten'}
        aria-pressed={storyPaused}
        onClick={onTogglePause}
      />
      <button
        type="button"
        className="how-stories-hit how-stories-hit--next"
        aria-label="Nächster Schritt"
        onClick={onGoNext}
      />
    </div>
  );
}

export default function How({ landingTheme, setDialogOpen }: HowProps): React.JSX.Element {
  const [current, setCurrent] = useState<number>(0);
  const [slideDir, setSlideDir] = useState<SlideDir>(1);
  const [slideTick, setSlideTick] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [storyPaused, setStoryPaused] = useState(false);

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
    const motionMql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = (): void => setReducedMotion(motionMql.matches);
    syncMotion();
    motionMql.addEventListener('change', syncMotion);
    return () => motionMql.removeEventListener('change', syncMotion);
  }, []);

  /** Auto-advance stories (respects reduced motion and center hold). */
  useEffect(() => {
    if (reducedMotion || storyPaused) return;
    const id = window.setTimeout(goNext, STORY_MS);
    return () => clearTimeout(id);
  }, [reducedMotion, storyPaused, current]);

  useEffect(() => {
    const img = new Image();
    img.src = STORY_CARD_BG;
  }, []);

  const activeStep = STEPS[current];

  return (
    <section
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
                      onClick={() => goTo(i)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e: React.KeyboardEvent) => (e.key === 'Enter' || e.key === ' ') && goTo(i)}
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

          <div className="how-right how-right--stories">
            <HowStoriesPanel
              current={current}
              slideDir={slideDir}
              slideTick={slideTick}
              reducedMotion={reducedMotion}
              storyPaused={storyPaused}
              activeStep={activeStep}
              onGoTo={goTo}
              onGoNext={goNext}
              onGoPrev={goPrev}
              onTogglePause={() => setStoryPaused((paused) => !paused)}
            />

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
