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
    <div className={`${dmSans.className} text-black`}>
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Prescriptions</h1>
          <p className="mt-1 text-sm text-gray-500">All treatment requests</p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setPage(1)
              setSearch(e.target.value)
            }}
            placeholder="Search requests..."
            className="w-full md:w-72 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-black outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-200"
          />
          <select
            value={status}
            onChange={(e) => {
              setPage(1)
              setStatus(e.target.value as (typeof STATUS_OPTIONS)[number])
            }}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-black outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-200"
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
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-black/10">
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">ID</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Patient Name</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Email</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Status</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Doctor</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Pharmacy</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Total Price (€)</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 10 }).map((_, idx) => (
                    <tr key={idx} className="border-b border-black/5">
                      {Array.from({ length: 8 }).map((__, cidx) => (
                        <td key={cidx} className="px-4 md:px-6 py-3">
                          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : rows.map((r, idx) => (
                    <tr key={r.id ?? idx} className="border-b border-black/5 last:border-b-0 hover:bg-black/[0.02]">
                      <td className="px-4 md:px-6 py-3 text-gray-700">
                        <Link href={`/admin/prescriptions/${r.id}`} className="hover:text-green-700">
                          {r.id ?? '—'}
                        </Link>
                      </td>
                      <td className="px-4 md:px-6 py-3 text-gray-800">
                        <Link href={`/admin/prescriptions/${r.id}`} className="hover:text-green-700">
                          {r.patientName ?? r.patient?.name ?? r.patient?.fullName ?? '—'}
                        </Link>
                      </td>
                      <td className="px-4 md:px-6 py-3 text-gray-700">{r.email ?? r.patient?.email ?? '—'}</td>
                      <td className="px-4 md:px-6 py-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses(
                            r.status,
                          )}`}
                        >
                          {r.status ?? 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 text-gray-700">{r.doctorName ?? r.doctor?.name ?? '—'}</td>
                      <td className="px-4 md:px-6 py-3 text-gray-700">{r.pharmacyName ?? r.pharmacy?.name ?? '—'}</td>
                      <td className="px-4 md:px-6 py-3 text-gray-700">{formatCurrency(r.totalPrice)}</td>
                      <td className="px-4 md:px-6 py-3 text-gray-600">{formatDate(r.createdAt)}</td>
                    </tr>
                  ))}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 md:px-6 py-10 text-center text-sm text-gray-500">
                    No treatment requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page <= 1 || loading}
          className="rounded-lg border border-black/15 bg-white px-4 py-2 text-sm hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <p className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </p>
        <button
          type="button"
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page >= totalPages || loading}
          className="rounded-lg border border-black/15 bg-white px-4 py-2 text-sm hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}
