'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, Video, Building2 } from 'lucide-react'
import '@/app/main.css'

interface Step1Props {
  onNext: (selectedOption: string) => void
  onBack?: () => void
}

type ConsultationOption = 'questionnaire' | 'video' | 'onsite'

export default function Step1({ onNext, onBack }: Step1Props) {
  const [selectedOption, setSelectedOption] = useState<ConsultationOption | ''>('')

  const options = [
    {
      id: 'questionnaire' as ConsultationOption,
      title: 'Online-Fragebogen',
      price: '14,99€*',
      icon: FileText,
      description: 'Schnell und einfach von zu Hause aus'
    },
    {
      id: 'video' as ConsultationOption,
      title: 'Video-Sprechstunde',
      price: 'ab 45€*',
      icon: Video,
      description: 'Persönliche Beratung per Video'
    },
    {
      id: 'onsite' as ConsultationOption,
      title: 'Vor-Ort-Termin',
      price: 'Auf Anfrage*',
      icon: Building2,
      description: 'Termin in unserer Praxis'
    }
  ]

  const handleNext = () => {
    if (selectedOption) {
      onNext(selectedOption)
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
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm sm:text-base">
                1
              </div>
              <span className="font-medium text-emerald-600 text-xs sm:text-sm md:text-base">Anfrage</span>
            </div>
            <div className="w-8 sm:w-16 h-0.5 bg-gray-300 flex-shrink-0"></div>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold text-sm sm:text-base">
                2
              </div>
              <span className="font-medium text-gray-500 text-xs sm:text-sm md:text-base hidden sm:inline">Produktauswahl</span>
              <span className="font-medium text-gray-500 text-xs sm:hidden">Produkt</span>
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
          <h2 className="text-xl sm:text-2xl md:text-2xl font-bold title-gradient mb-6 sm:mb-8">
            Wie möchtest du Angaben zu deinem Gesundheitszustand machen? *
          </h2>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {options.map((option) => {
              const Icon = option.icon
              const isSelected = selectedOption === option.id
              
              return (
                <div
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`
                    relative border-2 rounded-lg p-4 sm:p-6 cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? 'border-emerald-500 bg-emerald-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm'
                    }
                  `}
                >
                  {/* Icon */}
                  <div className={`
                    w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center mb-3 sm:mb-4
                    ${isSelected ? 'bg-emerald-100' : 'bg-gray-100'}
                  `}>
                    <Icon 
                      className={`w-6 h-6 sm:w-8 sm:h-8 ${isSelected ? 'text-emerald-600' : 'text-gray-600'}`}
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

                  {/* Price */}
                  <div className="mb-3 sm:mb-4">
                    <span className="text-lg sm:text-xl font-bold text-gray-900">
                      {option.price}
                    </span>
                  </div>

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
          <div className="mb-6 sm:mb-8 pt-4 sm:pt-6 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600">
              * Die ärztlichen Leistungen werden nach der aktuell gültigen Gebührenordnung für Ärzte (GoÄ) berechnet.
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

