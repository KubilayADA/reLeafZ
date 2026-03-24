'use client'

import { useEffect, useMemo, useState } from 'react'
import { DM_Sans } from 'next/font/google'
import { getAnalyticsOverview, getRecentActivity } from '@/lib/adminApi'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

type OverviewData = {
  totalPatients?: number
  totalDoctors?: number
  totalPharmacies?: number
  totalTreatmentRequests?: number
  pendingApproval?: number
  todayRequests?: number
  totalRevenue?: number
  activeDoctors?: number
}

type ActivityItem = {
  id?: number | string
  treatmentRequestId?: number | string
  patientName?: string
  patient?: { name?: string; fullName?: string }
  status?: string
  doctorName?: string
  doctor?: { name?: string }
  pharmacyName?: string
  pharmacy?: { name?: string }
  createdAt?: string
  date?: string
}

function formatCurrency(value: number | undefined) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value ?? 0)
}

function formatDate(dateLike: string | undefined) {
  if (!dateLike) return '—'
  const date = new Date(dateLike)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

function statusClasses(status: string | undefined) {
  switch (status) {
    case 'PENDING_DOCTOR_APPROVAL':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'APPROVED':
      return 'bg-green-100 text-green-800 border-green-300'
    case 'DECLINED':
      return 'bg-red-100 text-red-800 border-red-300'
    case 'DELIVERED':
      return 'bg-blue-100 text-blue-800 border-blue-300'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300'
  }
}

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<OverviewData | null>(null)
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const [overviewRes, activityRes] = await Promise.all([
          getAnalyticsOverview(),
          getRecentActivity(),
        ])

        if (!mounted) return

        const overviewCast = overviewRes as Record<string, unknown>
        const normalizedOverview: OverviewData =
          (overviewCast?.data ?? overviewCast ?? {}) as OverviewData

        const activityCast = activityRes as Record<string, unknown>
        const rawActivity: unknown =
          activityCast?.activity ??
          activityCast?.data ??
          activityCast?.activities ??
          activityCast?.requests ??
          activityCast ??
          []

        const normalizedActivity = Array.isArray(rawActivity)
          ? (rawActivity as ActivityItem[])
          : []

        setOverview(normalizedOverview)
        setActivity(normalizedActivity.slice(0, 10))
      } catch (err) {
        if (!mounted) return
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data.')
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  const cards = useMemo(
    () => [
      { label: 'Total Patients', value: overview?.totalPatients ?? 0 },
      { label: 'Total Doctors', value: overview?.totalDoctors ?? 0 },
      { label: 'Total Pharmacies', value: overview?.totalPharmacies ?? 0 },
      { label: 'Total Prescriptions', value: overview?.totalTreatmentRequests ?? 0 },
      { label: 'Pending Approval', value: overview?.pendingApproval ?? 0 },
      { label: "Today's Requests", value: overview?.todayRequests ?? 0 },
      { label: 'Total Revenue', value: formatCurrency(overview?.totalRevenue) },
      { label: 'Active Doctors', value: overview?.activeDoctors ?? 0 },
    ],
    [overview],
  )

  return (
    <div className={`${dmSans.className} text-black`}>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Platform overview</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {loading
          ? Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-black/10 bg-white p-4 animate-pulse"
              >
                <div className="h-3 w-28 bg-gray-200 rounded mb-3" />
                <div className="h-8 w-24 bg-gray-300 rounded" />
              </div>
            ))
          : cards.map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-black/10 bg-white p-4 shadow-sm"
              >
                <p className="text-xs font-medium text-gray-500">{card.label}</p>
                <p className="mt-2 text-2xl font-semibold text-black">{card.value}</p>
                <div className="mt-3 h-1.5 w-14 rounded-full bg-green-600" />
              </div>
            ))}
      </section>

      <section className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
        <div className="px-4 md:px-6 py-4 border-b border-black/10">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-black/10">
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">ID</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Patient Name</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Doctor</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Pharmacy</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 10 }).map((_, idx) => (
                    <tr key={idx} className="border-b border-black/5">
                      <td className="px-4 md:px-6 py-3">
                        <div className="h-3 w-12 bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td className="px-4 md:px-6 py-3">
                        <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td className="px-4 md:px-6 py-3">
                        <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse" />
                      </td>
                      <td className="px-4 md:px-6 py-3">
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td className="px-4 md:px-6 py-3">
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                      </td>
                      <td className="px-4 md:px-6 py-3">
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                : activity.map((item, idx) => {
                    const status = item.status ?? 'UNKNOWN'
                    return (
                      <tr key={`${item.id ?? item.treatmentRequestId ?? idx}`} className="border-b border-black/5 last:border-b-0">
                        <td className="px-4 md:px-6 py-3 text-gray-700">
                          {item.id ?? item.treatmentRequestId ?? '—'}
                        </td>
                        <td className="px-4 md:px-6 py-3 text-gray-800">
                          {item.patientName ?? item.patient?.name ?? item.patient?.fullName ?? '—'}
                        </td>
                        <td className="px-4 md:px-6 py-3">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses(
                              status,
                            )}`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-3 text-gray-700">
                          {item.doctorName ?? item.doctor?.name ?? '—'}
                        </td>
                        <td className="px-4 md:px-6 py-3 text-gray-700">
                          {item.pharmacyName ?? item.pharmacy?.name ?? '—'}
                        </td>
                        <td className="px-4 md:px-6 py-3 text-gray-600">
                          {formatDate(item.createdAt ?? item.date)}
                        </td>
                      </tr>
                    )
                  })}

              {!loading && activity.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 md:px-6 py-10 text-center text-sm text-gray-500"
                  >
                    No recent activity found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
