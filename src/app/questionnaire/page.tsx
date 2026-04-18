'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Step1 from '@/form/step1'
import Step2 from '@/form/step2'
import Step3 from '@/form/step3'
import Step4 from '@/form/step4'
import { API_BASE } from '@/lib/api'

const QUESTIONNAIRE_DRAFT_KEY = 'questionnaireDraft'

type QuestionnaireFormData = {
  consultationType: string
  deliveryMethod: string
  condition: string
  onset: string
  frequency: string
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
    frequency: ''
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
        typeof draft.currentStep === 'number' && draft.currentStep >= 1 && draft.currentStep <= 4
          ? draft.currentStep
          : 1

      const draftForm = draft.formData ?? {}
      setFormData({
        consultationType: typeof draftForm.consultationType === 'string' ? draftForm.consultationType : '',
        deliveryMethod: typeof draftForm.deliveryMethod === 'string' ? draftForm.deliveryMethod : '',
        condition: typeof draftForm.condition === 'string' ? draftForm.condition : '',
        onset: typeof draftForm.onset === 'string' ? draftForm.onset : '',
        frequency: typeof draftForm.frequency === 'string' ? draftForm.frequency : '',
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

  // Step4: FINAL - Send to backend!
  const handleStep4Next = async (answers: { onset: string; frequency: string }) => {
    const completeData = {
      ...formData,
      onset: answers.onset,
      frequency: answers.frequency
    }
    setFormData(completeData)
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
        body: JSON.stringify(completeData),
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
          onSelectionChange={({ onset, frequency }) => setFormData((prev) => ({ ...prev, onset, frequency }))}
        />
      )}
    </div>
  )
}