'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Bike, Package } from 'lucide-react'
import StepProgress from '@/form/step-progress'
import FormLogoHomeExit from '@/form/form-logo-home-exit'
import '@/form/form.css'

interface Step2Props {
  onNext: (selectedOption: string) => void
  onBack?: () => void
  initialValue?: string
  onSelectionChange?: (selectedOption: string) => void
}

type DeliveryOption = 'courier' | 'shipping'

export default function Step2({ onNext, onBack, initialValue = '', onSelectionChange }: Step2Props) {
  const [selectedOption, setSelectedOption] = useState<DeliveryOption | ''>(
    initialValue as DeliveryOption | ''
  )

  useEffect(() => {
    setSelectedOption(initialValue as DeliveryOption | '')
  }, [initialValue])

  const options = [
    {
      id: 'courier' as DeliveryOption,
      title: 'Rezept + Kurier: 60-90min',
      description: 'Mo-So: 09-21:30 Uhr | Die Herz Apotheke Berlin',
      icon: Bike,
      time: '60-90min'
    },
    {
      id: 'shipping' as DeliveryOption,
      title: 'Rezept + Versand: 1-2 Tage',
      description: 'Internationale HBF Apotheke',
      icon: Package,
      time: '1-2 Tage'
    }
  ]

  const handleNext = () => {
    if (selectedOption) {
      onNext(selectedOption)
    }
  }

  return (
    <div className="form-page form-page--step2-fit inconsolata">
      <FormLogoHomeExit />
      <div className="form-container form-container--step2-fit">
        {onBack && (
          <div className="form-header__back-wrap">
            <Button onClick={onBack} className="btn-outline form-back-button text-sm sm:text-base">
              <ArrowLeft className="form-back-icon" />
              Zurück
            </Button>
          </div>
        )}

        <div className="form-card form-card--step2-fit">
          <h2 className="form-question form-question--center title-gradient">
            Falls ein Rezept ausgestellt wird, wie möchtest du deine Medikamente erhalten?
          </h2>
          <p className="form-question-hint">
            Berlin: Wähle deine Versandart und Apotheke aus *
          </p>

          <div className="form-options form-options--cols-2 form-options--center form-options--step2-fit">
            {options.map((option) => {
              const Icon = option.icon
              const isSelected = selectedOption === option.id
              return (
                <div
                  key={option.id}
                  onClick={() => {
                    setSelectedOption(option.id)
                    onSelectionChange?.(option.id)
                  }}
                  className={`form-option-card form-option-card--max-width form-option-card--text-center ${isSelected ? 'form-option-card--selected' : ''}`}
                >
                  <div className="form-option-icon-wrap form-option-icon-wrap--large">
                    <Icon className="form-option-icon form-option-icon--step2" />
                  </div>
                  <h3 className="form-option-title">{option.title}</h3>
                  <p className="form-option-desc">{option.description}</p>
                  <div className="form-option-card__radio-wrap">
                    <div className="form-option-radio">
                      {isSelected && <div className="form-option-radio__inner" />}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="form-disclaimer form-disclaimer--center form-disclaimer--step2-fit">
            <p className="form-disclaimer__text">
              * Die Versandart kann nach der Rezeptausstellung ausgewählt werden.
            </p>
          </div>

          <Button
            onClick={handleNext}
            disabled={!selectedOption}
            className="form-cta form-cta--step2-fit btn-secondary"
          >
            Weiter
          </Button>
        </div>
        <StepProgress currentStep={2} />
      </div>
    </div>
  )
}
