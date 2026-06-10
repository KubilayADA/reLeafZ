'use client'

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import {
  Eye, EyeOff, Lock, Mail, User, Clock, CheckCircle, XCircle, Package, LogOut,
  Phone, AlertCircle, Truck, CheckCircle2, Loader2, TrendingUp,
  ShoppingCart, AlertTriangle, Plus, Pencil, Trash2, X, Save, Boxes, Search,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, BarChart3, DollarSign,
  Calendar, FileText, CreditCard, Users, RefreshCw, ExternalLink, Activity,
  ArrowUpRight, ArrowDownRight, Settings, Shield, Camera, Check, Copy,
  SlidersHorizontal, Store, Menu, Bell,
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Area, AreaChart
} from 'recharts'
import {
  pharmacyLogin, fetchPharmacyDashboard, fetchPharmacyOrders, updateOrderStatus,
  markOrderReady, dispatchOrder, fetchPharmacyOrderDetail, fetchPharmacyInventory, fetchPharmacyAnalytics,
  createProduct, updateProduct, deleteProduct, updatePharmacyProfile,
  type Product, type ProductFormData, type DashboardResponse, type Pharmacy,
  type OrdersResponse, type OrderFilters, type OrderDetail, type InventoryResponse,
  type InventoryFilters, type AnalyticsResponse, type EditableProfileFields,
  STATUS_TRANSITIONS, STATUS_TRANSITION_LABELS,
  getDeliveryCategory, DELIVERY_PIPELINES, ACTION_LABELS, CATEGORY_ACCENTS,
  type DeliveryCategory,
  API_BASE,
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

type ViewType = 'dashboard' | 'orders' | 'inventory' | 'analytics' | 'profile' | 'settings' | 'compliance'

const VIEW_TITLES: Record<ViewType, string> = {
  dashboard: 'Übersicht', orders: 'Bestellungen', inventory: 'Inventar',
  analytics: 'Analytik', profile: 'Profil', settings: 'Einstellungen', compliance: 'Compliance',
}

// Light-mode accents per delivery category (api CATEGORY_ACCENTS stays the source for border/icon/label)
type CategoryStyle = { badge: string; solidBtn: string }
const CATEGORY_LIGHT: Record<DeliveryCategory, CategoryStyle> = {
  BOTENDIENST: { badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200', solidBtn: 'bg-amber-500 hover:bg-amber-600 text-white' },
  MAIL_ORDER:  { badge: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',   solidBtn: 'bg-blue-600 hover:bg-blue-700 text-white' },
  PICKUP:      { badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', solidBtn: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
  UNKNOWN:     { badge: 'bg-stone-100 text-stone-600 ring-1 ring-stone-200', solidBtn: 'bg-stone-700 hover:bg-stone-800 text-white' },
}

const PRODUCT_FORMS = ['FLOWER', 'OIL', 'EXTRACT', 'CAPSULE', 'SPRAY'] as const
const PRODUCT_UNITS: Record<string, string> = { FLOWER: 'gram', OIL: 'ml', EXTRACT: 'gram', CAPSULE: 'capsule', SPRAY: 'spray' }
const FORM_LABELS: Record<string, string> = { FLOWER: 'Blüte', OIL: 'Öl', EXTRACT: 'Extrakt', CAPSULE: 'Kapsel', SPRAY: 'Spray' }

const ORDER_STATUS_TABS = [
  { key: 'ALL', label: 'Alle' },
  { key: 'PROCESSING', label: 'Neu' },
  { key: 'PREPARING', label: 'In Bearbeitung' },
  { key: 'READY', label: 'Bereit' },
  { key: 'DISPATCHED', label: 'Unterwegs 🚚' },
  { key: 'PICKED_UP', label: 'Abgeholt 🏪' },
  { key: 'DELIVERED', label: 'Abgeschlossen' },
] as const
const AVAILABILITY_TABS = [
  { key: 'all', label: 'Alle' }, { key: 'available', label: 'Verfügbar' }, { key: 'lowStock', label: 'Niedriger Bestand' },
  { key: 'outOfStock', label: 'Nicht vorrätig' }, { key: 'unavailable', label: 'Nicht verfügbar' },
] as const
const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Neueste zuerst' }, { value: 'createdAt:asc', label: 'Älteste zuerst' },
  { value: 'total_price:desc', label: 'Preis: Hoch → Niedrig' }, { value: 'total_price:asc', label: 'Preis: Niedrig → Hoch' },
] as const
const PERIOD_OPTIONS = [
  { value: '7d' as const, label: '7 Tage' }, { value: '30d' as const, label: '30 Tage' },
  { value: '90d' as const, label: '90 Tage' }, { value: '12m' as const, label: '12 Monate' },
] as const

const initialProductForm: ProductFormData = { name: '', form: 'FLOWER', thcPercent: 0, cbdPercent: 0, price: 0, unit: 'gram', stock: 0, imageUrl: '' }
const EMPTY_ORDER_STATS = { pending: 0, paid: 0, processing: 0, ready: 0, delivered: 0, total: 0 }
const EMPTY_REVENUE_STATS = { today: 0, thisWeek: 0, thisMonth: 0, allTime: 0 }
const EMPTY_INVENTORY_STATS = { totalProducts: 0, lowStock: 0, outOfStock: 0, totalValue: 0 }

function formatEUR(amount: number) { return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount) }
function formatDate(d?: string) { if (!d) return '—'; try { return new Date(d).toLocaleDateString('de-DE', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) } catch { return d } }
function formatShortDate(d?: string) { if (!d) return '—'; try { return new Date(d).toLocaleDateString('de-DE', { month: 'short', day: 'numeric' }) } catch { return d } }

// Light-mode status pill palette (mirrors the admin dashboard's statusPillClasses language)
function statusPillClasses(status: string) {
  switch (status.toUpperCase()) {
    case 'DISPATCHED':              return 'bg-orange-50 text-orange-700 ring-1 ring-orange-200'
    case 'DELIVERED':
    case 'FULFILLED':              return 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
    case 'READY':                  return 'bg-teal-50 text-teal-700 ring-1 ring-teal-200'
    case 'PROCESSING':
    case 'PREPARING':              return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
    case 'PAID':                   return 'bg-violet-50 text-violet-700 ring-1 ring-violet-200'
    case 'APPROVED':
    case 'PENDING':                return 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'
    case 'DECLINED':
    case 'CANCELLED':              return 'bg-rose-50 text-rose-700 ring-1 ring-rose-200'
    case 'PICKED_UP':              return 'bg-purple-50 text-purple-700 ring-1 ring-purple-200'
    default:                       return 'bg-stone-100 text-stone-600 ring-1 ring-stone-200'
  }
}
function getStatusOrder(status: string) { const o: Record<string, number> = { PENDING: 0, APPROVED: 1, PAID: 2, PROCESSING: 3, READY: 4, DISPATCHED: 5, PICKED_UP: 5, DELIVERED: 6, FULFILLED: 6 }; return o[status.toUpperCase()] ?? -1 }

const STATUS_STEPS = [
  { key: 'APPROVED', label: 'Genehmigt', icon: CheckCircle }, { key: 'PAID', label: 'Bezahlt', icon: CreditCard },
  { key: 'PROCESSING', label: 'In Bearbeitung', icon: Loader2 }, { key: 'READY', label: 'Bereit', icon: Package },
  { key: 'PICKED_UP', label: 'Abgeholt', icon: Truck }, { key: 'DELIVERED', label: 'Geliefert', icon: CheckCircle2 },
]

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full ${statusPillClasses(status)}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  )
}

type DeliveryMethodLabel = {
  label: string
  className: string
  icon: string
}

function getDeliveryMethodDisplay(method: string | null | undefined): DeliveryMethodLabel {
  const cat = getDeliveryCategory(method);
  const accent = CATEGORY_ACCENTS[cat];
  const specific =
    method === 'BOTENDIENST_FAR'                                    ? 'Botendienst (weit)'
    : method === 'BOTENDIENST_NEAR' || method === 'BOTENDIENST_NEARBY' ? 'Botendienst (nah)'
    : method === 'DHL'                                              ? 'DHL Versand'
    : method === 'MAIL_ORDER'                                       ? 'Versand'
    : null;
  return {
    label: specific ?? accent.label,
    className: CATEGORY_LIGHT[cat].badge,
    icon: accent.icon,
  };
}

function DeliveryMethodBadge({ method }: { method: string | null | undefined }) {
  const { label, className, icon } = getDeliveryMethodDisplay(method)
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${className}`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  )
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-stone-100 ${className}`} />
}

type StatTone = 'emerald' | 'amber' | 'blue' | 'violet' | 'purple' | 'pink' | 'rose' | 'teal' | 'stone'
const STAT_TONES: Record<StatTone, { bg: string; text: string }> = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-700' },
  blue:    { bg: 'bg-blue-50',    text: 'text-blue-700' },
  violet:  { bg: 'bg-violet-50',  text: 'text-violet-700' },
  purple:  { bg: 'bg-purple-50',  text: 'text-purple-700' },
  pink:    { bg: 'bg-pink-50',    text: 'text-pink-700' },
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-700' },
  teal:    { bg: 'bg-teal-50',    text: 'text-teal-700' },
  stone:   { bg: 'bg-stone-100',  text: 'text-stone-600' },
}

function StatCard({ label, value, icon: Icon, tone = 'stone' }: {
  label: string; value: string | number; icon: React.ElementType; tone?: StatTone
}) {
  const t = STAT_TONES[tone]
  return (
    <div className={`group ${G.card} ${G.cardHover} p-5 overflow-hidden min-w-0`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl ${t.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon size={18} className={t.text} />
        </div>
      </div>
      <p className="text-[12px] font-medium text-stone-500 tracking-wide uppercase mb-1 truncate">{label}</p>
      <p className="text-2xl font-bold text-stone-900 tracking-tight tabular-nums truncate">{value}</p>
    </div>
  )
}

function EmptyState({ icon: Icon, title, description, action }: { icon: React.ElementType; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center mb-5">
        <Icon className="w-7 h-7 text-stone-300" />
      </div>
      <h3 className="text-base font-semibold text-stone-800 mb-2">{title}</h3>
      <p className="text-sm text-stone-500 text-center max-w-sm mb-5">{description}</p>
      {action}
    </div>
  )
}

// ── Profile sub-components ──

function LockedField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className={`${G.label} flex items-center gap-1`}>
        <Lock size={11} className="text-amber-500" />
        {label}
      </p>
      <p className="text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 font-mono break-all leading-relaxed">
        {value || '—'}
      </p>
    </div>
  )
}

