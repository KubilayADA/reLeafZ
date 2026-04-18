'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { createContext, useContext, useEffect } from 'react'
import type { LandingTheme } from '@/lib/landing-theme'

const LandingThemeInitialContext = createContext<LandingTheme>('light')

export function useLandingThemeInitial(): LandingTheme {
  return useContext(LandingThemeInitialContext)
}

export function PHProvider({
  children,
  landingThemeInitial,
}: {
  children: React.ReactNode
  landingThemeInitial: LandingTheme
}) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      posthog.init(
        process.env.NEXT_PUBLIC_POSTHOG_KEY as string,
        {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
          person_profiles: 'identified_only',
          capture_pageview: false,
        }
      )
    }
  }, [])

  return (
    <PostHogProvider client={posthog}>
      <LandingThemeInitialContext.Provider value={landingThemeInitial}>
        {children}
      </LandingThemeInitialContext.Provider>
    </PostHogProvider>
  )
}
