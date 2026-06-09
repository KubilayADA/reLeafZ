'use client'

import React from 'react'
import '@/app/main.css'
import './how.css'
import SectionParticlesBackground from '@/components/ui/SectionParticlesBackground'
import HowStoriesSlider from './HowStoriesSlider'

export default function Funktioniert(): React.JSX.Element {
  return (
    <section
      id="how-funktioniert"
      className="funktioniert-section how-funktioniert"
      aria-label="So funktioniert der Ablauf"
    >
      <div className="how-funktioniert__bg" aria-hidden>
        <div className="how-funktioniert__bg-base" />
        <SectionParticlesBackground className="how-funktioniert__particles" />
        <div className="how-funktioniert__glow-radial" />
        <div className="how-funktioniert__grid" />
      </div>

      <div className="funktioniert-section__shell how-funktioniert__shell">
        <div className="funktioniert-section__intro">
          <span className="funktioniert-section__pill">So funktioniert&apos;s</span>
          <h2 className="funktioniert-section__title">Dein Rezept in 4 Schritten</h2>
        </div>

        <HowStoriesSlider tapToAdvance />
      </div>
    </section>
  )
}
