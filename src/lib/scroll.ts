/**
 * Landing page scroll helpers for fixed-hero + snapping main content.
 */

const HEADER_OFFSET = 70
const SWITCH_EPSILON = 2
const SWITCH_IDLE_MS = 90
const MOBILE_SWITCH_IDLE_MS = 140

function isMobileScrollMode(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(max-width: 900px), (pointer: coarse)').matches
}

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
  let isTouching = false
  let lockUntil = 0
  let mobileMode = isMobileScrollMode()
  let lastScrollY = window.scrollY
  let lastScrollTs = performance.now()

  const refreshMode = () => {
    mobileMode = isMobileScrollMode()
  }

  const settleTo = (targetTop: number) => {
    if (isAt(targetTop)) return
    animating = true
    lockUntil = Date.now() + (mobileMode ? 320 : 420)
    window.scrollTo({ top: targetTop, behavior: 'smooth' })

    const startedAt = performance.now()
    const tick = () => {
      if (isAt(targetTop) || performance.now() - startedAt > (mobileMode ? 900 : 700)) {
        animating = false
        return
      }
      window.requestAnimationFrame(tick)
    }
    window.requestAnimationFrame(tick)
  }

  const onWheel = (e: WheelEvent) => {
    if (mobileMode) return
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
    if (Date.now() < lockUntil) return
    const mainTop = getLandingMainTop()
    const y = window.scrollY
    const crossingBridge = y > SWITCH_EPSILON && y < mainTop - SWITCH_EPSILON
    const now = performance.now()
    const dt = Math.max(1, now - lastScrollTs)
    const dy = y - lastScrollY
    const velocity = dy / dt
    lastScrollY = y
    lastScrollTs = now
    if (!crossingBridge) return

    if (mobileMode && isTouching) return

    if (snapTimer) window.clearTimeout(snapTimer)
    snapTimer = window.setTimeout(() => {
      const currentY = window.scrollY
      const midpoint = mainTop / 2
      settleTo(currentY < midpoint ? 0 : mainTop)
    }, mobileMode ? MOBILE_SWITCH_IDLE_MS : SWITCH_IDLE_MS)
  }

  const onTouchStart = (e: TouchEvent) => {
    isTouching = true
  }
  const onTouchEnd = () => {
    isTouching = false
    if (snapTimer) window.clearTimeout(snapTimer)
    snapTimer = window.setTimeout(() => {
      const mainTop = getLandingMainTop()
      const y = window.scrollY
      if (!(y > SWITCH_EPSILON && y < mainTop - SWITCH_EPSILON)) return
      const midpoint = mainTop / 2
      settleTo(y < midpoint ? 0 : mainTop)
    }, MOBILE_SWITCH_IDLE_MS)
  }

  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchend', onTouchEnd, { passive: true })
  window.addEventListener('resize', refreshMode)

  return () => {
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchend', onTouchEnd)
    window.removeEventListener('resize', refreshMode)
    if (snapTimer) window.clearTimeout(snapTimer)
  }
}
