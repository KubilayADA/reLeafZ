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
      setDoctor(d => d ? { ...d, isActive: !d.isActive } : d)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update.')
    } finally {
      setToggling(false)
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

  if (!doctor) return null

  return (
    <div className={`${dmSans.className} text-black`}>
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-black">← Back</button>
        <h1 className="text-2xl font-bold">{doctor.name}</h1>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${
          doctor.isActive
            ? 'bg-green-100 text-green-800 border-green-300'
            : 'bg-gray-100 text-gray-700 border-gray-300'
        }`}>
          {doctor.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Email</span><span>{doctor.email}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Specialty</span><span>{doctor.specialty ?? '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">License No</span><span>{doctor.licenseNumber ?? '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Joined</span><span>{new Date(doctor.createdAt).toLocaleDateString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Total Requests</span><span>{doctor.treatmentRequests.length}</span></div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">Account Status</h2>
          <p className="text-sm text-gray-600 mb-4">
            {doctor.isActive
              ? 'This doctor is active and can receive treatment requests.'
              : 'This doctor is inactive and will not receive new treatment requests.'}
          </p>
          <button
            onClick={handleToggleActive}
            disabled={toggling}
            className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50 ${
              doctor.isActive
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {toggling ? 'Updating...' : doctor.isActive ? 'Deactivate Doctor' : 'Activate Doctor'}
          </button>
        </div>
      </div>

      {doctor.treatmentRequests.length > 0 && (
        <div className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-black/10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Treatment Requests ({doctor.treatmentRequests.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-black/10">
                  <th className="px-6 py-3 text-left font-medium text-gray-600">ID</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600">Patient</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600">Pharmacy</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {doctor.treatmentRequests.map((r) => (
                  <tr key={r.id} className="border-b border-black/5 last:border-b-0 hover:bg-black/[0.02]">
                    <td className="px-6 py-3 text-gray-700">{r.id}</td>
                    <td className="px-6 py-3 text-gray-700">{r.patient.fullName}</td>
                    <td className="px-6 py-3 text-gray-700">{r.pharmacy?.name ?? '—'}</td>
                    <td className="px-6 py-3 text-gray-700">{r.status}</td>
                    <td className="px-6 py-3 text-gray-700">{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {doctor.treatmentRequests.length === 0 && (
        <div className="rounded-2xl border border-black/10 bg-white p-8 text-center text-sm text-gray-500">
          No treatment requests yet.
        </div>
      )}
    </div>
  )
}