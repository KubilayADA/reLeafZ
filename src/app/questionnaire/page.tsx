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
  const [selectedPreviousPrescription, setSelectedPreviousPrescription] = useState<string>('')

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
      // Check if option includes pharmacy email (for prescription-only)
      if (option.includes(':')) {
        const [deliveryMethod, pharmacyEmail] = option.split(':')
        request.deliveryMethod = deliveryMethod
        request.pharmacyEmail = pharmacyEmail
      } else {
        request.deliveryMethod = option
      }
      localStorage.setItem('treatmentRequest', JSON.stringify(request))
    }
    
    // Check if courier or shipping is selected - if so, go to step3
    const deliveryMethod = option.includes(':') ? option.split(':')[0] : option
    if (deliveryMethod === 'courier' || deliveryMethod === 'shipping') {
      setCurrentStep('step3')
    } else {
      // For prescription-only, go directly to marketplace
      router.push('/marketplace')
    }
  }

  const handleStep3Next = (option: string) => {
    setSelectedPreviousPrescription(option)
    // Store the previous prescription answer
    const treatmentRequest = localStorage.getItem('treatmentRequest')
    if (treatmentRequest) {
      const request = JSON.parse(treatmentRequest)
      request.previousPrescription = option
      localStorage.setItem('treatmentRequest', JSON.stringify(request))
    }
    
    // If "no" is selected, go to step4 (agreements page)
    // If "yes" is selected and user is logged in, go to marketplace
    if (option === 'no') {
      setCurrentStep('step4')
    } else {
      // For "yes" (user already logged in), go to marketplace
      router.push('/marketplace')
    }
  }

  const handleStep4Next = () => {
    // Store agreements acceptance
    const treatmentRequest = localStorage.getItem('treatmentRequest')
    if (treatmentRequest) {
      const request = JSON.parse(treatmentRequest)
      request.agreementsAccepted = true
      localStorage.setItem('treatmentRequest', JSON.stringify(request))
    }
    
    // Redirect to marketplace after step4
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

