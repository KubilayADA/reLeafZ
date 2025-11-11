'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import MashallahForm from '@/form/mashallah'

export default function FormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [postcode, setPostcode] = useState<string>('')

  useEffect(() => {
    const postcodeParam = searchParams.get('postcode')
    if (postcodeParam) {
      setPostcode(postcodeParam)
    } else {
      // If no postcode, redirect to home
      router.push('/')
    }
  }, [searchParams, router])

  const handleBack = () => {
    // Navigate back to home page
    router.push('/')
  }

  if (!postcode) {
    return null // Will redirect in useEffect
  }

  return <MashallahForm postcode={postcode} onBack={handleBack} />
}

// allow to keep track of stores in local storage to lead user then to questionnqire 

// src/app/form/page.tsx renders MashallahForm when a postcode (usually entered on the landing page) is passed as a query string. It’s the transition step between the marketing site and the multi-step questionnaire:
// Validates that a postcode exists; without it, the user is sent back home.
// Passes that postcode to MashallahForm, which collects the patient’s initial data and writes the treatmentRequest into localStorage.
// After submission, MashallahForm decides whether to push the user to /questionnaire (new/unregistered patients) or /marketplace (existing patients).
// Questionnaire flow depends on it to seed localStorage and determine where the user starts.