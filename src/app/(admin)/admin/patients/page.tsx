'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DM_Sans } from 'next/font/google'
import { getAdminPatients } from '@/lib/adminApi'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

type Patient = {
  id?: number
  name?: string
  fullName?: string
  email?: string
  phone?: string
  treatmentRequestsCount?: number
  treatmentRequestCount?: number
  createdAt?: string | null
}

function formatDate(dateLike: string | null | undefined) {
  if (!dateLike) return '—'
  const date = new Date(dateLike)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1)
      setSearch(searchInput.trim())
    }, 300)
    return () => clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const res = await getAdminPatients({
          page,
          limit,
          search: search || undefined,
        })
        if (!mounted) return
        setPatients((res?.patients ?? []) as Patient[])
        setTotalPages(Math.max(1, res?.totalPages ?? 1))
      } catch (err) {
        if (!mounted) return
        setError(err instanceof Error ? err.message : 'Failed to load patients.')
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => {
      mounted = false
    }
  }, [page, limit, search])

  return (
    <div className={dmSans.className}>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-gray-900">Patients</h1>
          <p className="mt-1 text-sm text-gray-500">All registered patients</p>
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full md:w-80 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
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
                {['ID', 'Name', 'Email', 'Phone', 'Requests', 'Registered'].map((h) => (
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
                : patients.map((p) => (
                    <tr
                      key={p.id ?? Math.random()}
                      className="border-b border-gray-50 last:border-b-0 hover:bg-emerald-50/30 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-xs font-mono text-gray-400">
                        <Link
                          href={`/admin/patients/${p.id}`}
                          className="hover:text-emerald-600 transition-colors"
                        >
                          #{p.id ?? '—'}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-gray-800">
                        <Link
                          href={`/admin/patients/${p.id}`}
                          className="hover:text-emerald-600 transition-colors"
                        >
                          {p.name ?? p.fullName ?? '—'}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{p.email ?? '—'}</td>
                      <td className="px-5 py-3.5 text-gray-500">{p.phone ?? '—'}</td>
                      <td className="px-5 py-3.5 text-gray-600 tabular-nums">
                        {p.treatmentRequestsCount ?? p.treatmentRequestCount ?? 0}
                      </td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs">
                        {formatDate(p.createdAt)}
                      </td>
                    </tr>
                  ))}
              {!loading && patients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="text-gray-300 text-4xl mb-3">◌</div>
                    <p className="text-sm text-gray-400">No patients found</p>
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
