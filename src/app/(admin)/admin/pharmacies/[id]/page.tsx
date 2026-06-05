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
  cannaleoApiKey?: string
  supportsBotendienst?: boolean
  supportsPickup?: boolean
  supportsMailOrder?: boolean
  mailOrderFee?: number | null
  _count?: { treatmentRequests: number; products: number }
  recentTreatmentRequests?: Array<{
    id: number
    status: string
    createdAt: string
    patient: { id: number; email: string; fullName: string }
  }>
}

function statusPillClasses(status: string) {
  switch (status) {
    case 'APPROVED':
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
    case 'DECLINED':
    case 'CANCELLED':
      return 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
    case 'PENDING_DOCTOR_APPROVAL':
    case 'PENDING_STRAIN_SELECTION':
      return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
    case 'DELIVERED':
      return 'bg-sky-50 text-sky-700 ring-1 ring-sky-200'
    default:
      return 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
  }
}

const cardCls = 'rounded-2xl bg-white border border-black/[0.06] p-6'
const cardShadow = { boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }

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

  if (loading) {
    return (
      <div className={dmSans.className}>
        <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={dmSans.className}>
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    )
  }

  if (!pharmacy) return null

  const detailRows: Array<{ label: string; value: string | number | boolean | undefined | null }> =
    [
      { label: 'Email', value: pharmacy.email },
      { label: 'Contact', value: pharmacy.contact },
      { label: 'City', value: pharmacy.city ?? '—' },
      { label: 'ZIP', value: pharmacy.zip },
      { label: 'Delivery type', value: pharmacy.deliveryType },
      {
        label: 'Botendienst',
        value: pharmacy.supportsBotendienst ? 'Enabled' : 'Disabled',
      },
      { label: 'Pickup', value: pharmacy.supportsPickup ? 'Enabled' : 'Disabled' },
      {
        label: 'Mail Order (DHL)',
        value: pharmacy.supportsMailOrder
          ? `Enabled — €${(pharmacy.mailOrderFee ?? 0).toFixed(2)}`
          : 'Disabled',
      },
      { label: 'Products', value: pharmacy._count?.products ?? 0 },
      { label: 'Requests', value: pharmacy._count?.treatmentRequests ?? 0 },
    ]

  return (
    <div className={dmSans.className}>
      {/* Page header */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          ←
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-[28px] font-bold tracking-tight text-gray-900">{pharmacy.name}</h1>
          {pharmacy.inventorySource === 'CANNALEO' && (
            <span className="rounded-full bg-sky-50 text-sky-700 ring-1 ring-sky-200 px-3 py-1 text-xs font-semibold">
              Cannaleo
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Details card */}
        <div className={cardCls} style={cardShadow}>
          <h2 className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-4">
            Details
          </h2>
          <div className="space-y-2.5">
            {detailRows.map((row) => (
              <div key={row.label} className="flex justify-between items-center text-sm">
                <span className="text-gray-400">{row.label}</span>
                <span className="font-medium text-gray-800 text-right ml-4">
                  {String(row.value ?? '—')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cannaleo sync card */}
        {pharmacy.inventorySource === 'CANNALEO' && (
          <div
            className="rounded-2xl border border-sky-100 bg-sky-50/40 p-6"
            style={cardShadow}
          >
            <h2 className="text-[10px] uppercase tracking-widest font-semibold text-sky-600 mb-4">
              Cannaleo Sync
            </h2>
            <div className="space-y-2.5 mb-5">
              {[
                { label: 'Subdomain', value: pharmacy.cannaleoSubdomain ?? '—', mono: true },
                { label: 'Vendor ID', value: pharmacy.cannaleoVendorId ?? '—', mono: true },
                {
                  label: 'API Key',
                  value: pharmacy.cannaleoApiKey ? '•••••• Set' : 'Not set',
                  mono: false,
                },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{row.label}</span>
                  <span
                    className={`text-gray-800 ml-4 ${row.mono ? 'font-mono text-xs' : 'font-medium'}`}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="w-full rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50 transition"
            >
              {syncing ? 'Syncing…' : 'Sync Cannaleo Inventory'}
            </button>
            {syncResult && (
              <div
                className={`mt-3 rounded-xl px-4 py-3 text-sm ${
                  syncResult.errors.length > 0
                    ? 'border border-red-200 bg-red-50 text-red-700'
                    : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                }`}
              >
                {syncResult.errors.length === 0
                  ? `Synced ${syncResult.synced} products successfully`
                  : `Synced ${syncResult.synced} products with ${syncResult.errors.length} errors`}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recent requests */}
      {pharmacy.recentTreatmentRequests && pharmacy.recentTreatmentRequests.length > 0 && (
        <div
          className="rounded-2xl bg-white border border-black/[0.06] overflow-hidden"
          style={cardShadow}
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">
              Recent Requests
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  {['ID', 'Patient', 'Status', 'Date'].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-gray-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pharmacy.recentTreatmentRequests.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-50 last:border-b-0 hover:bg-emerald-50/30 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-xs font-mono text-gray-400">#{r.id}</td>
                    <td className="px-5 py-3.5 font-medium text-gray-800">
                      {r.patient.fullName}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusPillClasses(r.status)}`}
                      >
                        {r.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {new Date(r.createdAt).toLocaleDateString('de-DE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
