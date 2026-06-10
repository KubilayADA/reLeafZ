import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import StepProgress from '@/form/step-progress'
import FormLogoHomeExit from '@/form/form-logo-home-exit'
import FormOptionCheck from '@/form/form-option-check'
import '@/form/form.css'

interface Step4Props {
  onNext: (answers: {
    onset: string
    frequency: string
    severity: string
    diagnosisText: string
  }) => void
  onBack?: () => void
  initialOnsetValue?: string
  initialFrequencyValue?: string
  initialSeverityValue?: string
  initialDiagnosisTextValue?: string
  onSelectionChange?: (answers: {
    onset: string
    frequency: string
    severity: string
    diagnosisText: string
  }) => void
  submitting?: boolean
}

type OnsetOption = 'more-than-3-months' | 'less-than-3-months'
type FrequencyOption = 'always' | 'often' | 'never'
type SeverityOption = 'sehr-leicht' | 'leicht' | 'mittel' | 'stark' | 'sehr-stark'

export default function Step4({
  onNext,
  onBack,
  initialOnsetValue = '',
  initialFrequencyValue = '',
  initialSeverityValue = '',
  initialDiagnosisTextValue = '',
  onSelectionChange,
  submitting = false,
}: Step4Props) {
  const [selectedOnset, setSelectedOnset] = useState<OnsetOption | ''>(initialOnsetValue as OnsetOption | '')
  const [selectedFrequency, setSelectedFrequency] = useState<FrequencyOption | ''>(
    initialFrequencyValue as FrequencyOption | ''
  )
  const [selectedSeverity, setSelectedSeverity] = useState<SeverityOption | ''>(
    initialSeverityValue as SeverityOption | ''
  )
  const [diagnosisText, setDiagnosisText] = useState<string>(initialDiagnosisTextValue)

  useEffect(() => {
    setSelectedOnset(initialOnsetValue as OnsetOption | '')
  }, [initialOnsetValue])

  useEffect(() => {
    setSelectedFrequency(initialFrequencyValue as FrequencyOption | '')
  }, [initialFrequencyValue])

  useEffect(() => {
    setSelectedSeverity(initialSeverityValue as SeverityOption | '')
  }, [initialSeverityValue])

  useEffect(() => {
    setDiagnosisText(initialDiagnosisTextValue)
  }, [initialDiagnosisTextValue])

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

  const severityOptions = [
    { id: 'sehr-leicht' as SeverityOption, title: 'Sehr leicht', description: 'Kaum wahrnehmbar' },
    { id: 'leicht' as SeverityOption, title: 'Leicht', description: 'Spürbar, aber wenig belastend' },
    { id: 'mittel' as SeverityOption, title: 'Mittel', description: 'Deutlich belastend im Alltag' },
    { id: 'stark' as SeverityOption, title: 'Stark', description: 'Stark einschränkend' },
    { id: 'sehr-stark' as SeverityOption, title: 'Sehr stark', description: 'Lebensqualität erheblich reduziert' },
  ]

  const handleNext = () => {
    if (selectedOnset && selectedFrequency && selectedSeverity) {
      onNext({
        onset: selectedOnset,
        frequency: selectedFrequency,
        severity: selectedSeverity,
        diagnosisText: diagnosisText.trim(),
      })
    }
  }

  return (
    <div className="form-page form-page--step4-fit inconsolata">
      <FormLogoHomeExit />
      <div className="form-container form-container--step4-fit">
        {onBack && (
          <div className="form-header__back-wrap">
            <Button onClick={onBack} disabled={submitting} className="btn-outline form-back-button text-sm sm:text-base">
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
                      onClick={() => {
                        setSelectedOnset(option.id)
                        onSelectionChange?.({ onset: option.id, frequency: selectedFrequency, severity: selectedSeverity, diagnosisText })
                      }}
                      className={`form-option-card form-option-card--row form-option-card--max-width ${isSelected ? 'form-option-card--selected' : ''}`}
                    >
                      <div className="form-option-row__content">
                        <p className="form-option-row__title">{option.title}</p>
                        <p className="form-option-row__desc">{option.description}</p>
                      </div>
                      <FormOptionCheck selected={isSelected} className="form-option-check--inline" />
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
                      onClick={() => {
                        setSelectedFrequency(option.id)
                        onSelectionChange?.({ onset: selectedOnset, frequency: option.id, severity: selectedSeverity, diagnosisText })
                      }}
                      className={`form-option-card form-option-card--row form-option-card--max-width ${isSelected ? 'form-option-card--selected' : ''}`}
                    >
                      <div className="form-option-row__content">
                        <p className="form-option-row__title">{option.title}</p>
                        <p className="form-option-row__desc">{option.description}</p>
                      </div>
                      <FormOptionCheck selected={isSelected} className="form-option-check--inline" />
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="form-step4-section form-step4-section--fit">
              <h3 className="form-section-title">
                Wie stark belasten dich deine Symptome?
              </h3>
              <p className="form-section-hint">
                Bitte wähle eine Stufe.
              </p>
              <div className="form-step4-options form-step4-options--fit">
                {severityOptions.map((option) => {
                  const isSelected = selectedSeverity === option.id
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSelectedSeverity(option.id)
                        onSelectionChange?.({
                          onset: selectedOnset,
                          frequency: selectedFrequency,
                          severity: option.id,
                          diagnosisText,
                        })
                      }}
                      className={`form-option-card form-option-card--row form-option-card--max-width ${isSelected ? 'form-option-card--selected' : ''}`}
                    >
                      <div className="form-option-row__content">
                        <p className="form-option-row__title">{option.title}</p>
                        <p className="form-option-row__desc">{option.description}</p>
                      </div>
                      <FormOptionCheck selected={isSelected} className="form-option-check--inline" />
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="form-step4-section form-step4-section--fit">
              <h3 className="form-section-title">
                Hast du bereits eine Diagnose oder weitere Beschwerden?
              </h3>
              <p className="form-section-hint">
                Optional. Falls bekannt, gib einen ICD-Code oder beschreibe deine Befunde kurz.
              </p>
              <textarea
                value={diagnosisText}
                onChange={(e) => {
                  const next = e.target.value.slice(0, 2000)
                  setDiagnosisText(next)
                  onSelectionChange?.({
                    onset: selectedOnset,
                    frequency: selectedFrequency,
                    severity: selectedSeverity,
                    diagnosisText: next,
                  })
                }}
                placeholder="z.B. M54.5 Lumbago, seit 6 Monaten, ärztliche Diagnose vorhanden"
                maxLength={2000}
                rows={4}
                disabled={submitting}
                className="form-input form-textarea inconsolata"
                style={{ width: '100%', resize: 'vertical', minHeight: '6rem', padding: '0.75rem', borderRadius: '0.5rem' }}
              />
              <p className="form-section-hint" style={{ textAlign: 'right', marginTop: '0.25rem', fontSize: '0.75rem' }}>
                {diagnosisText.length}/2000
              </p>
            </section>
          </div>

          <p className="form-warning-text">
            Falls deine Symptome vor weniger als 3 Monaten und Nie auftreten, kannst du kein Rezept von uns erhalten und musst erst einen Arzt aufsuchen.
          </p>

          <Button
            onClick={handleNext}
            disabled={!selectedOnset || !selectedFrequency || !selectedSeverity || submitting}
            className="form-cta btn-secondary form-step4-cta form-cta--step4-fit"
          >
            {submitting ? 'Wird gesendet...' : 'Weiter'}
          </Button>
        </div>
        <StepProgress currentStep={4} />
      </div>
    </div>
  )
}

