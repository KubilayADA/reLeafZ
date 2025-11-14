'use client'

import React from 'react'

const DEFAULT_STEPS = ['Anfrage', 'Versand', 'Beschwerden', 'Symptome'] as const

interface StepIndicatorProps {
  currentStep: number
  steps?: readonly string[]
}

export default function StepIndicator({ currentStep, steps = DEFAULT_STEPS }: StepIndicatorProps) {
  return (
    <div className="w-full mb-6 sm:mb-8 flex justify-center">
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {steps.map((label, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep
          const isCompleted = stepNumber < currentStep

          return (
            <div
              key={`${stepNumber}-${label}`}
              className={`h-1.5 sm:h-2 w-10 sm:w-14 rounded-full transition-colors duration-300 ${
                isActive
                  ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.45)]'
                  : isCompleted
                    ? 'bg-emerald-200'
                    : 'bg-gray-200'
              }`}
            >
              <span className="sr-only">
                Schritt {stepNumber}: {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}


