'use client'

import { Brain, Zap } from 'lucide-react'

interface BrainPainIconProps {
  className?: string
}

export default function BrainPainIcon({ className = '' }: BrainPainIconProps) {
  return (
    <span className={`form-brain-pain-icon${className ? ` ${className}` : ''}`} aria-hidden="true">
      <Brain className="form-brain-pain-icon__brain" />
      <Zap className="form-brain-pain-icon__bolt" />
    </span>
  )
}
