/* LOCAL ACCESS BYPASS BLOCK START */
/**
 * Toggle local access bypass for development.
 * Set to `true` to allow direct access to guarded flows locally.
 */
export const ENABLE_LOCAL_ACCESS_BYPASS = false

export const isBrowserLocalhost = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
}

export const isLocalAccessBypassEnabled = (): boolean =>
  ENABLE_LOCAL_ACCESS_BYPASS && isBrowserLocalhost()
/* LOCAL ACCESS BYPASS BLOCK END */
