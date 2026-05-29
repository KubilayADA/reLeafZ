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
  eyebrow: 'FAQ',
  title: 'Häufige Fragen',
  items: [
    {
      id: 'was-ist-medizinisches-cannabis',
      question: 'Was ist medizinisches Cannabis?',
      answer:
        'Medizinisches Cannabis Blüten beschreibt cannabisbasierte Arzneimittel, die zu therapeutischen Zwecken eingesetzt werden. Die Pflanze enthält viele Inhaltsstoffe wie Cannabinoide, Terpene und Flavonoide, deren Zusammenspiel unterschiedliche Wirkungen haben kann. Diese interagieren mit Deinem körpereigenen Endocannabinoidsystem und unterstützen Deinen Körper dabei, einen Gleichgewichtszustand zu erreichen, wiederherzustellen oder aufrechtzuerhalten. Die bekanntesten Cannabinoide sind THC und CBD.',
    },
    {
      id: 'ohne-rezept',
      question: 'Kann ich medizinisches Cannabis auch ohne Rezept bestellen?',
      answer:
        'Nein, ohne ein gültiges Rezept ist die Abgabe von Medizinalcannabis nicht möglich.',
    },
    {
      id: 'rezept-erhalten',
      question: 'Wie erhalte ich ein Rezept?',
      answer:
        'Um ein Rezept für Medizinalcannabis zu bekommen, besprich bitte mit Deiner Ärztin oder Deinem Arzt, ob diese Therapie für Dich geeignet ist. Sie können entscheiden, ob eine Behandlung sinnvoll ist und Dir das passende Rezept ausstellen. Falls Du keine behandelnde Ärztin oder keinen behandelnden Arzt hast, kannst Du Dich auch an eine Telemedizinplattform oder einen Online-Arzt wenden.',
    },
    {
      id: 'bezahlung',
      question: 'Wie bezahle ich mein Medikament?',
      answer:
        'Für alle Bestellungen stehen Dir bei Releafz verschiedene Zahlungsmöglichkeiten zur Verfügung. Weitere Informationen zu den verfügbaren Zahlungsoptionen findest Du in Deinem Kundenkonto oder beim Checkout.',
    },
    {
      id: 'versanddauer',
      question: 'Wie lange dauert der Versand?',
      answer:
        'Dein Paket wird mit unserem Versanddienstleister verschickt. Sobald die Bestellung übergeben wurde, dauert es in der Regel 1–3 Werktage bis zur Zustellung. Wir versenden an die Lieferadresse, die in Deinem Releafz-Kundenkonto hinterlegt ist.',
    },
    {
      id: 'diskrete-lieferung',
      question: 'Kommt meine Bestellung diskret bei mir an?',
      answer:
        'Deine Bestellung wird in einem neutralen Karton verschickt. Zusätzlich sind die Behälter unserer Cannabisblüten geruchsdicht verschlossen, sodass niemand den Inhalt erkennen kann.',
    },
    {
      id: 'abholung',
      question: 'Kann ich meine Bestellung auch vor Ort abholen?',
      answer:
        'Du kannst Deine Bestellung von Montag bis Freitag zwischen 10:00 und 18:00 Uhr in unserer Apotheke abholen. Wenn Dein Originalrezept bis 12:00 Uhr bei uns eingeht und Deine Zahlung verbucht wurde, ist Deine Bestellung in der Regel noch am selben Werktag ab 15:00 Uhr abholbereit. Final abholbereit ist Deine Bestellung, sobald Du unsere Abholbestätigung per E-Mail erhalten hast.',
    },
  ],
}
