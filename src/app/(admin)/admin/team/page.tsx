'use client'

import { FormEvent, useEffect, useState } from 'react'
import { DM_Sans } from 'next/font/google'
import {
  createAdminMember,
  deactivateAdminMember,
  getAdminTeam,
} from '@/lib/adminApi'

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
    <div className={`${dmSans.className} text-black`}>
      <div className="mb-6 md:mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Team</h1>
          <p className="mt-1 text-sm text-gray-500">Admin team members</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm((prev) => !prev)}
          className="rounded-lg border border-black bg-[#72906F] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:brightness-95"
        >
          Add Member
        </button>
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
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Role</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Active</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Created</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, idx) => (
                    <tr key={idx} className="border-b border-black/5">
                      {Array.from({ length: 7 }).map((__, cidx) => (
                        <td key={cidx} className="px-4 md:px-6 py-3">
                          <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : members.map((m, idx) => (
                    <tr key={m.id ?? idx} className="border-b border-black/5 last:border-b-0 hover:bg-black/[0.02]">
                      <td className="px-4 md:px-6 py-3 text-gray-700">{m.id ?? '—'}</td>
                      <td className="px-4 md:px-6 py-3 text-gray-800">{m.name ?? '—'}</td>
                      <td className="px-4 md:px-6 py-3 text-gray-700">{m.email ?? '—'}</td>
                      <td className="px-4 md:px-6 py-3">
                        <span className="inline-flex items-center rounded-full border border-green-300 bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800">
                          {m.role ?? '—'}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                            m.isActive
                              ? 'bg-green-100 text-green-800 border-green-300'
                              : 'bg-gray-100 text-gray-700 border-gray-300'
                          }`}
                        >
                          {m.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 text-gray-600">{formatDate(m.createdAt)}</td>
                      <td className="px-4 md:px-6 py-3">
                        {m.isActive ? (
                          <button
                            type="button"
                            onClick={() => handleDeactivate(m.id)}
                            className="rounded-md border border-red-300 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
              {!loading && members.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 md:px-6 py-10 text-center text-sm text-gray-500">
                    No team members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showAddForm && (
        <section className="mt-4 rounded-xl border border-black/10 bg-white p-4 md:p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Add Team Member</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="Email"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-black outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-200"
            />
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Name"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-black outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-200"
            />
            <select
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-black outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-200"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="OPERATOR">OPERATOR</option>
              <option value="CUSTOMER_SERVICE">CUSTOMER_SERVICE</option>
            </select>
            <div className="md:col-span-3 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg border border-black bg-[#72906F] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Creating...' : 'Create Member'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-lg border border-black/15 bg-white px-4 py-2.5 text-sm hover:bg-black/5"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

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
