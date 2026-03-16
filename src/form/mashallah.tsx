'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ArrowLeft, MapPin, Building2, Mail, Lock, CheckCircle2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import '@/app/main.css'
import '@/form/form.css'

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
  const [submitError, setSubmitError] = useState('')
  const [otpModalOpen, setOtpModalOpen] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpError, setOtpError] = useState('')
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [showWelcomeNotification, setShowWelcomeNotification] = useState(false)
  const [consentHealth, setConsentHealth] = useState(false)
  const [consentTerms, setConsentTerms] = useState(false)
  
  const API_BASE = process.env.NEXT_PUBLIC_API_URL

  // Validate form fields
  const isFormValid = formData.fullName.trim() !== '' && 
                     formData.email.trim() !== '' && 
                     formData.phone.trim() !== '' && 
                     formData.street.trim() !== '' &&
                     formData.city.trim() !== '' &&
                     consentHealth === true &&
                     consentTerms === true

                     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                      const { name, value } = e.target
                      setSubmitError('')
                      // 🔒 SECURITY: Clear authentication tokens when email changes
                      // This prevents using old tokens with new email addresses
                      if (name === 'email') {
                        console.log('🧹 Clearing tokens due to email change')
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
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          otpCode: otpCode
        })
      })

      const result = await response.json()

      if (response.ok) {
        setOtpModalOpen(false)
        router.push('/questionnaire')
      } else {
        setOtpError(result.message || 'Ungültiger Code. Bitte versuchen Sie es erneut.')
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('OTP verification error:', error)
      }
      setOtpError('Fehler bei der Verifizierung. Bitte versuchen Sie es erneut.')
    } finally {
      setVerifyingOtp(false)
    }
  }

  // Submit treatment request first (before any login). Only stores data on success.
  // Returns success + optional error message so caller can show validation errors.
  const submitTreatmentRequest = async (): Promise<{ success: true } | { success: false; message: string }> => {
    try {
      const response = await fetch(`${API_BASE}/api/treatment/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          postcode,
          healthDataConsentGiven: consentHealth,
          termsAccepted: consentTerms,
        }),
      })

      let result: {
        data?: { id?: number; patientId?: number; pharmacyId?: number }
        message?: string
        error?: string
        errors?: string[] | { message?: string }[]
      } = {}
      try {
        result = await response.json()
      } catch {
        return { success: false, message: 'Ungültige Antwort vom Server. Bitte versuchen Sie es erneut.' }
      }

      if (!response.ok) {
        let message = result.message || result.error
        if (!message && Array.isArray(result.errors) && result.errors.length > 0) {
          message = result.errors
            .map((e: string | { message?: string }) => (typeof e === 'string' ? e : e.message))
            .filter(Boolean)
            .join(' ')
        }
        if (!message) message = 'Ihre Angaben konnten nicht übermittelt werden. Bitte prüfen Sie das Formular.'
        return { success: false, message }
      }

      if (!result.data || result.data.id == null) {
        return { success: false, message: 'Ungültige Antwort vom Server. Bitte versuchen Sie es erneut.' }
      }

      // Only store when API returned a real treatment request
      if (result.data.pharmacyId != null) {
        localStorage.setItem('assignedPharmacyId', result.data.pharmacyId.toString())
      }
      const treatmentRequestData = {
        id: result.data.id,
        city: formData.city,
        postcode,
      }
      localStorage.setItem('treatmentRequest', JSON.stringify(treatmentRequestData))
      localStorage.setItem('formPostcode', postcode)
      return { success: true }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error creating treatment request:', error)
      }
      return {
        success: false,
        message: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setSubmitError('')

    try {
      // Step 1: Submit treatment request first (validates form, creates request). Only then auth/OTP.
      const treatmentResult = await submitTreatmentRequest()
      if (!treatmentResult.success) {
        setSubmitError(treatmentResult.message)
        setLoading(false)
        return
      }

      // Step 2: Check if user exists and if OTP is required (may send OTP email)
      const loginResponse = await fetch(`${API_BASE}/api/auth/patient-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: formData.email }),
      })
      const loginResult = await loginResponse.json()

      if (loginResult.invalidEmail || !loginResponse.ok) {
        setSubmitError(loginResult.message || 'Bitte geben Sie eine gültige E-Mail-Adresse ein.')
        setLoading(false)
        return
      }

      // Case 1: New user (first order) — treatment already created and stored
      if (loginResult.firstOrder === true) {
        router.push('/questionnaire')
        return
      }

      // Case 2: Existing user - known device (same IP)
      if (!loginResult.otpRequired) {
        setShowWelcomeNotification(true)
        setTimeout(() => setShowWelcomeNotification(false), 3000)
        router.push('/questionnaire')
        return
      }

      // Case 3: Existing user - new device - OTP required
      if (loginResult.otpRequired === true) {
        setOtpModalOpen(true)
        setLoading(false)
        return
      }

      setSubmitError('Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
      setLoading(false)
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error during submit:', error)
      }
      setSubmitError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
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

      <div className="form-page inconsolata">
        <div className="form-container form-container--narrow">
          <div className="form-header">
            <div className="form-header__back-wrap">
              <Button onClick={onBack} className="btn-outline text-sm sm:text-base">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück
              </Button>
            </div>
            <h1 className="form-header__title text-2xl sm:text-3xl md:text-4xl font-bold title-gradient mb-2">
              Medizinische Anfrage
            </h1>
            <p className="form-header__subtitle text-base sm:text-lg">
              Postleitzahl: <span className="font-semibold text-emerald-600">{postcode}</span>
            </p>
          </div>

          <div className="form-card">
            <form onSubmit={handleSubmit} className="form-fields">
              <div className="form-field">
                <label htmlFor="fullName" className="form-label">
                  Vollständiger Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  disabled={loading}
                  className="form-input inconsolata"
                  placeholder="Max Mustermann"
                />
              </div>

              <div className="form-field">
                <label htmlFor="email" className="form-label">
                  E-Mail Adresse
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  maxLength={254}
                  disabled={loading}
                  className="form-input inconsolata"
                  placeholder="max@example.com"
                />
              </div>

              <div className="form-field">
                <label htmlFor="phone" className="form-label">
                  Telefonnummer
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  maxLength={20}
                  disabled={loading}
                  className="form-input inconsolata"
                  placeholder="+49 30 12345678"
                />
              </div>

              <div className="form-field">
                <label htmlFor="street" className="form-label">
                  Straße + Hausnummer *
                </label>
                <div className="relative">
                  {!formData.street && (
                    <MapPin className="form-input-icon" size={20} />
                  )}
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    required
                    maxLength={200}
                    disabled={loading}
                    className={`form-input inconsolata form-input--with-icon-left ${formData.street ? 'has-value' : ''}`}
                    placeholder="z.B. Hauptstraße 42"
                  />
                </div>
              </div>

              <div className="form-field-grid-2">
                <div className="form-field">
                  <label htmlFor="city" className="form-label">
                    Stadt *
                  </label>
                  <div className="relative">
                    {!formData.city && (
                      <Building2 className="form-input-icon" size={20} />
                    )}
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      disabled={loading}
                      className={`form-input inconsolata form-input--with-icon-left ${formData.city ? 'has-value' : ''}`}
                      placeholder="Berlin"
                    />
                  </div>
                </div>
                <div className="form-field">
                  <label htmlFor="postcode" className="form-label">
                    PLZ *
                  </label>
                  <input
                    type="text"
                    id="postcode"
                    name="postcode"
                    value={postcode}
                    disabled
                    className="form-input"
                    placeholder={postcode}
                    readOnly
                  />
                </div>
              </div>
              {/* GDPR Consent Checkboxes */}
<div className="space-y-3">
  <div className="flex items-start gap-3">
    <input
      type="checkbox"
      id="consentTerms"
      checked={consentTerms}
      onChange={(e) => setConsentTerms(e.target.checked)}
      disabled={loading}
      className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
    />
    <label htmlFor="consentTerms" className="text-sm text-gray-700 cursor-pointer">
      Ich akzeptiere die{' '}
      <a href="/agb" target="_blank" className="text-emerald-600 underline hover:text-emerald-700">AGB</a>
      {' '}und die{' '}
      <a href="/datenschutz" target="_blank" className="text-emerald-600 underline hover:text-emerald-700">Datenschutzerklärung</a>
      {' '}von releafZ. *
    </label>
  </div>

      <div className="flex items-start gap-3">
    <input
      type="checkbox"
      id="consentHealth"
      checked={consentHealth}
      onChange={(e) => setConsentHealth(e.target.checked)}
      disabled={loading}
      className="mt-1 h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
    />
        <label htmlFor="consentHealth" className="text-sm text-gray-700 cursor-pointer">
          Ich willige ausdrücklich in die Verarbeitung meiner Gesundheitsdaten (Symptome, Diagnosen, Rezepte) durch releafZ zur Vermittlung medizinischer Leistungen ein (Art. 9 Abs. 2 lit. a DSGVO). *
        </label>
      </div>
    </div>

              <div className="space-y-3">
                <div className="form-checkbox-row">
                  <input
                    type="checkbox"
                    id="consentTerms"
                    checked={consentTerms}
                    onChange={(e) => setConsentTerms(e.target.checked)}
                    disabled={loading}
                    className="form-checkbox"
                  />
                  <label htmlFor="consentTerms" className="form-checkbox-label">
                    Ich akzeptiere die{' '}
                    <a href="/agb" target="_blank" className="form-legal-link">AGB</a>
                    {' '}und die{' '}
                    <a href="/datenschutz" target="_blank" className="form-legal-link">Datenschutzerklärung</a>
                    {' '}von releafZ. *
                  </label>
                </div>
                <div className="form-checkbox-row">
                  <input
                    type="checkbox"
                    id="consentHealth"
                    checked={consentHealth}
                    onChange={(e) => setConsentHealth(e.target.checked)}
                    disabled={loading}
                    className="form-checkbox"
                  />
                  <label htmlFor="consentHealth" className="form-checkbox-label">
                    Ich willige ausdrücklich in die Verarbeitung meiner Gesundheitsdaten (Symptome, Diagnosen, Rezepte) durch releafZ zur Vermittlung medizinischer Leistungen ein (Art. 9 Abs. 2 lit. a DSGVO). *
                  </label>
                </div>
              </div>

              {submitError && (
                <div className="form-message-box form-message-box--error">
                  <p className="form-message-box__text">{submitError}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !isFormValid}
                className="form-cta btn-secondary"
              >
                {loading ? 'Wird verarbeitet...' : 'Weiter'}
              </Button>
            </form>
          </div>

          <div className="form-message-box form-message-box--info mt-6 sm:mt-8">
            <h3 className="form-message-box__title">
              Lieferung in Berlin
            </h3>
            <p className="form-message-box__text">
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
                      credentials: 'include',
                      body: JSON.stringify({ email: formData.email })
                    })
                    alert('Neuer Code wurde gesendet!')
                    setOtpCode('')
                    setOtpError('')
                  } catch (error) {
                    if (process.env.NODE_ENV === 'development') {
                      console.error('Resend OTP error:', error)
                    }
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