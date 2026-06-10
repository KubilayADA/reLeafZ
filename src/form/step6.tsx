'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import StepProgress from '@/form/step-progress'
import FormLogoHomeExit from '@/form/form-logo-home-exit'
import FormOptionCheck from '@/form/form-option-check'
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

const DISQUALIFYING_CONDITIONS = [
  'Psychose',
  'Persoenlichkeitsstoerung',
  'THCAllergie',
  'Sucht',
  'Herzkrankheit',
  'LeberNierenkrankheit',
] as const

function getDisqualificationReasons(state: {
  isPregnantOrBreastfeeding: boolean | null
  exceededMonthlyLimit: boolean | null
  preExistingConditions: string[]
}): string[] {
  const reasons: string[] = []
  if (state.isPregnantOrBreastfeeding === true) {
    reasons.push('Schwangerschaft oder Stillzeit')
  }
  if (state.exceededMonthlyLimit === true) {
    reasons.push('Überschreitung des monatlichen Höchstkonsums')
  }
  const hitConditions = state.preExistingConditions.filter((c) =>
    DISQUALIFYING_CONDITIONS.includes(c as (typeof DISQUALIFYING_CONDITIONS)[number])
  )
  if (hitConditions.length > 0) {
    const conditionLabels: Record<string, string> = {
      Psychose: 'Psychose',
      Persoenlichkeitsstoerung: 'Persönlichkeitsstörung',
      THCAllergie: 'THC-Allergie',
      Sucht: 'Suchterkrankung',
      Herzkrankheit: 'Schwere Herzerkrankung',
      LeberNierenkrankheit: 'Schwere Leber- oder Nierenerkrankung',
    }
    hitConditions.forEach((c) => reasons.push(conditionLabels[c] ?? c))
  }
  return reasons
}

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

  const disqualificationReasons = getDisqualificationReasons({
    isPregnantOrBreastfeeding,
    exceededMonthlyLimit,
    preExistingConditions,
  })
  const isDisqualified = disqualificationReasons.length > 0

  const handleNext = () => {
    if (
      isPregnantOrBreastfeeding !== null &&
      exceededMonthlyLimit !== null &&
      preExistingConditions.length > 0 &&
      !isDisqualified
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
                      <FormOptionCheck selected={isSelected} className="form-option-check--inline" />
                    </button>
                  )
                })}
              </div>
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
                      <FormOptionCheck selected={isSelected} className="form-option-check--inline" />
                    </button>
                  )
                })}
              </div>
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
                      <FormOptionCheck selected={isSelected} className="form-option-check--inline" />
                    </button>
                  )
                })}
              </div>
            </section>
          </div>

          {isDisqualified && (
            <div className="bg-red-50 border border-red-200 text-red-900 rounded-lg p-4 my-4">
              <p className="font-bold">⚠️ Keine Cannabis-Therapie möglich</p>
              <p className="mt-2">
                Aufgrund Ihrer Angaben können wir Ihnen leider keine Cannabis-Therapie
                anbieten. Bitte konsultieren Sie Ihre:n behandelnde:n Ärzt:in.
              </p>
              <p className="mt-3 font-semibold">Grund:</p>
              <ul className="mt-1 list-disc list-inside">
                {disqualificationReasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm">
                Bei Fragen erreichen Sie uns unter support@releafz.de
              </p>
            </div>
          )}

          <Button
            onClick={handleNext}
            disabled={
              isPregnantOrBreastfeeding === null ||
              exceededMonthlyLimit === null ||
              preExistingConditions.length === 0 ||
              isDisqualified ||
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
