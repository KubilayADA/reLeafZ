'use client'

import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { requestDeletion } from '@/lib/api'
import '@/form/form.css'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type PageStatus = 'idle' | 'submitting' | 'success' | 'error'

export default function Datenloeschung() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<PageStatus>('idle')
  const [validationError, setValidationError] = useState('')
  const [submitError, setSubmitError] = useState('')

  const isSubmitting = status === 'submitting'

  async function handleSubmit() {
    const trimmedEmail = email.trim()
    if (!trimmedEmail || !EMAIL_RE.test(trimmedEmail)) {
      setValidationError('Bitte geben Sie eine gültige E-Mail-Adresse ein.')
      return
    }

    setValidationError('')
    setSubmitError('')
    setStatus('submitting')

    try {
      await requestDeletion({
        email: trimmedEmail,
        message: message.trim() || undefined,
      })
      setStatus('success')
    } catch {
      setStatus('error')
      setSubmitError(
        'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut oder schreiben Sie an support@releafz.de.',
      )
    }
  }

  return (
    <div className="form-page inconsolata">
      <div className="form-container">
        <div className="form-header">
          <div className="form-header__title-wrap form-header__title-wrap--corner-logo">
            <h1 className="form-header__title font-bold title-gradient tracking-tight mb-0">
              Datenlöschung beantragen
            </h1>
          </div>
        </div>

        <div className="form-card form-card--legal space-y-6 sm:space-y-8">
          <section className="form-legal-section">
            <p className="form-legal-body">
              Sie können die Löschung Ihrer personenbezogenen Daten gemäß Art.&nbsp;17 DSGVO
              beantragen. Medizinische und finanzielle Aufzeichnungen werden gesetzlich
              vorgeschrieben (§&nbsp;630f BGB, §&nbsp;257 HGB) in anonymisierter Form
              aufbewahrt. Ihre Anfrage bearbeiten wir innerhalb von 30&nbsp;Tagen gemäß
              Art.&nbsp;12 DSGVO.
            </p>
          </section>

          {status === 'success' ? (
            <section className="form-legal-section">
              <div className="form-message-box form-message-box--info form-message-box--mashallah-info">
                <h2 className="form-message-box__title">Anfrage erhalten</h2>
                <p className="form-message-box__text">
                  Wir haben Ihre Löschanfrage erhalten und bearbeiten sie innerhalb von 30 Tagen
                  gemäß Art.&nbsp;12 DSGVO. Bei Rückfragen melden wir uns unter der angegebenen
                  E-Mail-Adresse.
                </p>
              </div>
            </section>
          ) : (
            <section className="form-legal-section">
              <div className="form-fields">
                <div className="form-field">
                  <label htmlFor="deletion-email" className="form-label">
                    Ihre bei releafZ registrierte E-Mail-Adresse
                  </label>
                  <input
                    id="deletion-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    disabled={isSubmitting}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (validationError) setValidationError('')
                    }}
                    className="form-input inconsolata"
                  />
                  {validationError && (
                    <p className="mt-2 text-sm text-red-600">{validationError}</p>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="deletion-message" className="form-label">
                    Nachricht (optional)
                  </label>
                  <textarea
                    id="deletion-message"
                    rows={4}
                    value={message}
                    disabled={isSubmitting}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-input form-textarea inconsolata"
                  />
                </div>

                {submitError && (
                  <div className="form-message-box form-message-box--error">
                    <p className="form-message-box__text">{submitError}</p>
                  </div>
                )}

                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => void handleSubmit()}
                  className="form-cta btn-secondary"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Wird gesendet…
                    </span>
                  ) : (
                    'Anfrage senden'
                  )}
                </Button>
              </div>

              <p className="form-legal-note mt-6">
                Sie können uns auch direkt unter{' '}
                <a href="mailto:support@releafz.de" className="form-legal-link">
                  support@releafz.de
                </a>{' '}
                erreichen.
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
