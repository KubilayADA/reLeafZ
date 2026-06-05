'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { DM_Sans } from 'next/font/google'
import { getAdminPharmacies, createPharmacy } from '@/lib/adminApi'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

type Pharmacy = {
  id?: number
  name?: string
  email?: string
  city?: string
  zip?: string
  postcode?: string
  deliveryType?: string
  treatmentRequestsCount?: number
  treatmentRequestCount?: number
  productsCount?: number
  productCount?: number
}

const emptyForm = {
  name: '',
  email: '',
  contact: '',
  phone: '',
  address: '',
  zip: '',
  city: '',
  deliveryType: 'BOTH',
  cannaleoSubdomain: '',
  cannaleoVendorId: '',
  cannaleoApiKey: '',
  supportsBotendienst: false,
  supportsPickup: true,
  supportsMailOrder: false,
  mailOrderFee: '',
}

const inputCls =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100'

export default function AdminPharmaciesPage() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState('')
  const [addForm, setAddForm] = useState(emptyForm)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const res = await getAdminPharmacies({ page, limit, search: search.trim() || undefined })
        if (!mounted) return
        setPharmacies((res?.pharmacies ?? []) as Pharmacy[])
        setTotalPages(Math.max(1, res?.totalPages ?? 1))
      } catch (err) {
        if (!mounted) return
        setError(err instanceof Error ? err.message : 'Failed to load pharmacies.')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [page, limit, search])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setAddError('')

    let parsedMailOrderFee: number | undefined = undefined
    if (addForm.supportsMailOrder) {
      const fee = Number(addForm.mailOrderFee)
      if (!Number.isFinite(fee) || fee <= 0) {
        setAddError('Mail-order fee must be a positive number when DHL is enabled.')
        return
      }
      parsedMailOrderFee = fee
    }

    if (!addForm.supportsBotendienst && !addForm.supportsPickup && !addForm.supportsMailOrder) {
      setAddError('Pharmacy must support at least one delivery method.')
      return
    }

    setAdding(true)
    try {
      await createPharmacy({
        name: addForm.name,
        email: addForm.email,
        contact: addForm.contact,
        phone: addForm.phone || undefined,
        address: addForm.address || undefined,
        zip: addForm.zip,
        city: addForm.city || undefined,
        deliveryType: addForm.deliveryType,
        cannaleoSubdomain: addForm.cannaleoSubdomain || undefined,
        cannaleoVendorId: addForm.cannaleoVendorId || undefined,
        cannaleoApiKey: addForm.cannaleoApiKey || undefined,
        supportsBotendienst: addForm.supportsBotendienst,
        supportsPickup: addForm.supportsPickup,
        supportsMailOrder: addForm.supportsMailOrder,
        mailOrderFee: parsedMailOrderFee,
      })
      setShowForm(false)
      setAddForm(emptyForm)
      setPage(1)
      setSearch('')
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Failed to add pharmacy.')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className={dmSans.className}>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-gray-900">Pharmacies</h1>
          <p className="mt-1 text-sm text-gray-500">Partner pharmacies on the platform</p>
        </div>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setPage(1)
              setSearch(e.target.value)
            }}
            placeholder="Search pharmacies…"
            className="w-full md:w-64 rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-xl bg-[#10b981] px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 whitespace-nowrap transition-colors"
            style={{ boxShadow: '0 2px 8px rgba(16,185,129,0.20)' }}
          >
            + Add Pharmacy
          </button>
        </div>
      </div>

      {/* Add pharmacy modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div
            className="w-full max-w-lg rounded-2xl bg-white overflow-hidden max-h-[92vh] overflow-y-auto"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}
          >
            {/* Modal header */}
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-1 h-5 rounded-full bg-[#10b981]" />
                <div>
                  <h2 className="text-base font-bold text-gray-900">Onboard New Pharmacy</h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    An invitation email will be sent immediately.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              {addError && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {addError}
                </div>
              )}

              <form onSubmit={handleAdd} className="space-y-5">
                {/* Basic info section */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-3 flex items-center gap-2">
                    <span className="w-4 h-px bg-gray-300 inline-block" />
                    Basic information
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Pharmacy Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Sky Apotheke Wedding"
                        value={addForm.name}
                        onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                        className={inputCls}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        required
                        type="email"
                        placeholder="pharmacy@example.de"
                        value={addForm.email}
                        onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Contact Person <span className="text-red-400">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="Max Mustermann"
                        value={addForm.contact}
                        onChange={(e) => setAddForm((f) => ({ ...f, contact: e.target.value }))}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Phone
                      </label>
                      <input
                        type="text"
                        placeholder="030 123456"
                        value={addForm.phone}
                        onChange={(e) => setAddForm((f) => ({ ...f, phone: e.target.value }))}
                        className={inputCls}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Street Address
                      </label>
                      <input
                        type="text"
                        placeholder="Müllerstraße 142"
                        value={addForm.address}
                        onChange={(e) => setAddForm((f) => ({ ...f, address: e.target.value }))}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        PLZ <span className="text-red-400">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="13353"
                        value={addForm.zip}
                        onChange={(e) => setAddForm((f) => ({ ...f, zip: e.target.value }))}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="Berlin"
                        value={addForm.city}
                        onChange={(e) => setAddForm((f) => ({ ...f, city: e.target.value }))}
                        className={inputCls}
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Delivery Type
                      </label>
                      <select
                        value={addForm.deliveryType}
                        onChange={(e) => setAddForm((f) => ({ ...f, deliveryType: e.target.value }))}
                        className={inputCls}
                      >
                        <option value="BOTH">Botendienst + Pickup</option>
                        <option value="BOTENDIENST">Botendienst only</option>
                        <option value="PICKUP_ONLY">Pickup only</option>
                        <option value="MAIL_ORDER">Mail Order (DHL)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Cannaleo section */}
                <div className="rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-4">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-sky-600 mb-3">
                    Cannaleo Integration (optional)
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Subdomain
                      </label>
                      <input
                        type="text"
                        placeholder="skycannabis-wedding.de"
                        value={addForm.cannaleoSubdomain}
                        onChange={(e) =>
                          setAddForm((f) => ({ ...f, cannaleoSubdomain: e.target.value }))
                        }
                        className="w-full rounded-xl border border-sky-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        Vendor ID
                      </label>
                      <input
                        type="text"
                        placeholder="386"
                        value={addForm.cannaleoVendorId}
                        onChange={(e) =>
                          setAddForm((f) => ({ ...f, cannaleoVendorId: e.target.value }))
                        }
                        className="w-full rounded-xl border border-sky-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                        API Key
                      </label>
                      <input
                        type="password"
                        placeholder="eyJhbGciOi…"
                        value={addForm.cannaleoApiKey}
                        onChange={(e) =>
                          setAddForm((f) => ({ ...f, cannaleoApiKey: e.target.value }))
                        }
                        className="w-full rounded-xl border border-sky-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                      />
                      <p className="mt-1.5 text-xs text-sky-600/70 italic">
                        JWT-format key issued by Cannaleo per pharmacy. Treat as a password.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery capabilities */}
                <div className="rounded-2xl border border-amber-100 bg-amber-50/50 px-4 py-4">
                  <p className="text-[10px] uppercase tracking-widest font-semibold text-amber-600 mb-1">
                    Delivery Capabilities
                  </p>
                  <p className="text-xs text-amber-700/70 mb-3 italic">
                    Only enabled methods are shown to customers.
                  </p>
                  <div className="space-y-3">
                    {[
                      {
                        key: 'supportsBotendienst' as const,
                        label: 'Supports Botendienst (own courier)',
                      },
                      { key: 'supportsPickup' as const, label: 'Supports Pickup (walk-in)' },
                      { key: 'supportsMailOrder' as const, label: 'Supports Mail Order (DHL)' },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={addForm[key]}
                          onChange={(e) => {
                            if (key === 'supportsMailOrder') {
                              setAddForm((f) => ({
                                ...f,
                                supportsMailOrder: e.target.checked,
                                mailOrderFee: e.target.checked ? f.mailOrderFee : '',
                              }))
                            } else {
                              setAddForm((f) => ({ ...f, [key]: e.target.checked }))
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}

                    {addForm.supportsMailOrder && (
                      <div className="pl-6 mt-2">
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                          Mail-Order Fee (EUR) <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          required
                          placeholder="5.99"
                          value={addForm.mailOrderFee}
                          onChange={(e) =>
                            setAddForm((f) => ({ ...f, mailOrderFee: e.target.value }))
                          }
                          className="w-full rounded-xl border border-amber-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-xl bg-gray-50 border border-gray-200 px-4 py-3 text-xs text-gray-600">
                  The pharmacy will receive an invitation email to complete their account setup.
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
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
                    {adding ? 'Sending invitation…' : 'Onboard Pharmacy'}
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
                {['ID', 'Name', 'Email', 'City', 'ZIP', 'Delivery', 'Requests', 'Products'].map(
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
                : pharmacies.map((p, idx) => (
                    <tr
                      key={p.id ?? idx}
                      className="border-b border-gray-50 last:border-b-0 hover:bg-emerald-50/30 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-xs font-mono text-gray-400">
                        <Link
                          href={`/admin/pharmacies/${p.id}`}
                          className="hover:text-emerald-600 transition-colors"
                        >
                          #{p.id ?? '—'}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-gray-800">
                        <Link
                          href={`/admin/pharmacies/${p.id}`}
                          className="hover:text-emerald-600 transition-colors"
                        >
                          {p.name ?? '—'}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{p.email ?? '—'}</td>
                      <td className="px-5 py-3.5 text-gray-600">{p.city ?? '—'}</td>
                      <td className="px-5 py-3.5 text-gray-500 font-mono text-xs">
                        {p.zip ?? p.postcode ?? '—'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold bg-sky-50 text-sky-700 ring-1 ring-sky-200">
                          {p.deliveryType ?? '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 tabular-nums">
                        {p.treatmentRequestsCount ?? p.treatmentRequestCount ?? 0}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 tabular-nums">
                        {p.productsCount ?? p.productCount ?? 0}
                      </td>
                    </tr>
                  ))}
              {!loading && pharmacies.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <div className="text-gray-300 text-4xl mb-3">◌</div>
                    <p className="text-sm text-gray-400">No pharmacies found</p>
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
