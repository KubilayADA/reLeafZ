'use client'

import React, { useState } from 'react'
import '@/app/main.css'
import './mailreq.css'
import SectionParticlesBackground from '@/components/ui/SectionParticlesBackground'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function MailReq(): React.JSX.Element {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmed = email.trim()
    if (!EMAIL_RE.test(trimmed)) {
      setError('Bitte gib eine gültige E-Mail-Adresse ein.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          consentAccepted: true,
          consentText:
            'Ich stimme zu, dass Releafz meine E-Mail speichert und mich über Neuigkeiten informiert.',
          consentVersion: 'newsletter-v1',
          consentTimestamp: new Date().toISOString(),
        }),
      })

      let data: { success?: boolean; error?: string; message?: string; alreadyRegistered?: boolean } | null = null
      try {
        data = await res.json()
      } catch {
        data = null
      }

      const backendMsg = data?.message || data?.error
      const isDuplicate =
        data?.alreadyRegistered === true ||
        (typeof backendMsg === 'string' && /already|bereits|duplicate/i.test(backendMsg))

      if (!res.ok || data?.success === false) {
        if (isDuplicate) {
          setSubmitted(true)
          setEmail('')
          return
        }
        setError(backendMsg || 'Etwas ist schiefgelaufen. Bitte erneut versuchen.')
        return
      }

      setSubmitted(true)
      setEmail('')
    } catch {
      setError('Netzwerkfehler. Bitte erneut versuchen.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="newsletter" className="mailreq-section" aria-label="Newsletter Anmeldung">
      <div className="mailreq__bg" aria-hidden>
        <div className="mailreq__bg-base" />
        <SectionParticlesBackground className="mailreq__particles" />
        <div className="mailreq__glow-radial" />
        <div className="mailreq__grid" />
      </div>

      <div className="mailreq-inner">
        <div className="mailreq-intro-row">
          <span className="mailreq-story-pill">Newsletter</span>
          <h2 className="mailreq-title">Bleib auf dem Laufenden.</h2>
          <p className="mailreq-lead">
            Trage deine E-Mail ein und erhalte Updates zu Releafz — kein Spam, versprochen.
          </p>
        </div>

        {submitted ? (
          <p className="mailreq-success" role="status">
            Danke! Wir melden uns bei dir.
          </p>
        ) : (
          <form className="mailreq-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="mailreq-email" className="mailreq-form__label">
              E-Mail-Adresse
            </label>
            <div className="mailreq-form__row">
              <input
                id="mailreq-email"
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                placeholder="deine@email.de"
                value={email}
                onChange={(ev) => {
                  setEmail(ev.target.value)
                  if (error) setError('')
                }}
                className="mailreq-input"
                disabled={loading}
                required
              />
              <button type="submit" className="mailreq-submit" disabled={loading}>
                {loading ? 'Wird gesendet…' : 'Anmelden'}
              </button>
            </div>
            {error ? (
              <p className="mailreq-error" role="alert">
                {error}
              </p>
            ) : null}
          </form>
        )}
      </div>
    </section>
  )
}
