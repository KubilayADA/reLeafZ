/** Persisted landing page light/dark (cookies + localStorage; see `use-landing-theme.ts`, `layout.tsx`). */
export const LANDING_THEME_STORAGE_KEY = 'releafz-landing-theme' as const

export const LANDING_THEME_HTML_ATTR = 'data-releafz-landing-theme' as const

/** Dispatched after same-tab writes so `useSyncExternalStore` re-reads localStorage. */
export const LANDING_THEME_CHANGE_EVENT = 'releafz-landing-theme-change' as const

const COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 365

export type LandingTheme = 'dark' | 'light'

export function landingThemeFromCookieValue(value: string | undefined): LandingTheme {
  return value === 'dark' || value === 'light' ? value : 'light'
}

export function readLandingThemeFromStorage(): LandingTheme | null {
  if (typeof window === 'undefined') return null
  try {
    const v = window.localStorage.getItem(LANDING_THEME_STORAGE_KEY)
    if (v === 'dark' || v === 'light') return v
  } catch {
    /* private mode / blocked storage */
  }
  return null
}

function readLandingThemeFromCookieString(): LandingTheme | null {
  if (typeof document === 'undefined') return null
  try {
    const raw = `; ${document.cookie}`
    const part = raw.split(`; ${LANDING_THEME_STORAGE_KEY}=`)
    if (part.length !== 2) return null
    const v = part.pop()?.split(';').shift()?.trim()
    return v === 'dark' || v === 'light' ? v : null
  } catch {
    return null
  }
}

/** Client snapshot: localStorage wins; then cookie; then <html> attr (bootstrap script). */
export function getLandingThemeClientSnapshot(): LandingTheme {
  if (typeof window === 'undefined') return 'light'
  return (
    readLandingThemeFromStorage()
    ?? readLandingThemeFromCookieString()
    ?? readLandingThemeFromHtmlAttr()
    ?? 'light'
  )
}

function readLandingThemeFromHtmlAttr(): LandingTheme | null {
  const v = document.documentElement.getAttribute(LANDING_THEME_HTML_ATTR)
  return v === 'dark' || v === 'light' ? v : null
}

export function subscribeLandingTheme(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const onStorage = () => onStoreChange()
  const onCustom = () => onStoreChange()
  window.addEventListener('storage', onStorage)
  window.addEventListener(LANDING_THEME_CHANGE_EVENT, onCustom)
  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener(LANDING_THEME_CHANGE_EVENT, onCustom)
  }
}

function setClientCookie(theme: LandingTheme): void {
  if (typeof document === 'undefined') return
  document.cookie = `${LANDING_THEME_STORAGE_KEY}=${theme};path=/;max-age=${COOKIE_MAX_AGE_SEC};SameSite=Lax`
}

/** Full persist (user toggle): storage + cookie + <html> attr. */
export function applyLandingThemeToDocument(theme: LandingTheme): void {
  if (typeof window === 'undefined') return
  try {
    document.documentElement.setAttribute(LANDING_THEME_HTML_ATTR, theme)
    window.localStorage.setItem(LANDING_THEME_STORAGE_KEY, theme)
    setClientCookie(theme)
  } catch {
    /* ignore */
  }
}

/** Sync <html> only — does not write localStorage (avoids clobbering on a stale SSR snapshot). */
export function mirrorLandingThemeHtmlOnly(theme: LandingTheme): void {
  if (typeof window === 'undefined') return
  try {
    document.documentElement.setAttribute(LANDING_THEME_HTML_ATTR, theme)
  } catch {
    /* ignore */
  }
}

export function notifyLandingThemeChange(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(LANDING_THEME_CHANGE_EVENT))
}
