'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Step1 from '@/form/step1'
import Step2 from '@/form/step2'
import Step3 from '@/form/step3'
import Step4 from '@/form/step4'
import Step5 from '@/form/step5'
import Step6 from '@/form/step6'
import Step7 from '@/form/step7'
import Step8 from '@/form/step8'
import { API_BASE } from '@/lib/api'

const QUESTIONNAIRE_DRAFT_KEY = 'questionnaireDraft'

type QuestionnaireFormData = {
  consultationType: string
  deliveryMethod: string
  condition: string
  onset: string
  frequency: string
  severity: string
  diagnosisText: string
  hasSeenDoctor: boolean | null
  treatmentLocations: string[]
  hasTakenMedication: boolean | null
  medicationDetails: string
  nonMedicalTherapies: string[]
  isPregnantOrBreastfeeding: boolean | null
  exceededMonthlyLimit: boolean | null
  preExistingConditions: string[]
  previousCannabisExperience: boolean | null
  hadSideEffects: boolean | null
  treatmentExpectations: string[]
}

type QuestionnaireDraft = {
  currentStep: number
  formData: QuestionnaireFormData
}

export default function QuestionnairePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [renderedStep, setRenderedStep] = useState(1)
  const [isStepVisible, setIsStepVisible] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    consultationType: '',
    deliveryMethod: '',
    condition: '',
    onset: '',
    frequency: '',
    severity: '',
    diagnosisText: '',
    hasSeenDoctor: null as boolean | null,
    treatmentLocations: [] as string[],
    hasTakenMedication: null as boolean | null,
    medicationDetails: '',
    nonMedicalTherapies: [] as string[],
    isPregnantOrBreastfeeding: null as boolean | null,
    exceededMonthlyLimit: null as boolean | null,
    preExistingConditions: [] as string[],
    previousCannabisExperience: null as boolean | null,
    hadSideEffects: null as boolean | null,
    treatmentExpectations: [] as string[],
  })
  const [hasHydratedDraft, setHasHydratedDraft] = useState(false)

  useEffect(() => {
    try {
      const rawDraft = localStorage.getItem(QUESTIONNAIRE_DRAFT_KEY)
      if (!rawDraft) {
        setHasHydratedDraft(true)
        return
      }

      const draft = JSON.parse(rawDraft) as QuestionnaireDraft
      if (!draft || typeof draft !== 'object') {
        setHasHydratedDraft(true)
        return
      }

      const draftStep =
        typeof draft.currentStep === 'number' && draft.currentStep >= 1 && draft.currentStep <= 8
          ? draft.currentStep
          : 1

      const draftForm = draft.formData ?? {}
      const migrateDeliveryMethod = (value: unknown): string => {
        if (typeof value !== 'string') return ''
        if (value === 'courier') return 'BOTENDIENST'
        if (value === 'shipping') return 'PICKUP'
        return value
      }
      setFormData({
        consultationType: typeof draftForm.consultationType === 'string' ? draftForm.consultationType : '',
        deliveryMethod: migrateDeliveryMethod(draftForm.deliveryMethod),
        condition: typeof draftForm.condition === 'string' ? draftForm.condition : '',
        onset: typeof draftForm.onset === 'string' ? draftForm.onset : '',
        frequency: typeof draftForm.frequency === 'string' ? draftForm.frequency : '',
        severity: typeof draftForm.severity === 'string' ? draftForm.severity : '',
        diagnosisText: typeof draftForm.diagnosisText === 'string' ? draftForm.diagnosisText : '',
        hasSeenDoctor: typeof draftForm.hasSeenDoctor === 'boolean' ? draftForm.hasSeenDoctor : null,
        treatmentLocations: Array.isArray(draftForm.treatmentLocations) ? draftForm.treatmentLocations : [],
        hasTakenMedication: typeof draftForm.hasTakenMedication === 'boolean' ? draftForm.hasTakenMedication : null,
        medicationDetails: typeof draftForm.medicationDetails === 'string' ? draftForm.medicationDetails : '',
        nonMedicalTherapies: Array.isArray(draftForm.nonMedicalTherapies) ? draftForm.nonMedicalTherapies : [],
        isPregnantOrBreastfeeding: typeof draftForm.isPregnantOrBreastfeeding === 'boolean' ? draftForm.isPregnantOrBreastfeeding : null,
        exceededMonthlyLimit: typeof draftForm.exceededMonthlyLimit === 'boolean' ? draftForm.exceededMonthlyLimit : null,
        preExistingConditions: Array.isArray(draftForm.preExistingConditions) ? draftForm.preExistingConditions : [],
        previousCannabisExperience: typeof draftForm.previousCannabisExperience === 'boolean' ? draftForm.previousCannabisExperience : null,
        hadSideEffects: typeof draftForm.hadSideEffects === 'boolean' ? draftForm.hadSideEffects : null,
        treatmentExpectations: Array.isArray(draftForm.treatmentExpectations) ? draftForm.treatmentExpectations : [],
      })
      setCurrentStep(draftStep)
      setRenderedStep(draftStep)
    } catch {
      // Ignore corrupted storage and start fresh.
    } finally {
      setHasHydratedDraft(true)
    }
  }, [])

  useEffect(() => {
    if (!hasHydratedDraft) return
    const draft: QuestionnaireDraft = { currentStep, formData }
    localStorage.setItem(QUESTIONNAIRE_DRAFT_KEY, JSON.stringify(draft))
  }, [currentStep, formData, hasHydratedDraft])

  // Step1: Consultation type
  const handleStep1Next = (consultationType: string) => {
    setFormData(prev => ({ ...prev, consultationType }))
    setCurrentStep(2)
  }

  // Step2: Delivery method
  const handleStep2Next = (deliveryMethod: string) => {
    setFormData(prev => ({ ...prev, deliveryMethod }))
    setCurrentStep(3)
  }

  // Step3: Condition
  const handleStep3Next = (condition: string) => {
    setFormData(prev => ({ ...prev, condition }))
    setCurrentStep(4)
  }

  // Step4: Collect symptoms, advance to Step 5
  const handleStep4Next = (answers: { onset: string; frequency: string; severity: string; diagnosisText: string }) => {
    setFormData(prev => ({
      ...prev,
      onset: answers.onset,
      frequency: answers.frequency,
      severity: answers.severity,
      diagnosisText: answers.diagnosisText,
    }))
    setCurrentStep(5)
  }

  // Step5: Collect previous treatment history
  const handleStep5Next = (answers: {
    hasSeenDoctor: boolean
    treatmentLocations: string[]
    hasTakenMedication: boolean
    medicationDetails: string
    nonMedicalTherapies: string[]
  }) => {
    setFormData(prev => ({
      ...prev,
      hasSeenDoctor: answers.hasSeenDoctor,
      treatmentLocations: answers.treatmentLocations,
      hasTakenMedication: answers.hasTakenMedication,
      medicationDetails: answers.medicationDetails,
      nonMedicalTherapies: answers.nonMedicalTherapies,
    }))
    setCurrentStep(6)
  }

  // Step6: Collect exclusion criteria
  const handleStep6Next = (answers: {
    isPregnantOrBreastfeeding: boolean
    exceededMonthlyLimit: boolean
    preExistingConditions: string[]
  }) => {
    setFormData(prev => ({
      ...prev,
      isPregnantOrBreastfeeding: answers.isPregnantOrBreastfeeding,
      exceededMonthlyLimit: answers.exceededMonthlyLimit,
      preExistingConditions: answers.preExistingConditions,
    }))
    setCurrentStep(7)
  }

  // Step7: Collect cannabis experience
  const handleStep7Next = (answers: {
    previousCannabisExperience: boolean
    hadSideEffects: boolean | null
    treatmentExpectations: string[]
  }) => {
    setFormData(prev => ({
      ...prev,
      previousCannabisExperience: answers.previousCannabisExperience,
      hadSideEffects: answers.hadSideEffects,
      treatmentExpectations: answers.treatmentExpectations,
    }))
    setCurrentStep(8)
  }

  // Step8: FINAL — Send complete formData to backend
  const handleStep8Submit = async () => {
    setLoading(true)
    try {
      const treatmentData = sessionStorage.getItem('treatmentRequest')
      if (!treatmentData) {
        localStorage.removeItem(QUESTIONNAIRE_DRAFT_KEY)
        router.push('/')
        return
      }
      const treatmentRequest = JSON.parse(treatmentData)
      if (!treatmentRequest?.id) {
        sessionStorage.removeItem('treatmentRequest')
        localStorage.removeItem(QUESTIONNAIRE_DRAFT_KEY)
        router.push('/')
        return
      }
      const response = await fetch(`${API_BASE}/api/treatment/${treatmentRequest.id}/symptoms`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        localStorage.removeItem(QUESTIONNAIRE_DRAFT_KEY)
        router.push('/marketplace')
      } else {
        alert(`Fehler: ${result.message || 'Symptome konnten nicht aktualisiert werden'}`)
      }
    } catch (e) {
      sessionStorage.removeItem('treatmentRequest')
      localStorage.removeItem(QUESTIONNAIRE_DRAFT_KEY)
      router.push('/')
      return
    } finally {
      setLoading(false)
    }
  }

  const handleEditStep = (stepNumber: number) => {
    setCurrentStep(stepNumber)
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    } else {
      localStorage.removeItem(QUESTIONNAIRE_DRAFT_KEY)
      router.back()
    }
  }

  useEffect(() => {
    if (currentStep === renderedStep) return

    setIsStepVisible(false)
    const transitionTimer = window.setTimeout(() => {
      setRenderedStep(currentStep)
      setIsStepVisible(true)
    }, 140)

    return () => window.clearTimeout(transitionTimer)
  }, [currentStep, renderedStep])

  if (loading) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-700 font-semibold">Symptome werden aktualisiert...</p>
          <p className="text-sm text-gray-500 mt-2">Einen Moment bitte</p>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        opacity: isStepVisible ? 1 : 0,
        transform: isStepVisible ? 'translateY(0px)' : 'translateY(8px)',
        transition: 'opacity 180ms ease, transform 220ms ease',
      }}
    >
      {renderedStep === 1 && (
        <Step1
          onNext={handleStep1Next}
          onBack={handleBack}
          initialValue={formData.consultationType}
          onSelectionChange={(consultationType) => setFormData((prev) => ({ ...prev, consultationType }))}
        />
      )}
      {renderedStep === 2 && (
        <Step2
          onNext={handleStep2Next}
          onBack={handleBack}
          initialValue={formData.deliveryMethod}
          onSelectionChange={(deliveryMethod) => setFormData((prev) => ({ ...prev, deliveryMethod }))}
        />
      )}
      {renderedStep === 3 && (
        <Step3
          onNext={handleStep3Next}
          onBack={handleBack}
          initialValue={formData.condition}
          onSelectionChange={(condition) => setFormData((prev) => ({ ...prev, condition }))}
        />
      )}
      {renderedStep === 4 && (
        <Step4
          onNext={handleStep4Next}
          onBack={handleBack}
          initialOnsetValue={formData.onset}
          initialFrequencyValue={formData.frequency}
          initialSeverityValue={formData.severity}
          initialDiagnosisTextValue={formData.diagnosisText}
          onSelectionChange={({ onset, frequency, severity, diagnosisText }) =>
            setFormData((prev) => ({ ...prev, onset, frequency, severity, diagnosisText }))
          }
        />
      )}
      {renderedStep === 5 && (
        <Step5
          onNext={handleStep5Next}
          onBack={handleBack}
          initialHasSeenDoctor={formData.hasSeenDoctor}
          initialTreatmentLocations={formData.treatmentLocations}
          initialHasTakenMedication={formData.hasTakenMedication}
          initialMedicationDetails={formData.medicationDetails}
          initialNonMedicalTherapies={formData.nonMedicalTherapies}
          onSelectionChange={({ hasSeenDoctor, treatmentLocations, hasTakenMedication, medicationDetails, nonMedicalTherapies }) =>
            setFormData((prev) => ({ ...prev, hasSeenDoctor, treatmentLocations, hasTakenMedication, medicationDetails, nonMedicalTherapies }))
          }
        />
      )}
      {renderedStep === 6 && (
        <Step6
          onNext={handleStep6Next}
          onBack={handleBack}
          initialIsPregnantOrBreastfeeding={formData.isPregnantOrBreastfeeding}
          initialExceededMonthlyLimit={formData.exceededMonthlyLimit}
          initialPreExistingConditions={formData.preExistingConditions}
          onSelectionChange={({ isPregnantOrBreastfeeding, exceededMonthlyLimit, preExistingConditions }) =>
            setFormData((prev) => ({ ...prev, isPregnantOrBreastfeeding, exceededMonthlyLimit, preExistingConditions }))
          }
        />
      )}
      {renderedStep === 7 && (
        <Step7
          onNext={handleStep7Next}
          onBack={handleBack}
          initialPreviousCannabisExperience={formData.previousCannabisExperience}
          initialHadSideEffects={formData.hadSideEffects}
          initialTreatmentExpectations={formData.treatmentExpectations}
          onSelectionChange={({ previousCannabisExperience, hadSideEffects, treatmentExpectations }) =>
            setFormData((prev) => ({ ...prev, previousCannabisExperience, hadSideEffects, treatmentExpectations }))
          }
        />
      )}
      {renderedStep === 8 && (
        <Step8
          formData={formData}
          onSubmit={handleStep8Submit}
          onBack={handleBack}
          onEditStep={handleEditStep}
          submitting={loading}
        />
      )}
    </div>
  )
}