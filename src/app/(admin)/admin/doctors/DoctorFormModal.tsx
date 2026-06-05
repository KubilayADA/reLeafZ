'use client'

import { useEffect, useState } from 'react'
import {
  AdminApiError,
  createDoctor,
  updateDoctor,
  type CreateDoctorPayload,
  type Doctor,
  type DoctorOnboardingStatus,
} from '@/lib/adminApi'

const LANGUAGE_OPTIONS = ['DE', 'EN', 'TR', 'AR', 'RU', 'FR', 'ES', 'IT', 'PL'] as const

const ONBOARDING_OPTIONS: Array<{ value: DoctorOnboardingStatus; label: string }> = [
  { value: 'INVITED', label: 'Invited — awaiting signup' },
  { value: 'DOCUMENTS_PENDING', label: 'Documents pending review' },
  { value: 'VERIFIED', label: 'Verified — pending activation' },
  { value: 'ACTIVE', label: 'Active on platform' },
  { value: 'SUSPENDED', label: 'Suspended' },
]

export type DoctorFormValues = {
  title: string
  name: string
  email: string
  phone: string
  profilePictureUrl: string
  licenseNumber: string
  bsnrNumber: string
  lanrNumber: string
  medicalChamber: string
  specialty: string
  yearsOfExperience: string
  languages: string[]
  consultationFee: string
  availableForCannabis: boolean
  bio: string
  onboardingStatus: DoctorOnboardingStatus
}

export const emptyDoctorForm: DoctorFormValues = {
  title: '',
  name: '',
  email: '',
  phone: '',
  profilePictureUrl: '',
  licenseNumber: '',
  bsnrNumber: '',
  lanrNumber: '',
  medicalChamber: '',
  specialty: '',
  yearsOfExperience: '',
  languages: [],
  consultationFee: '',
  availableForCannabis: true,
  bio: '',
  onboardingStatus: 'INVITED',
}

export function doctorToFormValues(doctor: Doctor): DoctorFormValues {
  return {
    title: doctor.title ?? '',
    name: doctor.name ?? '',
    email: doctor.email ?? '',
    phone: doctor.phone ?? '',
    profilePictureUrl: doctor.profilePictureUrl ?? '',
    licenseNumber: doctor.licenseNumber ?? '',
    bsnrNumber: doctor.bsnrNumber ?? '',
    lanrNumber: doctor.lanrNumber ?? '',
    medicalChamber: doctor.medicalChamber ?? '',
    specialty: doctor.specialty ?? '',
    yearsOfExperience:
      doctor.yearsOfExperience != null ? String(doctor.yearsOfExperience) : '',
    languages: doctor.languages ?? [],
    consultationFee:
      doctor.consultationFee != null ? String(doctor.consultationFee) : '',
    availableForCannabis: doctor.availableForCannabis ?? true,
    bio: doctor.bio ?? '',
    onboardingStatus: doctor.onboardingStatus ?? 'INVITED',
  }
}

function formToPayload(form: DoctorFormValues): CreateDoctorPayload {
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    licenseNumber: form.licenseNumber.trim() || undefined,
    specialty: form.specialty.trim() || undefined,
    title: form.title.trim() || null,
    phone: form.phone.trim() || null,
    profilePictureUrl: form.profilePictureUrl.trim() || null,
    bsnrNumber: form.bsnrNumber.trim() || null,
    lanrNumber: form.lanrNumber.trim() || null,
    medicalChamber: form.medicalChamber.trim() || null,
    languages: form.languages,
    yearsOfExperience: form.yearsOfExperience.trim()
      ? Number(form.yearsOfExperience)
      : null,
    consultationFee: form.consultationFee.trim() ? Number(form.consultationFee) : null,
    availableForCannabis: form.availableForCannabis,
    bio: form.bio.trim() || null,
    onboardingStatus: form.onboardingStatus,
  }
}

const inputCls =
  'w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100'

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

