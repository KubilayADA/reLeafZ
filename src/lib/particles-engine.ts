'use client'

import { initParticlesEngine } from '@tsparticles/react'
import { loadFull } from 'tsparticles'

let enginePromise: Promise<void> | null = null

/** Load tsparticles once for the whole app (multiple `<Particles />` instances are OK). */
export function ensureParticlesEngineLoaded(): Promise<void> {
  if (!enginePromise) {
    enginePromise = initParticlesEngine(async (engine) => {
      await loadFull(engine)
    })
  }
  return enginePromise
}
