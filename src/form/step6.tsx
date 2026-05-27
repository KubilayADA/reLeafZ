'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import StepProgress from '@/form/step-progress'
import FormLogoHomeExit from '@/form/form-logo-home-exit'
import '@/form/form.css'

interface Step6Props {
  onNext: (answers: {
    isPregnantOrBreastfeeding: boolean
    exceededMonthlyLimit: boolean
    preExistingConditions: string[]
  }) => void
  onBack?: () => void
  initialIsPregnantOrBreastfeeding?: boolean | null
  initialExceededMonthlyLimit?: boolean | null
  initialPreExistingConditions?: string[]
  onSelectionChange?: (answers: {
    isPregnantOrBreastfeeding: boolean | null
    exceededMonthlyLimit: boolean | null
    preExistingConditions: string[]
  }) => void
  submitting?: boolean
}

const yesNoOptions: Array<{ value: boolean; title: string }> = [
  { value: true, title: 'Ja' },
  { value: false, title: 'Nein' },
]

const preExistingConditionOptions = [
  { id: 'Psychose', title: 'Psychose oder Schizophrenie' },
  { id: 'Persoenlichkeitsstoerung', title: 'Persönlichkeitsstörung' },
  { id: 'Sucht', title: 'Suchterkrankung' },
  { id: 'Herzkrankheit', title: 'Schwere Herzerkrankung' },
  { id: 'LeberNierenkrankheit', title: 'Leber- oder Nierenerkrankung' },
  { id: 'THCAllergie', title: 'THC-Allergie' },
  { id: 'Keine', title: 'Keine Vorerkrankungen' },
]

