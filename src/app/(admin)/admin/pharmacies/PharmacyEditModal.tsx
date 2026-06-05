'use client'

import { useEffect, useState } from 'react'
import {
  AdminApiError,
  updatePharmacy,
  type PharmacyDetail,
  type PharmacyUpdatePayload,
} from '@/lib/adminApi'

const inputCls =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100'

const API_KEY_MASK = '••••••••••••'

export type PharmacyFormValues = {
  name: string
  email: string
  contact: string
  phone: string
  zip: string
  city: string
  cannaleoSubdomain: string
  cannaleoVendorId: string
  cannaleoApiKey: string
  inventorySource: 'MANUAL' | 'CANNALEO'
  supportsBotendienst: boolean
  supportsPickup: boolean
  supportsMailOrder: boolean
  mailOrderFee: string
}

type PharmacyFormState = PharmacyFormValues & {
  apiKeyTouched: boolean
  hadExistingApiKey: boolean
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-5 rounded-full bg-[#10b981]" />
      <h3 className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">
        {children}
      </h3>
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-red-600">{message}</p>
}

export function pharmacyToFormValues(pharmacy: PharmacyDetail): PharmacyFormState {
  const hasApiKey = Boolean(pharmacy.cannaleoApiKey)
  return {
    name: pharmacy.name ?? '',
    email: pharmacy.email ?? '',
    contact: pharmacy.contact ?? '',
    phone: pharmacy.phone ?? '',
    zip: pharmacy.zip ?? '',
    city: pharmacy.city ?? '',
    cannaleoSubdomain: pharmacy.cannaleoSubdomain ?? '',
    cannaleoVendorId: pharmacy.cannaleoVendorId ?? '',
    cannaleoApiKey: hasApiKey ? API_KEY_MASK : '',
    inventorySource:
      pharmacy.inventorySource === 'CANNALEO' ? 'CANNALEO' : 'MANUAL',
    supportsBotendienst: pharmacy.supportsBotendienst ?? false,
    supportsPickup: pharmacy.supportsPickup ?? true,
    supportsMailOrder: pharmacy.supportsMailOrder ?? false,
    mailOrderFee:
      pharmacy.mailOrderFee != null ? String(pharmacy.mailOrderFee) : '',
    apiKeyTouched: false,
    hadExistingApiKey: hasApiKey,
  }
}

function buildUpdatePayload(
  form: PharmacyFormState,
  initial: PharmacyFormState,
): PharmacyUpdatePayload {
  const payload: PharmacyUpdatePayload = {}

  if (form.name !== initial.name) payload.name = form.name.trim()
  if (form.email !== initial.email) payload.email = form.email.trim()
  if (form.contact !== initial.contact) payload.contact = form.contact.trim()
  if (form.phone !== initial.phone) payload.phone = form.phone.trim() || undefined
  if (form.zip !== initial.zip) payload.zip = form.zip.trim()
  if (form.city !== initial.city) payload.city = form.city.trim() || undefined

  if (form.cannaleoSubdomain !== initial.cannaleoSubdomain) {
    payload.cannaleoSubdomain = form.cannaleoSubdomain.trim() || null
  }
  if (form.cannaleoVendorId !== initial.cannaleoVendorId) {
    payload.cannaleoVendorId = form.cannaleoVendorId.trim() || null
  }
  if (form.apiKeyTouched) {
    payload.cannaleoApiKey = form.cannaleoApiKey.trim()
  }

  if (form.inventorySource !== initial.inventorySource) {
    payload.inventorySource = form.inventorySource
  }
  if (form.supportsBotendienst !== initial.supportsBotendienst) {
    payload.supportsBotendienst = form.supportsBotendienst
  }
  if (form.supportsPickup !== initial.supportsPickup) {
    payload.supportsPickup = form.supportsPickup
  }
  if (form.supportsMailOrder !== initial.supportsMailOrder) {
    payload.supportsMailOrder = form.supportsMailOrder
  }

  const mailOrderFeeChanged = form.mailOrderFee !== initial.mailOrderFee
  const mailOrderToggleChanged = form.supportsMailOrder !== initial.supportsMailOrder
  if (mailOrderFeeChanged || mailOrderToggleChanged) {
    if (form.supportsMailOrder) {
      payload.mailOrderFee = form.mailOrderFee.trim() ? Number(form.mailOrderFee) : null
    } else {
      payload.mailOrderFee = null
    }
  }

  return payload
}

type PharmacyEditModalProps = {
  open: boolean
  pharmacy: PharmacyDetail
  onClose: () => void
  onSuccess: (pharmacy: PharmacyDetail) => void
}

export function PharmacyEditModal({
  open,
  pharmacy,
  onClose,
  onSuccess,
}: PharmacyEditModalProps) {
  const initialValues = pharmacyToFormValues(pharmacy)
  const [form, setForm] = useState<PharmacyFormState>(initialValues)
  const [submitting, setSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      setForm(pharmacyToFormValues(pharmacy))
      setGeneralError('')
      setFieldErrors({})
    }
  }, [open, pharmacy])

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setGeneralError('')
    setFieldErrors({})

    if (!form.supportsBotendienst && !form.supportsPickup && !form.supportsMailOrder) {
      setGeneralError('Pharmacy must support at least one delivery method.')
      setSubmitting(false)
      return
    }

    if (form.supportsMailOrder) {
      const fee = Number(form.mailOrderFee)
      if (!Number.isFinite(fee) || fee <= 0) {
        setFieldErrors({ mailOrderFee: 'Mail-order fee must be a positive number.' })
        setSubmitting(false)
        return
      }
    }

    const payload = buildUpdatePayload(form, initialValues)
    if (Object.keys(payload).length === 0) {
      onClose()
      setSubmitting(false)
      return
    }

    try {
      const updated = await updatePharmacy(pharmacy.id, payload)
      onSuccess(updated)
      onClose()
    } catch (err) {
      if (err instanceof AdminApiError) {
        setGeneralError(err.message)
        setFieldErrors(err.fieldErrors)
      } else {
        setGeneralError(err instanceof Error ? err.message : 'Failed to update pharmacy.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-8 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white overflow-hidden my-auto max-h-[92vh] flex flex-col"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}
      >
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">Edit Pharmacy</h2>
            <p className="text-xs text-gray-500 mt-0.5">Update pharmacy profile and settings.</p>
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

        <div className="px-6 py-6 overflow-y-auto">
          {generalError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <SectionTitle>Identity</SectionTitle>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className={inputCls}
                  />
                  <FieldError message={fieldErrors.name} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className={inputCls}
                  />
                  <FieldError message={fieldErrors.email} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    required
                    value={form.contact}
                    onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                    className={inputCls}
                  />
                  <FieldError message={fieldErrors.contact} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className={inputCls}
                  />
                  <FieldError message={fieldErrors.phone} />
                </div>
              </div>
            </div>

            <div>
              <SectionTitle>Address</SectionTitle>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={form.zip}
                    onChange={(e) => setForm((f) => ({ ...f, zip: e.target.value }))}
                    className={inputCls}
                  />
                  <FieldError message={fieldErrors.zip} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className={inputCls}
                  />
                  <FieldError message={fieldErrors.city} />
                </div>
              </div>
            </div>

            <div>
              <SectionTitle>Cannaleo Integration</SectionTitle>
              <div className="rounded-2xl border border-sky-100 bg-sky-50/60 px-4 py-4 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Subdomain
                  </label>
                  <input
                    type="text"
                    value={form.cannaleoSubdomain}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, cannaleoSubdomain: e.target.value }))
                    }
                    className="w-full rounded-xl border border-sky-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                  <FieldError message={fieldErrors.cannaleoSubdomain} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Vendor ID
                  </label>
                  <input
                    type="text"
                    value={form.cannaleoVendorId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, cannaleoVendorId: e.target.value }))
                    }
                    className="w-full rounded-xl border border-sky-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                  <FieldError message={fieldErrors.cannaleoVendorId} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    API Key
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder={form.hadExistingApiKey ? 'Leave unchanged' : 'JWT key…'}
                      value={form.cannaleoApiKey}
                      onFocus={() => {
                        setForm((f) => {
                          if (
                            f.hadExistingApiKey &&
                            !f.apiKeyTouched &&
                            f.cannaleoApiKey === API_KEY_MASK
                          ) {
                            return { ...f, cannaleoApiKey: '' }
                          }
                          return f
                        })
                      }}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          cannaleoApiKey: e.target.value,
                          apiKeyTouched: true,
                        }))
                      }
                      className="flex-1 rounded-xl border border-sky-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    />
                    {form.hadExistingApiKey && (
                      <button
                        type="button"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            cannaleoApiKey: '',
                            apiKeyTouched: true,
                          }))
                        }
                        className="rounded-xl border border-sky-200 bg-white px-3 py-2 text-xs font-medium text-sky-700 hover:bg-sky-50 transition shrink-0"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <FieldError message={fieldErrors.cannaleoApiKey} />
                </div>
              </div>
            </div>

            <div>
              <SectionTitle>Delivery Capabilities</SectionTitle>
              <div className="rounded-2xl border border-amber-100 bg-amber-50/50 px-4 py-4 space-y-3">
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
                      checked={form[key]}
                      onChange={(e) => {
                        if (key === 'supportsMailOrder') {
                          setForm((f) => ({
                            ...f,
                            supportsMailOrder: e.target.checked,
                            mailOrderFee: e.target.checked ? f.mailOrderFee : '',
                          }))
                        } else {
                          setForm((f) => ({ ...f, [key]: e.target.checked }))
                        }
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
                {form.supportsMailOrder && (
                  <div className="pl-6">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Mail-Order Fee (EUR)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={form.mailOrderFee}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, mailOrderFee: e.target.value }))
                      }
                      className="w-full rounded-xl border border-amber-200 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
                    />
                    <FieldError message={fieldErrors.mailOrderFee} />
                  </div>
                )}
              </div>
            </div>

            <div>
              <SectionTitle>Inventory Source</SectionTitle>
              <div className="flex gap-4">
                {(['MANUAL', 'CANNALEO'] as const).map((source) => (
                  <label key={source} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="inventorySource"
                      checked={form.inventorySource === source}
                      onChange={() => setForm((f) => ({ ...f, inventorySource: source }))}
                      className="w-4 h-4 border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">{source}</span>
                  </label>
                ))}
              </div>
              <FieldError message={fieldErrors.inventorySource} />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-xl bg-[#10b981] px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-50 transition"
              >
                {submitting ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
