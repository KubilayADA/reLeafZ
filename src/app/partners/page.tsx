'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

/* ------------------------------------------------------------------ */
/*  Intersection-Observer fade-in hook                                 */
/* ------------------------------------------------------------------ */
function useFadeIn<T extends HTMLElement>(): React.RefObject<T | null> {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('partners-visible')
          io.unobserve(el)
        }
      },
      { threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return ref
}

function FadeIn({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: React.ElementType
}) {
  const ref = useFadeIn<HTMLDivElement>()
  return (
    <Tag
      ref={ref}
      className={`partners-fade ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function PartnersPage() {
  const [scrolled, setScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState<'pharmacy' | 'doctor'>('pharmacy')
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({
    fullName: '',
    organization: '',
    role: '',
    email: '',
    phone: '',
    message: '',
  })

  useEffect(() => {
    const html = document.documentElement
    const body = document.body
    const prevH = html.style.background
    const prevB = body.style.background
    html.style.background = '#080b0f'
    body.style.background = '#080b0f'
    return () => {
      html.style.background = prevH
      body.style.background = prevB
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const set = useCallback(
    (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value })),
    [],
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('submitting')
    setFormError('')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/partners/inquiry`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        },
      )
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error || 'Something went wrong. Please try again.')
      }
      setFormState('success')
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong.')
      setFormState('error')
    }
  }

  /* ---- shared style tokens ---- */
  const syne = '"Syne", sans-serif'
  const dm = '"DM Sans", sans-serif'
  const bg = '#080b0f'
  const cyan = '#22d3ee'
  const green = '#10b981'

  const inputCls =
    'w-full px-4 py-3 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-1 transition-all text-sm'
  const inputStyle: React.CSSProperties = {
    fontFamily: dm,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
  }
  const inputFocusBorder = { '--tw-ring-color': cyan } as React.CSSProperties

  return (
    <div
      className="partners-page min-h-screen relative"
      style={{ background: bg, fontFamily: dm, color: '#fff' }}
    >
      {/* ============================================================ */}
      {/*  NOISE TEXTURE OVERLAY                                       */}
      {/* ============================================================ */}
      <div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* ============================================================ */}
      {/*  1. NAVBAR                                                   */}
      {/* ============================================================ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(8,11,15,0.8)' : 'transparent',
          backdropFilter: scrolled ? 'blur(16px) saturate(1.4)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px) saturate(1.4)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/partners">
            <img src="/logo1.png" alt="releafZ" className="h-8 w-auto" style={{ filter: 'brightness(1.1)' }} />
          </Link>

          <div className="flex items-center gap-6 text-sm" style={{ fontFamily: dm }}>
            <a href="#how-it-works" className="hidden sm:block text-white/60 hover:text-white transition-colors">
              How it works
            </a>
            <a href="#benefits" className="hidden sm:block text-white/60 hover:text-white transition-colors">
              Benefits
            </a>
            <a href="#contact" className="hidden sm:block text-white/60 hover:text-white transition-colors">
              Contact
            </a>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors"
            >
              <span>←</span>
              <span>Patient Site</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ============================================================ */}
      {/*  2. HERO                                                     */}
      {/* ============================================================ */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6 overflow-hidden">
        {/* Radial glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-10%',
            right: '-15%',
            width: '70vw',
            height: '70vw',
            maxWidth: '900px',
            maxHeight: '900px',
            background: `radial-gradient(ellipse at center, rgba(34,211,238,0.08) 0%, rgba(16,185,129,0.04) 40%, transparent 70%)`,
          }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <FadeIn>
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide mb-8"
              style={{
                fontFamily: dm,
                background: 'rgba(16,185,129,0.1)',
                border: '1px solid rgba(16,185,129,0.25)',
                color: green,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: green }} />
              PARTNERSHIP PROGRAM — NOW OPEN
            </span>
          </FadeIn>

          <FadeIn delay={80}>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6"
              style={{ fontFamily: syne }}
            >
              Germany&apos;s medical cannabis market is growing fast.{' '}
              <span style={{ color: cyan }}>Don&apos;t get left behind.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={160}>
            <p
              className="text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mb-10"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              releafZ connects pharmacies and licensed doctors to patients via a fully digital prescription
              platform built for Germany&apos;s regulatory framework. Streamline operations, reach
              more patients, and grow your cannabis business&nbsp;— without the overhead.
            </p>
          </FadeIn>

          <FadeIn delay={240}>
            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                className="inline-flex items-center px-7 py-3.5 rounded-lg text-sm font-semibold text-black transition-all hover:brightness-110 hover:shadow-lg"
                style={{
                  fontFamily: dm,
                  background: `linear-gradient(135deg, ${cyan}, ${green})`,
                  boxShadow: `0 0 24px rgba(34,211,238,0.25)`,
                }}
              >
                Request Partnership Access
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center px-7 py-3.5 rounded-lg text-sm font-medium transition-all hover:bg-white/5"
                style={{
                  fontFamily: dm,
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                See how it works ↓
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  3. MARKET STATS BAR                                         */}
      {/* ============================================================ */}
      <section className="relative z-10 px-6 pb-20 md:pb-28">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { value: '900K+', label: 'Patients in Germany', sub: 'up from 250K in 13 months' },
            { value: '€2.1B', label: 'Market size by 2028', sub: 'projected' },
            { value: '3.6×', label: 'YoY patient growth', sub: 'fastest in Europe' },
          ].map((s, i) => (
            <FadeIn key={s.value} delay={i * 100}>
              <div
                className="partners-card rounded-xl p-6"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderTop: `2px solid ${cyan}`,
                }}
              >
                <p className="text-3xl md:text-4xl font-bold mb-1" style={{ fontFamily: syne, color: '#fff' }}>
                  {s.value}
                </p>
                <p className="text-sm font-medium text-white/80">{s.label}</p>
                <p className="text-xs text-white/40 mt-1">{s.sub}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  4. HOW IT WORKS                                             */}
      {/* ============================================================ */}
      <section id="how-it-works" className="relative px-6 py-20 md:py-28 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-14 tracking-tight"
              style={{ fontFamily: syne }}
            >
              From patient to pharmacy&nbsp;—{' '}
              <span style={{ color: cyan }}>fully digital</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 grid-rows-[1fr_1fr]">
            {[
              { n: 1, title: 'Patient submits questionnaire', desc: 'Symptoms, medical history, preferences' },
              { n: 2, title: 'AI matches optimal strains', desc: "From the pharmacy's live inventory on releafZ" },
              { n: 3, title: 'Doctor reviews & approves', desc: 'Digital workflow on releafZ, avg. 10 minutes' },
              { n: 4, title: 'Payment collected', desc: '€14.99 consultation fee + product cost, pre-authorized via releafZ' },
              { n: 5, title: 'Pharmacy receives order', desc: 'releafZ dashboard notification, structured prescription PDF' },
              { n: 6, title: 'Delivery to patient', desc: 'Tracked, compliant, last-mile handled' },
            ].map((step, i) => (
              <FadeIn key={step.n} delay={i * 80} className="h-full">
                <div
                  className="partners-card relative rounded-xl p-6 overflow-hidden group h-full"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {/* Large background step number */}
                  <span
                    className="absolute -top-3 -right-2 text-[5.5rem] font-bold leading-none select-none pointer-events-none"
                    style={{ fontFamily: syne, color: 'rgba(255,255,255,0.03)' }}
                  >
                    {step.n}
                  </span>

                  <span
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold mb-4"
                    style={{ background: `${cyan}20`, color: cyan, fontFamily: dm }}
                  >
                    {step.n}
                  </span>
                  <h3 className="text-base font-semibold mb-2" style={{ fontFamily: syne }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  5. BENEFITS                                                 */}
      {/* ============================================================ */}
      <section id="benefits" className="relative px-6 py-20 md:py-28 scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 tracking-tight"
              style={{ fontFamily: syne }}
            >
              Built for your workflow
            </h2>
          </FadeIn>

          {/* Tab toggle */}
          <FadeIn delay={60}>
            <div
              className="inline-flex rounded-lg p-1 mb-10"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {(['pharmacy', 'doctor'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="px-5 py-2 rounded-md text-sm font-medium transition-all"
                  style={{
                    fontFamily: dm,
                    background: activeTab === tab ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: activeTab === tab ? '#fff' : 'rgba(255,255,255,0.5)',
                  }}
                >
                  {tab === 'pharmacy' ? 'Pharmacies' : 'Doctors'}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* Tab content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {(activeTab === 'pharmacy'
              ? [
                  {
                    
                    title: 'Real-time Inventory Sync',
                    desc: 'Your product catalog on releafZ updates instantly. Patients only see what\u2019s in stock.',
                  },
                  {
                    
                    title: 'Digital Prescription Intake',
                    desc: 'Receive structured, validated prescriptions directly into your releafZ dashboard. No faxes, no paper.',
                  },
                  {
                    
                    title: 'Pre-authorized Payments',
                    desc: 'Payment is collected by releafZ before the order reaches you. Zero payment risk.',
                  },
                  {
                    
                    title: 'Delivery Integration',
                    desc: 'Built-in last-mile coordination through releafZ. You prepare, we handle delivery.',
                  },
                ]
              : [
                  {
                    
                    title: 'AI Pre-screening',
                    desc: 'Patients arrive on releafZ with completed questionnaires and AI-matched strain suggestions. You review, not intake.',
                  },
                  {
                    
                    title: 'One-click Approvals',
                    desc: 'Review symptoms, history, and product selection inside releafZ. Approve with full audit trail.',
                  },
                  {
                    
                    title: 'Auto-generated Prescription PDFs',
                    desc: 'releafZ generates and sends prescriptions automatically upon your approval.',
                  },
                  {
                    
                    title: 'Patient History Dashboard',
                    desc: 'Track treatment outcomes and maintain comprehensive digital records inside releafZ.',
                  },
                ]
            ).map((card, i) => (
              <div
                key={card.title}
                style={{ animation: `partnerCardIn 0.4s ${i * 60}ms both` }}
              >
                <div
                  className="partners-card rounded-xl p-6 h-full"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <h3 className="text-base font-semibold mb-2" style={{ fontFamily: syne }}>{card.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  6. COMPLIANCE STRIP                                         */}
      {/* ============================================================ */}
      <section className="relative px-6 py-14 md:py-16" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <FadeIn className="max-w-xl">
            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: syne }}>Compliance &amp; Security</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              releafZ is built in accordance with German medical cannabis regulations (BtMG, CanG).
              All data stored on EU servers.
            </p>
          </FadeIn>
          <FadeIn delay={120} className="flex flex-wrap gap-x-6 gap-y-3">
            {['GDPR Compliant', 'EU Data Storage', 'BtMG / CanG', 'End-to-end Encrypted'].map((item) => (
              <span key={item} className="flex items-center gap-2 text-sm whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.7)' }}>
                <span style={{ color: green }}>✓</span> {item}
              </span>
            ))}
          </FadeIn>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  7. PARTNERSHIP INQUIRY FORM                                 */}
      {/* ============================================================ */}
      <section id="contact" className="relative px-6 py-20 md:py-28 scroll-mt-20">
        {/* Glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60vw',
            height: '40vw',
            maxWidth: '800px',
            maxHeight: '500px',
            background: `radial-gradient(ellipse at center, rgba(34,211,238,0.06) 0%, transparent 70%)`,
          }}
        />

        <div className="max-w-2xl mx-auto relative z-10">
          <FadeIn>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 tracking-tight"
              style={{ fontFamily: syne }}
            >
              Become a releafZ Partner
            </h2>
          </FadeIn>
          <FadeIn delay={60}>
            <p className="text-sm md:text-base mb-10" style={{ color: 'rgba(255,255,255,0.55)' }}>
              We&apos;re selectively onboarding pharmacies and doctors for the releafZ launch
              cohort. We&apos;ll be in touch within 48&nbsp;hours.
            </p>
          </FadeIn>

          {formState === 'success' ? (
            <FadeIn>
              <div
                className="rounded-xl p-10 text-center"
                style={{
                  background: 'rgba(16,185,129,0.06)',
                  border: '1px solid rgba(16,185,129,0.2)',
                }}
              >
                <img src="/logo1.png" alt="releafZ" className="h-10 mx-auto mb-4" style={{ filter: 'drop-shadow(0 0 14px rgba(34,211,238,0.3))' }} />
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: syne }}>Request received!</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  The releafZ team will reach out within 48&nbsp;hours.
                </p>
              </div>
            </FadeIn>
          ) : (
            <FadeIn delay={120}>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={form.fullName}
                    onChange={set('fullName')}
                    className={inputCls}
                    style={{ ...inputStyle, ...inputFocusBorder }}
                  />
                  <input
                    type="text"
                    required
                    placeholder="Organization"
                    value={form.organization}
                    onChange={set('organization')}
                    className={inputCls}
                    style={{ ...inputStyle, ...inputFocusBorder }}
                  />
                </div>

                {/* Role */}
                <select
                  required
                  value={form.role}
                  onChange={set('role')}
                  className={`${inputCls} appearance-none cursor-pointer`}
                  style={{
                    ...inputStyle,
                    ...inputFocusBorder,
                    color: form.role ? '#fff' : 'rgba(255,255,255,0.4)',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='rgba(255,255,255,0.4)' viewBox='0 0 16 16'%3E%3Cpath d='M4.646 5.646a.5.5 0 0 1 .708 0L8 8.293l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    paddingRight: '2.5rem',
                  }}
                >
                  <option value="" disabled>Select your role</option>
                  <option value="pharmacy">Pharmacy owner / manager</option>
                  <option value="physician">Licensed physician (Arzt)</option>
                  <option value="group">Both / Healthcare group</option>
                </select>

                {/* Row 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    value={form.email}
                    onChange={set('email')}
                    className={inputCls}
                    style={{ ...inputStyle, ...inputFocusBorder }}
                  />
                  <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={form.phone}
                    onChange={set('phone')}
                    className={inputCls}
                    style={{ ...inputStyle, ...inputFocusBorder }}
                  />
                </div>

                {/* Message */}
                <textarea
                  rows={4}
                  placeholder="Tell us about your practice, patient volume, or any questions about releafZ"
                  value={form.message}
                  onChange={set('message')}
                  className={`${inputCls} resize-none`}
                  style={{ ...inputStyle, ...inputFocusBorder }}
                />

                {formState === 'error' && formError && (
                  <p className="text-sm text-red-400">{formError}</p>
                )}

                <button
                  type="submit"
                  disabled={formState === 'submitting'}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-lg text-sm font-semibold text-black transition-all hover:brightness-110 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: dm,
                    background: `linear-gradient(135deg, ${cyan}, ${green})`,
                    boxShadow: `0 0 24px rgba(34,211,238,0.2)`,
                  }}
                >
                  {formState === 'submitting' ? 'Submitting…' : 'Submit Partnership Request →'}
                </button>
              </form>
            </FadeIn>
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  8. FOOTER                                                   */}
      {/* ============================================================ */}
      <footer
        className="relative px-6 py-10"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          <img src="/logo1.png" alt="releafZ" className="h-6 w-auto opacity-30" />
          <span>© 2025 releafZ. All rights reserved. Berlin, Germany.</span>
          <Link href="/" className="hover:text-white/60 transition-colors">
            ← Back to patient site
          </Link>
        </div>
      </footer>

      {/* ============================================================ */}
      {/*  INLINE STYLES                                               */}
      {/* ============================================================ */}
      <style jsx global>{`
        .partners-fade {
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .partners-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .partners-card {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.3s ease,
                      background 0.3s ease;
        }
        .partners-card:hover {
          transform: translateY(-3px);
          background: rgba(255,255,255,0.045) !important;
          border-color: rgba(34, 211, 238, 0.2) !important;
          box-shadow: 0 8px 30px rgba(34, 211, 238, 0.06), 0 0 1px rgba(34, 211, 238, 0.3);
        }

        @keyframes partnerCardIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .partners-page select option {
          background: #141820;
          color: #fff;
        }
      `}</style>
    </div>
  )
}
