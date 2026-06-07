'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { DM_Sans } from 'next/font/google'
import {
  AdminApiError,
  getDeletionRequests,
  resolveDeletionRequest,
  type DeletionRequest,
  type DeletionRequestStatus,
} from '@/lib/adminApi'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

const cardShadow = { boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }

type StatusFilter = DeletionRequestStatus | 'ALL'

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'PENDING', label: 'Offen' },
  { key: 'RESOLVED', label: 'Erledigt' },
  { key: 'REJECTED', label: 'Abgelehnt' },
  { key: 'ALL', label: 'Alle' },
]

const STATUS_LABELS: Record<DeletionRequestStatus, string> = {
  PENDING: 'Offen',
  RESOLVED: 'Erledigt',
  REJECTED: 'Abgelehnt',
}

const STATUS_COLORS: Record<DeletionRequestStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  RESOLVED: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  REJECTED: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
}

const EMPTY_MESSAGES: Record<StatusFilter, string> = {
  PENDING: 'Keine offenen Löschanfragen',
  RESOLVED: 'Keine erledigten Löschanfragen',
  REJECTED: 'Keine abgelehnten Löschanfragen',
  ALL: 'Keine Löschanfragen vorhanden',
}

function formatDate(dateLike: string | null | undefined) {
  if (!dateLike) return '—'
  const date = new Date(dateLike)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function truncateMessage(message: string | null, max = 80) {
  if (!message) return '—'
  if (message.length <= max) return message
  return `${message.slice(0, max)}…`
}

export default function AdminDeletionRequestsPage() {
  const [requests, setRequests] = useState<DeletionRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('PENDING')
  const [actionRequestId, setActionRequestId] = useState<number | null>(null)

  const loadRequests = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getDeletionRequests(
        statusFilter === 'ALL' ? undefined : { status: statusFilter },
      )
      setRequests(data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Löschanfragen konnten nicht geladen werden.')
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    void loadRequests()
  }, [loadRequests])

  async function handleResolve(id: number, status: 'RESOLVED' | 'REJECTED') {
    if (status === 'REJECTED') {
      const confirmed = window.confirm(
        'Möchten Sie diese Löschanfrage wirklich ablehnen?',
      )
      if (!confirmed) return
    }

    setActionRequestId(id)
    setError('')
    try {
      const updated = await resolveDeletionRequest(id, { status })
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)))
      await loadRequests()
    } catch (err) {
      const message =
        err instanceof AdminApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Aktion fehlgeschlagen.'
      setError(message)
    } finally {
      setActionRequestId(null)
    }
  }

  return (
    <div className={dmSans.className}>
      <div className="mb-8">
        <h1 className="text-[28px] font-bold tracking-tight text-gray-900">
          Löschanfragen (Art. 17 DSGVO)
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Eingegangene Anfragen zur Löschung personenbezogener Daten. Bearbeitungsfrist: 30 Tage
          (Art. 12 DSGVO).
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => {
          const active = statusFilter === filter.key
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => setStatusFilter(filter.key)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {filter.label}
            </button>
          )
        })}
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section
        className="rounded-2xl bg-white border border-black/[0.06] overflow-hidden"
        style={cardShadow}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                {['E-Mail', 'Nachricht', 'Eingegangen', 'Status', 'Aktionen'].map((h) => (
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
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="border-b border-gray-50">
                      {Array.from({ length: 5 }).map((__, cidx) => (
                        <td key={cidx} className="px-5 py-3.5">
                          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : requests.map((req) => {
                    const isPending = req.status === 'PENDING'
                    const isActing = actionRequestId === req.id

                    return (
                      <tr key={req.id} className="border-b border-gray-50 last:border-b-0">
                        <td className="px-5 py-3.5 font-medium text-gray-800">{req.email}</td>
                        <td
                          className="px-5 py-3.5 text-gray-600 max-w-xs"
                          title={req.message ?? undefined}
                        >
                          {truncateMessage(req.message)}
                        </td>
                        <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">
                          {formatDate(req.createdAt)}
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_COLORS[req.status]}`}
                          >
                            {STATUS_LABELS[req.status]}
                          </span>
                          {!isPending && req.resolvedAt && (
                            <p className="mt-1 text-[11px] text-gray-400">
                              {formatDate(req.resolvedAt)}
                              {req.resolvedByAdminId != null &&
                                ` · Admin #${req.resolvedByAdminId}`}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          {isPending ? (
                            <div className="flex flex-wrap gap-2">
                              <Link
                                href={`/admin/patients?search=${encodeURIComponent(req.email)}`}
                                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
                              >
                                Patient finden
                              </Link>
                              <button
                                type="button"
                                disabled={isActing}
                                onClick={() => void handleResolve(req.id, 'RESOLVED')}
                                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition"
                              >
                                {isActing ? '…' : 'Als erledigt markieren'}
                              </button>
                              <button
                                type="button"
                                disabled={isActing}
                                onClick={() => void handleResolve(req.id, 'REJECTED')}
                                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100 disabled:opacity-50 transition"
                              >
                                Ablehnen
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
              {!loading && requests.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="text-gray-300 text-4xl mb-3">◌</div>
                    <p className="text-sm text-gray-400">{EMPTY_MESSAGES[statusFilter]}</p>
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
