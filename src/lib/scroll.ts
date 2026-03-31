/**
 * Landing page scroll helpers for fixed-hero + snapping main content.
 */

const HEADER_OFFSET = 70
const SWITCH_EPSILON = 2
const SWITCH_IDLE_MS = 90

function getLandingMainTop(): number {
  const landingMain = document.getElementById('landing-main')
  if (!landingMain) return window.innerHeight
  return landingMain.getBoundingClientRect().top + window.scrollY
}

function isAt(top: number): boolean {
  return Math.abs(window.scrollY - top) <= SWITCH_EPSILON
}

export function scrollToLandingTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/** Enter main view from hero, or scroll to #ablauf when already in main view. */
export function scrollLandingToAblauf(): void {
  const landingMainTop = getLandingMainTop()
  const stillOnHero = window.scrollY < Math.max(0, landingMainTop - 8)

  if (stillOnHero) {
    window.scrollTo({ top: landingMainTop, behavior: 'smooth' })
    return
  }

  const el = document.getElementById('ablauf')
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }
  try {
    window.history.pushState({}, '', '/#ablauf')
  } catch {
    /* ignore */
  }
}

/** True once the fixed hero has scrolled out of view (mobile docked nav). */
export function isLandingPastHero(): boolean {
  const hero = document.querySelector('.hero-section')
  if (!hero) return true
  return hero.getBoundingClientRect().bottom <= 0
}

/**
 * Enforce binary hero<->main switching near the bridge:
 * - scrolling down from hero snaps to main start
 * - scrolling up at main start snaps to hero
 * - never rests between those two positions
 */
export function attachLandingBinarySwitch(): () => void {
  let snapTimer: number | null = null
  let animating = false

  const settleTo = (targetTop: number) => {
    if (isAt(targetTop)) return
    animating = true
    window.scrollTo({ top: targetTop, behavior: 'smooth' })

    const startedAt = performance.now()
    const tick = () => {
      if (isAt(targetTop) || performance.now() - startedAt > 700) {
        animating = false
        return
      }
      window.requestAnimationFrame(tick)
    }
    window.requestAnimationFrame(tick)
  }

  const onWheel = (e: WheelEvent) => {
    const mainTop = getLandingMainTop()
    const y = window.scrollY
    const crossingBridge = y > SWITCH_EPSILON && y < mainTop - SWITCH_EPSILON

    if (Math.abs(e.deltaY) < 4 || animating) return

    // From hero toward main: hard snap to main start.
    if (e.deltaY > 0 && y < mainTop - SWITCH_EPSILON) {
      e.preventDefault()
      settleTo(mainTop)
      return
    }

    // From main start toward hero: hard snap back to top.
    if (e.deltaY < 0 && y <= mainTop + SWITCH_EPSILON) {
      e.preventDefault()
      settleTo(0)
      return
    }

    // If user lands between states, force nearest state on idle.
    if (crossingBridge) {
      if (snapTimer) window.clearTimeout(snapTimer)
      snapTimer = window.setTimeout(() => {
        const midpoint = mainTop / 2
        settleTo(window.scrollY < midpoint ? 0 : mainTop)
      }, SWITCH_IDLE_MS)
    }
  }

  const onScroll = () => {
    if (animating) return
    const mainTop = getLandingMainTop()
    const y = window.scrollY
    const crossingBridge = y > SWITCH_EPSILON && y < mainTop - SWITCH_EPSILON
    if (!crossingBridge) return

    if (snapTimer) window.clearTimeout(snapTimer)
    snapTimer = window.setTimeout(() => {
      const midpoint = mainTop / 2
      settleTo(window.scrollY < midpoint ? 0 : mainTop)
    }, SWITCH_IDLE_MS)
  }

  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('scroll', onScroll, { passive: true })

  return () => {
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('scroll', onScroll)
    if (snapTimer) window.clearTimeout(snapTimer)
  }
}
