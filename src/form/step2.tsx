'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Bike, Package } from 'lucide-react'
import '@/app/main.css'

interface Step2Props {
  onNext: (selectedOption: string) => void
  onBack?: () => void
}

type DeliveryOption = 'courier' | 'shipping'

export default function Step2({ onNext, onBack }: Step2Props) {
  const [selectedOption, setSelectedOption] = useState<DeliveryOption | ''>('')

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
    }
  ]

  const handleNext = () => {
    if (selectedOption) {
      onNext(selectedOption)
    }
  }

  return (
    <div className="min-h-screen bg-beige inconsolata">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 flex flex-col items-center">
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
        <div className="mb-6 sm:mb-8 w-full">
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
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 w-full">
          <h2 className="text-xl sm:text-2xl md:text-2xl font-bold title-gradient mb-4 sm:mb-6 text-center">
            Falls ein Rezept ausgestellt wird, wie möchtest du deine Medikamente erhalten?
          </h2>
          
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 text-center">
            Berlin: Wähle deine Versandart und Apotheke aus *
          </p>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8 justify-items-center">
            {options.map((option) => {
              const Icon = option.icon
              const isSelected = selectedOption === option.id
              
              return (
                <div
                  key={option.id}
                  onClick={() => {
                    setSelectedOption(option.id)
                  }}
                  className={`
                    relative border-2 rounded-lg p-4 sm:p-6 cursor-pointer transition-all duration-200 text-center w-full max-w-xs
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

          {/* Disclaimer */}
          <div className="mb-6 sm:mb-8 pt-4 sm:pt-6 border-t border-gray-200 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              * Die Versandart kann nach der Rezeptausstellung ausgewählt werden.
            </p>
          </div>

          {/* Next Button */}
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
