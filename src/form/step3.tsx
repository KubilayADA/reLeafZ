 'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MoonStar, Activity, Brain, Sparkles } from 'lucide-react'
import '@/app/main.css'
import '@/form/form.css'

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
    <div className="form-page helvetica">
      <div className="form-container form-container--center form-container--wide">
        {onBack && (
          <div className="w-full flex justify-start form-header__back-wrap">
            <Button onClick={onBack} className="btn-outline text-sm sm:text-base">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </div>
        )}

        <div className="text-center mb-6 sm:mb-10 px-2 sm:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Diagnose für dein Rezept
          </h1>
          <p className="form-header__subtitle">
            Folge ein paar einfachen Schritten zu deinem Rezept.
          </p>
        </div>

        <div className="form-card form-card--rounded-lg max-w-5xl">
          <h2 className="form-section-title">
            Welche Beschwerde hast du?
          </h2>
          <p className="form-section-hint mb-10 px-2 sm:px-12">
            Wähle eine Beschwerde aus, die deinen Zustand am besten beschreibt.
          </p>

          <div className="form-options form-options--cols-4 form-options--center mb-10">
            {options.map((option) => {
              const Icon = option.icon
              const isSelected = selectedOption === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedOption(option.id)}
                  className={`form-option-card form-option-card--rounded-lg form-option-card--max-width form-option-card--text-center flex flex-col items-center gap-4 ${isSelected ? 'form-option-card--selected' : ''}`}
                >
                  <div className="form-option-icon-wrap form-option-icon-wrap--circle">
                    <Icon className="form-option-icon w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <h3 className="form-option-title">{option.title}</h3>
                  <p className="form-option-desc leading-relaxed break-all">{option.description}</p>
                </button>
              )
            })}
          </div>

          <Button
            onClick={handleNext}
            disabled={!selectedOption}
            className="form-cta btn-secondary"
          >
            Weiter
          </Button>
        </div>
      </div>
    </div>
  )
}

