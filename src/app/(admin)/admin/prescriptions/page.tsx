'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DM_Sans } from 'next/font/google'
import { getAdminPrescriptions } from '@/lib/adminApi'

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

type Prescription = {
  id?: number
  patientName?: string
  email?: string
  patient?: { name?: string; fullName?: string; email?: string }
  status?: string
  doctorName?: string
  doctor?: { name?: string }
  pharmacyName?: string
  pharmacy?: { name?: string }
  totalPrice?: number
  createdAt?: string
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

export default function AdminPrescriptionsPage() {
  const [rows, setRows] = useState<Prescription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number]>('All')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

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
        setRows((res?.prescriptions ?? []) as Prescription[])
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
      {/* Header */}
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
                {['ID', 'Patient', 'Email', 'Status', 'Doctor', 'Pharmacy', 'Price', 'Date'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[11px] uppercase tracking-wider font-semibold text-gray-400"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 10 }).map((_, idx) => (
                    <tr key={idx} className="border-b border-gray-50">
                      {Array.from({ length: 8 }).map((__, cidx) => (
                        <td key={cidx} className="px-5 py-3.5">
                          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : rows.map((r, idx) => (
                    <tr
                      key={r.id ?? idx}
                      className="border-b border-gray-50 last:border-b-0 hover:bg-emerald-50/30 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-xs font-mono text-gray-400">
                        <Link
                          href={`/admin/prescriptions/${r.id}`}
                          className="hover:text-emerald-600 transition-colors"
                        >
                          #{r.id ?? '—'}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-gray-800">
                        <Link
                          href={`/admin/prescriptions/${r.id}`}
                          className="hover:text-emerald-600 transition-colors"
                        >
                          {r.patientName ?? r.patient?.name ?? r.patient?.fullName ?? '—'}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">
                        {r.email ?? r.patient?.email ?? '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusPillClasses(r.status)}`}
                        >
                          {(r.status ?? 'UNKNOWN').replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">
                        {r.doctorName ?? r.doctor?.name ?? '—'}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">
                        {r.pharmacyName ?? r.pharmacy?.name ?? '—'}
                      </td>
                      <td className="px-5 py-3.5 text-gray-700 tabular-nums font-medium">
                        {formatCurrency(r.totalPrice)}
                      </td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs">
                        {formatDate(r.createdAt)}
                      </td>
                    </tr>
                  ))}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
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
