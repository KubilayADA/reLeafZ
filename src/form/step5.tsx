'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import StepProgress from '@/form/step-progress'
import FormLogoHomeExit from '@/form/form-logo-home-exit'
import FormOptionCheck from '@/form/form-option-check'
import '@/form/form.css'

interface Step5Props {
  onNext: (answers: {
    hasSeenDoctor: boolean
    treatmentLocations: string[]
    hasTakenMedication: boolean
    medicationDetails: string
    nonMedicalTherapies: string[]
  }) => void
  onBack?: () => void
  initialHasSeenDoctor?: boolean | null
  initialTreatmentLocations?: string[]
  initialHasTakenMedication?: boolean | null
  initialMedicationDetails?: string
  initialNonMedicalTherapies?: string[]
  onSelectionChange?: (answers: {
    hasSeenDoctor: boolean | null
    treatmentLocations: string[]
    hasTakenMedication: boolean | null
    medicationDetails: string
    nonMedicalTherapies: string[]
  }) => void
  submitting?: boolean
}

const seenDoctorOptions: Array<{ value: boolean; title: string }> = [
  { value: true, title: 'Ja, ich war beim Arzt' },
  { value: false, title: 'Nein, noch nicht' },
]

const medicationOptions: Array<{ value: boolean; title: string }> = [
  { value: true, title: 'Ja' },
  { value: false, title: 'Nein' },
]

const treatmentLocationOptions = [
  { id: 'Hausarzt', title: 'Hausarzt' },
  { id: 'Facharztpraxis', title: 'Facharztpraxis' },
  { id: 'Krankenhaus', title: 'Krankenhaus' },
  { id: 'Psychologe', title: 'Psychologe' },
  { id: 'Heilpraktiker', title: 'Heilpraktiker' },
  { id: 'Eigentherapie', title: 'Eigentherapie' },
]

const nonMedicalTherapyOptions = [
  { id: 'Physiotherapie', title: 'Physiotherapie' },
  { id: 'Kur', title: 'Kur' },
  { id: 'Massagen', title: 'Massagen' },
  { id: 'Meditation', title: 'Meditation' },
  { id: 'Sonstige', title: 'Sonstige' },
  { id: 'Keine', title: 'Keine' },
]

