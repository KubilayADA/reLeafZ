'use client'

import React, { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import MashallahForm from '@/form/mashallah'
import { isLocalAccessBypassEnabled } from '@/lib/devAccess'
import { navigateHomeHard } from '@/lib/navigateHome'

const isValidBerlinPostcode = (postcode: string) => {
  if (!/^\d{5}$/.test(postcode)) return false
  const zip = parseInt(postcode)
  return zip >= 10115 && zip <= 14199
}

// Child component (useSearchParams burada) ⬇
function FormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  /* LOCAL ACCESS BYPASS BLOCK START (remove with matching END block) */
  const canBypassAccess = isLocalAccessBypassEnabled()
  const postcode = searchParams.get('postcode') || (canBypassAccess ? '10115' : '')
  const street = searchParams.get('street') || (canBypassAccess ? 'Teststrasse' : '')
  const houseNumber = searchParams.get('houseNumber') || (canBypassAccess ? '1' : '')
  const city = searchParams.get('city') || (canBypassAccess ? 'Berlin' : '')
  /* LOCAL ACCESS BYPASS BLOCK END */

  /* LOCAL ACCESS BYPASS BLOCK START (postcode validation bypass) */
  if (!postcode || (!canBypassAccess && !isValidBerlinPostcode(postcode))) {
    router.push('/')
    return null
  }
  /* LOCAL ACCESS BYPASS BLOCK END */

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
      onBack={() => navigateHomeHard()}
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