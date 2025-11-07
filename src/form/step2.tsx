'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Bike, Package, Mail, Info } from 'lucide-react'
import '@/app/main.css'

interface Step2Props {
  onNext: (selectedOption: string) => void
  onBack?: () => void
}

type DeliveryOption = 'courier' | 'shipping' | 'prescription-only'

export default function Step2({ onNext, onBack }: Step2Props) {
  const [selectedOption, setSelectedOption] = useState<DeliveryOption | ''>('')
  const [pharmacyEmail, setPharmacyEmail] = useState<string>('')

  const options = [
    {
      id: 'courier' as DeliveryOption,
      title: 'Rezept + Kurier: 60-90min',
      description: 'Mo-So: 09-21:30 Uhr | Die Herz Apotheke Berlin',
      icon: Bike,
      time: '60-90min'
    },
    {
      id: 'shipping' as DeliveryOption,
      title: 'Rezept + Versand: 1-2 Tage',
      description: 'Internationale HBF Apotheke München',
      icon: Package,
      time: '1-2 Tage'
    },
    {
      id: 'prescription-only' as DeliveryOption,
      title: 'Nur Rezept - Keine Lieferung: 2-7 Tage',
      description: 'Einlösen bei einer Apotheke deiner Wahl',
      icon: Mail,
      time: '2-7 Tage'
    }
  ]

  const handleNext = () => {
    if (selectedOption) {
      // If prescription-only is selected, include pharmacy email
      if (selectedOption === 'prescription-only' && pharmacyEmail.trim()) {
        onNext(`${selectedOption}:${pharmacyEmail}`)
      } else if (selectedOption !== 'prescription-only') {
        onNext(selectedOption)
      }
    }
  }

  return (
    <div className="min-h-screen bg-beige inconsolata">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        {onBack && (
          <div className="mb-4 sm:mb-6">
            <Button
              onClick={onBack}
              className="btn-outline text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4 overflow-x-auto">
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-sm sm:text-base">
                1
              </div>
              <span className="font-medium text-gray-500 text-xs sm:text-sm md:text-base hidden sm:inline">Anfrage</span>
            </div>
            <div className="w-8 sm:w-16 h-0.5 bg-gray-300 flex-shrink-0"></div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm sm:text-base">
                2
              </div>
              <span className="font-medium text-emerald-600 text-xs sm:text-sm md:text-base hidden sm:inline">Produktauswahl</span>
              <span className="font-medium text-emerald-600 text-xs sm:hidden">Produkt</span>
            </div>
            <div className="w-8 sm:w-16 h-0.5 bg-gray-300 flex-shrink-0"></div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-sm sm:text-base">
                3
              </div>
              <span className="font-medium text-gray-500 text-xs sm:text-sm md:text-base hidden sm:inline">Anfrage absenden</span>
              <span className="font-medium text-gray-500 text-xs sm:hidden">Absenden</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl md:text-2xl font-bold title-gradient mb-4 sm:mb-6">
            Falls ein Rezept ausgestellt wird, wie möchtest du deine Medikamente erhalten?
          </h2>
          
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
            Berlin: Wähle deine Versandart und Apotheke aus *
          </p>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {options.map((option) => {
              const Icon = option.icon
              const isSelected = selectedOption === option.id
              
              return (
                <div
                  key={option.id}
                  onClick={() => {
                    setSelectedOption(option.id)
                    // Clear pharmacy email if switching away from prescription-only
                    if (option.id !== 'prescription-only') {
                      setPharmacyEmail('')
                    }
                  }}
                  className={`
                    relative border-2 rounded-lg p-4 sm:p-6 cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? 'border-emerald-500 bg-emerald-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm'
                    }
                  `}
                >
                  {/* Icon Area */}
                  <div className={`
                    w-full h-32 sm:h-40 rounded-lg flex items-center justify-center mb-4
                    ${isSelected ? 'bg-emerald-100' : 'bg-gray-100'}
                  `}>
                    <Icon 
                      className={`w-16 h-16 sm:w-20 sm:h-20 ${isSelected ? 'text-emerald-600' : 'text-gray-600'}`}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                    {option.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    {option.description}
                  </p>

                  {/* Radio Button */}
                  <div className="flex items-center justify-center mt-4">
                    <div className={`
                      w-5 h-5 rounded-full border-2 flex items-center justify-center
                      ${isSelected 
                        ? 'border-emerald-500 bg-emerald-500' 
                        : 'border-gray-300 bg-white'
                      }
                    `}>
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pharmacy Email Input - Only shown for "Nur Rezept" */}
          {selectedOption === 'prescription-only' && (
            <div className="mb-6 sm:mb-8 pt-4 sm:pt-6 border-t border-gray-200">
              <label htmlFor="pharmacyEmail" className="block text-sm sm:text-base font-medium form-label mb-2">
                Nenne bitte die Apotheke inkl. E-Mail an die dein Rezept gesendet werden soll: *
              </label>
              <input
                type="email"
                id="pharmacyEmail"
                value={pharmacyEmail}
                onChange={(e) => setPharmacyEmail(e.target.value)}
                placeholder="z.B. Santa Green, rezepte@santagreen.de - (Nur Apothekenmail, keine privaten E-Mail Adressen)"
                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg inconsolata text-base sm:text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                required
              />
            </div>
          )}

          {/* Info Message - Only shown for "Nur Rezept" */}
          {selectedOption === 'prescription-only' && (
            <div className="mb-6 sm:mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
              <h4 className="text-base sm:text-lg font-semibold text-blue-900 mb-3">
                "Nur Rezept" - ausgewählt:
              </h4>
              <div className="space-y-3 text-sm sm:text-base text-blue-800">
                <p>
                  Du erhälst vom Arzt nur das Rezept, bitte prüfe selbstständig bei der von dir gewählten Apotheke welche Sorten verfügbar sind.
                </p>
                <p className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Ein Live-Bestand kann dir nur bei der Option "Rezept+Versand" und "Rezept+Kurier" angezeigt werden.
                  </span>
                </p>
                <p>
                  Falls du die Produkte bei einer Partnerapotheke abholen möchtest, wähle bitte Rezept+Kurier oder Rezept+Lieferung und kreuze ganz am Ende "Abholung" an.
                </p>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mb-6 sm:mb-8 pt-4 sm:pt-6 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600">
              * Die Versandart kann nach der Rezeptausstellung ausgewählt werden.
            </p>
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={!selectedOption || (selectedOption === 'prescription-only' && !pharmacyEmail.trim())}
            className="w-full btn-secondary py-3 sm:py-4 text-base sm:text-lg font-bold"
          >
            Weiter
          </Button>
        </div>
      </div>
    </div>
  )
}
