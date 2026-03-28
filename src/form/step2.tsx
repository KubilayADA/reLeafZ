'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Bike, Package } from 'lucide-react'
import '@/app/main.css'
import '@/form/form.css'

interface Step2Props {
  onNext: (selectedOption: string) => void
  onBack?: () => void
}

type DeliveryOption = 'courier' | 'shipping'

export default function Step2({ onNext, onBack }: Step2Props) {
  const [selectedOption, setSelectedOption] = useState<DeliveryOption | ''>('')

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
      description: 'Internationale HBF Apotheke München',
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
    <div className="form-page helvetica">
      <div className="form-container form-container--center">
        {onBack && (
          <div className="form-header__back-wrap">
            <Button onClick={onBack} className="btn-outline text-sm sm:text-base">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </div>
        )}

        <div className="form-progress w-full">
          <div className="form-progress__track">
            <div className="form-progress__step">
              <div className="form-progress__dot form-progress__dot--inactive">1</div>
              <span className="form-progress__label form-progress__label--inactive hidden sm:inline">Anfrage</span>
            </div>
            <div className="form-progress__connector" />
            <div className="form-progress__step">
              <div className="form-progress__dot form-progress__dot--active">2</div>
              <span className="form-progress__label form-progress__label--active hidden sm:inline">Produktauswahl</span>
              <span className="form-progress__label form-progress__label--active sm:hidden">Produkt</span>
            </div>
            <div className="form-progress__connector" />
            <div className="form-progress__step">
              <div className="form-progress__dot form-progress__dot--inactive">3</div>
              <span className="form-progress__label form-progress__label--inactive hidden sm:inline">Anfrage absenden</span>
              <span className="form-progress__label form-progress__label--inactive sm:hidden">Absenden</span>
            </div>
          </div>
        </div>

        <div className="form-card">
          <h2 className="form-question form-question--center title-gradient">
            Falls ein Rezept ausgestellt wird, wie möchtest du deine Medikamente erhalten?
          </h2>
          <p className="form-question-hint">
            Berlin: Wähle deine Versandart und Apotheke aus *
          </p>

          <div className="form-options form-options--cols-2 form-options--center">
            {options.map((option) => {
              const Icon = option.icon
              const isSelected = selectedOption === option.id
              return (
                <div
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`form-option-card form-option-card--max-width form-option-card--text-center ${isSelected ? 'form-option-card--selected' : ''}`}
                >
                  <div className="form-option-icon-wrap form-option-icon-wrap--large">
                    <Icon className={`form-option-icon w-16 h-16 sm:w-20 sm:h-20`} />
                  </div>
                  <h3 className="form-option-title">{option.title}</h3>
                  <p className="form-option-desc">{option.description}</p>
                  <div className="flex items-center justify-center mt-4">
                    <div className="form-option-radio">
                      {isSelected && <div className="form-option-radio__inner" />}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="form-disclaimer form-disclaimer--center">
            <p className="form-disclaimer__text">
              * Die Versandart kann nach der Rezeptausstellung ausgewählt werden.
            </p>
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
