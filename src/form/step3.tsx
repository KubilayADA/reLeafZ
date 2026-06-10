 'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MoonStar, Activity, Brain } from 'lucide-react'
import BrainPainIcon from '@/form/form-brain-pain-icon'
import StepProgress from '@/form/step-progress'
import FormLogoHomeExit from '@/form/form-logo-home-exit'
import FormOptionCheck from '@/form/form-option-check'
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
      icon: BrainPainIcon
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

          <div className="form-options form-options--step3-fit">
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
                  className={`form-option-card form-step3-option-card ${isSelected ? 'form-option-card--selected' : ''}`}
                >
                  <FormOptionCheck selected={isSelected} className="form-option-check--corner form-step3-option-check" />
                  <div className="form-step3-option-body">
                    <div className="form-option-icon-wrap form-step3-option-icon-wrap">
                      <Icon className="form-option-icon form-step3-option-icon" />
                    </div>
                    <div className="form-step3-option-text">
                      <h3 className="form-option-title">{option.title}</h3>
                      <p className="form-option-desc form-step3-option-desc">{option.description}</p>
                    </div>
                  </div>
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

