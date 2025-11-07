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

export default function Datenschutzerklärung() {
  return (
    <div className="min-h-screen bg-beige inconsolata">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <LeafLogo className="w-48 h-24 sm:w-56 sm:h-28 md:w-64 md:h-32 mb-4 sm:mb-6" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold title-gradient text-center">
              DATENSCHUTZERKLÄRUNG
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 space-y-6 sm:space-y-8">
          
          {/* Einleitung */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Einleitung</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
              Mit der folgenden Datenschutzerklärung möchten wir Sie darüber aufklären, welche Arten Ihrer personenbezogenen Daten (nachfolgend auch kurz als „Daten" bezeichnet) wir zu welchen Zwecken und in welchem Umfang verarbeiten. Die Datenschutzerklärung gilt für alle von uns durchgeführten Verarbeitungen personenbezogener Daten, sowohl im Rahmen der Erbringung unserer Leistungen als auch innerhalb unserer Onlineangebote, wie z.B. unserer Webseiten, mobilen Applikationen, externen Onlinepräsenzen, wie z.B. unserer Social-Media-Profile (nachfolgend zusammenfassend als „Onlineangebot" bezeichnet).
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
              Die verwendeten Begriffe sind nicht geschlechtsspezifisch.
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-semibold">
              Stand: 1. Januar 2024
            </p>
          </section>

          {/* Verantwortlicher */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Verantwortlicher</h2>
            <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-2">
              <p><strong>Releafz</strong></p>
              <p>Adresse: [Ihre Adresse]</p>
              <p>E-Mail: support@releafz.com</p>
              <p>Telefon: [Ihre Telefonnummer]</p>
              <p>Website: www.releafz.com</p>
            </div>
          </section>

          {/* Arten der verarbeiteten Daten */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Arten der verarbeiteten Daten</h2>
            <ul className="list-disc list-inside text-sm sm:text-base text-gray-700 leading-relaxed space-y-2 ml-4">
              <li>Bestandsdaten (z.B. Namen, Adressen).</li>
              <li>Kontaktdaten (z.B. E-Mail, Telefonnummern).</li>
              <li>Inhaltsdaten (z.B. Texteingaben, Fotografien, Videos).</li>
              <li>Nutzungsdaten (z.B. besuchte Webseiten, Interesse an Inhalten, Zugriffszeiten).</li>
              <li>Meta-/Kommunikationsdaten (z.B. Geräte-Informationen, IP-Adressen).</li>
            </ul>
          </section>

          {/* Zweck der Verarbeitung */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Zweck der Verarbeitung</h2>
            <ul className="list-disc list-inside text-sm sm:text-base text-gray-700 leading-relaxed space-y-2 ml-4">
              <li>Zurverfügungstellung des Onlineangebotes, seiner Funktionen und Inhalte.</li>
              <li>Beantwortung von Kontaktanfragen und Kommunikation mit Nutzern.</li>
              <li>Sicherheitsmaßnahmen.</li>
              <li>Reichweitenmessung/Marketing.</li>
            </ul>
          </section>

          {/* Maßgebliche Rechtsgrundlagen */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Maßgebliche Rechtsgrundlagen</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
              Im Folgenden erhalten Sie eine Übersicht der Rechtsgrundlagen der DSGVO, auf deren Basis wir personenbezogene Daten verarbeiten. Bitte beachten Sie, dass neben den Regelungen der DSGVO nationale Datenschutzvorgaben in Ihrem bzw. unserem Wohn- oder Sitzland gelten können. Sollten darüber hinaus im Einzelfall speziellere Rechtsgrundlagen maßgeblich sein, teilen wir Ihnen diese in der Datenschutzerklärung mit.
            </p>
            <ul className="space-y-4">
              <li>
                <strong className="text-sm sm:text-base text-gray-900">Einwilligung (Art. 6 Abs. 1 S. 1 lit. a) DSGVO):</strong>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-1">
                  Die betroffene Person hat ihre Einwilligung zu der Verarbeitung der sie betreffenden personenbezogenen Daten für einen bestimmten Zweck oder mehrere bestimmte Zwecke gegeben.
                </p>
              </li>
              <li>
                <strong className="text-sm sm:text-base text-gray-900">Vertragserfüllung und vorvertragliche Anfragen (Art. 6 Abs. 1 S. 1 lit. b) DSGVO):</strong>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-1">
                  Die Verarbeitung ist für die Erfüllung eines Vertrags, dessen Vertragspartei die betroffene Person ist, oder zur Durchführung vorvertraglicher Maßnahmen erforderlich, die auf Anfrage der betroffenen Person erfolgen.
                </p>
              </li>
              <li>
                <strong className="text-sm sm:text-base text-gray-900">Rechtliche Verpflichtung (Art. 6 Abs. 1 S. 1 lit. c) DSGVO):</strong>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-1">
                  Die Verarbeitung ist zur Erfüllung einer rechtlichen Verpflichtung erforderlich, der der Verantwortliche unterliegt.
                </p>
              </li>
              <li>
                <strong className="text-sm sm:text-base text-gray-900">Berechtigte Interessen (Art. 6 Abs. 1 S. 1 lit. f) DSGVO):</strong>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-1">
                  Die Verarbeitung ist zur Wahrung der berechtigten Interessen des Verantwortlichen oder eines Dritten erforderlich, sofern nicht die Interessen oder Grundrechte und Grundfreiheiten der betroffenen Person, die den Schutz personenbezogener Daten erfordern, überwiegen.
                </p>
              </li>
              <li>
                <strong className="text-sm sm:text-base text-gray-900">Nationale Datenschutzregelungen in Deutschland:</strong>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-1">
                  Zusätzlich zu den Datenschutzregelungen der DSGVO gelten nationale Regelungen zum Datenschutz in Deutschland. Hierzu gehört insbesondere das Gesetz zum Schutz vor Missbrauch personenbezogener Daten bei der Datenverarbeitung (Bundesdatenschutzgesetz – BDSG). Das BDSG enthält insbesondere Spezialregelungen zum Recht auf Auskunft, zum Recht auf Löschung, zum Widerspruchsrecht, zur Verarbeitung besonderer Kategorien personenbezogener Daten, zur Verarbeitung für andere Zwecke und zur Übermittlung sowie automatisierten Entscheidungsfindung im Einzelfall einschließlich Profiling.
                </p>
              </li>
            </ul>
          </section>

          {/* Sicherheitsmaßnahmen */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Sicherheitsmaßnahmen</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
              Wir treffen nach Maßgabe der gesetzlichen Vorgaben unter Berücksichtigung des Stands der Technik, der Implementierungskosten und der Art, des Umfangs, der Umstände und der Zwecke der Verarbeitung sowie der unterschiedlichen Eintrittswahrscheinlichkeiten und des Ausmaßes der Bedrohung für die Rechte und Freiheiten natürlicher Personen geeignete technische und organisatorische Maßnahmen, um ein dem Risiko angemessenes Schutzniveau zu gewährleisten.
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Zu den Maßnahmen gehören insbesondere die Sicherung der Vertraulichkeit, Integrität und Verfügbarkeit von Daten durch Kontrolle des physischen und elektronischen Zugangs zu den Daten als auch des sie betreffenden Zugriffs, der Eingabe, der Weitergabe, der Sicherung der Verfügbarkeit und ihrer Trennung. Des Weiteren haben wir Verfahren eingerichtet, die eine Wahrnehmung von Betroffenenrechten, die Löschung von Daten und eine Reaktion auf die Gefährdung der Daten gewährleisten. Ferner berücksichtigen wir den Schutz personenbezogener Daten bereits bei der Entwicklung bzw. Auswahl von Hardware, Software sowie Verfahren, entsprechend dem Prinzip des Datenschutzes durch Technikgestaltung und durch datenschutzfreundliche Voreinstellungen.
            </p>
          </section>

          {/* Zusammenarbeit mit Auftragsverarbeitern und Dritten */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Zusammenarbeit mit Auftragsverarbeitern und Dritten</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
              Sofern wir im Rahmen unserer Verarbeitung Daten gegenüber anderen Personen und Unternehmen (Auftragsverarbeitern oder Dritten) offenbaren, sie an diese übermitteln oder ihnen sonst Zugriff auf die Daten gewähren, so erfolgt dies ausschließlich auf Grundlage einer gesetzlichen Erlaubnis (z.B. wenn eine Übermittlung der Daten an Dritte, wie an Zahlungsdienstleister, zur Vertragserfüllung erforderlich ist), Sie eingewilligt haben, eine rechtliche Verpflichtung dies vorsieht oder auf Grundlage unserer berechtigten Interessen (z.B. beim Einsatz von Beauftragten, Webhostern, etc.).
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Sofern wir Dritte mit der Verarbeitung von Daten auf Grundlage eines sog. „Auftragsverarbeitungsvertrages" beauftragen, so geschieht dies auf Grundlage des Art. 28 DSGVO.
            </p>
          </section>

          {/* Datenverarbeitung in Drittländern */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Datenverarbeitung in Drittländern</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Sofern wir Daten in einem Drittland (d.h., außerhalb der Europäischen Union (EU), des Europäischen Wirtschaftsraums (EWR)) verarbeiten oder die Verarbeitung im Rahmen der Inanspruchnahme von Diensten Dritter stattfindet, erfolgt dies nur, wenn die besonderen Voraussetzungen der Art. 44 ff. DSGVO erfüllt sind. D.h., die Verarbeitung erfolgt z.B. auf Grundlage besonderer Garantien, wie der offiziell anerkannten Feststellung eines der EU entsprechenden Datenschutzniveaus (z.B. für die USA durch den „Privacy Shield") oder Beachtung offiziell anerkannter spezieller vertraglicher Verpflichtungen (sog. „Standardvertragsklauseln").
            </p>
          </section>

          {/* Rechte der betroffenen Personen */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Rechte der betroffenen Personen</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
              Ihnen stehen als Betroffene nach der DSGVO verschiedene Rechte zu, die sich insbesondere aus Art. 15 bis 21 DSGVO ergeben:
            </p>
            <ul className="space-y-4">
              <li>
                <strong className="text-sm sm:text-base text-gray-900">Widerrufsrecht:</strong>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-1">
                  Sie haben das Recht, erteilte Einwilligungen gem. Art. 7 Abs. 3 DSGVO mit Wirkung für die Zukunft zu widerrufen.
                </p>
              </li>
              <li>
                <strong className="text-sm sm:text-base text-gray-900">Widerspruchsrecht:</strong>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-1">
                  Sie haben das Recht, aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit gegen die Verarbeitung der Sie betreffenden personenbezogenen Daten, die aufgrund von Art. 6 Abs. 1 lit. e oder f DSGVO erfolgt, Widerspruch einzulegen; dies gilt auch für ein auf diese Bestimmungen gestütztes Profiling. Werden die Sie betreffenden personenbezogenen Daten verarbeitet, um Direktwerbung zu betreiben, haben Sie das Recht, jederzeit Widerspruch gegen die Verarbeitung der Sie betreffenden personenbezogenen Daten zum Zwecke derartiger Werbung einzulegen; dies gilt auch für das Profiling, soweit es mit solcher Direktwerbung in Verbindung steht.
                </p>
              </li>
              <li>
                <strong className="text-sm sm:text-base text-gray-900">Auskunftsrecht:</strong>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-1">
                  Sie haben das Recht, eine Bestätigung darüber zu verlangen, ob betreffende Daten verarbeitet werden und auf Auskunft über diese Daten sowie auf weitere Informationen und Kopie der Daten entsprechend den gesetzlichen Vorgaben.
                </p>
              </li>
              <li>
                <strong className="text-sm sm:text-base text-gray-900">Recht auf Berichtigung:</strong>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-1">
                  Sie haben das Recht, entsprechend den gesetzlichen Vorgaben die Vervollständigung der Sie betreffenden Daten oder die Berichtigung der Sie betreffenden unrichtigen Daten zu verlangen.
                </p>
              </li>
              <li>
                <strong className="text-sm sm:text-base text-gray-900">Recht auf Löschung und Einschränkung der Verarbeitung:</strong>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-1">
                  Sie haben das Recht, zu verlangen, dass betreffende Daten unverzüglich gelöscht werden, bzw. alternativ entsprechend den gesetzlichen Vorgaben eine Einschränkung der Verarbeitung der Daten zu verlangen.
                </p>
              </li>
              <li>
                <strong className="text-sm sm:text-base text-gray-900">Recht auf Datenübertragbarkeit:</strong>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-1">
                  Sie haben das Recht, die Sie betreffenden Daten, die Sie uns bereitgestellt haben, nach Maßgabe der gesetzlichen Vorgaben in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten oder deren Übermittlung an einen anderen Verantwortlichen zu fordern.
                </p>
              </li>
              <li>
                <strong className="text-sm sm:text-base text-gray-900">Beschwerde bei Aufsichtsbehörde:</strong>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-1">
                  Sie haben ferner gem. Art. 77 DSGVO das Recht, eine Beschwerde bei einer Aufsichtsbehörde einzureichen, wenn Sie der Ansicht sind, dass die Verarbeitung der Sie betreffenden personenbezogenen Daten gegen die DSGVO verstößt.
                </p>
              </li>
            </ul>
          </section>

          {/* Widerrufsrecht */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Widerrufsrecht</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Sie haben das Recht, erteilte Einwilligungen gem. Art. 7 Abs. 3 DSGVO mit Wirkung für die Zukunft zu widerrufen.
            </p>
          </section>

          {/* Widerspruchsrecht */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Widerspruchsrecht</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Sie können der künftigen Verarbeitung der Sie betreffenden Daten nach Maßgabe der gesetzlichen Vorgaben jederzeit widersprechen. Der Widerspruch kann insbesondere gegen die Verarbeitung für Zwecke der Direktwerbung erfolgen.
            </p>
          </section>

          {/* Recht auf Datenübertragbarkeit */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Recht auf Datenübertragbarkeit</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Sie haben das Recht, die Sie betreffenden Daten, die Sie uns bereitgestellt haben, nach Maßgabe der gesetzlichen Vorgaben in einem strukturierten, gängigen und maschinenlesbaren Format zu erhalten oder deren Übermittlung an einen anderen Verantwortlichen zu fordern.
            </p>
          </section>

          {/* Löschung von Daten */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Löschung von Daten</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
              Die von uns verarbeiteten Daten werden nach Maßgabe der gesetzlichen Vorgaben gelöscht, sobald deren für die Verarbeitung erlaubten Einwilligungen widerrufen werden oder sonstige Erlaubnisse entfallen (z.B. wenn der Zweck der Verarbeitung dieser Daten entfallen ist oder sie für den Zweck nicht erforderlich sind).
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
              Sofern die Daten nicht gelöscht werden, weil sie für andere und gesetzlich zulässige Zwecke erforderlich sind, wird deren Verarbeitung auf diese Zwecke beschränkt. D.h., die Daten werden gesperrt und nicht für andere Zwecke verarbeitet. Dies gilt z.B. für Daten, die aus handels- oder steuerrechtlichen Gründen aufbewahrt werden müssen oder deren Speicherung zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen erforderlich ist.
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Weitere Hinweise zu der Löschung von personenbezogenen Daten können ferner im Rahmen der einzelnen Datenschutzhinweise dieser Datenschutzerklärung erfolgen.
            </p>
          </section>

          {/* Einschränkung der Verarbeitung */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Einschränkung der Verarbeitung</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
              Sie haben das Recht, die Einschränkung der Verarbeitung Ihrer Daten zu verlangen, wenn eine der in Art. 18 Abs. 1 DSGVO genannten Voraussetzungen gegeben ist:
            </p>
            <ul className="list-disc list-inside text-sm sm:text-base text-gray-700 leading-relaxed space-y-2 ml-4">
              <li>die Richtigkeit der personenbezogenen Daten von Ihnen bestritten wird, und zwar für eine Dauer, die es dem Verantwortlichen ermöglicht, die Richtigkeit der personenbezogenen Daten zu überprüfen;</li>
              <li>die Verarbeitung unrechtmäßig ist und Sie die Löschung der personenbezogenen Daten ablehnen und stattdessen die Einschränkung der Nutzung der personenbezogenen Daten verlangen;</li>
              <li>der Verantwortliche die personenbezogenen Daten für die Zwecke der Verarbeitung nicht länger benötigt, Sie diese jedoch zur Geltendmachung, Ausübung oder Verteidigung von Rechtsansprüchen benötigen; oder</li>
              <li>Sie Widerspruch gegen die Verarbeitung gemäß Art. 21 Abs. 1 DSGVO eingelegt haben und noch nicht feststeht, ob die berechtigten Gründe des Verantwortlichen gegenüber Ihren Gründen überwiegen.</li>
            </ul>
          </section>

          {/* Recht auf Beschwerde bei der zuständigen Aufsichtsbehörde */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Recht auf Beschwerde bei der zuständigen Aufsichtsbehörde</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Sie haben ferner gem. Art. 77 DSGVO das Recht, eine Beschwerde bei einer Aufsichtsbehörde einzureichen, wenn Sie der Ansicht sind, dass die Verarbeitung der Sie betreffenden personenbezogenen Daten gegen die DSGVO verstößt.
            </p>
          </section>

          {/* Änderung und Aktualisierung der Datenschutzerklärung */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Änderung und Aktualisierung der Datenschutzerklärung</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Wir bitten Sie, sich regelmäßig über den Inhalt unserer Datenschutzerklärung zu informieren. Wir passen die Datenschutzerklärung an, sobald die Änderungen der von uns durchgeführten Datenverarbeitungen dies erforderlich machen. Wir informieren Sie, sobald die Änderungen eine Mitwirkungshandlung Ihrerseits (z.B. Einwilligung) oder eine sonstige individuelle Benachrichtigung erforderlich machen.
            </p>
          </section>

          {/* Fragen an den Datenschutzbeauftragten */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Fragen an den Datenschutzbeauftragten</h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Wenn Sie Fragen zum Datenschutz haben, senden Sie uns bitte eine E-Mail an support@releafz.com oder wenden Sie sich direkt an die für den Datenschutz verantwortliche Person in unserer Organisation.
            </p>
          </section>

          {/* Begriffsdefinitionen */}
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Begriffsdefinitionen</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Bestandsdaten</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Bestandsdaten sind die zur Identifikation und Verwaltung von Vertragspartnern, Nutzerkonten, Profilen und ähnlichen Zuordnungen erforderlichen Grundinformationen (z.B. Namen, Kontaktdaten, Geburtsdaten, Nutzer-IDs).
                </p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Inhaltsdaten</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Inhaltsdaten sind die im Rahmen der Erstellung, Bearbeitung und Veröffentlichung von Inhalten generierten Informationen (z.B. Texte, Bilder, Videos, Audiodateien, Metadaten).
                </p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Kontaktdaten</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Kontaktdaten sind die zur Kommunikation erforderlichen Grundinformationen (z.B. Telefonnummern, Postadressen, E-Mail-Adressen, Social-Media-Handles, Instant-Messaging-Identifikatoren).
                </p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Meta-, Kommunikations- und Verfahrensdaten</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Meta-, Kommunikations- und Verfahrensdaten sind Informationen über die Art und Weise, wie Daten verarbeitet, übertragen und verwaltet werden. Meta-Daten beschreiben den Kontext, die Herkunft und die Struktur anderer Daten. Kommunikationsdaten erfassen den Informationsaustausch zwischen Nutzern. Verfahrensdaten beschreiben Systemabläufe und Audit-Protokolle.
                </p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Nutzungsdaten</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Nutzungsdaten sind Informationen darüber, wie Nutzer mit digitalen Produkten, Diensten oder Plattformen interagieren (z.B. Anwendungsnutzung, bevorzugte Funktionen, Verweildauer auf Seiten, Navigationspfade, Nutzungshäufigkeit, Zeitstempel, IP-Adressen, Geräteinformationen, Standortdaten).
                </p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Personenbezogene Daten</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person (betroffene Person) beziehen; als identifizierbar wird eine natürliche Person angesehen, die direkt oder indirekt, insbesondere mittels Zuordnung zu einer Kennung wie einem Namen, zu einer Kennnummer, zu Standortdaten, zu einer Online-Kennung (z.B. Cookie) oder zu einem oder mehreren besonderen Merkmalen identifiziert werden kann, die Ausdruck der physischen, physiologischen, genetischen, psychischen, wirtschaftlichen, kulturellen oder sozialen Identität dieser natürlichen Person sind.
                </p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Profile mit nutzerbezogenen Informationen</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Profile mit nutzerbezogenen Informationen sind die automatisierte Verarbeitung personenbezogener Daten, um bestimmte persönliche Aspekte einer natürlichen Person zu analysieren, zu bewerten oder vorherzusagen (z.B. demografische Merkmale, Verhalten, Interessen, Interaktionen mit Webseiten). Oft werden hierfür Cookies und Web-Beacons verwendet.
                </p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Protokolldaten</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Protokolldaten sind Informationen über Ereignisse oder Aktivitäten, die in einem System oder Netzwerk protokolliert werden (z.B. Zeitstempel, IP-Adressen, Benutzeraktionen, Fehlermeldungen). Sie werden für Systemanalysen, Sicherheitsüberwachung und Leistungsberichte verwendet.
                </p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Reichweitenmessung</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Reichweitenmessung ist die Auswertung der Besucherströme eines Onlineangebotes und kann das Verhalten oder Interessen der Besucher an bestimmten Informationen, wie z.B. Inhalten von Webseiten, umfassen. Mit Hilfe der Reichweitenmessung können Webseitenbetreiber z.B. erkennen, zu welcher Zeit Besucher ihre Webseite aufrufen und welche Inhalte von Interesse sind. Dadurch können sie z.B. die Inhalte der Webseite besser an die Bedürfnisse ihrer Besucher anpassen. Zu Zwecken der Reichweitenmessung werden häufig pseudonyme Cookies und Web-Beacons eingesetzt, um wiederkehrende Besucher zu erkennen und so genauere Analysen zur Nutzung eines Onlineangebotes zu erhalten.
                </p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Verantwortlicher</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Verantwortlicher ist die natürliche oder juristische Person, Behörde, Einrichtung oder andere Stelle, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet.
                </p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Verarbeitung</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Verarbeitung ist jeder mit oder ohne Hilfe automatisierter Verfahren ausgeführte Vorgang oder jede solche Vorgangsreihe im Zusammenhang mit personenbezogenen Daten. Der Begriff reicht weit und umfasst praktisch jeden Umgang mit Daten, wie das Erheben, Erfassen, Organisieren, Ordnen, Speichern, Anpassen oder Verändern, Auslesen, Abfragen, Verwenden, Offenlegen durch Übermittlung, Verbreitung oder eine andere Form der Bereitstellung, den Abgleich oder die Verknüpfung, die Einschränkung, das Löschen oder die Vernichtung.
                </p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Vertragsdaten</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Vertragsdaten sind die zur formalen Vereinbarung von Verträgen zwischen Parteien erforderlichen spezifischen Informationen (z.B. Vertragsbedingungen, Vertragsdauer, Start- und Enddaten, Leistungen/Produkte, Preise, Zahlungsbedingungen, Kündigungsrechte, Verlängerungsoptionen, besondere Klauseln).
                </p>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Zahlungsdaten</h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Zahlungsdaten sind alle Informationen, die zur Abwicklung von Zahlungstransaktionen erforderlich sind (z.B. Kreditkartennummern, Bankverbindungen, Zahlungsbeträge, Transaktionsdaten, Verifizierungsnummern, Rechnungsinformationen, Zahlungsstatus, Rückbuchungen, Autorisierungen, Gebühren).
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}

