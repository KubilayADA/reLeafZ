'use client'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  Eye, EyeOff, Lock, Mail, User, Clock, CheckCircle, XCircle, Package, LogOut,
  Phone, AlertCircle, MapPin, Search, Menu, Bell, Settings, ChevronDown, X,
  FileText, Users, Inbox, Loader2, AlertTriangle, Stethoscope, RefreshCw, UserCircle2,
} from 'lucide-react'
import {
  API_BASE, fetchDoctorMe, updateDoctorProfile, DoctorProfileError,
  type Doctor, type DoctorEditableFields,
} from '@/lib/api'

// ── design tokens — premium light-mode SaaS surface ──
const G = {
  // Surfaces
  appBg: 'bg-[#fbfdfb]',
  panelBg: 'bg-white',
  sidebarBg: 'bg-white border-r border-stone-200/70',
  card: 'bg-white border border-stone-200/70 rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.04)]',
  cardElevated: 'bg-white border border-stone-200/70 rounded-2xl shadow-[0_2px_4px_rgba(15,23,42,0.06),0_12px_28px_rgba(15,23,42,0.08)]',
  cardHover: 'hover:border-stone-300/80 hover:shadow-[0_4px_8px_rgba(15,23,42,0.06),0_16px_36px_rgba(15,23,42,0.10)] transition-all duration-300',

  // Text
  textPrimary: 'text-stone-900',
  textSecondary: 'text-stone-600',
  textMuted: 'text-stone-500',
  textFaint: 'text-stone-400',

  // Brand
  brandText: 'text-emerald-700',
  brandBg: 'bg-emerald-600',
  brandBgSoft: 'bg-emerald-50',
  brandBorder: 'border-emerald-200',
  brandAccent: 'text-emerald-600',

  // Inputs
  input: 'bg-white border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all',
  label: 'block text-[11px] font-semibold text-stone-500 uppercase tracking-[0.08em] mb-2',
  sectionTitle: 'text-[11px] font-semibold text-stone-400 uppercase tracking-[0.18em] mb-4',
  th: 'px-5 py-3 text-[11px] font-semibold text-stone-500 uppercase tracking-[0.06em]',
  td: 'px-5 py-3.5 text-sm text-stone-700',

  // Sidebar nav
  navItem: 'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
  navItemActive: 'bg-emerald-50 text-emerald-700 shadow-sm',
  navItemInactive: 'text-stone-600 hover:bg-stone-50 hover:text-stone-900',

  // Tabs (per-view filter pills, not nav)
  tabActive: 'bg-stone-900 text-white shadow-sm',
  tabInactive: 'text-stone-600 border border-stone-200 hover:bg-stone-50 hover:border-stone-300',

  // Buttons
  btn: 'text-sm font-semibold rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed',
  btnPrimary: 'bg-stone-900 hover:bg-stone-800 text-white shadow-sm hover:shadow-md',
  btnSecondary: 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-stone-400',
  btnDanger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm',
  btnSuccess: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm',

  // Shared focus ring for interactive elements
  focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
} as const

const SEVERITY_LABELS: Record<string, string> = {
  'sehr-leicht': 'Sehr leicht', 'leicht': 'Leicht', 'mittel': 'Mittel', 'stark': 'Stark', 'sehr-stark': 'Sehr stark',
}
const SEVERITY_TONE: Record<string, string> = {
  'sehr-leicht': 'bg-stone-100 text-stone-600 ring-1 ring-stone-200',
  'leicht': 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  'mittel': 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  'stark': 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  'sehr-stark': 'bg-rose-50 text-rose-700 ring-1 ring-rose-200',
}
const TREATMENT_LOCATION_LABELS: Record<string, string> = {
  Hausarzt: 'Hausarzt', Facharzt: 'Facharzt', Klinik: 'Klinik', Notaufnahme: 'Notaufnahme', Sonstiges: 'Sonstiges',
}
const NON_MEDICAL_THERAPY_LABELS: Record<string, string> = {
  Physiotherapie: 'Physiotherapie', Psychotherapie: 'Psychotherapie', Akupunktur: 'Akupunktur',
  Yoga: 'Yoga / Meditation', Ernaehrungsberatung: 'Ernährungsberatung', Keine: 'Keine',
}
const PRE_EXISTING_CONDITION_LABELS: Record<string, string> = {
  HerzKreislauf: 'Herz-Kreislauf-Erkrankungen', Atemwegserkrankungen: 'Atemwegserkrankungen',
  Lebererkrankungen: 'Lebererkrankungen', Nierenerkrankungen: 'Nierenerkrankungen',
  Persoenlichkeitsstoerung: 'Persönlichkeitsstörung', Psychose: 'Psychose / Schizophrenie',
  Abhaengigkeit: 'Suchterkrankung', Keine: 'Keine',
}
const TREATMENT_EXPECTATION_LABELS: Record<string, string> = {
  Schmerzlinderung: 'Schmerzlinderung', Schlafverbesserung: 'Schlafverbesserung', Angstreduktion: 'Angstreduktion',
  Lebensqualitaet: 'Lebensqualität', Arbeitsfaehigkeit: 'Arbeitsfähigkeit', Appetit: 'Appetitanregung', Sonstiges: 'Sonstiges',
}

const yesNo = (value: boolean | null | undefined): string => {
  if (value === true) return 'Ja'
  if (value === false) return 'Nein'
  return '—'
}
const mapArray = (values: string[] | null | undefined, labels: Record<string, string>): string => {
  if (!values || values.length === 0) return 'Keine angegeben'
  return values.map((v) => labels[v] ?? v).join(', ')
}
const orDash = (value: string | null | undefined): string => {
  if (!value || value.trim() === '') return '—'
  return value
}
const labelFor = (value: string | null | undefined, labels: Record<string, string>): string => {
  if (!value) return '—'
  return labels[value] ?? value
}

interface SelectedProduct { productId: number; productName: string; quantity: number; price?: number }

interface TreatmentRequest {
  id: number; fullName: string; email: string; phone: string; city: string; symptoms: string
  severity?: string | null; diagnosisText?: string | null; hasSeenDoctor?: boolean | null
  treatmentLocations?: string[] | null; hasTakenMedication?: boolean | null; medicationDetails?: string | null
  nonMedicalTherapies?: string[] | null; isPregnantOrBreastfeeding?: boolean | null
  exceededMonthlyLimit?: boolean | null; preExistingConditions?: string[] | null
  previousCannabisExperience?: boolean | null; hadSideEffects?: boolean | null
  treatmentExpectations?: string[] | null; status: string; createdAt?: string; updatedAt?: string
  selectedProducts?: SelectedProduct[]; totalPrice?: number
  age?: number; pharmacyName?: string; pharmacyCity?: string; address?: string
}

type ViewType = 'inbox' | 'patients' | 'profile' | 'settings'
const VIEW_TITLES: Record<ViewType, string> = {
  inbox: 'Anfragen', patients: 'Patientenliste', profile: 'Profil', settings: 'Einstellungen',
}

type RequestBucket = 'pending' | 'approved' | 'declined'
type RequestWithBucket = TreatmentRequest & { _bucket: RequestBucket }
type StatusFilter = 'pending' | 'approved' | 'declined' | 'all'

// TODO: Keep in sync with questionnaire/step6 disqualifying logic
const DISQUALIFYING_CONDITION_KEYS = [
  'Psychose', 'Persoenlichkeitsstoerung', 'THCAllergie', 'Sucht', 'Abhaengigkeit',
  'Herzkrankheit', 'HerzKreislauf', 'LeberNierenkrankheit', 'Lebererkrankungen',
] as const
const DISQUALIFYING_EXTRA_LABELS: Record<string, string> = {
  THCAllergie: 'THC-Allergie', Sucht: 'Suchterkrankung', Herzkrankheit: 'Schwere Herzerkrankung',
  LeberNierenkrankheit: 'Schwere Leber- oder Nierenerkrankung',
}
const DECLINE_REASONS = [
  { value: 'contraindication', label: 'Medizinische Kontraindikation' },
  { value: 'incomplete', label: 'Unvollständige Angaben' },
  { value: 'not_suitable', label: 'Nicht geeignet für Cannabis-Therapie' },
  { value: 'other', label: 'Sonstiges' },
] as const

type InboxTimeFilter = 'all' | 'today' | 'week' | 'older'

type DoctorFormFields = {
  bio: string | null
  phone: string | null
  specialty: string | null
  workingHours: string | null
  pictureUrl: string | null
  signatureUrl: string | null
}