function SimpleToggle({ id, value, onChange }: { id: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${G.focus} ${
        value ? 'bg-emerald-600' : 'bg-stone-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
          value ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}

function makeProfileInitial(pharmacy: Pharmacy): EditableProfileFields {
  return {
    description: pharmacy.description ?? null,
    logoUrl: pharmacy.logoUrl ?? null,
    operatingHours: pharmacy.operatingHours ?? null,
    contactPersonName: pharmacy.contactPersonName ?? null,
    contactEmail: pharmacy.contactEmail ?? null,
    phone: pharmacy.phone ?? null,
    mailOrderFee: pharmacy.mailOrderFee ?? null,
    baseDeliveryFee: pharmacy.baseDeliveryFee ?? 0,
    extendedDeliveryFee: pharmacy.extendedDeliveryFee ?? 0,
    deliveryRadius: pharmacy.deliveryRadius ?? 0,
    maxDeliveryRadius: pharmacy.maxDeliveryRadius ?? 0,
  }
}

type ProfileViewProps = {
  pharmacy: Pharmacy
  onSave: (patch: Partial<EditableProfileFields>) => Promise<void>
  saving: boolean
  saveError: string | null
}

function ProfileView({ pharmacy, onSave, saving, saveError }: ProfileViewProps) {
  const [initial, setInitial] = useState<EditableProfileFields>(() => makeProfileInitial(pharmacy))
  const [form, setForm] = useState<EditableProfileFields>(() => makeProfileInitial(pharmacy))
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof EditableProfileFields, string>>>({})
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [copied, setCopied] = useState(false)

  const dirty = useMemo(
    () => (Object.keys(form) as Array<keyof EditableProfileFields>).some(k => form[k] !== initial[k]),
    [form, initial]
  )

  const validate = (): boolean => {
    const errors: Partial<Record<keyof EditableProfileFields, string>> = {}
    if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
      errors.contactEmail = 'Ungültige E-Mail-Adresse'
    }
    if (form.logoUrl && !/^https?:\/\//i.test(form.logoUrl)) {
      errors.logoUrl = 'URL muss mit https:// beginnen'
    }
    if (form.baseDeliveryFee < 0) errors.baseDeliveryFee = 'Darf nicht negativ sein'
    if (form.extendedDeliveryFee < 0) errors.extendedDeliveryFee = 'Darf nicht negativ sein'
    if (form.deliveryRadius < 0) errors.deliveryRadius = 'Darf nicht negativ sein'
    if (form.maxDeliveryRadius < 0) errors.maxDeliveryRadius = 'Darf nicht negativ sein'
    if (form.mailOrderFee !== null && form.mailOrderFee < 0) {
      errors.mailOrderFee = 'Darf nicht negativ sein'
    }
    if (form.description && form.description.length > 2000) {
      errors.description = 'Maximal 2000 Zeichen'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    try {
      await onSave(form)
      setInitial({ ...form })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    } catch {
      // saveError is propagated via prop from parent
    }
  }

  const copyApiKey = () => {
    if (!pharmacy.apiKey) return
    navigator.clipboard.writeText(pharmacy.apiKey).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  const isCannaleo = pharmacy.inventorySource === 'CANNALEO'

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Editable card ── */}
        <div className={`${G.card} border-l-4 border-l-emerald-500 p-6 space-y-5`}>
          <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <User size={13} className="text-emerald-600" />
            </div>
            Bearbeitbare Daten
          </h3>

          {/* Logo URL */}
          <div>
            <label className={G.label}>Logo URL</label>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {form.logoUrl ? (
                  <img
                    src={form.logoUrl}
                    alt="Logo Vorschau"
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                ) : (
                  <Camera size={16} className="text-stone-300" />
                )}
              </div>
              <input
                type="url"
                placeholder="https://..."
                value={form.logoUrl ?? ''}
                onChange={e => setForm(f => ({ ...f, logoUrl: e.target.value || null }))}
                className={`flex-1 px-3.5 py-2.5 ${G.input} ${fieldErrors.logoUrl ? 'border-rose-400' : ''}`}
              />
            </div>
            {fieldErrors.logoUrl && <p className="mt-1 text-xs text-rose-600">{fieldErrors.logoUrl}</p>}
            <p className="mt-1 text-[10px] text-stone-400">
              Wird im Patient-Marketplace neben Ihrem Apothekennamen angezeigt.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className={G.label}>Beschreibung</label>
            <div className="relative">
              <textarea
                rows={4}
                placeholder="Kurze Beschreibung Ihrer Apotheke (für Patient:innen sichtbar)"
                value={form.description ?? ''}
                maxLength={2000}
                onChange={e => setForm(f => ({ ...f, description: e.target.value || null }))}
                className={`w-full px-3.5 py-2.5 ${G.input} resize-none ${fieldErrors.description ? 'border-rose-400' : ''}`}
              />
              <span className="absolute bottom-2.5 right-3 text-[10px] text-stone-400 pointer-events-none">
                {(form.description ?? '').length}/2000
              </span>
            </div>
            {fieldErrors.description && <p className="mt-1 text-xs text-rose-600">{fieldErrors.description}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Operating Hours */}
            <div>
              <label className={G.label}>Öffnungszeiten</label>
              <input
                type="text"
                placeholder="z.B. Mo-Fr 8:00-18:30, Sa 9:00-13:00"
                value={form.operatingHours ?? ''}
                onChange={e => setForm(f => ({ ...f, operatingHours: e.target.value || null }))}
                className={`w-full px-3.5 py-2.5 ${G.input}`}
              />
            </div>

            {/* Phone */}
            <div>
              <label className={G.label}>Telefon</label>
              <input
                type="tel"
                placeholder="+49 30 ..."
                value={form.phone ?? ''}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value || null }))}
                className={`w-full px-3.5 py-2.5 ${G.input}`}
              />
            </div>

            {/* Contact Person */}
            <div>
              <label className={G.label}>Ansprechpartner</label>
              <input
                type="text"
                placeholder="Max Mustermann"
                value={form.contactPersonName ?? ''}
                onChange={e => setForm(f => ({ ...f, contactPersonName: e.target.value || null }))}
                className={`w-full px-3.5 py-2.5 ${G.input}`}
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className={G.label}>Kontakt E-Mail</label>
              <input
                type="email"
                placeholder="kontakt@apotheke.de"
                value={form.contactEmail ?? ''}
                onChange={e => setForm(f => ({ ...f, contactEmail: e.target.value || null }))}
                className={`w-full px-3.5 py-2.5 ${G.input} ${fieldErrors.contactEmail ? 'border-rose-400' : ''}`}
              />
              {fieldErrors.contactEmail && (
                <p className="mt-1 text-xs text-rose-600">{fieldErrors.contactEmail}</p>
              )}
            </div>

            {/* Mail Order Fee */}
            <div>
              <label className={G.label}>Versandgebühr</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form.mailOrderFee ?? ''}
                  onChange={e =>
                    setForm(f => ({ ...f, mailOrderFee: e.target.value ? parseFloat(e.target.value) : null }))
                  }
                  className={`w-full px-3.5 py-2.5 pr-8 ${G.input} ${fieldErrors.mailOrderFee ? 'border-rose-400' : ''}`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 pointer-events-none">€</span>
              </div>
              {fieldErrors.mailOrderFee && (
                <p className="mt-1 text-xs text-rose-600">{fieldErrors.mailOrderFee}</p>
              )}
            </div>

            {/* Base Delivery Fee */}
            <div>
              <label className={G.label}>Basis-Liefergebühr</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.baseDeliveryFee}
                  onChange={e => setForm(f => ({ ...f, baseDeliveryFee: parseFloat(e.target.value) || 0 }))}
                  className={`w-full px-3.5 py-2.5 pr-8 ${G.input} ${fieldErrors.baseDeliveryFee ? 'border-rose-400' : ''}`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 pointer-events-none">€</span>
              </div>
              {fieldErrors.baseDeliveryFee && (
                <p className="mt-1 text-xs text-rose-600">{fieldErrors.baseDeliveryFee}</p>
              )}
            </div>

            {/* Extended Delivery Fee */}
            <div>
              <label className={G.label}>Erw. Liefergebühr</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.extendedDeliveryFee}
                  onChange={e => setForm(f => ({ ...f, extendedDeliveryFee: parseFloat(e.target.value) || 0 }))}
                  className={`w-full px-3.5 py-2.5 pr-8 ${G.input} ${fieldErrors.extendedDeliveryFee ? 'border-rose-400' : ''}`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 pointer-events-none">€</span>
              </div>
              {fieldErrors.extendedDeliveryFee && (
                <p className="mt-1 text-xs text-rose-600">{fieldErrors.extendedDeliveryFee}</p>
              )}
            </div>

            {/* Delivery Radius */}
            <div>
              <label className={G.label}>Lieferradius</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={form.deliveryRadius}
                  onChange={e => setForm(f => ({ ...f, deliveryRadius: parseInt(e.target.value) || 0 }))}
                  className={`w-full px-3.5 py-2.5 pr-10 ${G.input} ${fieldErrors.deliveryRadius ? 'border-rose-400' : ''}`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 pointer-events-none">km</span>
              </div>
              {fieldErrors.deliveryRadius && (
                <p className="mt-1 text-xs text-rose-600">{fieldErrors.deliveryRadius}</p>
              )}
            </div>

            {/* Max Delivery Radius */}
            <div>
              <label className={G.label}>Max. Lieferradius</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  value={form.maxDeliveryRadius}
                  onChange={e => setForm(f => ({ ...f, maxDeliveryRadius: parseInt(e.target.value) || 0 }))}
                  className={`w-full px-3.5 py-2.5 pr-10 ${G.input} ${fieldErrors.maxDeliveryRadius ? 'border-rose-400' : ''}`}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 pointer-events-none">km</span>
              </div>
              {fieldErrors.maxDeliveryRadius && (
                <p className="mt-1 text-xs text-rose-600">{fieldErrors.maxDeliveryRadius}</p>
              )}
            </div>
          </div>

          {saveError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 flex items-center gap-2">
              <AlertCircle size={13} className="flex-shrink-0" />
              {saveError}
            </div>
          )}

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={!dirty || saving}
              className={`flex items-center gap-2 px-5 py-2.5 ${G.btn} ${G.btnPrimary} ${G.focus}`}
            >
              {saving && <Loader2 className="animate-spin" size={13} />}
              {saveSuccess && !saving && <Check size={13} className="text-emerald-300" />}
              {saving ? 'Wird gespeichert...' : 'Änderungen speichern'}
            </button>
            {saveSuccess && !saving && (
              <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <Check size={15} /> Gespeichert
              </span>
            )}
          </div>
        </div>

        {/* ── Locked card ── */}
        <div className={`${G.card} border-l-4 border-l-amber-400 p-6 space-y-5`}>
          <h3 className="text-sm font-bold text-stone-500 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Lock size={13} className="text-amber-500" />
            </div>
            Admin-verwaltete Daten
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <LockedField label="Apothekenname" value={pharmacy.name} />
            <LockedField label="Straße" value={pharmacy.street} />
            <LockedField label="PLZ" value={pharmacy.zip} />
            <LockedField label="Stadt" value={pharmacy.city} />
            {pharmacy.latitude != null && (
              <LockedField
                label="Koordinaten"
                value={`${pharmacy.latitude}, ${pharmacy.longitude}`}
              />
            )}
            <LockedField label="Liefertyp" value={pharmacy.deliveryType} />
          </div>

          {/* Delivery capabilities */}
          <div>
            <p className={`${G.label} flex items-center gap-1`}>
              <Lock size={11} className="text-amber-500" /> Liefermethoden
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { label: 'Botendienst', enabled: pharmacy.supportsBotendienst },
                { label: 'Versand', enabled: pharmacy.supportsMailOrder },
                { label: 'Abholung', enabled: pharmacy.supportsPickup },
              ].map(cap => (
                <span
                  key={cap.label}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full ring-1 ${
                    cap.enabled
                      ? 'bg-emerald-50 ring-emerald-200 text-emerald-700'
                      : 'bg-stone-50 ring-stone-200 text-stone-400'
                  }`}
                >
                  {cap.enabled ? <CheckCircle size={11} /> : <XCircle size={11} />}
                  {cap.label}
                </span>
              ))}
            </div>
          </div>

          {/* Inventory source */}
          <div>
            <p className={`${G.label} flex items-center gap-1`}>
              <Lock size={11} className="text-amber-500" /> Inventarquelle
            </p>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full ring-1 font-semibold ${
                isCannaleo
                  ? 'bg-blue-50 ring-blue-200 text-blue-700'
                  : 'bg-emerald-50 ring-emerald-200 text-emerald-700'
              }`}
            >
              {isCannaleo ? 'Cannaleo Sync' : 'Manuell'}
            </span>
          </div>

          {isCannaleo && (
            <div className="grid md:grid-cols-2 gap-4">
              <LockedField label="Cannaleo Subdomain" value={pharmacy.cannaleoSubdomain} />
              <LockedField label="Vendor ID" value={pharmacy.cannaleoVendorId} />
              {pharmacy.cannaleoApiKey && (
                <LockedField
                  label="API Key (Cannaleo)"
                  value={`●●●●●●●●●●●●${pharmacy.cannaleoApiKey.slice(-4)}`}
                />
              )}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <LockedField label="Apotheken-Lizenz" value={pharmacy.apothekenLizenz} />
            <LockedField label="BTM-Erlaubnis" value={pharmacy.btmErlaubnis} />
          </div>

          {pharmacy.apiKey && (
            <div>
              <p className={`${G.label} flex items-center gap-1`}>
                <Lock size={11} className="text-amber-500" /> API-Schlüssel
              </p>
              <div className="flex items-center gap-2">
                <p className="flex-1 text-sm text-stone-500 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 font-mono truncate">
                  {'●'.repeat(12)}{pharmacy.apiKey.slice(-4)}
                </p>
                <button
                  onClick={copyApiKey}
                  className={`flex-shrink-0 px-3 py-2.5 ${G.btn} ${G.btnSecondary} ${G.focus} flex items-center gap-1.5`}
                >
                  {copied ? (
                    <><Check size={11} className="text-emerald-600" /><span className="text-emerald-600">Kopiert!</span></>
                  ) : (
                    <><Copy size={11} /> Kopieren</>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-stone-200">
            <p className="text-xs text-stone-500 leading-relaxed">
              Diese Daten werden vom releafZ-Team verwaltet. Bei Änderungswünschen:{' '}
              <a
                href="mailto:support@releafz.de"
                className="text-emerald-600 hover:text-emerald-700 transition-colors underline underline-offset-2"
              >
                support@releafz.de
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function SettingsView() {
  // TODO: Wire notification toggles to backend notification preferences endpoint (API pending)
  const [emailNewOrder, setEmailNewOrder] = useState(true)
  const [emailDailySummary, setEmailDailySummary] = useState(false)
  const [emailLowStock, setEmailLowStock] = useState(true)
  // TODO: Wire pause-mode to backend pharmacy availability endpoint
  const [pauseMode, setPauseMode] = useState(false)
  // TODO: Wire processing time to backend pharmacy settings
  const [processingMinutes, setProcessingMinutes] = useState(30)

  return (
    <div className="space-y-6">
      <div className={`${G.card} p-6 space-y-8`}>
        <div>
          <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0">
              <Settings size={13} className="text-stone-500" />
            </div>
            Benachrichtigungen
          </h3>
          <div className="space-y-1">
            {([
              { id: 'emailNewOrder', label: 'E-Mail bei neuer Bestellung', value: emailNewOrder, onChange: setEmailNewOrder },
              { id: 'emailDailySummary', label: 'Tägliche Tageszusammenfassung', value: emailDailySummary, onChange: setEmailDailySummary },
              { id: 'emailLowStock', label: 'Bei niedrigem Bestand', value: emailLowStock, onChange: setEmailLowStock },
            ] as const).map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3 border-b border-stone-100 last:border-0"
              >
                <label htmlFor={item.id} className="text-sm text-stone-700 cursor-pointer">
                  {item.label}
                </label>
                <SimpleToggle id={item.id} value={item.value} onChange={item.onChange} />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-stone-200" />

        <div>
          <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0">
              <SlidersHorizontal size={13} className="text-stone-500" />
            </div>
            Betrieb
          </h3>

          <div className="space-y-5">
            <div className="flex items-start justify-between gap-6 py-1">
              <div className="flex-1">
                <p className="text-sm text-stone-700 mb-1">Pause-Modus</p>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Bei aktiviertem Pause-Modus erscheint Ihre Apotheke nicht im Marketplace
                  und nimmt keine neuen Bestellungen an.
                </p>
              </div>
              <SimpleToggle id="pauseMode" value={pauseMode} onChange={setPauseMode} />
            </div>

            <div className="border-t border-stone-100 pt-5">
              <label htmlFor="processingTime" className={G.label}>
                Standard-Bearbeitungsdauer
              </label>
              <div className="flex items-center gap-3 mt-1.5">
                <input
                  id="processingTime"
                  type="number"
                  min="5"
                  max="480"
                  step="5"
                  value={processingMinutes}
                  onChange={e => setProcessingMinutes(parseInt(e.target.value) || 30)}
                  className={`w-24 px-3.5 py-2.5 tabular-nums ${G.input}`}
                />
                <span className="text-sm text-stone-500">Minuten</span>
              </div>
              <p className="mt-1.5 text-xs text-stone-400">
                Durchschnittliche Bearbeitungszeit pro Bestellung.
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-stone-400 pt-4 border-t border-stone-100 italic">
          Einstellungen werden lokal angezeigt — Backend-Anbindung folgt in einem der nächsten Releases.
        </p>
      </div>
    </div>
  )
}

function ComplianceView({ pharmacy }: { pharmacy: Pharmacy }) {
  return (
    <div className="space-y-6">
      <div className={`${G.card} p-6 space-y-8`}>
        {/* Section A — Lizenzen */}
        <div>
          <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Shield size={13} className="text-amber-500" />
            </div>
            Lizenzen und Erlaubnisse
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <LockedField
              label="Apotheken-Lizenz"
              value={pharmacy.apothekenLizenz || 'Nicht hinterlegt'}
            />
            <LockedField
              label="BTM-Erlaubnis"
              value={pharmacy.btmErlaubnis || 'Nicht hinterlegt'}
            />
          </div>
          <p className="mt-4 text-xs text-stone-500 leading-relaxed">
            Diese Daten werden vom releafZ-Team verwaltet. Bei Änderungswünschen:{' '}
            <a
              href="mailto:support@releafz.de"
              className="text-emerald-600 hover:text-emerald-700 transition-colors underline underline-offset-2"
            >
              support@releafz.de
            </a>
          </p>
        </div>

        <div className="border-t border-stone-200" />

        {/* Section B — Documents */}
        <div>
          <h3 className="text-sm font-bold text-stone-800 mb-4">Datenschutz und Verträge</h3>
          <div className="space-y-2">
            {([
              'Datenschutzvereinbarung mit releafZ',
              'Pilot-Partnerschaftsvertrag',
              'Allgemeine Geschäftsbedingungen',
            ] as const).map(label => (
              // TODO: Replace href="#" with actual hosted document URLs per document type
              <a
                key={label}
                href="#"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-xl hover:bg-stone-100 transition-colors group"
              >
                <span className="text-sm text-stone-700 group-hover:text-stone-900 transition-colors">
                  {label}
                </span>
                <ExternalLink size={13} className="text-stone-400 group-hover:text-emerald-600 transition-colors" />
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-stone-200" />

        {/* Section C — Support */}
        <div>
          <h3 className="text-sm font-bold text-stone-800 mb-4">releafZ-Support</h3>
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
            <div className="flex items-center gap-2.5 text-sm text-stone-700">
              <Mail size={14} className="text-emerald-600 flex-shrink-0" />
              <a href="mailto:support@releafz.de" className="hover:text-emerald-700 transition-colors">
                support@releafz.de
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-stone-700">
              <Phone size={14} className="text-emerald-600 flex-shrink-0" />
              {/* TODO: Replace with actual support phone number */}
              <span>+49 (0)30 XXXX-XXXX</span>
            </div>
            <p className="text-xs text-stone-500 pt-2 border-t border-stone-200">
              Bei dringenden Anliegen rufen Sie uns bitte direkt an.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Sidebar ──
type NavItem = { key: ViewType; label: string; icon: React.ElementType; badge?: number }
type NavGroup = { title: string; items: NavItem[] }

type SidebarProps = {
  activeView: ViewType
  onViewChange: (v: ViewType) => void
  pharmacy?: Pharmacy
  pendingOrders: number
  lowStock: number
  onLogout: () => void
  mobileOpen: boolean
  onMobileClose: () => void
}

function Sidebar({ activeView, onViewChange, pharmacy, pendingOrders, lowStock, onLogout, mobileOpen, onMobileClose }: SidebarProps) {
  const groups: NavGroup[] = [
    { title: 'Übersicht', items: [
      { key: 'dashboard', label: 'Übersicht', icon: Activity },
      { key: 'analytics', label: 'Analytik', icon: BarChart3 },
    ] },
    { title: 'Operations', items: [
      { key: 'orders', label: 'Bestellungen', icon: ShoppingCart, badge: pendingOrders },
      { key: 'inventory', label: 'Inventar', icon: Boxes, badge: lowStock },
    ] },
    { title: 'Apotheke', items: [
      { key: 'profile', label: 'Profil', icon: User },
      { key: 'settings', label: 'Einstellungen', icon: Settings },
      { key: 'compliance', label: 'Compliance', icon: Shield },
    ] },
  ]

  const handleNav = (v: ViewType) => { onViewChange(v); onMobileClose() }

  const content = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="px-5 py-6">
        <img src="/logo1.png" alt="reLeafZ" className="h-8 w-auto" />
        <p className="mt-2 text-[11px] font-semibold text-stone-500 uppercase tracking-widest">Apotheke</p>
      </div>

      {/* Pharmacy context card */}
      <div className="mx-3 mt-2 mb-4 p-3 rounded-xl bg-stone-50 border border-stone-200">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {pharmacy?.logoUrl ? (
              <img src={pharmacy.logoUrl} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            ) : (
              <Store size={15} className="text-stone-400" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-stone-900 truncate">{pharmacy?.name || 'Apotheke'}</p>
            <p className="text-[11px] text-stone-500 truncate">{pharmacy?.city || pharmacy?.zip || '—'}</p>
          </div>
        </div>
        {pharmacy?.isSyncMode && (
          <span className="mt-2.5 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-md bg-emerald-100 text-emerald-700">
            <RefreshCw size={9} /> Cannaleo Sync
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="px-3 space-y-5 flex-1 overflow-y-auto">
        {groups.map(group => (
          <div key={group.title}>
            <p className={`${G.sectionTitle} px-2 !mb-2`}>{group.title}</p>
            <div className="space-y-1">
              {group.items.map(item => {
                const active = activeView === item.key
                const Icon = item.icon
                return (
                  <button
                    key={item.key}
                    onClick={() => handleNav(item.key)}
                    className={`${G.navItem} ${active ? G.navItemActive : G.navItemInactive} ${G.focus} w-full text-left`}
                  >
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

      {/* Footer */}
      <div className="mt-auto px-3 py-4 border-t border-stone-200">
        <button onClick={onLogout} className={`${G.btn} ${G.btnSecondary} ${G.focus} w-full flex items-center justify-center gap-2 px-4 py-2.5`}>
          <LogOut size={15} /> Abmelden
        </button>
        <p className="mt-3 text-center text-[10px] text-stone-400 tracking-wide">reLeafZ Apotheken-Portal · v1.0</p>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col w-[248px] lg:w-[260px] flex-shrink-0 ${G.sidebarBg} lg:sticky lg:top-0 lg:h-screen`}>
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onMobileClose} aria-hidden="true" />
          <aside className={`absolute left-0 top-0 h-full w-[280px] ${G.sidebarBg} shadow-2xl animate-fade-in`}>
            <button
              onClick={onMobileClose}
              aria-label="Menü schließen"
              className={`absolute right-3 top-5 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors ${G.focus}`}
            >
              <X size={18} />
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  )
}

// ── TopBar ──
type BellNotification = {
  id: number
  patientName: string
  status: string
  deliveryMethod?: string | null
  createdAt: string
  unread: boolean
}

type TopBarProps = {
  activeView: ViewType
  pharmacy?: Pharmacy
  onMobileMenuToggle: () => void
  onNavigate: (v: ViewType) => void
  onLogout: () => void
  onRefresh: () => void
  bellOpen: boolean
  bellContainerRef: React.RefObject<HTMLDivElement | null>
  unreadCount: number
  notifications: BellNotification[]
  onBellOpen: () => void
  onBellClose: () => void
  onNotificationClick: (orderId: number) => void
}

function TopBar({
  activeView, pharmacy, onMobileMenuToggle, onNavigate, onLogout, onRefresh,
  bellOpen, bellContainerRef, unreadCount, notifications,
  onBellOpen, onBellClose, onNotificationClick,
}: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const initial = (pharmacy?.name?.trim()?.[0] ?? 'A').toUpperCase()

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200">
      <div className="flex items-center justify-between gap-4 px-6 lg:px-10 h-16">
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMobileMenuToggle}
            aria-label="Menü öffnen"
            className={`lg:hidden p-2 -ml-2 rounded-xl text-stone-600 hover:bg-stone-100 transition-colors ${G.focus}`}
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-stone-900 leading-tight truncate">{VIEW_TITLES[activeView]}</h1>
            <p className="text-[11px] text-stone-500 truncate">Apotheke / {VIEW_TITLES[activeView]}</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            aria-label="Aktualisieren"
            className={`p-2 rounded-xl text-stone-500 hover:text-emerald-700 hover:bg-stone-100 transition-colors ${G.focus}`}
          >
            <RefreshCw size={17} />
          </button>
          <div className="relative" ref={bellContainerRef}>
            <button
              aria-label="Benachrichtigungen"
              onClick={bellOpen ? onBellClose : onBellOpen}
              className={`relative p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors ${G.focus}`}
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            {bellOpen && (
              <div className={`absolute right-0 top-12 w-[360px] ${G.cardElevated} z-50 overflow-hidden`}>
                <div className="px-4 py-3 border-b border-stone-200 flex items-center justify-between">
                  <p className="text-sm font-semibold text-stone-900">Benachrichtigungen</p>
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                      {unreadCount} neu
                    </span>
                  )}
                </div>
                <div className="max-h-[420px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-stone-400">
                      Keine offenen Bestellungen.
                    </div>
                  ) : (
                    notifications.map(n => (
                      <button
                        key={n.id}
                        onClick={() => onNotificationClick(n.id)}
                        className={`w-full text-left px-4 py-3 border-b border-stone-100 hover:bg-stone-50 transition flex items-start gap-3 ${n.unread ? 'bg-emerald-50/40' : ''}`}
                      >
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${n.unread ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-900 truncate">
                            Bestellung #{n.id} — {n.patientName}
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <StatusBadge status={n.status} />
                            <DeliveryMethodBadge method={n.deliveryMethod} />
                          </div>
                          <p className="mt-1 text-[11px] text-stone-400">{formatDate(n.createdAt)}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={() => { onBellClose(); onNavigate('orders') }}
                    className="w-full px-4 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-stone-50 border-t border-stone-200 transition"
                  >
                    Alle Bestellungen anzeigen
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Avatar dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Konto-Menü"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className={`flex items-center gap-1.5 rounded-full pl-0.5 pr-1.5 py-0.5 hover:bg-stone-100 transition-colors ${G.focus}`}
            >
              <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold flex items-center justify-center">{initial}</span>
              <ChevronDown size={15} className="text-stone-500" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} aria-hidden="true" />
                <div className="absolute right-0 mt-2 w-60 z-50 rounded-2xl bg-white border border-stone-200 shadow-[0_8px_30px_rgba(15,23,42,0.12)] overflow-hidden" role="menu">
                  <div className="px-4 py-3 border-b border-stone-100">
                    <p className="text-sm font-semibold text-stone-900 truncate">{pharmacy?.name || 'Apotheke'}</p>
                    <p className="text-xs text-stone-500 truncate">{pharmacy?.contactEmail || pharmacy?.contact || '—'}</p>
                  </div>
                  <button
                    onClick={() => { setMenuOpen(false); onNavigate('profile') }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                    role="menuitem"
                  >
                    <User size={15} className="text-stone-500" /> Profil
                  </button>
                  <div className="border-t border-stone-100" />
                  <button
                    onClick={() => { setMenuOpen(false); onLogout() }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                    role="menuitem"
                  >
                    <LogOut size={15} /> Abmelden
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

// ── Main Component ──
export default function PharmacyDashboard() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [showPassword, setShowPassword] = useState(false)
  const [pharmacyId, setPharmacyId] = useState<number | null>(null); const [isClient, setIsClient] = useState(false)
  const [activeView, setActiveView] = useState<ViewType>('dashboard'); const [loading, setLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null)
  const [ordersResponse, setOrdersResponse] = useState<OrdersResponse | null>(null)
  const [deliveryCategoryTab, setDeliveryCategoryTab] = useState<DeliveryCategory | 'ALL'>('ALL')
  const [orderStatusTab, setOrderStatusTab] = useState('ALL'); const [orderSearch, setOrderSearch] = useState('')
  const [orderDateFrom, setOrderDateFrom] = useState(''); const [orderDateTo, setOrderDateTo] = useState(''); const [orderSort, setOrderSort] = useState('createdAt:desc')
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<OrderDetail | null>(null); const [orderDetailLoading, setOrderDetailLoading] = useState(false); const [showOrderDetail, setShowOrderDetail] = useState(false)
  const [inventoryResponse, setInventoryResponse] = useState<InventoryResponse | null>(null)
  const [inventorySearch, setInventorySearch] = useState(''); const [inventoryFormFilter, setInventoryFormFilter] = useState('')
  const [inventoryAvailability, setInventoryAvailability] = useState('all')
  const [inventorySortBy, setInventorySortBy] = useState('name'); const [inventorySortOrder, setInventorySortOrder] = useState<'asc' | 'desc'>('asc')
  const [inventoryLoading, setInventoryLoading] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false); const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState<ProductFormData>(initialProductForm)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)
  const [editingStock, setEditingStock] = useState<{ id: number; value: number } | null>(null); const [productLoading, setProductLoading] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsResponse | null>(null)
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'7d' | '30d' | '90d' | '12m'>('30d'); const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSaveError, setProfileSaveError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [bellSeenAt, setBellSeenAt] = useState<number>(() => {
    if (typeof window === 'undefined') return Date.now()
    const stored = window.localStorage.getItem('pharmacy_bell_seen_at')
    return stored ? parseInt(stored, 10) : Date.now()
  })
  const [patientProfileOpen, setPatientProfileOpen] = useState(false)
  const [selectedPatientKey, setSelectedPatientKey] = useState<string | null>(null)
  const bellContainerRef = useRef<HTMLDivElement>(null)

  function buildPatientKey(o: { patientEmail?: string | null; patientName?: string; patientPhone?: string | null }): string {
    if (o.patientEmail && o.patientEmail.trim()) return `email:${o.patientEmail.trim().toLowerCase()}`
    return `np:${(o.patientName ?? '').trim().toLowerCase()}|${(o.patientPhone ?? '').trim()}`
  }

  const notifications = useMemo(() => {
    const orders = ordersResponse?.data ?? []
    const actionable = orders
      .filter(o => ['PAID', 'PROCESSING', 'PREPARING', 'READY'].includes(o.status))
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)
    return actionable.map(o => ({
      id: o.id,
      patientName: o.patientName,
      status: o.status,
      deliveryMethod: o.deliveryMethod,
      createdAt: o.createdAt,
      unread: new Date(o.createdAt).getTime() > bellSeenAt,
    }))
  }, [ordersResponse?.data, bellSeenAt])

  const unreadCount = notifications.filter(n => n.unread).length

  const patientAggregate = useMemo(() => {
    if (!selectedPatientKey) return null
    const all = ordersResponse?.data ?? []
    const matches = all.filter(o => buildPatientKey(o) === selectedPatientKey)
    if (matches.length === 0) return null

    const sorted = matches.slice().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const totalSpent = matches.reduce((sum, o) => sum + (o.totalPrice ?? 0), 0)
    const first = matches.reduce((acc, o) =>
      new Date(o.createdAt).getTime() < new Date(acc.createdAt).getTime() ? o : acc, matches[0])
    const last = sorted[0]

    const statusBreakdown: Record<string, number> = {}
    matches.forEach(o => {
      statusBreakdown[o.status] = (statusBreakdown[o.status] ?? 0) + 1
    })

    return {
      key: selectedPatientKey,
      name: last.patientName,
      email: last.patientEmail,
      phone: last.patientPhone,
      orderCount: matches.length,
      totalSpent,
      firstOrderAt: first.createdAt,
      lastOrderAt: last.createdAt,
      orders: sorted,
      statusBreakdown,
    }
  }, [selectedPatientKey, ordersResponse?.data])

  const pharmacy = dashboardData?.pharmacy
  const orderStats = useMemo(() => dashboardData?.stats?.orders ?? EMPTY_ORDER_STATS, [dashboardData])
  const revenueStats = useMemo(() => dashboardData?.stats?.revenue ?? EMPTY_REVENUE_STATS, [dashboardData])
  const inventoryStats = useMemo(() => dashboardData?.stats?.inventory ?? EMPTY_INVENTORY_STATS, [dashboardData])
  const recentOrders = useMemo(() => dashboardData?.recentOrders ?? [], [dashboardData])
  const visibleOrders = useMemo(
    () => (ordersResponse?.data ?? []).filter(o =>
      deliveryCategoryTab === 'ALL' ? true : getDeliveryCategory(o.deliveryMethod) === deliveryCategoryTab
    ),
    [ordersResponse, deliveryCategoryTab]
  )

  useEffect(() => { setIsClient(true) }, [])
  useEffect(() => {
    if (!isClient) return
    const checkSession = async () => {
      try {
        const p = localStorage.getItem('pharmacy_id')
        if (!p) return
        await fetchPharmacyDashboard()
        setPharmacyId(parseInt(p))
        await loadDashboard()
      } catch (e) {
        localStorage.removeItem('pharmacy_id')
        setPharmacyId(null)
        setDashboardData(null)
      }
    }
    checkSession()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient])
  useEffect(() => { if (error) { const t = setTimeout(() => setError(null), 6000); return () => clearTimeout(t) } }, [error])

  const loadDashboard = async () => { try { setLoading(true); setError(null); setDashboardData(await fetchPharmacyDashboard()) } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Laden fehlgeschlagen') } finally { setLoading(false) } }
  const loadOrders = useCallback(async (p: number, f?: OrderFilters) => { try { setOrdersLoading(true); setError(null); setOrdersResponse(await fetchPharmacyOrders(p, f)) } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Laden fehlgeschlagen') } finally { setOrdersLoading(false) } }, [])
  const loadOrderDetail = async (id: number) => { if (!pharmacyId) return; try { setOrderDetailLoading(true); setSelectedOrderDetail(await fetchPharmacyOrderDetail(pharmacyId, id)); setShowOrderDetail(true) } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Laden fehlgeschlagen') } finally { setOrderDetailLoading(false) } }

  const handleBellOpen = () => { setBellOpen(true) }

  const handleBellClose = () => {
    setBellOpen(false)
    const now = Date.now()
    setBellSeenAt(now)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('pharmacy_bell_seen_at', String(now))
    }
  }

  const handleNotificationClick = (orderId: number) => {
    handleBellClose()
    loadOrderDetail(orderId)
  }

  const openPatientProfile = (orderRow: { patientEmail?: string | null; patientName?: string; patientPhone?: string | null }) => {
    setSelectedPatientKey(buildPatientKey(orderRow))
    setPatientProfileOpen(true)
  }

  const closePatientProfile = () => {
    setPatientProfileOpen(false)
    setSelectedPatientKey(null)
  }

  useEffect(() => {
    if (!bellOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (bellContainerRef.current && !bellContainerRef.current.contains(e.target as Node)) {
        handleBellClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bellOpen])
  const loadInventory = useCallback(async (p: number, f?: InventoryFilters) => { try { setInventoryLoading(true); setError(null); setInventoryResponse(await fetchPharmacyInventory(p, f)) } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Laden fehlgeschlagen') } finally { setInventoryLoading(false) } }, [])
  const loadAnalytics = useCallback(async (p: number, period: '7d' | '30d' | '90d' | '12m') => { try { setAnalyticsLoading(true); setError(null); setAnalyticsData(await fetchPharmacyAnalytics(p, period)) } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Laden fehlgeschlagen') } finally { setAnalyticsLoading(false) } }, [])

  const handleViewChange = (v: ViewType) => { setActiveView(v); setError(null); if (v === 'orders' && pharmacyId) loadOrders(pharmacyId, buildOrderFilters()); if (v === 'inventory' && pharmacyId) loadInventory(pharmacyId, buildInventoryFilters()); if (v === 'analytics' && pharmacyId) loadAnalytics(pharmacyId, analyticsPeriod) }
  const buildOrderFilters = useCallback((): OrderFilters => { const [sortBy, sortOrder] = orderSort.split(':') as [OrderFilters['sortBy'], OrderFilters['sortOrder']]; return { status: orderStatusTab !== 'ALL' ? orderStatusTab : undefined, search: orderSearch || undefined, from: orderDateFrom || undefined, to: orderDateTo || undefined, sortBy, sortOrder } }, [orderStatusTab, orderSearch, orderDateFrom, orderDateTo, orderSort])
  const buildInventoryFilters = useCallback((): InventoryFilters => ({ search: inventorySearch || undefined, form: inventoryFormFilter || undefined, availability: (inventoryAvailability as InventoryFilters['availability']) || undefined, sortBy: inventorySortBy as InventoryFilters['sortBy'], sortOrder: inventorySortOrder }), [inventorySearch, inventoryFormFilter, inventoryAvailability, inventorySortBy, inventorySortOrder])

  useEffect(() => { if (activeView !== 'orders' || !pharmacyId) return; const t = setTimeout(() => loadOrders(pharmacyId, buildOrderFilters()), 300); return () => clearTimeout(t) }, [orderStatusTab, orderSearch, orderDateFrom, orderDateTo, orderSort, activeView, pharmacyId, loadOrders, buildOrderFilters])
  useEffect(() => { if (activeView !== 'inventory' || !pharmacyId) return; const t = setTimeout(() => loadInventory(pharmacyId, buildInventoryFilters()), 300); return () => clearTimeout(t) }, [inventorySearch, inventoryFormFilter, inventoryAvailability, inventorySortBy, inventorySortOrder, activeView, pharmacyId, loadInventory, buildInventoryFilters])
  useEffect(() => { if (activeView !== 'analytics' || !pharmacyId) return; loadAnalytics(pharmacyId, analyticsPeriod) }, [analyticsPeriod, activeView, pharmacyId, loadAnalytics])

  useEffect(() => {
    if (!pharmacyId) return
    if (activeView === 'orders') return

    const tick = () => {
      fetchPharmacyOrders(pharmacyId, buildOrderFilters())
        .then((next) => {
          setOrdersResponse(next)
        })
        .catch(() => {
          // intentional: background poll, no UI noise on transient failures
        })
    }

    const interval = setInterval(tick, 30_000)
    return () => clearInterval(interval)
  }, [pharmacyId, activeView, buildOrderFilters])

  // pharmacy_id in localStorage is UI-only — it restores the dashboard view on reload.
  // All actual auth is enforced via the httpOnly session cookie on every API call.
  // The backend must verify that the session matches the requested pharmacyId on every endpoint.
  const handleLogin = async () => { try { setLoading(true); setError(null); const d = await pharmacyLogin(email, password); if (d.pharmacy) { setPharmacyId(d.pharmacy.id); localStorage?.setItem('pharmacy_id', d.pharmacy.id.toString()); await loadDashboard() } else setError('Login fehlgeschlagen') } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Anmeldung fehlgeschlagen') } finally { setLoading(false) } }
  const handleLogout = () => { setPharmacyId(null); setDashboardData(null); setOrdersResponse(null); setInventoryResponse(null); setAnalyticsData(null); setEmail(''); setPassword(''); setActiveView('dashboard'); setError(null); localStorage?.removeItem('pharmacy_id') }
  const handleSaveProfile = useCallback(async (patch: Partial<EditableProfileFields>) => {
    if (!pharmacyId) return
    setProfileSaving(true)
    setProfileSaveError(null)
    try {
      const updated = await updatePharmacyProfile(pharmacyId, patch)
      setDashboardData(prev => prev ? { ...prev, pharmacy: updated } : prev)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Aktualisierung fehlgeschlagen — bitte erneut versuchen'
      setProfileSaveError(msg)
      throw e
    } finally {
      setProfileSaving(false)
    }
  }, [pharmacyId])
  const handleUpdateStatus = async (id: number, s: string) => { if (!pharmacyId) return; try { setOrdersLoading(true); await updateOrderStatus(pharmacyId, id, s); await loadOrders(pharmacyId, buildOrderFilters()); await loadDashboard() } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Fehler') } finally { setOrdersLoading(false) } }
  const handleMarkReady = async (id: number) => { if (!pharmacyId) return; try { setOrdersLoading(true); await markOrderReady(pharmacyId, id); await loadOrders(pharmacyId, buildOrderFilters()); await loadDashboard() } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Fehler') } finally { setOrdersLoading(false) } }
  const handleDispatch = async (id: number) => {
    if (!pharmacyId) return;
    try {
      setOrdersLoading(true);
      await dispatchOrder(pharmacyId, id);
      await loadOrders(pharmacyId, buildOrderFilters());
      await loadDashboard();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Dispatch fehlgeschlagen');
    } finally {
      setOrdersLoading(false);
    }
  }

  const handleAddProduct = () => { setEditingProduct(null); setProductForm(initialProductForm); setShowProductModal(true) }
  const handleEditProduct = (p: Product) => { setEditingProduct(p); setProductForm({ name: p.name, form: p.form, thcPercent: p.thcPercent, cbdPercent: p.cbdPercent, price: p.price, unit: p.unit, stock: p.stock, imageUrl: p.imageUrl || '' }); setShowProductModal(true) }
  const handleFormChange = (field: keyof ProductFormData, value: string | number) => { setProductForm(prev => { const u = { ...prev, [field]: value }; if (field === 'form') u.unit = PRODUCT_UNITS[value as string] || 'gram'; return u }) }
  const handleSaveProduct = async () => { if (!pharmacyId) return; if (!productForm.name.trim()) { setError('Bitte Produktname eingeben'); return }; if (productForm.price <= 0) { setError('Bitte gültigen Preis eingeben'); return }; try { setProductLoading(true); if (editingProduct) await updateProduct(editingProduct.id, productForm); else await createProduct(productForm); setShowProductModal(false); setEditingProduct(null); setProductForm(initialProductForm); await loadInventory(pharmacyId, buildInventoryFilters()); await loadDashboard() } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Fehler') } finally { setProductLoading(false) } }
  const handleDeleteProduct = async (id: number) => { if (!pharmacyId) return; try { setProductLoading(true); await deleteProduct(id); setShowDeleteConfirm(null); await loadInventory(pharmacyId, buildInventoryFilters()); await loadDashboard() } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Fehler') } finally { setProductLoading(false) } }
  const handleStockUpdate = async () => { if (!editingStock || !pharmacyId) return; try { setProductLoading(true); await updateProduct(editingStock.id, { stock: editingStock.value }); setEditingStock(null); await loadInventory(pharmacyId, buildInventoryFilters()) } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Fehler') } finally { setProductLoading(false) } }
  const handleInventorySortToggle = (col: string) => { if (inventorySortBy === col) setInventorySortOrder(p => p === 'asc' ? 'desc' : 'asc'); else { setInventorySortBy(col); setInventorySortOrder('asc') } }

  const renderNextStatusButton = (
    order: { id: number; status: string; deliveryMethod?: string | null },
    syncDisabled?: boolean
  ) => {
    const cat = getDeliveryCategory(order.deliveryMethod);
    let allowed = STATUS_TRANSITIONS[order.status] ?? [];
    if (order.status === 'READY') {
      allowed = cat === 'BOTENDIENST' ? ['DISPATCHED']
              : cat === 'PICKUP'      ? ['PICKED_UP']
              : cat === 'MAIL_ORDER'  ? ['DISPATCHED']
              : ['PICKED_UP', 'DISPATCHED'];
    }
    if (!allowed.length) return null;
    return (
      <div className="flex gap-2">
        {allowed.map(ns => {
          const label = ACTION_LABELS[cat]?.[ns] ?? STATUS_TRANSITION_LABELS[ns];
          if (!label) return null;
          const onClick =
            ns === 'READY'      ? () => handleMarkReady(order.id)
            : ns === 'DISPATCHED'
                ? (cat === 'BOTENDIENST'
                    ? () => handleDispatch(order.id)
                    : () => handleUpdateStatus(order.id, 'DISPATCHED'))
            : () => handleUpdateStatus(order.id, ns);
          return (
            <button
              key={ns}
              onClick={syncDisabled ? undefined : onClick}
              disabled={ordersLoading || syncDisabled}
              title={syncDisabled ? 'Automatische Sync via Cannaleo aktiv' : undefined}
              className={`${CATEGORY_LIGHT[cat].solidBtn} px-3.5 py-1.5 ${G.btn} ${G.focus} flex items-center gap-1.5 ${syncDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {ordersLoading && !syncDisabled && <Loader2 className="animate-spin" size={12} />}
              {label}
            </button>
          );
        })}
      </div>
    );
  }

  // ── Loading gate ──
  if (!isClient) return (
    <div className={`min-h-screen flex items-center justify-center font-sans ${G.appBg}`}>
      <div className="flex flex-col items-center gap-4">
        <img src="/logo1.png" alt="reLeafZ" className="h-40 w-auto animate-pulse" />
        <div className="flex gap-1.5">{[0, 150, 300].map(d => <div key={d} className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}</div>
      </div>
    </div>
  )

  // ── Login ──
  if (!pharmacyId) return (
    <div className={`min-h-screen flex items-center justify-center px-4 font-sans ${G.appBg}`}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <img src="/logo1.png" alt="reLeafZ" className="h-14 w-auto mb-5 mx-auto" />
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Apotheken-Login</h1>
          <p className="text-stone-500 mt-1.5 text-sm">Melden Sie sich im Apotheken-Dashboard an</p>
        </div>
        <div className={`${G.cardElevated} p-8`}>
          {error && <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600 flex items-center gap-2.5"><AlertCircle size={16} className="flex-shrink-0" />{error}</div>}
          <div className="space-y-4">
            <div><label className={G.label}>E-Mail Adresse</label><div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} /><input type="email" placeholder="apotheke@beispiel.de" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} className={`w-full pl-11 pr-4 py-3 ${G.input}`} /></div></div>
            <div><label className={G.label}>Passwort</label><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={18} /><input type={showPassword ? 'text' : 'password'} placeholder="••••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} className={`w-full pl-11 pr-11 py-3 ${G.input}`} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'} className={`absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors ${G.focus}`}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
            <button onClick={handleLogin} disabled={loading} className={`w-full py-3 mt-2 ${G.btn} ${G.btnPrimary} ${G.focus} flex items-center justify-center gap-2`}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <><LogOut size={16} className="rotate-180" /> Anmelden</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // ── Dashboard shell ──
  return (
    <div className={`flex min-h-screen font-sans ${G.appBg}`}>
      <Sidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        pharmacy={pharmacy}
        pendingOrders={orderStats.pending}
        lowStock={inventoryStats.lowStock}
        onLogout={handleLogout}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <main className="flex-1 min-w-0 flex flex-col">
        <TopBar
          activeView={activeView}
          pharmacy={pharmacy}
          onMobileMenuToggle={() => setMobileSidebarOpen(true)}
          onNavigate={handleViewChange}
          onLogout={handleLogout}
          onRefresh={() => loadDashboard()}
          bellOpen={bellOpen}
          bellContainerRef={bellContainerRef}
          unreadCount={unreadCount}
          notifications={notifications}
          onBellOpen={handleBellOpen}
          onBellClose={handleBellClose}
          onNotificationClick={handleNotificationClick}
        />

        {/* Toast */}
        {error && (
          <div className="fixed top-20 right-4 z-[100] animate-fade-in">
            <div className={`${G.cardElevated} px-4 py-3 flex items-center gap-3 max-w-sm !border-rose-200`}>
              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center flex-shrink-0"><AlertTriangle size={15} className="text-rose-600" /></div>
              <p className="text-sm text-rose-700 flex-1">{error}</p>
              <button onClick={() => setError(null)} aria-label="Schließen" className="text-stone-400 hover:text-stone-600 transition-colors"><X size={15} /></button>
            </div>
          </div>
        )}

        <div className="flex-1 px-6 lg:px-10 py-6 lg:py-8 overflow-y-auto">

        {/* ── Cannaleo sync banner ── */}
        {pharmacy?.isSyncMode && (
          <div className="mb-6 flex items-center gap-3 p-4 rounded-2xl border border-emerald-200 bg-emerald-50">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <RefreshCw size={16} className="text-emerald-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-900">Cannaleo Sync aktiv</p>
              <p className="text-xs text-emerald-700">
                Bestellungen werden automatisch aktualisiert. Manuelle Statusänderungen sind deaktiviert.
              </p>
            </div>
          </div>
        )}

        {/* ── DASHBOARD ── */}
        {activeView === 'dashboard' && (loading ? (
          <div className="space-y-6"><Skeleton className="h-16" /><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div><Skeleton className="h-64" /></div>
        ) : (
          <div className="space-y-8">
            {/* Hero greeting */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-2xl font-bold text-stone-900 tracking-tight truncate">Guten Tag, {pharmacy?.name || 'Apotheke'}</h2>
                <p className="text-sm text-stone-500 mt-1">Hier ist Ihre Apothekenübersicht für heute.</p>
              </div>
              <div className="flex flex-col sm:items-end gap-2 flex-shrink-0">
                <p className="text-sm text-stone-500 capitalize">{new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold ring-1 ring-emerald-200">
                  <ShoppingCart size={12} /> <span className="tabular-nums">{orderStats.pending}</span> offene Bestellungen
                </span>
              </div>
            </div>

            <div><h3 className={G.sectionTitle}>Bestellungen</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <StatCard label="Ausstehend" value={orderStats.pending} icon={Clock} tone="amber" />
                <StatCard label="Bezahlt" value={orderStats.paid} icon={CreditCard} tone="violet" />
                <StatCard label="In Bearbeitung" value={orderStats.processing} icon={Loader2} tone="blue" />
                <StatCard label="Bereit" value={orderStats.ready} icon={Package} tone="teal" />
                <StatCard label="Geliefert" value={orderStats.delivered} icon={CheckCircle2} tone="emerald" />
                <StatCard label="Gesamt" value={orderStats.total} icon={ShoppingCart} tone="stone" />
              </div>
            </div>
            <div><h3 className={G.sectionTitle}>Umsatz</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Heute" value={formatEUR(revenueStats.today)} icon={DollarSign} tone="emerald" />
                <StatCard label="Diese Woche" value={formatEUR(revenueStats.thisWeek)} icon={Calendar} tone="emerald" />
                <StatCard label="Dieser Monat" value={formatEUR(revenueStats.thisMonth)} icon={TrendingUp} tone="emerald" />
                <StatCard label="Gesamt" value={formatEUR(revenueStats.allTime)} icon={BarChart3} tone="emerald" />
              </div>
            </div>
            <div><h3 className={G.sectionTitle}>Inventar</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Produkte" value={inventoryStats.totalProducts} icon={Package} tone="stone" />
                <StatCard label="Niedriger Bestand" value={inventoryStats.lowStock} icon={AlertTriangle} tone="amber" />
                <StatCard label="Nicht vorrätig" value={inventoryStats.outOfStock} icon={XCircle} tone="rose" />
                <StatCard label="Inventarwert" value={formatEUR(inventoryStats.totalValue)} icon={DollarSign} tone="emerald" />
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`${G.sectionTitle} !mb-0`}>Letzte Bestellungen</h3>
                <button onClick={() => handleViewChange('orders')} className={`text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors ${G.focus} rounded-md`}>Alle anzeigen <ArrowUpRight size={12} /></button>
              </div>
              <div className={`${G.card} overflow-hidden`}>
                <table className="w-full">
                  <thead><tr className="bg-stone-50 border-b border-stone-200">
                    <th className={`${G.th} text-left`}>Bestellung</th><th className={`${G.th} text-left`}>Patient</th><th className={`${G.th} text-left`}>Status</th><th className={`${G.th} text-right`}>Betrag</th><th className={`${G.th} text-right`}>Datum</th>
                  </tr></thead>
                  <tbody className="divide-y divide-stone-100">
                    {recentOrders.map(o => (
                      <tr key={o.id} className="hover:bg-stone-50/70 cursor-pointer transition-colors" onClick={() => loadOrderDetail(o.id)}>
                        <td className={`${G.td} text-xs font-mono text-stone-400`}>#{o.id}</td>
                        <td className={G.td}>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); openPatientProfile(o) }}
                            className="group text-left hover:bg-stone-50 -mx-2 px-2 py-1 rounded-md transition"
                          >
                            <p className="text-sm font-medium text-stone-900 group-hover:text-emerald-700 underline-offset-2 group-hover:underline">{o.patientName}</p>
                          </button>
                        </td>
                        <td className={G.td}><StatusBadge status={o.status} /></td>
                        <td className={`${G.td} text-sm font-semibold text-stone-900 text-right tabular-nums`}>{formatEUR(o.totalPrice)}</td>
                        <td className={`${G.td} text-xs text-stone-400 text-right`}>{formatShortDate(o.createdAt)}</td>
                      </tr>
                    ))}
                    {!recentOrders.length && <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-stone-400">Keine Bestellungen</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pharmacy Info */}
            <div className={`${G.card} p-6`}>
              <h3 className={G.sectionTitle}>Apotheken-Informationen</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[{ l: 'Name', v: pharmacy?.name }, { l: 'PLZ', v: pharmacy?.zip }, { l: 'Kontakt', v: pharmacy?.contact }, { l: 'Lieferbereich', v: pharmacy?.zipRange || '—' }].map(i => (
                  <div key={i.l} className="min-w-0 overflow-hidden"><p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wide mb-1">{i.l}</p><p className="text-sm font-semibold text-stone-800 break-words" title={i.v || '—'}>{i.v || '—'}</p></div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* ── ORDERS ── */}
        {activeView === 'orders' && (
          <div className="space-y-4">
            <div className={`${G.card} p-4`}>
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} /><input type="text" placeholder="Patient suchen..." value={orderSearch} onChange={e => setOrderSearch(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 ${G.input}`} /></div>
                <div className="flex items-center gap-2">
                  <input type="date" value={orderDateFrom} onChange={e => setOrderDateFrom(e.target.value)} className={`px-3 py-2.5 text-xs ${G.input}`} />
                  <span className="text-stone-400 text-xs">—</span>
                  <input type="date" value={orderDateTo} onChange={e => setOrderDateTo(e.target.value)} className={`px-3 py-2.5 text-xs ${G.input}`} />
                </div>
                <select value={orderSort} onChange={e => setOrderSort(e.target.value)} className={`px-3 py-2.5 text-xs min-w-[180px] ${G.input}`}>{SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {([
                { key: 'ALL' as const,         label: 'Alle',        icon: '·' },
                { key: 'BOTENDIENST' as const, label: 'Botendienst', icon: '🚴' },
                { key: 'MAIL_ORDER' as const,  label: 'Versand',     icon: '📦' },
                { key: 'PICKUP' as const,      label: 'Abholung',    icon: '📍' },
              ]).map(tab => {
                const isActive = deliveryCategoryTab === tab.key;
                const count = tab.key === 'ALL'
                  ? (ordersResponse?.data.length ?? 0)
                  : (ordersResponse?.data.filter(o => getDeliveryCategory(o.deliveryMethod) === tab.key).length ?? 0);
                return (
                  <button
                    key={tab.key}
                    onClick={() => setDeliveryCategoryTab(tab.key)}
                    className={`px-4 py-2 ${G.btn} ${G.focus} rounded-xl flex items-center gap-2 ${isActive ? G.tabActive : G.tabInactive}`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md tabular-nums ${
                      isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'
                    }`}>{count}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-1.5 flex-wrap">{ORDER_STATUS_TABS.map(tab => {
              const count = tab.key === 'ALL' ? Object.values(ordersResponse?.statusCounts || {}).reduce((a, b) => a + b, 0) : (ordersResponse?.statusCounts?.[tab.key] || 0)
              return <button key={tab.key} onClick={() => setOrderStatusTab(tab.key)} className={`px-3.5 py-2 ${G.btn} ${G.focus} rounded-xl flex items-center gap-1.5 ${orderStatusTab === tab.key ? G.tabActive : G.tabInactive}`}>{tab.label}<span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md tabular-nums ${orderStatusTab === tab.key ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'}`}>{count}</span></button>
            })}</div>

            {ordersLoading ? <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
            : !visibleOrders.length ? <div className={G.card}><EmptyState icon={ShoppingCart} title="Keine Bestellungen" description={`Keine Bestellungen${orderStatusTab !== 'ALL' || deliveryCategoryTab !== 'ALL' ? ' für diese Auswahl' : ''}.`} /></div>
            : <>
              <div className={`${G.card} overflow-hidden`}>
                <table className="w-full">
                  <thead><tr className="bg-stone-50 border-b border-stone-200">
                    <th className={`${G.th} text-left`}>ID</th><th className={`${G.th} text-left`}>Patient</th><th className={`${G.th} text-left`}>Status</th><th className={`${G.th} text-left`}>Lieferung</th><th className={`${G.th} text-right`}>Betrag</th><th className={`${G.th} text-right hidden md:table-cell`}>Erstellt</th><th className={`${G.th} text-right hidden lg:table-cell`}>Aktualisiert</th><th className={`${G.th} text-right`}>Aktionen</th>
                  </tr></thead>
                  <tbody className="divide-y divide-stone-100">{visibleOrders.map(o => {
                    const cat = getDeliveryCategory(o.deliveryMethod);
                    const accent = CATEGORY_ACCENTS[cat];
                    return (
                    <tr key={o.id} className={`group border-l-4 ${accent.border} hover:bg-stone-50/70 transition-colors`}>
                      <td className={`${G.td} text-xs font-mono text-stone-400`}>#{o.id}</td>
                      <td className={G.td}>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); openPatientProfile(o) }}
                          className="group text-left hover:bg-stone-50 -mx-2 px-2 py-1 rounded-md transition"
                        >
                          <p className="text-sm font-medium text-stone-900 group-hover:text-emerald-700 underline-offset-2 group-hover:underline">{o.patientName}</p>
                          <p className="text-[11px] text-stone-400">{o.patientEmail}</p>
                        </button>
                      </td>
                      <td className={G.td}><StatusBadge status={o.status} /></td>
                      <td className={G.td}><DeliveryMethodBadge method={o.deliveryMethod} /></td>
                      <td className={`${G.td} text-sm font-semibold text-stone-900 text-right tabular-nums`}>{o.totalPrice ? formatEUR(o.totalPrice) : '—'}</td>
                      <td className={`${G.td} text-xs text-stone-400 text-right hidden md:table-cell`}>{formatShortDate(o.createdAt)}</td>
                      <td className={`${G.td} text-xs text-stone-400 text-right hidden lg:table-cell`}>{formatShortDate(o.updatedAt)}</td>
                      <td className={`${G.td} text-right`}><div className="flex items-center justify-end gap-2"><button onClick={() => loadOrderDetail(o.id)} aria-label="Details anzeigen" className={`p-1.5 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${G.focus}`}><ExternalLink size={13} /></button>{renderNextStatusButton({ id: o.id, status: o.status, deliveryMethod: o.deliveryMethod }, pharmacy?.isSyncMode)}</div></td>
                    </tr>
                    );
                  })}</tbody>
                </table>
              </div>
              {(ordersResponse?.pagination.totalPages ?? 0) > 1 && <div className="flex items-center justify-between"><p className="text-xs text-stone-500 tabular-nums">Seite {ordersResponse?.pagination.page}/{ordersResponse?.pagination.totalPages} • {ordersResponse?.pagination.total} Ergebnisse</p><div className="flex gap-1.5">
                <button disabled={(ordersResponse?.pagination.page ?? 1) <= 1} onClick={() => { if (pharmacyId && ordersResponse) { const f = buildOrderFilters(); f.page = ordersResponse.pagination.page - 1; loadOrders(pharmacyId, f) } }} aria-label="Vorherige Seite" className={`p-2 ${G.btnSecondary} rounded-xl disabled:opacity-30 ${G.focus}`}><ChevronLeft size={14} className="text-stone-600" /></button>
                <button disabled={(ordersResponse?.pagination.page ?? 1) >= (ordersResponse?.pagination.totalPages ?? 1)} onClick={() => { if (pharmacyId && ordersResponse) { const f = buildOrderFilters(); f.page = ordersResponse.pagination.page + 1; loadOrders(pharmacyId, f) } }} aria-label="Nächste Seite" className={`p-2 ${G.btnSecondary} rounded-xl disabled:opacity-30 ${G.focus}`}><ChevronRight size={14} className="text-stone-600" /></button>
              </div></div>}
            </>}
          </div>
        )}

        {/* ── ORDER DETAIL MODAL ── */}
        {showOrderDetail && (
          <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => { setShowOrderDetail(false); setSelectedOrderDetail(null) }}>
            <div className={`${G.cardElevated} max-w-3xl w-full max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
              {orderDetailLoading ? <div className="p-10 space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-16" /><Skeleton className="h-32" /><Skeleton className="h-24" /></div>
              : selectedOrderDetail ? <>
                <div className={`sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10 border-l-4 ${CATEGORY_ACCENTS[getDeliveryCategory(selectedOrderDetail.deliveryMethod)].border}`}>
                  <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center"><FileText size={15} className="text-stone-500" /></div><div><h2 className="text-lg font-bold text-stone-900">Bestellung #{selectedOrderDetail.id}</h2><div className="flex flex-wrap items-center gap-2 mt-1"><StatusBadge status={selectedOrderDetail.status} /><DeliveryMethodBadge method={selectedOrderDetail.deliveryMethod} /></div></div></div>
                  <button onClick={() => { setShowOrderDetail(false); setSelectedOrderDetail(null) }} aria-label="Schließen" className={`p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-all ${G.focus}`}><X size={18} /></button>
                </div>
                <div className="p-6 space-y-6 bg-stone-50">
                  {/* Timeline */}
                  <div className={`${G.card} p-5`}>
                    {(() => {
                      const detailCategory = getDeliveryCategory(selectedOrderDetail.deliveryMethod);
                      const detailPipeline = DELIVERY_PIPELINES[detailCategory];
                      const stepIconByKey: Record<string, React.ElementType> = {
                        APPROVED: CheckCircle, PAID: CreditCard, PROCESSING: Loader2,
                        READY: Package, DISPATCHED: Truck, PICKED_UP: Truck, DELIVERED: CheckCircle2,
                      };
                      return (
                        <div className="flex items-center justify-between overflow-x-auto gap-1">{detailPipeline.map((step, idx) => {
                          const Icon = stepIconByKey[step.key] ?? Package;
                          const done = getStatusOrder(selectedOrderDetail.status) >= getStatusOrder(step.key);
                          const cur = selectedOrderDetail.status.toUpperCase() === step.key;
                          return <div key={step.key} className="flex items-center flex-1 min-w-0"><div className="flex flex-col items-center flex-shrink-0">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${cur ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : done ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-400'}`}><Icon size={15} /></div>
                            <p className={`text-[10px] mt-1.5 text-center font-medium whitespace-nowrap ${done ? 'text-emerald-700' : 'text-stone-400'}`}>{step.label}</p>
                          </div>{idx < detailPipeline.length - 1 && <div className={`flex-1 h-0.5 mx-1.5 rounded-full ${done ? 'bg-emerald-200' : 'bg-stone-200'}`} />}</div>
                        })}</div>
                      );
                    })()}
                  </div>
                  {/* Patient */}
                  <div><h3 className={G.label}>Patient</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-3">{[
                    { icon: User, l: 'Name', v: selectedOrderDetail.patientName }, { icon: Mail, l: 'E-Mail', v: selectedOrderDetail.patientEmail }, { icon: Phone, l: 'Telefon', v: selectedOrderDetail.patientPhone }
                  ].map(i => <div key={i.l} className={`flex items-center gap-3 ${G.card} p-3.5`}><div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0"><i.icon size={14} className="text-stone-500" /></div><div className="min-w-0"><p className="text-[10px] font-medium text-stone-400 uppercase">{i.l}</p><p className="text-sm font-medium text-stone-800 truncate">{i.v}</p></div></div>)}</div></div>
                  {selectedOrderDetail.symptoms && <div><h3 className={G.label}>Symptome</h3><p className={`text-sm text-stone-600 ${G.card} p-4 leading-relaxed`}>{selectedOrderDetail.symptoms}</p></div>}
                  {/* Products */}
                  {selectedOrderDetail.selectedProducts?.length > 0 && <div><h3 className={G.label}>Produkte</h3><div className={`${G.card} overflow-hidden`}><table className="w-full"><thead><tr className="bg-stone-50 border-b border-stone-200"><th className={`${G.th} text-left`}>Produkt</th><th className={`${G.th} text-center`}>Menge</th><th className={`${G.th} text-right`}>Preis</th></tr></thead><tbody className="divide-y divide-stone-100">{selectedOrderDetail.selectedProducts.map((p, i) => <tr key={i}><td className={`${G.td} text-sm text-stone-700`}>{p.productName}</td><td className={`${G.td} text-sm text-center text-stone-500 tabular-nums`}>{p.quantity}</td><td className={`${G.td} text-sm text-right font-medium text-stone-800 tabular-nums`}>{p.price ? formatEUR(p.price) : '—'}</td></tr>)}</tbody><tfoot><tr className="border-t border-stone-200"><td colSpan={2} className={`${G.td} text-sm font-bold text-stone-900`}>Gesamt</td><td className={`${G.td} text-sm font-bold text-right text-emerald-700 tabular-nums`}>{formatEUR(selectedOrderDetail.totalPrice)}</td></tr></tfoot></table></div></div>}
                  {/* Payment flags */}
                  <div className="grid grid-cols-2 gap-3">{[{ l: 'Rezept bezahlt', v: selectedOrderDetail.prescriptionPaid }, { l: 'Produkte bezahlt', v: selectedOrderDetail.productsPaid }].map(i => <div key={i.l} className={`rounded-xl p-3.5 border ${i.v ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-stone-200'}`}><p className="text-[10px] font-bold text-stone-400 uppercase mb-1">{i.l}</p><p className={`text-sm font-bold ${i.v ? 'text-emerald-700' : 'text-stone-400'}`}>{i.v ? 'Ja' : 'Nein'}</p></div>)}</div>
                  {/* Payment history */}
                  {selectedOrderDetail.payments?.length > 0 && <div><h3 className={G.label}>Zahlungshistorie</h3><div className={`${G.card} overflow-hidden`}><table className="w-full"><thead><tr className="bg-stone-50 border-b border-stone-200"><th className={`${G.th} text-left`}>Typ</th><th className={`${G.th} text-left`}>Methode</th><th className={`${G.th} text-right`}>Betrag</th><th className={`${G.th} text-left`}>Status</th><th className={`${G.th} text-right`}>Datum</th></tr></thead><tbody className="divide-y divide-stone-100">{selectedOrderDetail.payments.map(p => <tr key={p.id}><td className={`${G.td} text-sm capitalize text-stone-600`}>{p.type}</td><td className={`${G.td} text-sm capitalize text-stone-500`}>{p.method}</td><td className={`${G.td} text-sm text-right font-medium text-stone-800 tabular-nums`}>{formatEUR(p.amount)}</td><td className={G.td}><span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${p.status === 'completed' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : p.status === 'pending' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-200' : 'bg-stone-100 text-stone-500'}`}>{p.status}</span></td><td className={`${G.td} text-xs text-stone-400 text-right`}>{formatDate(p.completedAt || p.createdAt)}</td></tr>)}</tbody></table></div></div>}
                  {selectedOrderDetail.prescriptionPdfPath && <a href={`${API_BASE}/api/treatment/${selectedOrderDetail.treatmentRequestId}/prescription`} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl hover:bg-emerald-100 transition-all ${G.focus}`}><FileText size={16} /> Rezept PDF <ExternalLink size={12} /></a>}
                  <div className="flex gap-6 text-xs text-stone-400 pt-3 border-t border-stone-200"><span>Erstellt: {formatDate(selectedOrderDetail.createdAt)}</span><span>Aktualisiert: {formatDate(selectedOrderDetail.updatedAt)}</span></div>
                  {STATUS_TRANSITIONS[selectedOrderDetail.status]?.length > 0 && <div className="pt-1">{renderNextStatusButton({ id: selectedOrderDetail.id, status: selectedOrderDetail.status, deliveryMethod: selectedOrderDetail.deliveryMethod }, pharmacy?.isSyncMode)}</div>}
                </div>
              </> : <div className="p-10 text-center text-stone-400 text-sm">Nicht verfügbar</div>}
            </div>
          </div>
        )}

        {patientProfileOpen && patientAggregate && (
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closePatientProfile}
          >
            <div
              className={`${G.cardElevated} max-w-3xl w-full max-h-[90vh] overflow-y-auto`}
              onClick={e => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 font-bold">
                    {(patientAggregate.name ?? '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-stone-900">{patientAggregate.name}</h2>
                    <p className="text-xs text-stone-500">Patient-Profil — abgeleitet aus Ihren Bestellungen</p>
                  </div>
                </div>
                <button onClick={closePatientProfile} aria-label="Schließen" className="p-2 rounded-xl hover:bg-stone-100 transition">
                  <X size={18} className="text-stone-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className={G.label}>Kontakt</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { icon: Mail, l: 'E-Mail', v: patientAggregate.email ?? '—' },
                      { icon: Phone, l: 'Telefon', v: patientAggregate.phone ?? '—' },
                    ].map(i => (
                      <div key={i.l} className="flex items-center gap-3 bg-stone-50 border border-stone-200 rounded-xl p-3.5">
                        <div className="w-8 h-8 rounded-lg bg-white border border-stone-200 flex items-center justify-center flex-shrink-0">
                          <i.icon size={14} className="text-stone-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide">{i.l}</p>
                          <p className="text-sm font-medium text-stone-700 truncate">{i.v}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { l: 'Bestellungen', v: String(patientAggregate.orderCount), tone: 'emerald' as const },
                    { l: 'Gesamtumsatz', v: formatEUR(patientAggregate.totalSpent), tone: 'blue' as const },
                    { l: 'Erste Bestellung', v: formatDate(patientAggregate.firstOrderAt), tone: 'stone' as const },
                    { l: 'Letzte Bestellung', v: formatDate(patientAggregate.lastOrderAt), tone: 'stone' as const },
                  ].map(s => (
                    <div key={s.l} className={`${G.card} p-4`}>
                      <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide mb-1">{s.l}</p>
                      <p className={`text-base font-bold tabular-nums ${s.tone === 'emerald' ? 'text-emerald-700' : s.tone === 'blue' ? 'text-blue-700' : 'text-stone-900'}`}>{s.v}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className={G.label}>Bestellverlauf</h3>
                  <div className={`${G.card} overflow-hidden`}>
                    <table className="w-full">
                      <thead className="bg-stone-50 border-b border-stone-200">
                        <tr>
                          <th className={`${G.th} text-left`}>ID</th>
                          <th className={`${G.th} text-left`}>Status</th>
                          <th className={`${G.th} text-left`}>Lieferung</th>
                          <th className={`${G.th} text-right`}>Betrag</th>
                          <th className={`${G.th} text-right`}>Datum</th>
                          <th className={`${G.th} text-right`}></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {patientAggregate.orders.map(o => (
                          <tr key={o.id} className="hover:bg-stone-50 transition">
                            <td className={G.td}>#{o.id}</td>
                            <td className={G.td}><StatusBadge status={o.status} /></td>
                            <td className={G.td}><DeliveryMethodBadge method={o.deliveryMethod} /></td>
                            <td className={`${G.td} text-right font-medium tabular-nums`}>{o.totalPrice ? formatEUR(o.totalPrice) : '—'}</td>
                            <td className={`${G.td} text-right text-stone-500 tabular-nums`}>{formatDate(o.createdAt)}</td>
                            <td className={`${G.td} text-right`}>
                              <button
                                onClick={() => { closePatientProfile(); loadOrderDetail(o.id) }}
                                className="text-emerald-700 hover:text-emerald-800 text-xs font-semibold"
                              >
                                Anzeigen →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <p className="text-[11px] text-stone-400 italic">
                  Hinweis: Dieses Profil basiert auf den Bestellungen, die Ihre Apotheke aus releafZ erhalten hat.
                  Vollständige Patientenhistorie und Medikationsverlauf werden vom verschreibenden Arzt verwaltet.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── INVENTORY ── */}
        {activeView === 'inventory' && (
          <div className="space-y-4">
            {inventoryResponse?.summary && <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Produkte" value={inventoryResponse.summary.totalProducts} icon={Package} tone="stone" />
              <StatCard label="Niedriger Bestand" value={inventoryResponse.summary.lowStock} icon={AlertTriangle} tone="amber" />
              <StatCard label="Nicht vorrätig" value={inventoryResponse.summary.outOfStock} icon={XCircle} tone="rose" />
              <StatCard label="Inventarwert" value={formatEUR(inventoryResponse.summary.totalValue)} icon={DollarSign} tone="emerald" />
            </div>}
            <div className={`${G.card} p-4`}><div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} /><input type="text" placeholder="Produkt suchen..." value={inventorySearch} onChange={e => setInventorySearch(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 ${G.input}`} /></div>
              <select value={inventoryFormFilter} onChange={e => setInventoryFormFilter(e.target.value)} className={`px-3 py-2.5 text-xs min-w-[140px] ${G.input}`}><option value="">Alle Formen</option>{PRODUCT_FORMS.map(f => <option key={f} value={f}>{FORM_LABELS[f]}</option>)}</select>
              <button onClick={handleAddProduct} className={`${G.btn} ${G.btnPrimary} ${G.focus} flex items-center gap-2 px-4 py-2.5 whitespace-nowrap`}><Plus size={15} /> Produkt hinzufügen</button>
            </div></div>
            <div className="flex gap-1.5 flex-wrap">{AVAILABILITY_TABS.map(tab => <button key={tab.key} onClick={() => setInventoryAvailability(tab.key)} className={`px-3.5 py-2 ${G.btn} ${G.focus} rounded-xl ${inventoryAvailability === tab.key ? G.tabActive : G.tabInactive}`}>{tab.label}</button>)}</div>

            {inventoryLoading ? <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
            : !inventoryResponse?.data.length ? <div className={G.card}><EmptyState icon={Package} title="Keine Produkte" description="Fügen Sie Ihr erstes Produkt hinzu."
              action={<button onClick={handleAddProduct} className={`${G.btn} ${G.btnPrimary} ${G.focus} flex items-center gap-2 px-4 py-2.5`}><Plus size={15} /> Produkt hinzufügen</button>} /></div>
            : <div className={`${G.card} overflow-hidden`}><table className="w-full"><thead><tr className="bg-stone-50 border-b border-stone-200">
              {[{ k: 'name', l: 'Name', a: 'left' }, { k: '', l: 'Form', a: 'left' }, { k: '', l: 'THC', a: 'center' }, { k: '', l: 'CBD', a: 'center' }, { k: 'price', l: 'Preis', a: 'right' }, { k: 'stock', l: 'Bestand', a: 'center' }, { k: '', l: 'Aktionen', a: 'center' }].map(c => (
                <th key={c.l} className={`${G.th} text-${c.a} ${c.k ? 'cursor-pointer hover:text-stone-700 transition-colors' : ''}`} onClick={c.k ? () => handleInventorySortToggle(c.k) : undefined}>
                  <span className="inline-flex items-center gap-1">{c.l}{c.k && inventorySortBy === c.k && (inventorySortOrder === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />)}</span>
                </th>
              ))}</tr></thead>
              <tbody className="divide-y divide-stone-100">{inventoryResponse.data.map(p => (
                <tr key={p.id} className="hover:bg-stone-50/70 transition-colors group">
                  <td className={`${G.td} text-sm font-medium text-stone-900`}>{p.name}</td>
                  <td className={G.td}><span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 uppercase">{FORM_LABELS[p.form] || p.form}</span></td>
                  <td className={`${G.td} text-center text-xs text-stone-500 tabular-nums`}>{p.thcPercent}%</td>
                  <td className={`${G.td} text-center text-xs text-stone-500 tabular-nums`}>{p.cbdPercent}%</td>
                  <td className={`${G.td} text-right text-sm font-semibold text-stone-900 tabular-nums`}>€{p.price.toFixed(2)}<span className="text-stone-400 font-normal text-xs">/{p.unit}</span></td>
                  <td className={`${G.td} text-center`}>
                    {editingStock?.id === p.id ? <div className="flex items-center justify-center gap-1.5"><input type="number" min="0" value={editingStock.value} onChange={e => setEditingStock({ id: p.id, value: parseInt(e.target.value) || 0 })} className={`w-16 px-2 py-1 text-center text-xs tabular-nums ${G.input}`} /><button onClick={handleStockUpdate} aria-label="Bestand speichern" className={`p-1 text-emerald-600 hover:text-emerald-700 ${G.focus} rounded`}><Save size={13} /></button><button onClick={() => setEditingStock(null)} aria-label="Abbrechen" className={`p-1 text-stone-400 hover:text-stone-600 ${G.focus} rounded`}><X size={13} /></button></div>
                    : <button onClick={() => setEditingStock({ id: p.id, value: p.stock })} className={`px-2.5 py-1 rounded-lg text-xs font-bold tabular-nums transition-all hover:scale-105 ring-1 ${G.focus} ${p.stock > 10 ? 'bg-emerald-50 text-emerald-700 ring-emerald-200' : p.stock > 0 ? 'bg-amber-50 text-amber-700 ring-amber-200' : 'bg-rose-50 text-rose-700 ring-rose-200'}`}>{p.stock}</button>}
                  </td>
                  <td className={G.td}><div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => handleEditProduct(p)} aria-label="Produkt bearbeiten" className={`p-1.5 text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-all ${G.focus}`}><Pencil size={13} /></button><button onClick={() => setShowDeleteConfirm(p.id)} aria-label="Produkt löschen" className={`p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all ${G.focus}`}><Trash2 size={13} /></button></div></td>
                </tr>
              ))}</tbody></table></div>}

            {inventoryResponse?.pagination && inventoryResponse.pagination.totalPages > 1 && <div className="flex items-center justify-between"><p className="text-xs text-stone-500 tabular-nums">Seite {inventoryResponse.pagination.page}/{inventoryResponse.pagination.totalPages}</p><div className="flex gap-1.5">
              <button disabled={inventoryResponse.pagination.page <= 1} onClick={() => { if (pharmacyId) { const f = buildInventoryFilters(); f.page = inventoryResponse.pagination.page - 1; loadInventory(pharmacyId, f) } }} aria-label="Vorherige Seite" className={`p-2 ${G.btnSecondary} rounded-xl disabled:opacity-30 ${G.focus}`}><ChevronLeft size={14} className="text-stone-600" /></button>
              <button disabled={inventoryResponse.pagination.page >= inventoryResponse.pagination.totalPages} onClick={() => { if (pharmacyId) { const f = buildInventoryFilters(); f.page = inventoryResponse.pagination.page + 1; loadInventory(pharmacyId, f) } }} aria-label="Nächste Seite" className={`p-2 ${G.btnSecondary} rounded-xl disabled:opacity-30 ${G.focus}`}><ChevronRight size={14} className="text-stone-600" /></button>
            </div></div>}
          </div>
        )}

        {/* Delete Confirm */}
        {showDeleteConfirm && <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowDeleteConfirm(null)}><div className={`${G.cardElevated} max-w-sm w-full mx-4 p-6`} onClick={e => e.stopPropagation()}>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4 mx-auto"><AlertTriangle className="w-6 h-6 text-rose-600" /></div>
          <h3 className="text-base font-bold text-stone-900 text-center mb-2">Produkt löschen?</h3>
          <p className="text-sm text-stone-500 text-center mb-6">Diese Aktion kann nicht rückgängig gemacht werden.</p>
          <div className="flex gap-2.5"><button onClick={() => setShowDeleteConfirm(null)} className={`flex-1 px-4 py-2.5 ${G.btn} ${G.btnSecondary} ${G.focus}`}>Abbrechen</button><button onClick={() => handleDeleteProduct(showDeleteConfirm)} disabled={productLoading} className={`flex-1 px-4 py-2.5 ${G.btn} ${G.btnDanger} ${G.focus} flex items-center justify-center gap-2`}>{productLoading && <Loader2 className="animate-spin" size={13} />}Löschen</button></div>
        </div></div>}

        {/* Product Modal */}
        {showProductModal && <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => { setShowProductModal(false); setEditingProduct(null); setProductForm(initialProductForm) }}>
          <div className={`${G.cardElevated} max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="text-base font-bold text-stone-900">{editingProduct ? 'Produkt bearbeiten' : 'Neues Produkt'}</h3>
              <button onClick={() => { setShowProductModal(false); setEditingProduct(null); setProductForm(initialProductForm) }} aria-label="Schließen" className={`p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-all ${G.focus}`}><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className={G.label}>Produktname *</label><input type="text" value={productForm.name} onChange={e => handleFormChange('name', e.target.value)} placeholder="z.B. Amnesia Haze" className={`w-full px-3.5 py-2.5 ${G.input}`} /></div>
              <div><label className={G.label}>Produktform *</label><select value={productForm.form} onChange={e => handleFormChange('form', e.target.value)} className={`w-full px-3.5 py-2.5 ${G.input}`}>{PRODUCT_FORMS.map(f => <option key={f} value={f}>{FORM_LABELS[f]}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-3">{([{ l: 'THC %', f: 'thcPercent' as const }, { l: 'CBD %', f: 'cbdPercent' as const }]).map(i => <div key={i.f}><label className={G.label}>{i.l} *</label><input type="number" step="0.1" min="0" max="100" value={productForm[i.f]} onChange={e => handleFormChange(i.f, parseFloat(e.target.value) || 0)} className={`w-full px-3.5 py-2.5 tabular-nums ${G.input}`} /></div>)}</div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={G.label}>Preis (€) *</label><input type="number" step="0.01" min="0" value={productForm.price} onChange={e => handleFormChange('price', parseFloat(e.target.value) || 0)} className={`w-full px-3.5 py-2.5 tabular-nums ${G.input}`} /></div>
                <div><label className={G.label}>Einheit</label><input type="text" value={productForm.unit} onChange={e => handleFormChange('unit', e.target.value)} className={`w-full px-3.5 py-2.5 ${G.input}`} /></div>
              </div>
              <div><label className={G.label}>Bestand *</label><input type="number" min="0" value={productForm.stock} onChange={e => handleFormChange('stock', parseInt(e.target.value) || 0)} className={`w-full px-3.5 py-2.5 tabular-nums ${G.input}`} /></div>
              <div><label className={G.label}>Bild URL</label><input type="url" value={productForm.imageUrl || ''} onChange={e => handleFormChange('imageUrl', e.target.value)} placeholder="https://..." className={`w-full px-3.5 py-2.5 ${G.input}`} />
                <div className="mt-2 h-16 w-16 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-center overflow-hidden">
                  {productForm.imageUrl ? <img src={productForm.imageUrl} alt="Vorschau" className="h-full w-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} /> : <Camera size={16} className="text-stone-300" />}
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-stone-200 px-6 py-4 flex gap-2.5 justify-end rounded-b-2xl">
              <button onClick={() => { setShowProductModal(false); setEditingProduct(null); setProductForm(initialProductForm) }} className={`px-4 py-2.5 ${G.btn} ${G.btnSecondary} ${G.focus}`}>Abbrechen</button>
              <button onClick={handleSaveProduct} disabled={productLoading} className={`px-5 py-2.5 ${G.btn} ${G.btnPrimary} ${G.focus} flex items-center gap-2`}>{productLoading && <Loader2 className="animate-spin" size={13} />}{editingProduct ? 'Aktualisieren' : 'Erstellen'}</button>
            </div>
          </div>
        </div>}

        {/* ── ANALYTICS ── */}
        {activeView === 'analytics' && (
          <div className="space-y-5">
            <div className="inline-flex gap-1.5 flex-wrap">{PERIOD_OPTIONS.map(o => <button key={o.value} onClick={() => setAnalyticsPeriod(o.value)} className={`px-4 py-2 ${G.btn} ${G.focus} rounded-xl ${analyticsPeriod === o.value ? G.tabActive : G.tabInactive}`}>{o.label}</button>)}</div>

            {analyticsLoading ? <div className="space-y-4"><div className="grid grid-cols-2 md:grid-cols-5 gap-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div><Skeleton className="h-72" /><Skeleton className="h-64" /></div>
            : analyticsData ? (() => {
              const summary = analyticsData.summary ?? { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0, uniquePatients: 0, returningPatients: 0 }
              const revenueByPeriod = analyticsData.revenueByPeriod ?? []
              const topProducts = analyticsData.topProducts ?? []
              return <>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <StatCard label="Umsatz" value={formatEUR(summary.totalRevenue ?? 0)} icon={DollarSign} tone="emerald" />
                  <StatCard label="Bestellungen" value={summary.totalOrders ?? 0} icon={ShoppingCart} tone="blue" />
                  <StatCard label="Ø Bestellwert" value={formatEUR(summary.averageOrderValue ?? 0)} icon={TrendingUp} tone="violet" />
                  <StatCard label="Patienten" value={summary.uniquePatients ?? 0} icon={Users} tone="purple" />
                  <StatCard label="Wiederkehrend" value={summary.returningPatients ?? 0} icon={RefreshCw} tone="pink" />
                </div>

                <div className={`${G.card} p-6`}><h3 className={G.sectionTitle}>Umsatzverlauf</h3>
                  {revenueByPeriod.length > 0 ? <div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={revenueByPeriod}>
                    <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#059669" stopOpacity={0.18} /><stop offset="95%" stopColor="#059669" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#78716c' }} tickFormatter={v => formatShortDate(v)} axisLine={{ stroke: '#e7e5e4' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#78716c' }} tickFormatter={v => `€${v}`} axisLine={false} tickLine={false} />
                    <Tooltip formatter={v => [formatEUR(Number(v)), 'Umsatz']} labelFormatter={l => formatDate(String(l))} contentStyle={{ borderRadius: '12px', border: '1px solid #e7e5e4', background: '#ffffff', boxShadow: '0 8px 30px rgba(15,23,42,0.12)', fontSize: '12px', color: '#1c1917' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2} fill="url(#rg)" dot={false} activeDot={{ r: 5, fill: '#059669', stroke: '#ffffff', strokeWidth: 2 }} />
                  </AreaChart></ResponsiveContainer></div> : <div className="py-16 text-center text-stone-400 text-sm">Keine Daten für diesen Zeitraum</div>}
                </div>

                <div className={`${G.card} p-6`}><h3 className={G.sectionTitle}>Top 5 Produkte</h3>
                  {topProducts.length > 0 ? <div className="space-y-5">
                    <div className="h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={topProducts} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: '#78716c' }} tickFormatter={v => `€${v}`} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#57534e' }} width={110} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v, n) => { if (n === 'revenue') return [formatEUR(Number(v)), 'Umsatz']; return [v, n] }} cursor={{ fill: '#f5f5f4' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e7e5e4', background: '#ffffff', boxShadow: '0 8px 30px rgba(15,23,42,0.12)', fontSize: '12px', color: '#1c1917' }} />
                      <Bar dataKey="revenue" fill="#059669" radius={[0, 6, 6, 0]} />
                    </BarChart></ResponsiveContainer></div>
                    <div className="space-y-2">{topProducts.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-stone-50 border border-stone-200 rounded-xl">
                        <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center tabular-nums">{i + 1}</span><span className="text-sm font-medium text-stone-800">{p.name}</span></div>
                        <div className="flex items-center gap-4"><span className="text-xs text-stone-400 tabular-nums">{p.quantity} Stk.</span><span className="text-sm font-bold text-emerald-700 tabular-nums">{formatEUR(p.revenue)}</span></div>
                      </div>
                    ))}</div>
                  </div> : <div className="py-16 text-center text-stone-400 text-sm">Keine Produktdaten für diesen Zeitraum</div>}
                </div>
              </>
            })() : <div className={G.card}><EmptyState icon={BarChart3} title="Keine Analytik-Daten" description="Daten konnten nicht geladen werden." /></div>}
          </div>
        )        }

        {/* ── PROFILE ── */}
        {activeView === 'profile' && pharmacy && (
          <ProfileView
            pharmacy={pharmacy}
            onSave={handleSaveProfile}
            saving={profileSaving}
            saveError={profileSaveError}
          />
        )}

        {/* ── SETTINGS ── */}
        {activeView === 'settings' && <SettingsView />}

        {/* ── COMPLIANCE ── */}
        {activeView === 'compliance' && pharmacy && <ComplianceView pharmacy={pharmacy} />}

        </div>
      </main>
    </div>
  )
}
