'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function DoctorApprovalPendingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-teal-50">
      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center justify-center">
        
        {/* Success Icon */}
        <div className="mb-8">
          <CheckCircle className="w-24 h-24 text-green-600 animate-pulse" />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-4">
          Anfrage erfolgreich eingereicht!
        </h1>

        {/* Message */}
        <p className="text-lg text-gray-600 text-center mb-6">
          Ihre medizinische Anfrage mit den ausgewählten Sorten wurde erfolgreich an unseren Arzt übermittelt.
        </p>

        {/* Info Box */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8 mb-8 w-full">
          <h2 className="text-lg font-semibold text-emerald-800 mb-4">
            Was passiert jetzt?
          </h2>
          <ul className="space-y-3 text-emerald-700">
            <li className="flex items-start">
              <span className="font-bold mr-3">1.</span>
              <span>Unser Arzt prüft Ihre Anfrage und die ausgewählten Sorten</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-3">2.</span>
              <span>Sie erhalten eine E-Mail mit der Genehmigung oder Ablehnung</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-3">3.</span>
              <span>Nach Genehmigung: Abholung in der Apotheke oder Lieferung per Wolt/Uber</span>
            </li>
          </ul>
        </div>

        {/* Timeline */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 w-full">
          <h3 className="font-semibold text-gray-800 mb-4">Ungefähre Zeitlinie:</h3>
          <div className="space-y-2 text-gray-600 text-sm">
            <p>⏱️ <strong>Ärztliche Überprüfung:</strong> 1-4 Stunden</p>
            <p>📧 <strong>E-Mail Benachrichtigung:</strong> Nach Überprüfung</p>
            <p>🚗 <strong>Lieferung/Abholung:</strong> 30-90 Minuten nach Genehmigung</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="px-6 py-3 text-lg"
          >
            Zur Startseite
          </Button>
          <Button
            onClick={() => router.push('/')}
            className="px-6 py-3 text-lg bg-green-600 hover:bg-green-700 text-white"
          >
            Zum Dashboard
          </Button>
        </div>

        {/* Support Info */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Haben Sie Fragen? Kontaktieren Sie uns unter support@releafz.de</p>
        </div>
      </div>
    </div>
  )
}