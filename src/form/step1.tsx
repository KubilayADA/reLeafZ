'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, Video, Building2 } from 'lucide-react'
import '@/app/main.css'
import '@/form/form.css'

interface Step1Props {
  onNext: (selectedOption: string) => void
  onBack?: () => void
}

type ConsultationOption = 'questionnaire' | 'video' | 'onsite'

export default function Step1({ onNext, onBack }: Step1Props) {
  const [selectedOption, setSelectedOption] = useState<ConsultationOption | ''>('')

  const options = [
    {
      id: 'questionnaire' as ConsultationOption,
      title: 'Online-Fragebogen',
      price: '14,99€*',
      icon: FileText,
      description: 'Schnell und einfach von zu Hause aus'
    },
    {
      id: 'video' as ConsultationOption,
      title: 'Video-Sprechstunde',
      price: 'ab 45€*',
      icon: Video,
      description: 'Persönliche Beratung per Video'
    },
    {
      id: 'onsite' as ConsultationOption,
      title: 'Vor-Ort-Termin',
      price: 'Auf Anfrage*',
      icon: Building2,
      description: 'Termin in unserer Praxis'
    }
  ]

  const handleNext = () => {
    if (selectedOption) {
      onNext(selectedOption)
    }
  }

  return (
    <div className="form-page inconsolata">
      <div className="form-container">
        {onBack && (
          <div className="form-header__back-wrap">
            <Button onClick={onBack} className="btn-outline text-sm sm:text-base">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </div>
        )}

        <div className="form-progress">
          <div className="form-progress__track">
            <div className="form-progress__step">
              <div className="form-progress__dot form-progress__dot--active">1</div>
              <span className="form-progress__label form-progress__label--active">Anfrage</span>
            </div>
            <div className="form-progress__connector" />
            <div className="form-progress__step">
              <div className="form-progress__dot form-progress__dot--inactive">2</div>
              <span className="form-progress__label form-progress__label--inactive hidden sm:inline">Produktauswahl</span>
              <span className="form-progress__label form-progress__label--inactive sm:hidden">Produkt</span>
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
          <h2 className="form-question title-gradient">
            Wie möchtest du Angaben zu deinem Gesundheitszustand machen? *
          </h2>

          <div className="form-options form-options--cols-3">
            {options.map((option) => {
              const Icon = option.icon
              const isSelected = selectedOption === option.id
              return (
                <div
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`form-option-card ${isSelected ? 'form-option-card--selected' : ''}`}
                >
                  <div className="form-option-icon-wrap">
                    <Icon className={`form-option-icon w-6 h-6 sm:w-8 sm:h-8`} />
                  </div>
                  <h3 className="form-option-title">{option.title}</h3>
                  <p className="form-option-desc">{option.description}</p>
                  <div className="form-option-price">
                    <span className="form-option-price__value">{option.price}</span>
                  </div>
                  <div className="flex items-center justify-center mt-4">
                    <div className="form-option-radio">
                      {isSelected && <div className="form-option-radio__inner" />}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="form-disclaimer">
            <p className="form-disclaimer__text">
              * Die ärztlichen Leistungen werden nach der aktuell gültigen Gebührenordnung für Ärzte (GoÄ) berechnet.
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

