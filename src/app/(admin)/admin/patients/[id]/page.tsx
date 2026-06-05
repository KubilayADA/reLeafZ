'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DM_Sans } from 'next/font/google'
import { getAdminPatient, type PatientDetail, type PatientOrderSummary } from '@/lib/adminApi'

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] })

const STATUS_COLORS: Record<string, string> = {
  PENDING_STRAIN_SELECTION: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
  PENDING_DOCTOR_APPROVAL: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  PENDING_PAYMENT: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  APPROVED: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  DECLINED: 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
  PAID: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  PROCESSING: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200',
  READY: 'bg-teal-50 text-teal-700 ring-1 ring-teal-200',
  DELIVERED: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  CANCELLED: 'bg-gray-100 text-gray-500 ring-1 ring-gray-200',
}

const cardCls = 'rounded-2xl bg-white border border-black/[0.06] p-6'
const cardShadow = { boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }
const modalShadow = { boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }

function formatCurrency(value: number | undefined) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value ?? 0)
}

function OrderDetailModal({
  order,
  onClose,
}: {
  order: PatientOrderSummary
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white overflow-hidden"
        style={modalShadow}
      >
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">Order #{order.id}</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {new Date(order.createdAt).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none p-1"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Status</span>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
              }`}
            >
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="flex justify-between items-start gap-4 text-sm">
            <span className="text-gray-400 shrink-0">Delivery Method</span>
            <span className="font-medium text-gray-800 text-right">
              {order.deliveryMethod ?? '—'}
            </span>
          </div>
          <div className="flex justify-between items-start gap-4 text-sm">
            <span className="text-gray-400 shrink-0">Delivery Address</span>
            <span className="font-medium text-gray-800 text-right">
              {order.deliveryAddress ?? '—'}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Pharmacy</span>
            <span className="font-medium text-gray-800">{order.pharmacyName ?? '—'}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Products</span>
            <span className="font-medium text-gray-800 tabular-nums">
              {order.productCount ?? 0} item{(order.productCount ?? 0) !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-100">
            <span className="text-gray-400">Total</span>
            <span className="font-bold text-gray-900">{formatCurrency(order.total)}</span>
          </div>

          <button
            type="button"
            disabled
            title="Coming soon"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-400 cursor-not-allowed"
          >
            Download invoice
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminPatientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const [patient, setPatient] = useState<PatientDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<PatientOrderSummary | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getAdminPatient(id)
        setPatient(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load patient.')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) {
    return (
      <div className={dmSans.className}>
        <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={dmSans.className}>
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    )
  }

  if (!patient) return null

  const treatmentRequests = patient.treatmentRequests ?? []
  const orders = patient.orders ?? []

  const activeCount = treatmentRequests.filter((r) =>
    ['PENDING_DOCTOR_APPROVAL', 'APPROVED', 'PAID', 'PROCESSING', 'READY'].includes(r.status),
  ).length
  const completedCount = treatmentRequests.filter((r) =>
    ['DELIVERED', 'FULFILLED'].includes(r.status),
  ).length
  const declinedCount = treatmentRequests.filter((r) => r.status === 'DECLINED').length

  const displayName = patient.fullName ?? patient.name ?? patient.email

  return (
    <div className={dmSans.className}>
      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}

      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          ←
        </button>
        <h1 className="text-[28px] font-bold tracking-tight text-gray-900">{displayName}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className={cardCls} style={cardShadow}>
          <h2 className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-4">
            Patient Details
          </h2>
          <div className="space-y-2.5">
            {[
              { label: 'Email', value: patient.email },
              { label: 'Name', value: patient.name ?? patient.fullName ?? '—' },
              { label: 'Phone', value: patient.phone ?? '—' },
              { label: 'City / Address', value: patient.address ?? '—' },
              { label: 'Total Requests', value: treatmentRequests.length },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center text-sm">
                <span className="text-gray-400">{row.label}</span>
                <span className="font-medium text-gray-800">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={cardCls} style={cardShadow}>
          <h2 className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-4">
            Activity Summary
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Active', value: activeCount, color: 'text-emerald-600' },
              { label: 'Completed', value: completedCount, color: 'text-sky-600' },
              { label: 'Declined', value: declinedCount, color: 'text-rose-500' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className={`text-3xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
                <p className="mt-1 text-[10px] uppercase tracking-widest font-semibold text-gray-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          {treatmentRequests[0] && (
            <p className="mt-5 text-xs text-gray-400">
              Last request:{' '}
              {new Date(treatmentRequests[0].createdAt).toLocaleDateString('de-DE')}
            </p>
          )}
        </div>
      </div>

      {/* Order history */}
      <div
        className="rounded-2xl bg-white border border-black/[0.06] overflow-hidden mb-6"
        style={cardShadow}
      >
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">
            Order History ({orders.length})
          </h2>
        </div>
        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  {['ID', 'Status', 'Pharmacy', 'Products', 'Total', 'Date'].map((h) => (
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
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="border-b border-gray-50 last:border-b-0 hover:bg-emerald-50/30 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5 text-xs font-mono text-gray-400">#{order.id}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          STATUS_COLORS[order.status] ??
                          'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
                        }`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{order.pharmacyName ?? '—'}</td>
                    <td className="px-5 py-3.5 text-gray-600 tabular-nums">
                      {order.productCount ?? 0}
                    </td>
                    <td className="px-5 py-3.5 text-gray-800 font-medium tabular-nums">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('de-DE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="text-gray-300 text-3xl mb-2">◌</div>
            <p className="text-sm text-gray-400">No orders yet</p>
          </div>
        )}
      </div>

      {/* Treatment requests table */}
      {treatmentRequests.length > 0 ? (
        <div
          className="rounded-2xl bg-white border border-black/[0.06] overflow-hidden"
          style={cardShadow}
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">
              Treatment Requests ({treatmentRequests.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  {['ID', 'Status', 'Doctor', 'Pharmacy', 'Date'].map((h) => (
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
                {treatmentRequests.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-gray-50 last:border-b-0 hover:bg-emerald-50/30 transition-colors"
                  >
                    <td className="px-5 py-3.5 text-xs font-mono text-gray-400">#{r.id}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          STATUS_COLORS[r.status] ??
                          'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
                        }`}
                      >
                        {r.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{r.doctor?.name ?? '—'}</td>
                    <td className="px-5 py-3.5 text-gray-600">{r.pharmacy?.name ?? '—'}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {new Date(r.createdAt).toLocaleDateString('de-DE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div
          className="rounded-2xl bg-white border border-black/[0.06] px-6 py-16 text-center"
          style={cardShadow}
        >
          <div className="text-gray-300 text-4xl mb-3">◌</div>
          <p className="text-sm text-gray-400">No treatment requests yet</p>
        </div>
      )}
    </div>
  )
}
