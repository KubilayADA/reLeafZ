'use client'

import React, { useEffect, useState } from 'react'

const TOTAL = 4
const STORY_MS = 5000

interface Step {
  num: string
  title: string
  desc: string
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
]

const PROG_LABELS: string[] = ['Fragebogen', 'Sortiment', 'Rezept', 'Lieferung']

type SlideDir = 1 | -1

function resolveSlideDir(from: number, to: number): SlideDir {
  if (from === to) return 1
  if (from === TOTAL - 1 && to === 0) return 1
  if (from === 0 && to === TOTAL - 1) return -1
  return to > from ? 1 : -1
}

type HowStoriesSliderProps = {
  /** Tap card to go next (left edge = previous). Used on mobile funktioniert section. */
  tapToAdvance?: boolean
}

export default function HowStoriesSlider({
  tapToAdvance = false,
}: HowStoriesSliderProps = {}): React.JSX.Element {
  const [current, setCurrent] = useState<number>(0)
  const [slideDir, setSlideDir] = useState<SlideDir>(1)
  const [slideTick, setSlideTick] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [storyPaused, setStoryPaused] = useState(false)

  const transitionTo = (getNext: (c: number) => number, explicitDir?: SlideDir): void => {
    setCurrent((c) => {
      const next = getNext(c)
      if (next === c) return c
      const dir = explicitDir ?? resolveSlideDir(c, next)
      setSlideDir(dir)
      setSlideTick((t) => t + 1)
      return next
    })
  }

  const goTo = (idx: number): void => {
    const clamped = Math.max(0, Math.min(TOTAL - 1, idx))
    transitionTo(() => clamped)
  }

  const goNext = (): void => {
    transitionTo((c) => (c < TOTAL - 1 ? c + 1 : 0), 1)
  }

  const goPrev = (): void => {
    transitionTo((c) => (c > 0 ? c - 1 : TOTAL - 1), -1)
  }

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const motionMql = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = (): void => setReducedMotion(motionMql.matches)
    syncMotion()
    motionMql.addEventListener('change', syncMotion)
    return () => motionMql.removeEventListener('change', syncMotion)
  }, [])

  useEffect(() => {
    if (reducedMotion || storyPaused) return
    const id = window.setTimeout(goNext, STORY_MS)
    return () => clearTimeout(id)
  }, [reducedMotion, storyPaused, current])

  useEffect(() => {
    const img = new Image()
    img.src = '/how/hoT.png'
  }, [])

  const activeStep = STEPS[current]

  const handleStoryTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tapToAdvance) return
    if ((e.target as HTMLElement).closest('.how-stories-seg')) return

    const rect = e.currentTarget.getBoundingClientRect()
    const xRatio = (e.clientX - rect.left) / rect.width
    if (xRatio < 0.28) goPrev()
    else goNext()
  }

  return (
    <div className="how-stories-stack">
      <div
        className={`how-stories how-stories--fill${storyPaused ? ' how-stories--paused' : ''}${tapToAdvance ? ' how-stories--tap-advance' : ''}`}
        role="region"
        aria-roledescription="Karussell"
        aria-label={`Schritt ${current + 1} von ${TOTAL}`}
        onClick={tapToAdvance ? handleStoryTap : undefined}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            goNext()
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault()
            goPrev()
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
                <div className="how-story-copy">
                  <h3 className="how-story-title">{activeStep.title}</h3>
                  <p className="how-story-desc">{activeStep.desc}</p>
                </div>
              </div>
            </div>
          </article>
        </div>

        {!tapToAdvance && (
          <>
            <button
              type="button"
              className="how-stories-hit how-stories-hit--prev"
              aria-label="Vorheriger Schritt"
              onClick={goPrev}
            />
            <button
              type="button"
              className="how-stories-hit how-stories-hit--pause"
              aria-label={storyPaused ? 'Automatischen Wechsel fortsetzen' : 'Automatischen Wechsel anhalten'}
              aria-pressed={storyPaused}
              onClick={() => setStoryPaused((paused) => !paused)}
            />
            <button
              type="button"
              className="how-stories-hit how-stories-hit--next"
              aria-label="Nächster Schritt"
              onClick={goNext}
            />
          </>
        )}
      </div>
    </div>
  )
}
