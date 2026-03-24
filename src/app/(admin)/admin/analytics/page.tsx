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
    <div className={`${dmSans.className} text-black`}>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">Overview metrics and request status breakdown</p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="rounded-2xl border border-black/10 bg-white p-4 md:p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Overview snapshot</h2>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
              ))}
            </div>
          ) : overviewEntries.length === 0 ? (
            <p className="text-sm text-gray-500">No overview data.</p>
          ) : (
            <dl className="space-y-2 text-sm">
              {overviewEntries.map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 border-b border-black/5 pb-2 last:border-0">
                  <dt className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                  <dd className="font-medium text-gray-900">{String(value)}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <div className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-black/10">
            <h2 className="text-lg font-semibold">Requests by status</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-black/10">
                  <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Status</th>
                  <th className="px-4 md:px-6 py-3 text-right font-medium text-gray-600">Count</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array.from({ length: 6 }).map((_, idx) => (
                      <tr key={idx} className="border-b border-black/5">
                        <td className="px-4 md:px-6 py-3">
                          <div className="h-3 w-40 bg-gray-200 rounded animate-pulse" />
                        </td>
                        <td className="px-4 md:px-6 py-3 text-right">
                          <div className="h-3 w-8 bg-gray-200 rounded animate-pulse ml-auto" />
                        </td>
                      </tr>
                    ))
                  : statusRows.map((row, idx) => (
                      <tr key={`${row.status ?? idx}`} className="border-b border-black/5 last:border-b-0">
                        <td className="px-4 md:px-6 py-3 text-gray-800">{row.status ?? '—'}</td>
                        <td className="px-4 md:px-6 py-3 text-right text-gray-700 tabular-nums">
                          {row.count ?? '—'}
                        </td>
                      </tr>
                    ))}
                {!loading && statusRows.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-4 md:px-6 py-10 text-center text-sm text-gray-500">
                      No status breakdown available.
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
