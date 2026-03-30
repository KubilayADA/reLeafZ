'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DM_Sans } from 'next/font/google'
import { getAdminPharmacy, syncCannaleoPharmacy } from '@/lib/adminApi'

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] })

type Pharmacy = {
  id: number
  name: string
  email: string
  contact: string
  zip: string
  city?: string
  deliveryType: string
  inventorySource?: string
  cannaleoSubdomain?: string
  cannaleoVendorId?: string
  _count?: { treatmentRequests: number; products: number }
  recentTreatmentRequests?: Array<{
    id: number
    status: string
    createdAt: string
    patient: { id: number; email: string; fullName: string }
  }>
}

export default function AdminPharmacyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<{ synced: number; errors: string[] } | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getAdminPharmacy(id)
        setPharmacy(data as Pharmacy)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pharmacy.')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  async function handleSync() {
    setSyncing(true)
    setSyncResult(null)
    try {
      const result = await syncCannaleoPharmacy(id)
      setSyncResult({ synced: result.synced, errors: result.errors })
    } catch (err) {
      setSyncResult({ synced: 0, errors: [err instanceof Error ? err.message : 'Sync failed'] })
    } finally {
      setSyncing(false)
    }
  }

  if (loading) return (
    <div className={`${dmSans.className} text-black`}>
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
    </div>
  )

  if (error) return (
    <div className={`${dmSans.className} text-black`}>
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
    </div>
  )

  if (!pharmacy) return null

  return (
    <div className={`${dmSans.className} text-black`}>
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-black">← Back</button>
        <h1 className="text-2xl font-bold">{pharmacy.name}</h1>
        {pharmacy.inventorySource === 'CANNALEO' && (
          <span className="rounded-full bg-blue-100 text-blue-700 border border-blue-300 px-3 py-1 text-xs font-semibold">
            Cannaleo
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Email</span><span>{pharmacy.email}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Contact</span><span>{pharmacy.contact}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">City</span><span>{pharmacy.city ?? '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">ZIP</span><span>{pharmacy.zip}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>{pharmacy.deliveryType}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Products</span><span>{pharmacy._count?.products ?? 0}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Requests</span><span>{pharmacy._count?.treatmentRequests ?? 0}</span></div>
          </div>
        </div>

        {pharmacy.inventorySource === 'CANNALEO' && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-600 mb-4">Cannaleo Sync</h2>
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-gray-500">Subdomain</span><span className="font-mono text-xs">{pharmacy.cannaleoSubdomain ?? '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Vendor ID</span><span className="font-mono text-xs">{pharmacy.cannaleoVendorId ?? '—'}</span></div>
            </div>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {syncing ? 'Syncing...' : '🔄 Sync Cannaleo Inventory'}
            </button>
            {syncResult && (
              <div className={`mt-3 rounded-lg px-4 py-3 text-sm ${syncResult.errors.length > 0 ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
                {syncResult.errors.length === 0
                  ? `✅ Synced ${syncResult.synced} products successfully`
                  : `⚠️ Synced ${syncResult.synced} products with ${syncResult.errors.length} errors`
                }
              </div>
            )}
          </div>
        )}
      </div>

      {pharmacy.recentTreatmentRequests && pharmacy.recentTreatmentRequests.length > 0 && (
        <div className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-black/10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Recent Requests</h2>
          </div>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-black/10">
                <th className="px-6 py-3 text-left font-medium text-gray-600">ID</th>
                <th className="px-6 py-3 text-left font-medium text-gray-600">Patient</th>
                <th className="px-6 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-6 py-3 text-left font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {pharmacy.recentTreatmentRequests.map((r) => (
                <tr key={r.id} className="border-b border-black/5 last:border-b-0 hover:bg-black/[0.02]">
                  <td className="px-6 py-3 text-gray-700">{r.id}</td>
                  <td className="px-6 py-3 text-gray-700">{r.patient.fullName}</td>
                  <td className="px-6 py-3 text-gray-700">{r.status}</td>
                  <td className="px-6 py-3 text-gray-700">{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}