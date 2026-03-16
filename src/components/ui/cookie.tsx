'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from './button'
import './cookie.css'

type CookieCategoryKey = 'essential' | 'analytics' | 'functional' | 'marketing'

type CookiePreferences = {
  essential: boolean
  analytics: boolean
  functional: boolean
  marketing: boolean
}

const COOKIE_STORAGE_KEY = 'cookieConsentPreferences'

const CATEGORY_CONFIG: {
  key: CookieCategoryKey
  label: string
  description: string
}[] = [
  {
    key: 'essential',
    label: 'Essential',
    description:
      'Required for the platform to work securely – things like keeping you logged in and remembering your session between pages.',
  },
  {
    key: 'analytics',
    label: 'Analytics',
    description:
      'Helps us understand how the site is used so we can improve it. We use aggregated, anonymised usage data only.',
  },
  {
    key: 'functional',
    label: 'Functional',
    description:
      'Stores your preferences and settings so the site remembers how you like to use it.',
  },
  {
    key: 'marketing',
    label: 'Marketing',
    description:
      'Allows us to show you relevant, personalised content based on how you use our platform.',
  },
]

const defaultPreferences: CookiePreferences = {
  essential: true,
  analytics: true,
  functional: true,
  marketing: false,
}

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedCategory, setSelectedCategory] =
    useState<CookieCategoryKey>('essential')
  const [preferences, setPreferences] =
    useState<CookiePreferences>(defaultPreferences)

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_STORAGE_KEY)

    if (!stored) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }

    try {
      const parsed = JSON.parse(stored) as CookiePreferences
      setPreferences({
        ...defaultPreferences,
        ...parsed,
        essential: true,
      })
    } catch {
      // If parsing fails, fall back to defaults but still respect that a choice was made
    }
  }, [])

  // Lock page scroll when the banner is visible
  useEffect(() => {
    if (isVisible) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isVisible])

  const persistPreferences = (prefs: CookiePreferences) => {
    localStorage.setItem(
      COOKIE_STORAGE_KEY,
      JSON.stringify({ ...prefs, essential: true })
    )
  }

  const handleToggle = (key: CookieCategoryKey) => {
    if (key === 'essential') {
      return
    }

    setPreferences(prev => {
      const next = {
        ...prev,
        [key]: !prev[key],
        essential: true,
      }
      return next
    })
  }

  const handleSaveChoices = () => {
    const finalPrefs = { ...preferences, essential: true }
    persistPreferences(finalPrefs)
    setIsVisible(false)
  }

  const handleAcceptAll = () => {
    const allOn: CookiePreferences = {
      essential: true,
      analytics: true,
      functional: true,
      marketing: true,
    }
    setPreferences(allOn)
    persistPreferences(allOn)
    setIsVisible(false)
  }

  const handleClose = () => {
    // Closing without saving still keeps the banner visible on next visit,
    // so we just hide it for the current session.
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  const activeCategory = CATEGORY_CONFIG.find(
    c => c.key === selectedCategory
  )!

  return (
    <div className="cookie-banner">
      <div className="cookie-banner__container">
        <div className="cookie-banner__content">
          <div className="cookie-banner__header-row">
            <div className="cookie-banner__text-block">
              <img
                src="/cookie.png"
                alt="Cookie"
                className="cookie-banner__icon"
              />
              <div className="cookie-banner__text">
                <p className="cookie-banner__title">A quick word about cookies</p>
                <p>
                  We use cookies to run our platform and understand how it is
                  used. Your privacy is not optional for us – this panel lets
                  you decide what is OK. Tap any type to learn more.
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="cookie-banner__close"
              aria-label="Close cookie banner"
            >
              <X className="cookie-banner__close-icon" />
            </button>
          </div>

          <div className="cookie-banner__categories">
            {CATEGORY_CONFIG.map(category => (
              <button
                key={category.key}
                type="button"
                className={`cookie-banner__category-pill${
                  selectedCategory === category.key
                    ? ' cookie-banner__category-pill--active'
                    : ''
                }`}
                onClick={() => setSelectedCategory(category.key)}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="cookie-banner__category-description">
            <p className="cookie-banner__category-title">
              {activeCategory.label}
            </p>
            <p>{activeCategory.description}</p>
          </div>

          <div className="cookie-banner__switches">
            {CATEGORY_CONFIG.map(category => (
              <div
                key={category.key}
                className={`cookie-banner__switch-row${
                  preferences[category.key]
                    ? ' cookie-banner__switch-row--on'
                    : ''
                }${
                  category.key === 'essential'
                    ? ' cookie-banner__switch-row--essential'
                    : ''
                }`}
              >
                <div className="cookie-banner__switch-labels">
                  <span className="cookie-banner__switch-title">
                    {category.label}
                  </span>
                  <span className="cookie-banner__switch-subtitle">
                    {category.key === 'analytics' && 'Anonymised usage data'}
                    {category.key === 'functional' &&
                      'Your preferences & settings'}
                    {category.key === 'marketing' &&
                      'Personalised content'}
                    {category.key === 'essential' &&
                      'Required for the platform to work'}
                  </span>
                </div>

                <label className="cookie-banner__switch-control">
                  <input
                    type="checkbox"
                    checked={preferences[category.key]}
                    disabled={category.key === 'essential'}
                    onChange={() => handleToggle(category.key)}
                    aria-label={`${category.label} cookies ${
                      category.key === 'essential' ? 'always on' : ''
                    }`}
                  />
                  <span className="cookie-banner__switch-slider" />
                  {category.key === 'essential' && (
                    <span className="cookie-banner__switch-badge cookie-banner__switch-badge--essential">
                      Always on
                    </span>
                  )}
                </label>
              </div>
            ))}
          </div>

          <div className="cookie-banner__footer">
            <Button
              onClick={handleSaveChoices}
              variant="outline"
              className="cookie-banner__button cookie-banner__button--decline"
            >
              Save my choices
            </Button>
            <Button
              onClick={handleAcceptAll}
              className="cookie-banner__button cookie-banner__button--accept"
            >
              Accept all
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookieBanner
