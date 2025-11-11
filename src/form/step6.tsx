import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import '@/app/main.css'

interface Step6Props {
  onNext: (selectedOption: string) => void
  onBack?: () => void
}

type PrescriptionHistory = 'yes' | 'no'

const options: Array<{ id: PrescriptionHistory; label: string }> = [
  { id: 'yes', label: 'Ja' },
  { id: 'no', label: 'Nein' }
]

export default function Step6({ onNext, onBack }: Step6Props) {
  const [selectedOption, setSelectedOption] = useState<PrescriptionHistory | ''>('')

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
              Wurde dir in Deutschland in der Vergangenheit bereits Cannabis verschrieben?
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center w-full">
              {options.map((option) => {
                const isSelected = selectedOption === option.id

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedOption(option.id)}
                    className={`
                      w-full max-w-xs rounded-2xl border transition-all duration-200 text-left
                      px-6 py-5 sm:px-7 sm:py-6 flex flex-col gap-2 shadow-sm
                      ${isSelected
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-gray-200 bg-white hover:border-emerald-300'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                        {option.label}
                      </p>
                      <span
                        className={`
                          mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border-2
                          ${isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}
                        `}
                      >
                        {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

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

