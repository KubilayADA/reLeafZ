'use client'

import { useEffect, useMemo, useState } from 'react'
import { DM_Sans } from 'next/font/google'
import {
  Area,
  Bar,
  BarChart,
  Cell,
  ComposedChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  getAnalyticsOverview,
  getRecentActivity,
  getRequestsByStatus,
  type RecentActivityItem,
} from '@/lib/adminApi'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

const cardShadow = { boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }

const STATUS_COLORS: Record<string, string> = {
  PENDING_DOCTOR_APPROVAL: '#f59e0b',
  APPROVED: '#10b981',
  DECLINED: '#f43f5e',
  DELIVERED: '#0ea5e9',
  PAID: '#8b5cf6',
}

const DEFAULT_CHART_COLOR = '#9ca3af'

function statusChartColor(status: string) {
  return STATUS_COLORS[status] ?? DEFAULT_CHART_COLOR
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function getDayKey(dateLike: string) {
  const d = new Date(dateLike)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString().slice(0, 10)
}

function buildLast7Days() {
  const days: Array<{ key: string; label: string }> = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push({
      key: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
    })
  }
  return days
}

function getActivityAmount(item: RecentActivityItem) {
  return item.amount ?? item.total ?? item.paymentAmount ?? 0
}

export default function AdminAnalyticsPage() {
  const [overview, setOverview] = useState<Record<string, number>>({})
  const [statusRows, setStatusRows] = useState<Array<{ status: string; count: number }>>([])
  const [activity, setActivity] = useState<RecentActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const [overviewRes, byStatusRes, activityRes] = await Promise.all([
          getAnalyticsOverview(),
          getRequestsByStatus(),
          getRecentActivity(),
        ])
        if (!mounted) return
        setOverview({
          totalPatients: overviewRes.totalPatients ?? 0,
          totalDoctors: overviewRes.totalDoctors ?? 0,
          totalPharmacies: overviewRes.totalPharmacies ?? 0,
          totalPrescriptions:
            overviewRes.totalPrescriptions ?? overviewRes.totalTreatmentRequests ?? 0,
        })
        setStatusRows(byStatusRes)
        setActivity(activityRes)
      } catch (err) {
        if (!mounted) return
        setError(err instanceof Error ? err.message : 'Failed to load analytics.')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const kpiCards = useMemo(
    () => [
      {
        label: 'Total Patients',
        value: overview.totalPatients ?? 0,
        stripe: 'bg-emerald-500',
        text: 'text-emerald-600',
      },
      {
        label: 'Total Doctors',
        value: overview.totalDoctors ?? 0,
        stripe: 'bg-sky-500',
        text: 'text-sky-600',
      },
      {
        label: 'Total Pharmacies',
        value: overview.totalPharmacies ?? 0,
        stripe: 'bg-violet-500',
        text: 'text-violet-600',
      },
      {
        label: 'Total Prescriptions',
        value: overview.totalPrescriptions ?? 0,
        stripe: 'bg-amber-500',
        text: 'text-amber-600',
      },
    ],
    [overview],
  )

  const pieData = useMemo(
    () =>
      statusRows
        .filter((r) => (r.count ?? 0) > 0)
        .map((r) => ({
          name: (r.status ?? 'UNKNOWN').replace(/_/g, ' '),
          value: r.count ?? 0,
          status: r.status ?? 'UNKNOWN',
        })),
    [statusRows],
  )

  const weeklyBarData = useMemo(() => {
    const days = buildLast7Days()
    const counts = new Map<string, number>()
    for (const day of days) counts.set(day.key, 0)

    for (const item of activity) {
      const key = getDayKey(item.createdAt ?? item.date ?? '')
      if (key && counts.has(key)) {
        counts.set(key, (counts.get(key) ?? 0) + 1)
      }
    }

    return days.map((d) => ({
      label: d.label,
      count: counts.get(d.key) ?? 0,
    }))
  }, [activity])

  const hasEnoughBarData = activity.length >= 30

  const revenueLineData = useMemo(() => {
    const days = buildLast7Days()
    const totals = new Map<string, number>()
    for (const day of days) totals.set(day.key, 0)

    for (const item of activity) {
      const key = getDayKey(item.createdAt ?? item.date ?? '')
      const amount = getActivityAmount(item)
      if (key && totals.has(key) && amount > 0) {
        totals.set(key, (totals.get(key) ?? 0) + amount)
      }
    }

    return days.map((d) => ({
      label: d.label,
      revenue: totals.get(d.key) ?? 0,
    }))
  }, [activity])

  return (
    <div className={dmSans.className}>
      <div className="mb-8">
        <h1 className="text-[28px] font-bold tracking-tight text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Platform metrics, request breakdown, and revenue trends
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Row 1 — KPI cards */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-white border border-black/[0.06] p-5 animate-pulse flex"
                style={cardShadow}
              >
                <div className="w-1 bg-gray-200 rounded-full mr-4" />
                <div className="flex-1">
                  <div className="h-2 w-20 bg-gray-200 rounded mb-4" />
                  <div className="h-9 w-16 bg-gray-300 rounded" />
                </div>
              </div>
            ))
          : kpiCards.map((card) => (
              <div
                key={card.label}
                className="rounded-xl bg-white border border-black/[0.06] p-5 flex transition-all hover:-translate-y-0.5"
                style={cardShadow}
              >
                <div className={`w-1 rounded-full ${card.stripe} mr-4 self-stretch`} />
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-3">
                    {card.label}
                  </p>
                  <p className={`text-[36px] font-bold leading-none tracking-tight ${card.text}`}>
                    {card.value}
                  </p>
                </div>
              </div>
            ))}
      </section>

      {/* Row 2 — Pie + Bar charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div
          className="rounded-xl bg-white border border-black/[0.06] p-6"
          style={cardShadow}
        >
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Requests by Status</h2>
          {loading ? (
            <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
          ) : pieData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-sm text-gray-400">
              No status data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={50}
                  paddingAngle={2}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.status} fill={statusChartColor(entry.status)} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [value, 'Count']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #f3f4f6' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div
          className="rounded-xl bg-white border border-black/[0.06] p-6"
          style={cardShadow}
        >
          <h2 className="text-sm font-semibold text-gray-800 mb-4">Requests — Last 7 Days</h2>
          {loading ? (
            <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
          ) : !hasEnoughBarData ? (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <div className="text-gray-300 text-3xl mb-2">◌</div>
              <p className="text-sm text-gray-400">Not enough data yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Need 30+ activity records ({activity.length} available)
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyBarData}>
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  axisLine={false}
                />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #f3f4f6' }} />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* Row 3 — Revenue line chart */}
      <section
        className="rounded-xl bg-white border border-black/[0.06] p-6"
        style={cardShadow}
      >
        <h2 className="text-sm font-semibold text-gray-800 mb-4">Revenue Trend — Last 7 Days</h2>
        {loading ? (
          <div className="h-72 bg-gray-100 rounded-xl animate-pulse" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={revenueLineData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} />
              <YAxis
                tick={{ fontSize: 12, fill: '#9ca3af' }}
                axisLine={false}
                tickFormatter={(v) => formatCurrency(Number(v))}
              />
              <Tooltip
                formatter={(value) => [formatCurrency(Number(value)), 'Revenue']}
                contentStyle={{ borderRadius: 12, border: '1px solid #f3f4f6' }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                dot={{ fill: '#10b981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </section>
    </div>
  )
}
