import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import '@/app/main.css'

interface Step7Props {
  onNext: (selectedOption: string) => void
  onBack?: () => void
}

type PositiveEffect =
  | 'pain-relief'
  | 'wellbeing'
  | 'relaxation'
  | 'none-negative-effects'

const options: Array<{ id: PositiveEffect; label: string }> = [
  { id: 'pain-relief', label: 'Schmerzlinderung' },
  { id: 'wellbeing', label: 'Wohlbefinden' },
  { id: 'relaxation', label: 'Ausgelassenheit' },
  { id: 'none-negative-effects', label: 'Keine - Ich hatte negative Auswirkungen' }
]

export default function Step7({ onNext, onBack }: Step7Props) {
  const [selectedOption, setSelectedOption] = useState<PositiveEffect | ''>('')

  const handleNext = () => {
    if (selectedOption) {
      onNext(selectedOption)
    }
  }

  return (
    <div className="min-h-screen bg-beige inconsolata">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col items-center">
        {onBack && (
          <div className="w-full flex justify-start mb-4 sm:mb-6">
            <Button
              onClick={onBack}
              className="btn-outline text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </div>
        )}

        <div className="text-center mb-8 sm:mb-12 px-2 sm:px-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Diagnose für dein Rezept
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Folge ein paar einfachen Schritten zu deinem Rezept.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-md px-4 sm:px-10 py-8 sm:py-12 w-full flex flex-col gap-10">
          <header className="text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Cannabis Behandlung
            </h2>
          </header>

          <section className="flex flex-col items-center gap-4 text-center">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              Welche positiven Auswirkungen hatte es?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Wähle deine Auswirkung.
            </p>

            <div className="w-full space-y-4">
              {options.map((option) => {
                const isSelected = selectedOption === option.id

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedOption(option.id)}
                    className={`
                      w-full rounded-2xl border transition-all duration-200 text-left
                      px-6 py-5 sm:px-7 sm:py-6 flex items-center justify-between shadow-sm
                      ${isSelected
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 bg-white hover:border-emerald-300'
                      }
                    `}
                  >
                    <p className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                      {option.label}
                    </p>
                    <span
                      className={`
                        ml-4 inline-flex h-5 w-5 items-center justify-center rounded-full border-2
                        ${isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}
                      `}
                    >
                      {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          <p className="text-xs sm:text-sm text-gray-500 text-center leading-relaxed">
            Falls du bereits eine Cannabis Behandlung mit negativen Auswirkungen hattest, kannst du kein Rezept von uns erhalten und musst erst einen Arzt aufsuchen.
          </p>

          <Button
            onClick={handleNext}
            disabled={!selectedOption}
            className="w-full btn-secondary py-3 sm:py-4 text-base sm:text-lg font-bold"
          >
            Weiter
          </Button>
        </div>
      </div>
    </div>
  )
}

