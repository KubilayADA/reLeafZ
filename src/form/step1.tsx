'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, Video, Building2 } from 'lucide-react'
import StepProgress from '@/form/step-progress'
import FormLogoHomeExit from '@/form/form-logo-home-exit'
import '@/form/form.css'

interface Step1Props {
  onNext: (selectedOption: string) => void
  onBack?: () => void
  initialValue?: string
  onSelectionChange?: (selectedOption: string) => void
}

type ConsultationOption = 'questionnaire' | 'video' | 'onsite'

export default function Step1({ onNext, onBack, initialValue = '', onSelectionChange }: Step1Props) {
  const [selectedOption, setSelectedOption] = useState<ConsultationOption | ''>(
    initialValue as ConsultationOption | ''
  )
  const [externalRedirectNotice, setExternalRedirectNotice] = useState<
    'video' | 'onsite' | null
  >(null)

  useEffect(() => {
    setSelectedOption(initialValue as ConsultationOption | '')
  }, [initialValue])

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
    if (!selectedOption) return

    if (selectedOption === 'questionnaire') {
      onNext('questionnaire')
      return
    }

    if (selectedOption === 'video') {
      window.open('https://drterp.de', '_blank')
      setExternalRedirectNotice('video')
      return
    }

    if (selectedOption === 'onsite') {
      window.open(
        'https://www.cannabis-aerzte.de/karte/?type=arzt',
        '_blank',
      )
      setExternalRedirectNotice('onsite')
    }
  }

  return (
    <div className="form-page form-page--step1-fit inconsolata">
      <FormLogoHomeExit />
      <div className="form-container form-container--step1-fit">
        {onBack && (
          <div className="form-header__back-wrap">
            <Button onClick={onBack} className="btn-outline form-back-button text-sm sm:text-base">
              <ArrowLeft className="form-back-icon" />
              Zurück
            </Button>
          </div>
        )}

        <div className="form-card form-card--step1-fit">
          <h2 className="form-question title-gradient">
            Wie möchtest du Angaben zu deinem Gesundheitszustand machen? *
          </h2>

          <div className="form-options form-options--cols-3 form-options--step1-fit">
            {options.map((option) => {
              const Icon = option.icon
              const isSelected = selectedOption === option.id
              return (
                <div
                  key={option.id}
                  onClick={() => {
                    setExternalRedirectNotice(null)
                    setSelectedOption(option.id)
                    onSelectionChange?.(option.id)
                  }}
                  className={`form-option-card ${isSelected ? 'form-option-card--selected' : ''}`}
                >
                  <div className="form-option-icon-wrap">
                    <Icon className="form-option-icon form-option-icon--step1" />
                  </div>
                  <h3 className="form-option-title">{option.title}</h3>
                  <p className="form-option-desc">{option.description}</p>
                  <div className="form-option-price">
                    <span className="form-option-price__value">{option.price}</span>
                  </div>
                  <div className="form-option-card__radio-wrap">
                    <div className="form-option-radio">
                      {isSelected && <div className="form-option-radio__inner" />}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="form-disclaimer form-disclaimer--step1-fit">
            <p className="form-disclaimer__text">
              * Die ärztlichen Leistungen werden nach der aktuell gültigen Gebührenordnung für Ärzte (GoÄ) berechnet.
            </p>
          </div>

          <Button
            onClick={handleNext}
            disabled={!selectedOption}
              className="form-cta form-cta--step1-fit btn-secondary"
          >
            Weiter
          </Button>

          {externalRedirectNotice === 'video' && (
            <p className="mt-4 text-sm text-gray-600 text-center max-w-xl mx-auto">
              Sie werden zu unserem Video-Konsultationsanbieter weitergeleitet. Kehren
              Sie zurück, wenn Sie Ihr Rezept erhalten haben.
            </p>
          )}
          {externalRedirectNotice === 'onsite' && (
            <p className="mt-4 text-sm text-gray-600 text-center max-w-xl mx-auto">
              Sie werden zur Karte der Cannabis-Ärzte weitergeleitet.
            </p>
          )}
        </div>
        <StepProgress currentStep={1} />
      </div>
    </div>
  )
}

