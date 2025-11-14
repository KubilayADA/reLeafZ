'use client'

import React, { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import MashallahForm from '@/form/mashallah'

// Child component (useSearchParams burada) ⬇
function FormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const postcode = searchParams.get('postcode') || ''

  if (!postcode) {
    router.push('/')
    return null
  }

  return <MashallahForm postcode={postcode} onBack={() => router.push('/')} />
}

 
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

