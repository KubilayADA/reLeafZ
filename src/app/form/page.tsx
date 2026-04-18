'use client'

import React, { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import MashallahForm from '@/form/mashallah'

const isValidBerlinPostcode = (postcode: string) => {
  if (!/^\d{5}$/.test(postcode)) return false
  const zip = parseInt(postcode)
  return zip >= 10115 && zip <= 14199
}

// Child component (useSearchParams burada) ⬇
function FormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const postcode = searchParams.get('postcode') || ''
  const street = searchParams.get('street') || ''
  const houseNumber = searchParams.get('houseNumber') || ''
  const city = searchParams.get('city') || ''

  if (!postcode || !isValidBerlinPostcode(postcode)) {
    router.push('/')
    return null
  }

  if (!street.trim() || !houseNumber.trim() || !city.trim()) {
    router.push('/')
    return null
  }

  return (
    <MashallahForm
      postcode={postcode}
      street={street}
      houseNumber={houseNumber}
      city={city}
      onBack={() => router.push('/')}
    />
  )
}

// ⬇Parent component (Suspense wrapper) 
export default function FormPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    }>
      <FormContent />
    </Suspense>
  )
}