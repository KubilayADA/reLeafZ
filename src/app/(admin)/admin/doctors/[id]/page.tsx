'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DM_Sans } from 'next/font/google'
import {
  getAdminDoctor,
  toggleDoctorActive,
  updateDoctor,
  type Doctor,
  type DoctorOnboardingStatus,
} from '@/lib/adminApi'
import {
  DoctorFormModal,
  LanguageChips,
  doctorToFormValues,
  formatDoctorName,
  onboardingStatusPillClasses,
} from '../DoctorFormModal'

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '700'] })

function statusPillClasses(status: string) {
  switch (status) {
    case 'APPROVED':
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
    case 'DECLINED':
    case 'CANCELLED':
      return 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
    case 'PENDING_DOCTOR_APPROVAL':
    case 'PENDING_STRAIN_SELECTION':
      return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
    case 'DELIVERED':
      return 'bg-sky-50 text-sky-700 ring-1 ring-sky-200'
    case 'PAID':
      return 'bg-violet-50 text-violet-700 ring-1 ring-violet-200'
    default:
      return 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
  }
}

function formatCurrency(value: number | null | undefined) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value ?? 0)
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const cardCls = 'rounded-2xl bg-white border border-black/[0.06] p-6'
const cardShadow = { boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }

export default function AdminDoctorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = Number(params.id)

  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toggling, setToggling] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  async function loadDoctor() {
    try {
      const data = await getAdminDoctor(id)
      setDoctor(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load doctor.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadDoctor()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function handleToggleActive() {
    if (!doctor) return
    setToggling(true)
    try {
      const updated = await toggleDoctorActive(id, !doctor.isActive)
      setDoctor(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update.')
    } finally {
      setToggling(false)
    }
  }

  async function handleOnboardingChange(status: DoctorOnboardingStatus) {
    if (!doctor) return
    setUpdatingStatus(true)
    try {
      const updated = await updateDoctor(id, { onboardingStatus: status })
      setDoctor(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update onboarding status.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  if (loading) {
    return (
      <div className={dmSans.className}>
        <div className="h-8 w-48 bg-gray-200 rounded-xl animate-pulse mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error && !doctor) {
    return (
      <div className={dmSans.className}>
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    )
  }

  if (!doctor) return null

  const treatmentRequests = doctor.treatmentRequests ?? []

  return (
    <div className={dmSans.className}>
      {doctor && (
        <DoctorFormModal
          key={`edit-${doctor.id}-${showEditModal}`}
          open={showEditModal}
          mode="edit"
          doctorId={doctor.id}
          initialValues={doctorToFormValues(doctor)}
          onClose={() => setShowEditModal(false)}
          onSuccess={(updated: Doctor) => {
            setDoctor(updated)
            setShowEditModal(false)
          }}
        />
      )}

      {/* Top header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors self-start"
        >
          ←
        </button>
        <div className="flex items-center gap-4 flex-1">
          {doctor.profilePictureUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={doctor.profilePictureUrl}
              alt={doctor.name}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-emerald-100"
            />
          ) : (
            <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-lg ring-2 ring-emerald-100">
              {getInitials(doctor.name)}
            </div>
          )}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[28px] font-bold tracking-tight text-gray-900">
                {formatDoctorName(doctor)}
              </h1>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${onboardingStatusPillClasses(doctor.onboardingStatus)}`}
              >
                {(doctor.onboardingStatus ?? '—').replace(/_/g, ' ')}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowEditModal(true)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Edit
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Three-column cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Card A — Identity */}
        <div className={cardCls} style={cardShadow}>
          <h2 className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-4">
            Identity
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Email', value: doctor.email ?? '—' },
              { label: 'Phone', value: doctor.phone ?? '—' },
              {
                label: 'Languages',
                value: <LanguageChips languages={doctor.languages} maxVisible={5} />,
              },
              {
                label: 'Experience',
                value:
                  doctor.yearsOfExperience != null
                    ? `${doctor.yearsOfExperience} years`
                    : '—',
              },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-start gap-3 text-sm">
                <span className="text-gray-400 shrink-0">{row.label}</span>
                <span className="font-medium text-gray-800 text-right">
                  {typeof row.value === 'string' ? row.value : row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card B — Credentials */}
        <div className={cardCls} style={cardShadow}>
          <h2 className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-4">
            Credentials
          </h2>
          <div className="space-y-2.5">
            {[
              { label: 'License No', value: doctor.licenseNumber ?? '—' },
              { label: 'LANR', value: doctor.lanrNumber ?? '—' },
              { label: 'BSNR', value: doctor.bsnrNumber ?? '—' },
              { label: 'Medical Chamber', value: doctor.medicalChamber ?? '—' },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center text-sm">
                <span className="text-gray-400">{row.label}</span>
                <span className="font-medium text-gray-800 font-mono text-xs">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card C — Practice */}
        <div className={cardCls} style={cardShadow}>
          <h2 className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-4">
            Practice
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Consultation Fee</span>
              <span className="font-medium text-gray-800">
                {formatCurrency(doctor.consultationFee)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Cannabis</span>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  doctor.availableForCannabis
                    ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                    : 'bg-gray-100 text-gray-500 ring-1 ring-gray-200'
                }`}
              >
                {doctor.availableForCannabis ? 'Available' : 'Not available'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm gap-3">
              <span className="text-gray-400 shrink-0">Onboarding</span>
              <select
                value={doctor.onboardingStatus ?? 'INVITED'}
                disabled={updatingStatus}
                onChange={(e) =>
                  handleOnboardingChange(e.target.value as DoctorOnboardingStatus)
                }
                className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-800 outline-none focus:border-emerald-500 disabled:opacity-50"
              >
                {(
                  [
                    'INVITED',
                    'DOCUMENTS_PENDING',
                    'VERIFIED',
                    'ACTIVE',
                    'SUSPENDED',
                  ] as DoctorOnboardingStatus[]
                ).map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Specialty</span>
              <span className="font-medium text-gray-800">{doctor.specialty ?? '—'}</span>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={handleToggleActive}
                disabled={toggling}
                className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50 ${
                  doctor.isActive
                    ? 'bg-rose-500 hover:bg-rose-600'
                    : 'bg-[#10b981] hover:bg-emerald-600'
                }`}
              >
                {toggling
                  ? 'Updating…'
                  : doctor.isActive
                    ? 'Deactivate Doctor'
                    : 'Activate Doctor'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bio panel */}
      {doctor.bio && (
        <div className={`${cardCls} mb-6`} style={cardShadow}>
          <h2 className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-3">
            Bio
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{doctor.bio}</p>
        </div>
      )}

      {/* Recent prescriptions / treatment requests */}
      {treatmentRequests.length > 0 ? (
        <div
          className="rounded-2xl bg-white border border-black/[0.06] overflow-hidden"
          style={cardShadow}
        >
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">
              Recent Prescriptions ({treatmentRequests.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  {['ID', 'Patient', 'Pharmacy', 'Status', 'Date'].map((h) => (
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
                    <td className="px-5 py-3.5 font-medium text-gray-800">
                      {r.patient?.fullName ?? '—'}
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{r.pharmacy?.name ?? '—'}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusPillClasses(r.status)}`}
                      >
                        {r.status.replace(/_/g, ' ')}
                      </span>
                    </td>
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
          <p className="text-sm text-gray-400">No prescriptions yet</p>
        </div>
      )}
    </div>
  )
}
