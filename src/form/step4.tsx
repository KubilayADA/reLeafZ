import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import '@/app/main.css'
import '@/form/form.css'

interface Step4Props {
  onNext: (answers: { onset: string; frequency: string }) => void
  onBack?: () => void
}

type OnsetOption = 'more-than-3-months' | 'less-than-3-months'
type FrequencyOption = 'always' | 'often' | 'never'

export default function Step4({ onNext, onBack }: Step4Props) {
  const [selectedOnset, setSelectedOnset] = useState<OnsetOption | ''>('')
  const [selectedFrequency, setSelectedFrequency] = useState<FrequencyOption | ''>('')

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
    <div className="form-page inconsolata">
      <div className="form-container form-container--center">
        {onBack && (
          <div className="w-full flex justify-start form-header__back-wrap">
            <Button onClick={onBack} className="btn-outline text-sm sm:text-base">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </div>
        )}

        <div className="text-center mb-8 sm:mb-12 px-2 sm:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Diagnose für dein Rezept
          </h1>
          <p className="form-header__subtitle">
            Folge ein paar einfachen Schritten zu deinem Rezept.
          </p>
        </div>

        <div className="form-card form-card--rounded-lg flex flex-col gap-10">
          <h2 className="form-section-title">
            Symptome
          </h2>

          <div className="space-y-12">
            <section className="text-center">
              <h3 className="form-section-title">
                Wann traten deine Symptome auf?
              </h3>
              <p className="form-section-hint">
                Bitte wähle einen Zeitraum.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
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

            <section className="text-center">
              <h3 className="form-section-title">
                Wie häufig treten die Symptome bei dir auf?
              </h3>
              <p className="form-section-hint">
                Bitte wähle einen Zeitraum.
              </p>
              <div className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-6 justify-center items-center">
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
            className="form-cta btn-secondary mt-10"
          >
            Weiter
          </Button>
        </div>
      </div>
    </div>
  )
}

