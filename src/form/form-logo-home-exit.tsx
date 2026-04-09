'use client'

import React from 'react'
import { navigateHomeHard } from '@/lib/navigateHome'

interface FormLogoHomeExitProps {
  message?: string
}

const DEFAULT_CONFIRM_MESSAGE =
  'Moechtest du wirklich zur Startseite zurueckkehren? Dein bisheriger Fortschritt im Formular wird nicht gespeichert.'

export default function FormLogoHomeExit({ message = DEFAULT_CONFIRM_MESSAGE }: FormLogoHomeExitProps) {
  const handleLogoClick = () => {
    if (window.confirm(message)) {
      navigateHomeHard()
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
