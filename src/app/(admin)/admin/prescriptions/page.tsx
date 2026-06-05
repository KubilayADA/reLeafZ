'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DM_Sans } from 'next/font/google'
import { getAdminPrescriptions, type PrescriptionListRow } from '@/lib/adminApi'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

const STATUS_OPTIONS = [
  'All',
  'PENDING_STRAIN_SELECTION',
  'PENDING_PAYMENT',
  'PENDING_DOCTOR_APPROVAL',
  'APPROVED',
  'DECLINED',
  'PAID',
  'PREPARING',
  'READY',
  'DELIVERED',
  'CANCELLED',
] as const

const modalShadow = { boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }

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

function formatCurrency(value: number | undefined | null) {
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

function PrescriptionDetailModal({
  row,
  onClose,
}: {
  row: PrescriptionListRow
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white overflow-hidden"
        style={modalShadow}
      >
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Prescription #{row.id}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">{formatDate(row.createdAt)}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none p-1"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Status</span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusPillClasses(row.status)}`}
            >
              {(row.status ?? 'UNKNOWN').replace(/_/g, ' ')}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm gap-4">
            <span className="text-gray-400 shrink-0">Patient</span>
            {row.patientId ? (
              <Link
                href={`/admin/patients/${row.patientId}`}
                className="font-medium text-emerald-600 hover:text-emerald-700 text-right"
                onClick={(e) => e.stopPropagation()}
              >
                {row.patientName ?? 'View patient'}
              </Link>
            ) : (
              <span className="font-medium text-gray-800">{row.patientName ?? '—'}</span>
            )}
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Doctor</span>
            <span className="font-medium text-gray-800">{row.doctorName ?? '—'}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Pharmacy</span>
            <span className="font-medium text-gray-800">{row.pharmacyName ?? '—'}</span>
          </div>
          {row.totalPrice != null && (
            <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100">
              <span className="text-gray-400">Total</span>
              <span className="font-bold text-gray-900">{formatCurrency(row.totalPrice)}</span>
            </div>
          )}

          {row.pdfUrl ? (
            <a
              href={row.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-xl bg-[#10b981] px-4 py-2.5 text-sm font-semibold text-white text-center hover:bg-emerald-600 transition"
            >
              Download PDF
            </a>
          ) : (
            <button
              type="button"
              disabled
              title="PDF not yet generated"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-400 cursor-not-allowed"
            >
              Download PDF
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminPrescriptionsPage() {
  const [rows, setRows] = useState<PrescriptionListRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>('All')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedRow, setSelectedRow] = useState<PrescriptionListRow | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const res = await getAdminPrescriptions({
          page,
          limit,
          search: search.trim() || undefined,
          status: status === 'All' ? undefined : status,
        })
        if (!mounted) return
        setRows(res?.prescriptions ?? [])
        setTotalPages(Math.max(1, res?.totalPages ?? 1))
      } catch (err) {
        if (!mounted) return
        setError(err instanceof Error ? err.message : 'Failed to load treatment requests.')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [page, limit, search, status])

  return (
    <div className={dmSans.className}>
      {selectedRow && (
        <PrescriptionDetailModal row={selectedRow} onClose={() => setSelectedRow(null)} />
      )}

      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-gray-900">Prescriptions</h1>
          <p className="mt-1 text-sm text-gray-500">All treatment requests on the platform</p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setPage(1)
              setSearch(e.target.value)
            }}
            placeholder="Search requests…"
            className="w-full md:w-64 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <select
            value={status}
            onChange={(e) => {
              setPage(1)
              setStatus(e.target.value as (typeof STATUS_OPTIONS)[number])
            }}
            className="rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section
        className="rounded-2xl bg-white border border-black/[0.06] overflow-hidden"
        style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                {['ID', 'Patient', 'Doctor', 'Pharmacy', 'Status', 'Date'].map((h) => (
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
                ? Array.from({ length: 10 }).map((_, idx) => (
                    <tr key={idx} className="border-b border-gray-50">
                      {Array.from({ length: 6 }).map((__, cidx) => (
                        <td key={cidx} className="px-5 py-3.5">
                          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : rows.map((r, idx) => (
                    <tr
                      key={r.id ?? idx}
                      onClick={() => setSelectedRow(r)}
                      className="border-b border-gray-50 last:border-b-0 hover:bg-emerald-50/30 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3.5 text-xs font-mono text-gray-400">#{r.id ?? '—'}</td>
                      <td className="px-5 py-3.5 font-medium text-gray-800">
                        {r.patientName ?? '—'}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">{r.doctorName ?? '—'}</td>
                      <td className="px-5 py-3.5 text-gray-600">{r.pharmacyName ?? '—'}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusPillClasses(r.status)}`}
                        >
                          {(r.status ?? 'UNKNOWN').replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs">
                        {formatDate(r.createdAt)}
                      </td>
                    </tr>
                  ))}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="text-gray-300 text-4xl mb-3">◌</div>
                    <p className="text-sm text-gray-400">No treatment requests found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page <= 1 || loading}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ← Prev
        </button>
        <p className="text-sm text-gray-500">
          Page <span className="font-semibold text-gray-800">{page}</span> of {totalPages}
        </p>
        <button
          type="button"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page >= totalPages || loading}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Next →
        </button>
      </div>
    </div>
  )
}
