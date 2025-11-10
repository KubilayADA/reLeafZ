 'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MoonStar, Activity, Brain, Sparkles } from 'lucide-react'
import '@/app/main.css'

interface Step3Props {
  onNext: (selectedOption: string) => void
  onBack?: () => void
}

type ConditionOption = 'sleep-disorder' | 'chronic-pain' | 'adhd' | 'migraine'

export default function Step3({ onNext, onBack }: Step3Props) {
  const [selectedOption, setSelectedOption] = useState<ConditionOption | ''>('')

  const options = [
    {
      id: 'sleep-disorder' as ConditionOption,
      title: 'Schlafstörung',
      description: 'Probleme beim Ein- oder Durchschlafen',
      icon: MoonStar
    },
    {
      id: 'chronic-pain' as ConditionOption,
      title: 'Chronische Schmerzen',
      description: 'Lang anhaltende oder wiederkehrende Schmerzen',
      icon: Activity
    },
    {
      id: 'adhd' as ConditionOption,
      title: 'ADHS',
      description: 'Aufmerksamkeitsdefizit-/Hyperaktivitätsstörung',
      icon: Brain
    },
    {
      id: 'migraine' as ConditionOption,
      title: 'Migräne',
      description: 'Regelmäßige Migräneanfälle oder starke Kopfschmerzen',
      icon: Sparkles
    }
  ]

  const handleNext = () => {
    if (selectedOption) {
      onNext(selectedOption)
    }
  }

  return (
    <div className="min-h-screen bg-beige inconsolata">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-8 flex flex-col items-center">
        {/* Header */}
        {onBack && (
          <div className="w-full flex justify-start mb-4 sm:mb-6">
            <Button
              onClick={onBack}
              className="btn-outline text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </div>
        )}

        {/* Title */}
        <div className="text-center mb-6 sm:mb-10 px-2 sm:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Diagnose für dein Rezept
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Folge ein paar einfachen Schritten zu deinem Rezept.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 md:p-10 w-full max-w-5xl">
          <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-900 mb-3">
            Welche Beschwerde hast du?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 text-center mb-10 px-2 sm:px-12">
            Wähle eine Beschwerde aus, die deinen Zustand am besten beschreibt.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 justify-items-center mb-10">
            {options.map((option) => {
              const Icon = option.icon
              const isSelected = selectedOption === option.id

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedOption(option.id)}
                  className={`
                    w-full max-w-xs border-2 rounded-2xl p-6 sm:p-8 text-center transition-all duration-200
                    flex flex-col items-center gap-4
                    ${isSelected
                      ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm'
                    }
                  `}
                >
                  <div className={`
                    w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full flex items-center justify-center
                    ${isSelected ? 'bg-emerald-100' : 'bg-gray-100'}
                  `}>
                    <Icon
                      className={`w-8 h-8 sm:w-10 sm:h-10 ${isSelected ? 'text-emerald-600' : 'text-emerald-500'}`}
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    {option.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed text-center break-all">
                    {option.description}
                  </p>
                </button>
              )
            })}
          </div>

          <Button
            onClick={handleNext}
            disabled={!selectedOption}
            className="w-full btn-secondary py-3 sm:py-4 text-base sm:text-lg font-bold"
          >
            Weiter
          </Button>
        </div>
      </div>
    </div>
  )
}

