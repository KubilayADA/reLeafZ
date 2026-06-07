'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { usePostHog } from 'posthog-js/react'

const COOKIE_STORAGE_KEY = 'cookieConsentPreferences'

function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = window.localStorage.getItem(COOKIE_STORAGE_KEY)
    if (!raw) return false
    const parsed = JSON.parse(raw) as { analytics?: boolean }
    return parsed.analytics === true
  } catch {
    return false
  }
}

export default function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false)

  useEffect(() => {
    setAnalyticsAllowed(hasAnalyticsConsent())
    const handler = () => setAnalyticsAllowed(hasAnalyticsConsent())
    window.addEventListener('storage', handler)
    window.addEventListener('cookieConsentChanged', handler)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('cookieConsentChanged', handler)
    }
  }, [])

  useEffect(() => {
    if (!analyticsAllowed) return
    if (pathname && posthog) {
      let url = window.location.origin + pathname
      if (searchParams.toString()) {
        url = url + '?' + searchParams.toString()
      }
      posthog.capture('$pageview', { '$current_url': url })
    }
  }, [pathname, searchParams, posthog, analyticsAllowed])

  return null
}
