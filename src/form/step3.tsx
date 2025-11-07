'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Mail, MapPin, Building2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import '@/app/main.css'

interface Step3Props {
  onNext: (selectedOption: string) => void
  onBack?: () => void
}

type PreviousPrescriptionOption = 'yes' | 'no'
type LoginStep = 'email' | 'pin' | 'address'

interface UserData {
  name: string
  email: string
  phone: string
  street: string
  city: string
  postcode: string
  deliveryNotes?: string
}

export default function Step3({ onNext, onBack }: Step3Props) {
  const [selectedOption, setSelectedOption] = useState<PreviousPrescriptionOption | ''>('')
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [loginStep, setLoginStep] = useState<LoginStep>('email')
  const [isRecognized, setIsRecognized] = useState(false)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState(['', '', '', '', '', ''])
  const pinInputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pinSent, setPinSent] = useState(false)
  const API_BASE = process.env.NEXT_PUBLIC_API_URL

  // Initialize PIN input refs
  useEffect(() => {
    pinInputRefs.current = Array(6).fill(null).map(() => null)
  }, [])

  const options = [
    {
      id: 'yes' as PreviousPrescriptionOption,
      label: 'Ja'
    },
    {
      id: 'no' as PreviousPrescriptionOption,
      label: 'Nein'
    }
  ]

  // Reset dialog state when it opens
  useEffect(() => {
    if (loginDialogOpen) {
      setLoginStep('email')
      setEmail('')
      setPin(['', '', '', '', '', ''])
      setError('')
      setPinSent(false)
    }
  }, [loginDialogOpen])

  // Check for recognized user on mount
  useEffect(() => {
    checkRecognizedUser()
  }, [])

  const checkRecognizedUser = () => {
    // Check localStorage for user data (simulating cookie recognition)
    const storedUser = localStorage.getItem('recognizedUser')
    const treatmentRequest = localStorage.getItem('treatmentRequest')
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setIsRecognized(true)
        setUserData(user)
      } catch (e) {
        setIsRecognized(false)
      }
    } else if (treatmentRequest) {
      // Try to extract user data from treatment request (includes address from mashallah form)
      try {
        const request = JSON.parse(treatmentRequest)
        // If we have address data from the form, user is recognized
        if (request.street && request.city && request.fullName && request.email) {
          setIsRecognized(true)
          setUserData({
            name: request.fullName || '',
            email: request.email || '',
            phone: request.phone || '',
            street: request.street || '',
            city: request.city || '',
            postcode: request.postcode || '',
            deliveryNotes: request.deliveryNotes || ''
          })
        } else {
          setIsRecognized(false)
        }
      } catch (e) {
        setIsRecognized(false)
      }
    } else {
      setIsRecognized(false)
    }
  }

  const handleLoginClick = () => {
    setLoginDialogOpen(true)
  }

  // Step 1: Send PIN to email
  const handleSendPin = async () => {
    if (!email.trim()) {
      setError('Bitte gib deine E-Mail Adresse ein.')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      // TODO: Replace with actual API endpoint to send PIN
      // For now, simulate API call
      const response = await fetch(`${API_BASE}/api/auth/send-pin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setPinSent(true)
        setLoginStep('pin')
        // Focus first PIN input
        setTimeout(() => {
          pinInputRefs.current[0]?.focus()
        }, 100)
      } else {
        const data = await response.json()
        setError(data.message || 'Fehler beim Senden des PINs. Bitte versuche es erneut.')
      }
    } catch (err: any) {
      // For development: simulate success if API doesn't exist
      console.log('PIN API not available, simulating success')
      setPinSent(true)
      setLoginStep('pin')
      setTimeout(() => {
        pinInputRefs.current[0]?.focus()
      }, 100)
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify PIN
  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) return // Only allow single digit
    
    const newPin = [...pin]
    newPin[index] = value.replace(/\D/g, '') // Only numbers
    setPin(newPin)

    // Auto-focus next input
    if (value && index < 5) {
      pinInputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits are entered
    if (newPin.every(digit => digit !== '') && newPin.join('').length === 6) {
      handleVerifyPin(newPin.join(''))
    }
  }

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinInputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyPin = async (pinValue?: string) => {
    const pinToVerify = pinValue || pin.join('')
    
    if (pinToVerify.length !== 6) {
      setError('Bitte gib den vollständigen 6-stelligen PIN ein.')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      // TODO: Replace with actual API endpoint to verify PIN
      const response = await fetch(`${API_BASE}/api/auth/verify-pin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, pin: pinToVerify }),
      })

      if (response.ok) {
        const data = await response.json()
        // Get user data from response
        const patientData = data.patient || data.user || {}
        const postcode = localStorage.getItem('formPostcode') || ''
        const treatmentRequest = localStorage.getItem('treatmentRequest')
        
        // Start with data from API response
        let user: UserData = {
          name: patientData.fullName || patientData.name || email,
          email: email,
          phone: patientData.phone || '',
          street: patientData.street || patientData.address?.street || '',
          city: patientData.city || patientData.address?.city || '',
          postcode: postcode,
          deliveryNotes: patientData.deliveryNotes || ''
        }
        
        // Prioritize address from treatment request (from mashallah form) if available
        if (treatmentRequest) {
          try {
            const request = JSON.parse(treatmentRequest)
            if (request.street || request.city) {
              user = {
                ...user,
                street: request.street || user.street,
                city: request.city || user.city,
                postcode: request.postcode || user.postcode,
                // Also update name, email, phone from treatment request if not in API response
                name: user.name || request.fullName || email,
                email: user.email || request.email || email,
                phone: user.phone || request.phone || ''
              }
            }
          } catch (e) {
            // Continue with API data
          }
        }
        
        // Store user data
        localStorage.setItem('recognizedUser', JSON.stringify(user))
        setIsRecognized(true)
        setUserData(user)
        setLoginStep('address')
      } else {
        const data = await response.json()
        setError(data.message || 'Ungültiger PIN. Bitte versuche es erneut.')
        setPin(['', '', '', '', '', ''])
        pinInputRefs.current[0]?.focus()
      }
    } catch (err: any) {
      // For development: simulate success if API doesn't exist
      console.log('Verify PIN API not available, simulating success')
      const postcode = localStorage.getItem('formPostcode') || ''
      const treatmentRequest = localStorage.getItem('treatmentRequest')
      
      let user: UserData = {
        name: email,
        email: email,
        phone: '',
        street: '',
        city: '',
        postcode: postcode,
        deliveryNotes: ''
      }
      
      // Try to get user data from treatment request (includes address from mashallah form)
      if (treatmentRequest) {
        try {
          const request = JSON.parse(treatmentRequest)
          user = {
            name: request.fullName || email,
            email: request.email || email,
            phone: request.phone || '',
            street: request.street || '',
            city: request.city || '',
            postcode: request.postcode || postcode,
            deliveryNotes: request.deliveryNotes || ''
          }
        } catch (e) {
          // Use default user data
        }
      }
      
      // Also check if there's a recognized user already stored
      const storedUser = localStorage.getItem('recognizedUser')
      if (storedUser) {
        try {
          const existingUser = JSON.parse(storedUser)
          // Merge with existing user data, but prioritize address from treatment request
          user = {
            ...existingUser,
            ...user,
            // Keep address from treatment request if available
            street: user.street || existingUser.street || '',
            city: user.city || existingUser.city || '',
            postcode: user.postcode || existingUser.postcode || postcode
          }
        } catch (e) {
          // Continue with user from treatment request
        }
      }
      
      localStorage.setItem('recognizedUser', JSON.stringify(user))
      setIsRecognized(true)
      setUserData(user)
      setLoginStep('address')
    } finally {
      setLoading(false)
    }
  }

  const handleResendPin = async () => {
    await handleSendPin()
  }

  // Step 3: Update address and continue
  const handleUpdateAddress = async () => {
    if (!userData) return
    
    if (!userData.street || !userData.city || !userData.postcode) {
      setError('Bitte fülle alle Pflichtfelder aus.')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      // Update user data in localStorage
      localStorage.setItem('recognizedUser', JSON.stringify(userData))
      
      // Update treatment request if exists
      const treatmentRequest = localStorage.getItem('treatmentRequest')
      if (treatmentRequest) {
        try {
          const request = JSON.parse(treatmentRequest)
          const updated = {
            ...request,
            fullName: userData.name,
            email: userData.email,
            phone: userData.phone,
            street: userData.street,
            city: userData.city,
            postcode: userData.postcode,
            deliveryNotes: userData.deliveryNotes
          }
          localStorage.setItem('treatmentRequest', JSON.stringify(updated))
        } catch (e) {
          console.error('Error updating treatment request:', e)
        }
      }
      
      setLoginDialogOpen(false)
      // Continue with next step
      if (selectedOption) {
        onNext(selectedOption)
      }
    } catch (err: any) {
      setError(err.message || 'Fehler beim Aktualisieren der Adresse.')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (selectedOption === 'yes' && !isRecognized) {
      // If "Ja" is selected but user is not logged in, show login dialog
      setLoginDialogOpen(true)
      return
    }
    
    if (selectedOption) {
      // Pass the selected option to parent, which will handle navigation
      onNext(selectedOption)
    }
  }

  return (
    <div className="min-h-screen bg-beige inconsolata">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        {onBack && (
          <div className="mb-4 sm:mb-6">
            <Button
              onClick={onBack}
              className="btn-outline text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 overflow-x-auto">
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-sm sm:text-base">
                1
              </div>
              <span className="font-medium text-gray-500 text-xs sm:text-sm md:text-base hidden sm:inline">Anfrage</span>
            </div>
            <div className="w-8 sm:w-16 h-0.5 bg-gray-300 flex-shrink-0"></div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-sm sm:text-base">
                2
              </div>
              <span className="font-medium text-gray-500 text-xs sm:text-sm md:text-base hidden sm:inline">Produktauswahl</span>
              <span className="font-medium text-gray-500 text-xs sm:hidden">Produkt</span>
            </div>
            <div className="w-8 sm:w-16 h-0.5 bg-gray-300 flex-shrink-0"></div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm sm:text-base">
                3
              </div>
              <span className="font-medium text-emerald-600 text-xs sm:text-sm md:text-base hidden sm:inline">Anfrage absenden</span>
              <span className="font-medium text-emerald-600 text-xs sm:hidden">Absenden</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl md:text-2xl font-bold title-gradient mb-6 sm:mb-8">
            Hast du über reLeafZ schon einmal ein Rezept erhalten? *
          </h2>

          {/* Options - Horizontal Layout */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {options.map((option) => {
              const isSelected = selectedOption === option.id
              
              return (
                <div key={option.id} className="relative">
                  <div
                    onClick={() => setSelectedOption(option.id)}
                    className={`
                      relative border-2 rounded-xl p-8 sm:p-10 cursor-pointer transition-all duration-200 text-center
                      transform hover:scale-[1.02] active:scale-[0.98]
                      ${isSelected 
                        ? 'border-emerald-500 bg-emerald-50 shadow-lg ring-2 ring-emerald-200' 
                        : 'border-gray-300 bg-white hover:border-emerald-400 hover:bg-gray-50 hover:shadow-md'
                      }
                    `}
                  >
                    {/* Selection Indicator */}
                    <div className="flex items-center justify-center mb-4">
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                        ${isSelected 
                          ? 'border-emerald-500 bg-emerald-500 shadow-sm' 
                          : 'border-gray-400 bg-white'
                        }
                      `}>
                        {isSelected && (
                          <div className="w-3 h-3 rounded-full bg-white"></div>
                        )}
                      </div>
                    </div>

                    {/* Label */}
                    <span className={`
                      text-2xl sm:text-3xl font-bold block
                      ${isSelected ? 'text-emerald-700' : 'text-gray-700'}
                    `}>
                      {option.label}
                    </span>
                  </div>
                  
                  {/* Login Input Field - Only show when "Ja" is selected */}
                  {isSelected && option.id === 'yes' && (
                    <div className="mt-4">
                      <input
                        type="text"
                        value=""
                        placeholder="Login"
                        className="w-full p-3 border border-gray-300 rounded-lg inconsolata text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none cursor-pointer"
                        readOnly
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLoginClick()
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Login Button - Show when "Ja" is selected */}
          {selectedOption === 'yes' && (
            <div className="mb-6">
              <Button
                onClick={handleLoginClick}
                className="w-full btn-outline py-3 sm:py-4 text-base sm:text-lg font-bold border-gray-300 hover:border-emerald-500 hover:bg-emerald-50"
              >
                + Login
              </Button>
            </div>
          )}

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={!selectedOption || (selectedOption === 'yes' && !isRecognized)}
            className="w-full btn-secondary py-3 sm:py-4 text-base sm:text-lg font-bold"
          >
            Weiter
          </Button>
        </div>
      </div>

      {/* Login Dialog */}
      <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold title-gradient">
              {loginStep === 'email' && 'Anmelden, um fortzufahren'}
              {loginStep === 'pin' && 'Anmelden, um fortzufahren'}
              {loginStep === 'address' && 'Login: Bitte bestätige deine Lieferadresse'}
            </DialogTitle>
            <DialogDescription>
              {loginStep === 'email' && 'Logge dich bitte mit deiner E-Mail Adresse ein *'}
              {loginStep === 'pin' && 'Überprüfen Sie Ihre E-Mails und geben Sie den unten stehenden PIN ein'}
              {loginStep === 'address' && 'Bitte überprüfe und aktualisiere deine Daten falls nötig.'}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-4">
              {error}
            </div>
          )}

          {/* Step 1: Email Input */}
          {loginStep === 'email' && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium form-label mb-2">
                  E-Mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSendPin()
                      }
                    }}
                    placeholder="deine@email.de"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg inconsolata text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    autoFocus
                  />
                </div>
              </div>

              <Button
                onClick={handleSendPin}
                disabled={loading || !email.trim()}
                className="w-full btn-primary py-3 text-base font-bold"
              >
                {loading ? 'Wird gesendet...' : 'Login'}
              </Button>
            </div>
          )}

          {/* Step 2: PIN Verification */}
          {loginStep === 'pin' && (
            <div className="space-y-4 mt-4">
              {/* PIN Input Fields */}
              <div className="flex justify-center gap-3 mb-4">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { pinInputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-gray-300 text-center text-xl font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
                  />
                ))}
              </div>

              {/* Helper Text */}
              <p className="text-sm text-gray-500 text-center mb-4">
                Vergewissern Sie sich, Ihren Spam-Ordner zu überprüfen.
              </p>

              {/* Resend PIN and Continue */}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResendPin}
                  disabled={loading}
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  PIN erneut senden
                </button>
                <Button
                  onClick={() => handleVerifyPin()}
                  disabled={loading || pin.join('').length !== 6}
                  className="btn-primary px-6 py-2 text-base font-bold"
                >
                  {loading ? 'Wird überprüft...' : 'Weiter'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Address Confirmation */}
          {loginStep === 'address' && userData && (
            <div className="space-y-4 mt-4">
              {/* Read-only User Info */}
              <div>
                <label className="block text-sm font-medium form-label mb-2">
                  Name
                </label>
                <div className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg inconsolata text-base text-gray-700">
                  {userData.name}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium form-label mb-2">
                  Handynummer
                </label>
                <div className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg inconsolata text-base text-gray-700">
                  {userData.phone}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium form-label mb-2">
                  E-Mail
                </label>
                <div className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg inconsolata text-base text-gray-700">
                  {userData.email}
                </div>
              </div>

              {/* Editable Address Fields */}
              <div>
                <label className="block text-sm font-medium form-label mb-2">
                  Straße + Hausnummer *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={userData.street}
                    onChange={(e) => setUserData({ ...userData, street: e.target.value })}
                    placeholder="z.B. Grassstraße 42"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg inconsolata text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium form-label mb-2">
                    Stadt *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={userData.city}
                      onChange={(e) => setUserData({ ...userData, city: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg inconsolata text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium form-label mb-2">
                    PLZ *
                  </label>
                  <input
                    type="text"
                    value={userData.postcode}
                    onChange={(e) => setUserData({ ...userData, postcode: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg inconsolata text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium form-label mb-2">
                  Lieferhinweise
                </label>
                <textarea
                  value={userData.deliveryNotes || ''}
                  onChange={(e) => setUserData({ ...userData, deliveryNotes: e.target.value })}
                  placeholder="z.B. Bitte bei Müller klingeln"
                  rows={3}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg inconsolata text-base focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <Button
                onClick={handleUpdateAddress}
                disabled={loading || !userData.street || !userData.city || !userData.postcode}
                className="w-full btn-primary py-3 text-base font-bold"
              >
                {loading ? 'Wird gespeichert...' : 'Login'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

