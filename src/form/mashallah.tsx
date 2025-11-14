'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MapPin, Building2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import '@/app/main.css'

interface MashallahFormProps {
  postcode: string
  onBack: () => void
}

export default function MashallahForm({ postcode, onBack }: MashallahFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
  })
  const [loading, setLoading] = useState(false)
  const API_BASE = process.env.NEXT_PUBLIC_API_URL

  // Validate form fields
  const isFormValid = formData.fullName.trim() !== '' && 
                     formData.email.trim() !== '' && 
                     formData.phone.trim() !== '' && 
                     formData.street.trim() !== '' &&
                     formData.city.trim() !== ''

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Step 1: Create treatment request in PENDING_STRAIN_SELECTION state
      const response = await fetch(`${API_BASE}/api/treatment/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...formData, 
          postcode,
         // status: 'PENDING_STRAIN_SELECTION' // no status here anymıre changing the workflow
        }),
      })

      let result
      try {
        result = await response.json()
      } catch (parseError) {
        console.error('Error parsing response:', parseError)
        // If response parsing fails, still proceed with questionnaire
        result = { data: {} }
      }
      if (response.ok && result.data) {
        // Store pharmacyId separately for marketplace
        if (result.data.pharmacyId) {
          localStorage.setItem('assignedPharmacyId', result.data.pharmacyId.toString())
          console.log('✅ Pharmacy ID stored:', result.data.pharmacyId)
        }
      }
      // Step 2: Store treatment request data in localStorage (even if API fails)
      const treatmentRequestData = {
        id: result.data?.id || `temp-${Date.now()}`,
        patientId: result.data?.patientId || null,
        pharmacyId: result.data?.pharmacyId || null,
        postcode,
        ...formData
      }
      localStorage.setItem('treatmentRequest', JSON.stringify(treatmentRequestData))

      // Step 3: Store postcode in localStorage for back navigation
      localStorage.setItem('formPostcode', postcode)

      if (response.ok && result.data) {
        // Step 4: Check if patient is registered
        // The API may return isRegistered, isNewPatient, or patientExists
        const isRegistered = result.data?.isRegistered === true || 
                            (result.data?.isNewPatient === false && result.data?.isRegistered !== false)
        const isNewPatient = result.data?.isNewPatient === true || 
                            result.data?.isRegistered === false ||
                            result.data?.patientExists === false

        // Step 5: Redirect based on registration status
        // If explicitly registered, go to marketplace; otherwise show questionnaire
        if (isRegistered && !isNewPatient) {
          // Registered patient → go directly to marketplace
          router.push('/marketplace')
        } else {
          // New patient or status unclear → redirect to questionnaire
          router.push('/questionnaire')
        }
      } else {
        // If API call fails, still redirect to questionnaire to allow user to continue
        console.warn('API call failed or returned error, but proceeding to questionnaire:', result.message || 'Unknown error')
        router.push('/questionnaire')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      // Even on error, store data and redirect to questionnaire
      localStorage.setItem('treatmentRequest', JSON.stringify({
        id: `temp-${Date.now()}`,
        patientId: null,
        pharmacyId: null,
        postcode,
        ...formData
      }))
      localStorage.setItem('formPostcode', postcode)
      router.push('/questionnaire')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-beige inconsolata">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            onClick={onBack}
            className="mb-4 btn-outline text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold title-gradient mb-2">
            Medizinische Anfrage
          </h1>
          <p className="text-base sm:text-lg subtitle-text">
            Postleitzahl: <span className="font-semibold text-emerald-600">{postcode}</span>
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium form-label mb-2">
                Vollständiger Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full p-3 sm:p-3.5 border border-gray-300 rounded-lg inconsolata text-base sm:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:bg-gray-100"
                placeholder="Patient Mustermann"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium form-label mb-2">
                E-Mail Adresse
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full p-3 sm:p-3.5 border border-gray-300 rounded-lg inconsolata text-base sm:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:bg-gray-100"
                placeholder="patient@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium form-label mb-2">
                Telefonnummer
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full p-2.5 sm:p-3.5 border border-gray-300 rounded-lg inconsolata text-base sm:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:bg-gray-100"
                placeholder="+49 30 12345678"
              />
            </div>

            <div>
              <label htmlFor="street" className="block text-sm font-medium form-label mb-2">
                Straße + Hausnummer *
              </label>
              <div className="relative">
                {!formData.street && (
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-none transition-opacity duration-200" size={20} />
                )}
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  required
                  disabled={loading}
                className={`w-full pr-3 p-2.5 sm:p-3.5 border border-gray-300 rounded-lg inconsolata text-base sm:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:bg-gray-100 transition-all duration-200 ${
                    formData.street ? 'pl-3' : 'pl-12 sm:pl-16'
                  }`}
                  placeholder="   z.B. Grassstraße 42"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium form-label mb-2">
                  Stadt *
                </label>
                <div className="relative">
                  {!formData.city && (
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10 pointer-events-none transition-opacity duration-200" size={20} />
                  )}
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    className={`w-full pr-3 p-2.5 sm:p-3 border border-gray-300 rounded-lg inconsolata text-base sm:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:bg-gray-100 transition-all duration-200 ${
                    formData.city ? 'pl-3' : 'pl-12 sm:pl-16'
                    }`}
                    placeholder="   Berlin"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="postcode" className="block text-sm font-medium form-label mb-2">
                  PLZ *
                </label>
                <input
                  type="text"
                  id="postcode"
                  name="postcode"
                  value={postcode}
                  disabled
                className="w-full px-3 p-2.5 sm:p-3.5 border border-gray-300 rounded-lg inconsolata text-base sm:text-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                  placeholder={postcode}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full btn-secondary py-3 sm:py-4 text-base sm:text-lg font-bold"
            >
              {loading ? 'Wird verarbeitet...' : 'Anfrage absenden'}
            </Button>
          </form>
        </div>

        {/* Info */}
        <div className="mt-6 sm:mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-emerald-800 mb-2">
            Lieferung in Berlin
          </h3>
          <p className="text-sm sm:text-base text-emerald-700">
            Da Sie in Berlin wohnen, können wir Ihre Medikamente in 30-90 Minuten direkt zu Ihnen liefern lassen.
          </p>
        </div>
      </div>
    </div>
  )
}
