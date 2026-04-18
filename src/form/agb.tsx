'use client'

import React from 'react'
import Link from 'next/link'
import '@/form/form.css'

const LeafLogo = ({ className = 'w-48 h-24 sm:w-56 sm:h-28 md:w-64 md:h-32' }) => (
  <div className={`form-logo-wrap ${className}`}>
    <img src="/logo1.png" alt="reLeafZ Logo" className="form-logo-img w-full h-full" />
  </div>
)

export default function AGB() {
  return (
    <div className="form-page inconsolata">
      <div className="form-container">
        <div className="form-header">
          <div className="form-header__title-wrap">
            <Link href="/" className="form-logo-link">
              <LeafLogo className="w-48 h-24 sm:w-56 sm:h-28 md:w-64 md:h-32 mb-4 sm:mb-6" />
            </Link>
            <h1 className="form-header__title text-2xl sm:text-3xl md:text-4xl font-bold title-gradient">
              ALLGEMEINE GESCHÄFTSBEDINGUNGEN
            </h1>
          </div>
        </div>

        <div className="form-card form-card--legal space-y-6 sm:space-y-8">
          
          <section className="form-legal-section">
            <h2 className="form-legal-h2">1. Allgemeines</h2>
            <div className="space-y-4">
              <div>
                <h3 className="form-legal-h3">1.1</h3>
                <p className="form-legal-body">
                  releafZ ist eine Service-Plattform für Patienten, Ärzte und Apotheken. releafZ selbst ist kein Gesundheitsdienstleister, insbesondere kein Arzt, kein MVZ und keine Apotheke. Die Plattform stellt ausschließlich die technische Infrastruktur zur Verfügung.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">1.2</h3>
                <p className="form-legal-body">
                  Diese AGB gelten für alle Verträge zwischen releafZ und dem Nutzer. Abweichende Bedingungen des Nutzers werden nicht anerkannt, es sei denn, releafZ stimmt ihrer Geltung ausdrücklich schriftlich zu.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">1.3</h3>
                <p className="form-legal-body">
                  Nutzer im Sinne dieser AGB sind natürliche Personen, die die Plattform zu privaten Zwecken nutzen.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">1.4</h3>
                <p className="form-legal-body">
                  Die Plattform steht ausschließlich Nutzern zur Verfügung, die ihren Wohnsitz in Deutschland haben, das 18. Lebensjahr vollendet haben und voll geschäftsfähig sind.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">1.5</h3>
                <p className="form-legal-body">
                  releafZ behält sich vor, diese AGB zu ändern. Der Nutzer wird über Änderungen informiert und hat eine Frist von vier Wochen, um Widerspruch einzulegen. Wird kein Widerspruch eingelegt, gelten die geänderten AGB als genehmigt.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">1.6</h3>
                <p className="form-legal-body">
                  Für die Nutzung der Plattform ist eine Registrierung erforderlich. Der Nutzer verpflichtet sich, wahrheitsgemäße und vollständige Angaben zu machen. releafZ behält sich vor, die Registrierung zu verweigern.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Widerrufsrecht und Rücksendungen */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">2. Widerrufsrecht und Rücksendungen</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="form-legal-h3">2.1</h3>
                <p className="form-legal-body">
                  Für medizinische Behandlungen besteht grundsätzlich kein Widerrufsrecht, da es sich um eine auf die Person des Nutzers zugeschnittene Leistung handelt.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">2.2</h3>
                <p className="form-legal-body">
                  Für den Kauf von Medikamenten gelten die gesetzlichen Bestimmungen zum Widerrufsrecht. Der Nutzer kann den Vertrag innerhalb von vierzehn Tagen ohne Angabe von Gründen widerrufen.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">2.3</h3>
                <p className="form-legal-body">
                  Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem der Nutzer oder ein von ihm benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen hat.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">2.4</h3>
                <p className="form-legal-body">
                  Um das Widerrufsrecht auszuüben, muss der Nutzer releafZ (Student Council CODE UG) (support@releafz.de) eine eindeutige Erklärung über seinen Entschluss, den Vertrag zu widerrufen, mitteilen.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">2.5</h3>
                <p className="form-legal-body">
                  Zur Wahrung der Widerrufsfrist reicht es aus, dass der Nutzer die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absendet.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">2.6</h3>
                <p className="form-legal-body">
                  Im Falle eines wirksamen Widerrufs sind die von beiden Seiten empfangenen Leistungen zurückzugewähren. releafZ erstattet alle Zahlungen, die releafZ von dem Nutzer erhalten hat, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass der Nutzer eine andere Art der Lieferung als die von releafZ angebotene, günstigste Standardlieferung gewählt hat), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurück, an dem releafZ die Mitteilung über den Widerruf dieses Vertrags durch den Nutzer erhalten hat. Für diese Rückzahlung verwendet releafZ dasselbe Zahlungsmittel, das der Nutzer bei der ursprünglichen Transaktion eingesetzt hat.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">2.7</h3>
                <p className="form-legal-body">
                  releafZ kann die Rückzahlung verweigern, bis releafZ die Waren wieder zurückerhalten hat oder bis der Nutzer den Nachweis erbracht hat, dass er die Waren zurückgesandt hat, je nachdem, welches der frühere Zeitpunkt ist.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">2.8</h3>
                <p className="form-legal-body">
                  Der Nutzer hat die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag, an dem er releafZ über den Widerruf dieses Vertrags unterrichtet, an releafZ zurückzusenden oder zu übergeben.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">2.9</h3>
                <p className="form-legal-body">
                  Der Nutzer trägt die unmittelbaren Kosten der Rücksendung der Waren.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">2.10</h3>
                <p className="form-legal-body">
                  Der Nutzer muss für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">2.11</h3>
                <p className="form-legal-body">
                  Das Widerrufsrecht besteht nicht bei Verträgen zur Lieferung von Waren, die schnell verderben oder deren Verfallsdatum schnell überschritten würde.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Pflichten des Nutzers */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">3. Pflichten des Nutzers</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="form-legal-h3">3.1</h3>
                <p className="form-legal-body">
                  Der Nutzer verpflichtet sich, wahrheitsgemäße und vollständige Angaben zu machen, die für die Behandlung relevant sind.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">3.2</h3>
                <p className="form-legal-body">
                  Der Nutzer ist für die Sicherheit seines Kontos verantwortlich und verpflichtet sich, seine Zugangsdaten geheim zu halten.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">3.3</h3>
                <p className="form-legal-body">
                  Der Nutzer darf die Plattform nicht für rechtswidrige Zwecke nutzen oder Inhalte veröffentlichen, die gegen Gesetze oder Rechte Dritter verstoßen.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">3.4</h3>
                <p className="form-legal-body">
                  Der Nutzer verpflichtet sich, den Anweisungen des behandelnden Arztes zu folgen und verschriebene Medikamente wie verordnet einzunehmen.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">3.5</h3>
                <p className="form-legal-body">
                  Der Nutzer verpflichtet sich, releafZ unverzüglich über Änderungen seiner persönlichen Daten zu informieren.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Haftung */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">4. Haftung</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="form-legal-h3">4.1</h3>
                <p className="form-legal-body">
                  releafZ haftet unbeschränkt für Vorsatz, grobe Fahrlässigkeit sowie für Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">4.2</h3>
                <p className="form-legal-body">
                  Bei leichter Fahrlässigkeit haftet releafZ nur bei Verletzung einer wesentlichen Vertragspflicht, deren Erfüllung die ordnungsgemäße Durchführung des Vertrags überhaupt erst ermöglicht und auf deren Einhaltung der Nutzer regelmäßig vertrauen darf (Kardinalpflicht). Die Haftung ist in diesem Fall auf die vorhersehbaren, vertragstypischen Schäden begrenzt.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">4.3</h3>
                <p className="form-legal-body">
                  Die Haftung nach dem Produkthaftungsgesetz bleibt unberührt.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">4.4</h3>
                <p className="form-legal-body">
                  releafZ übernimmt keine Haftung für die Richtigkeit und Vollständigkeit der vom Nutzer bereitgestellten Informationen.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">4.5</h3>
                <p className="form-legal-body">
                  releafZ haftet nicht für Schäden, die durch höhere Gewalt, Naturkatastrophen oder andere Umstände verursacht werden, die außerhalb des Einflussbereichs von releafZ liegen.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Behandlungsvertrag und telemedizinische Konsultation */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">5. Behandlungsvertrag und telemedizinische Konsultation</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="form-legal-h3">5.1</h3>
                <p className="form-legal-body">
                  Der Behandlungsvertrag kommt ausschließlich zwischen dem Nutzer und dem behandelnden Arzt zustande. releafZ ist lediglich Vermittler.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">5.2</h3>
                <p className="form-legal-body">
                  Die telemedizinischen Konsultationen erfolgen nach den berufsrechtlichen Bestimmungen für Ärzte. Der Arzt entscheidet eigenverantwortlich über die Behandlung.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">5.3</h3>
                <p className="form-legal-body">
                  Der Nutzer erkennt an, dass telemedizinische Konsultationen nicht in allen Fällen persönliche Untersuchungen ersetzen können und dass bei akuten Notfällen persönliche Besuche oder Notrufe erforderlich sind.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">5.4</h3>
                <p className="form-legal-body">
                  releafZ garantiert nicht die Verfügbarkeit eines bestimmten Arztes oder einer bestimmten Behandlungsmethode.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">5.5</h3>
                <p className="form-legal-body">
                  Der Nutzer verpflichtet sich, alle Fragen des Arztes wahrheitsgemäß und vollständig zu beantworten.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">5.6</h3>
                <p className="form-legal-body">
                  Die Kommunikation zwischen Nutzer und Arzt erfolgt über die sichere releafZ-Plattform.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">5.7</h3>
                <p className="form-legal-body">
                  Der Nutzer stimmt zu, dass releafZ Gesundheitsdaten für Zwecke der Behandlung und Abrechnung verarbeitet und übermittelt, soweit dies den Datenschutzbestimmungen von releafZ entspricht.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">5.8</h3>
                <p className="form-legal-body">
                  Der Nutzer hat das Recht, die Behandlung jederzeit zu beenden, wobei bereits erbrachte Leistungen anteilig abgerechnet werden.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">5.9</h3>
                <p className="form-legal-body">
                  releafZ behält sich vor, Nutzer von der Plattform auszuschließen, die gegen diese AGB verstoßen oder die Sicherheit der Plattform gefährden.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">5.10</h3>
                <p className="form-legal-body">
                  Die Leistungen werden nach der Gebührenordnung für Ärzte (GOÄ) oder den geltenden gesetzlichen Krankenversicherungsbestimmungen abgerechnet. Der Nutzer wird vorab über die Kosten informiert.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Reservierung von Medikamenten */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">6. Reservierung von Medikamenten</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="form-legal-h3">6.1</h3>
                <p className="form-legal-body">
                  Die releafZ-Plattform ermöglicht die Reservierung von Medikamenten bei Apotheken. Der Kaufvertrag kommt ausschließlich zwischen dem Nutzer und der Apotheke zustande.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">6.2</h3>
                <p className="form-legal-body">
                  releafZ übernimmt keine Haftung für die Verfügbarkeit, Qualität oder Lieferung der Medikamente durch die Apotheke. Der Nutzer ist für die Abholung oder Lieferung verantwortlich.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">6.3</h3>
                <p className="form-legal-body">
                  Der Nutzer verpflichtet sich, verschriebene Medikamente nur für den persönlichen Gebrauch zu verwenden und nicht an Dritte weiterzugeben.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">6.4</h3>
                <p className="form-legal-body">
                  releafZ weist darauf hin, dass verschreibungspflichtige Medikamente nur gegen Vorlage eines gültigen Rezepts abgegeben werden.
                </p>
              </div>
            </div>
          </section>

          {/* 7. Zahlungsabwicklung */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">7. Zahlungsabwicklung</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="form-legal-h3">7.1</h3>
                <p className="form-legal-body">
                  Die Zahlungsabwicklung für die von releafZ vermittelten Leistungen erfolgt über externe Zahlungsdienstleister. Der Nutzer wird über die verfügbaren Zahlungsmethoden informiert.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">7.2</h3>
                <p className="form-legal-body">
                  Der Nutzer stimmt zu, dass Zahlungsdaten an den Zahlungsdienstleister übermittelt werden. releafZ speichert keine vollständigen Zahlungsdaten.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">7.3</h3>
                <p className="form-legal-body">
                  Bei Zahlungsverzug ist releafZ berechtigt, Verzugszinsen in gesetzlicher Höhe zu berechnen und weitere Leistungen auszusetzen.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Datenschutz */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">8. Datenschutz</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="form-legal-h3">8.1</h3>
                <p className="form-legal-body">
                  releafZ verarbeitet personenbezogene Daten gemäß der DSGVO und dem BDSG. Ausführliche Informationen hierzu finden sich in der Datenschutzerklärung.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">8.2</h3>
                <p className="form-legal-body">
                  Der Nutzer hat das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">8.3</h3>
                <p className="form-legal-body">
                  Der Nutzer kann seine Einwilligung zur Datenverarbeitung jederzeit widerrufen.
                </p>
              </div>

              <div>
                <h3 className="form-legal-h3">8.4</h3>
                <p className="form-legal-body">
                  Der Nutzer kann sich bei Fragen zum Datenschutz oder zur Ausübung seiner Rechte an den Datenschutzbeauftragten von releafZ wenden.
                </p>
              </div>
            </div>
          </section>

          {/* 9. Streitbeilegung */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">9. Streitbeilegung</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="form-legal-h3">9.1</h3>
                <p className="form-legal-body">
                  Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter{' '}
                  <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="form-legal-link">
                    https://ec.europa.eu/consumers/odr/
                  </a>{' '}
                  finden. releafZ ist nicht verpflichtet, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                </p>
              </div>
            </div>
          </section>

          {/* 10. Schlussbestimmung */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">10. Schlussbestimmung</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="form-legal-h3">10.1</h3>
                <p className="form-legal-body">
                  Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand für alle Streitigkeiten ist, soweit gesetzlich zulässig, der Sitz von releafZ.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

