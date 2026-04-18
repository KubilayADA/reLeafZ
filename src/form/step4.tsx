import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import StepProgress from '@/form/step-progress'
import FormLogoHomeExit from '@/form/form-logo-home-exit'
import '@/form/form.css'

interface Step4Props {
  onNext: (answers: { onset: string; frequency: string }) => void
  onBack?: () => void
  initialOnsetValue?: string
  initialFrequencyValue?: string
  onSelectionChange?: (answers: { onset: string; frequency: string }) => void
}

type OnsetOption = 'more-than-3-months' | 'less-than-3-months'
type FrequencyOption = 'always' | 'often' | 'never'

export default function Step4({
  onNext,
  onBack,
  initialOnsetValue = '',
  initialFrequencyValue = '',
  onSelectionChange,
}: Step4Props) {
  const [selectedOnset, setSelectedOnset] = useState<OnsetOption | ''>(initialOnsetValue as OnsetOption | '')
  const [selectedFrequency, setSelectedFrequency] = useState<FrequencyOption | ''>(
    initialFrequencyValue as FrequencyOption | ''
  )

  useEffect(() => {
    setSelectedOnset(initialOnsetValue as OnsetOption | '')
  }, [initialOnsetValue])

  useEffect(() => {
    setSelectedFrequency(initialFrequencyValue as FrequencyOption | '')
  }, [initialFrequencyValue])

  useEffect(() => {
    onSelectionChange?.({
      onset: selectedOnset,
      frequency: selectedFrequency,
    })
  }, [selectedOnset, selectedFrequency, onSelectionChange])

  const onsetOptions = [
    {
      id: 'more-than-3-months' as OnsetOption,
      title: 'Vor mehr als 3 Monaten',
      description: 'Die Beschwerden bestehen seit längerem'
    },
    {
      id: 'less-than-3-months' as OnsetOption,
      title: 'Vor weniger als 3 Monaten',
      description: 'Die Beschwerden traten vor kurzem auf'
    }
  ]

  const frequencyOptions = [
    {
      id: 'always' as FrequencyOption,
      title: 'Ständig',
      description: 'Die Beschwerden sind dauerhaft vorhanden'
    },
    {
      id: 'often' as FrequencyOption,
      title: 'Oft',
      description: 'Die Beschwerden treten regelmäßig auf'
    },
    {
      id: 'never' as FrequencyOption,
      title: 'Nie',
      description: 'Die Beschwerden sind nicht mehr vorhanden'
    }
  ]

  const handleNext = () => {
    if (selectedOnset && selectedFrequency) {
      onNext({
        onset: selectedOnset,
        frequency: selectedFrequency
      })
    }
  }

  return (
    <div className="form-page form-page--step4-fit inconsolata">
      <FormLogoHomeExit />
      <div className="form-container form-container--step4-fit">
        {onBack && (
          <div className="form-header__back-wrap">
            <Button onClick={onBack} className="btn-outline form-back-button text-sm sm:text-base">
              <ArrowLeft className="form-back-icon" />
              Zurück
            </Button>
          </div>
        )}

        <div className="form-card form-card--rounded-lg form-card--step4-fit">
          <h2 className="form-section-title">
            Symptome
          </h2>

          <div className="form-step4-sections form-step4-sections--fit">
            <section className="form-step4-section form-step4-section--fit">
              <h3 className="form-section-title">
                Wann traten deine Symptome auf?
              </h3>
              <p className="form-section-hint">
                Bitte wähle einen Zeitraum.
              </p>
              <div className="form-step4-options form-step4-options--fit">
                {onsetOptions.map((option) => {
                  const isSelected = selectedOnset === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedOnset(option.id)}
                      className={`form-option-card form-option-card--row form-option-card--max-width ${isSelected ? 'form-option-card--selected' : ''}`}
                    >
                      <div className="form-option-row__content">
                        <p className="form-option-row__title">{option.title}</p>
                        <p className="form-option-row__desc">{option.description}</p>
                      </div>
                      <span className="form-option-radio form-option-radio--inline">
                        {isSelected && <span className="form-option-radio__inner" />}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="form-step4-section form-step4-section--fit">
              <h3 className="form-section-title">
                Wie häufig treten die Symptome bei dir auf?
              </h3>
              <p className="form-section-hint">
                Bitte wähle einen Zeitraum.
              </p>
              <div className="form-step4-options form-step4-options--fit">
                {frequencyOptions.map((option) => {
                  const isSelected = selectedFrequency === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedFrequency(option.id)}
                      className={`form-option-card form-option-card--row form-option-card--max-width ${isSelected ? 'form-option-card--selected' : ''}`}
                    >
                      <div className="form-option-row__content">
                        <p className="form-option-row__title">{option.title}</p>
                        <p className="form-option-row__desc">{option.description}</p>
                      </div>
                      <span className="form-option-radio form-option-radio--inline">
                        {isSelected && <span className="form-option-radio__inner" />}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>
          </div>

          <p className="form-warning-text">
            Falls deine Symptome vor weniger als 3 Monaten und Nie auftreten, kannst du kein Rezept von uns erhalten und musst erst einen Arzt aufsuchen.
          </p>

          <Button
            onClick={handleNext}
            disabled={!selectedOnset || !selectedFrequency}
            className="form-cta btn-secondary form-step4-cta form-cta--step4-fit"
          >
            Weiter
          </Button>
        </div>
        <StepProgress currentStep={4} />
      </div>
    </div>
  )
}

