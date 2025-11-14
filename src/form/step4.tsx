import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import StepIndicator from '@/form/StepIndicator'
import '@/app/main.css'

interface Step4Props {
  onNext: (answers: { onset: string; frequency: string }) => void
  onBack?: () => void
}

type OnsetOption = 'more-than-3-months' | 'less-than-3-months'
type FrequencyOption = 'always' | 'often' | 'never'

export default function Step4({ onNext, onBack }: Step4Props) {
  const [selectedOnset, setSelectedOnset] = useState<OnsetOption | ''>('')
  const [selectedFrequency, setSelectedFrequency] = useState<FrequencyOption | ''>('')

  const onsetOptions = [
    {
      id: 'more-than-3-months' as OnsetOption,
      title: 'Vor mehr als 3 Monaten',
      description: 'Die Beschwerden bestehen seit längerem'
    },
    {
      id: 'less-than-3-months' as OnsetOption,
      title: 'Vor weniger als 3 Monaten',
      description: 'Die Beschwerden traten vor kurzem auf'
    }
  ]

  const frequencyOptions = [
    {
      id: 'always' as FrequencyOption,
      title: 'Ständig',
      description: 'Die Beschwerden sind dauerhaft vorhanden'
    },
    {
      id: 'often' as FrequencyOption,
      title: 'Oft',
      description: 'Die Beschwerden treten regelmäßig auf'
    },
    {
      id: 'never' as FrequencyOption,
      title: 'Nie',
      description: 'Die Beschwerden sind nicht mehr vorhanden'
    }
  ]

  const handleNext = () => {
    if (selectedOnset && selectedFrequency) {
      onNext({
        onset: selectedOnset,
        frequency: selectedFrequency
      })
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

        <StepIndicator currentStep={4} />

        <div className="text-center mb-8 sm:mb-12 px-2 sm:px-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Diagnose für dein Rezept
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Folge ein paar einfachen Schritten zu deinem Rezept.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-md px-4 sm:px-10 py-8 sm:py-12 w-full flex flex-col gap-10">
          <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-900">
            Symptome
          </h2>

          <div className="space-y-12">
            <section className="text-center">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                Wann traten deine Symptome auf?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-6">
                Bitte wähle einen Zeitraum.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                {onsetOptions.map((option) => {
                  const isSelected = selectedOnset === option.id

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedOnset(option.id)}
                      className={`
                        w-full max-w-xs rounded-2xl border transition-all duration-200
                        px-6 py-5 sm:px-7 sm:py-6 text-left shadow-sm
                        ${isSelected
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 bg-white hover:border-emerald-300'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                            {option.title}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-snug">
                            {option.description}
                          </p>
                        </div>
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

            <section className="text-center">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                Wie häufig treten die Symptome bei dir auf?
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-6">
                Bitte wähle einen Zeitraum.
              </p>

              <div className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                {frequencyOptions.map((option) => {
                  const isSelected = selectedFrequency === option.id

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedFrequency(option.id)}
                      className={`
                        w-full max-w-xs rounded-2xl border transition-all duration-200
                        px-6 py-5 sm:px-7 sm:py-6 text-left shadow-sm
                        ${isSelected
                          ? 'border-emerald-500 bg-emerald-50'
                          : 'border-gray-200 bg-white hover:border-emerald-300'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                            {option.title}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 mt-2 leading-snug">
                            {option.description}
                          </p>
                        </div>
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
          </div>

          <p className="text-xs sm:text-sm text-red-500 text-center">
            Falls deine Symptome vor weniger als 3 Monaten und Nie auftreten, kannst du kein Rezept von uns erhalten und musst erst einen Arzt aufsuchen.
          </p>

          <Button
            onClick={handleNext}
            disabled={!selectedOnset || !selectedFrequency}
            className="w-full btn-secondary mt-10 py-3 sm:py-4 text-base sm:text-lg font-bold"
          >
            Weiter
          </Button>
        </div>
      </div>
    </div>
  )
}

