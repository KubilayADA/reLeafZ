/**
 * Landing page scroll helpers for fixed-hero + snapping main content.
 */

const HEADER_OFFSET = 70
const SWITCH_EPSILON = 2
const WHEEL_DELTA_THRESHOLD = 4
const MOBILE_LANDING_MQ = '(max-width: 767px)'
const MOBILE_NAV_CLEARANCE_FALLBACK = 70

let activeScrollFrame = 0
let landingProgrammaticScrollActive = false

function isMobileLandingViewport(): boolean {
  return window.matchMedia(MOBILE_LANDING_MQ).matches
}

function easeOutQuint(t: number): number {
  return 1 - Math.pow(1 - t, 5)
}

function easeInOutQuart(t: number): number {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2
}

function setLandingProgrammaticScroll(active: boolean): void {
  if (isMobileLandingViewport()) return

  landingProgrammaticScrollActive = active
  if (active) {
    document.documentElement.dataset.landingProgrammaticScroll = 'true'
  } else {
    delete document.documentElement.dataset.landingProgrammaticScroll
  }
  if (typeof document !== 'undefined') {
    document.documentElement.style.overflowY = active ? 'hidden' : ''
  }
}

export function isLandingProgrammaticScrollActive(): boolean {
  return landingProgrammaticScrollActive
}

function getScrollDuration(distance: number): number {
  const abs = Math.abs(distance)
  const viewport = window.innerHeight || 800
  const ratio = abs / viewport
  return Math.min(1050, Math.max(780, 780 + ratio * 180))
}

