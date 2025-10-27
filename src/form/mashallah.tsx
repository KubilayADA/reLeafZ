'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
    symptoms: '',
    city: '',
  })
  const [loading, setLoading] = useState(false)
  const API_BASE = process.env.NEXT_PUBLIC_API_URL

  // Validate form fields
  const isFormValid = formData.fullName.trim() !== '' && 
                     formData.email.trim() !== '' && 
                     formData.phone.trim() !== '' && 
                     formData.symptoms.trim() !== ''

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
          status: 'PENDING_STRAIN_SELECTION' // NEW: Mark as pending strain selection
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Step 2: Store treatment request data in localStorage
        localStorage.setItem('treatmentRequest', JSON.stringify({
          id: result.data.id,
          patientId: result.data.patientId,
          pharmacyId: result.data.pharmacyId,
          postcode,
          ...formData
        }))

        // Step 3: Redirect to marketplace
        router.push('/marketplace')
      } else {
        alert(result.message || 'Submission failed.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('An error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-teal-50 inconsolata">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={onBack}
            variant="outline"
            className="mb-4 inconsolata"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>
          <h1 className="text-4xl font-bold title-gradient mb-2">
            Medizinische Anfrage
          </h1>
          <p className="text-lg subtitle-text">
            Postleitzahl: <span className="font-semibold text-emerald-600">{postcode}</span>
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full p-3 border border-gray-300 rounded-lg inconsolata text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:bg-gray-100"
                placeholder="Max Mustermann"
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
                className="w-full p-3 border border-gray-300 rounded-lg inconsolata text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:bg-gray-100"
                placeholder="max@example.com"
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
                className="w-full p-3 border border-gray-300 rounded-lg inconsolata text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:bg-gray-100"
                placeholder="+49 30 12345678"
              />
            </div>

            <div>
              <label htmlFor="symptoms" className="block text-sm font-medium form-label mb-2">
                Beschreibung Ihrer Symptome
              </label>
              <textarea
                id="symptoms"
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                required
                disabled={loading}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg inconsolata text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none disabled:bg-gray-100"
                placeholder="Bitte beschreiben Sie Ihre Beschwerden und warum Sie eine medizinische Cannabis-Behandlung benötigen..."
              />
            </div>

            <Button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full inconsolata py-4 text-lg ${
                isFormValid && !loading
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold shadow-xl transition-all duration-200 transform hover:scale-[1.02]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed font-medium'
              }`}
            >
              {loading ? 'Wird verarbeitet...' : 'Anfrage absenden'}
            </Button>
          </form>
        </div>

        {/* Info */}
        <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-emerald-800 mb-2">
            Lieferung in Berlin
          </h3>
          <p className="text-emerald-700">
            Da Sie in Berlin wohnen, können wir Ihre Medikamente in 30-90 Minuten direkt zu Ihnen liefern lassen.
          </p>
        </div>
      </div>
    </div>
  )
}