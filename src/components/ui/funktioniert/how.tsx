import React, { useState, useRef, Fragment, useEffect } from 'react';
import type { ComponentType } from 'react';
import {
  ClipboardList,
  FlaskConical,
  CreditCard,
  FileCheck,
  Link,
  Store,
  Check,
  Lock,
  ShieldCheck,
  FileText,
  Banknote,
  Mail,
  Truck,
  Building2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import '@/app/main.css';
import './how.css';

const TOTAL = 6;

type IconComponent = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;

interface StepDetail {
  Icon: IconComponent;
  label: string;
}

interface Step {
  Icon: IconComponent;
  num: string;
  timeBadge: string;
  title: string;
  desc: string;
  details: StepDetail[];
  status: string;
  miniFlow: string[];
  activeIdx: number;
}

const STEPS: Step[] = [
  {
    Icon: ClipboardList,
    num: '01',
    timeBadge: '~5 min',
    title: 'Fragebogen ausfüllen',
    desc: 'Kurzes Formular online — vertraulich.',
    details: [
      { Icon: FileText, label: 'Symptome & Ziele' },
      { Icon: Lock, label: 'Verschlüsselt' },
    ],
    status: 'Sicher',
    miniFlow: ['Formular', 'Produkt', 'Zahlung', '…'],
    activeIdx: 0,
  },
  {
    Icon: FlaskConical,
    num: '02',
    timeBadge: 'Deine Wahl',
    title: 'Produkt wählen',
    desc: 'Sortiment durchstöbern — Blüten, Öle, Extrakte.',
    details: [
      { Icon: FlaskConical, label: 'Filterbar' },
      { Icon: ShieldCheck, label: 'Lizenziert' },
    ],
    status: 'Apothekenpflichtig',
    miniFlow: ['Formular', 'Produkt', 'Zahlung', '…'],
    activeIdx: 1,
  },
  {
    Icon: CreditCard,
    num: '03',
    timeBadge: 'Einmalig',
    title: 'Rezeptgebühr zahlen',
    desc: "Eine Gebühr — dann geht's zum Arzt.",
    details: [
      { Icon: Banknote, label: 'Karte, PayPal' },
      { Icon: ShieldCheck, label: 'PCI-DSS' },
    ],
    status: 'Sicher',
    miniFlow: ['Formular', 'Produkt', 'Zahlung', 'Arzt'],
    activeIdx: 2,
  },
  {
    Icon: FileCheck,
    num: '04',
    timeBadge: '24–48 h',
    title: 'Arzt prüft',
    desc: 'Lizenzierter Arzt — Rezept per E-Mail.',
    details: [
      { Icon: FileCheck, label: 'CanG 2024' },
      { Icon: Building2, label: 'Digital' },
    ],
    status: 'Facharzt',
    miniFlow: ['Zahlung', 'Arzt', 'Link', '…'],
    activeIdx: 1,
  },
  {
    Icon: Link,
    num: '05',
    timeBadge: 'E-Mail',
    title: 'Zahlungslink',
    desc: 'Link zum Bezahlen — Apotheke startet danach.',
    details: [
      { Icon: Mail, label: 'Link per E-Mail' },
      { Icon: Link, label: '48 h gültig' },
    ],
    status: 'Signiert',
    miniFlow: ['Arzt', 'Link', 'Apotheke', 'Fertig'],
    activeIdx: 1,
  },
  {
    Icon: Store,
    num: '06',
    timeBadge: 'Deine Wahl',
    title: 'Abholen oder liefern',
    desc: 'Apotheke packt — du holst ab oder lässt liefern.',
    details: [
      { Icon: Store, label: 'Abholung' },
      { Icon: Truck, label: 'Versand + Tracking' },
    ],
    status: 'Fertig',
    miniFlow: ['Link', 'Apotheke', 'Übergabe'],
    activeIdx: 2,
  },
];

const PROG_LABELS: string[] = ['Fragebogen', 'Produkt', 'Zahlung', 'Arzt', 'Link', 'Abholung'];

const SUMMARY_TITLES: string[] = [
  'Fragebogen ausfüllen',
  'Produkt auswählen',
  'Rezeptgebühr zahlen',
  'Arzt prüft & genehmigt',
  'Zahlungslink erhalten',
  'Abholen oder liefern lassen',
];

function CheckIcon(): React.JSX.Element {
  return <Check className="check-icon" aria-hidden />;
}

export default function How(): React.JSX.Element {
  const [current, setCurrent] = useState<number>(0);
  const [maxSeen, setMaxSeen] = useState<number>(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isScrollingFromCode = useRef(false);

  const goTo = (idx: number): void => {
    if (idx < 0 || idx >= TOTAL) return;
    if (idx > maxSeen) setMaxSeen(idx);
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
    // On mobile (narrow viewport), scroll the carousel viewport to the slide
    const vp = viewportRef.current;
    if (vp && typeof window !== 'undefined' && window.innerWidth < 1024) {
      isScrollingFromCode.current = true;
      const slideWidth = vp.offsetWidth;
      vp.scrollTo({ left: idx * slideWidth, behavior: 'smooth' });
      setTimeout(() => { isScrollingFromCode.current = false; }, 500);
    }
  };

  const navigate = (dir: number): void => {
    if (current === TOTAL - 1 && dir === 1) {
      ctaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setDirection(dir as 1 | -1);
    goTo(current + dir);
  };

  // Sync current index from scroll position (mobile horizontal scroll)
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    let rafId: number | undefined;
    const onScroll = (): void => {
      if (isScrollingFromCode.current) return;
      rafId = requestAnimationFrame(() => {
        const width = vp.offsetWidth;
        if (width <= 0) return;
        const index = Math.round(vp.scrollLeft / width);
        const clamped = Math.max(0, Math.min(TOTAL - 1, index));
        if (clamped !== current) setCurrent(clamped);
      });
    };
    const onScrollEnd = (): void => {
      isScrollingFromCode.current = false;
    };
    vp.addEventListener('scroll', onScroll, { passive: true });
    vp.addEventListener('scrollend', onScrollEnd);
    vp.addEventListener('touchend', onScrollEnd);
    return () => {
      if (rafId != null) cancelAnimationFrame(rafId);
      vp.removeEventListener('scroll', onScroll);
      vp.removeEventListener('scrollend', onScrollEnd);
      vp.removeEventListener('touchend', onScrollEnd);
    };
  }, [current]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent): void => {
      const target = e.target as HTMLElement | null;
      if (target && (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable)) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigate(-1);
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigate(1);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [current]);

  const isLastStep = current === TOTAL - 1;
  const progressPercent = ((current + 1) / TOTAL) * 100;

  return (
    <section id="ablauf" className={`how-funktioniert section-container section carousel ${direction === 1 ? 'carousel-dir-next' : 'carousel-dir-prev'}`} aria-label="So funktioniert der Ablauf">
      <div className="how-layout">
        <div className="how-left">
          <div className="header">
            <div className="eyebrow">So funktioniert&apos;s</div>
            <h2 className="title">Dein Rezept in 6 Schritten</h2>
            <p className="subtitle">
              Online. Sicher. Bis zur Apotheke.
            </p>
          </div>
          <p className="carousel-hint carousel-hint-desktop">Pfeiltasten ← → zum Wechseln</p>
          <p className="carousel-hint carousel-hint-mobile" aria-hidden="true">Wischen oder Pfeile nutzen</p>

          <div className="progress-wrap">
            {STEPS.map((_, i) => (
              <Fragment key={i}>
                <div
                  className={`prog-step ${i === current ? 'active' : ''} ${i < current ? 'done' : ''}`}
                  onClick={() => goTo(i)}
                  role="tab"
                  id={`step-tab-${i}`}
                  aria-selected={i === current}
                  aria-controls={`step-panel-${i}`}
                  tabIndex={i === current ? 0 : -1}
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

          <div className="summary-grid">
            {STEPS.map((step, i) => {
              const StepIcon = step.Icon;
              return (
                <div
                  key={`summary-${i}`}
                  className={`summary-item ${i === current ? 'current' : ''} ${i < current ? 'done-item' : ''}`}
                  data-num={step.num}
                  data-idx={i}
                  onClick={() => goTo(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e: React.KeyboardEvent) => (e.key === 'Enter' || e.key === ' ') && goTo(i)}
                >
                  <span className="si-icon">
                    <StepIcon className="summary-step-icon" aria-hidden />
                  </span>
                  <div className="si-title">{SUMMARY_TITLES[i]}</div>
                  <div className="si-done">
                    <CheckIcon />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="how-right">
          <div className="carousel-viewport" ref={viewportRef} aria-live="polite" aria-atomic="true">
            <div className="carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
          {STEPS.map((step, i) => {
            const StepIcon = step.Icon;
            return (
              <div
                key={`card-${i}`}
                className={`step-card carousel-slide ${i === current ? 'active' : ''}`}
                role="tabpanel"
                id={`step-panel-${i}`}
                aria-labelledby={`step-tab-${i}`}
                aria-hidden={i !== current}
              >
                <div className="card-inner">
                  <div className="card-hero">
                    <div className="card-icon-wrap">
                      <StepIcon className="step-icon" aria-hidden />
                    </div>
                    <div className="card-num">
                      Schritt {step.num} <span className="time-badge">{step.timeBadge}</span>
                    </div>
                    <h3 className="card-title">{step.title}</h3>
                    <p className="card-desc">{step.desc}</p>
                  </div>
                  <div className="card-visual">
                    <div className="detail-icons">
                      {step.details.map((item, j) => {
                        const DetailIcon = item.Icon;
                        return (
                          <div key={j} className="detail-icon-item" title={item.label}>
                            <DetailIcon className="detail-icon" aria-hidden />
                            <span className="detail-icon-label">{item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mini-flow" aria-hidden="true">
                      {step.miniFlow.map((node, j) => (
                        <span key={j}>
                          <span className={`mini-node ${j === step.activeIdx ? 'active-node' : ''}`}>
                            {node}
                          </span>
                          {j < step.miniFlow.length - 1 && (
                            <ArrowRight className="mini-arrow-icon" aria-hidden />
                          )}
                        </span>
                      ))}
                    </div>
                    <span className="status-pill">{step.status}</span>
                  </div>
                </div>
              </div>
            );
          })}
            </div>
          </div>

          {/* Slide controls directly under carousel — little gap, green accent */}
          <div className="nav-row nav-row-under-slides">
            <button
              type="button"
              className="btn-nav btn-nav-prev"
              onClick={() => navigate(-1)}
              disabled={current === 0}
              aria-label="Vorheriger Schritt (wischen nach links)"
            >
              <ChevronLeft className="btn-nav-icon" aria-hidden />
            </button>
            <span className="step-counter" aria-hidden="true">
              <span className="step-current">{current + 1}</span>
              <span className="step-sep">/</span>
              <span className="step-total">6</span>
            </span>
            <button
              type="button"
              className={`btn-nav btn-nav-next ${isLastStep ? 'primary' : ''}`}
              onClick={() => navigate(1)}
              aria-label={isLastStep ? 'Zum Abschluss' : 'Nächster Schritt (wischen nach rechts)'}
            >
              <ChevronRight className="btn-nav-icon" aria-hidden />
            </button>
          </div>

          <div className="carousel-progress" role="progressbar" aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={TOTAL} aria-label="Schritt im Ablauf">
            <div className="carousel-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="carousel-step-label">
            Schritt <strong>{current + 1}</strong> von {TOTAL}: {STEPS[current].title}
          </p>

          <div className="cta-block" ref={ctaRef}>
        <p className="cta-note">Kostenlos starten.</p>
        <a href="#" className="btn-cta">
          Jetzt Rezept beantragen →
        </a>
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
