'use client'

import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import StepIndicator from '@/form/StepIndicator'
import '@/app/main.css'

interface Step7Props {
  onNext: (answer: 'yes' | 'no') => void
  onBack?: () => void
}

const INDICATOR_STEPS = ['1', '2', '3', '4', '5', '6', '7'] as const

export default function Step7({ onNext, onBack }: Step7Props) {
  const [selection, setSelection] = useState<'yes' | 'no' | ''>('')

  const handleNext = () => {
    if (selection) {
      onNext(selection)
    }
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
          <p className="text-sm sm:text-base text-gray-600">Folge ein paar einfachen Schritten zu deinem Rezept.</p>
        </div>

        <StepIndicator currentStep={7} steps={INDICATOR_STEPS} />

        <div className="bg-white rounded-3xl shadow-lg p-5 sm:p-8 md:p-10 text-center">
          <div className="mb-6 sm:mb-8">
            <p className="text-sm sm:text-base uppercase tracking-[0.25em] text-emerald-600 mb-2">
              Cannabis Behandlung
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
              Wurde dir in Deutschland in der Vergangenheit bereits Cannabis verschrieben?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto mb-8">
            {[
              { id: 'yes' as const, label: 'Ja' },
              { id: 'no' as const, label: 'Nein' },
            ].map((option) => {
              const active = selection === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelection(option.id)}
                  className={`w-full rounded-2xl border transition-all duration-200 px-6 py-5 text-left shadow-sm ${
                    active
                      ? 'border-emerald-500 bg-emerald-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-lg font-semibold text-gray-900">{option.label}</p>
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                        active ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'
                      }`}
                    >
                      {active && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto mb-8">
            Wenn du bereits Cannabis auf Rezept erhalten hast, kannst du deine Erfahrung im nächsten Schritt mit uns
            teilen.
          </p>

          <Button
            onClick={handleNext}
            disabled={!selection}
            className="w-full btn-secondary py-3 sm:py-4 text-base sm:text-lg font-bold"
          >
            Weiter
          </Button>
        </div>
      </div>
    </div>
  )
}


