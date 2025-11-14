'use client'

import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import StepIndicator from '@/form/StepIndicator'
import '@/app/main.css'

interface Step8Props {
  onNext: (opts: { marketingOptIn: boolean }) => void
  onBack?: () => void
}

const INDICATOR_STEPS = ['1', '2', '3', '4', '5', '6', '7', '8'] as const

const CRITERIA = [
  'Ich versuche nicht mit einer Cannabis­sucht aufzuhören.',
  'Ich bin nicht unter 18, schwanger oder habe Herz-, Leber-, Nieren- oder Lungen­erkrankungen.',
  'Ich habe oder hatte keine Psychose oder psychische Erkrankungen.',
  'Ich nehme keine Medikamente mit Wechselwirkungen wie Blutverdünner, Beruhigungsmittel, Antidepressiva, Potenzmittel, Antipsychotika, Antikonvulsiva, Sympathikomimetika, Antidiabetika oder ZNS-dämpfende Mittel wie Benzodiazepine.',
  'Ich bin kein Kraftfahrer oder unter Bewährung.',
] as const

export default function Step8({ onNext, onBack }: Step8Props) {
  const [marketingOptIn, setMarketingOptIn] = useState(false)

  const handleSubmit = () => {
    onNext({ marketingOptIn })
  }

  return (
    <div className="min-h-screen bg-beige inconsolata">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {onBack && (
          <div className="mb-4 sm:mb-6">
            <Button onClick={onBack} className="btn-outline text-sm sm:text-base">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </div>
        )}

        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">Diagnose für dein Rezept</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Folge ein paar einfachen Schritten, um dein Rezept zu erhalten.
          </p>
        </div>

        <StepIndicator currentStep={8} steps={INDICATOR_STEPS} />

        <div className="bg-white rounded-3xl shadow-lg p-5 sm:p-8 md:p-10">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">Ausschlusskriterien</h2>
            <p className="text-base sm:text-lg text-gray-700 font-medium">
              Ich bestätige, dass ich die folgenden Kriterien erfülle.
            </p>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-gray-700 mb-8">
            {CRITERIA.map((item, idx) => (
              <p key={idx}>- {item}</p>
            ))}
            <p>
              - Ich akzeptiere die{' '}
              <a
                href="/agb"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-700 underline"
              >
                AGB
              </a>{' '}
              der Plattform.
            </p>
          </div>

          <label
            className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-4 text-sm sm:text-base text-gray-700 cursor-pointer mb-6"
          >
            <input
              type="checkbox"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
              className="h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            Ich möchte per E-Mail und SMS über Angebote und Neuigkeiten informiert werden (z.B. 0€ Rezept)
          </label>

          <Button
            onClick={handleSubmit}
            className="w-full btn-secondary py-3 sm:py-4 text-base sm:text-lg font-bold flex items-center justify-center gap-2"
          >
            Ja, ich bestätige
          </Button>
        </div>
      </div>
    </div>
  )
}


