'use client'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  Eye, EyeOff, Lock, Mail, User, Clock, CheckCircle, XCircle, Package, LogOut,
  Phone, AlertCircle, MapPin, Search, Menu, Bell, Settings, ChevronDown, X,
  FileText, Users, History, Inbox, Loader2, AlertTriangle, Stethoscope, RefreshCw,
} from 'lucide-react'
import { API_BASE } from '@/lib/api'

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

type ViewType = 'inbox' | 'history' | 'patients' | 'profile' | 'settings'
const VIEW_TITLES: Record<ViewType, string> = {
  inbox: 'Anfragen', history: 'Verlauf', patients: 'Patientenliste', profile: 'Profil', settings: 'Einstellungen',
}

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
type HistoryFilter = 'all' | 'approved' | 'declined' | 'last30' | 'older'

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
function isApprovedStatus(status: string) {
  const s = status.toLowerCase()
  return s === 'approved' || s === 'approve'
}
function isDeclinedStatus(status: string) {
  const s = status.toLowerCase()
  return s === 'declined' || s === 'decline'
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
function EmptyState({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center mb-5"><Icon className="w-7 h-7 text-stone-300" /></div>
      <h3 className="text-base font-semibold text-stone-800 mb-2">{title}</h3>
      <p className="text-sm text-stone-500 text-center max-w-sm">{description}</p>
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
      { key: 'history', label: 'Verlauf', icon: History },
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

function matchesHistoryFilter(req: TreatmentRequest, filter: HistoryFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'approved') return isApprovedStatus(req.status)
  if (filter === 'declined') return isDeclinedStatus(req.status)
  if (!req.createdAt) return false
  const created = new Date(req.createdAt)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000)
  if (filter === 'last30') return created >= thirtyDaysAgo
  if (filter === 'older') return created < thirtyDaysAgo
  return true
}

type RequestCardProps = {
  req: TreatmentRequest; readOnly?: boolean
  onView: (req: TreatmentRequest) => void; onQuickApprove?: (req: TreatmentRequest) => void
  onPatientClick: (req: TreatmentRequest) => void
}

function RequestCard({ req, readOnly, onView, onQuickApprove, onPatientClick }: RequestCardProps) {
  const disqualifications = getDisqualifications(req)
  const productCount = req.selectedProducts?.length ?? 0
  return (
    <div className={`${G.card} ${G.cardHover} p-5 space-y-4`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <button type="button" onClick={() => onPatientClick(req)} className="text-base font-semibold text-stone-900 hover:text-emerald-700 hover:underline underline-offset-2">{req.fullName}</button>
            <span className="text-xs text-stone-400">{formatRelativeTime(req.createdAt)}</span>
            <SeverityPill severity={req.severity} />
            {req.age != null && <span className="text-xs text-stone-500">{req.age} J.</span>}
          </div>
          <p className="text-sm text-stone-600 line-clamp-2">{getSymptomPreview(req)}</p>
        </div>
        {readOnly && <StatusPill status={req.status} />}
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
  return (
    <div className="space-y-6">
      <PreviewBanner text="Profilbearbeitung ist in Vorbereitung. Persönliche Daten, Approbation und Signatur werden in einer zukünftigen Version freigeschaltet." />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: 'Persönliche Daten', desc: 'Name, Kontakt, Fachrichtung' },
          { title: 'Approbation', desc: 'Lanr, BSNR, Approbationsnummer' },
          { title: 'Signatur', desc: 'Digitale Signatur für Rezepte' },
        ].map(card => (
          <div key={card.title} className={`${G.card} p-5 opacity-60 pointer-events-none`}>
            <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center mb-3"><Lock size={16} className="text-stone-400" /></div>
            <h3 className="text-sm font-bold text-stone-800">{card.title}</h3>
            <p className="text-xs text-stone-500 mt-1">{card.desc}</p>
          </div>
        ))}
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
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('all')
  const [historySearch, setHistorySearch] = useState('')
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
    ;[...pastRequests, ...requests].forEach(r => map.set(r.id, r))
    return Array.from(map.values())
  }, [requests, pastRequests])

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

  const filteredInbox = useMemo(() => {
    const q = inboxSearch.trim().toLowerCase()
    return requests.filter(r => {
      if (!matchesInboxTimeFilter(r, inboxFilter)) return false
      if (!q) return true
      return r.fullName.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || getSymptomPreview(r).toLowerCase().includes(q)
    }).sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
  }, [requests, inboxFilter, inboxSearch])

  const filteredHistory = useMemo(() => {
    const q = historySearch.trim().toLowerCase()
    return pastRequests.filter(r => {
      if (!matchesHistoryFilter(r, historyFilter)) return false
      if (!q) return true
      return r.fullName.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
    }).sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
  }, [pastRequests, historyFilter, historySearch])

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

  const INBOX_TABS: { key: InboxTimeFilter; label: string }[] = [
    { key: 'all', label: 'Alle' }, { key: 'today', label: 'Heute' },
    { key: 'week', label: 'Diese Woche' }, { key: 'older', label: 'Ältere' },
  ]
  const HISTORY_TABS: { key: HistoryFilter; label: string }[] = [
    { key: 'all', label: 'Alle' }, { key: 'approved', label: 'Genehmigt' }, { key: 'declined', label: 'Abgelehnt' },
    { key: 'last30', label: 'Letzten 30 Tage' }, { key: 'older', label: 'Älter' },
  ]

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
                <p className="text-sm text-stone-500 mt-1">{requests.length} wartet{requests.length === 1 ? '' : 'en'} auf Ihre Entscheidung.</p>
              </div>
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} /><input type="text" placeholder="Patient oder Symptome suchen..." value={inboxSearch} onChange={e => setInboxSearch(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 ${G.input}`} /></div>
              </div>
              <div className="flex gap-1.5 flex-wrap">{INBOX_TABS.map(tab => (
                <button key={tab.key} onClick={() => setInboxFilter(tab.key)} className={`px-3.5 py-2 ${G.btn} ${G.focus} rounded-xl ${inboxFilter === tab.key ? G.tabActive : G.tabInactive}`}>{tab.label}</button>
              ))}</div>
              {loading ? <div className="flex justify-center py-16"><Loader2 className="animate-spin text-emerald-600" size={32} /></div>
              : filteredInbox.length === 0 ? <div className={G.card}><EmptyState icon={Inbox} title="Keine offenen Anfragen." description="Sobald ein Patient eine Anfrage stellt, erscheint sie hier." /></div>
              : <div className="space-y-3">{filteredInbox.map(req => (
                <RequestCard key={req.id} req={req} onView={openDetailModal} onQuickApprove={handleQuickApprove} onPatientClick={openPatientProfile} />
              ))}</div>}
            </div>
          )}
          {activeView === 'history' && (
            <div className="space-y-4">
              <div className="relative max-w-md"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} /><input type="text" placeholder="Patient suchen..." value={historySearch} onChange={e => setHistorySearch(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 ${G.input}`} /></div>
              <div className="flex gap-1.5 flex-wrap">{HISTORY_TABS.map(tab => (
                <button key={tab.key} onClick={() => setHistoryFilter(tab.key)} className={`px-3.5 py-2 ${G.btn} ${G.focus} rounded-xl ${historyFilter === tab.key ? G.tabActive : G.tabInactive}`}>{tab.label}</button>
              ))}</div>
              {filteredHistory.length === 0 ? <div className={G.card}><EmptyState icon={History} title="Kein Verlauf" description="Abgeschlossene Anfragen erscheinen hier." /></div>
              : <div className="space-y-3">{filteredHistory.map(req => (
                <RequestCard key={req.id} req={req} readOnly onView={openDetailModal} onPatientClick={openPatientProfile} />
              ))}</div>}
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

