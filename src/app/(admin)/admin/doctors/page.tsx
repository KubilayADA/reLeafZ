'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DM_Sans } from 'next/font/google'
import { getAdminDoctors } from '@/lib/adminApi'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

type Doctor = {
  id?: number
  name?: string
  fullName?: string
  email?: string
  specialty?: string
  licenseNo?: string
  licenseNumber?: string
  isActive?: boolean
  treatmentRequestsCount?: number
  treatmentRequestCount?: number
}

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const res = await getAdminDoctors({
          page,
          limit,
          search: search.trim() || undefined,
        })
        if (!mounted) return
        setDoctors((res?.doctors ?? []) as Doctor[])
        setTotalPages(Math.max(1, res?.totalPages ?? 1))
      } catch (err) {
        if (!mounted) return
        setError(err instanceof Error ? err.message : 'Failed to load doctors.')
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
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Doctors</h1>
          <p className="mt-1 text-sm text-gray-500">Licensed medical doctors</p>
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setPage(1)
            setSearch(e.target.value)
          }}
          placeholder="Search doctors..."
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
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Specialty</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">License No</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Active</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Treatment Requests</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 10 }).map((_, idx) => (
                    <tr key={idx} className="border-b border-black/5">
                      {Array.from({ length: 7 }).map((__, cidx) => (
                        <td key={cidx} className="px-4 md:px-6 py-3">
                          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : doctors.map((d, idx) => (
                    <tr key={d.id ?? idx} className="border-b border-black/5 last:border-b-0 hover:bg-black/[0.02]">
                      <td className="px-4 md:px-6 py-3 text-gray-700">
                        <Link href={`/admin/doctors/${d.id}`} className="hover:text-green-700">
                          {d.id ?? '—'}
                        </Link>
                      </td>
                      <td className="px-4 md:px-6 py-3 text-gray-800">
                        <Link href={`/admin/doctors/${d.id}`} className="hover:text-green-700">
                          {d.name ?? d.fullName ?? '—'}
                        </Link>
                      </td>
                      <td className="px-4 md:px-6 py-3 text-gray-700">{d.email ?? '—'}</td>
                      <td className="px-4 md:px-6 py-3 text-gray-700">{d.specialty ?? '—'}</td>
                      <td className="px-4 md:px-6 py-3 text-gray-700">{d.licenseNo ?? d.licenseNumber ?? '—'}</td>
                      <td className="px-4 md:px-6 py-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                            d.isActive
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : 'bg-gray-100 text-gray-700 border-gray-300'
                          }`}
                        >
                          {d.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 text-gray-700">
                        {d.treatmentRequestsCount ?? d.treatmentRequestCount ?? 0}
                      </td>
                    </tr>
                  ))}
              {!loading && doctors.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 md:px-6 py-10 text-center text-sm text-gray-500">
                    No doctors found.
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
