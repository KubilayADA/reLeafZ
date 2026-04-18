 'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MoonStar, Activity, Brain, Sparkles } from 'lucide-react'
import StepProgress from '@/form/step-progress'
import FormLogoHomeExit from '@/form/form-logo-home-exit'
import '@/form/form.css'

interface Step3Props {
  onNext: (selectedOption: string) => void
  onBack?: () => void
  initialValue?: string
  onSelectionChange?: (selectedOption: string) => void
}

type ConditionOption = 'sleep-disorder' | 'chronic-pain' | 'adhd' | 'migraine'

export default function Step3({ onNext, onBack, initialValue = '', onSelectionChange }: Step3Props) {
  const [selectedOption, setSelectedOption] = useState<ConditionOption | ''>(
    initialValue as ConditionOption | ''
  )

  useEffect(() => {
    setSelectedOption(initialValue as ConditionOption | '')
  }, [initialValue])

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
    <div className="form-page form-page--step3-fit inconsolata">
      <FormLogoHomeExit />
      <div className="form-container form-container--step3-fit">
        {onBack && (
          <div className="form-header__back-wrap">
            <Button onClick={onBack} className="btn-outline form-back-button text-sm sm:text-base">
              <ArrowLeft className="form-back-icon" />
              Zurück
            </Button>
          </div>
        )}

        <div className="form-card form-card--rounded-lg form-card--step3-fit">
          <h2 className="form-section-title">
            Welche Beschwerde hast du?
          </h2>
          <p className="form-section-hint form-step3-hint">
            Wähle eine Beschwerde aus, die deinen Zustand am besten beschreibt.
          </p>

          <div className="form-options form-options--cols-4 form-options--center form-options--step3-fit">
            {options.map((option) => {
              const Icon = option.icon
              const isSelected = selectedOption === option.id
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setSelectedOption(option.id)
                    onSelectionChange?.(option.id)
                  }}
                  className={`form-option-card form-option-card--rounded-lg form-option-card--max-width form-option-card--text-center form-step3-option-card ${isSelected ? 'form-option-card--selected' : ''}`}
                >
                  <div className="form-option-icon-wrap form-option-icon-wrap--circle">
                    <Icon className="form-option-icon form-step3-option-icon" />
                  </div>
                  <h3 className="form-option-title">{option.title}</h3>
                  <p className="form-option-desc form-step3-option-desc">{option.description}</p>
                </button>
              )
            })}
          </div>

          <Button
            onClick={handleNext}
            disabled={!selectedOption}
            className="form-cta form-cta--step3-fit btn-secondary"
          >
            Weiter
          </Button>
        </div>
        <StepProgress currentStep={3} />
      </div>
    </div>
  )
}

