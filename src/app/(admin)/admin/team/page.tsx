'use client'

import { FormEvent, useEffect, useState } from 'react'
import { DM_Sans } from 'next/font/google'
import { createAdminMember, deactivateAdminMember, getAdminTeam } from '@/lib/adminApi'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

type TeamMember = {
  id?: number
  name?: string
  email?: string
  role?: 'ADMIN' | 'OPERATOR' | 'CUSTOMER_SERVICE' | string
  isActive?: boolean
  createdAt?: string
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

function rolePillClasses(role: string | undefined) {
  switch ((role ?? '').toUpperCase()) {
    case 'ADMIN':
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
    case 'OPERATOR':
      return 'bg-sky-50 text-sky-700 ring-1 ring-sky-200'
    case 'CUSTOMER_SERVICE':
      return 'bg-violet-50 text-violet-700 ring-1 ring-violet-200'
    default:
      return 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
  }
}

const inputCls =
  'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [showAddForm, setShowAddForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    email: '',
    name: '',
    role: 'OPERATOR',
  })

  const loadMembers = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getAdminTeam({ page, limit })
      setMembers((res?.members ?? []) as TeamMember[])
      setTotalPages(Math.max(1, res?.totalPages ?? 1))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load team.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMembers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit])

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await createAdminMember({
        email: form.email.trim(),
        name: form.name.trim(),
        role: form.role,
      })
      setForm({ email: '', name: '', role: 'OPERATOR' })
      setShowAddForm(false)
      await loadMembers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create team member.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeactivate = async (id: number | undefined) => {
    if (id == null) return
    setError('')
    try {
      await deactivateAdminMember(id)
      await loadMembers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate member.')
    }
  }

  return (
    <div className={dmSans.className}>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-gray-900">Team</h1>
          <p className="mt-1 text-sm text-gray-500">Admin team members and their access</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm((prev) => !prev)}
          className="rounded-xl bg-[#10b981] px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 whitespace-nowrap transition-colors"
          style={{ boxShadow: '0 2px 8px rgba(16,185,129,0.20)' }}
        >
          {showAddForm ? 'Cancel' : '+ Add Member'}
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Add member form */}
      {showAddForm && (
        <div
          className="mb-6 rounded-2xl bg-white border border-black/[0.06] p-6"
          style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-5 rounded-full bg-[#10b981]" />
            <h3 className="text-base font-bold text-gray-900">Add Team Member</h3>
          </div>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="team@releafz.de"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Max Mustermann"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                className={inputCls}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="OPERATOR">OPERATOR</option>
                <option value="CUSTOMER_SERVICE">CUSTOMER_SERVICE</option>
              </select>
            </div>
            <div className="md:col-span-3 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-[#10b981] px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creating…' : 'Create Member'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
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
                {['ID', 'Name', 'Email', 'Role', 'Status', 'Created', 'Actions'].map((h) => (
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
                ? Array.from({ length: 8 }).map((_, idx) => (
                    <tr key={idx} className="border-b border-gray-50">
                      {Array.from({ length: 7 }).map((__, cidx) => (
                        <td key={cidx} className="px-5 py-3.5">
                          <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : members.map((m, idx) => (
                    <tr
                      key={m.id ?? idx}
                      className="border-b border-gray-50 last:border-b-0 hover:bg-emerald-50/30 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-xs font-mono text-gray-400">
                        #{m.id ?? '—'}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-gray-800">{m.name ?? '—'}</td>
                      <td className="px-5 py-3.5 text-gray-500">{m.email ?? '—'}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${rolePillClasses(m.role)}`}
                        >
                          {m.role ?? '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                            m.isActive
                              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                              : 'bg-gray-100 text-gray-500 ring-1 ring-gray-200'
                          }`}
                        >
                          {m.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-400 text-xs">
                        {formatDate(m.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        {m.isActive ? (
                          <button
                            type="button"
                            onClick={() => handleDeactivate(m.id)}
                            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
              {!loading && members.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="text-gray-300 text-4xl mb-3">◌</div>
                    <p className="text-sm text-gray-400">No team members found</p>
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
