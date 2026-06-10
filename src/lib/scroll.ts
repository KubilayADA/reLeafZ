/**
 * Landing page scroll helpers for fixed-hero + snapping main content.
 */

const HEADER_OFFSET = 70
const SWITCH_EPSILON = 2
const SWITCH_IDLE_MS = 90

let activeScrollFrame = 0
let landingProgrammaticScrollActive = false

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function setLandingProgrammaticScroll(active: boolean): void {
  landingProgrammaticScrollActive = active
  if (active) {
    document.documentElement.dataset.landingProgrammaticScroll = 'true'
  } else {
    delete document.documentElement.dataset.landingProgrammaticScroll
  }
}

export function isLandingProgrammaticScrollActive(): boolean {
  return landingProgrammaticScrollActive
}

function smoothScrollLandingTo(targetTop: number): void {
  const clampedTarget = Math.max(0, targetTop)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  activeScrollFrame += 1
  const frameId = activeScrollFrame

  if (prefersReducedMotion) {
    window.scrollTo({ top: clampedTarget, behavior: 'auto' })
    return
  }

  const startTop = window.scrollY
  const distance = clampedTarget - startTop

  if (Math.abs(distance) < 2) {
    window.scrollTo({ top: clampedTarget, behavior: 'auto' })
    return
  }

  const duration = Math.min(1400, Math.max(650, Math.abs(distance) * 0.55))
  const startTime = performance.now()

  setLandingProgrammaticScroll(true)

  const finish = () => {
    if (frameId !== activeScrollFrame) return
    window.scrollTo({ top: clampedTarget, behavior: 'auto' })
    setLandingProgrammaticScroll(false)
  }

  const step = (now: number) => {
    if (frameId !== activeScrollFrame) return

    const progress = Math.min((now - startTime) / duration, 1)
    const nextTop = startTop + distance * easeInOutCubic(progress)
    window.scrollTo({ top: nextTop, behavior: 'auto' })

    if (progress < 1) {
      window.requestAnimationFrame(step)
      return
    }

    finish()
  }

  window.requestAnimationFrame(step)
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
  smoothScrollLandingTo(0)
}

/** Smooth-scroll to a landing section by id (accounts for fixed header). */
export function scrollLandingToSection(
  sectionId: string,
  options?: { extraScrollDown?: number },
): void {
  const el = document.getElementById(sectionId)
  if (!el) return
  const extraScrollDown = options?.extraScrollDown ?? 0
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET + extraScrollDown
  smoothScrollLandingTo(top)
  try {
    window.history.pushState({}, '', `/#${sectionId}`)
  } catch {
    /* ignore */
  }
}

export function scrollLandingToPartnerApotheken(): void {
  scrollLandingToSection('partner-apotheken')
}

function isMobileLandingViewport(): boolean {
  return window.matchMedia('(max-width: 767px)').matches
}

function getMobileHeroScrollTarget(): number | null {
  const mobileHero = document.querySelector('.mobile-hero')
  if (!mobileHero) return null
  const rect = mobileHero.getBoundingClientRect()
  if (rect.height <= 0) return null
  return rect.bottom + window.scrollY - HEADER_OFFSET
}

/** Scroll from hero into the next content block (no section anchor / URL change). */
export function scrollLandingToMain(): void {
  const landingMainTop = getLandingMainTop()
  const stillOnFixedHero = window.scrollY < Math.max(0, landingMainTop - 8)

  if (stillOnFixedHero) {
    smoothScrollLandingTo(landingMainTop)
    return
  }

  const mobileTarget = isMobileLandingViewport() ? getMobileHeroScrollTarget() : null
  if (mobileTarget !== null && mobileTarget > window.scrollY + SWITCH_EPSILON) {
    smoothScrollLandingTo(mobileTarget)
    return
  }

  smoothScrollLandingTo(window.scrollY + window.innerHeight * 0.9)
}

/** Scroll to the standalone funktioniert section. */
export function scrollLandingToFunktioniert(): void {
  scrollLandingToSection('how-funktioniert')
}

/** Enter main view from hero, or scroll to #how-funktioniert when already in main view. */
export function scrollLandingToAblauf(): void {
  const landingMainTop = getLandingMainTop()
  const stillOnHero = window.scrollY < Math.max(0, landingMainTop - 8)

  if (stillOnHero) {
    smoothScrollLandingTo(landingMainTop)
    return
  }

  scrollLandingToSection('how-funktioniert')
}

/** True once the fixed hero has scrolled out of view (mobile docked nav). */
export function isLandingPastHero(): boolean {
  const landingMain = document.getElementById('landing-main')
  if (landingMain) {
    // Primary signal: once main content reaches the top bridge, show mobile navbar.
    return landingMain.getBoundingClientRect().top <= HEADER_OFFSET + SWITCH_EPSILON
  }

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
  const mq = window.matchMedia('(max-width: 767px)')
  if (mq.matches) return () => {}

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

  const isHeroAccordionBlockingScroll = () => {
    if (document.documentElement.dataset.heroAccordionOpen !== 'true') return false
    const hero = document.getElementById('hero')
    if (!hero) return true
    const heroBottom = hero.getBoundingClientRect().bottom + window.scrollY
    return window.scrollY < heroBottom - HEADER_OFFSET - SWITCH_EPSILON
  }

  const onWheel = (e: WheelEvent) => {
    if (landingProgrammaticScrollActive || isHeroAccordionBlockingScroll()) return

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
    if (landingProgrammaticScrollActive || animating || isHeroAccordionBlockingScroll()) return
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
