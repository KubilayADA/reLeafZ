'use client'
import React, { useState, useRef, useEffect, Fragment } from 'react';
import '@/app/main.css';
import './how.css';

const TOTAL = 4;

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


export default function How(): React.JSX.Element {
  const [current, setCurrent] = useState<number>(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setCurrent(i);
        },
        { threshold: 0.4, rootMargin: '-10% 0px -40% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  const scrollToCard = (idx: number): void => {
    cardRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setCurrent(idx);
  };

  return (
    <section
      id="ablauf"
      className="how-funktioniert section-container section how-column"
      aria-label="So funktioniert der Ablauf"
    >
      <div className="how-layout">

        {/* ── Left: sticky progress panel ── */}
        <div className="how-left">
          <div className="header">
            <div className="eyebrow">So funktioniert&apos;s</div>
            <h2 className="title">Dein Rezept in 4 Schritten</h2>
            <p className="subtitle">Online. Sicher. Bis zur Apotheke.</p>
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

        </div>

        {/* ── Right: static column of photo cards ── */}
        <div className="how-right">
          {STEPS.map((step, i) => (
            <div
              key={`card-${i}`}
              ref={el => { cardRefs.current[i] = el; }}
              className={`how-col-card ${i === current ? 'active' : ''}`}
            >
              <span className="how-col-ghost-num" aria-hidden>{step.num}</span>
              <div className="how-col-body">
                <span className="how-col-num">{step.num}</span>
                <h3 className="how-col-title">{step.title}</h3>
                <p className="how-col-desc">{step.desc}</p>
              </div>
            </div>
          ))}

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

      </div>
    </section>
  );
}
