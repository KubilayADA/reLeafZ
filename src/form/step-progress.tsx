'use client'

import React from 'react'

interface StepProgressProps {
  currentStep: number
  totalSteps?: number
}

export default function StepProgress({ currentStep, totalSteps = 4 }: StepProgressProps) {
  const safeCurrentStep = Math.min(Math.max(currentStep, 1), totalSteps)
  const completionRatio = totalSteps > 1 ? (safeCurrentStep - 1) / (totalSteps - 1) : 1
  const progressPercent = Math.round(completionRatio * 100)
  const remainingSteps = totalSteps - safeCurrentStep

  return (
    <div className="form-progress">
      <div className="form-progress__stack">
        <div
          className="form-progress__track"
          role="progressbar"
          aria-label="Formularfortschritt"
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-valuenow={safeCurrentStep}
          aria-valuetext={`Schritt ${safeCurrentStep} von ${totalSteps}, ${progressPercent}% abgeschlossen`}
        >
          <span
            className="form-progress__fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <p className="form-progress__summary">
          Schritt {safeCurrentStep} von {totalSteps} - {progressPercent}% abgeschlossen
          {remainingSteps > 0 ? ` (${remainingSteps} ${remainingSteps === 1 ? 'Schritt' : 'Schritte'} verbleibend)` : ''}
        </p>
      </div>
    </div>
  )
}
