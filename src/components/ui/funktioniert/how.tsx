'use client'
import React, { useState, useRef, useEffect, useLayoutEffect, Fragment } from 'react';
import '@/app/main.css';
import './how.css';

const TOTAL = 4;

type Particle = {
  id: number;
  size: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
};

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
    imageUrl: '/berlinmap.png',
  },
  {
    num: '02',
    title: 'Cannabis-Blüten auswählen.',
    desc: 'Entdecke unser vielfältiges Sortiment an ausgewählten medizinischen Cannabis Blüten - geprüfte Qualität ab 4,99 €',
    imageUrl: '/berlinmap.png',
  },
  {
    num: '03',
    title: 'Cannabis-Rezept online erhalten.',
    desc: 'Ein approbierter Arzt oder Ärztin prüft digital deine Angaben und stellt dir bei Eignung ein Cannabis Rezept aus.',
    imageUrl: '/berlinmap.png',
  },
  {
    num: '04',
    title: 'Deine Lieferung ist unterwegs.',
    desc: 'Dein medizinisches Cannabis wird aus einer Apotheke zu dir geliefert - per Cannabis Express Lieferung in 60 Minuten, per Cannabis Sofort Lieferung in 1-3 Tagen oder hole es einfach in der nächstgelegenen Apotheke ab.',
    imageUrl: '/berlinmap.png',
  },
];

const PROG_LABELS: string[] = ['Fragebogen', 'Sortiment', 'Rezept', 'Lieferung'];

interface HowProps {
  landingTheme: 'dark' | 'light';
}

export default function How({ landingTheme }: HowProps): React.JSX.Element {
  const [current, setCurrent] = useState<number>(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  /** One rAF-throttled scroll model: avoids multiple IntersectionObservers fighting over `current`. */
  useLayoutEffect(() => {
    let scheduled = false;

    const computeActive = (): void => {
      const cards = cardRefs.current;
      const vh = window.innerHeight;
      const focusY = vh * 0.32;
      let bestIdx = 0;
      let bestScore = -Infinity;

      for (let i = 0; i < cards.length; i++) {
        const el = cards[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const visibleTop = Math.max(0, rect.top);
        const visibleBottom = Math.min(vh, rect.bottom);
        const visible = Math.max(0, visibleBottom - visibleTop);
        const ratio = visible / Math.max(rect.height, 1);
        const center = (rect.top + rect.bottom) / 2;
        const dist = Math.abs(center - focusY);
        const score = ratio * 2 - (dist / vh) * 0.85;
        if (score > bestScore) {
          bestScore = score;
          bestIdx = i;
        }
      }

      setCurrent((c) => (c === bestIdx ? c : bestIdx));
    };

    const schedule = (): void => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        computeActive();
      });
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  const scrollToCard = (idx: number): void => {
    cardRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setCurrent(idx);
  };

  return (
    <section
      id="ablauf"
      className={`how-funktioniert section-container how-column ${landingTheme === 'light' ? 'theme-light' : 'theme-dark'}`}
      aria-label="So funktioniert der Ablauf"
    >
      <div className="how-funktioniert__bg" aria-hidden>
        <div className="how-funktioniert__bg-base" />
        <div className="how-funktioniert__glow-line" />
        <div className="how-funktioniert__glow-radial" />
        <div className="how-funktioniert__grid" />
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="how-funktioniert__particle"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animation: `floatParticle ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="section how-funktioniert__shell">
        <div className="how-layout">

          {/* ── Left: title + nav pills + CTA — sticky in section (desktop), below site header ── */}
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
                <a href="#" className="btn-cta">Jetzt Rezept beantragen →</a>
                <div className="trust">
                  <div className="trust-item"><span className="trust-dot" />Lizenzierte Ärzte</div>
                  <div className="trust-item"><span className="trust-dot" />DSGVO-konform</div>
                  <div className="trust-item"><span className="trust-dot" />Diskrete Verpackung</div>
                  <div className="trust-item"><span className="trust-dot" />CanG 2024</div>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Right: scrollable step cards ── */}
          <div className="how-right">
            {STEPS.map((step, i) => (
              <div
                key={`card-${i}`}
                ref={el => { cardRefs.current[i] = el; }}
                className={`how-col-card ${i === current ? 'active' : ''}`}
              >
                <img
                  src={step.imageUrl}
                  alt={step.title}
                  className="how-col-image"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = '/map/map-1.png'
                  }}
                />
                <span className="how-col-ghost-num" aria-hidden>{step.num}</span>
                <div className="how-col-body">
                  <span className="how-col-num">Schritt {step.num}</span>
                  <h3 className="how-col-title">{step.title}</h3>
                  <p className="how-col-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
