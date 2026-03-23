'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PHProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    posthog.init('phc_FFsEUEJmG8OUoAKFd7QFwXuhFLkyTFiSQbKDkZgunw9', {
      api_host: 'https://eu.i.posthog.com',
      defaults: '2026-01-30',
      capture_pageview: true,
    })
  }, [])

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
