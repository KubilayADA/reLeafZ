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