function formatEUR(amount: number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount)
}
function formatDate(dateString?: string) {
  if (!dateString) return '—'
  try {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    })
  } catch { return dateString }
}
function formatRelativeTime(dateString?: string) {
  if (!dateString) return '—'
  try {
    const diffMin = Math.floor((Date.now() - new Date(dateString).getTime()) / 60000)
    if (diffMin < 1) return 'Gerade eben'
    if (diffMin < 60) return `vor ${diffMin} Min.`
    const diffH = Math.floor(diffMin / 60)
    if (diffH < 24) return `vor ${diffH} Std.`
    const diffD = Math.floor(diffH / 24)
    if (diffD === 1) return 'Gestern'
    if (diffD < 7) return `vor ${diffD} Tagen`
    return formatDate(dateString)
  } catch { return dateString }
}
function buildPatientKey(req: { email?: string | null; fullName?: string; phone?: string | null }): string {
  if (req.email?.trim()) return `email:${req.email.trim().toLowerCase()}`
  return `np:${(req.fullName ?? '').trim().toLowerCase()}|${(req.phone ?? '').trim()}`
}
// ── Doctor-relevant status sets ──
//
// A doctor's view of a request only exists from the moment the patient
// has paid the prescription fee. Before that the request is the patient's
// and the marketplace's concern (PENDING_STRAIN_SELECTION, PENDING_PAYMENT,
// DISQUALIFIED). After the doctor decides, the request enters the pharmacy
// pipeline (PAID → PROCESSING → PREPARING → READY → DISPATCHED → DELIVERED
// for delivery, or → PICKED_UP for pickup, → FULFILLED as terminal).
//
// These sets keep the StatusPill, bucket classifier, and patient aggregation
// counts in lockstep with the backend doctor route filters.

const PENDING_DOCTOR_STATUSES = new Set([
  'PENDING_DOCTOR_APPROVAL',
])

const APPROVED_STATUSES = new Set([
  'APPROVED',
  'APPROVE',
  'PAID',
  'PROCESSING',
  'PREPARING',
  'READY',
  'PICKED_UP',
  'DISPATCHED',
  'DELIVERED',
  'FULFILLED',
])

const DECLINED_STATUSES = new Set([
  'DECLINED',
  'DECLINE',
  'CANCELLED',
])

// Pre-doctor states the doctor must never see. Defensive: backend already
// filters via /api/doctor/requests (status=PENDING_DOCTOR_APPROVAL) and
// /api/doctor/past-requests (status in approved/declined set), but the
// frontend should still discard these if they ever leak.
const PRE_DOCTOR_STATUSES = new Set([
  'PENDING_STRAIN_SELECTION',
  'PENDING_PAYMENT',
  'DISQUALIFIED',
])

function isPendingDoctorStatus(status: string) {
  return PENDING_DOCTOR_STATUSES.has(status.toUpperCase())
}

function isApprovedStatus(status: string) {
  return APPROVED_STATUSES.has(status.toUpperCase())
}

function isDeclinedStatus(status: string) {
  return DECLINED_STATUSES.has(status.toUpperCase())
}

function isDoctorRelevantStatus(status: string) {
  const s = status.toUpperCase()
  return !PRE_DOCTOR_STATUSES.has(s)
}

function resolveRequestBucket(req: TreatmentRequest, fromPending: boolean): RequestBucket {
  if (fromPending) return 'pending'
  if (isDeclinedStatus(req.status)) return 'declined'
  if (isApprovedStatus(req.status)) return 'approved'
  // If a request slips through that isn't approved or declined,
  // surface it as 'pending' — this should not happen given the
  // isDoctorRelevantStatus filter above, but it's a safe default.
  return 'pending'
}
function BucketStatusPill({ bucket }: { bucket: RequestBucket }) {
  if (bucket === 'approved') {
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"><CheckCircle size={12} /> Genehmigt</span>
  }
  if (bucket === 'declined') {
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-rose-50 text-rose-700 ring-1 ring-rose-200"><XCircle size={12} /> Abgelehnt</span>
  }
  return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200"><Clock size={12} /> Wartend</span>
}
function LockedField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className={`${G.label} flex items-center gap-1`}>
        <Lock size={11} className="text-amber-500" />
        {label}
      </p>
      <p className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 break-all leading-relaxed">
        {value || '—'}
      </p>
    </div>
  )
}
function makeDoctorFormInitial(doctor: Doctor): DoctorFormFields {
  return {
    bio: doctor.bio,
    phone: doctor.phone,
    specialty: doctor.specialty,
    workingHours: doctor.workingHours,
    pictureUrl: doctor.pictureUrl,
    signatureUrl: doctor.signatureUrl,
  }
}
function emptyToNull(value: string | null): string | null {
  if (value === null || value.trim() === '') return null
  return value
}
function getDisqualifications(req: TreatmentRequest): string[] {
  const reasons: string[] = []
  if (req.isPregnantOrBreastfeeding === true) reasons.push('Schwangerschaft oder Stillzeit')
  if (req.exceededMonthlyLimit === true) reasons.push('Überschreitung des monatlichen Höchstkonsums')
  for (const key of DISQUALIFYING_CONDITION_KEYS) {
    if ((req.preExistingConditions ?? []).includes(key)) {
      reasons.push(DISQUALIFYING_EXTRA_LABELS[key] ?? PRE_EXISTING_CONDITION_LABELS[key] ?? key)
    }
  }
  return reasons
}

function SeverityPill({ severity }: { severity?: string | null }) {
  if (!severity) return null
  const tone = SEVERITY_TONE[severity] ?? 'bg-stone-100 text-stone-600 ring-1 ring-stone-200'
  return <span className={`inline-flex px-2.5 py-1 text-[11px] font-semibold rounded-full ${tone}`}>{labelFor(severity, SEVERITY_LABELS)}</span>
}
function StatusPill({ status }: { status: string }) {
  if (isApprovedStatus(status)) return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"><CheckCircle size={12} /> Genehmigt</span>
  if (isDeclinedStatus(status)) return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-rose-50 text-rose-700 ring-1 ring-rose-200"><XCircle size={12} /> Abgelehnt</span>
  return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200"><Clock size={12} /> Ausstehend</span>
}
function EmptyState({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center mb-5"><Icon className="w-7 h-7 text-stone-300" /></div>
      <h3 className="text-base font-semibold text-stone-800 mb-2">{title}</h3>
      {description && <p className="text-sm text-stone-500 text-center max-w-sm">{description}</p>}
    </div>
  )
}
function PreviewBanner({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl border border-amber-200 bg-amber-50 mb-6">
      <AlertTriangle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" /><p className="text-sm text-amber-800">{text}</p>
    </div>
  )
}

function SymptomatikSection({ req }: { req: TreatmentRequest }) {
  const row = (l: string, v: string) => (
    <div key={l} className="flex justify-between gap-4 text-sm"><span className={G.textMuted}>{l}</span><span className="text-right">{v}</span></div>
  )
  return (
    <div className="space-y-5">
      <div><p className={G.sectionTitle}>Hauptbeschwerde</p><div className={`${G.card} p-4 space-y-2`}>
        {row('Schweregrad', labelFor(req.severity, SEVERITY_LABELS))}
        {row('Diagnose / ICD', orDash(req.diagnosisText))}
      </div></div>
      <div><p className={G.sectionTitle}>Bisherige Behandlung</p><div className={`${G.card} p-4 space-y-2`}>
        {row('Arztbesuch', yesNo(req.hasSeenDoctor))}
        {row('Behandelnde Stellen', mapArray(req.treatmentLocations, TREATMENT_LOCATION_LABELS))}
        {row('Medikamente', yesNo(req.hasTakenMedication))}
        {row('Medikamentendetails', orDash(req.medicationDetails))}
        {row('Nicht-med. Therapien', mapArray(req.nonMedicalTherapies, NON_MEDICAL_THERAPY_LABELS))}
      </div></div>
      <div><p className={G.sectionTitle}>Ausschlusskriterien</p><div className={`${G.card} p-4 space-y-2`}>
        {row('Schwanger / Stillend', yesNo(req.isPregnantOrBreastfeeding))}
        {row('Monatslimit', yesNo(req.exceededMonthlyLimit))}
        {row('Vorerkrankungen', mapArray(req.preExistingConditions, PRE_EXISTING_CONDITION_LABELS))}
      </div></div>
      <div><p className={G.sectionTitle}>Cannabis-Erfahrung</p><div className={`${G.card} p-4 space-y-2`}>
        {row('Vorerfahrung', yesNo(req.previousCannabisExperience))}
        {row('Nebenwirkungen', yesNo(req.hadSideEffects))}
        {row('Erwartungen', mapArray(req.treatmentExpectations, TREATMENT_EXPECTATION_LABELS))}
      </div></div>
    </div>
  )
}

