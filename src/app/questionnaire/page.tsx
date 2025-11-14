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
import Step7Ja from '@/form/step7-ja'
import Step8 from '@/form/step8'

export default function QuestionnairePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    consultationType: '',
    deliveryMethod: '',
    condition: '',
    onset: '',
    frequency: '',
    diagnosed: '',
    cannabisHistory: '',
    germanyPrescription: '',
  })

  const API_BASE = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => { // Scroll to top of page when changing steps
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }, [currentStep])

  // Step1: Consultation type
  const handleStep1Next = (consultationType: string) => {
    console.log('✅ Step1 completed:', consultationType)
    setFormData(prev => ({ ...prev, consultationType }))
    setCurrentStep(2)
  }

  // Step2: Delivery method
  const handleStep2Next = (deliveryMethod: string) => {
    console.log('✅ Step2 completed:', deliveryMethod)
    setFormData(prev => ({ ...prev, deliveryMethod }))
    setCurrentStep(3)
  }

  // Step3: Condition
  const handleStep3Next = (condition: string) => {
    console.log('✅ Step3 completed:', condition)
    setFormData(prev => ({ ...prev, condition }))
    setCurrentStep(4)
  }

  // Step4: Symptoms detail
  const handleStep4Next = (answers: { onset: string; frequency: string }) => {
    console.log('✅ Step4 completed:', answers)
    setFormData(prev => ({ ...prev, onset: answers.onset, frequency: answers.frequency }))
    setCurrentStep(5)
  }

  // Step5: Cannabis diagnosis
  const handleStep5Next = (diagnosed: 'yes' | 'no') => {
    console.log('✅ Step5 completed:', diagnosed)
    setFormData(prev => ({ ...prev, diagnosed }))
    setCurrentStep(6)
  }

  // Step6: Cannabis treatment history
  const handleStep6Next = (cannabisHistory: 'yes' | 'no') => {
    console.log('✅ Step6 completed:', cannabisHistory)
    setFormData(prev => ({ ...prev, cannabisHistory }))
    setCurrentStep(7)
  }

  // Step7: FINAL - backend submission
  const handleStep7Next = (germanyPrescription: 'yes' | 'no') => {
    console.log('✅ Step7 completed:', germanyPrescription)
    setFormData(prev => ({ ...prev, germanyPrescription }))
    if (germanyPrescription === 'yes') {
      setCurrentStep(8)
    } else {
      setCurrentStep(9)
    }
  }

  const handleStep7JaNext = (positiveEffect: string) => {
    console.log('✅ Step7-Ja completed:', positiveEffect)
    setFormData(prev => ({ ...prev, positiveEffect }))
    setCurrentStep(9)
  }

  const handleStep8Next = (payload: { marketingOptIn: boolean }) => {
    submitToBackend({ ...formData, ...payload })
  }

  const submitToBackend = async (payload: Record<string, unknown>) => {
    setLoading(true)

    try {
      const treatmentData = localStorage.getItem('treatmentRequest')
      if (!treatmentData) {
        alert('Behandlungsanfrage nicht gefunden. Bitte beginnen Sie von vorne.')
        router.push('/')
        return
      }

      const treatmentRequest = JSON.parse(treatmentData)
      console.log('📤 Sending symptoms for treatment request ID:', treatmentRequest.id)
      console.log('📦 Complete data:', payload)

      const response = await fetch(`${API_BASE}/api/treatment/${treatmentRequest.id}/symptoms`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()

      if (response.ok) {
        console.log('✅ Symptoms updated successfully!')
        console.log('Backend response:', result)
        router.push('/marketplace')
      } else {
        console.error('❌ Failed to update symptoms:', result)
        alert(`Fehler: ${result.message || 'Symptome konnten nicht aktualisiert werden'}`)
      }
    } catch (error) {
      console.error('❌ Error updating symptoms:', error)
      alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
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
      {currentStep === 5 && (
        <Step5 onNext={handleStep5Next} onBack={handleBack} />
      )}
      {currentStep === 6 && (
        <Step6 onNext={handleStep6Next} onBack={handleBack} />
      )}
      {currentStep === 7 && (
        <Step7 onNext={handleStep7Next} onBack={handleBack} />
      )}
      {currentStep === 8 && (
        <Step7Ja onNext={handleStep7JaNext} onBack={handleBack} />
      )}
      {currentStep === 9 && (
        <Step8 onNext={handleStep8Next} onBack={handleBack} />
      )}
    </>
  )
}