export default function Step5({
  onNext,
  onBack,
  initialHasSeenDoctor = null,
  initialTreatmentLocations = [],
  initialHasTakenMedication = null,
  initialMedicationDetails = '',
  initialNonMedicalTherapies = [],
  onSelectionChange,
  submitting = false,
}: Step5Props) {
  const [hasSeenDoctor, setHasSeenDoctor] = useState<boolean | null>(initialHasSeenDoctor)
  const [treatmentLocations, setTreatmentLocations] = useState<string[]>(initialTreatmentLocations)
  const [hasTakenMedication, setHasTakenMedication] = useState<boolean | null>(initialHasTakenMedication)
  const [medicationDetails, setMedicationDetails] = useState<string>(initialMedicationDetails)
  const [nonMedicalTherapies, setNonMedicalTherapies] = useState<string[]>(initialNonMedicalTherapies)

  useEffect(() => {
    setHasSeenDoctor(initialHasSeenDoctor)
  }, [initialHasSeenDoctor])

  useEffect(() => {
    setTreatmentLocations(initialTreatmentLocations)
  }, [initialTreatmentLocations])

  useEffect(() => {
    setHasTakenMedication(initialHasTakenMedication)
  }, [initialHasTakenMedication])

  useEffect(() => {
    setMedicationDetails(initialMedicationDetails)
  }, [initialMedicationDetails])

  useEffect(() => {
    setNonMedicalTherapies(initialNonMedicalTherapies)
  }, [initialNonMedicalTherapies])

  const showTreatmentLocationsWarning =
    hasSeenDoctor === true && treatmentLocations.length === 0
  const showMedicationDetailsWarning =
    hasTakenMedication === true && medicationDetails.trim().length < 3

  const handleNext = () => {
    if (
      hasSeenDoctor !== null &&
      hasTakenMedication !== null &&
      nonMedicalTherapies.length > 0 &&
      !showTreatmentLocationsWarning &&
      !showMedicationDetailsWarning
    ) {
      onNext({
        hasSeenDoctor,
        treatmentLocations,
        hasTakenMedication,
        medicationDetails: medicationDetails.trim(),
        nonMedicalTherapies,
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
            Vorherige Behandlung
          </h2>

          <div className="form-step4-sections form-step4-sections--fit">
            <section className="form-step4-section form-step4-section--fit">
              <h3 className="form-section-title">
                Warst du wegen deiner Beschwerden bereits bei einem Arzt?
              </h3>
              <p className="form-section-hint">
                Bitte wähle eine Antwort.
              </p>
              <div className="form-step4-options form-step4-options--fit">
                {seenDoctorOptions.map((option) => {
                  const isSelected = hasSeenDoctor === option.value
                  return (
                    <button
                      key={String(option.value)}
                      type="button"
                      onClick={() => {
                        const newVal = option.value
                        const newLocations = newVal ? treatmentLocations : []
                        setHasSeenDoctor(newVal)
                        if (!newVal) setTreatmentLocations([])
                        onSelectionChange?.({
                          hasSeenDoctor: newVal,
                          treatmentLocations: newLocations,
                          hasTakenMedication,
                          medicationDetails,
                          nonMedicalTherapies,
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

            {hasSeenDoctor === true && (
              <section className="form-step4-section form-step4-section--fit">
                <h3 className="form-section-title">
                  Wo wurdest du bisher behandelt?
                </h3>
                <p className="form-section-hint">
                  Mehrfachauswahl möglich.
                </p>
                <div className="form-step4-options form-step4-options--fit">
                  {treatmentLocationOptions.map((option) => {
                    const isSelected = treatmentLocations.includes(option.id)
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          const newLocations = isSelected
                            ? treatmentLocations.filter((x) => x !== option.id)
                            : [...treatmentLocations, option.id]
                          setTreatmentLocations(newLocations)
                          onSelectionChange?.({
                            hasSeenDoctor,
                            treatmentLocations: newLocations,
                            hasTakenMedication,
                            medicationDetails,
                            nonMedicalTherapies,
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
                {showTreatmentLocationsWarning && (
                  <p className="text-sm text-amber-700" style={{ marginTop: '0.75rem' }}>
                    Bitte wählen Sie mindestens eine behandelnde Stelle aus.
                  </p>
                )}
              </section>
            )}

            <section className="form-step4-section form-step4-section--fit">
              <h3 className="form-section-title">
                Hast du bereits Medikamente gegen deine Beschwerden eingenommen?
              </h3>
              <p className="form-section-hint">
                Bitte wähle eine Antwort.
              </p>
              <div className="form-step4-options form-step4-options--fit">
                {medicationOptions.map((option) => {
                  const isSelected = hasTakenMedication === option.value
                  return (
                    <button
                      key={String(option.value)}
                      type="button"
                      onClick={() => {
                        const newVal = option.value
                        const newDetails = newVal ? medicationDetails : ''
                        setHasTakenMedication(newVal)
                        if (!newVal) setMedicationDetails('')
                        onSelectionChange?.({
                          hasSeenDoctor,
                          treatmentLocations,
                          hasTakenMedication: newVal,
                          medicationDetails: newDetails,
                          nonMedicalTherapies,
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

            {hasTakenMedication === true && (
              <section className="form-step4-section form-step4-section--fit">
                <h3 className="form-section-title">
                  Welche Medikamente hast du eingenommen?
                </h3>
                <p className="form-section-hint">
                  Optional. Name, Dosis, Dauer.
                </p>
                <textarea
                  value={medicationDetails}
                  onChange={(e) => {
                    const next = e.target.value.slice(0, 2000)
                    setMedicationDetails(next)
                    onSelectionChange?.({
                      hasSeenDoctor,
                      treatmentLocations,
                      hasTakenMedication,
                      medicationDetails: next,
                      nonMedicalTherapies,
                    })
                  }}
                  placeholder="z.B. Ibuprofen 600mg, 3x täglich, 6 Wochen"
                  maxLength={2000}
                  rows={4}
                  disabled={submitting}
                  className="form-input form-textarea inconsolata"
                  style={{ width: '100%', resize: 'vertical', minHeight: '6rem', padding: '0.75rem', borderRadius: '0.5rem' }}
                />
                <p className="form-section-hint" style={{ textAlign: 'right', marginTop: '0.25rem', fontSize: '0.75rem' }}>
                  {medicationDetails.length}/2000
                </p>
                {showMedicationDetailsWarning && (
                  <p className="text-sm text-amber-700" style={{ marginTop: '0.75rem' }}>
                    Bitte geben Sie die eingenommenen Medikamente an (mind. 3 Zeichen).
                  </p>
                )}
              </section>
            )}

            <section className="form-step4-section form-step4-section--fit">
              <h3 className="form-section-title">
                Hast du nicht-medikamentöse Therapien versucht?
              </h3>
              <p className="form-section-hint">
                Mehrfachauswahl möglich. &apos;Keine&apos; deaktiviert andere Optionen.
              </p>
              <div className="form-step4-options form-step4-options--fit">
                {nonMedicalTherapyOptions.map((option) => {
                  const isSelected = nonMedicalTherapies.includes(option.id)
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        let newTherapies: string[]
                        if (option.id === 'Keine') {
                          newTherapies = nonMedicalTherapies.includes('Keine') ? [] : ['Keine']
                        } else {
                          const withoutKeine = nonMedicalTherapies.filter((x) => x !== 'Keine')
                          newTherapies = withoutKeine.includes(option.id)
                            ? withoutKeine.filter((x) => x !== option.id)
                            : [...withoutKeine, option.id]
                        }
                        setNonMedicalTherapies(newTherapies)
                        onSelectionChange?.({
                          hasSeenDoctor,
                          treatmentLocations,
                          hasTakenMedication,
                          medicationDetails,
                          nonMedicalTherapies: newTherapies,
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
              hasSeenDoctor === null ||
              hasTakenMedication === null ||
              nonMedicalTherapies.length === 0 ||
              showTreatmentLocationsWarning ||
              showMedicationDetailsWarning ||
              submitting
            }
            className="form-cta btn-secondary form-step4-cta form-cta--step4-fit"
          >
            {submitting ? 'Wird gesendet...' : 'Weiter'}
          </Button>
        </div>
        <StepProgress currentStep={5} totalSteps={8} />
      </div>
    </div>
  )
}
