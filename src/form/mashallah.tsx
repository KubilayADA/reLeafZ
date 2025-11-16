'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowLeft, MapPin, Building2, Mail, Lock, CheckCircle2, X } from 'lucide-react'
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
  const [otpModalOpen, setOtpModalOpen] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpError, setOtpError] = useState('')
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [showWelcomeNotification, setShowWelcomeNotification] = useState(false)
  
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  // Validate form fields
  const isFormValid = formData.fullName.trim() !== '' && 
                     formData.email.trim() !== '' && 
                     formData.phone.trim() !== '' && 
                     formData.street.trim() !== '' &&
                     formData.city.trim() !== ''

                     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                      const { name, value } = e.target
                      
                      // 🔒 SECURITY: Clear authentication tokens when email changes
                      // This prevents using old tokens with new email addresses
                      if (name === 'email') {
                        console.log('🧹 Clearing tokens due to email change')
                        localStorage.removeItem('token')
                        localStorage.removeItem('treatmentRequest')
                        localStorage.removeItem('assignedPharmacyId')
                        // Reset OTP modal state if it was open
                        setOtpModalOpen(false)
                        setOtpCode('')
                        setOtpError('')
                      }
                      
                      setFormData(prev => ({ ...prev, [name]: value }))
                    }

  // Handle OTP input - only allow 6 digits
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '') // Only digits
    if (value.length <= 6) {
      setOtpCode(value)
      setOtpError('')
    }
  }

  // Verify OTP code
  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      setOtpError('Bitte geben Sie einen 6-stelligen Code ein')
      return
    }

    setVerifyingOtp(true)
    setOtpError('')

    try {
      const response = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otpCode: otpCode
        })
      })

      const result = await response.json()

      if (response.ok && result.token) {
        // OTP verified! Store token and continue
        localStorage.setItem('token', result.token)
        console.log('✅ OTP verified, token stored')
        
        // Close modal and proceed with treatment request
        setOtpModalOpen(false)
        await createTreatmentRequest(result.token)
      } else {
        setOtpError(result.message || 'Ungültiger Code. Bitte versuchen Sie es erneut.')
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      setOtpError('Fehler bei der Verifizierung. Bitte versuchen Sie es erneut.')
    } finally {
      setVerifyingOtp(false)
    }
  }

  // Create treatment request (used for both new and returning users)
  const createTreatmentRequest = async (token?: string) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      }
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${API_BASE}/api/treatment/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          ...formData, 
          postcode,
        }),
      })

      let result
      try {
        result = await response.json()
      } catch (parseError) {
        console.error('Error parsing response:', parseError)
        result = { data: {} }
      }

      if (response.ok && result.data) {
        // Store pharmacyId for marketplace
        if (result.data.pharmacyId) {
          localStorage.setItem('assignedPharmacyId', result.data.pharmacyId.toString())
          console.log('✅ Pharmacy ID stored:', result.data.pharmacyId)
        }

        // Store treatment request data
        const treatmentRequestData = {
          id: result.data?.id || `temp-${Date.now()}`,
          patientId: result.data?.patientId || null,
          pharmacyId: result.data?.pharmacyId || null,
          postcode,
          ...formData
        }
        localStorage.setItem('treatmentRequest', JSON.stringify(treatmentRequestData))
        localStorage.setItem('formPostcode', postcode)

        // Redirect to questionnaire
        router.push('/questionnaire')
      } else {
        // Fallback: store data and continue
        console.warn('API call failed, but proceeding to questionnaire')
        localStorage.setItem('treatmentRequest', JSON.stringify({
          id: `temp-${Date.now()}`,
          patientId: null,
          pharmacyId: null,
          postcode,
          ...formData
        }))
        localStorage.setItem('formPostcode', postcode)
        router.push('/questionnaire')
      }
    } catch (error) {
      console.error('Error creating treatment request:', error)
      // Even on error, allow user to continue
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Step 1: Check if user exists and if OTP is required
      console.log('📧 Checking user status for email:', formData.email)
      
      const loginResponse = await fetch(`${API_BASE}/api/auth/patient-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      })
  
      const loginResult = await loginResponse.json()
      console.log('Login result:', loginResult)
  
      // ✅ SECURITY CHECK: Invalid email
      if (loginResult.invalidEmail || !loginResponse.ok) {
        console.error('❌ Invalid email or request failed:', loginResult.message)
        alert(loginResult.message || 'Bitte geben Sie eine gültige E-Mail-Adresse ein.')
        setLoading(false)
        return
      }
  
      // Case 1: New user (first order)
      if (loginResult.firstOrder === true) {
        console.log('🆕 New user - proceeding with registration')
        await createTreatmentRequest()
        return
      }
  
      // Case 2: Existing user - known device (same IP)
      if (loginResult.token && !loginResult.otpRequired) {
        console.log('✅ Known device - auto-login successful')
        localStorage.setItem('token', loginResult.token)
        
        // Show welcome back notification
        setShowWelcomeNotification(true)
        // Auto-hide after 3 seconds
        setTimeout(() => {
          setShowWelcomeNotification(false)
        }, 3000)
        
        await createTreatmentRequest(loginResult.token)
        return
      }
  
      // Case 3: Existing user - new device (different IP) - OTP required
      if (loginResult.otpRequired === true) {
        console.log('🔐 OTP required - new device detected')
        setLoading(false)
        setOtpModalOpen(true)
        // OTP email already sent by backend
        return
      }
  
      // Fallback: Something unexpected happened - DON'T proceed without auth!
      console.error('Unexpected login response:', loginResult)
      alert('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
      setLoading(false)
  
    } catch (error) {
      console.error('Error during login check:', error)
      alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
      setLoading(false)
    }
  }

  return (
    <>
      {/* Welcome Back Notification */}
      {showWelcomeNotification && (
        <div 
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-out"
          style={{
            animation: 'slideDown 0.3s ease-out'
          }}
        >
          <div className="bg-white rounded-2xl border-2 border-black shadow-2xl p-4 sm:p-6 max-w-md mx-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-lg font-bold title-gradient mb-1 inconsolata">
                  Willkommen zurück!
                </h3>
                <p className="text-sm sm:text-base subtitle-text inconsolata">
                  Sie werden automatisch angemeldet.
                </p>
              </div>
              <button
                onClick={() => setShowWelcomeNotification(false)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1"
                aria-label="Close notification"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-beige inconsolata">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
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
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg inconsolata text-base sm:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:bg-gray-100"
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
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg inconsolata text-base sm:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:bg-gray-100"
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
                  className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg inconsolata text-base sm:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:bg-gray-100"
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
                    className={`w-full pr-3 p-2.5 sm:p-3 border border-gray-300 rounded-lg inconsolata text-base sm:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:bg-gray-100 transition-all duration-200 ${
                      formData.street ? 'pl-3' : 'pl-[5rem]'
                    }`}
                    placeholder="   z.B. Hauptstraße 42"
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
                        formData.city ? 'pl-3' : 'pl-[5rem]'
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
                    className="w-full px-3 p-2.5 sm:p-3 border border-gray-300 rounded-lg inconsolata text-base sm:text-lg bg-gray-100 text-gray-600 cursor-not-allowed"
                    placeholder={postcode}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || !isFormValid}
                className="w-full btn-secondary py-3 sm:py-4 text-base sm:text-lg font-bold"
              >
                {loading ? 'Wird verarbeitet...' : 'Weiter'}
              </Button>
            </form>
          </div>

          {/* Info */}
          <div className="mt-6 sm:mt-8 bg-emerald-50 border border-emerald-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-emerald-800 mb-2">
              Lieferung in Berlin
            </h3>
            <p className="text-sm sm:text-base text-emerald-700">
              Da Sie in Berlin wohnen, können wir Ihre Medikamente in 30-90 Minuten direkt zu Ihnen liefern lassen.
            </p>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      <Dialog open={otpModalOpen} onOpenChange={setOtpModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Lock className="w-5 h-5 text-emerald-600" />
              Sicherheitscode eingeben
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Wir haben einen 6-stelligen Code an <strong>{formData.email}</strong> gesendet.
              Bitte geben Sie diesen Code ein, um fortzufahren.
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            {/* OTP Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sicherheitscode
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otpCode}
                onChange={handleOtpChange}
                placeholder="000000"
                autoFocus
                disabled={verifyingOtp}
                className="w-full p-4 border-2 border-gray-300 rounded-lg text-center text-2xl font-bold tracking-widest focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:bg-gray-100"
              />
            </div>

            {/* Error Message */}
            {otpError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600 text-center">{otpError}</p>
              </div>
            )}

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-blue-700 text-center">
                💡 Der Code ist 5 Minuten gültig. Überprüfen Sie auch Ihren Spam-Ordner.
              </p>
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerifyOtp}
              disabled={otpCode.length !== 6 || verifyingOtp}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifyingOtp ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Wird überprüft...
                </span>
              ) : (
                'Code bestätigen'
              )}
            </Button>

            {/* Resend Link */}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={async () => {
                  // Resend OTP
                  try {
                    await fetch(`${API_BASE}/api/auth/patient-login`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: formData.email })
                    })
                    alert('Neuer Code wurde gesendet!')
                    setOtpCode('')
                    setOtpError('')
                  } catch (error) {
                    console.error('Resend OTP error:', error)
                  }
                }}
                className="text-sm text-emerald-600 hover:text-emerald-700 underline"
              >
                Code erneut senden
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}