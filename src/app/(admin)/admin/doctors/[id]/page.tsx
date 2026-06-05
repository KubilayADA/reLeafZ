'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DM_Sans } from 'next/font/google'
import { getAdminDoctor } from '@/lib/adminApi'

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] })

type TreatmentRequest = {
  id: number
  status: string
  createdAt: string
  patient: { id: number; email: string; fullName: string }
  pharmacy: { id: number; name: string } | null
}

type Doctor = {
  id: number
  name: string
  email: string
  specialty: string
  licenseNumber?: string
  isActive: boolean
  createdAt: string
  treatmentRequests: TreatmentRequest[]
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
    case 'PAID':
      return 'bg-violet-50 text-violet-700 ring-1 ring-violet-200'
    default:
      return 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
  }
}

const cardCls = 'rounded-2xl bg-white border border-black/[0.06] p-6'
const cardShadow = { boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }

export default function AdminDoctorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getAdminDoctor(id)
        setDoctor(data as Doctor)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load doctor.')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  async function handleToggleActive() {
    if (!doctor) return
    setToggling(true)
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''
      const res = await fetch(`${API_BASE}/api/admin/doctors/${id}/active`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isActive: !doctor.isActive }),
      })
      if (!res.ok) throw new Error('Failed to update status')
      setDoctor((d) => (d ? { ...d, isActive: !d.isActive } : d))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update.')
    } finally {
      setToggling(false)
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

  if (!doctor) return null

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
          <h1 className="text-[28px] font-bold tracking-tight text-gray-900">{doctor.name}</h1>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              doctor.isActive
                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                : 'bg-gray-100 text-gray-500 ring-1 ring-gray-200'
            }`}
          >
            {doctor.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Details */}
        <div className={cardCls} style={cardShadow}>
          <h2 className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-4">
            Details
          </h2>
          <div className="space-y-2.5">
            {[
              { label: 'Email', value: doctor.email },
              { label: 'Specialty', value: doctor.specialty ?? '—' },
              { label: 'License No', value: doctor.licenseNumber ?? '—' },
              { label: 'Joined', value: new Date(doctor.createdAt).toLocaleDateString('de-DE') },
              { label: 'Total Requests', value: doctor.treatmentRequests.length },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center text-sm">
                <span className="text-gray-400">{row.label}</span>
                <span className="font-medium text-gray-800">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Account status */}
        <div className={cardCls} style={cardShadow}>
          <h2 className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-4">
            Account Status
          </h2>
          <p className="text-sm text-gray-500 mb-5 leading-relaxed">
            {doctor.isActive
              ? 'This doctor is active and can receive treatment requests.'
              : 'This doctor is inactive and will not receive new treatment requests.'}
          </p>
          <button
            onClick={handleToggleActive}
            disabled={toggling}
            className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50 ${
              doctor.isActive
                ? 'bg-rose-500 hover:bg-rose-600'
                : 'bg-[#10b981] hover:bg-emerald-600'
            }`}
          >
            {toggling
              ? 'Updating…'
              : doctor.isActive
                ? 'Deactivate Doctor'
                : 'Activate Doctor'}
          </button>
        </div>
      </div>

      {/* Treatment requests */}
      {doctor.treatmentRequests.length > 0 ? (
        <div
          className="rounded-2xl bg-white border border-black/[0.06] overflow-hidden"
          style={cardShadow}
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">
              Treatment Requests ({doctor.treatmentRequests.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  {['ID', 'Patient', 'Pharmacy', 'Status', 'Date'].map((h) => (
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
                {doctor.treatmentRequests.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-50 last:border-b-0 hover:bg-emerald-50/30 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-xs font-mono text-gray-400">#{r.id}</td>
                    <td className="px-5 py-3.5 font-medium text-gray-800">
                      {r.patient.fullName}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{r.pharmacy?.name ?? '—'}</td>
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
