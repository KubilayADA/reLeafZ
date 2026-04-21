'use client'

import { useEffect, useId, useState } from 'react'
import Particles from '@tsparticles/react'
import type { ISourceOptions } from '@tsparticles/engine'
import { ensureParticlesEngineLoaded } from '@/lib/particles-engine'
import { sectionParticlesOptions } from '@/constants/particles'

type Props = {
  className?: string
  /** Deep-merge is not applied; pass a full override if you need it */
  options?: ISourceOptions
}

export default function SectionParticlesBackground({ className, options }: Props): React.JSX.Element | null {
  const [ready, setReady] = useState(false)
  const reactId = useId().replace(/:/g, '')

  useEffect(() => {
    let cancelled = false
    ensureParticlesEngineLoaded().then(() => {
      if (!cancelled) setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const opts = options ?? sectionParticlesOptions

  if (!ready) return null

  return (
    <Particles
      id={`section-particles-${reactId}`}
      className={className}
      options={opts}
    />
  )
}
