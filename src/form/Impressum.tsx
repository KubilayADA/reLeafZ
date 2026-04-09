'use client'

import React from 'react'
import Link from 'next/link'
import '@/form/form.css'

const LeafLogo = ({ className = 'w-48 h-24 sm:w-56 sm:h-28 md:w-64 md:h-32' }) => (
  <div className={`form-logo-wrap ${className}`}>
    <img src="/logo1.png" alt="reLeafZ Logo" className="form-logo-img w-full h-full" />
  </div>
)

export default function Impressum() {
  return (
    <div className="form-page inconsolata">
      <div className="form-container">
        <div className="form-header">
          <div className="form-header__title-wrap">
            <Link href="/" className="form-logo-link">
              <LeafLogo className="w-48 h-24 sm:w-56 sm:h-28 md:w-64 md:h-32 mb-4 sm:mb-6" />
            </Link>
            <h1 className="form-header__title text-2xl sm:text-3xl md:text-4xl font-bold title-gradient">
              IMPRESSUM
            </h1>
          </div>
        </div>

        <div className="form-card form-card--legal space-y-6 sm:space-y-8">

          <section className="form-legal-section">
            <h2 className="form-legal-h2">Angaben gemäß §5 TMG</h2>
            <p className="form-legal-body">
              S.C CODE UG (haftungsbeschränkt)<br />
              Donaustraße 44<br />
              12043 Berlin<br />
              Deutschland
            </p>
          </section>

          <section className="form-legal-section">
            <h2 className="form-legal-h2">Vertreten durch</h2>
            <p className="form-legal-body">
              Geschäftsführer: Leolo Yubero Neumeister
            </p>
          </section>

          <section className="form-legal-section">
            <h2 className="form-legal-h2">Kontakt</h2>
            <p className="form-legal-body">
              E-Mail: support@releafz.de<br />
              Website: www.releafz.de
            </p>
          </section>

          <section className="form-legal-section">
            <h2 className="form-legal-h2">Registereintrag</h2>
            <p className="form-legal-body">
              Registergericht: Amtsgericht Charlottenburg (Berlin)<br />
              Registernummer: HRB 270764 B<br />
              EUID: DEF1103R.HRB270764B
            </p>
          </section>

          <section className="form-legal-section">
            <h2 className="form-legal-h2">Hinweis zur Plattform releafZ</h2>
            <p className="form-legal-body">
              releafZ ist eine Service-Plattform für Patienten, Ärzte und Apotheken, betrieben durch Student Council CODE UG (haftungsbeschränkt). releafZ selbst ist kein Gesundheitsdienstleister, insbesondere kein Arzt, kein MVZ und keine Apotheke.
            </p>
          </section>

          <section className="form-legal-section">
            <h2 className="form-legal-h2">EU-Streitschlichtung</h2>
            <p className="form-legal-body">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="form-legal-link">
                https://ec.europa.eu/consumers/odr/
              </a>
              . Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section className="form-legal-section">
            <h2 className="form-legal-h2">Haftung für Inhalte</h2>
            <p className="form-legal-body">
              Als Diensteanbieter sind wir gemäß §7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
            </p>
          </section>

          <section className="form-legal-section">
            <h2 className="form-legal-h2">Haftung für Links</h2>
            <p className="form-legal-body">
              Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            </p>
          </section>

          <section className="form-legal-section">
            <h2 className="form-legal-h2">Urheberrecht</h2>
            <p className="form-legal-body">
              Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