function smoothScrollLandingTo(targetTop: number): void {
  const clampedTarget = Math.max(0, targetTop)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (isMobileLandingViewport()) {
    window.scrollTo({
      top: clampedTarget,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
    return
  }

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

  const duration = getScrollDuration(distance)
  const startTime = performance.now()
  const ease = distance > 0 ? easeOutQuint : easeInOutQuart

  setLandingProgrammaticScroll(true)

  const finish = () => {
    if (frameId !== activeScrollFrame) return
    window.scrollTo({ top: clampedTarget, behavior: 'auto' })
    setLandingProgrammaticScroll(false)
  }

  const step = (now: number) => {
    if (frameId !== activeScrollFrame) return

    const progress = Math.min((now - startTime) / duration, 1)
    const nextTop = startTop + distance * ease(progress)
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

function getSectionScrollTop(sectionId: string, extraScrollDown = 0): number | null {
  const el = document.getElementById(sectionId)
  if (!el) return null
  return el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET + extraScrollDown
}

function isOnFixedHero(): boolean {
  const landingMainTop = getLandingMainTop()
  return window.scrollY < Math.max(0, landingMainTop - 8)
}

/** Scroll target when leaving the hero for the landing sections. */
function getHeroToLandingTarget(): number {
  const funktioniertTop = getSectionScrollTop('how-funktioniert')
  if (funktioniertTop !== null && funktioniertTop > window.scrollY + SWITCH_EPSILON) {
    return funktioniertTop
  }
  return getLandingMainTop()
}

function isInHeroLandingBridge(y = window.scrollY): boolean {
  const landingTarget = getHeroToLandingTarget()
  return y > SWITCH_EPSILON && y < landingTarget - SWITCH_EPSILON
}

function isEditableKeyTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  return target.isContentEditable
}

export function scrollToLandingTop(): void {
  smoothScrollLandingTo(0)
}

/** Smooth-scroll to a landing section by id (accounts for fixed header). */
export function scrollLandingToSection(
  sectionId: string,
  options?: { extraScrollDown?: number; updateUrl?: boolean },
): void {
  const el = document.getElementById(sectionId)
  if (!el) return
  const extraScrollDown = options?.extraScrollDown ?? 0
  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET + extraScrollDown
  smoothScrollLandingTo(top)
  if (options?.updateUrl === false) return
  try {
    window.history.pushState({}, '', `/#${sectionId}`)
  } catch {
    /* ignore */
  }
}

export function scrollLandingToPartnerApotheken(): void {
  scrollLandingToSection('partner-apotheken')
}

function getMobileNavbarClearance(): number {
  const mnav = document.querySelector<HTMLElement>('.mnav')
  if (!mnav) return MOBILE_NAV_CLEARANCE_FALLBACK

  const topPx = Number.parseFloat(getComputedStyle(mnav).top) || 12
  const height = mnav.getBoundingClientRect().height || 44
  return topPx + height - 58
}

/** Mobile discover scroll position (blue line below mnav); no URL change. */
function getMobileDiscoverScrollTarget(): number | null {
  const funktioniert = document.getElementById('how-funktioniert')
  if (!funktioniert) return getMobileHeroScrollTarget()

  const clearance = getMobileNavbarClearance()
  return funktioniert.getBoundingClientRect().top + window.scrollY - clearance
}

function getMobileHeroScrollTarget(): number | null {
  const mobileHero = document.querySelector('.mobile-hero')
  if (!mobileHero) return null
  const rect = mobileHero.getBoundingClientRect()
  if (rect.height <= 0) return null
  return rect.bottom + window.scrollY - HEADER_OFFSET
}

/** Smooth transition from hero into the landing sections (bottom CTA / ENTDECKEN). */
export function scrollHeroToLanding(options?: { updateUrl?: boolean }): void {
  const updateUrl = options?.updateUrl === true

  if (isMobileLandingViewport()) {
    scrollLandingToMain()
    return
  }

  if (!isOnFixedHero()) {
    scrollLandingToSection('how-funktioniert', { updateUrl })
    return
  }

  smoothScrollLandingTo(getHeroToLandingTarget())
  if (!updateUrl) return
  try {
    window.history.pushState({}, '', '/#how-funktioniert')
  } catch {
    /* ignore */
  }
}

/** Scroll from hero into the next content block (no section anchor / URL change). */
export function scrollLandingToMain(): void {
  if (isOnFixedHero()) {
    scrollHeroToLanding()
    return
  }

  if (isMobileLandingViewport()) {
    const mobileTarget = getMobileDiscoverScrollTarget()
    if (mobileTarget !== null && mobileTarget > window.scrollY + SWITCH_EPSILON) {
      smoothScrollLandingTo(mobileTarget)
    }
    return
  }

  scrollLandingToSection('how-funktioniert', { updateUrl: false })
}

/** Scroll to the standalone funktioniert section. */
export function scrollLandingToFunktioniert(): void {
  scrollLandingToSection('how-funktioniert')
}

/** Enter main view from hero, or scroll to #how-funktioniert when already in main view. */
export function scrollLandingToAblauf(): void {
  scrollHeroToLanding({ updateUrl: true })
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
 * Enforce binary hero<->landing switching:
 * - no manual scrolling in the bridge zone (only programmatic animation)
 * - wheel / touch gestures trigger a full animated transition
 */
export function attachLandingBinarySwitch(): () => void {
  const mq = window.matchMedia(MOBILE_LANDING_MQ)
  if (mq.matches) return () => {}

  let pendingGesture: 'down' | 'up' | null = null
  let touchLastY = 0

  const isHeroAccordionBlockingScroll = () => {
    if (document.documentElement.dataset.heroAccordionOpen !== 'true') return false
    const hero = document.getElementById('hero')
    if (!hero) return true
    const heroBottom = hero.getBoundingClientRect().bottom + window.scrollY
    return window.scrollY < heroBottom - HEADER_OFFSET - SWITCH_EPSILON
  }

  const settleTo = (targetTop: number) => {
    if (isAt(targetTop) || landingProgrammaticScrollActive) return
    pendingGesture = null
    smoothScrollLandingTo(targetTop)
  }

  const snapBridgeToNearest = (y = window.scrollY) => {
    const landingTarget = getHeroToLandingTarget()
    settleTo(y < landingTarget / 2 ? 0 : landingTarget)
  }

  const onWheel = (e: WheelEvent) => {
    if (isHeroAccordionBlockingScroll()) return

    const mainTop = getLandingMainTop()
    const landingTarget = getHeroToLandingTarget()
    const y = window.scrollY

    if (landingProgrammaticScrollActive) {
      e.preventDefault()
      return
    }

    if (isInHeroLandingBridge(y)) {
      e.preventDefault()
      if (Math.abs(e.deltaY) < WHEEL_DELTA_THRESHOLD) return
      snapBridgeToNearest(y)
      return
    }

    if (Math.abs(e.deltaY) < WHEEL_DELTA_THRESHOLD) return

    if (e.deltaY > 0 && y < mainTop - SWITCH_EPSILON) {
      e.preventDefault()
      settleTo(landingTarget)
      return
    }

    if (e.deltaY < 0 && y <= mainTop + SWITCH_EPSILON) {
      e.preventDefault()
      settleTo(0)
    }
  }

  const onScroll = () => {
    if (landingProgrammaticScrollActive || isHeroAccordionBlockingScroll()) return

    const y = window.scrollY
    if (!isInHeroLandingBridge(y)) return

    snapBridgeToNearest(y)
  }

  const onTouchStart = (e: TouchEvent) => {
    pendingGesture = null
    touchLastY = e.touches[0]?.clientY ?? 0
  }

  const onTouchMove = (e: TouchEvent) => {
    if (isHeroAccordionBlockingScroll() || landingProgrammaticScrollActive) {
      e.preventDefault()
      return
    }

    const y = window.scrollY
    const mainTop = getLandingMainTop()

    if (isInHeroLandingBridge(y)) {
      e.preventDefault()
      return
    }

    if (y < mainTop - SWITCH_EPSILON || y <= mainTop + SWITCH_EPSILON) {
      e.preventDefault()
    }

    if (e.touches.length !== 1) return

    const touchY = e.touches[0].clientY
    const deltaY = touchY - touchLastY
    touchLastY = touchY

    if (Math.abs(deltaY) < 6) return

    if (deltaY < 0 && y < mainTop - SWITCH_EPSILON) {
      pendingGesture = 'down'
    } else if (deltaY > 0 && y <= mainTop + SWITCH_EPSILON) {
      pendingGesture = 'up'
    }
  }

  const onTouchEnd = () => {
    if (landingProgrammaticScrollActive || isHeroAccordionBlockingScroll()) return

    const y = window.scrollY
    const landingTarget = getHeroToLandingTarget()

    if (isInHeroLandingBridge(y)) {
      snapBridgeToNearest(y)
      pendingGesture = null
      return
    }

    if (pendingGesture === 'down') {
      settleTo(landingTarget)
    } else if (pendingGesture === 'up') {
      settleTo(0)
    }

    pendingGesture = null
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (isEditableKeyTarget(e.target)) return
    if (landingProgrammaticScrollActive || isHeroAccordionBlockingScroll()) return

    const y = window.scrollY
    const mainTop = getLandingMainTop()
    const landingTarget = getHeroToLandingTarget()
    const scrollKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ']

    if (!scrollKeys.includes(e.key)) return

    if (isInHeroLandingBridge(y)) {
      e.preventDefault()
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'End' || e.key === ' ') {
        settleTo(landingTarget)
      } else {
        settleTo(0)
      }
      return
    }

    if ((e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ' || e.key === 'End') && y < mainTop - SWITCH_EPSILON) {
      e.preventDefault()
      settleTo(landingTarget)
      return
    }

    if ((e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'Home') && y <= mainTop + SWITCH_EPSILON) {
      e.preventDefault()
      settleTo(0)
    }
  }

  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchmove', onTouchMove, { passive: false })
  window.addEventListener('touchend', onTouchEnd, { passive: true })
  window.addEventListener('keydown', onKeyDown)

  return () => {
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchend', onTouchEnd)
    window.removeEventListener('keydown', onKeyDown)
    document.documentElement.style.overflowY = ''
  }
}
