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
    return () => { mounted = false }
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
    <div className={`${dmSans.className} text-black`}>
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Pharmacies</h1>
          <p className="mt-1 text-sm text-gray-500">Partner pharmacies</p>
        </div>
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => { setPage(1); setSearch(e.target.value) }}
            placeholder="Search pharmacies..."
            className="w-full md:w-64 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-black outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-200"
          />
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-700 whitespace-nowrap"
          >
            + Add Pharmacy
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-green-600 px-6 py-5">
              <h2 className="text-lg font-semibold text-white">Onboard New Pharmacy</h2>
              <p className="text-sm text-green-100 mt-1">An invitation email will be sent to the pharmacy immediately.</p>
            </div>
            <div className="px-6 py-6">
              {addError && (
                <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {addError}
                </div>
              )}
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Pharmacy Name *</label>
                    <input required type="text" placeholder="Sky Apotheke Wedding" value={addForm.name}
                      onChange={(e) => setAddForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Email *</label>
                    <input required type="email" placeholder="pharmacy@example.de" value={addForm.email}
                      onChange={(e) => setAddForm(f => ({ ...f, email: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Contact Person *</label>
                    <input required type="text" placeholder="Max Mustermann" value={addForm.contact}
                      onChange={(e) => setAddForm(f => ({ ...f, contact: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Phone</label>
                    <input type="text" placeholder="030 123456" value={addForm.phone}
                      onChange={(e) => setAddForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Address</label>
                    <input type="text" placeholder="Müllerstraße 142" value={addForm.address}
                      onChange={(e) => setAddForm(f => ({ ...f, address: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">PLZ *</label>
                    <input required type="text" placeholder="13353" value={addForm.zip}
                      onChange={(e) => setAddForm(f => ({ ...f, zip: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">City</label>
                    <input type="text" placeholder="Berlin" value={addForm.city}
                      onChange={(e) => setAddForm(f => ({ ...f, city: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Delivery Type</label>
                    <select value={addForm.deliveryType}
                      onChange={(e) => setAddForm(f => ({ ...f, deliveryType: e.target.value }))}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm outline-none focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100">
                      <option value="BOTH">Botendienst + Pickup</option>
                      <option value="BOTENDIENST">Botendienst only</option>
                      <option value="PICKUP_ONLY">Pickup only</option>
                      <option value="MAIL_ORDER">Mail Order (DHL)</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-lg bg-blue-50 border border-blue-200 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-3">Cannaleo Integration (optional)</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Cannaleo Subdomain</label>
                      <input type="text" placeholder="skycannabis-wedding.de" value={addForm.cannaleoSubdomain}
                        onChange={(e) => setAddForm(f => ({ ...f, cannaleoSubdomain: e.target.value }))}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Cannaleo Vendor ID</label>
                      <input type="text" placeholder="386" value={addForm.cannaleoVendorId}
                        onChange={(e) => setAddForm(f => ({ ...f, cannaleoVendorId: e.target.value }))}
                        className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">Cannaleo API Key</label>
                      <input
                        type="password"
                        placeholder="eyJhbGciOi..."
                        value={addForm.cannaleoApiKey}
                        onChange={(e) => setAddForm(f => ({ ...f, cannaleoApiKey: e.target.value }))}
                        className="w-full rounded-lg border border-blue-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                      <p className="mt-1 text-xs text-blue-700/70">
                        JWT-format key issued by Cannaleo per pharmacy. Treat as a password.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 mb-3">Delivery Capabilities</p>
                  <p className="text-xs text-amber-700/80 mb-3">
                    Configure which delivery methods this pharmacy supports. Customers
                    will only see methods that are enabled here.
                  </p>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addForm.supportsBotendienst}
                        onChange={(e) => setAddForm(f => ({ ...f, supportsBotendienst: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700">Supports Botendienst (own courier)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addForm.supportsPickup}
                        onChange={(e) => setAddForm(f => ({ ...f, supportsPickup: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700">Supports Pickup (walk-in)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={addForm.supportsMailOrder}
                        onChange={(e) => setAddForm(f => ({
                          ...f,
                          supportsMailOrder: e.target.checked,
                          mailOrderFee: e.target.checked ? f.mailOrderFee : '',
                        }))}
                        className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700">Supports Mail Order (DHL)</span>
                    </label>

                    {addForm.supportsMailOrder && (
                      <div className="pl-6 mt-2">
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1.5">
                          Mail-Order Fee (EUR) *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          required
                          placeholder="5.99"
                          value={addForm.mailOrderFee}
                          onChange={(e) => setAddForm(f => ({ ...f, mailOrderFee: e.target.value }))}
                          className="w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800">
                  <strong>Note:</strong> The pharmacy will receive an invitation email to set up their account.
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => { setShowForm(false); setAddError('') }}
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                    Cancel
                  </button>
                  <button type="submit" disabled={adding}
                    className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition">
                    {adding ? 'Sending invitation...' : 'Onboard Pharmacy'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

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
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">City</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">ZIP</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Delivery</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Requests</th>
                <th className="px-4 md:px-6 py-3 text-left font-medium text-gray-600">Products</th>
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
                : pharmacies.map((p, idx) => (
                    <tr key={p.id ?? idx} className="border-b border-black/5 last:border-b-0 hover:bg-black/[0.02]">
                      <td className="px-4 md:px-6 py-3 text-gray-700">
                        <Link href={`/admin/pharmacies/${p.id}`} className="hover:text-green-700">{p.id ?? '—'}</Link>
                      </td>
                      <td className="px-4 md:px-6 py-3 text-gray-800">
                        <Link href={`/admin/pharmacies/${p.id}`} className="hover:text-green-700">{p.name ?? '—'}</Link>
                      </td>
                      <td className="px-4 md:px-6 py-3 text-gray-700">{p.email ?? '—'}</td>
                      <td className="px-4 md:px-6 py-3 text-gray-700">{p.city ?? '—'}</td>
                      <td className="px-4 md:px-6 py-3 text-gray-700">{p.zip ?? p.postcode ?? '—'}</td>
                      <td className="px-4 md:px-6 py-3 text-gray-700">{p.deliveryType ?? '—'}</td>
                      <td className="px-4 md:px-6 py-3 text-gray-700">{p.treatmentRequestsCount ?? p.treatmentRequestCount ?? 0}</td>
                      <td className="px-4 md:px-6 py-3 text-gray-700">{p.productsCount ?? p.productCount ?? 0}</td>
                    </tr>
                  ))}
              {!loading && pharmacies.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 md:px-6 py-10 text-center text-sm text-gray-500">No pharmacies found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-4 flex items-center justify-between">
        <button type="button" onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page <= 1 || loading}
          className="rounded-lg border border-black/15 bg-white px-4 py-2 text-sm hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed">
          Prev
        </button>
        <p className="text-sm text-gray-600">Page {page} of {totalPages}</p>
        <button type="button" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={page >= totalPages || loading}
          className="rounded-lg border border-black/15 bg-white px-4 py-2 text-sm hover:bg-black/5 disabled:opacity-50 disabled:cursor-not-allowed">
          Next
        </button>
      </div>
    </div>
  )
}