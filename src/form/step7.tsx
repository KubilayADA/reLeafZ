'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import StepProgress from '@/form/step-progress'
import FormLogoHomeExit from '@/form/form-logo-home-exit'
import FormOptionCheck from '@/form/form-option-check'
import '@/form/form.css'

interface Step7Props {
  onNext: (answers: {
    previousCannabisExperience: boolean
    hadSideEffects: boolean | null
    treatmentExpectations: string[]
  }) => void
  onBack?: () => void
  initialPreviousCannabisExperience?: boolean | null
  initialHadSideEffects?: boolean | null
  initialTreatmentExpectations?: string[]
  onSelectionChange?: (answers: {
    previousCannabisExperience: boolean | null
    hadSideEffects: boolean | null
    treatmentExpectations: string[]
  }) => void
  submitting?: boolean
}

const yesNoOptions: Array<{ value: boolean; title: string }> = [
  { value: true, title: 'Ja' },
  { value: false, title: 'Nein' },
]

const treatmentExpectationOptions = [
  { id: 'Lebensqualitaet', title: 'Bessere Lebensqualität' },
  { id: 'SymptomLinderung', title: 'Linderung meiner Symptome' },
  { id: 'Funktionalitaet', title: 'Bessere Funktionalität im Alltag' },
  { id: 'Alltagsbewaeltigung', title: 'Bessere Alltagsbewältigung' },
  { id: 'Arbeitsfaehigkeit', title: 'Erhalt meiner Arbeitsfähigkeit' },
  { id: 'SozialesLeben', title: 'Verbesserung meines sozialen Lebens' },
  { id: 'BasismedikationReduktion', title: 'Reduktion meiner Basismedikation' },
  { id: 'NebenwirkungenReduzieren', title: 'Reduktion von Nebenwirkungen anderer Medikamente' },
]

export default function Step7({
  onNext,
  onBack,
  initialPreviousCannabisExperience = null,
  initialHadSideEffects = null,
  initialTreatmentExpectations = [],
  onSelectionChange,
  submitting = false,
}: Step7Props) {
  const [previousCannabisExperience, setPreviousCannabisExperience] = useState<boolean | null>(
    initialPreviousCannabisExperience
  )
  const [hadSideEffects, setHadSideEffects] = useState<boolean | null>(initialHadSideEffects)
  const [treatmentExpectations, setTreatmentExpectations] = useState<string[]>(
    initialTreatmentExpectations
  )

  useEffect(() => {
    setPreviousCannabisExperience(initialPreviousCannabisExperience)
  }, [initialPreviousCannabisExperience])

  useEffect(() => {
    setHadSideEffects(initialHadSideEffects)
  }, [initialHadSideEffects])

  useEffect(() => {
    setTreatmentExpectations(initialTreatmentExpectations)
  }, [initialTreatmentExpectations])

  const handleNext = () => {
    if (
      previousCannabisExperience !== null &&
      !(previousCannabisExperience === true && hadSideEffects === null) &&
      treatmentExpectations.length > 0
    ) {
      onNext({ previousCannabisExperience, hadSideEffects, treatmentExpectations })
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
            Cannabis Erfahrung
          </h2>

          <div className="form-step4-sections form-step4-sections--fit">
            <section className="form-step4-section form-step4-section--fit">
              <h3 className="form-section-title">
                Hast du bereits Erfahrung mit medizinischem Cannabis?
              </h3>
              <p className="form-section-hint">
                Bitte wähle eine Antwort.
              </p>
              <div className="form-step4-options form-step4-options--fit">
                {yesNoOptions.map((option) => {
                  const isSelected = previousCannabisExperience === option.value
                  return (
                    <button
                      key={String(option.value)}
                      type="button"
                      onClick={() => {
                        const newVal = option.value
                        const newHadSideEffects = newVal ? hadSideEffects : null
                        setPreviousCannabisExperience(newVal)
                        if (!newVal) setHadSideEffects(null)
                        onSelectionChange?.({
                          previousCannabisExperience: newVal,
                          hadSideEffects: newHadSideEffects,
                          treatmentExpectations,
                        })
                      }}
                      className={`form-option-card form-option-card--row form-option-card--max-width ${isSelected ? 'form-option-card--selected' : ''}`}
                    >
                      <div className="form-option-row__content">
                        <p className="form-option-row__title">{option.title}</p>
                      </div>
                      <FormOptionCheck selected={isSelected} className="form-option-check--inline" />
                    </button>
                  )
                })}
              </div>
            </section>

            {previousCannabisExperience === true && (
              <section className="form-step4-section form-step4-section--fit">
                <h3 className="form-section-title">
                  Hattest du bereits Nebenwirkungen?
                </h3>
                <p className="form-section-hint">
                  Bitte wähle eine Antwort.
                </p>
                <div className="form-step4-options form-step4-options--fit">
                  {yesNoOptions.map((option) => {
                    const isSelected = hadSideEffects === option.value
                    return (
                      <button
                        key={String(option.value)}
                        type="button"
                        onClick={() => {
                          const newVal = option.value
                          setHadSideEffects(newVal)
                          onSelectionChange?.({
                            previousCannabisExperience,
                            hadSideEffects: newVal,
                            treatmentExpectations,
                          })
                        }}
                        className={`form-option-card form-option-card--row form-option-card--max-width ${isSelected ? 'form-option-card--selected' : ''}`}
                      >
                        <div className="form-option-row__content">
                          <p className="form-option-row__title">{option.title}</p>
                        </div>
                        <FormOptionCheck selected={isSelected} className="form-option-check--inline" />
                      </button>
                    )
                  })}
                </div>
              </section>
            )}

            <section className="form-step4-section form-step4-section--fit">
              <h3 className="form-section-title">
                Was erhoffst du dir von der Behandlung mit medizinischem Cannabis?
              </h3>
              <p className="form-section-hint">
                Mehrfachauswahl möglich.
              </p>
              <div className="form-step4-options form-step4-options--fit">
                {treatmentExpectationOptions.map((option) => {
                  const isSelected = treatmentExpectations.includes(option.id)
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        const newExpectations = isSelected
                          ? treatmentExpectations.filter((x) => x !== option.id)
                          : [...treatmentExpectations, option.id]
                        setTreatmentExpectations(newExpectations)
                        onSelectionChange?.({
                          previousCannabisExperience,
                          hadSideEffects,
                          treatmentExpectations: newExpectations,
                        })
                      }}
                      className={`form-option-card form-option-card--row form-option-card--max-width ${isSelected ? 'form-option-card--selected' : ''}`}
                    >
                      <div className="form-option-row__content">
                        <p className="form-option-row__title">{option.title}</p>
                      </div>
                      <FormOptionCheck selected={isSelected} className="form-option-check--inline" />
                    </button>
                  )
                })}
              </div>
            </section>
          </div>

          <Button
            onClick={handleNext}
            disabled={
              previousCannabisExperience === null ||
              (previousCannabisExperience === true && hadSideEffects === null) ||
              treatmentExpectations.length === 0 ||
              submitting
            }
            className="form-cta btn-secondary form-step4-cta form-cta--step4-fit"
          >
            {submitting ? 'Wird gesendet...' : 'Weiter'}
          </Button>
        </div>
        <StepProgress currentStep={7} totalSteps={8} />
      </div>
    </div>
  )
}
