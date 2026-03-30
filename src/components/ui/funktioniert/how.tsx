'use client'
import React, { useState, useRef, useEffect, Fragment } from 'react';
import '@/app/main.css';
import './how.css';
import './how-mobile.css';

const TOTAL = 4;

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
    imageUrl: '/how/step-1.png',
  },
  {
    num: '02',
    title: 'Cannabis-Blüten auswählen.',
    desc: 'Entdecke unser vielfältiges Sortiment an ausgewählten medizinischen Cannabis Blüten - geprüfte Qualität ab 4,99 €',
    imageUrl: '/how/step-2.png',
  },
  {
    num: '03',
    title: 'Cannabis-Rezept online erhalten.',
    desc: 'Ein approbierter Arzt oder Ärztin prüft digital deine Angaben und stellt dir bei Eignung ein Cannabis Rezept aus.',
    imageUrl: '/how/step-1.png',
  },
  {
    num: '04',
    title: 'Deine Lieferung ist unterwegs.',
    desc: 'Dein medizinisches Cannabis wird aus einer Apotheke zu dir geliefert - per Cannabis Express Lieferung in 60 Minuten, per Cannabis Sofort Lieferung in 1-3 Tagen oder hole es einfach in der nächstgelegenen Apotheke ab.',
    imageUrl: '/how/step-4.png',
  },
];

const PROG_LABELS: string[] = ['Fragebogen', 'Sortiment', 'Rezept', 'Lieferung'];


export default function How(): React.JSX.Element {
  const [current, setCurrent] = useState<number>(0);
  const [dotTops, setDotTops] = useState<number[]>([]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Measure each card's offsetTop within the wrap so dots align with card tops
  useEffect(() => {
    const measureDots = () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const tops = cardRefs.current.map(card => card ? card.offsetTop : 0);
      setDotTops(tops);
    };
    measureDots();
    window.addEventListener('resize', measureDots);
    return () => window.removeEventListener('resize', measureDots);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / total));
      section.style.setProperty('--progress', String(progress));
      setCurrent(Math.min(TOTAL - 1, Math.floor(progress * TOTAL)));
      for (let i = 0; i < TOTAL - 1; i++) {
        const p = Math.min(1, Math.max(0, (progress - i / TOTAL) * TOTAL));
        section.style.setProperty(`--conn-${i}`, String(p));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCard = (idx: number): void => {
    cardRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setCurrent(idx);
  };

  return (
    <section
      ref={sectionRef}
      id="ablauf"
      className="how-funktioniert section-container section how-column"
      aria-label="So funktioniert der Ablauf"
    >
      <div className="how-layout">

        {/* ── Left: sticky progress panel ── */}
        <div className="how-left">
          <div className="how-header">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold title-gradient mb-4">Wie es funktioniert</div>
            <h2 className="title">
              In <span className="title-num">4</span> Schritten fertig
            </h2>
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
                  <div
                    className="prog-connector"
                    style={{ '--conn-fill': `var(--conn-${i}, 0)` } as React.CSSProperties}
                  />
                )}
              </Fragment>
            ))}
          </div>

          {/* Desktop-only CTA — inside sticky left panel */}
          <div className="cta-block cta-block--desktop">
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

        {/* ── Right: cards with scroll-driven timeline line ── */}
        <div className="how-right">
          <div className="how-cards-wrap" ref={wrapRef}>
            {/* Single continuous timeline line */}
            <div className="timeline-track" aria-hidden>
              <div className="timeline-fill" />
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`timeline-dot${i <= current ? ' lit' : ''}`}
                  style={dotTops[i] !== undefined ? { top: `${dotTops[i]}px` } : { display: 'none' }}
                />
              ))}
            </div>

            {STEPS.map((step, i) => (
              <div
                key={`card-${i}`}
                ref={el => { cardRefs.current[i] = el; }}
                className={`how-col-card ${i === current ? 'active' : ''}`}
              >
                <img src={step.imageUrl} alt={step.title} className="how-col-image" />
                <span className="how-col-ghost-num" aria-hidden>{step.num}</span>
                <div className="how-col-body">
                  <span className="how-col-num"></span>
                  <h3 className="how-col-title">{step.title}</h3>
                  <p className="how-col-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Mobile-only CTA — at the very bottom of the section */}
        <div className="cta-block cta-block--mobile">
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
    </section>
  );
}
