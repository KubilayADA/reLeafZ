'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DM_Sans } from 'next/font/google'
import { getAdminPatient } from '@/lib/adminApi'

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] })

type TreatmentRequest = {
  id: number
  status: string
  createdAt: string
  doctor: { name: string | null }
  pharmacy: { name: string | null }
}

type Patient = {
  id: number
  email: string
  name: string | null
  phone: string | null
  address: string | null
  treatmentRequests: TreatmentRequest[]
}

const STATUS_COLORS: Record<string, string> = {
  PENDING_STRAIN_SELECTION: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
  PENDING_DOCTOR_APPROVAL: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  PENDING_PAYMENT: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  APPROVED: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  DECLINED: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  PAID: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  PROCESSING: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
  READY: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
  DELIVERED: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  CANCELLED: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200',
}

const cardCls = 'rounded-2xl bg-white border border-black/[0.06] p-6'
const cardShadow = { boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }

export default function AdminPatientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getAdminPatient(id)
        setPatient(data as Patient)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load patient.')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

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

  if (!patient) return null

  const activeCount = patient.treatmentRequests.filter((r) =>
    ['PENDING_DOCTOR_APPROVAL', 'APPROVED', 'PAID', 'PROCESSING', 'READY'].includes(r.status),
  ).length
  const completedCount = patient.treatmentRequests.filter((r) =>
    ['DELIVERED', 'FULFILLED'].includes(r.status),
  ).length
  const declinedCount = patient.treatmentRequests.filter((r) => r.status === 'DECLINED').length

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
        <h1 className="text-[28px] font-bold tracking-tight text-gray-900">
          {patient.name ?? patient.email}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Details */}
        <div className={cardCls} style={cardShadow}>
          <h2 className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-4">
            Patient Details
          </h2>
          <div className="space-y-2.5">
            {[
              { label: 'Email', value: patient.email },
              { label: 'Name', value: patient.name ?? '—' },
              { label: 'Phone', value: patient.phone ?? '—' },
              { label: 'City / Address', value: patient.address ?? '—' },
              { label: 'Total Requests', value: patient.treatmentRequests.length },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center text-sm">
                <span className="text-gray-400">{row.label}</span>
                <span className="font-medium text-gray-800">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity summary */}
        <div className={cardCls} style={cardShadow}>
          <h2 className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-4">
            Activity Summary
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Active', value: activeCount, color: 'text-emerald-600' },
              { label: 'Completed', value: completedCount, color: 'text-sky-600' },
              { label: 'Declined', value: declinedCount, color: 'text-rose-500' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className={`text-3xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
                <p className="mt-1 text-[10px] uppercase tracking-widest font-semibold text-gray-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          {patient.treatmentRequests[0] && (
            <p className="mt-5 text-xs text-gray-400">
              Last request:{' '}
              {new Date(patient.treatmentRequests[0].createdAt).toLocaleDateString('de-DE')}
            </p>
          )}
        </div>
      </div>

      {/* Treatment requests table */}
      {patient.treatmentRequests.length > 0 ? (
        <div
          className="rounded-2xl bg-white border border-black/[0.06] overflow-hidden"
          style={cardShadow}
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">
              Treatment Requests ({patient.treatmentRequests.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  {['ID', 'Status', 'Doctor', 'Pharmacy', 'Date'].map((h) => (
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
                {patient.treatmentRequests.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-50 last:border-b-0 hover:bg-emerald-50/30 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-xs font-mono text-gray-400">#{r.id}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          STATUS_COLORS[r.status] ?? 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
                        }`}
                      >
                        {r.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{r.doctor?.name ?? '—'}</td>
                    <td className="px-5 py-3.5 text-gray-600">{r.pharmacy?.name ?? '—'}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {new Date(r.createdAt).toLocaleDateString('de-DE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div
          className="rounded-2xl bg-white border border-black/[0.06] px-6 py-16 text-center"
          style={cardShadow}
        >
          <div className="text-gray-300 text-4xl mb-3">◌</div>
          <p className="text-sm text-gray-400">No treatment requests yet</p>
        </div>
      )}
    </div>
  )
}
