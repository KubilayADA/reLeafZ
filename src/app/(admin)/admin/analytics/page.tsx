'use client'

import { useEffect, useMemo, useState } from 'react'
import { DM_Sans } from 'next/font/google'
import { getAnalyticsOverview, getRequestsByStatus } from '@/lib/adminApi'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

type StatusRow = { status?: string; count?: number }

function normalizeStatusRows(raw: unknown): StatusRow[] {
  if (!raw || typeof raw !== 'object') return []
  const obj = raw as Record<string, unknown>
  const inner = obj.data ?? obj.rows ?? obj.byStatus ?? obj
  if (Array.isArray(inner)) {
    return inner as StatusRow[]
  }
  if (inner && typeof inner === 'object' && !Array.isArray(inner)) {
    return Object.entries(inner as Record<string, number>).map(([status, count]) => ({
      status,
      count: typeof count === 'number' ? count : Number(count),
    }))
  }
  return []
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
    case 'PREPARING':
      return 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
    case 'READY':
      return 'bg-teal-50 text-teal-700 ring-1 ring-teal-200'
    default:
      return 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
  }
}

const cardShadow = { boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }

export default function AdminAnalyticsPage() {
  const [overview, setOverview] = useState<Record<string, unknown> | null>(null)
  const [statusRows, setStatusRows] = useState<StatusRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const [overviewRes, byStatusRes] = await Promise.all([
          getAnalyticsOverview(),
          getRequestsByStatus(),
        ])
        if (!mounted) return
        const res = overviewRes as Record<string, unknown>
        const normalized = (res?.data ?? res ?? {}) as Record<string, unknown>
        setOverview(normalized)
        const statusRes = byStatusRes as Record<string, unknown>
        setStatusRows(normalizeStatusRows(statusRes?.data ?? statusRes))
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

  const overviewEntries = useMemo(() => {
    if (!overview) return []
    return Object.entries(overview).filter(
      ([, v]) => typeof v === 'number' || typeof v === 'string',
    )
  }, [overview])

  return (
    <div className={dmSans.className}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-bold tracking-tight text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Platform metrics and treatment request status breakdown
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Overview snapshot */}
        <div
          className="rounded-2xl bg-white border border-black/[0.06] p-6"
          style={cardShadow}
        >
          <h2 className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-5">
            Overview Snapshot
          </h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : overviewEntries.length === 0 ? (
            <div className="py-10 text-center">
              <div className="text-gray-300 text-3xl mb-2">◌</div>
              <p className="text-sm text-gray-400">No overview data available</p>
            </div>
          ) : (
            <dl className="space-y-0">
              {overviewEntries.map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between items-center py-2.5 border-b border-gray-50 last:border-0"
                >
                  <dt className="text-sm text-gray-500 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </dt>
                  <dd className="font-semibold text-gray-900 tabular-nums">{String(value)}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* Requests by status */}
        <div
          className="rounded-2xl bg-white border border-black/[0.06] overflow-hidden"
          style={cardShadow}
        >
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">
              Requests by Status
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="px-5 py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-gray-400">
                    Status
                  </th>
                  <th className="px-5 py-3 text-right text-[11px] uppercase tracking-wider font-semibold text-gray-400">
                    Count
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 6 }).map((_, idx) => (
                      <tr key={idx} className="border-b border-gray-50">
                        <td className="px-5 py-3.5">
                          <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="h-3 w-8 bg-gray-200 rounded animate-pulse ml-auto" />
                        </td>
                      </tr>
                    ))
                  : statusRows.map((row, idx) => (
                      <tr
                        key={`${row.status ?? idx}`}
                        className="border-b border-gray-50 last:border-0 hover:bg-emerald-50/20 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusPillClasses(row.status)}`}
                          >
                            {(row.status ?? '—').replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-semibold text-gray-800 tabular-nums">
                          {row.count ?? '—'}
                        </td>
                      </tr>
                    ))}
                {!loading && statusRows.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-5 py-12 text-center">
                      <div className="text-gray-300 text-3xl mb-2">◌</div>
                      <p className="text-sm text-gray-400">No status breakdown available</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
