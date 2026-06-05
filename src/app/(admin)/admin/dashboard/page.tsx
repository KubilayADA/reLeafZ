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
  fullName?: string
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

function statusPillClasses(status: string | undefined) {
  switch (status) {
    case 'PENDING_DOCTOR_APPROVAL':
    case 'PENDING_STRAIN_SELECTION':
    case 'PENDING_PAYMENT':
      return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
    case 'APPROVED':
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
    case 'DECLINED':
    case 'CANCELLED':
      return 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
    case 'DELIVERED':
      return 'bg-sky-50 text-sky-700 ring-1 ring-sky-200'
    case 'PAID':
      return 'bg-violet-50 text-violet-700 ring-1 ring-violet-200'
    case 'PROCESSING':
    case 'PREPARING':
      return 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
    case 'READY':
      return 'bg-teal-50 text-teal-700 ring-1 ring-teal-200'
    default:
      return 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
  }
}

function statusLabel(status: string | undefined) {
  return (status ?? 'UNKNOWN').replace(/_/g, ' ')
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

        const normalizedOverview: OverviewData = overviewRes

        const normalizedActivity = activityRes.slice(0, 10)

        setOverview(normalizedOverview)
        setActivity(normalizedActivity)
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

  const primaryCards = useMemo(
    () => [
      {
        label: 'Total Patients',
        value: overview?.totalPatients ?? 0,
        color: 'text-gray-900',
      },
      {
        label: 'Total Doctors',
        value: overview?.totalDoctors ?? 0,
        color: 'text-gray-900',
      },
      {
        label: 'Pharmacies',
        value: overview?.totalPharmacies ?? 0,
        color: 'text-gray-900',
      },
      {
        label: 'Total Prescriptions',
        value: overview?.totalTreatmentRequests ?? 0,
        color: 'text-gray-900',
      },
    ],
    [overview],
  )

  const secondaryCards = useMemo(
    () => [
      {
        label: 'Pending Approval',
        value: overview?.pendingApproval ?? 0,
        color: 'text-amber-600',
      },
      {
        label: "Today's Requests",
        value: overview?.todayRequests ?? 0,
        color: 'text-sky-600',
      },
      {
        label: 'Total Revenue',
        value: formatCurrency(overview?.totalRevenue),
        color: 'text-emerald-600',
      },
      {
        label: 'Active Doctors',
        value: overview?.activeDoctors ?? 0,
        color: 'text-violet-600',
      },
    ],
    [overview],
  )

  return (
    <div className={dmSans.className}>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Platform health at a glance</p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Hero pulse strip */}
      <div
        className="mb-8 rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 md:divide-x md:divide-white/[0.1]"
        style={{
          background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
          boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
        }}
      >
        {[
          {
            label: 'Total Revenue',
            value: loading ? '···' : formatCurrency(overview?.totalRevenue),
            hint: 'All-time',
            accent: '#10b981',
          },
          {
            label: "Today's Requests",
            value: loading ? '···' : String(overview?.todayRequests ?? 0),
            hint: 'Past 24 h',
            accent: '#22d3ee',
          },
          {
            label: 'Pending Approval',
            value: loading ? '···' : String(overview?.pendingApproval ?? 0),
            hint: 'Awaiting review',
            accent: '#f59e0b',
          },
        ].map((metric) => (
          <div key={metric.label} className="md:px-8 first:pl-0 last:pr-0">
            <p
              className="text-[10px] uppercase tracking-widest font-semibold mb-1"
              style={{ color: metric.accent }}
            >
              {metric.label}
            </p>
            <p className="text-3xl font-bold text-white tracking-tight">{metric.value}</p>
            <p className="mt-1 text-xs text-gray-500">{metric.hint}</p>
          </div>
        ))}
      </div>

      {/* Primary stat cards */}
      <p className="mb-3 text-[10px] uppercase tracking-widest font-semibold text-gray-400">
        Platform totals
      </p>
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-black/[0.06] p-5 animate-pulse"
                style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
              >
                <div className="h-2 w-20 bg-gray-200 rounded mb-4" />
                <div className="h-9 w-16 bg-gray-300 rounded" />
              </div>
            ))
          : primaryCards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl bg-white border border-black/[0.06] p-5 transition-all hover:-translate-y-0.5"
                style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
              >
                <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-3">
                  {card.label}
                </p>
                <p className={`text-[36px] font-bold leading-none tracking-tight ${card.color}`}>
                  {card.value}
                </p>
              </div>
            ))}
      </section>

      {/* Secondary stat cards */}
      <p className="mb-3 mt-6 text-[10px] uppercase tracking-widest font-semibold text-gray-400">
        Activity metrics
      </p>
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-black/[0.06] p-5 animate-pulse"
                style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
              >
                <div className="h-2 w-20 bg-gray-200 rounded mb-4" />
                <div className="h-9 w-16 bg-gray-300 rounded" />
              </div>
            ))
          : secondaryCards.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl bg-white border border-black/[0.06] p-5 transition-all hover:-translate-y-0.5"
                style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
              >
                <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-3">
                  {card.label}
                </p>
                <p className={`text-[36px] font-bold leading-none tracking-tight ${card.color}`}>
                  {card.value}
                </p>
              </div>
            ))}
      </section>

      {/* Recent Activity */}
      <section
        className="rounded-2xl bg-white border border-black/[0.06] overflow-hidden"
        style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800">Recent Activity</h2>
          <span className="text-[11px] text-gray-400 uppercase tracking-wide">Last 10 events</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                {['ID', 'Patient', 'Status', 'Doctor', 'Pharmacy', 'Date'].map((h) => (
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
              {loading
                ? Array.from({ length: 8 }).map((_, idx) => (
                    <tr key={idx} className="border-b border-gray-50">
                      {[12, 32, 24, 24, 24, 20].map((w, cidx) => (
                        <td key={cidx} className="px-5 py-3.5">
                          <div
                            className={`h-3 w-${w} bg-gray-200 rounded animate-pulse`}
                            style={{ width: `${w * 4}px` }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                : activity.map((item, idx) => {
                    const status = item.status ?? 'UNKNOWN'
                    return (
                      <tr
                        key={`${item.id ?? item.treatmentRequestId ?? idx}`}
                        className="border-b border-gray-50 last:border-b-0 hover:bg-emerald-50/30 transition-colors"
                      >
                        <td className="px-5 py-3.5 text-gray-500 text-xs font-mono">
                          #{item.id ?? item.treatmentRequestId ?? '—'}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-gray-800">
                          {item.fullName ??
                            item.patientName ??
                            item.patient?.fullName ??
                            item.patient?.name ??
                            '—'}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusPillClasses(status)}`}
                          >
                            {statusLabel(status)}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-gray-600">
                          {item.doctorName ?? item.doctor?.name ?? '—'}
                        </td>
                        <td className="px-5 py-3.5 text-gray-600">
                          {item.pharmacyName ?? item.pharmacy?.name ?? '—'}
                        </td>
                        <td className="px-5 py-3.5 text-gray-400 text-xs">
                          {formatDate(item.createdAt ?? item.date)}
                        </td>
                      </tr>
                    )
                  })}

              {!loading && activity.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="text-gray-300 text-4xl mb-3">◌</div>
                    <p className="text-sm text-gray-400">No recent activity</p>
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
