'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

interface FormLogoHomeExitProps {
  message?: string
}

const DEFAULT_CONFIRM_MESSAGE =
  'Moechtest du wirklich zur Startseite zurueckkehren? Dein bisheriger Fortschritt im Formular wird nicht gespeichert.'

export default function FormLogoHomeExit({ message = DEFAULT_CONFIRM_MESSAGE }: FormLogoHomeExitProps) {
  const router = useRouter()

  const handleLogoClick = () => {
    if (window.confirm(message)) {
      router.push('/')
    }
  }

  return (
    <button
      type="button"
      className="form-logo-home-exit"
      onClick={handleLogoClick}
      aria-label="Zur Startseite zurueckkehren"
      title="Zur Startseite"
    />
  )
}