export default function Step6({
  onNext,
  onBack,
  initialIsPregnantOrBreastfeeding = null,
  initialExceededMonthlyLimit = null,
  initialPreExistingConditions = [],
  onSelectionChange,
  submitting = false,
}: Step6Props) {
  const [isPregnantOrBreastfeeding, setIsPregnantOrBreastfeeding] = useState<boolean | null>(
    initialIsPregnantOrBreastfeeding
  )
  const [exceededMonthlyLimit, setExceededMonthlyLimit] = useState<boolean | null>(
    initialExceededMonthlyLimit
  )
  const [preExistingConditions, setPreExistingConditions] = useState<string[]>(
    initialPreExistingConditions
  )

  useEffect(() => {
    setIsPregnantOrBreastfeeding(initialIsPregnantOrBreastfeeding)
  }, [initialIsPregnantOrBreastfeeding])

  useEffect(() => {
    setExceededMonthlyLimit(initialExceededMonthlyLimit)
  }, [initialExceededMonthlyLimit])

  useEffect(() => {
    setPreExistingConditions(initialPreExistingConditions)
  }, [initialPreExistingConditions])

  const handleNext = () => {
    if (
      isPregnantOrBreastfeeding !== null &&
      exceededMonthlyLimit !== null &&
      preExistingConditions.length > 0
    ) {
      onNext({ isPregnantOrBreastfeeding, exceededMonthlyLimit, preExistingConditions })
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
            Ausschlusskriterien
          </h2>

          <div className="form-step4-sections form-step4-sections--fit">
            <section className="form-step4-section form-step4-section--fit">
              <h3 className="form-section-title">
                Bist du aktuell schwanger oder stillst du?
              </h3>
              <p className="form-section-hint">
                Bitte wähle eine Antwort.
              </p>
              <div className="form-step4-options form-step4-options--fit">
                {yesNoOptions.map((option) => {
                  const isSelected = isPregnantOrBreastfeeding === option.value
                  return (
                    <button
                      key={String(option.value)}
                      type="button"
                      onClick={() => {
                        const newVal = option.value
                        setIsPregnantOrBreastfeeding(newVal)
                        onSelectionChange?.({
                          isPregnantOrBreastfeeding: newVal,
                          exceededMonthlyLimit,
                          preExistingConditions,
                        })
                      }}
                      className={`form-option-card form-option-card--row form-option-card--max-width ${isSelected ? 'form-option-card--selected' : ''}`}
                    >
                      <div className="form-option-row__content">
                        <p className="form-option-row__title">{option.title}</p>
                      </div>
                      <span className="form-option-radio form-option-radio--inline">
                        {isSelected && <span className="form-option-radio__inner" />}
                      </span>
                    </button>
                  )
                })}
              </div>
              {isPregnantOrBreastfeeding === true && (
                <p className="form-warning-text" style={{ marginTop: '0.75rem' }}>
                  ⚠️ Hinweis: Bei Schwangerschaft oder Stillzeit ist eine medizinische Cannabis-Therapie in der Regel nicht möglich. Bitte sprich mit einem Arzt vor Ort.
                </p>
              )}
            </section>

            <section className="form-step4-section form-step4-section--fit">
              <h3 className="form-section-title">
                Hast du im aktuellen Monat bereits über 100g Cannabisblüten von anderen Anbietern bezogen?
              </h3>
              <p className="form-section-hint">
                Diese Information wird zur Sicherstellung der medizinischen Versorgung benötigt.
              </p>
              <div className="form-step4-options form-step4-options--fit">
                {yesNoOptions.map((option) => {
                  const isSelected = exceededMonthlyLimit === option.value
                  return (
                    <button
                      key={String(option.value)}
                      type="button"
                      onClick={() => {
                        const newVal = option.value
                        setExceededMonthlyLimit(newVal)
                        onSelectionChange?.({
                          isPregnantOrBreastfeeding,
                          exceededMonthlyLimit: newVal,
                          preExistingConditions,
                        })
                      }}
                      className={`form-option-card form-option-card--row form-option-card--max-width ${isSelected ? 'form-option-card--selected' : ''}`}
                    >
                      <div className="form-option-row__content">
                        <p className="form-option-row__title">{option.title}</p>
                      </div>
                      <span className="form-option-radio form-option-radio--inline">
                        {isSelected && <span className="form-option-radio__inner" />}
                      </span>
                    </button>
                  )
                })}
              </div>
              {exceededMonthlyLimit === true && (
                <p className="form-warning-text" style={{ marginTop: '0.75rem' }}>
                  ⚠️ Hinweis: Das monatliche Limit ist erreicht. Eine erneute Verschreibung über releafZ ist erst im Folgemonat möglich.
                </p>
              )}
            </section>

            <section className="form-step4-section form-step4-section--fit">
              <h3 className="form-section-title">
                Liegen bei dir Vorerkrankungen vor?
              </h3>
              <p className="form-section-hint">
                Mehrfachauswahl möglich. &apos;Keine Vorerkrankungen&apos; deaktiviert andere Optionen.
              </p>
              <div className="form-step4-options form-step4-options--fit">
                {preExistingConditionOptions.map((option) => {
                  const isSelected = preExistingConditions.includes(option.id)
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        let newConditions: string[]
                        if (option.id === 'Keine') {
                          newConditions = preExistingConditions.includes('Keine') ? [] : ['Keine']
                        } else {
                          const withoutKeine = preExistingConditions.filter((x) => x !== 'Keine')
                          newConditions = withoutKeine.includes(option.id)
                            ? withoutKeine.filter((x) => x !== option.id)
                            : [...withoutKeine, option.id]
                        }
                        setPreExistingConditions(newConditions)
                        onSelectionChange?.({
                          isPregnantOrBreastfeeding,
                          exceededMonthlyLimit,
                          preExistingConditions: newConditions,
                        })
                      }}
                      className={`form-option-card form-option-card--row form-option-card--max-width ${isSelected ? 'form-option-card--selected' : ''}`}
                    >
                      <div className="form-option-row__content">
                        <p className="form-option-row__title">{option.title}</p>
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

          <Button
            onClick={handleNext}
            disabled={
              isPregnantOrBreastfeeding === null ||
              exceededMonthlyLimit === null ||
              preExistingConditions.length === 0 ||
              submitting
            }
            className="form-cta btn-secondary form-step4-cta form-cta--step4-fit"
          >
            {submitting ? 'Wird gesendet...' : 'Weiter'}
          </Button>
        </div>
        <StepProgress currentStep={6} totalSteps={8} />
      </div>
    </div>
  )
}
