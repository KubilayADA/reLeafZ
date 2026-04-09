/**
 * Full navigation to `/` (same effect as a browser refresh of the home page).
 * Use sparingly — e.g. workaround for layout state after leaving long-lived form flows.
 */
export function navigateHomeHard(): void {
  if (typeof window === 'undefined') return
  window.location.assign('/')
}
