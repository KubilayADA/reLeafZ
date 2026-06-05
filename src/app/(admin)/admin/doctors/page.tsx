'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DM_Sans } from 'next/font/google'
import { getAdminDoctors, createDoctor } from '@/lib/adminApi'

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
  _count?: { treatmentRequests: number }
}

const inputCls =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100'

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [showAddForm, setShowAddForm] = useState(false)
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')
  const [addForm, setAddForm] = useState({ name: '', email: '', licenseNumber: '', specialty: '' })

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

  async function handleAddDoctor(e: React.FormEvent) {
    e.preventDefault()
    setAdding(true)
    setAddError('')
    try {
      await createDoctor({
        name: addForm.name,
        email: addForm.email,
        licenseNumber: addForm.licenseNumber || undefined,
        specialty: addForm.specialty || undefined,
      })
      setShowAddForm(false)
      setAddForm({ name: '', email: '', licenseNumber: '', specialty: '' })
      setPage(1)
      setSearch('')
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to add doctor.')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className={dmSans.className}>
      {/* Header */}
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

      {/* Add doctor modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div
            className="w-full max-w-md rounded-2xl bg-white overflow-hidden"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}
          >
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 rounded-full bg-[#10b981]" />
                <div>
                  <h2 className="text-base font-bold text-gray-900">Add New Doctor</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    An invitation email will be sent immediately.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              {addError && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {addError}
                </div>
              )}

              <form onSubmit={handleAddDoctor} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. Anna Müller"
                    value={addForm.name}
                    onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="doctor@praxis.de"
                    value={addForm.email}
                    onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    License Number
                  </label>
                  <input
                    type="text"
                    placeholder="A-123456"
                    value={addForm.licenseNumber}
                    onChange={(e) => setAddForm((f) => ({ ...f, licenseNumber: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Specialty
                  </label>
                  <input
                    type="text"
                    placeholder="Allgemeinmedizin"
                    value={addForm.specialty}
                    onChange={(e) => setAddForm((f) => ({ ...f, specialty: e.target.value }))}
                    className={inputCls}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setAddError('')
                    }}
                    className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={adding}
                    className="flex-1 rounded-xl bg-[#10b981] px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50 transition"
                  >
                    {adding ? 'Adding…' : 'Add Doctor'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <section
        className="rounded-2xl bg-white border border-black/[0.06] overflow-hidden"
        style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                {['ID', 'Name', 'Email', 'Specialty', 'License No', 'Status', 'Requests'].map(
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
                      {Array.from({ length: 7 }).map((__, cidx) => (
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
                          {d.name ?? d.fullName ?? '—'}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{d.email ?? '—'}</td>
                      <td className="px-5 py-3.5 text-gray-600">{d.specialty ?? '—'}</td>
                      <td className="px-5 py-3.5 text-gray-500 font-mono text-xs">
                        {d.licenseNo ?? d.licenseNumber ?? '—'}
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
                      <td className="px-5 py-3.5 text-gray-600 tabular-nums">
                        {d._count?.treatmentRequests ?? 0}
                      </td>
                    </tr>
                  ))}
              {!loading && doctors.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="text-gray-300 text-4xl mb-3">◌</div>
                    <p className="text-sm text-gray-400">No doctors found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Pagination */}
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
