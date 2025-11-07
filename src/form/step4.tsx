'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import '@/app/main.css'

interface Step4Props {
  onNext: () => void
  onBack?: () => void
}

interface Agreement {
  id: string
  text: string
  required: boolean
}

export default function Step4({ onNext, onBack }: Step4Props) {
  const [agreements, setAgreements] = useState<Record<string, boolean>>({
    remoteTreatment: false,
    truthfulInfo: false,
    privateService: false,
    emailInvoice: false,
    doctorDiscretion: false,
    dataSharing: false,
    privacyTerms: false,
    newsletter: false // Optional
  })

  const [errors, setErrors] = useState<Record<string, boolean>>({})

  const requiredAgreements: Agreement[] = [
    {
      id: 'remoteTreatment',
      text: 'Eine Fernbehandlung ist nicht in jedem Fall möglich, sondern nur unter den Voraussetzungen, dass bei Einhaltung anerkannter fachlicher Standards im Sinne des § 630a BGB (nach dem jeweiligen Stand der naturwissenschaftlichen Erkenntnisse, der ärztlichen Erfahrung, der zu Erreichung des ärztlichen Behandlungsziels erforderlich ist und sich in der Erprobung bewährt hat) je nach Krankheitsbild kein persönlicher Kontakt zwischen Arzt und Patient erforderlich ist.',
      required: true
    },
    {
      id: 'truthfulInfo',
      text: 'Alle Fragen werden durch mich nach bestem Wissen und Gewissen wahrheitsgemäß beantwortet. Ich verstehe, dass falsche Informationen für mich gesundheitsschädlich sein können und ggf. auch strafbar sind. Die Diagnose und Behandlungen sind nur für meinen persönlichen Gebrauch bestimmt.',
      required: true
    },
    {
      id: 'privateService',
      text: 'Mir ist bewusst, dass es sich hierbei um eine privatärztliche Leistung handelt. Die ärztlichen Leistungen werden nach der aktuell gültigen Gebührenordnung für Ärzte (GoÄ) berechnet.',
      required: true
    },
    {
      id: 'emailInvoice',
      text: 'Ich bin damit einverstanden, dass mir die Arztrechnung so wie ggf. der Arztbrief per E-Mail-Versand zugestellt wird.',
      required: true
    },
    {
      id: 'doctorDiscretion',
      text: 'Mir ist bewusst, dass ich keinen Anspruch darauf habe, dass die von mir vorgeschlagenen Sorten von den Kooperationsärzten verschrieben werden, da die Therapie- und Arzneientscheidung einzig und allein dem Arzt obliegt, der auch allein bestimmt, ob und welche Cannabissorte, THC-Konzentration und Menge im Einzelfall am besten geeignet ist.',
      required: true
    },
    {
      id: 'dataSharing',
      text: 'Ich bin damit einverstanden, dass meine Angaben, insbesondere Name, Anschrift, Geburtsdatum, Behandlungsdaten und Behandlungsverläufe, zum Zwecke der Behandlung sowie Abrechnung, an die kooperierenden Ärzte weitergegeben werden, sowie, dass Gesundheitsdaten, die ich mit einem Arzt und/oder einer Apotheke in Hinsicht auf eine angeforderte Behandlung teile, von nicht-medizinischem Hilfspersonal eingesehen werden dürfen, um mögliche Anfragen zu beantworten. Meine Einwilligung ist widerruflich mit Wirkung für die Zukunft durch den Kundensupport unter support@releafz.com.',
      required: true
    },
    {
      id: 'privacyTerms',
      text: '',
      required: true
    }
  ]

  const handleAgreementChange = (id: string, checked: boolean) => {
    setAgreements(prev => ({ ...prev, [id]: checked }))
    // Clear error when user checks the box
    if (checked && errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[id]
        return newErrors
      })
    }
  }

  const handleNext = () => {
    // Validate required agreements
    const newErrors: Record<string, boolean> = {}
    let hasErrors = false

    requiredAgreements.forEach(agreement => {
      if (!agreements[agreement.id]) {
        newErrors[agreement.id] = true
        hasErrors = true
      }
    })

    if (hasErrors) {
      setErrors(newErrors)
      return
    }

    // All required agreements are checked, proceed
    onNext()
  }

  const isFormValid = requiredAgreements.every(agreement => agreements[agreement.id])

  return (
    <div className="min-h-screen bg-beige inconsolata">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
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
              <span className="font-medium text-emerald-600 text-xs sm:text-sm md:text-base hidden sm:inline">Anfrage</span>
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
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 lg:p-10">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold title-gradient mb-4 sm:mb-6 md:mb-8 leading-tight">
            Bitte lies dir die folgenden Hinweise aufmerksam durch und bestätige sie:
          </h2>

          <div className="space-y-4 sm:space-y-5 md:space-y-6 mb-6 sm:mb-8">
            {/* Required Agreements */}
            {requiredAgreements.map((agreement) => (
              <div key={agreement.id} className="space-y-2 sm:space-y-3">
                <div className="flex items-start gap-3 sm:gap-4">
                  <input
                    type="checkbox"
                    id={agreement.id}
                    checked={agreements[agreement.id]}
                    onChange={(e) => handleAgreementChange(agreement.id, e.target.checked)}
                    className="mt-0.5 sm:mt-1 w-5 h-5 sm:w-6 sm:h-6 accent-emerald-600 border-2 border-gray-300 checked:border-emerald-600 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer flex-shrink-0 transition-all"
                    style={{ accentColor: '#059669' }}
                  />
                  <label
                    htmlFor={agreement.id}
                    className="flex-1 text-xs sm:text-sm md:text-base text-gray-700 cursor-pointer leading-relaxed"
                  >
                    {agreement.id === 'privacyTerms' ? (
                      <>
                        Ich akzeptiere die{' '}
                        <a 
                          href="/datenschutzerklaerung" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-emerald-600 hover:text-emerald-700 underline font-medium"
                        >
                          Datenschutzerklärung
                        </a>{' '}
                        und{' '}
                        <a 
                          href="/agb" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-emerald-600 hover:text-emerald-700 underline font-medium"
                        >
                          AGB
                        </a>{' '}
                        der Plattform.
                      </>
                    ) : (
                      agreement.text
                    )}
                  </label>
                </div>
                {errors[agreement.id] && (
                  <div className="flex items-center gap-2 text-red-600 text-xs sm:text-sm ml-8 sm:ml-10 bg-red-50 px-3 py-2 rounded-md border border-red-200">
                    <AlertCircle size={14} className="flex-shrink-0" />
                    <span>Feld ist erforderlich</span>
                  </div>
                )}
              </div>
            ))}

            {/* Optional Newsletter */}
            <div className="space-y-2 sm:space-y-3 pt-4 sm:pt-5 md:pt-6 border-t-2 border-gray-200">
              <div className="flex items-start gap-3 sm:gap-4">
                <input
                  type="checkbox"
                  id="newsletter"
                  checked={agreements.newsletter}
                  onChange={(e) => handleAgreementChange('newsletter', e.target.checked)}
                  className="mt-0.5 sm:mt-1 w-5 h-5 sm:w-6 sm:h-6 accent-emerald-600 border-2 border-gray-300 checked:border-emerald-600 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer flex-shrink-0 transition-all"
                  style={{ accentColor: '#059669' }}
                />
                <label
                  htmlFor="newsletter"
                  className="flex-1 text-xs sm:text-sm md:text-base text-gray-700 cursor-pointer leading-relaxed"
                >
                  Ich möchte den Releafz Newsletter erhalten, um immer auf dem neusten Stand zu bleiben. Ich kann meine Anmeldung jederzeit widerrufen.
                </label>
              </div>
            </div>
          </div>

          {/* Next Button */}
          <Button
            onClick={handleNext}
            disabled={!isFormValid}
            className="w-full btn-secondary py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl font-bold shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Weiter
          </Button>
        </div>
      </div>
    </div>
  )
}

