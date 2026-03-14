'use client'

import React from 'react'
import Link from 'next/link'
import '@/app/main.css'

// Logo component
const LeafLogo = ({ className = 'w-48 h-24 sm:w-56 sm:h-28 md:w-64 md:h-32' }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <img
      src="/logo1.png"
      alt="reLeafZ Logo"
      className="w-full h-full object-contain"
    />
  </div>
)

export default function Impressum() {
  return (
    <div className="min-h-screen bg-beige inconsolata">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <Link href="/" className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded">
              <LeafLogo className="w-48 h-24 sm:w-56 sm:h-28 md:w-64 md:h-32 mb-4 sm:mb-6" />
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold title-gradient text-center">
              IMPRESSUM
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 space-y-6 sm:space-y-8">

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Angaben gemäß §5 TMG</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              S.C CODE UG (haftungsbeschränkt)<br />
              Donaustraße 44<br />
              12043 Berlin<br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Vertreten durch</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Geschäftsführer: Leolo Yubero Neumeister
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Kontakt</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              E-Mail: support@releafz.de<br />
              Website: www.releafz.de
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Registereintrag</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Registergericht: Amtsgericht Charlottenburg (Berlin)<br />
              Registernummer: HRB 270764 B<br />
              EUID: DEF1103R.HRB270764B
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Hinweis zur Plattform releafZ</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              releafZ ist eine Service-Plattform für Patienten, Ärzte und Apotheken, betrieben durch Student Council CODE UG (haftungsbeschränkt). releafZ selbst ist kein Gesundheitsdienstleister, insbesondere kein Arzt, kein MVZ und keine Apotheke.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">EU-Streitschlichtung</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline">
                https://ec.europa.eu/consumers/odr/
              </a>
              . Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Haftung für Inhalte</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Als Diensteanbieter sind wir gemäß §7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Haftung für Links</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Urheberrecht</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
