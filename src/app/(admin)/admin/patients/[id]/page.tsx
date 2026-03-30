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
  PENDING_STRAIN_SELECTION: 'bg-gray-100 text-gray-700 border-gray-300',
  PENDING_DOCTOR_APPROVAL: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  APPROVED: 'bg-green-100 text-green-800 border-green-300',
  DECLINED: 'bg-red-100 text-red-700 border-red-300',
  PAID: 'bg-blue-100 text-blue-800 border-blue-300',
  PROCESSING: 'bg-purple-100 text-purple-800 border-purple-300',
  READY: 'bg-teal-100 text-teal-800 border-teal-300',
  DELIVERED: 'bg-green-200 text-green-900 border-green-400',
  CANCELLED: 'bg-gray-200 text-gray-600 border-gray-400',
}

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

  if (!patient) return null

  return (
    <div className={`${dmSans.className} text-black`}>
      <div className="mb-6 flex items-center gap-4">
        <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-black">← Back</button>
        <h1 className="text-2xl font-bold">{patient.name ?? patient.email}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Email</span><span>{patient.email}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Name</span><span>{patient.name ?? '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Phone</span><span>{patient.phone ?? '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">City</span><span>{patient.address ?? '—'}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Total Requests</span><span>{patient.treatmentRequests.length}</span></div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-4">Activity</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Active requests</span>
              <span>{patient.treatmentRequests.filter(r => ['PENDING_DOCTOR_APPROVAL', 'APPROVED', 'PAID', 'PROCESSING', 'READY'].includes(r.status)).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Completed</span>
              <span>{patient.treatmentRequests.filter(r => ['DELIVERED', 'FULFILLED'].includes(r.status)).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Declined</span>
              <span>{patient.treatmentRequests.filter(r => r.status === 'DECLINED').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Last request</span>
              <span>{patient.treatmentRequests[0] ? new Date(patient.treatmentRequests[0].createdAt).toLocaleDateString() : '—'}</span>
            </div>
          </div>
        </div>
      </div>

      {patient.treatmentRequests.length > 0 ? (
        <div className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-black/10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Treatment Requests ({patient.treatmentRequests.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-black/10">
                  <th className="px-6 py-3 text-left font-medium text-gray-600">ID</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600">Doctor</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600">Pharmacy</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {patient.treatmentRequests.map((r) => (
                  <tr key={r.id} className="border-b border-black/5 last:border-b-0 hover:bg-black/[0.02]">
                    <td className="px-6 py-3 text-gray-700">{r.id}</td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[r.status] ?? 'bg-gray-100 text-gray-700 border-gray-300'}`}>
                        {r.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-700">{r.doctor?.name ?? '—'}</td>
                    <td className="px-6 py-3 text-gray-700">{r.pharmacy?.name ?? '—'}</td>
                    <td className="px-6 py-3 text-gray-700">{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-black/10 bg-white p-8 text-center text-sm text-gray-500">
          No treatment requests yet.
        </div>
      )}
    </div>
  )
}