'use client'

import React from 'react'
import Link from 'next/link'
import '@/app/main.css'
import '@/form/form.css'

const LeafLogo = ({ className = 'w-48 h-24 sm:w-56 sm:h-28 md:w-64 md:h-32' }) => (
  <div className={`form-logo-wrap ${className}`}>
    <img src="/logo1.png" alt="reLeafZ Logo" className="form-logo-img w-full h-full" />
  </div>
)

export default function Datenschutzerklärung() {
  return (
    <div className="form-page inconsolata">
      <div className="form-container">
        <div className="form-header">
          <div className="form-header__title-wrap">
            <Link href="/" className="form-logo-link">
              <LeafLogo className="w-48 h-24 sm:w-56 sm:h-28 md:w-64 md:h-32 mb-4 sm:mb-6" />
            </Link>
            <h1 className="form-header__title text-2xl sm:text-3xl md:text-4xl font-bold title-gradient">
              DATENSCHUTZERKLÄRUNG
            </h1>
          </div>
        </div>

        <div className="form-card form-card--legal space-y-6 sm:space-y-8">
          
          {/* Einleitung */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">Einleitung</h2>
            <p className="form-legal-body mb-4">
              Mit der folgenden Datenschutzerklärung möchten wir Sie darüber aufklären, welche Arten Ihrer personenbezogenen Daten (nachfolgend auch kurz als „Daten&quot; bezeichnet) wir zu welchen Zwecken und in welchem Umfang verarbeiten. Die Datenschutzerklärung gilt für alle von uns durchgeführten Verarbeitungen personenbezogener Daten, sowohl im Rahmen der Erbringung unserer Leistungen als auch innerhalb unserer Onlineangebote, wie z.B. unserer Webseiten, mobilen Applikationen, externen Onlinepräsenzen, wie z.B. unserer Social-Media-Profile (nachfolgend zusammenfassend als „Onlineangebot&quot; bezeichnet).
            </p>
            <p className="form-legal-body mb-4">
              Die verwendeten Begriffe sind nicht geschlechtsspezifisch.
            </p>
            <p className="form-legal-body font-semibold">
              Stand: März 2026
            </p>
          </section>

          {/* Verantwortlicher */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">Verantwortlicher</h2>
            <div className="form-legal-body space-y-2">
              <p><strong>Name:</strong> releafZ (Plattform betrieben durch S.C. CODE UG)</p>
              <p><strong>Adresse:</strong> Donaustraße 44, 12043 Berlin, Deutschland</p>
              <p><strong>E-Mail:</strong> support@releafz.de</p>
              <p><strong>Website:</strong> www.releafz.de</p>
            </div>
          </section>

          {/* Arten der verarbeiteten Daten */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">Arten der verarbeiteten Daten</h2>
            <ul className="form-legal-list">
              <li>Bestandsdaten (z.B. Namen, Adressen).</li>
              <li>Kontaktdaten (z.B. E-Mail, Telefonnummern).</li>
              <li>Inhaltsdaten (z.B. Texteingaben, Fotografien, Videos).</li>
              <li>Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten).</li>
              <li>Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen).</li>
            </ul>
          </section>

          {/* Zweck der Verarbeitung */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">Zweck der Verarbeitung</h2>
            <ul className="form-legal-list">
              <li>Zurverfügungstellung des Onlineangebotes, seiner Funktionen und Inhalte.</li>
              <li>Beantwortung von Kontaktanfragen und Kommunikation mit Nutzern.</li>
              <li>Sicherheitsmaßnahmen.</li>
              <li>Reichweitenmessung/Marketing.</li>
            </ul>
          </section>

          {/* Maßgebliche Rechtsgrundlagen */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">Maßgebliche Rechtsgrundlagen</h2>
            <p className="form-legal-body mb-4">
              Im Folgenden erhalten Sie eine Übersicht der Rechtsgrundlagen der DSGVO, auf deren Basis wir personenbezogene Daten verarbeiten. Bitte beachten Sie, dass neben den Regelungen der DSGVO nationale Datenschutzvorgaben in Ihrem bzw. unserem Wohn- oder Sitzland gelten können. Sollten darüber hinaus im Einzelfall speziellere Rechtsgrundlagen maßgeblich sein, teilen wir Ihnen diese in der Datenschutzerklärung mit.
            </p>
            <ul className="form-legal-list form-legal-list--spaced">
              <li>
                <strong className="form-legal-body text-gray-900">Einwilligung (Art. 6 Abs. 1 S. 1 lit. a) DSGVO):</strong>
                <p className="form-legal-body mt-1">
                  Die betroffene Person hat ihre Einwilligung zu der Verarbeitung der sie betreffenden personenbezogenen Daten für einen bestimmten Zweck oder mehrere bestimmte Zwecke gegeben.
                </p>
              </li>
              <li>
                <strong className="form-legal-body text-gray-900">Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO):</strong>
                <p className="form-legal-body mt-1">
                  Die Verarbeitung ist für die Erfüllung eines Vertrags, dessen Vertragspartei die betroffene Person ist, oder zur Durchführung vorvertraglicher Maßnahmen erforderlich, die auf Anfrage der betroffenen Person erfolgen.
                </p>
              </li>
              <li>
                <strong className="form-legal-body text-gray-900">Rechtliche Verpflichtung (Art. 6 Abs. 1 S. 1 lit. c) DSGVO):</strong>
                <p className="form-legal-body mt-1">
                  Die Verarbeitung ist zur Erfüllung einer rechtlichen Verpflichtung erforderlich, der der Verantwortliche unterliegt.
                </p>
              </li>
              <li>
                <strong className="form-legal-body text-gray-900">Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO):</strong>
                <p className="form-legal-body mt-1">
                  Die Verarbeitung ist zur Wahrung der berechtigten Interessen des Verantwortlichen oder eines Dritten erforderlich, sofern nicht die Interessen oder Grundrechte und Grundfreiheiten der betroffenen Person, die den Schutz personenbezogener Daten erfordern, überwiegen.
                </p>
              </li>
              <li>
                <strong className="form-legal-body text-gray-900">Nationale Datenschutzregelungen in Deutschland:</strong>
                <p className="form-legal-body mt-1">
                  Zusätzlich zu den Datenschutzregelungen der DSGVO gelten nationale Regelungen zum Datenschutz in Deutschland. Hierzu gehört insbesondere das Gesetz zum Schutz vor Missbrauch personenbezogener Daten bei der Datenverarbeitung (Bundesdatenschutzgesetz – BDSG). Das BDSG enthält insbesondere Spezialregelungen zum Recht auf Auskunft, zum Recht auf Löschung, zum Widerspruchsrecht, zur Verarbeitung besonderer Kategorien personenbezogener Daten, zur Verarbeitung für andere Zwecke und zur Übermittlung sowie automatisierten Entscheidungsfindung im Einzelfall einschließlich Profiling.
                </p>
              </li>
            </ul>
          </section>

          {/* Sicherheitsmaßnahmen */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">Sicherheitsmaßnahmen</h2>
            <p className="form-legal-body mb-4">
              Wir treffen nach Maßgabe der gesetzlichen Vorgaben unter Berücksichtigung des Stands der Technik, der Implementierungskosten und der Art, des Umfangs, der Umstände und der Zwecke der Verarbeitung sowie der unterschiedlichen Eintrittswahrscheinlichkeiten und des Ausmaßes der Bedrohung für die Rechte und Freiheiten natürlicher Personen geeignete technische und organisatorische Maßnahmen, um ein dem Risiko angemessenes Schutzniveau zu gewährleisten.
            </p>
            <p className="form-legal-body">
              Zu den Maßnahmen gehören insbesondere die Sicherung der Vertraulichkeit, Integrität und Verfügbarkeit von Daten durch Kontrolle des physischen und elektronischen Zugangs zu den Daten als auch des sie betreffenden Zugriffs, der Eingabe, der Weitergabe, der Sicherung der Verfügbarkeit und ihrer Trennung. Des Weiteren haben wir Verfahren eingerichtet, die eine Wahrnehmung von Betroffenenrechten, die Löschung von Daten und eine Reaktion auf die Gefährdung der Daten gewährleisten. Ferner berücksichtigen wir den Schutz personenbezogener Daten bereits bei der Entwicklung bzw. Auswahl von Hardware, Software sowie Verfahren, entsprechend dem Prinzip des Datenschutzes durch Technikgestaltung und durch datenschutzfreundliche Voreinstellungen.
            </p>
          </section>

          {/* Hosting und Infrastruktur */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">Hosting und Infrastruktur</h2>
            <p className="form-legal-body">
              Unsere Plattform wird auf Servern von Scaleway SAS, 8 rue de la Ville l&apos;Evêque, 75008 Paris, Frankreich gehostet. Die Server befinden sich in Paris, Frankreich (EU). Scaleway ist nach ISO 27001 und HDS (Hébergeur de Données de Santé) zertifiziert. Es wurde ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO geschlossen.
            </p>
          </section>

          {/* Zahlungsabwicklung */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">Zahlungsabwicklung</h2>
            <p className="form-legal-body">
              Zahlungen werden über Stripe Payments Europe Limited, 1 Grand Canal Street Lower, Dublin 2, Irland abgewickelt. Stripe ist nach Art. 6 Abs. 1 lit. b DSGVO berechtigt, die für die Zahlungsabwicklung notwendigen Daten zu verarbeiten. Es wurde ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO geschlossen.
            </p>
          </section>

          {/* E-Mail-Versand */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">E-Mail-Versand</h2>
            <p className="form-legal-body">
              Transaktionale E-Mails werden über Resend (Functional Software, Inc.) versandt. Die Verarbeitung erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO. Es wurde ein Auftragsverarbeitungsvertrag gemäß Art. 28 DSGVO geschlossen.
            </p>
          </section>

          {/* Zusammenarbeit mit Auftragsverarbeitern und Dritten */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">Zusammenarbeit mit Auftragsverarbeitern und Dritten</h2>
            <p className="form-legal-body mb-4">
              Sofern wir im Rahmen unserer Verarbeitung Daten gegenüber anderen Personen und Unternehmen (Auftragsverarbeitern oder Dritten) offenbaren, sie an diese übermitteln oder ihnen sonst Zugriff auf die Daten gewähren, so erfolgt dies ausschließlich auf Grundlage einer gesetzlichen Erlaubnis (z.B. wenn eine Übermittlung der Daten an Dritte, wie an Zahlungsdienstleister, zur Vertragserfüllung erforderlich ist), Sie eingewilligt haben, eine rechtliche Verpflichtung dies vorsieht oder auf Grundlage unserer berechtigten Interessen (z.B. beim Einsatz von Beauftragten, Webhostern, etc.).
            </p>
            <p className="form-legal-body">
              Sofern wir Dritte mit der Verarbeitung von Daten auf Grundlage eines sog. „Auftragsverarbeitungsvertrages&quot; beauftragen, so geschieht dies auf Grundlage des Art. 28 DSGVO.
            </p>
          </section>

          {/* Datenverarbeitung in Drittländern */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">Datenverarbeitung in Drittländern</h2>
            <p className="form-legal-body">
              Sofern wir Daten in einem Drittland (d.h., außerhalb der Europäischen Union (EU), des Europäischen Wirtschaftsraums (EWR)) verarbeiten oder die Verarbeitung im Rahmen der Inanspruchnahme von Diensten Dritter stattfindet, erfolgt dies nur, wenn die besonderen Voraussetzungen der Art. 44 ff. DSGVO erfüllt sind. D.h., die Verarbeitung erfolgt z.B. auf Grundlage besonderer Garantien, wie der offiziell anerkannten Feststellung eines der EU entsprechenden Datenschutzniveaus (z.B. für die USA durch das Data Privacy Framework (DPF)) oder Beachtung offiziell anerkannter spezieller vertraglicher Verpflichtungen (sog. „Standardvertragsklauseln&quot;).
            </p>
          </section>

          {/* Rechte der betroffenen Personen */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">Rechte der betroffenen Personen</h2>
            <p className="form-legal-body mb-4">
              Ihnen stehen als Betroffene nach der DSGVO verschiedene Rechte zu, die sich insbesondere aus Art. 15 bis 21 DSGVO ergeben:
            </p>
            <ul className="form-legal-list form-legal-list--spaced">
              <li>
                <strong className="form-legal-body text-gray-900">Widerrufsrecht:</strong>
                <p className="form-legal-body mt-1">
                  Sie haben das Recht, erteilte Einwilligungen gem. Art. 7 Abs. 3 DSGVO mit Wirkung für die Zukunft zu widerrufen.
                </p>
              </li>
              <li>
                <strong className="form-legal-body text-gray-900">Widerspruchsrecht:</strong>
                <p className="form-legal-body mt-1">
                  Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung der Sie betreffenden personenbezogenen Daten, die aufgrund von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt, Widerspruch einzulegen; dies gilt auch für ein auf diese Bestimmungen gestütztes Profiling. Werden die Sie betreffenden personenbezogenen Daten verarbeitet, um Direktwerbung zu betreiben, haben Sie das Recht, jederzeit Widerspruch gegen die Verarbeitung der Sie betreffenden personenbezogenen Daten zum Zwecke derartiger Werbung einzulegen; dies gilt auch für das Profiling, soweit es mit solcher Direktwerbung in Verbindung steht.
                </p>
              </li>
              <li>
                <strong className="form-legal-body text-gray-900">Auskunftsrecht:</strong>
                <p className="form-legal-body mt-1">
                  Sie haben das Recht, eine Bestätigung darüber zu verlangen, ob betreffende Daten verarbeitet werden und auf Auskunft über diese Daten sowie auf weitere Informationen und Kopie der Daten entsprechend den gesetzlichen Vorgaben.
                </p>
              </li>
              <li>
                <strong className="form-legal-body text-gray-900">Recht auf Berichtigung:</strong>
                <p className="form-legal-body mt-1">
                  Sie haben das Recht, entsprechend den gesetzlichen Vorgaben die Vervollständigung der Sie betreffenden Daten oder die Berichtigung der Sie betreffenden unrichtigen Daten zu verlangen.
                </p>
              </li>
              <li>
                <strong className="form-legal-body text-gray-900">Recht auf Löschung und Einschränkung der Verarbeitung:</strong>
                <p className="form-legal-body mt-1">
                  Sie haben das Recht, zu verlangen, dass betreffende Daten unverzüglich gelöscht werden, bzw. alternativ entsprechend den gesetzlichen Vorgaben eine Einschränkung der Verarbeitung der Daten zu verlangen.
                </p>
              </li>
              <li>
                <strong className="form-legal-body text-gray-900">Recht auf Datenübertragbarkeit:</strong>
                <p className="form-legal-body mt-1">
                  Sie haben das Recht, die Sie betreffenden Daten, die Sie uns bereitgestellt haben, nach Maßgabe der gesetzlichen Vorgaben in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten oder deren Übermittlung an einen anderen Verantwortlichen zu fordern.
                </p>
              </li>
              <li>
                <strong className="form-legal-body text-gray-900">Beschwerde bei Aufsichtsbehörde:</strong>
                <p className="form-legal-body mt-1">
                  Sie haben ferner gem. Art. 77 DSGVO das Recht, eine Beschwerde bei einer Aufsichtsbehörde einzureichen, wenn Sie der Ansicht sind, dass die Verarbeitung der Sie betreffenden personenbezogenen Daten gegen die DSGVO verstößt.
                </p>
              </li>
            </ul>
          </section>

          {/* Widerrufsrecht */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">Widerrufsrecht</h2>
            <p className="form-legal-body">
              Sie haben das Recht, erteilte Einwilligungen gem. Art. 7 Abs. 3 DSGVO mit Wirkung für die Zukunft zu widerrufen.
            </p>
          </section>

          {/* Widerspruchsrecht */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">Widerspruchsrecht</h2>
            <p className="form-legal-body">
              Sie können der künftigen Verarbeitung der Sie betreffenden Daten nach Maßgabe der gesetzlichen Vorgaben jederzeit widersprechen. Der Widerspruch kann insbesondere gegen die Verarbeitung für Zwecke der Direktwerbung erfolgen.
            </p>
          </section>

          {/* Recht auf Datenübertragbarkeit */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">Recht auf Datenübertragbarkeit</h2>
            <p className="form-legal-body">
              Sie haben das Recht, die Sie betreffenden Daten, die Sie uns bereitgestellt haben, nach Maßgabe der gesetzlichen Vorgaben in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten oder deren Übermittlung an einen anderen Verantwortlichen zu fordern.
            </p>
          </section>

          {/* Löschung von Daten */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">Löschung von Daten</h2>
            <p className="form-legal-body mb-4">
              Die von uns verarbeiteten Daten werden nach Maßgabe der gesetzlichen Vorgaben gelöscht, sobald deren für die Verarbeitung erlaubten Einwilligungen widerrufen werden oder sonstige Erlaubnisse entfallen (z.B. wenn der Zweck der Verarbeitung dieser Daten entfallen ist oder sie für den Zweck nicht erforderlich sind).
            </p>
            <p className="form-legal-body mb-4">
              Sofern die Daten nicht gelöscht werden, weil sie für andere und gesetzlich zulässige Zwecke erforderlich sind, wird deren Verarbeitung auf diese Zwecke beschränkt. D.h., die Daten werden gesperrt und nicht für andere Zwecke verarbeitet. Dies gilt z.B. für Daten, die aus handels- oder steuerrechtlichen Gründen aufbewahrt werden müssen oder deren Speicherung zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist.
            </p>
            <p className="form-legal-body">
              Weitere Hinweise zu der Löschung von personenbezogenen Daten können ferner im Rahmen der einzelnen Datenschutzhinweise dieser Datenschutzerklärung erfolgen.
            </p>
          </section>

          {/* Einschränkung der Verarbeitung */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">Einschränkung der Verarbeitung</h2>
            <p className="form-legal-body mb-4">
              Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer Daten zu verlangen, wenn eine der in Art. 18 Abs. 1 DSGVO genannten Voraussetzungen gegeben ist:
            </p>
            <ul className="form-legal-list">
              <li>die Richtigkeit der personenbezogenen Daten von Ihnen bestritten wird, und zwar für eine Dauer, die es dem Verantwortlichen ermöglicht, die Richtigkeit der personenbezogenen Daten zu überprüfen;</li>
              <li>die Verarbeitung unrechtmäßig ist und Sie die Löschung der personenbezogenen Daten ablehnen und stattdessen die Einschränkung der Nutzung der personenbezogenen Daten verlangen;</li>
              <li>der Verantwortliche die personenbezogenen Daten für die Zwecke der Verarbeitung nicht länger benötigt, Sie diese jedoch zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen benötigen; oder</li>
              <li>Sie Widerspruch gegen die Verarbeitung gemäß Art. 21 Abs. 1 DSGVO eingelegt haben und noch nicht feststeht, ob die berechtigten Gründe des Verantwortlichen gegenüber Ihren Gründen überwiegen.</li>
            </ul>
          </section>

          {/* Recht auf Beschwerde bei der zuständigen Aufsichtsbehörde */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">Recht auf Beschwerde bei der zuständigen Aufsichtsbehörde</h2>
            <p className="form-legal-body">
              Sie haben ferner gem. Art. 77 DSGVO das Recht, eine Beschwerde bei einer Aufsichtsbehörde einzureichen, wenn Sie der Ansicht sind, dass die Verarbeitung der Sie betreffenden personenbezogenen Daten gegen die DSGVO verstößt.
            </p>
          </section>

          {/* Änderung und Aktualisierung der Datenschutzerklärung */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">Änderung und Aktualisierung der Datenschutzerklärung</h2>
            <p className="form-legal-body">
              Wir bitten Sie, sich regelmäßig über den Inhalt unserer Datenschutzerklärung zu informieren. Wir passen die Datenschutzerklärung an, sobald die Änderungen der von uns durchgeführten Datenverarbeitungen dies erforderlich machen. Wir informieren Sie, sobald die Änderungen eine Mitwirkungshandlung Ihrerseits (z.B. Einwilligung) oder eine sonstige individuelle Benachrichtigung erforderlich machen.
            </p>
          </section>

          {/* Begriffsdefinitionen */}
          <section className="form-legal-section">
            <h2 className="form-legal-h2">Begriffsdefinitionen</h2>
            <div className="space-y-6">
              <div>
                <h3 className="form-legal-h3">Bestandsdaten</h3>
                <p className="form-legal-body">
                  Bestandsdaten sind die zur Identifikation und Verwaltung von Vertragspartnern, Nutzerkonten, Profilen und ähnlichen Zuordnungen erforderlichen Grundinformationen (z.B. Namen, Kontaktdaten, Geburtsdaten, Nutzer-IDs).
                </p>
              </div>
              <div>
                <h3 className="form-legal-h3">Inhaltsdaten</h3>
                <p className="form-legal-body">
                  Inhaltsdaten sind die im Rahmen der Erstellung, Bearbeitung und Veröffentlichung von Inhalten generierten Informationen (z.B. Texte, Bilder, Videos, Audiodateien, Metadaten).
                </p>
              </div>
              <div>
                <h3 className="form-legal-h3">Kontaktdaten</h3>
                <p className="form-legal-body">
                  Kontaktdaten sind die zur Kommunikation erforderlichen Grundinformationen (z.B. Telefonnummern, Postadressen, E-Mail-Adressen, Social-Media-Handles, Instant-Messaging-Identifikatoren).
                </p>
              </div>
              <div>
                <h3 className="form-legal-h3">Meta-, Kommunikations- und Verfahrensdaten</h3>
                <p className="form-legal-body">
                  Meta-, Kommunikations- und Verfahrensdaten sind Informationen über die Art und Weise, wie Daten verarbeitet, übertragen und verwaltet werden. Meta-Daten beschreiben den Kontext, die Herkunft und die Struktur anderer Daten. Kommunikationsdaten erfassen den Informationsaustausch zwischen Nutzern. Verfahrensdaten beschreiben Systemabläufe und Audit-Protokolle.
                </p>
              </div>
              <div>
                <h3 className="form-legal-h3">Nutzungsdaten</h3>
                <p className="form-legal-body">
                  Nutzungsdaten sind Informationen darüber, wie Nutzer mit digitalen Produkten, Diensten oder Plattformen interagieren (z.B. Anwendungsnutzung, bevorzugte Funktionen, Verweildauer auf Seiten, Navigationspfade, Nutzungshäufigkeit, Zeitstempel, IP-Adressen, Geräteinformationen, Standortdaten).
                </p>
              </div>
              <div>
                <h3 className="form-legal-h3">Personenbezogene Daten</h3>
                <p className="form-legal-body">
                  Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person (betroffene Person) beziehen; als identifizierbar wird eine natürliche Person angesehen, die direkt oder indirekt, insbesondere mittels Zuordnung zu einer Kennung wie einem Namen, zu einer Kennnummer, zu Standortdaten, zu einer Online-Kennung (z.B. Cookie) oder zu einem oder mehreren besonderen Merkmalen identifiziert werden kann, die Ausdruck der physischen, physiologischen, genetischen, psychischen, wirtschaftlichen, kulturellen oder sozialen Identität dieser natürlichen Person sind.
                </p>
              </div>
              <div>
                <h3 className="form-legal-h3">Profile mit nutzerbezogenen Informationen</h3>
                <p className="form-legal-body">
                  Profile mit nutzerbezogenen Informationen sind die automatisierte Verarbeitung personenbezogener Daten, um bestimmte persönliche Aspekte einer natürlichen Person zu analysieren, zu bewerten oder vorherzusagen (z.B. demografische Merkmale, Verhalten, Interessen, Interaktionen mit Webseiten). Oft werden hierfür Cookies und Web-Beacons verwendet.
                </p>
              </div>
              <div>
                <h3 className="form-legal-h3">Protokolldaten</h3>
                <p className="form-legal-body">
                  Protokolldaten sind Informationen über Ereignisse oder Aktivitäten, die in einem System oder Netzwerk protokolliert werden (z.B. Zeitstempel, IP-Adressen, Benutzeraktionen, Fehlermeldungen). Sie werden für Systemanalysen, Sicherheitsüberwachung und Leistungsberichte verwendet.
                </p>
              </div>
              <div>
                <h3 className="form-legal-h3">Reichweitenmessung</h3>
                <p className="form-legal-body">
                  Reichweitenmessung ist die Auswertung der Besucherströme eines Onlineangebotes und kann das Verhalten oder Interessen der Besucher an bestimmten Informationen, wie z.B. Inhalten von Webseiten, umfassen. Mit Hilfe der Reichweitenmessung können Webseitenbetreiber z.B. erkennen, zu welcher Zeit Besucher ihre Webseite aufrufen und welche Inhalte von Interesse sind. Dadurch können sie z.B. die Inhalte der Webseite besser an die Bedürfnisse ihrer Besucher anpassen. Zu Zwecken der Reichweitenmessung werden häufig pseudonyme Cookies und Web-Beacons eingesetzt, um wiederkehrende Besucher zu erkennen und so genauere Analysen zur Nutzung eines Onlineangebotes zu erhalten.
                </p>
              </div>
              <div>
                <h3 className="form-legal-h3">Verantwortlicher</h3>
                <p className="form-legal-body">
                  Verantwortlicher ist die natürliche oder juristische Person, Behörde, Einrichtung oder andere Stelle, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet.
                </p>
              </div>
              <div>
                <h3 className="form-legal-h3">Verarbeitung</h3>
                <p className="form-legal-body">
                  Verarbeitung ist jeder mit oder ohne Hilfe automatisierter Verfahren ausgeführte Vorgang oder jede solche Vorgangsreihe im Zusammenhang mit personenbezogenen Daten. Der Begriff reicht weit und umfasst praktisch jeden Umgang mit Daten, wie das Erheben, Erfassen, Organisieren, Ordnen, Speichern, Anpassen oder Verändern, Auslesen, Abfragen, Verwenden, Offenlegen durch Übermittlung, Verbreitung oder eine andere Form der Bereitstellung, den Abgleich oder die Verknüpfung, die Einschränkung, das Löschen oder die Vernichtung.
                </p>
              </div>
              <div>
                <h3 className="form-legal-h3">Vertragsdaten</h3>
                <p className="form-legal-body">
                  Vertragsdaten sind die zur formalen Vereinbarung von Verträgen zwischen Parteien erforderlichen spezifischen Informationen (z.B. Vertragsbedingungen, Vertragsdauer, Start- und Enddaten, Leistungen/Produkte, Preise, Zahlungsbedingungen, Kündigungsrechte, Verlängerungsoptionen, besondere Klauseln).
                </p>
              </div>
              <div>
                <h3 className="form-legal-h3">Zahlungsdaten</h3>
                <p className="form-legal-body">
                  Zahlungsdaten sind alle Informationen, die zur Abwicklung von Zahlungstransaktionen erforderlich sind (z.B. Kreditkartennummern, Bankverbindungen, Zahlungsbeträge, Transaktionsdaten, Verifizierungsnummern, Rechnungsinformationen, Zahlungsstatus, Rückbuchungen, Autorisierungen, Gebühren).
                </p>
              </div>
            </div>
            </section>

            <section>
  <h2 className="form-legal-h2">Recht auf Löschung (Art. 17 DSGVO)</h2>
  <p className="form-legal-body">
    Sie haben das Recht, die Löschung Ihrer bei uns gespeicherten personenbezogenen Daten zu verlangen. Um eine Löschung Ihrer Daten zu beantragen, senden Sie uns bitte eine E-Mail an{' '}
    <a href="mailto:datenschutz@releafz.de" className="text-green-700 underline">
      datenschutz@releafz.de
    </a>{' '}
    mit Ihrer registrierten E-Mail-Adresse und dem Betreff &bdquo;Datenlöschung&ldquo;. Wir werden Ihren Antrag innerhalb von 30 Tagen gemäß Art. 17 DSGVO bearbeiten und Ihnen eine Bestätigung zusenden.
  </p>
  <p className="form-legal-body mt-2">
    Bitte beachten Sie, dass bestimmte Daten aufgrund gesetzlicher Aufbewahrungspflichten (z.B. steuerrechtliche Anforderungen) nicht sofort gelöscht werden können.
  </p>
</section>

</div>
</div>
</div>
)
}



