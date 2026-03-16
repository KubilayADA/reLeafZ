'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Step1 from '@/form/step1'
import Step2 from '@/form/step2'
import Step3 from '@/form/step3'
import Step4 from '@/form/step4'

export default function QuestionnairePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    consultationType: '',
    deliveryMethod: '',
    condition: '',
    onset: '',
    frequency: ''
  })

  const API_BASE = process.env.NEXT_PUBLIC_API_URL

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
      const treatmentData = localStorage.getItem('treatmentRequest')
      if (!treatmentData) {
        router.push('/')
        return
      }
      const treatmentRequest = JSON.parse(treatmentData)
      if (!treatmentRequest?.id) {
        localStorage.removeItem('treatmentRequest')
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
        console.log('✅ Symptoms updated successfully!')
        router.push('/marketplace')
      } else {
        alert(`Fehler: ${result.message || 'Symptome konnten nicht aktualisiert werden'}`)
      }
    } catch (e) {
      localStorage.removeItem('treatmentRequest')
      router.push('/')
      return
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      router.back()
    }
  }

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
    <>
      {currentStep === 1 && (
        <Step1 onNext={handleStep1Next} onBack={handleBack} />
      )}
      {currentStep === 2 && (
        <Step2 onNext={handleStep2Next} onBack={handleBack} />
      )}
      {currentStep === 3 && (
        <Step3 onNext={handleStep3Next} onBack={handleBack} />
      )}
      {currentStep === 4 && (
        <Step4 onNext={handleStep4Next} onBack={handleBack} />
      )}
    </>
  )
}