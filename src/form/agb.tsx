'use client'

import React from 'react'
import '@/app/main.css'

// Logo component
const LeafLogo = ({ className = 'w-48 h-24 sm:w-56 sm:h-28 md:w-64 md:h-32' }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <img
      src="/logo.png"
      alt="reLeafZ Logo"
      className="w-full h-full object-contain"
    />
  </div>
)

export default function AGB() {
  return (
    <div className="min-h-screen bg-beige inconsolata">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <LeafLogo className="w-48 h-24 sm:w-56 sm:h-28 md:w-64 md:h-32 mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold title-gradient text-center">
              ALLGEMEINE GESCHÄFTSBEDINGUNGEN
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 space-y-6 sm:space-y-8">
          
          {/* 1. Allgemeines */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">1. Allgemeines</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">1.1</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Releafz GmbH ist eine Online-Plattform für telemedizinische Behandlungen und Medikamente. Diese Allgemeinen Geschäftsbedingungen (AGB) regeln die Nutzung der Plattform.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">1.2</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Diese AGB gelten für alle Verträge zwischen Releafz und dem Nutzer. Abweichende Bedingungen des Nutzers werden nicht anerkannt, es sei denn, Releafz stimmt ihrer Geltung ausdrücklich schriftlich zu.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">1.3</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Nutzer im Sinne dieser AGB sind natürliche Personen, die die Plattform zu privaten Zwecken nutzen.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">1.4</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Die Plattform steht ausschließlich Nutzern zur Verfügung, die ihren Wohnsitz in Deutschland haben, das 18. Lebensjahr vollendet haben und voll geschäftsfähig sind.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">1.5</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Releafz behält sich vor, diese AGB zu ändern. Der Nutzer wird über Änderungen informiert und hat eine Frist von vier Wochen, um Widerspruch einzulegen. Wird kein Widerspruch eingelegt, gelten die geänderten AGB als genehmigt.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">1.6</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Für die Nutzung der Plattform ist eine Registrierung erforderlich. Der Nutzer verpflichtet sich, wahrheitsgemäße und vollständige Angaben zu machen. Releafz behält sich vor, die Registrierung zu verweigern.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Widerrufsrecht und Rücksendungen */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">2. Widerrufsrecht und Rücksendungen</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">2.1</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Für medizinische Behandlungen besteht grundsätzlich kein Widerrufsrecht, da es sich um eine auf die Person des Nutzers zugeschnittene Leistung handelt.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">2.2</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Für den Kauf von Medikamenten gelten die gesetzlichen Bestimmungen zum Widerrufsrecht. Der Nutzer kann den Vertrag innerhalb von vierzehn Tagen ohne Angabe von Gründen widerrufen.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">2.3</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem der Nutzer oder ein von ihm benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen hat.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">2.4</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Um das Widerrufsrecht auszuüben, muss der Nutzer Releafz GmbH (Anschrift, E-Mail, Telefonnummer auszufüllen) eine eindeutige Erklärung über seinen Entschluss, den Vertrag zu widerrufen, mitteilen.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">2.5</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Zur Wahrung der Widerrufsfrist reicht es aus, dass der Nutzer die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absendet.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">2.6</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Im Falle eines wirksamen Widerrufs sind die von beiden Seiten empfangenen Leistungen zurückzugewähren. Releafz erstattet alle Zahlungen, die Releafz von dem Nutzer erhalten hat, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass der Nutzer eine andere Art der Lieferung als die von Releafz angebotene, günstigste Standardlieferung gewählt hat), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurück, an dem Releafz die Mitteilung über den Widerruf dieses Vertrags durch den Nutzer erhalten hat. Für diese Rückzahlung verwendet Releafz dasselbe Zahlungsmittel, das der Nutzer bei der ursprünglichen Transaktion eingesetzt hat.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">2.7</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Releafz kann die Rückzahlung verweigern, bis Releafz die Waren wieder zurückerhalten hat oder bis der Nutzer den Nachweis erbracht hat, dass er die Waren zurückgesandt hat, je nachdem, welches der frühere Zeitpunkt ist.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">2.8</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Der Nutzer hat die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag, an dem er Releafz über den Widerruf dieses Vertrags unterrichtet, an Releafz zurückzusenden oder zu übergeben.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">2.9</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Der Nutzer trägt die unmittelbaren Kosten der Rücksendung der Waren.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">2.10</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Der Nutzer muss für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">2.11</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung von Waren, die schnell verderben oder deren Verfallsdatum schnell überschritten würde.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Pflichten des Nutzers */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">3. Pflichten des Nutzers</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">3.1</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Der Nutzer verpflichtet sich, wahrheitsgemäße und vollständige Angaben zu machen, die für die Behandlung relevant sind.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">3.2</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Der Nutzer ist für die Sicherheit seines Kontos verantwortlich und verpflichtet sich, seine Zugangsdaten geheim zu halten.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">3.3</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Der Nutzer darf die Plattform nicht für rechtswidrige Zwecke nutzen oder Inhalte veröffentlichen, die gegen Gesetze oder Rechte Dritter verstoßen.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">3.4</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Der Nutzer verpflichtet sich, den Anweisungen des behandelnden Arztes zu folgen und verschriebene Medikamente wie verordnet einzunehmen.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">3.5</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Der Nutzer verpflichtet sich, Releafz unverzüglich über Änderungen seiner persönlichen Daten zu informieren.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Haftung */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">4. Haftung</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">4.1</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Releafz haftet unbeschränkt für Vorsatz, grobe Fahrlässigkeit sowie für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">4.2</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Bei leichter Fahrlässigkeit haftet Releafz nur bei Verletzung einer wesentlichen Vertragspflicht, deren Erfüllung die ordnungsgemäße Durchführung des Vertrags überhaupt erst ermöglicht und auf deren Einhaltung der Nutzer regelmäßig vertrauen darf (Kardinalpflicht). Die Haftung ist in diesem Fall auf die vorhersehbaren, vertragstypischen Schäden begrenzt.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">4.3</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Die Haftung nach dem Produkthaftungsgesetz bleibt unberührt.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">4.4</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Releafz übernimmt keine Haftung für die Richtigkeit und Vollständigkeit der vom Nutzer bereitgestellten Informationen.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">4.5</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Releafz haftet nicht für Schäden, die durch höhere Gewalt, Naturkatastrophen oder andere Umstände verursacht werden, die außerhalb des Einflussbereichs von Releafz liegen.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Behandlungsvertrag und telemedizinische Konsultation */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">5. Behandlungsvertrag und telemedizinische Konsultation</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">5.1</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Der Behandlungsvertrag kommt ausschließlich zwischen dem Nutzer und dem behandelnden Arzt zustande. Releafz ist lediglich Vermittler.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">5.2</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Die telemedizinischen Konsultationen erfolgen nach den berufsrechtlichen Bestimmungen für Ärzte. Der Arzt entscheidet eigenverantwortlich über die Behandlung.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">5.3</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Der Nutzer erkennt an, dass telemedizinische Konsultationen nicht in allen Fällen persönliche Untersuchungen ersetzen können und dass bei akuten Notfällen persönliche Besuche oder Notrufe erforderlich sind.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">5.4</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Releafz garantiert nicht die Verfügbarkeit eines bestimmten Arztes oder einer bestimmten Behandlungsmethode.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">5.5</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Der Nutzer verpflichtet sich, alle Fragen des Arztes wahrheitsgemäß und vollständig zu beantworten.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">5.6</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Die Kommunikation zwischen Nutzer und Arzt erfolgt über die sichere Releafz-Plattform.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">5.7</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Der Nutzer stimmt zu, dass Releafz Gesundheitsdaten für Zwecke der Behandlung und Abrechnung verarbeitet und übermittelt, soweit dies den Datenschutzbestimmungen von Releafz entspricht.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">5.8</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Der Nutzer hat das Recht, die Behandlung jederzeit zu beenden, wobei bereits erbrachte Leistungen anteilig abgerechnet werden.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">5.9</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Releafz behält sich vor, Nutzer von der Plattform auszuschließen, die gegen diese AGB verstoßen oder die Sicherheit der Plattform gefährden.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">5.10</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Die Leistungen werden nach der Gebührenordnung für Ärzte (GOÄ) oder den geltenden gesetzlichen Krankenversicherungsbestimmungen abgerechnet. Der Nutzer wird vorab über die Kosten informiert.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Reservierung von Medikamenten */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">6. Reservierung von Medikamenten</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">6.1</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Die Releafz-Plattform ermöglicht die Reservierung von Medikamenten bei Apotheken. Der Kaufvertrag kommt ausschließlich zwischen dem Nutzer und der Apotheke zustande.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">6.2</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Releafz übernimmt keine Haftung für die Verfügbarkeit, Qualität oder Lieferung der Medikamente durch die Apotheke. Der Nutzer ist für die Abholung oder Lieferung verantwortlich.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">6.3</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Der Nutzer verpflichtet sich, verschriebene Medikamente nur für den persönlichen Gebrauch zu verwenden und nicht an Dritte weiterzugeben.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">6.4</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Releafz weist darauf hin, dass verschreibungspflichtige Medikamente nur gegen Vorlage eines gültigen Rezepts abgegeben werden.
                </p>
              </div>
            </div>
          </section>

          {/* 7. Zahlungsabwicklung */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">7. Zahlungsabwicklung</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">7.1</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Die Zahlungsabwicklung für die von Releafz vermittelten Leistungen erfolgt über externe Zahlungsdienstleister. Der Nutzer wird über die verfügbaren Zahlungsmethoden informiert.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">7.2</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Der Nutzer stimmt zu, dass Zahlungsdaten an den Zahlungsdienstleister übermittelt werden. Releafz speichert keine vollständigen Zahlungsdaten.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">7.3</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Bei Zahlungsverzug ist Releafz berechtigt, Verzugszinsen in gesetzlicher Höhe zu berechnen und weitere Leistungen auszusetzen.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Datenschutz */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">8. Datenschutz</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">8.1</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Releafz verarbeitet personenbezogene Daten gemäß der DSGVO und dem BDSG. Ausführliche Informationen hierzu finden sich in der Datenschutzerklärung.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">8.2</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Der Nutzer hat das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">8.3</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Der Nutzer kann seine Einwilligung zur Datenverarbeitung jederzeit widerrufen.
                </p>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">8.4</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Der Nutzer kann sich bei Fragen zum Datenschutz oder zur Ausübung seiner Rechte an den Datenschutzbeauftragten von Releafz wenden.
                </p>
              </div>
            </div>
          </section>

          {/* 9. Streitbeilegung */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">9. Streitbeilegung</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">9.1</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter{' '}
                  <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 underline">
                    https://ec.europa.eu/consumers/odr/
                  </a>{' '}
                  finden. Releafz ist nicht verpflichtet, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
            </div>
          </section>

          {/* 10. Schlussbestimmung */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">10. Schlussbestimmung</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">10.1</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand für alle Streitigkeiten ist, soweit gesetzlich zulässig, der Sitz von Releafz.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

