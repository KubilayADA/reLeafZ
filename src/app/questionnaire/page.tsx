'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Step1 from '@/form/step1'
import Step2 from '@/form/step2'
import Step3 from '@/form/step3'
import Step4 from '@/form/step4'

export default function QuestionnairePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<'step1' | 'step2' | 'step3' | 'step4'>('step1')
  const [selectedConsultation, setSelectedConsultation] = useState<string>('')
  const [selectedDelivery, setSelectedDelivery] = useState<string>('')
  const [selectedCondition, setSelectedCondition] = useState<string>('')
  const [symptomDetails, setSymptomDetails] = useState<{ onset: string; frequency: string } | null>(null)

  const handleStep1Next = (option: string) => {
    setSelectedConsultation(option)
    // Store the selected consultation type
    const treatmentRequest = localStorage.getItem('treatmentRequest')
    if (treatmentRequest) {
      const request = JSON.parse(treatmentRequest)
      request.consultationType = option
      localStorage.setItem('treatmentRequest', JSON.stringify(request))
    }
    
    // If questionnaire is selected, go to step2, otherwise go to marketplace
    if (option === 'questionnaire') {
      setCurrentStep('step2')
    } else {
      // For video or onsite, go directly to marketplace
      router.push('/marketplace')
    }
  }

  const handleStep2Next = (option: string) => {
    setSelectedDelivery(option)
    // Store the selected delivery method
    const treatmentRequest = localStorage.getItem('treatmentRequest')
    if (treatmentRequest) {
      const request = JSON.parse(treatmentRequest)
      request.deliveryMethod = option
      localStorage.setItem('treatmentRequest', JSON.stringify(request))
    }
    
    setCurrentStep('step3')
  }

  const handleStep3Next = (option: string) => {
    setSelectedCondition(option)
    const treatmentRequest = localStorage.getItem('treatmentRequest')
    if (treatmentRequest) {
      const request = JSON.parse(treatmentRequest)
      request.condition = option
      localStorage.setItem('treatmentRequest', JSON.stringify(request))
    }

    setCurrentStep('step4')
  }

  const handleStep4Next = (answers: { onset: string; frequency: string }) => {
    setSymptomDetails(answers)
    const treatmentRequest = localStorage.getItem('treatmentRequest')
    if (treatmentRequest) {
      const request = JSON.parse(treatmentRequest)
      request.symptomOnset = answers.onset
      request.symptomFrequency = answers.frequency
      localStorage.setItem('treatmentRequest', JSON.stringify(request))
    }

    router.push('/marketplace')
  }

  const handleStep2Back = () => {
    setCurrentStep('step1')
  }

  const handleStep3Back = () => {
    setCurrentStep('step2')
  }

  const handleStep4Back = () => {
    setCurrentStep('step3')
  }

  const handleStep1Back = () => {
    // Get postcode from localStorage to navigate back to form
    const postcode = localStorage.getItem('formPostcode')
    if (postcode) {
      // Navigate back to form page with postcode
      router.push(`/form?postcode=${postcode}`)
    } else {
      // Fallback: go to home page
      router.push('/')
    }
  }

  if (currentStep === 'step2') {
    return <Step2 onNext={handleStep2Next} onBack={handleStep2Back} />
  }

  if (currentStep === 'step3') {
    return <Step3 onNext={handleStep3Next} onBack={handleStep3Back} />
  }

  if (currentStep === 'step4') {
    return <Step4 onNext={handleStep4Next} onBack={handleStep4Back} />
  }

  return (
    <Step1 onNext={handleStep1Next} onBack={handleStep1Back} />
  )
}

