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
    <div className={`${dmSans.className} text-black`}>
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Patients</h1>
          <p className="mt-1 text-sm text-gray-500">All registered patients</p>
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full md:w-80 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-black outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-200"
        />
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
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Name</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Email</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Phone</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Treatment Requests</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Registration Date</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 10 }).map((_, idx) => (
                    <tr key={idx} className="border-b border-black/5">
                      {Array.from({ length: 6 }).map((__, cidx) => (
                        <td key={cidx} className="px-4 md:px-6 py-3">
                          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : patients.map((p) => (
                    <tr key={p.id ?? Math.random()} className="border-b border-black/5 last:border-b-0 hover:bg-black/[0.02]">
                      <td className="px-4 md:px-6 py-3 text-gray-700">
                        <Link href={`/admin/patients/${p.id}`} className="hover:text-green-700">
                          {p.id ?? '—'}
                        </Link>
                      </td>
                      <td className="px-4 md:px-6 py-3 text-gray-800">
                        <Link href={`/admin/patients/${p.id}`} className="hover:text-green-700">
                          {p.name ?? p.fullName ?? '—'}
                        </Link>
                      </td>
                      <td className="px-4 md:px-6 py-3 text-gray-700">{p.email ?? '—'}</td>
                      <td className="px-4 md:px-6 py-3 text-gray-700">{p.phone ?? '—'}</td>
                      <td className="px-4 md:px-6 py-3 text-gray-700">
                        {p.treatmentRequestsCount ?? p.treatmentRequestCount ?? 0}
                      </td>
                      <td className="px-4 md:px-6 py-3 text-gray-600">{formatDate(p.createdAt)}</td>
                    </tr>
                  ))}
              {!loading && patients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 md:px-6 py-10 text-center text-sm text-gray-500">
                    No patients found.
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
