export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface FaqContent {
  eyebrow: string
  title: string
  items: FaqItem[]
}

export const faqDe: FaqContent = {
  eyebrow: 'Häufig gestellte Fragen',
  title: 'Alles, was du wissen möchtest.',
  items: [
    {
      id: 'was-ist-medizinisches-cannabis',
      question: 'Was steckt hinter medizinischem Cannabis?',
      answer:
        'Cannabis als Medizin ist weit mehr als ein einzelner Wirkstoff. Die Pflanze vereint eine Vielzahl an Inhaltsstoffen – darunter Cannabinoide, Terpene und Flavonoide – die gemeinsam auf Deinen Körper wirken. Sie sprechen das Endocannabinoidsystem an, ein natürliches Regulationssystem, das dabei hilft, innere Balance zu fördern und aufrechtzuerhalten. Besonders bekannt sind die Cannabinoide THC und CBD.',
    },
    {
      id: 'ohne-rezept',
      question: 'Brauche ich zwingend ein Rezept?',
      answer:
        'Ja, absolut. Medizinalcannabis ist ein verschreibungspflichtiges Arzneimittel und darf ausschließlich mit einem gültigen Rezept abgegeben werden. Eine Bestellung ohne Rezept ist gesetzlich nicht möglich.',
    },
    {
      id: 'rezept-erhalten',
      question: 'Wie komme ich an mein Rezept?',
      answer:
        'Der erste Schritt ist ein offenes Gespräch mit Deiner Ärztin oder Deinem Arzt. Gemeinsam könnt ihr besprechen, ob eine Therapie mit Medizinalcannabis für Dich in Frage kommt. Hast Du aktuell keine hausärztliche Betreuung, stehen Dir auch Telemedizinplattformen und Online-Ärzte zur Verfügung, die Dich schnell und unkompliziert beraten können.',
    },
    {
      id: 'bezahlung',
      question: 'Wie läuft die Bezahlung bei Releafz ab?',
      answer:
        'Bei Releafz stehen Dir verschiedene Zahlungsmöglichkeiten zur Verfügung, damit Du flexibel und bequem bezahlen kannst. Alle verfügbaren Optionen findest Du übersichtlich in Deinem Kundenkonto oder direkt im Checkout-Prozess.',
    },
    {
      id: 'versanddauer',
      question: 'Wann kommt mein Paket an?',
      answer:
        'Nach der Übergabe an unseren Versandpartner ist Deine Bestellung in der Regel innerhalb von 1–3 Werktagen bei Dir. Der Versand erfolgt an die Lieferadresse, die Du in Deinem Releafz-Konto hinterlegt hast. Sobald Dein Paket unterwegs ist, erhältst Du eine Versandbestätigung.',
    },
    {
      id: 'diskrete-lieferung',
      question: 'Wird meine Bestellung diskret verpackt?',
      answer:
        'Absolut. Deine Privatsphäre liegt uns am Herzen. Jede Bestellung wird in einem unauffälligen, neutralen Karton verschickt – ohne Hinweise auf den Inhalt. Die Verpackung unserer Produkte ist zudem geruchsdicht, sodass der Inhalt zu keinem Zeitpunkt erkennbar ist.',
    },
    {
      id: 'abholung',
      question: 'Kann ich meine Bestellung auch persönlich abholen?',
      answer:
        'Ja, eine Abholung vor Ort ist möglich. Unsere Apotheke ist montags bis freitags von 10:00 bis 18:00 Uhr für Dich geöffnet. Geht Dein Originalrezept bis 12:00 Uhr bei uns ein und Deine Zahlung ist bestätigt, ist Deine Bestellung in der Regel noch am selben Tag ab 15:00 Uhr bereit. Die offizielle Abholbereitschaft teilen wir Dir per E-Mail mit.',
    },
  ],
}