type NavItem = { key: ViewType; label: string; icon: React.ElementType; badge?: number }
type NavGroup = { title: string; items: NavItem[] }

type SidebarProps = {
  activeView: ViewType; onViewChange: (v: ViewType) => void; doctorEmail: string
  pendingCount: number; onLogout: () => void; mobileOpen: boolean; onMobileClose: () => void
}

function Sidebar({ activeView, onViewChange, doctorEmail, pendingCount, onLogout, mobileOpen, onMobileClose }: SidebarProps) {
  const groups: NavGroup[] = [
    { title: 'Posteingang', items: [
      { key: 'inbox', label: 'Anfragen', icon: Inbox, badge: pendingCount },
    ]},
    { title: 'Patienten', items: [{ key: 'patients', label: 'Patientenliste', icon: Users }] },
    { title: 'Arzt-Profil', items: [
      { key: 'profile', label: 'Profil', icon: User },
      { key: 'settings', label: 'Einstellungen', icon: Settings },
    ]},
  ]
  const handleNav = (v: ViewType) => { onViewChange(v); onMobileClose() }
  const content = (
    <div className="flex h-full flex-col">
      <div className="px-5 py-6">
        <img src="/logo1.png" alt="reLeafZ" className="h-8 w-auto" />
        <p className="mt-2 text-[11px] font-semibold text-stone-500 uppercase tracking-widest">Arzt</p>
      </div>
      <div className="mx-3 mt-2 mb-4 p-3 rounded-xl bg-stone-50 border border-stone-200">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center flex-shrink-0">
            <Stethoscope size={15} className="text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-stone-900 truncate">Arzt-Dashboard</p>
            <p className="text-[11px] text-stone-500 truncate">{doctorEmail || '—'}</p>
          </div>
        </div>
      </div>
      <nav className="px-3 space-y-5 flex-1 overflow-y-auto">
        {groups.map(group => (
          <div key={group.title}>
            <p className={`${G.sectionTitle} px-2 !mb-2`}>{group.title}</p>
            <div className="space-y-1">
              {group.items.map(item => {
                const active = activeView === item.key
                const Icon = item.icon
                return (
                  <button key={item.key} onClick={() => handleNav(item.key)} className={`${G.navItem} ${active ? G.navItemActive : G.navItemInactive} ${G.focus} w-full text-left`}>
                    <Icon size={16} className={active ? 'text-emerald-700' : 'text-stone-500'} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge != null && item.badge > 0 && (
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md tabular-nums ${active ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-100 text-amber-700'}`}>{item.badge}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
      <div className="mt-auto px-3 py-4 border-t border-stone-200">
        <button onClick={onLogout} className={`${G.btn} ${G.btnSecondary} ${G.focus} w-full flex items-center justify-center gap-2 px-4 py-2.5`}><LogOut size={15} /> Abmelden</button>
        <p className="mt-3 text-center text-[10px] text-stone-400 tracking-wide">reLeafZ Arzt-Portal · v1.0</p>
      </div>
    </div>
  )
  return (
    <>
      <aside className={`hidden lg:flex flex-col w-[248px] lg:w-[260px] flex-shrink-0 ${G.sidebarBg} lg:sticky lg:top-0 lg:h-screen`}>{content}</aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onMobileClose} aria-hidden="true" />
          <aside className={`absolute left-0 top-0 h-full w-[280px] ${G.sidebarBg} shadow-2xl`}>
            <button onClick={onMobileClose} aria-label="Menü schließen" className={`absolute right-3 top-5 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 ${G.focus}`}><X size={18} /></button>
            {content}
          </aside>
        </div>
      )}
    </>
  )
}

type BellNotification = { id: number; patientName: string; createdAt: string; unread: boolean }
type TopBarProps = {
  activeView: ViewType; doctorEmail: string; onMobileMenuToggle: () => void; onNavigate: (v: ViewType) => void
  onLogout: () => void; onRefresh: () => void; bellOpen: boolean; bellContainerRef: React.RefObject<HTMLDivElement | null>
  unreadCount: number; notifications: BellNotification[]; onBellOpen: () => void; onBellClose: () => void
  onNotificationClick: (id: number) => void
}

function TopBar({ activeView, doctorEmail, onMobileMenuToggle, onNavigate, onLogout, onRefresh, bellOpen, bellContainerRef, unreadCount, notifications, onBellOpen, onBellClose, onNotificationClick }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const initial = (doctorEmail.trim()[0] ?? 'A').toUpperCase()
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="flex items-center justify-between gap-4 px-6 lg:px-10 h-16">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onMobileMenuToggle} aria-label="Menü öffnen" className={`lg:hidden p-2 -ml-2 rounded-xl text-stone-600 hover:bg-stone-100 ${G.focus}`}><Menu size={20} /></button>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-stone-900 leading-tight truncate">{VIEW_TITLES[activeView]}</h1>
            <p className="text-[11px] text-stone-500 truncate">Arzt / {VIEW_TITLES[activeView]}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onRefresh} aria-label="Aktualisieren" className={`p-2 rounded-xl text-stone-500 hover:text-emerald-700 hover:bg-stone-100 ${G.focus}`}><RefreshCw size={17} /></button>
          <div className="relative" ref={bellContainerRef}>
            <button aria-label="Benachrichtigungen" onClick={bellOpen ? onBellClose : onBellOpen} className={`relative p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 ${G.focus}`}>
              <Bell size={17} />
              {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">{unreadCount > 9 ? '9+' : unreadCount}</span>}
            </button>
            {bellOpen && (
              <div className={`absolute right-0 top-12 w-[360px] ${G.cardElevated} z-50 overflow-hidden`}>
                <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between">
                  <p className="text-sm font-semibold text-stone-900">Benachrichtigungen</p>
                  {unreadCount > 0 && <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">{unreadCount} neu</span>}
                </div>
                <div className="max-h-[420px] overflow-y-auto">
                  {notifications.length === 0 ? <div className="px-4 py-8 text-center text-sm text-stone-400">Keine offenen Anfragen.</div> : notifications.map(n => (
                    <button key={n.id} onClick={() => onNotificationClick(n.id)} className={`w-full text-left px-4 py-3 border-b border-stone-100 hover:bg-stone-50 flex items-start gap-3 ${n.unread ? 'bg-emerald-50/40' : ''}`}>
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${n.unread ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-900 truncate">Anfrage — {n.patientName}</p>
                        <p className="mt-1 text-[11px] text-stone-400">{formatRelativeTime(n.createdAt)}</p>
                      </div>
                    </button>
                  ))}
                </div>
                {notifications.length > 0 && (
                  <button onClick={() => { onBellClose(); onNavigate('inbox') }} className="w-full px-4 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-stone-50 border-t border-stone-200">Alle Anfragen anzeigen</button>
                )}
              </div>
            )}
          </div>
          <div className="relative">
            <button onClick={() => setMenuOpen(o => !o)} aria-label="Konto-Menü" className={`flex items-center gap-1.5 rounded-full pl-0.5 pr-1.5 py-0.5 hover:bg-stone-100 ${G.focus}`}>
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold flex items-center justify-center">{initial}</span>
              <ChevronDown size={15} className="text-stone-500" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} aria-hidden="true" />
                <div className="absolute right-0 mt-2 w-60 z-50 rounded-2xl bg-white border border-stone-200 shadow-[0_8px_30px_rgba(15,23,42,0.12)] overflow-hidden">
                  <div className="px-4 py-3 border-b border-stone-100">
                    <p className="text-sm font-semibold text-stone-900 truncate">Arzt-Dashboard</p>
                    <p className="text-xs text-stone-500 truncate">{doctorEmail || '—'}</p>
                  </div>
                  <button onClick={() => { setMenuOpen(false); onNavigate('profile') }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50"><User size={15} className="text-stone-500" /> Profil</button>
                  <div className="border-t border-stone-100" />
                  <button onClick={() => { setMenuOpen(false); onLogout() }} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50"><LogOut size={15} /> Abmelden</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function DisqualificationBanner({ reasons }: { reasons: string[] }) {
  if (reasons.length === 0) return null
  return (
    <div className="flex items-start gap-2.5 bg-rose-50 border-l-4 border-l-rose-500 px-3 py-2 rounded-lg">
      <AlertCircle size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-rose-800">
        <span className="font-semibold">⚠ Mögliche Kontraindikation:</span> {reasons.join(', ')}
      </p>
    </div>
  )
}

function getSymptomPreview(req: TreatmentRequest): string {
  if (req.diagnosisText?.trim()) return req.diagnosisText.trim()
  if (req.symptoms?.trim()) return req.symptoms.trim()
  return 'Keine Symptombeschreibung'
}

function matchesInboxTimeFilter(req: TreatmentRequest, filter: InboxTimeFilter): boolean {
  if (filter === 'all' || !req.createdAt) return filter === 'all'
  const created = new Date(req.createdAt)
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(now.getTime() - 7 * 86400000)
  if (filter === 'today') return created >= startOfToday
  if (filter === 'week') return created >= weekAgo
  if (filter === 'older') return created < weekAgo
  return true
}

type RequestCardProps = {
  req: RequestWithBucket
  onView: (req: TreatmentRequest) => void
  onQuickApprove?: (req: TreatmentRequest) => void
  onPatientClick: (req: TreatmentRequest) => void
}

function RequestCard({ req, onView, onQuickApprove, onPatientClick }: RequestCardProps) {
  const disqualifications = getDisqualifications(req)
  const productCount = req.selectedProducts?.length ?? 0
  const readOnly = req._bucket !== 'pending'
  return (
    <div className={`${G.card} ${G.cardHover} p-5 space-y-4`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <button type="button" onClick={() => onPatientClick(req)} className="text-base font-semibold text-stone-900 hover:text-emerald-700 hover:underline underline-offset-2">{req.fullName}</button>
            <span className="text-xs text-stone-400">{formatRelativeTime(req.createdAt)}</span>
            <SeverityPill severity={req.severity} />
            {req.age != null && <span className="text-xs text-stone-500">{req.age} Jahre</span>}
          </div>
          <p className="text-sm text-stone-600 line-clamp-2">{getSymptomPreview(req)}</p>
        </div>
        <BucketStatusPill bucket={req._bucket} />
      </div>
      {!readOnly && <DisqualificationBanner reasons={disqualifications} />}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-100">
        <div className="text-sm text-stone-500">
          {productCount > 0 ? `${productCount} Produkt${productCount !== 1 ? 'e' : ''}` : 'Keine Produkte'}
          {req.totalPrice != null && req.totalPrice > 0 && <span className="ml-2 font-semibold text-stone-800">{formatEUR(req.totalPrice)}</span>}
        </div>
        <div className="flex gap-2">
          <button onClick={() => onView(req)} className={`px-4 py-2 ${G.btn} ${G.btnSecondary} ${G.focus}`}>Anzeigen</button>
          {!readOnly && (
            <span className="relative group">
              <button
                disabled={disqualifications.length > 0}
                onClick={() => onQuickApprove?.(req)}
                className={`px-4 py-2 ${G.btn} ${disqualifications.length > 0 ? `${G.btnSecondary} opacity-40 cursor-not-allowed` : G.btnPrimary} ${G.focus}`}
              >Schnell genehmigen</button>
              {disqualifications.length > 0 && (
                <span className="pointer-events-none absolute bottom-full right-0 mb-2 w-48 px-2 py-1 text-[10px] text-white bg-stone-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  Bitte zuerst Details prüfen.
                </span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

type RequestDetailModalProps = {
  req: TreatmentRequest | null; onClose: () => void
  onActionComplete: () => void
  initialConfirmMode?: 'none' | 'approve'
}

function RequestDetailModal({ req, onClose, onActionComplete, initialConfirmMode = 'none' }: RequestDetailModalProps) {
  const [confirmMode, setConfirmMode] = useState<'none' | 'approve' | 'decline'>('none')
  const [approveNotes, setApproveNotes] = useState('')
  const [declineReason, setDeclineReason] = useState('')
  const [declineNotes, setDeclineNotes] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    setConfirmMode(initialConfirmMode); setApproveNotes(''); setDeclineReason(''); setDeclineNotes(''); setBanner(null)
  }, [req?.id, initialConfirmMode])

  if (!req) return null
  const disqualifications = getDisqualifications(req)

  const submitAction = async (action: 'approve' | 'decline') => {
    setActionLoading(true); setBanner(null)
    try {
      // TODO: Send approveNotes / declineReason in request body when API supports it
      const res = await fetch(`${API_BASE}/api/doctor/requests/${req.id}/${action}`, { method: 'POST', credentials: 'include' })
      if (res.ok) {
        setBanner({ type: 'success', message: action === 'approve' ? 'Anfrage genehmigt.' : 'Anfrage abgelehnt.' })
        setTimeout(() => { onActionComplete(); onClose() }, 800)
      } else {
        setBanner({ type: 'error', message: 'Aktion fehlgeschlagen. Bitte erneut versuchen.' })
      }
    } catch {
      setBanner({ type: 'error', message: 'Netzwerkfehler. Bitte erneut versuchen.' })
    } finally { setActionLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className={`${G.cardElevated} max-w-3xl w-full max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-stone-900">{req.fullName}</h2>
            <p className="text-xs text-stone-500 mt-0.5">Anfrage #{req.id} · {formatDate(req.createdAt)}</p>
          </div>
          <button onClick={onClose} aria-label="Schließen" className={`p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 ${G.focus}`}><X size={18} /></button>
        </div>
        <div className="p-6 space-y-6 bg-stone-50">
          {banner && (
            <div className={`p-3.5 rounded-xl text-sm flex items-center gap-2 ${banner.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-rose-50 border border-rose-200 text-rose-700'}`}>
              {banner.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}{banner.message}
            </div>
          )}
          <div>
            <p className={G.label}>Patient</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[{ icon: User, l: 'Name', v: req.fullName }, { icon: Mail, l: 'E-Mail', v: req.email }, { icon: Phone, l: 'Telefon', v: req.phone }].map(i => (
                <div key={i.l} className={`flex items-center gap-3 ${G.card} p-3.5`}>
                  <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0"><i.icon size={14} className="text-stone-500" /></div>
                  <div className="min-w-0"><p className="text-[10px] font-medium text-stone-400 uppercase">{i.l}</p><p className="text-sm font-medium text-stone-800 truncate">{i.v}</p></div>
                </div>
              ))}
            </div>
            {(req.city || req.address) && (
              <div className="mt-3 flex items-center gap-2 text-sm text-stone-600"><MapPin size={14} className="text-stone-400" />{orDash(req.address) !== '—' ? req.address : req.city}</div>
            )}
          </div>
          {disqualifications.length > 0 && (
            <div className={`${G.card} p-4 border-l-4 border-l-rose-500`}>
              <p className="text-sm font-semibold text-rose-800 mb-2">Ausschlusskriterien</p>
              <ul className="list-disc list-inside text-sm text-rose-700 space-y-1">{disqualifications.map(r => <li key={r}>{r}</li>)}</ul>
            </div>
          )}
          <div><p className={G.label}>Symptomatik</p><SymptomatikSection req={req} /></div>
          {req.selectedProducts && req.selectedProducts.length > 0 && (
            <div>
              <p className={G.label}>Produkte</p>
              <div className={`${G.card} overflow-hidden`}>
                <table className="w-full"><thead><tr className="bg-stone-50 border-b border-stone-200">
                  <th className={`${G.th} text-left`}>Produkt</th><th className={`${G.th} text-center`}>Menge</th><th className={`${G.th} text-right`}>Preis</th>
                </tr></thead><tbody className="divide-y divide-stone-100">
                  {req.selectedProducts.map((p, i) => (
                    <tr key={i}><td className={G.td}>{p.productName}</td><td className={`${G.td} text-center tabular-nums`}>{p.quantity}</td>
                      <td className={`${G.td} text-right tabular-nums`}>{p.price != null ? formatEUR(p.price * p.quantity) : '—'}</td></tr>
                  ))}
                </tbody>
                {req.totalPrice != null && req.totalPrice > 0 && (
                  <tfoot><tr className="border-t border-stone-200"><td colSpan={2} className={`${G.td} font-bold`}>Gesamt</td><td className={`${G.td} text-right font-bold text-emerald-700 tabular-nums`}>{formatEUR(req.totalPrice)}</td></tr></tfoot>
                )}</table>
              </div>
            </div>
          )}
          {(req.pharmacyName || req.pharmacyCity) && (
            <div>
              <p className={G.label}>Apotheke</p>
              <div className={`${G.card} p-4 flex items-center gap-3`}>
                <Package size={18} className="text-emerald-600" />
                <div><p className="text-sm font-semibold text-stone-900">{orDash(req.pharmacyName)}</p><p className="text-xs text-stone-500">{orDash(req.pharmacyCity)}</p></div>
              </div>
            </div>
          )}
          {confirmMode === 'none' && (
            <div className="flex gap-3 pt-2 border-t border-stone-200">
              <button onClick={() => setConfirmMode('approve')} disabled={disqualifications.length > 0} className={`flex-1 py-2.5 ${G.btn} ${G.btnSuccess} ${G.focus}`}><CheckCircle size={16} className="inline mr-1.5" />Genehmigen</button>
              <button onClick={() => setConfirmMode('decline')} className={`flex-1 py-2.5 ${G.btn} ${G.btnDanger} ${G.focus}`}><XCircle size={16} className="inline mr-1.5" />Ablehnen</button>
            </div>
          )}
          {confirmMode === 'approve' && (
            <div className={`${G.card} p-4 space-y-3 border-l-4 border-l-emerald-500`}>
              <p className="text-sm font-semibold text-stone-900">Genehmigung bestätigen</p>
              <p className="text-xs text-stone-600">Mit der Genehmigung erstellen Sie ein elektronisches Rezept. Diese Aktion ist endgültig.</p>
              <div><label className={G.label}>Notizen (optional)</label>
                <textarea value={approveNotes} onChange={e => setApproveNotes(e.target.value)} rows={3} placeholder="Interne Notizen..." className={`w-full px-3.5 py-2.5 ${G.input} resize-none`} /></div>
              <div className="flex gap-2">
                <button onClick={() => setConfirmMode('none')} className={`flex-1 py-2 ${G.btn} ${G.btnSecondary} ${G.focus}`}>Abbrechen</button>
                <button onClick={() => submitAction('approve')} disabled={actionLoading} className={`flex-1 py-2 ${G.btn} ${G.btnSuccess} ${G.focus} flex items-center justify-center gap-2`}>
                  {actionLoading ? <Loader2 size={16} className="animate-spin" /> : 'Endgültig genehmigen'}
                </button>
              </div>
            </div>
          )}
          {confirmMode === 'decline' && (
            <div className={`${G.card} p-4 space-y-3 border-l-4 border-l-rose-500`}>
              <p className="text-sm font-semibold text-stone-900">Ablehnung bestätigen</p>
              <div><label className={G.label}>Grund *</label>
                <select value={declineReason} onChange={e => setDeclineReason(e.target.value)} className={`w-full px-3.5 py-2.5 ${G.input}`}>
                  <option value="">Bitte wählen...</option>
                  {DECLINE_REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select></div>
              {declineReason === 'other' && (
                <div><label className={G.label}>Begründung</label>
                  <textarea value={declineNotes} onChange={e => setDeclineNotes(e.target.value)} rows={3} className={`w-full px-3.5 py-2.5 ${G.input} resize-none`} /></div>
              )}
              <div className="flex gap-2">
                <button onClick={() => setConfirmMode('none')} className={`flex-1 py-2 ${G.btn} ${G.btnSecondary} ${G.focus}`}>Abbrechen</button>
                <button onClick={() => submitAction('decline')} disabled={actionLoading || !declineReason || (declineReason === 'other' && !declineNotes.trim())} className={`flex-1 py-2 ${G.btn} ${G.btnDanger} ${G.focus} flex items-center justify-center gap-2`}>
                  {actionLoading ? <Loader2 size={16} className="animate-spin" /> : 'Endgültig ablehnen'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

type PatientAggregate = {
  key: string; name: string; email: string; phone: string
  requestCount: number; approvedCount: number; declinedCount: number; lastRequestAt?: string
  requests: TreatmentRequest[]
}

function PatientProfileModal({ aggregate, onClose, onViewRequest }: { aggregate: PatientAggregate | null; onClose: () => void; onViewRequest: (req: TreatmentRequest) => void }) {
  if (!aggregate) return null
  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className={`${G.cardElevated} max-w-3xl w-full max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">{aggregate.name.charAt(0).toUpperCase()}</div>
            <div><h2 className="text-lg font-bold text-stone-900">{aggregate.name}</h2><p className="text-xs text-stone-500">Patientenprofil</p></div>
          </div>
          <button onClick={onClose} aria-label="Schließen" className="p-2 rounded-xl hover:bg-stone-100"><X size={18} className="text-stone-400" /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[{ icon: Mail, l: 'E-Mail', v: aggregate.email }, { icon: Phone, l: 'Telefon', v: aggregate.phone }].map(i => (
              <div key={i.l} className="flex items-center gap-3 bg-stone-50 border border-stone-200 rounded-xl p-3.5">
                <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center"><i.icon size={14} className="text-stone-500" /></div>
                <div><p className="text-[10px] font-semibold text-stone-400 uppercase">{i.l}</p><p className="text-sm font-medium text-stone-700 truncate">{i.v || '—'}</p></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { l: 'Anfragen', v: String(aggregate.requestCount), c: 'text-emerald-700' },
              { l: 'Genehmigt', v: String(aggregate.approvedCount), c: 'text-emerald-700' },
              { l: 'Abgelehnt', v: String(aggregate.declinedCount), c: 'text-rose-700' },
              { l: 'Letzte Anfrage', v: formatDate(aggregate.lastRequestAt), c: 'text-stone-900 text-sm' },
            ].map(s => (
              <div key={s.l} className={`${G.card} p-4`}><p className="text-[10px] font-semibold text-stone-400 uppercase mb-1">{s.l}</p><p className={`text-base font-bold tabular-nums ${s.c}`}>{s.v}</p></div>
            ))}
          </div>
          <div>
            <p className={G.label}>Verlauf</p>
            <div className={`${G.card} overflow-hidden`}>
              <table className="w-full"><thead className="bg-stone-50 border-b border-stone-200"><tr>
                <th className={`${G.th} text-left`}>ID</th><th className={`${G.th} text-left`}>Schweregrad</th>
                <th className={`${G.th} text-left`}>Status</th><th className={`${G.th} text-right`}>Datum</th><th className={`${G.th} text-right`}></th>
              </tr></thead><tbody className="divide-y divide-stone-100">
                {aggregate.requests.map(r => (
                  <tr key={r.id} className="hover:bg-stone-50">
                    <td className={G.td}>#{r.id}</td>
                    <td className={G.td}><SeverityPill severity={r.severity} /></td>
                    <td className={G.td}><StatusPill status={r.status} /></td>
                    <td className={`${G.td} text-right text-stone-500`}>{formatDate(r.createdAt)}</td>
                    <td className={`${G.td} text-right`}><button onClick={() => { onClose(); onViewRequest(r) }} className="text-emerald-700 text-xs font-semibold hover:underline">Anzeigen →</button></td>
                  </tr>
                ))}
              </tbody></table>
            </div>
          </div>
          <p className="text-[11px] text-stone-400 italic">
            Hinweis: Dieses Profil zeigt nur die Anfragen, die Sie für diesen Patienten bearbeitet haben.
            Die vollständige Krankengeschichte liegt beim Hausarzt.
          </p>
        </div>
      </div>
    </div>
  )
}

function DoctorProfileView() {
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [original, setOriginal] = useState<DoctorFormFields | null>(null)
  const [form, setForm] = useState<DoctorFormFields | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof DoctorFormFields, string>>>({})

  const loadProfile = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const data = await fetchDoctorMe()
      const initial = makeDoctorFormInitial(data)
      setDoctor(data)
      setOriginal(initial)
      setForm(initial)
    } catch (e: unknown) {
      setLoadError(e instanceof Error ? e.message : 'Profil konnte nicht geladen werden.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadProfile() }, [loadProfile])

  const isDirty = useMemo(() => {
    if (!form || !original) return false
    return JSON.stringify(form) !== JSON.stringify(original)
  }, [form, original])

  const validate = (): boolean => {
    if (!form) return false
    const errors: Partial<Record<keyof DoctorFormFields, string>> = {}
    if ((form.bio ?? '').length > 2000) errors.bio = 'Maximal 2000 Zeichen'
    if ((form.phone ?? '').length > 40) errors.phone = 'Maximal 40 Zeichen'
    if ((form.specialty ?? '').length > 120) errors.specialty = 'Maximal 120 Zeichen'
    if ((form.workingHours ?? '').length > 4000) errors.workingHours = 'Maximal 4000 Zeichen'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!form || !original || !doctor) return
    if (!validate()) return
    setSaving(true)
    setSaveError(null)
    try {
      const patch: DoctorEditableFields = {}
      if (form.bio !== original.bio) patch.bio = emptyToNull(form.bio)
      if (form.phone !== original.phone) patch.phone = emptyToNull(form.phone)
      if (form.workingHours !== original.workingHours) patch.workingHours = emptyToNull(form.workingHours)
      if (form.specialty !== original.specialty) {
        patch.specialty = (form.specialty ?? '').trim() === ''
          ? original.specialty
          : emptyToNull(form.specialty)
      }
      const updated = await updateDoctorProfile(patch)
      const next = makeDoctorFormInitial(updated)
      setDoctor(updated)
      setOriginal(next)
      setForm(next)
      setFieldErrors({})
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (e: unknown) {
      if (e instanceof DoctorProfileError && e.details?.length) {
        const mapped: Partial<Record<keyof DoctorFormFields, string>> = {}
        for (const detail of e.details) {
          const key = detail.path as keyof DoctorFormFields
          if (key in (form ?? {})) mapped[key] = detail.message
        }
        setFieldErrors(mapped)
      }
      setSaveError(e instanceof Error ? e.message : 'Speichern fehlgeschlagen.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
      </div>
    )
  }

  if (loadError || !doctor || !form || !original) {
    return (
      <div className={`${G.card} p-6 max-w-lg`}>
        <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700 mb-4">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <p>{loadError ?? 'Profil konnte nicht geladen werden.'}</p>
        </div>
        <button onClick={loadProfile} className={`${G.btn} ${G.btnSecondary} ${G.focus} px-4 py-2.5`}>Erneut versuchen</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className={`${G.card} border-l-4 border-l-emerald-500 p-6 space-y-5`}>
          <h3 className="text-sm font-bold text-stone-700 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <User size={14} className="text-emerald-700" />
            </div>
            Bearbeitbare Daten
          </h3>

          <div>
            <p className={G.label}>Profilbild & Signatur</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <div className="w-24 h-24 rounded-xl bg-stone-50 border border-stone-200 overflow-hidden flex items-center justify-center">
                  {form.pictureUrl ? (
                    <img src={form.pictureUrl} alt="Profilbild" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <UserCircle2 size={32} className="text-stone-300" />
                  )}
                </div>
                <button
                  type="button"
                  disabled
                  title="Datei-Upload wird in Kürze freigeschaltet"
                  className={`mt-2 px-3 py-1.5 ${G.btn} ${G.btnSecondary} opacity-40 cursor-not-allowed text-xs`}
                >
                  Upload (in Kürze verfügbar)
                </button>
              </div>
              <div className="flex-1">
                <div className="w-full max-w-[240px] h-20 rounded-xl bg-stone-50 border border-stone-200 overflow-hidden flex items-center justify-center">
                  {form.signatureUrl ? (
                    <img src={form.signatureUrl} alt="Signatur" className="max-h-full max-w-full object-contain" />
                  ) : (
                    <span className="text-xs text-stone-400">Keine Signatur hinterlegt</span>
                  )}
                </div>
                <button
                  type="button"
                  disabled
                  title="Datei-Upload wird in Kürze freigeschaltet"
                  className={`mt-2 px-3 py-1.5 ${G.btn} ${G.btnSecondary} opacity-40 cursor-not-allowed text-xs`}
                >
                  Upload (in Kürze verfügbar)
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className={G.label}>Bio</label>
            <textarea
              rows={4}
              maxLength={2000}
              value={form.bio ?? ''}
              onChange={e => setForm(f => f ? { ...f, bio: e.target.value || null } : f)}
              className={`w-full px-3.5 py-2.5 ${G.input} resize-none ${fieldErrors.bio ? 'border-rose-400' : ''}`}
            />
            <p className="mt-1 text-xs text-stone-400">Erscheint in Ihrem Profil und auf Patientenkommunikation. Maximal 2000 Zeichen.</p>
            <p className="text-xs text-stone-400 tabular-nums">{(form.bio ?? '').length} / 2000</p>
            {fieldErrors.bio && <p className="text-rose-600 text-xs mt-1">{fieldErrors.bio}</p>}
          </div>

          <div>
            <label className={G.label}>Telefon</label>
            <input
              type="tel"
              maxLength={40}
              value={form.phone ?? ''}
              onChange={e => setForm(f => f ? { ...f, phone: e.target.value || null } : f)}
              className={`w-full px-3.5 py-2.5 ${G.input} ${fieldErrors.phone ? 'border-rose-400' : ''}`}
            />
            {fieldErrors.phone && <p className="text-rose-600 text-xs mt-1">{fieldErrors.phone}</p>}
          </div>

          <div>
            <label className={G.label}>Fachrichtung</label>
            <input
              type="text"
              maxLength={120}
              placeholder="z.B. Allgemeinmedizin"
              value={form.specialty ?? ''}
              onChange={e => setForm(f => f ? { ...f, specialty: e.target.value || null } : f)}
              className={`w-full px-3.5 py-2.5 ${G.input} ${fieldErrors.specialty ? 'border-rose-400' : ''}`}
            />
            {fieldErrors.specialty && <p className="text-rose-600 text-xs mt-1">{fieldErrors.specialty}</p>}
          </div>

          <div>
            <label className={G.label}>Arbeitszeiten</label>
            <textarea
              rows={3}
              maxLength={4000}
              value={form.workingHours ?? ''}
              onChange={e => setForm(f => f ? { ...f, workingHours: e.target.value || null } : f)}
              className={`w-full px-3.5 py-2.5 ${G.input} resize-none ${fieldErrors.workingHours ? 'border-rose-400' : ''}`}
            />
            <p className="mt-1 text-xs text-stone-400">Z.B. &apos;Mo-Fr 09:00-18:00&apos;. Wird in der zukünftigen Cannaflow-Integration für automatische Anfragen-Zuteilung verwendet.</p>
            {fieldErrors.workingHours && <p className="text-rose-600 text-xs mt-1">{fieldErrors.workingHours}</p>}
          </div>

          {saveError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600 flex items-center gap-2">
              <AlertCircle size={16} className="flex-shrink-0" />{saveError}
            </div>
          )}
          {saveSuccess && (
            <p className="text-emerald-600 flex items-center gap-2 text-sm"><CheckCircle size={16} /> Gespeichert</p>
          )}
          <button
            onClick={handleSave}
            disabled={!isDirty || saving}
            className={`w-full sm:w-auto px-6 py-2.5 ${G.btn} ${G.btnPrimary} ${G.focus} flex items-center justify-center gap-2`}
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : 'Speichern'}
          </button>
        </div>

        <div className={`${G.card} border-l-4 border-l-amber-400 p-6 space-y-5`}>
          <h3 className="text-sm font-bold text-stone-700 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Lock size={14} className="text-amber-600" />
            </div>
            Vom releafZ-Team verwaltet
          </h3>
          <LockedField label="Name" value={doctor.name} />
          <LockedField label="E-Mail" value={doctor.email} />
          <LockedField label="Approbationsurkunde-Nr" value={doctor.approbationNumber} />
          <LockedField label="LANR" value={doctor.lanr} />
          <LockedField label="BTM-Nr" value={doctor.btmNumber} />
          <LockedField label="Lizenz verifiziert am" value={doctor.licenseVerifiedAt ? formatDate(doctor.licenseVerifiedAt) : 'Noch nicht verifiziert'} />
          <p className="text-xs text-stone-500 pt-2 border-t border-stone-200">
            Diese Daten verwaltet das releafZ-Team. Für Änderungen wenden Sie sich an{' '}
            <a href="mailto:support@releafz.de" className="text-emerald-700 hover:text-emerald-800 underline">support@releafz.de</a>.
          </p>
        </div>
      </div>
    </div>
  )
}

function DoctorSettingsView() {
  return (
    <div className="space-y-6">
      <PreviewBanner text="Einstellungen sind in Vorbereitung. Benachrichtigungen und Sprechzeiten werden in einer zukünftigen Version konfigurierbar sein." />
      <div className={`${G.card} p-6 space-y-6 opacity-60 pointer-events-none`}>
        <div>
          <h3 className="text-sm font-bold text-stone-800 mb-4 flex items-center gap-2"><Bell size={14} /> Benachrichtigungen</h3>
          {['E-Mail bei neuer Anfrage', 'Tägliche Zusammenfassung', 'Erinnerung bei ausstehenden Anfragen'].map(l => (
            <div key={l} className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0"><span className="text-sm text-stone-700">{l}</span><div className="w-11 h-6 rounded-full bg-stone-200" /></div>
          ))}
        </div>
        <div className="border-t border-stone-200 pt-6">
          <h3 className="text-sm font-bold text-stone-800 mb-4 flex items-center gap-2"><Clock size={14} /> Sprechzeiten</h3>
          <p className="text-sm text-stone-500">Sprechzeiten-Verwaltung folgt in Kürze.</p>
        </div>
      </div>
    </div>
  )
}

export default function DoctorDashboard() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [requests, setRequests] = useState<TreatmentRequest[]>([])
  const [pastRequests, setPastRequests] = useState<TreatmentRequest[]>([])
  const [activeView, setActiveView] = useState<ViewType>('inbox')
  const [loading, setLoading] = useState(false)
  const [sessionChecking, setSessionChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [bellSeenAt, setBellSeenAt] = useState<number>(() => {
    if (typeof window === 'undefined') return Date.now()
    const stored = window.localStorage.getItem('doctor_bell_seen_at')
    return stored ? parseInt(stored, 10) : Date.now()
  })
  const [patientProfileOpen, setPatientProfileOpen] = useState(false)
  const [selectedPatientKey, setSelectedPatientKey] = useState<string | null>(null)
  const [detailModalRequest, setDetailModalRequest] = useState<TreatmentRequest | null>(null)
  const [detailModalInitialConfirm, setDetailModalInitialConfirm] = useState<'none' | 'approve'>('none')
  const [inboxFilter, setInboxFilter] = useState<InboxTimeFilter>('all')
  const [inboxSearch, setInboxSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending')
  const [patientsSearch, setPatientsSearch] = useState('')
  const bellContainerRef = useRef<HTMLDivElement>(null)

  const fetchPastRequests = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/doctor/past-requests`, { credentials: 'include' })
      const data = await res.json() as { requests?: TreatmentRequest[]; message?: string }
      if (res.ok) setPastRequests(data.requests ?? [])
      else { if (process.env.NODE_ENV === 'development') console.error('Failed to fetch past requests:', data.message); setPastRequests([]) }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('Past requests fetch error:', err)
      setPastRequests([])
    }
  }, [])

  const fetchRequests = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      const res = await fetch(`${API_BASE}/api/doctor/requests`, { credentials: 'include' })
      const data = await res.json() as { requests?: TreatmentRequest[] }
      if (res.ok) setRequests(data.requests ?? [])
      else if (!silent) setError('Anfragen konnten nicht geladen werden.')
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error(err)
      if (!silent) setError('Fehler beim Laden der Anfragen.')
    } finally { if (!silent) setLoading(false) }
  }, [])

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/doctor/requests`, { credentials: 'include' })
        if (res.ok) {
          const data = await res.json() as { requests?: TreatmentRequest[] }
          setIsLoggedIn(true)
          setRequests(data.requests ?? [])
          fetchPastRequests()
        }
      } catch { /* not logged in */ }
      finally { setSessionChecking(false) }
    }
    checkSession()
  }, [fetchPastRequests])

  useEffect(() => {
    if (!isLoggedIn || activeView === 'inbox') return
    const id = setInterval(() => { fetchRequests(true) }, 30000)
    return () => clearInterval(id)
  }, [isLoggedIn, activeView, fetchRequests])

  useEffect(() => {
    if (!bellOpen) return
    const handler = (e: MouseEvent) => {
      if (bellContainerRef.current && !bellContainerRef.current.contains(e.target as Node)) setBellOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [bellOpen])

  const handleLogin = async () => {
    try {
      setLoading(true); setError(null)
      const res = await fetch(`${API_BASE}/api/doctor/doctor-login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), credentials: 'include',
      })
      if (res.ok) { setIsLoggedIn(true); fetchRequests(); fetchPastRequests() }
      else setError('Login fehlgeschlagen. Bitte erneut versuchen.')
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error(err)
      setError('Anmeldefehler. Bitte erneut versuchen.')
    } finally { setLoading(false) }
  }

  const handleLogout = () => {
    setIsLoggedIn(false); setRequests([]); setPastRequests([])
    setEmail(''); setPassword(''); setActiveView('inbox')
  }

  const handleRefresh = () => { fetchRequests(); fetchPastRequests() }

  const handleBellClose = () => {
    setBellOpen(false)
    const now = Date.now()
    setBellSeenAt(now)
    if (typeof window !== 'undefined') window.localStorage.setItem('doctor_bell_seen_at', String(now))
  }

  const notifications = useMemo((): BellNotification[] => {
    return requests.slice().sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()).slice(0, 10).map(r => ({
      id: r.id, patientName: r.fullName, createdAt: r.createdAt ?? '', unread: r.createdAt ? new Date(r.createdAt).getTime() > bellSeenAt : false,
    }))
  }, [requests, bellSeenAt])

  const unreadCount = notifications.filter(n => n.unread).length

  const allRequests = useMemo(() => {
    const map = new Map<number, TreatmentRequest>()
    ;[...pastRequests, ...requests]
      .filter(r => isDoctorRelevantStatus(r.status))
      .forEach(r => map.set(r.id, r))
    return Array.from(map.values())
  }, [requests, pastRequests])

  const mergedRequests = useMemo((): RequestWithBucket[] => {
    const pending = (requests ?? [])
      .filter(r => isDoctorRelevantStatus(r.status))
      .map(r => ({ ...r, _bucket: 'pending' as const }))
    const past = (pastRequests ?? [])
      .filter(r => isDoctorRelevantStatus(r.status))
      .map(r => ({
        ...r,
        _bucket: resolveRequestBucket(r, false),
      }))
    return [...pending, ...past].sort(
      (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    )
  }, [requests, pastRequests])

  const statusCounts = useMemo(() => ({
    pending: requests.length,
    approved: pastRequests.filter(r => resolveRequestBucket(r, false) === 'approved').length,
    declined: pastRequests.filter(r => resolveRequestBucket(r, false) === 'declined').length,
  }), [requests, pastRequests])

  const filteredByStatus = useMemo(() => {
    if (statusFilter === 'all') return mergedRequests
    return mergedRequests.filter(r => r._bucket === statusFilter)
  }, [mergedRequests, statusFilter])

  const filteredInbox = useMemo(() => {
    const q = inboxSearch.trim().toLowerCase()
    return filteredByStatus.filter(r => {
      if (!matchesInboxTimeFilter(r, inboxFilter)) return false
      if (!q) return true
      return r.fullName.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || getSymptomPreview(r).toLowerCase().includes(q)
    })
  }, [filteredByStatus, inboxFilter, inboxSearch])

  const patientAggregates = useMemo((): PatientAggregate[] => {
    const map = new Map<string, TreatmentRequest[]>()
    allRequests.forEach(r => {
      const key = buildPatientKey(r)
      const list = map.get(key) ?? []
      list.push(r); map.set(key, list)
    })
    return Array.from(map.entries()).map(([key, list]) => {
      const sorted = list.slice().sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
      const last = sorted[0]
      return {
        key, name: last.fullName, email: last.email, phone: last.phone,
        requestCount: list.length,
        approvedCount: list.filter(r => isApprovedStatus(r.status)).length,
        declinedCount: list.filter(r => isDeclinedStatus(r.status)).length,
        lastRequestAt: last.createdAt, requests: sorted,
      }
    }).sort((a, b) => new Date(b.lastRequestAt ?? 0).getTime() - new Date(a.lastRequestAt ?? 0).getTime())
  }, [allRequests])

  const selectedPatientAggregate = useMemo(() => {
    if (!selectedPatientKey) return null
    return patientAggregates.find(p => p.key === selectedPatientKey) ?? null
  }, [selectedPatientKey, patientAggregates])

  const filteredPatients = useMemo(() => {
    const q = patientsSearch.trim().toLowerCase()
    if (!q) return patientAggregates
    return patientAggregates.filter(p => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.phone.includes(q))
  }, [patientAggregates, patientsSearch])

  const openPatientProfile = (req: TreatmentRequest) => {
    setSelectedPatientKey(buildPatientKey(req)); setPatientProfileOpen(true)
  }

  const handleQuickApprove = (req: TreatmentRequest) => {
    if (getDisqualifications(req).length > 0) return
    setDetailModalInitialConfirm('approve')
    setDetailModalRequest(req)
  }

  const openDetailModal = (req: TreatmentRequest) => {
    setDetailModalInitialConfirm('none')
    setDetailModalRequest(req)
  }

  const handleNotificationClick = (id: number) => {
    setBellOpen(false); setActiveView('inbox')
    const req = requests.find(r => r.id === id)
    if (req) openDetailModal(req)
  }

  if (sessionChecking) {
    return (
      <div className={`min-h-screen flex items-center justify-center font-sans ${G.appBg}`}>
        <div className="flex flex-col items-center gap-4">
          <img src="/logo1.png" alt="reLeafZ" className="h-40 w-auto animate-pulse" />
          <div className="flex gap-1.5">{[0, 150, 300].map(d => <div key={d} className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}</div>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center px-4 font-sans ${G.appBg}`}>
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <img src="/logo1.png" alt="reLeafZ" className="h-14 w-auto mb-5 mx-auto" />
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Arzt-Login</h1>
            <p className="text-stone-500 mt-1.5 text-sm">Melden Sie sich im medizinischen Dashboard an</p>
          </div>
          <div className={`${G.cardElevated} p-8`}>
            {error && <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600 flex items-center gap-2.5"><AlertCircle size={16} className="flex-shrink-0" />{error}</div>}
            <div className="space-y-4">
              <div><label className={G.label}>E-Mail Adresse</label><div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} /><input type="email" placeholder="arzt@beispiel.de" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} className={`w-full pl-11 pr-4 py-3 ${G.input}`} /></div></div>
              <div><label className={G.label}>Passwort</label><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} /><input type={showPassword ? 'text' : 'password'} placeholder="••••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} className={`w-full pl-11 pr-11 py-3 ${G.input}`} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'} className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 ${G.focus}`}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
              <button onClick={handleLogin} disabled={loading} className={`w-full py-3 mt-2 ${G.btn} ${G.btnPrimary} ${G.focus} flex items-center justify-center gap-2`}>
                {loading ? <Loader2 className="animate-spin" size={18} /> : <><LogOut size={16} className="rotate-180" /> Anmelden</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const STATUS_TABS: { key: StatusFilter; label: string; count?: number }[] = [
    { key: 'pending', label: 'Wartend', count: statusCounts.pending },
    { key: 'approved', label: 'Genehmigt', count: statusCounts.approved },
    { key: 'declined', label: 'Abgelehnt', count: statusCounts.declined },
    { key: 'all', label: 'Alle' },
  ]
  const INBOX_TABS: { key: InboxTimeFilter; label: string }[] = [
    { key: 'all', label: 'Alle' }, { key: 'today', label: 'Heute eingegangen' },
    { key: 'week', label: 'Diese Woche' }, { key: 'older', label: 'Ältere' },
  ]

  const inboxSubtitle = (() => {
    const count = filteredInbox.length
    if (statusFilter === 'pending') {
      return count === 1 ? '1 wartet auf Ihre Entscheidung.' : `${count} warten auf Ihre Entscheidung.`
    }
    if (statusFilter === 'approved') return `${count} genehmigte Anfragen`
    if (statusFilter === 'declined') return `${count} abgelehnte Anfragen`
    return `${count} Anfragen insgesamt`
  })()

  const inboxEmptyState = (() => {
    if (statusFilter === 'approved') return { title: 'Keine genehmigten Anfragen.', description: '' }
    if (statusFilter === 'declined') return { title: 'Keine abgelehnten Anfragen.', description: '' }
    if (statusFilter === 'all') return { title: 'Noch keine Anfragen.', description: '' }
    return { title: 'Keine offenen Anfragen.', description: 'Sobald ein Patient eine Anfrage stellt, erscheint sie hier.' }
  })()

  return (
    <div className={`flex min-h-screen font-sans ${G.appBg}`}>
      <Sidebar activeView={activeView} onViewChange={setActiveView} doctorEmail={email} pendingCount={requests.length} onLogout={handleLogout} mobileOpen={mobileSidebarOpen} onMobileClose={() => setMobileSidebarOpen(false)} />
      <main className="flex-1 min-w-0 flex flex-col">
        <TopBar activeView={activeView} doctorEmail={email} onMobileMenuToggle={() => setMobileSidebarOpen(true)} onNavigate={setActiveView} onLogout={handleLogout} onRefresh={handleRefresh} bellOpen={bellOpen} bellContainerRef={bellContainerRef} unreadCount={unreadCount} notifications={notifications} onBellOpen={() => setBellOpen(true)} onBellClose={handleBellClose} onNotificationClick={handleNotificationClick} />
        {error && (
          <div className="fixed top-20 right-4 z-[100]">
            <div className={`${G.cardElevated} px-4 py-3 flex items-center gap-3 max-w-sm !border-rose-200`}>
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0"><AlertTriangle size={15} className="text-rose-600" /></div>
              <p className="text-sm text-rose-700 flex-1">{error}</p>
              <button onClick={() => setError(null)} aria-label="Schließen" className="text-stone-400 hover:text-stone-600"><X size={15} /></button>
            </div>
          </div>
        )}
        <div className="flex-1 px-6 lg:px-10 py-6 lg:py-8 overflow-y-auto">
          {activeView === 'inbox' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-stone-900">Anfragen</h2>
                <p className="text-sm text-stone-500 mt-1">{inboxSubtitle}</p>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {STATUS_TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setStatusFilter(tab.key)}
                    aria-label={`Filter: ${tab.label}`}
                    className={`px-3.5 py-2 ${G.btn} ${G.focus} rounded-xl flex items-center gap-1.5 ${statusFilter === tab.key ? G.tabActive : G.tabInactive}`}
                  >
                    {tab.label}
                    {tab.count != null && (
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md tabular-nums ${statusFilter === tab.key ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} /><input type="text" placeholder="Patient oder Symptome suchen..." value={inboxSearch} onChange={e => setInboxSearch(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 ${G.input}`} /></div>
              </div>
              <div className="flex gap-1.5 flex-wrap">{INBOX_TABS.map(tab => (
                <button key={tab.key} onClick={() => setInboxFilter(tab.key)} className={`px-3.5 py-2 ${G.btn} ${G.focus} rounded-xl ${inboxFilter === tab.key ? G.tabActive : G.tabInactive}`}>{tab.label}</button>
              ))}</div>
              {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-emerald-600" size={32} /></div>
              : filteredInbox.length === 0 ? (
                <div className={G.card}>
                  <EmptyState
                    icon={Inbox}
                    title={inboxEmptyState.title}
                    description={inboxEmptyState.description}
                  />
                </div>
              ) : (
                <div className="space-y-3">{filteredInbox.map(req => (
                  <RequestCard key={req.id} req={req} onView={openDetailModal} onQuickApprove={handleQuickApprove} onPatientClick={openPatientProfile} />
                ))}</div>
              )}
            </div>
          )}
          {activeView === 'patients' && (
            <div className="space-y-4">
              <div className="relative max-w-md"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} /><input type="text" placeholder="Patient suchen..." value={patientsSearch} onChange={e => setPatientsSearch(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 ${G.input}`} /></div>
              {filteredPatients.length === 0 ? <div className={G.card}><EmptyState icon={Users} title="Keine Patienten" description="Patienten erscheinen nach der ersten Anfrage." /></div>
              : <div className={`${G.card} overflow-hidden`}>
                <table className="w-full"><thead><tr className="bg-stone-50 border-b border-stone-200">
                  <th className={`${G.th} text-left`}>Patient</th><th className={`${G.th} text-left`}>E-Mail</th>
                  <th className={`${G.th} text-center`}>Anfragen</th><th className={`${G.th} text-right`}>Letzte Anfrage</th>
                </tr></thead><tbody className="divide-y divide-stone-100">
                  {filteredPatients.map(p => (
                    <tr key={p.key} className="hover:bg-stone-50 cursor-pointer" onClick={() => { setSelectedPatientKey(p.key); setPatientProfileOpen(true) }}>
                      <td className={G.td}><span className="font-medium text-stone-900 hover:text-emerald-700">{p.name}</span></td>
                      <td className={`${G.td} text-stone-500`}>{p.email}</td>
                      <td className={`${G.td} text-center tabular-nums`}>{p.requestCount}</td>
                      <td className={`${G.td} text-right text-stone-500`}>{formatDate(p.lastRequestAt)}</td>
                    </tr>
                  ))}
                </tbody></table>
              </div>}
            </div>
          )}
          {activeView === 'profile' && <DoctorProfileView />}
          {activeView === 'settings' && <DoctorSettingsView />}
        </div>
      </main>
      <RequestDetailModal req={detailModalRequest} initialConfirmMode={detailModalInitialConfirm} onClose={() => { setDetailModalRequest(null); setDetailModalInitialConfirm('none') }} onActionComplete={() => { fetchRequests(); fetchPastRequests() }} />
      {patientProfileOpen && <PatientProfileModal aggregate={selectedPatientAggregate} onClose={() => { setPatientProfileOpen(false); setSelectedPatientKey(null) }} onViewRequest={openDetailModal} />}
    </div>
  )
}

