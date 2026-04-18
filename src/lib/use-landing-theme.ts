'use client'

import { useCallback, useEffect, useSyncExternalStore } from 'react'
import {
  applyLandingThemeToDocument,
  getLandingThemeClientSnapshot,
  mirrorLandingThemeHtmlOnly,
  notifyLandingThemeChange,
  subscribeLandingTheme,
  type LandingTheme,
} from '@/lib/landing-theme'

/**
 * Landing light/dark from localStorage + cookie. Pass `serverSnapshot` from `cookies()` so
 * `useSyncExternalStore` hydrates with the same value the server used (refresh keeps theme).
 */
export function useLandingTheme(serverSnapshot: LandingTheme): [
  LandingTheme,
  (update: LandingTheme | ((prev: LandingTheme) => LandingTheme)) => void,
] {
  const getServerSnapshot = useCallback(() => serverSnapshot, [serverSnapshot])

  const theme = useSyncExternalStore(
    subscribeLandingTheme,
    getLandingThemeClientSnapshot,
    getServerSnapshot
  )

  useEffect(() => {
    mirrorLandingThemeHtmlOnly(theme)
  }, [theme])

  const setTheme = useCallback(
    (update: LandingTheme | ((prev: LandingTheme) => LandingTheme)) => {
      const current = getLandingThemeClientSnapshot()
      const next = typeof update === 'function' ? update(current) : update
      applyLandingThemeToDocument(next)
      notifyLandingThemeChange()
    },
    []
  )

  return [theme, setTheme]
}
