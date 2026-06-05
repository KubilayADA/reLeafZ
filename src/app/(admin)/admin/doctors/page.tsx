'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DM_Sans } from 'next/font/google'
import { Leaf } from 'lucide-react'
import { getAdminDoctors, type Doctor } from '@/lib/adminApi'
import {
  DoctorFormModal,
  LanguageChips,
  formatDoctorName,
  onboardingStatusPillClasses,
} from './DoctorFormModal'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [showAddForm, setShowAddForm] = useState(false)

  async function loadDoctors() {
    setLoading(true)
    setError('')
    try {
      const res = await getAdminDoctors({
        page,
        limit,
        search: search.trim() || undefined,
      })
      setDoctors(res?.doctors ?? [])
      setTotalPages(Math.max(1, res?.totalPages ?? 1))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load doctors.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!mounted) return
      await loadDoctors()
    })()
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search])

  const columns = [
    'ID',
    'Name',
    'Email',
    'Specialty',
    'Languages',
    'Onboarding',
    'Cannabis',
    'Prescriptions',
    'Status',
  ]

  return (
    <div className={dmSans.className}>
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-gray-900">Doctors</h1>
          <p className="mt-1 text-sm text-gray-500">Licensed medical doctors on the platform</p>
        </div>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setPage(1)
              setSearch(e.target.value)
            }}
            placeholder="Search doctors…"
            className="w-full md:w-64 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <button
            type="button"
            onClick={() => setShowAddForm(true)}
            className="rounded-xl bg-[#10b981] px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 whitespace-nowrap transition-colors"
            style={{ boxShadow: '0 2px 8px rgba(16,185,129,0.20)' }}
          >
            + Add Doctor
          </button>
        </div>
      </div>

      <DoctorFormModal
        open={showAddForm}
        mode="create"
        onClose={() => setShowAddForm(false)}
        onSuccess={() => {
          setShowAddForm(false)
          setPage(1)
          void loadDoctors()
        }}
      />

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
                {columns.map((h) => (
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
                      {Array.from({ length: columns.length }).map((__, cidx) => (
                        <td key={cidx} className="px-5 py-3.5">
                          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : doctors.map((d, idx) => (
                    <tr
                      key={d.id ?? idx}
                      className="border-b border-gray-50 last:border-b-0 hover:bg-emerald-50/30 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-xs font-mono text-gray-400">
                        <Link
                          href={`/admin/doctors/${d.id}`}
                          className="hover:text-emerald-600 transition-colors"
                        >
                          #{d.id ?? '—'}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-gray-800">
                        <Link
                          href={`/admin/doctors/${d.id}`}
                          className="hover:text-emerald-600 transition-colors"
                        >
                          {formatDoctorName(d)}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{d.email ?? '—'}</td>
                      <td className="px-5 py-3.5 text-gray-600">{d.specialty ?? '—'}</td>
                      <td className="px-5 py-3.5">
                        <LanguageChips languages={d.languages} />
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${onboardingStatusPillClasses(d.onboardingStatus)}`}
                        >
                          {(d.onboardingStatus ?? '—').replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <Leaf
                          className={`h-4 w-4 ${
                            d.availableForCannabis
                              ? 'text-emerald-500'
                              : 'text-gray-300'
                          }`}
                          aria-label={
                            d.availableForCannabis
                              ? 'Available for cannabis'
                              : 'Not available for cannabis'
                          }
                        />
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700 ring-1 ring-violet-200 tabular-nums">
                          {d._count?.treatmentRequests ?? 0}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            d.isActive
                              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                              : 'bg-gray-100 text-gray-500 ring-1 ring-gray-200'
                          }`}
                        >
                          {d.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
              {!loading && doctors.length === 0 && (
                <tr>
                  <td colSpan={columns.length} className="px-5 py-16 text-center">
                    <div className="text-gray-300 text-4xl mb-3">◌</div>
                    <p className="text-sm text-gray-400">No doctors found</p>
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
