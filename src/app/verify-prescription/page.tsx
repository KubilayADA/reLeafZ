'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Building2 } from 'lucide-react'
import '@/app/main.css'
import '@/form/form.css'

export default function VerifyPrescriptionPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [zip, setZip] = useState('')
  const [city, setCity] = useState('')
  const [pdfName, setPdfName] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setPdfName(file ? file.name : '')
  }

  return (
    <div className="form-page inconsolata">
      <div className="form-container form-container--narrow">
        <div className="form-header">
          <div className="form-header__back-wrap">
            <Button
              type="button"
              onClick={() => router.push('/')}
              className="btn-outline text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </div>
          <h1 className="form-header__title text-2xl sm:text-3xl md:text-4xl font-bold title-gradient mb-2">
            Ich habe ein Rezept
          </h1>
          <p className="form-header__subtitle text-base sm:text-lg max-w-xl mx-auto text-center">
            Laden Sie Ihr Rezept hoch. Wir prüfen es und senden Ihnen innerhalb von 24
            Stunden einen Zugangslink per E-Mail.
          </p>
        </div>

        <div className="form-card">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="form-fields"
          >
            <div className="form-field">
              <label htmlFor="vp-fullName" className="form-label">
                Vollständiger Name
              </label>
              <input
                id="vp-fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="form-input inconsolata"
                placeholder="Max Mustermann"
                autoComplete="name"
                maxLength={100}
              />
            </div>

            <div className="form-field">
              <label htmlFor="vp-email" className="form-label">
                E-Mail Adresse
              </label>
              <input
                id="vp-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input inconsolata"
                placeholder="max@example.com"
                autoComplete="email"
                maxLength={254}
              />
            </div>

            <div className="form-field">
              <label htmlFor="vp-phone" className="form-label">
                Telefonnummer
              </label>
              <input
                id="vp-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input inconsolata"
                placeholder="+49 30 12345678"
                autoComplete="tel"
                maxLength={20}
              />
            </div>

            <div className="form-field-grid-2">
              <div className="form-field">
                <label htmlFor="vp-zip" className="form-label">
                  Postleitzahl
                </label>
                <input
                  id="vp-zip"
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={zip}
                  onChange={(e) =>
                    setZip(e.target.value.replace(/\D/g, '').slice(0, 5))
                  }
                  className="form-input inconsolata"
                  placeholder="10115"
                  autoComplete="postal-code"
                />
              </div>
              <div className="form-field">
                <label htmlFor="vp-city" className="form-label">
                  Stadt
                </label>
                <div className="relative">
                  {!city && (
                    <Building2 className="form-input-icon" size={20} />
                  )}
                  <input
                    id="vp-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`form-input inconsolata form-input--with-icon-left ${city ? 'has-value' : ''}`}
                    placeholder="Berlin"
                    autoComplete="address-level2"
                    maxLength={100}
                  />
                </div>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="vp-pdf" className="form-label">
                Rezept (PDF)
              </label>
              <input
                id="vp-pdf"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="form-input inconsolata text-sm file:mr-4 file:py-2 file:px-3 file:rounded-md file:border file:border-gray-300 file:bg-gray-50 file:text-sm file:font-medium file:inconsolata hover:file:bg-gray-100 cursor-pointer"
              />
              {pdfName ? (
                <p className="mt-2 text-sm subtitle-text truncate" title={pdfName}>
                  Ausgewählt: {pdfName}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Button
                type="submit"
                disabled
                className="form-cta btn-secondary cursor-not-allowed opacity-70"
              >
                Rezept einreichen
              </Button>
              <p className="text-center text-sm text-gray-500">
                Diese Funktion wird in Kürze verfügbar sein.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