type DoctorFormModalProps = {
  open: boolean
  mode: 'create' | 'edit'
  doctorId?: number
  initialValues?: DoctorFormValues
  onClose: () => void
  onSuccess: (doctor: Doctor) => void
}

export function DoctorFormModal({
  open,
  mode,
  doctorId,
  initialValues = emptyDoctorForm,
  onClose,
  onSuccess,
}: DoctorFormModalProps) {
  const [form, setForm] = useState<DoctorFormValues>(initialValues)
  const [submitting, setSubmitting] = useState(false)
  const [generalError, setGeneralError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      setForm(initialValues)
      setGeneralError('')
      setFieldErrors({})
    }
  }, [open, initialValues])

  if (!open) return null

  function toggleLanguage(lang: string) {
    setForm((f) => ({
      ...f,
      languages: f.languages.includes(lang)
        ? f.languages.filter((l) => l !== lang)
        : [...f.languages, lang],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setGeneralError('')
    setFieldErrors({})

    try {
      const payload = formToPayload(form)
      const result =
        mode === 'edit' && doctorId != null
          ? await updateDoctor(doctorId, payload)
          : await createDoctor(payload)
      onSuccess(result)
      onClose()
    } catch (err) {
      if (err instanceof AdminApiError) {
        setGeneralError(err.message)
        setFieldErrors(err.fieldErrors)
      } else {
        setGeneralError(err instanceof Error ? err.message : 'Failed to save doctor.')
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
        className="w-full max-w-lg rounded-2xl bg-white overflow-hidden my-auto"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}
      >
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {mode === 'edit' ? 'Edit Doctor' : 'Onboard New Doctor'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {mode === 'edit'
                ? 'Update doctor profile and credentials.'
                : 'An invitation email will be sent immediately.'}
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

        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {generalError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1 — Identity */}
            <div>
              <SectionTitle>Identity</SectionTitle>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title</label>
                  <input
                    type="text"
                    placeholder="Dr."
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    className={inputCls}
                  />
                  <FieldError message={fieldErrors.title} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Anna Müller"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className={inputCls}
                  />
                  <FieldError message={fieldErrors.name} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="doctor@praxis.de"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className={inputCls}
                    disabled={mode === 'edit'}
                  />
                  <FieldError message={fieldErrors.email} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone</label>
                  <input
                    type="tel"
                    placeholder="+49 123 456789"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className={inputCls}
                  />
                  <FieldError message={fieldErrors.phone} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Profile Picture URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://…"
                    value={form.profilePictureUrl}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, profilePictureUrl: e.target.value }))
                    }
                    className={inputCls}
                  />
                  <FieldError message={fieldErrors.profilePictureUrl} />
                </div>
              </div>
            </div>

            {/* Section 2 — Credentials */}
            <div>
              <SectionTitle>Credentials</SectionTitle>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    License Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="A-123456"
                    value={form.licenseNumber}
                    onChange={(e) => setForm((f) => ({ ...f, licenseNumber: e.target.value }))}
                    className={inputCls}
                  />
                  <FieldError message={fieldErrors.licenseNumber} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">BSNR</label>
                  <input
                    type="text"
                    placeholder="BSNR number"
                    value={form.bsnrNumber}
                    onChange={(e) => setForm((f) => ({ ...f, bsnrNumber: e.target.value }))}
                    className={inputCls}
                  />
                  <FieldError message={fieldErrors.bsnrNumber} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">LANR</label>
                  <input
                    type="text"
                    placeholder="LANR number"
                    value={form.lanrNumber}
                    onChange={(e) => setForm((f) => ({ ...f, lanrNumber: e.target.value }))}
                    className={inputCls}
                  />
                  <FieldError message={fieldErrors.lanrNumber} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Medical Chamber
                  </label>
                  <input
                    type="text"
                    placeholder="Ärztekammer"
                    value={form.medicalChamber}
                    onChange={(e) => setForm((f) => ({ ...f, medicalChamber: e.target.value }))}
                    className={inputCls}
                  />
                  <FieldError message={fieldErrors.medicalChamber} />
                </div>
              </div>
            </div>

            {/* Section 3 — Practice profile */}
            <div>
              <SectionTitle>Practice Profile</SectionTitle>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Specialty
                  </label>
                  <input
                    type="text"
                    placeholder="Allgemeinmedizin"
                    value={form.specialty}
                    onChange={(e) => setForm((f) => ({ ...f, specialty: e.target.value }))}
                    className={inputCls}
                  />
                  <FieldError message={fieldErrors.specialty} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="10"
                    value={form.yearsOfExperience}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, yearsOfExperience: e.target.value }))
                    }
                    className={inputCls}
                  />
                  <FieldError message={fieldErrors.yearsOfExperience} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Languages
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                          form.languages.includes(lang)
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                            : 'bg-gray-100 text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                  <FieldError message={fieldErrors.languages} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Consultation Fee
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      €
                    </span>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="49.00"
                      value={form.consultationFee}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, consultationFee: e.target.value }))
                      }
                      className={`${inputCls} pl-8`}
                    />
                  </div>
                  <FieldError message={fieldErrors.consultationFee} />
                </div>
                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Available for Cannabis</p>
                    <p className="text-xs text-gray-500">Can prescribe medical cannabis</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.availableForCannabis}
                    onClick={() =>
                      setForm((f) => ({ ...f, availableForCannabis: !f.availableForCannabis }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      form.availableForCannabis ? 'bg-[#10b981]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        form.availableForCannabis ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bio</label>
                  <textarea
                    rows={4}
                    maxLength={1000}
                    placeholder="Short professional bio…"
                    value={form.bio}
                    onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                    className={`${inputCls} resize-none`}
                  />
                  <p className="mt-1 text-xs text-gray-400 text-right">{form.bio.length}/1000</p>
                  <FieldError message={fieldErrors.bio} />
                </div>
              </div>
            </div>

            {/* Section 4 — Status */}
            <div>
              <SectionTitle>Status</SectionTitle>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Onboarding Status
                </label>
                <select
                  value={form.onboardingStatus}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      onboardingStatus: e.target.value as DoctorOnboardingStatus,
                    }))
                  }
                  className={inputCls}
                >
                  {ONBOARDING_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <FieldError message={fieldErrors.onboardingStatus} />
              </div>
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
                {submitting
                  ? 'Saving…'
                  : mode === 'edit'
                    ? 'Save Changes'
                    : 'Onboard doctor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export function onboardingStatusPillClasses(status: DoctorOnboardingStatus | undefined) {
  switch (status) {
    case 'INVITED':
      return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
    case 'DOCUMENTS_PENDING':
      return 'bg-orange-50 text-orange-700 ring-1 ring-orange-200'
    case 'VERIFIED':
      return 'bg-sky-50 text-sky-700 ring-1 ring-sky-200'
    case 'ACTIVE':
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
    case 'SUSPENDED':
      return 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
    default:
      return 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
  }
}

export function formatDoctorName(doctor: { title?: string | null; name?: string }) {
  const name = doctor.name ?? '—'
  return doctor.title ? `${doctor.title} ${name}` : name
}

export function LanguageChips({
  languages,
  maxVisible = 3,
}: {
  languages: string[] | undefined
  maxVisible?: number
}) {
  const langs = languages ?? []
  if (langs.length === 0) return <span className="text-gray-400">—</span>

  const visible = langs.slice(0, maxVisible)
  const extra = langs.length - maxVisible

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((lang) => (
        <span
          key={lang}
          className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 ring-1 ring-gray-200"
        >
          {lang}
        </span>
      ))}
      {extra > 0 && (
        <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500 ring-1 ring-gray-200">
          +{extra}
        </span>
      )}
    </div>
  )
}
