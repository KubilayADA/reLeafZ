'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Eye, EyeOff, Lock, Mail, User, Clock, CheckCircle, XCircle, Package, LogOut,
  Phone, AlertCircle, Truck, CheckCircle2, Loader2, TrendingUp,
  ShoppingCart, AlertTriangle, Plus, Pencil, Trash2, X, Save, Boxes, Search,
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, BarChart3, DollarSign,
  Calendar, FileText, CreditCard, Users, RefreshCw, ExternalLink, Activity,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Area, AreaChart
} from 'recharts'
import {
  pharmacyLogin, fetchPharmacyDashboard, fetchPharmacyOrders, updateOrderStatus,
  markOrderReady, dispatchOrder, fetchPharmacyOrderDetail, fetchPharmacyInventory, fetchPharmacyAnalytics,
  createProduct, updateProduct, deleteProduct,
  type Product, type ProductFormData, type DashboardResponse,
  type OrdersResponse, type OrderFilters, type OrderDetail, type InventoryResponse,
  type InventoryFilters, type AnalyticsResponse,
  STATUS_TRANSITIONS, STATUS_TRANSITION_LABELS,
  API_BASE,
} from '@/lib/api'

// ── design tokens ──
const G = {
  card: 'bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-2xl shadow-lg shadow-black/10',
  cardHover: 'hover:bg-white/[0.07] hover:border-white/[0.14] hover:shadow-xl hover:shadow-black/20 hover:-translate-y-0.5',
  input: 'bg-white/[0.06] border border-white/[0.10] rounded-xl text-sm text-white placeholder:text-white/30 focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/40 outline-none transition-all backdrop-blur-sm',
  label: 'block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1.5',
  sectionTitle: 'text-[11px] font-semibold text-white/30 uppercase tracking-[0.2em] mb-3',
  th: 'px-5 py-3 text-[10px] font-bold text-white/30 uppercase tracking-widest',
  td: 'px-5 py-3.5',
  tabActive: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10',
  tabInactive: 'text-white/40 border border-transparent hover:text-white/60 hover:bg-white/[0.04]',
  btn: 'text-xs font-semibold rounded-xl transition-all duration-200 disabled:opacity-40',
  btnPrimary: 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:shadow-emerald-500/30',
} as const

type ViewType = 'dashboard' | 'orders' | 'inventory' | 'analytics'

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

function getStatusColor(status: string) {
  const s = status.toUpperCase()
  if (s === 'DISPATCHED') return { bg: 'bg-orange-500/15', text: 'text-orange-400', dot: 'bg-orange-400', border: 'border-orange-500/20' }
  if (s === 'DELIVERED' || s === 'FULFILLED') return { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400', border: 'border-emerald-500/20' }
  if (s === 'READY') return { bg: 'bg-green-500/15', text: 'text-green-400', dot: 'bg-green-400', border: 'border-green-500/20' }
  if (s === 'PROCESSING') return { bg: 'bg-blue-500/15', text: 'text-blue-400', dot: 'bg-blue-400', border: 'border-blue-500/20' }
  if (s === 'PAID') return { bg: 'bg-violet-500/15', text: 'text-violet-400', dot: 'bg-violet-400', border: 'border-violet-500/20' }
  if (s === 'APPROVED') return { bg: 'bg-amber-500/15', text: 'text-amber-400', dot: 'bg-amber-400', border: 'border-amber-500/20' }
  if (s === 'DECLINED' || s === 'CANCELLED') return { bg: 'bg-red-500/15', text: 'text-red-400', dot: 'bg-red-400', border: 'border-red-500/20' }
  if (s === 'PICKED_UP') return { bg: 'bg-purple-500/15', text: 'text-purple-400', dot: 'bg-purple-400', border: 'border-purple-500/20' }
  return { bg: 'bg-white/10', text: 'text-white/60', dot: 'bg-white/40', border: 'border-white/10' }
}
function getStatusOrder(status: string) { const o: Record<string, number> = { PENDING: 0, APPROVED: 1, PAID: 2, PROCESSING: 3, READY: 4, PICKED_UP: 5, DELIVERED: 6, FULFILLED: 6 }; return o[status.toUpperCase()] ?? -1 }

const STATUS_STEPS = [
  { key: 'APPROVED', label: 'Genehmigt', icon: CheckCircle }, { key: 'PAID', label: 'Bezahlt', icon: CreditCard },
  { key: 'PROCESSING', label: 'In Bearbeitung', icon: Loader2 }, { key: 'READY', label: 'Bereit', icon: Package },
  { key: 'PICKED_UP', label: 'Abgeholt', icon: Truck }, { key: 'DELIVERED', label: 'Geliefert', icon: CheckCircle2 },
]

function StatusBadge({ status }: { status: string }) {
  const c = getStatusColor(status)
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold rounded-full ${c.bg} ${c.text} border ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} shadow-sm`} style={{ boxShadow: `0 0 6px currentColor` }} />
      {status}
    </span>
  )
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-white/[0.04] ${className}`} />
}

function GlassStatCard({ label, value, icon: Icon, color = 'text-white', glow }: {
  label: string; value: string | number; icon: React.ElementType; color?: string; glow?: string
}) {
  return (
    <div className={`group relative ${G.card} ${G.cardHover} p-5 transition-all duration-300 overflow-hidden min-w-0`}>
      {glow && <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${glow}`} />}
      <div className="relative z-10 min-w-0">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2.5 rounded-xl bg-white/[0.06] group-hover:bg-white/[0.10] transition-colors flex-shrink-0">
            <Icon size={17} className="text-white/40 group-hover:text-white/60 transition-colors" />
          </div>
        </div>
        <p className="text-[10px] font-semibold text-white/30 tracking-widest uppercase mb-1 truncate">{label}</p>
        <p className={`text-xl font-bold ${color} tracking-tight truncate`}>{value}</p>
      </div>
    </div>
  )
}

function EmptyState({ icon: Icon, title, description, action }: { icon: React.ElementType; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className="w-16 h-16 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mb-5">
        <Icon className="w-7 h-7 text-white/20" />
      </div>
      <h3 className="text-base font-semibold text-white/80 mb-2">{title}</h3>
      <p className="text-sm text-white/30 text-center max-w-sm mb-5">{description}</p>
      {action}
    </div>
  )
}

// ── Main Component ──
export default function PharmacyDashboard() {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [showPassword, setShowPassword] = useState(false)
  const [pharmacyId, setPharmacyId] = useState<number | null>(null); const [isClient, setIsClient] = useState(false)
  const [activeView, setActiveView] = useState<ViewType>('dashboard'); const [loading, setLoading] = useState(false)
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null)
  const [ordersResponse, setOrdersResponse] = useState<OrdersResponse | null>(null)
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
  const [error, setError] = useState<string | null>(null)

  const pharmacy = dashboardData?.pharmacy
  const orderStats = useMemo(() => dashboardData?.stats?.orders ?? EMPTY_ORDER_STATS, [dashboardData])
  const revenueStats = useMemo(() => dashboardData?.stats?.revenue ?? EMPTY_REVENUE_STATS, [dashboardData])
  const inventoryStats = useMemo(() => dashboardData?.stats?.inventory ?? EMPTY_INVENTORY_STATS, [dashboardData])
  const recentOrders = useMemo(() => dashboardData?.recentOrders ?? [], [dashboardData])

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
  const loadInventory = useCallback(async (p: number, f?: InventoryFilters) => { try { setInventoryLoading(true); setError(null); setInventoryResponse(await fetchPharmacyInventory(p, f)) } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Laden fehlgeschlagen') } finally { setInventoryLoading(false) } }, [])
  const loadAnalytics = useCallback(async (p: number, period: '7d' | '30d' | '90d' | '12m') => { try { setAnalyticsLoading(true); setError(null); setAnalyticsData(await fetchPharmacyAnalytics(p, period)) } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Laden fehlgeschlagen') } finally { setAnalyticsLoading(false) } }, [])

  const handleViewChange = (v: ViewType) => { setActiveView(v); setError(null); if (v === 'orders' && pharmacyId) loadOrders(pharmacyId, buildOrderFilters()); if (v === 'inventory' && pharmacyId) loadInventory(pharmacyId, buildInventoryFilters()); if (v === 'analytics' && pharmacyId) loadAnalytics(pharmacyId, analyticsPeriod) }
  const buildOrderFilters = useCallback((): OrderFilters => { const [sortBy, sortOrder] = orderSort.split(':') as [OrderFilters['sortBy'], OrderFilters['sortOrder']]; return { status: orderStatusTab !== 'ALL' ? orderStatusTab : undefined, search: orderSearch || undefined, from: orderDateFrom || undefined, to: orderDateTo || undefined, sortBy, sortOrder } }, [orderStatusTab, orderSearch, orderDateFrom, orderDateTo, orderSort])
  const buildInventoryFilters = useCallback((): InventoryFilters => ({ search: inventorySearch || undefined, form: inventoryFormFilter || undefined, availability: (inventoryAvailability as InventoryFilters['availability']) || undefined, sortBy: inventorySortBy as InventoryFilters['sortBy'], sortOrder: inventorySortOrder }), [inventorySearch, inventoryFormFilter, inventoryAvailability, inventorySortBy, inventorySortOrder])

  useEffect(() => { if (activeView !== 'orders' || !pharmacyId) return; const t = setTimeout(() => loadOrders(pharmacyId, buildOrderFilters()), 300); return () => clearTimeout(t) }, [orderStatusTab, orderSearch, orderDateFrom, orderDateTo, orderSort, activeView, pharmacyId, loadOrders, buildOrderFilters])
  useEffect(() => { if (activeView !== 'inventory' || !pharmacyId) return; const t = setTimeout(() => loadInventory(pharmacyId, buildInventoryFilters()), 300); return () => clearTimeout(t) }, [inventorySearch, inventoryFormFilter, inventoryAvailability, inventorySortBy, inventorySortOrder, activeView, pharmacyId, loadInventory, buildInventoryFilters])
  useEffect(() => { if (activeView !== 'analytics' || !pharmacyId) return; loadAnalytics(pharmacyId, analyticsPeriod) }, [analyticsPeriod, activeView, pharmacyId, loadAnalytics])

  // pharmacy_id in localStorage is UI-only — it restores the dashboard view on reload.
  // All actual auth is enforced via the httpOnly session cookie on every API call.
  // The backend must verify that the session matches the requested pharmacyId on every endpoint.
  const handleLogin = async () => { try { setLoading(true); setError(null); const d = await pharmacyLogin(email, password); if (d.pharmacy) { setPharmacyId(d.pharmacy.id); localStorage?.setItem('pharmacy_id', d.pharmacy.id.toString()); await loadDashboard() } else setError('Login fehlgeschlagen') } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Anmeldung fehlgeschlagen') } finally { setLoading(false) } }
  const handleLogout = () => { setPharmacyId(null); setDashboardData(null); setOrdersResponse(null); setInventoryResponse(null); setAnalyticsData(null); setEmail(''); setPassword(''); setActiveView('dashboard'); setError(null); localStorage?.removeItem('pharmacy_id') }
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

  const renderNextStatusButton = (order: { id: number; status: string; deliveryMethod?: string }) => {
    let allowed = STATUS_TRANSITIONS[order.status] ?? [];
    if (order.status === 'READY') {
      allowed = order.deliveryMethod?.includes('BOTENDIENST')
        ? ['DISPATCHED']
        : ['PICKED_UP'];
    }
    if (!allowed.length) return null
    const colors: Record<string, string> = { PROCESSING: 'from-blue-600 to-blue-500', PREPARING: 'from-blue-600 to-blue-500', READY: 'from-green-600 to-green-500', PICKED_UP: 'from-purple-600 to-purple-500', DISPATCHED: 'from-orange-600 to-orange-500', DELIVERED: 'from-emerald-600 to-emerald-500' }
    return <div className="flex gap-2">{allowed.map(ns => { const l = STATUS_TRANSITION_LABELS[ns]; if (!l) return null; return (
      <button key={ns} onClick={ns === 'READY' ? () => handleMarkReady(order.id) : ns === 'DISPATCHED' ? () => handleDispatch(order.id) : () => handleUpdateStatus(order.id, ns)} disabled={ordersLoading}
        className={`bg-gradient-to-r ${colors[ns] || 'from-white/20 to-white/10'} text-white px-3.5 py-1.5 ${G.btn} flex items-center gap-1.5 shadow-lg`}>
        {ordersLoading && <Loader2 className="animate-spin" size={12} />}{l}
      </button>) })}</div>
  }

  // ── Loading gate ──
  if (!isClient) return (
    <div className="pharmacy-dashboard min-h-screen flex items-center justify-center bg-[#0a0f0a]">
      <div className="flex flex-col items-center gap-4">
        <img src="/logo1.png" alt="reLeafZ" className="h-50 w-auto animate-pulse opacity-80" style={{ filter: 'brightness(1.3)' }} />
        <div className="flex gap-1.5">{[0, 150, 300].map(d => <div key={d} className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: `${d}ms` }} />)}</div>
      </div>
    </div>
  )

  // ── Login ──
  if (!pharmacyId) return (
    <div className="pharmacy-dashboard min-h-screen flex items-center justify-center px-4 bg-[#0a0f0a] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/8 rounded-full blur-[100px]" />
      </div>
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <img src="/logo1.png" alt="reLeafZ" className="h-16 w-auto mb-5 mx-auto" style={{ filter: 'brightness(1.3)' }} />
          <h1 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: 'DM Sans, sans-serif' }}>Willkommen zurück</h1>
          <p className="text-white/30 mt-1.5 text-sm">Melden Sie sich im Apotheken-Dashboard an</p>
        </div>
        <div className={`${G.card} p-7`}>
          {error && <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400 flex items-center gap-2.5"><AlertCircle size={16} className="flex-shrink-0" />{error}</div>}
          <div className="space-y-4">
            <div><label className={G.label}>E-Mail Adresse</label><div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" size={18} /><input type="email" placeholder="apotheke@beispiel.de" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} className={`w-full pl-11 pr-4 py-3 ${G.input}`} /></div></div>
            <div><label className={G.label}>Passwort</label><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" size={18} /><input type={showPassword ? 'text' : 'password'} placeholder="••••••••••" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} className={`w-full pl-11 pr-11 py-3 ${G.input}`} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
            <button onClick={handleLogin} disabled={loading} className={`w-full py-3 mt-2 ${G.btn} ${G.btnPrimary} flex items-center justify-center gap-2`}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <><LogOut size={16} className="rotate-180" /> Anmelden</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // ── Dashboard shell ──
  return (
    <div className="pharmacy-dashboard min-h-screen bg-[#0a0f0a] relative overflow-hidden" style={{ fontFamily: 'DM Sans, Inter, sans-serif' }}>
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-emerald-600/[0.04] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-500/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-[100] animate-fade-in">
          <div className={`${G.card} px-4 py-3 flex items-center gap-3 max-w-sm !border-red-500/20`}>
            <div className="w-8 h-8 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0"><AlertTriangle size={15} className="text-red-400" /></div>
            <p className="text-sm text-red-300 flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-white/20 hover:text-white/50 transition-colors"><X size={15} /></button>
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6">
        {/* Sticky Header + Nav */}
        <div className="sticky top-0 z-30 pt-6 pb-4 bg-[#0a0f0a]/80 backdrop-blur-xl -mx-4 sm:-mx-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <img src="/logo1.png" alt="reLeafZ" className="h-10 w-auto flex-shrink-0" style={{ filter: 'brightness(1.3)' }} />
              <div className="min-w-0">
                <h1 className="text-lg font-bold text-white tracking-tight truncate">{pharmacy?.name || 'Dashboard'}</h1>
                <p className="text-[11px] text-white/30 truncate max-w-[280px]">{pharmacy?.zip}{pharmacy?.zipRange ? ` • ${pharmacy.zipRange}` : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => loadDashboard()} className="p-2.5 text-white/40 hover:text-emerald-400 hover:bg-white/[0.06] rounded-xl transition-all" title="Aktualisieren"><RefreshCw size={15} /></button>
              <button onClick={handleLogout} className={`flex items-center gap-2 px-4 py-2.5 ${G.btn} text-white/60 bg-white/[0.06] border border-white/[0.10] hover:bg-white/[0.10] hover:text-white/80 rounded-xl`}><LogOut size={13} /> Abmelden</button>
            </div>
          </div>

          {/* Nav */}
          <div className={`${G.card} p-1.5 inline-flex gap-1 flex-wrap !rounded-xl`}>
          {([
            { key: 'dashboard' as const, label: 'Übersicht', icon: Activity },
            { key: 'orders' as const, label: 'Bestellungen', icon: ShoppingCart, badge: orderStats.pending },
            { key: 'inventory' as const, label: 'Inventar', icon: Boxes, badge: inventoryStats.lowStock },
            { key: 'analytics' as const, label: 'Analytik', icon: BarChart3 },
          ]).map(tab => (
            <button key={tab.key} onClick={() => handleViewChange(tab.key)}
              className={`px-8 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 ${activeView === tab.key ? G.tabActive : G.tabInactive}`}>
              <tab.icon size={14} /><span className="hidden sm:inline">{tab.label}</span>
              {tab.badge != null && tab.badge > 0 && <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${activeView === tab.key ? 'bg-emerald-400/20 text-emerald-300' : 'bg-amber-500/20 text-amber-400'}`}>{tab.badge}</span>}
            </button>
          ))}
          </div>
        </div>

        <div className="pb-6">
        {/* ── DASHBOARD ── */}
        {activeView === 'dashboard' && (loading ? (
          <div className="space-y-6"><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div><Skeleton className="h-64" /></div>
        ) : (
          <div className="space-y-6">
            <div><h2 className={G.sectionTitle}>Bestellungen</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <GlassStatCard label="Ausstehend" value={orderStats.pending} icon={Clock} color="text-amber-400" glow="bg-amber-500" />
                <GlassStatCard label="Bezahlt" value={orderStats.paid} icon={CreditCard} color="text-violet-400" glow="bg-violet-500" />
                <GlassStatCard label="In Bearbeitung" value={orderStats.processing} icon={Loader2} color="text-blue-400" glow="bg-blue-500" />
                <GlassStatCard label="Bereit" value={orderStats.ready} icon={Package} color="text-green-400" glow="bg-green-500" />
                <GlassStatCard label="Geliefert" value={orderStats.delivered} icon={CheckCircle2} color="text-emerald-400" glow="bg-emerald-500" />
                <GlassStatCard label="Gesamt" value={orderStats.total} icon={ShoppingCart} color="text-white" />
              </div>
            </div>
            <div><h2 className={G.sectionTitle}>Umsatz</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <GlassStatCard label="Heute" value={formatEUR(revenueStats.today)} icon={DollarSign} color="text-emerald-400" glow="bg-emerald-500" />
                <GlassStatCard label="Diese Woche" value={formatEUR(revenueStats.thisWeek)} icon={Calendar} color="text-emerald-400" glow="bg-emerald-500" />
                <GlassStatCard label="Dieser Monat" value={formatEUR(revenueStats.thisMonth)} icon={TrendingUp} color="text-emerald-400" glow="bg-emerald-500" />
                <GlassStatCard label="Gesamt" value={formatEUR(revenueStats.allTime)} icon={BarChart3} color="text-emerald-300" glow="bg-emerald-400" />
              </div>
            </div>
            <div><h2 className={G.sectionTitle}>Inventar</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <GlassStatCard label="Produkte" value={inventoryStats.totalProducts} icon={Package} color="text-white" />
                <GlassStatCard label="Niedriger Bestand" value={inventoryStats.lowStock} icon={AlertTriangle} color="text-amber-400" glow="bg-amber-500" />
                <GlassStatCard label="Nicht vorrätig" value={inventoryStats.outOfStock} icon={XCircle} color="text-red-400" glow="bg-red-500" />
                <GlassStatCard label="Inventarwert" value={formatEUR(inventoryStats.totalValue)} icon={DollarSign} color="text-emerald-400" glow="bg-emerald-500" />
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className={G.sectionTitle}>Letzte Bestellungen</h2>
                <button onClick={() => handleViewChange('orders')} className="text-xs font-semibold text-emerald-400/70 hover:text-emerald-400 flex items-center gap-1 transition-colors">Alle anzeigen <ArrowUpRight size={12} /></button>
              </div>
              <div className={`${G.card} overflow-hidden`}>
                <table className="w-full">
                  <thead><tr className="border-b border-white/[0.06]">
                    <th className={`${G.th} text-left`}>Bestellung</th><th className={`${G.th} text-left`}>Patient</th><th className={`${G.th} text-left`}>Status</th><th className={`${G.th} text-right`}>Betrag</th><th className={`${G.th} text-right`}>Datum</th>
                  </tr></thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {recentOrders.map(o => (
                      <tr key={o.id} className="hover:bg-white/[0.03] cursor-pointer transition-colors" onClick={() => loadOrderDetail(o.id)}>
                        <td className={`${G.td} text-xs font-mono text-white/30`}>#{o.id}</td>
                        <td className={`${G.td} text-sm font-medium text-white/80`}>{o.patientName}</td>
                        <td className={G.td}><StatusBadge status={o.status} /></td>
                        <td className={`${G.td} text-sm font-semibold text-white/80 text-right`}>{formatEUR(o.totalPrice)}</td>
                        <td className={`${G.td} text-xs text-white/30 text-right`}>{formatShortDate(o.createdAt)}</td>
                      </tr>
                    ))}
                    {!recentOrders.length && <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-white/20">Keine Bestellungen</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pharmacy Info */}
            <div className={`${G.card} p-6`}>
              <h3 className={G.sectionTitle}>Apotheken-Informationen</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[{ l: 'Name', v: pharmacy?.name }, { l: 'PLZ', v: pharmacy?.zip }, { l: 'Kontakt', v: pharmacy?.contact }, { l: 'Lieferbereich', v: pharmacy?.zipRange || '—' }].map(i => (
                  <div key={i.l} className="min-w-0 overflow-hidden"><p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">{i.l}</p><p className="text-sm font-semibold text-white/70 break-words" title={i.v || '—'}>{i.v || '—'}</p></div>
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
                <div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" size={16} /><input type="text" placeholder="Patient suchen..." value={orderSearch} onChange={e => setOrderSearch(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 ${G.input}`} /></div>
                <div className="flex items-center gap-2">
                  <input type="date" value={orderDateFrom} onChange={e => setOrderDateFrom(e.target.value)} className={`px-3 py-2.5 text-xs ${G.input}`} />
                  <span className="text-white/20 text-xs">—</span>
                  <input type="date" value={orderDateTo} onChange={e => setOrderDateTo(e.target.value)} className={`px-3 py-2.5 text-xs ${G.input}`} />
                </div>
                <select value={orderSort} onChange={e => setOrderSort(e.target.value)} className={`px-3 py-2.5 text-xs min-w-[180px] ${G.input}`}>{SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-[#0a0f0a] text-white">{o.label}</option>)}</select>
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap">{ORDER_STATUS_TABS.map(tab => {
              const count = tab.key === 'ALL' ? Object.values(ordersResponse?.statusCounts || {}).reduce((a, b) => a + b, 0) : (ordersResponse?.statusCounts?.[tab.key] || 0)
              return <button key={tab.key} onClick={() => setOrderStatusTab(tab.key)} className={`px-3.5 py-2 ${G.btn} rounded-xl flex items-center gap-1.5 ${orderStatusTab === tab.key ? G.tabActive : `${G.tabInactive} bg-white/[0.03] border-white/[0.06]`}`}>{tab.label}<span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${orderStatusTab === tab.key ? 'bg-emerald-400/20 text-emerald-300' : 'bg-white/[0.06] text-white/30'}`}>{count}</span></button>
            })}</div>

            {ordersLoading ? <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
            : !ordersResponse?.data.length ? <div className={G.card}><EmptyState icon={ShoppingCart} title="Keine Bestellungen" description={`Keine Bestellungen${orderStatusTab !== 'ALL' ? ' mit diesem Status' : ''}.`} /></div>
            : <>
              <div className={`${G.card} overflow-hidden`}>
                <table className="w-full">
                  <thead><tr className="border-b border-white/[0.06]">
                    <th className={`${G.th} text-left`}>ID</th><th className={`${G.th} text-left`}>Patient</th><th className={`${G.th} text-left`}>Status</th><th className={`${G.th} text-right`}>Betrag</th><th className={`${G.th} text-right hidden md:table-cell`}>Erstellt</th><th className={`${G.th} text-right hidden lg:table-cell`}>Aktualisiert</th><th className={`${G.th} text-right`}>Aktionen</th>
                  </tr></thead>
                  <tbody className="divide-y divide-white/[0.04]">{ordersResponse.data.map(o => (
                    <tr key={o.id} className="hover:bg-white/[0.03] transition-colors group">
                      <td className={`${G.td} text-xs font-mono text-white/30`}>#{o.id}</td>
                      <td className={G.td}><p className="text-sm font-medium text-white/80">{o.patientName}</p><p className="text-[11px] text-white/25">{o.patientEmail}</p></td>
                      <td className={G.td}><StatusBadge status={o.status} /></td>
                      <td className={`${G.td} text-sm font-semibold text-white/80 text-right`}>{o.totalPrice ? formatEUR(o.totalPrice) : '—'}</td>
                      <td className={`${G.td} text-xs text-white/25 text-right hidden md:table-cell`}>{formatShortDate(o.createdAt)}</td>
                      <td className={`${G.td} text-xs text-white/25 text-right hidden lg:table-cell`}>{formatShortDate(o.updatedAt)}</td>
                      <td className={`${G.td} text-right`}><div className="flex items-center justify-end gap-2"><button onClick={() => loadOrderDetail(o.id)} className="p-1.5 text-white/20 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"><ExternalLink size={13} /></button>{renderNextStatusButton({ id: o.id, status: o.status, deliveryMethod: o.deliveryMethod })}</div></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              {ordersResponse.pagination.totalPages > 1 && <div className="flex items-center justify-between"><p className="text-xs text-white/25">Seite {ordersResponse.pagination.page}/{ordersResponse.pagination.totalPages} • {ordersResponse.pagination.total} Ergebnisse</p><div className="flex gap-1.5">
                <button disabled={ordersResponse.pagination.page <= 1} onClick={() => { if (pharmacyId) { const f = buildOrderFilters(); f.page = ordersResponse.pagination.page - 1; loadOrders(pharmacyId, f) } }} className={`p-2 ${G.card} !rounded-xl disabled:opacity-30 hover:bg-white/[0.06]`}><ChevronLeft size={14} className="text-white/40" /></button>
                <button disabled={ordersResponse.pagination.page >= ordersResponse.pagination.totalPages} onClick={() => { if (pharmacyId) { const f = buildOrderFilters(); f.page = ordersResponse.pagination.page + 1; loadOrders(pharmacyId, f) } }} className={`p-2 ${G.card} !rounded-xl disabled:opacity-30 hover:bg-white/[0.06]`}><ChevronRight size={14} className="text-white/40" /></button>
              </div></div>}
            </>}
          </div>
        )}

        {/* ── ORDER DETAIL MODAL ── */}
        {showOrderDetail && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4" onClick={() => { setShowOrderDetail(false); setSelectedOrderDetail(null) }}>
            <div className={`${G.card} max-w-3xl w-full max-h-[90vh] overflow-y-auto !shadow-2xl !shadow-black/40`} onClick={e => e.stopPropagation()}>
              {orderDetailLoading ? <div className="p-10 space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-16" /><Skeleton className="h-32" /><Skeleton className="h-24" /></div>
              : selectedOrderDetail ? <>
                <div className="sticky top-0 bg-[#0a0f0a]/80 backdrop-blur-xl border-b border-white/[0.06] px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                  <div className="flex items-center gap-3"><div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center"><FileText size={15} className="text-white/40" /></div><div><h2 className="text-lg font-bold text-white">Bestellung #{selectedOrderDetail.id}</h2><StatusBadge status={selectedOrderDetail.status} /></div></div>
                  <button onClick={() => { setShowOrderDetail(false); setSelectedOrderDetail(null) }} className="p-2 text-white/20 hover:text-white/60 rounded-xl hover:bg-white/[0.06] transition-all"><X size={18} /></button>
                </div>
                <div className="p-6 space-y-6">
                  {/* Timeline */}
                  <div className="bg-white/[0.03] rounded-xl p-5 border border-white/[0.06]">
                    <div className="flex items-center justify-between overflow-x-auto gap-1">{STATUS_STEPS.map((step, idx) => {
                      const Icon = step.icon; const done = getStatusOrder(selectedOrderDetail.status) >= getStatusOrder(step.key); const cur = selectedOrderDetail.status.toUpperCase() === step.key
                      return <div key={step.key} className="flex items-center flex-1 min-w-0"><div className="flex flex-col items-center flex-shrink-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${cur ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/20' : done ? 'bg-emerald-600/80 text-white' : 'bg-white/[0.06] text-white/20'}`}><Icon size={15} /></div>
                        <p className={`text-[10px] mt-1.5 text-center font-medium whitespace-nowrap ${done ? 'text-emerald-400' : 'text-white/20'}`}>{step.label}</p>
                      </div>{idx < STATUS_STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-1.5 rounded-full ${done ? 'bg-emerald-500/60' : 'bg-white/[0.06]'}`} />}</div>
                    })}</div>
                  </div>
                  {/* Patient */}
                  <div><h3 className={G.label}>Patient</h3><div className="grid grid-cols-1 md:grid-cols-3 gap-3">{[
                    { icon: User, l: 'Name', v: selectedOrderDetail.patientName }, { icon: Mail, l: 'E-Mail', v: selectedOrderDetail.patientEmail }, { icon: Phone, l: 'Telefon', v: selectedOrderDetail.patientPhone }
                  ].map(i => <div key={i.l} className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5"><div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center flex-shrink-0"><i.icon size={14} className="text-white/30" /></div><div className="min-w-0"><p className="text-[10px] font-medium text-white/25 uppercase">{i.l}</p><p className="text-sm font-medium text-white/70 truncate">{i.v}</p></div></div>)}</div></div>
                  {selectedOrderDetail.symptoms && <div><h3 className={G.label}>Symptome</h3><p className="text-sm text-white/50 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 leading-relaxed">{selectedOrderDetail.symptoms}</p></div>}
                  {/* Products */}
                  {selectedOrderDetail.selectedProducts?.length > 0 && <div><h3 className={G.label}>Produkte</h3><div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden"><table className="w-full"><thead><tr className="border-b border-white/[0.06]"><th className={`${G.th} text-left`}>Produkt</th><th className={`${G.th} text-center`}>Menge</th><th className={`${G.th} text-right`}>Preis</th></tr></thead><tbody className="divide-y divide-white/[0.04]">{selectedOrderDetail.selectedProducts.map((p, i) => <tr key={i}><td className={`${G.td} text-sm text-white/60`}>{p.productName}</td><td className={`${G.td} text-sm text-center text-white/40`}>{p.quantity}</td><td className={`${G.td} text-sm text-right font-medium text-white/70`}>{p.price ? formatEUR(p.price) : '—'}</td></tr>)}</tbody><tfoot><tr className="border-t border-white/[0.08]"><td colSpan={2} className={`${G.td} text-sm font-bold text-white/80`}>Gesamt</td><td className={`${G.td} text-sm font-bold text-right text-emerald-400`}>{formatEUR(selectedOrderDetail.totalPrice)}</td></tr></tfoot></table></div></div>}
                  {/* Payment flags */}
                  <div className="grid grid-cols-2 gap-3">{[{ l: 'Rezept bezahlt', v: selectedOrderDetail.prescriptionPaid }, { l: 'Produkte bezahlt', v: selectedOrderDetail.productsPaid }].map(i => <div key={i.l} className={`rounded-xl p-3.5 border ${i.v ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/[0.03] border-white/[0.06]'}`}><p className="text-[10px] font-bold text-white/25 uppercase mb-1">{i.l}</p><p className={`text-sm font-bold ${i.v ? 'text-emerald-400' : 'text-white/25'}`}>{i.v ? 'Ja' : 'Nein'}</p></div>)}</div>
                  {/* Payment history */}
                  {selectedOrderDetail.payments?.length > 0 && <div><h3 className={G.label}>Zahlungshistorie</h3><div className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden"><table className="w-full"><thead><tr className="border-b border-white/[0.06]"><th className={`${G.th} text-left`}>Typ</th><th className={`${G.th} text-left`}>Methode</th><th className={`${G.th} text-right`}>Betrag</th><th className={`${G.th} text-left`}>Status</th><th className={`${G.th} text-right`}>Datum</th></tr></thead><tbody className="divide-y divide-white/[0.04]">{selectedOrderDetail.payments.map(p => <tr key={p.id}><td className={`${G.td} text-sm capitalize text-white/50`}>{p.type}</td><td className={`${G.td} text-sm capitalize text-white/40`}>{p.method}</td><td className={`${G.td} text-sm text-right font-medium text-white/70`}>{formatEUR(p.amount)}</td><td className={G.td}><span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${p.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' : p.status === 'pending' ? 'bg-amber-500/15 text-amber-400' : 'bg-white/[0.06] text-white/40'}`}>{p.status}</span></td><td className={`${G.td} text-xs text-white/25 text-right`}>{formatDate(p.completedAt || p.createdAt)}</td></tr>)}</tbody></table></div></div>}
                  {selectedOrderDetail.prescriptionPdfPath && <a href={`${API_BASE}/api/treatment/${selectedOrderDetail.treatmentRequestId}/prescription`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-sm font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 rounded-xl hover:bg-emerald-500/15 transition-all"><FileText size={16} /> Rezept PDF <ExternalLink size={12} /></a>}
                  <div className="flex gap-6 text-xs text-white/20 pt-3 border-t border-white/[0.06]"><span>Erstellt: {formatDate(selectedOrderDetail.createdAt)}</span><span>Aktualisiert: {formatDate(selectedOrderDetail.updatedAt)}</span></div>
                  {STATUS_TRANSITIONS[selectedOrderDetail.status]?.length > 0 && <div className="pt-1">{renderNextStatusButton({ id: selectedOrderDetail.id, status: selectedOrderDetail.status, deliveryMethod: selectedOrderDetail.deliveryMethod })}</div>}
                </div>
              </> : <div className="p-10 text-center text-white/20 text-sm">Nicht verfügbar</div>}
            </div>
          </div>
        )}

        {/* ── INVENTORY ── */}
        {activeView === 'inventory' && (
          <div className="space-y-4">
            {inventoryResponse?.summary && <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <GlassStatCard label="Produkte" value={inventoryResponse.summary.totalProducts} icon={Package} color="text-blue-400" glow="bg-blue-500" />
              <GlassStatCard label="Niedriger Bestand" value={inventoryResponse.summary.lowStock} icon={AlertTriangle} color="text-amber-400" glow="bg-amber-500" />
              <GlassStatCard label="Nicht vorrätig" value={inventoryResponse.summary.outOfStock} icon={XCircle} color="text-red-400" glow="bg-red-500" />
              <GlassStatCard label="Inventarwert" value={formatEUR(inventoryResponse.summary.totalValue)} icon={DollarSign} color="text-emerald-400" glow="bg-emerald-500" />
            </div>}
            <div className={`${G.card} p-4`}><div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" size={16} /><input type="text" placeholder="Produkt suchen..." value={inventorySearch} onChange={e => setInventorySearch(e.target.value)} className={`w-full pl-10 pr-4 py-2.5 ${G.input}`} /></div>
              <select value={inventoryFormFilter} onChange={e => setInventoryFormFilter(e.target.value)} className={`px-3 py-2.5 text-xs min-w-[140px] ${G.input}`}><option value="" className="bg-[#0a0f0a]">Alle Formen</option>{PRODUCT_FORMS.map(f => <option key={f} value={f} className="bg-[#0a0f0a]">{FORM_LABELS[f]}</option>)}</select>
              <button onClick={handleAddProduct} className={`${G.btn} ${G.btnPrimary} flex items-center gap-2 px-4 py-2.5 whitespace-nowrap`}><Plus size={15} /> Produkt hinzufügen</button>
            </div></div>
            <div className="flex gap-1.5 flex-wrap">{AVAILABILITY_TABS.map(tab => <button key={tab.key} onClick={() => setInventoryAvailability(tab.key)} className={`px-3.5 py-2 ${G.btn} rounded-xl ${inventoryAvailability === tab.key ? G.tabActive : `${G.tabInactive} bg-white/[0.03] border-white/[0.06]`}`}>{tab.label}</button>)}</div>

            {inventoryLoading ? <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
            : !inventoryResponse?.data.length ? <div className={G.card}><EmptyState icon={Package} title="Keine Produkte" description="Fügen Sie Ihr erstes Produkt hinzu."
              action={<button onClick={handleAddProduct} className={`${G.btn} ${G.btnPrimary} flex items-center gap-2 px-4 py-2.5`}><Plus size={15} /> Produkt hinzufügen</button>} /></div>
            : <div className={`${G.card} overflow-hidden`}><table className="w-full"><thead><tr className="border-b border-white/[0.06]">
              {[{ k: 'name', l: 'Name', a: 'left' }, { k: '', l: 'Form', a: 'left' }, { k: '', l: 'THC', a: 'center' }, { k: '', l: 'CBD', a: 'center' }, { k: 'price', l: 'Preis', a: 'right' }, { k: 'stock', l: 'Bestand', a: 'center' }, { k: '', l: 'Aktionen', a: 'center' }].map(c => (
                <th key={c.l} className={`${G.th} text-${c.a} ${c.k ? 'cursor-pointer hover:text-white/50 transition-colors' : ''}`} onClick={c.k ? () => handleInventorySortToggle(c.k) : undefined}>
                  <span className="inline-flex items-center gap-1">{c.l}{c.k && inventorySortBy === c.k && (inventorySortOrder === 'asc' ? <ChevronUp size={11} /> : <ChevronDown size={11} />)}</span>
                </th>
              ))}</tr></thead>
              <tbody className="divide-y divide-white/[0.04]">{inventoryResponse.data.map(p => (
                <tr key={p.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className={`${G.td} text-sm font-medium text-white/70`}>{p.name}</td>
                  <td className={G.td}><span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-500/10 text-emerald-400/80 uppercase">{FORM_LABELS[p.form] || p.form}</span></td>
                  <td className={`${G.td} text-center text-xs text-white/40`}>{p.thcPercent}%</td>
                  <td className={`${G.td} text-center text-xs text-white/40`}>{p.cbdPercent}%</td>
                  <td className={`${G.td} text-right text-sm font-semibold text-white/70`}>€{p.price.toFixed(2)}<span className="text-white/20 font-normal text-xs">/{p.unit}</span></td>
                  <td className={`${G.td} text-center`}>
                    {editingStock?.id === p.id ? <div className="flex items-center justify-center gap-1.5"><input type="number" min="0" value={editingStock.value} onChange={e => setEditingStock({ id: p.id, value: parseInt(e.target.value) || 0 })} className={`w-16 px-2 py-1 text-center text-xs ${G.input}`} /><button onClick={handleStockUpdate} className="p-1 text-emerald-400 hover:text-emerald-300"><Save size={13} /></button><button onClick={() => setEditingStock(null)} className="p-1 text-white/20 hover:text-white/50"><X size={13} /></button></div>
                    : <button onClick={() => setEditingStock({ id: p.id, value: p.stock })} className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105 ${p.stock > 10 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : p.stock > 0 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'}`}>{p.stock}</button>}
                  </td>
                  <td className={G.td}><div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => handleEditProduct(p)} className="p-1.5 text-white/20 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-all"><Pencil size={13} /></button><button onClick={() => setShowDeleteConfirm(p.id)} className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={13} /></button></div></td>
                </tr>
              ))}</tbody></table></div>}

            {inventoryResponse?.pagination && inventoryResponse.pagination.totalPages > 1 && <div className="flex items-center justify-between"><p className="text-xs text-white/25">Seite {inventoryResponse.pagination.page}/{inventoryResponse.pagination.totalPages}</p><div className="flex gap-1.5">
              <button disabled={inventoryResponse.pagination.page <= 1} onClick={() => { if (pharmacyId) { const f = buildInventoryFilters(); f.page = inventoryResponse.pagination.page - 1; loadInventory(pharmacyId, f) } }} className={`p-2 ${G.card} !rounded-xl disabled:opacity-30`}><ChevronLeft size={14} className="text-white/40" /></button>
              <button disabled={inventoryResponse.pagination.page >= inventoryResponse.pagination.totalPages} onClick={() => { if (pharmacyId) { const f = buildInventoryFilters(); f.page = inventoryResponse.pagination.page + 1; loadInventory(pharmacyId, f) } }} className={`p-2 ${G.card} !rounded-xl disabled:opacity-30`}><ChevronRight size={14} className="text-white/40" /></button>
            </div></div>}
          </div>
        )}

        {/* Delete Confirm */}
        {showDeleteConfirm && <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50" onClick={() => setShowDeleteConfirm(null)}><div className={`${G.card} max-w-sm w-full mx-4 p-6`} onClick={e => e.stopPropagation()}>
          <div className="w-12 h-12 rounded-2xl bg-red-500/15 flex items-center justify-center mb-4 mx-auto"><AlertTriangle className="w-6 h-6 text-red-400" /></div>
          <h3 className="text-base font-bold text-white text-center mb-2">Produkt löschen?</h3>
          <p className="text-sm text-white/30 text-center mb-6">Diese Aktion kann nicht rückgängig gemacht werden.</p>
          <div className="flex gap-2.5"><button onClick={() => setShowDeleteConfirm(null)} className={`flex-1 px-4 py-2.5 ${G.btn} text-white/50 bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.10] rounded-xl`}>Abbrechen</button><button onClick={() => handleDeleteProduct(showDeleteConfirm)} disabled={productLoading} className={`flex-1 px-4 py-2.5 ${G.btn} text-white bg-red-500/80 hover:bg-red-500 rounded-xl flex items-center justify-center gap-2 disabled:opacity-40`}>{productLoading && <Loader2 className="animate-spin" size={13} />}Löschen</button></div>
        </div></div>}

        {/* Product Modal */}
        {showProductModal && <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50" onClick={() => { setShowProductModal(false); setEditingProduct(null); setProductForm(initialProductForm) }}>
          <div className={`${G.card} max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto`} onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#0a0f0a]/80 backdrop-blur-xl border-b border-white/[0.06] px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="text-base font-bold text-white">{editingProduct ? 'Produkt bearbeiten' : 'Neues Produkt'}</h3>
              <button onClick={() => { setShowProductModal(false); setEditingProduct(null); setProductForm(initialProductForm) }} className="p-2 text-white/20 hover:text-white/60 rounded-xl hover:bg-white/[0.06] transition-all"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className={G.label}>Produktname *</label><input type="text" value={productForm.name} onChange={e => handleFormChange('name', e.target.value)} placeholder="z.B. Amnesia Haze" className={`w-full px-3.5 py-2.5 ${G.input}`} /></div>
              <div><label className={G.label}>Produktform *</label><select value={productForm.form} onChange={e => handleFormChange('form', e.target.value)} className={`w-full px-3.5 py-2.5 ${G.input}`}>{PRODUCT_FORMS.map(f => <option key={f} value={f} className="bg-[#0a0f0a]">{FORM_LABELS[f]}</option>)}</select></div>
              <div className="grid grid-cols-2 gap-3">{([{ l: 'THC %', f: 'thcPercent' as const }, { l: 'CBD %', f: 'cbdPercent' as const }]).map(i => <div key={i.f}><label className={G.label}>{i.l} *</label><input type="number" step="0.1" min="0" max="100" value={productForm[i.f]} onChange={e => handleFormChange(i.f, parseFloat(e.target.value) || 0)} className={`w-full px-3.5 py-2.5 ${G.input}`} /></div>)}</div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={G.label}>Preis (€) *</label><input type="number" step="0.01" min="0" value={productForm.price} onChange={e => handleFormChange('price', parseFloat(e.target.value) || 0)} className={`w-full px-3.5 py-2.5 ${G.input}`} /></div>
                <div><label className={G.label}>Einheit</label><input type="text" value={productForm.unit} onChange={e => handleFormChange('unit', e.target.value)} className={`w-full px-3.5 py-2.5 ${G.input}`} /></div>
              </div>
              <div><label className={G.label}>Bestand *</label><input type="number" min="0" value={productForm.stock} onChange={e => handleFormChange('stock', parseInt(e.target.value) || 0)} className={`w-full px-3.5 py-2.5 ${G.input}`} /></div>
              <div><label className={G.label}>Bild URL</label><input type="url" value={productForm.imageUrl || ''} onChange={e => handleFormChange('imageUrl', e.target.value)} placeholder="https://..." className={`w-full px-3.5 py-2.5 ${G.input}`} />
                {productForm.imageUrl && <img src={productForm.imageUrl} alt="Vorschau" className="h-16 w-16 object-cover rounded-xl border border-white/[0.08] mt-2" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
              </div>
            </div>
            <div className="sticky bottom-0 bg-[#0a0f0a]/80 backdrop-blur-xl border-t border-white/[0.06] px-6 py-4 flex gap-2.5 justify-end rounded-b-2xl">
              <button onClick={() => { setShowProductModal(false); setEditingProduct(null); setProductForm(initialProductForm) }} className={`px-4 py-2.5 ${G.btn} text-white/50 bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.10] rounded-xl`}>Abbrechen</button>
              <button onClick={handleSaveProduct} disabled={productLoading} className={`px-5 py-2.5 ${G.btn} ${G.btnPrimary} flex items-center gap-2 disabled:opacity-40`}>{productLoading && <Loader2 className="animate-spin" size={13} />}{editingProduct ? 'Aktualisieren' : 'Erstellen'}</button>
            </div>
          </div>
        </div>}

        {/* ── ANALYTICS ── */}
        {activeView === 'analytics' && (
          <div className="space-y-5">
            <div className={`${G.card} p-1.5 inline-flex gap-1 !rounded-xl`}>{PERIOD_OPTIONS.map(o => <button key={o.value} onClick={() => setAnalyticsPeriod(o.value)} className={`px-4 py-2 ${G.btn} rounded-lg ${analyticsPeriod === o.value ? G.tabActive : G.tabInactive}`}>{o.label}</button>)}</div>

            {analyticsLoading ? <div className="space-y-4"><div className="grid grid-cols-2 md:grid-cols-5 gap-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-24" />)}</div><Skeleton className="h-72" /><Skeleton className="h-64" /></div>
            : analyticsData ? (() => {
              const summary = analyticsData.summary ?? { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0, uniquePatients: 0, returningPatients: 0 }
              const revenueByPeriod = analyticsData.revenueByPeriod ?? []
              const topProducts = analyticsData.topProducts ?? []
              return <>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <GlassStatCard label="Umsatz" value={formatEUR(summary.totalRevenue ?? 0)} icon={DollarSign} color="text-emerald-400" glow="bg-emerald-500" />
                  <GlassStatCard label="Bestellungen" value={summary.totalOrders ?? 0} icon={ShoppingCart} color="text-blue-400" glow="bg-blue-500" />
                  <GlassStatCard label="Ø Bestellwert" value={formatEUR(summary.averageOrderValue ?? 0)} icon={TrendingUp} color="text-violet-400" glow="bg-violet-500" />
                  <GlassStatCard label="Patienten" value={summary.uniquePatients ?? 0} icon={Users} color="text-purple-400" glow="bg-purple-500" />
                  <GlassStatCard label="Wiederkehrend" value={summary.returningPatients ?? 0} icon={RefreshCw} color="text-pink-400" glow="bg-pink-500" />
                </div>

                <div className={`${G.card} p-6`}><h3 className={G.sectionTitle}>Umsatzverlauf</h3>
                  {revenueByPeriod.length > 0 ? <div className="h-72"><ResponsiveContainer width="100%" height="100%"><AreaChart data={revenueByPeriod}>
                    <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#34d399" stopOpacity={0.15} /><stop offset="95%" stopColor="#34d399" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.2)' }} tickFormatter={v => formatShortDate(v)} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.2)' }} tickFormatter={v => `€${v}`} axisLine={false} tickLine={false} />
                    <Tooltip formatter={v => [formatEUR(Number(v)), 'Umsatz']} labelFormatter={l => formatDate(String(l))} contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(10,15,10,0.9)', backdropFilter: 'blur(12px)', fontSize: '12px', color: '#a7f3d0' }} />
                    <Area type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={2} fill="url(#rg)" dot={false} activeDot={{ r: 5, fill: '#34d399', stroke: '#0a0f0a', strokeWidth: 2 }} />
                  </AreaChart></ResponsiveContainer></div> : <div className="py-16 text-center text-white/20 text-sm">Keine Daten für diesen Zeitraum</div>}
                </div>

                <div className={`${G.card} p-6`}><h3 className={G.sectionTitle}>Top 5 Produkte</h3>
                  {topProducts.length > 0 ? <div className="space-y-5">
                    <div className="h-56"><ResponsiveContainer width="100%" height="100%"><BarChart data={topProducts} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.2)' }} tickFormatter={v => `€${v}`} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} width={110} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v, n) => { if (n === 'revenue') return [formatEUR(Number(v)), 'Umsatz']; return [v, n] }} contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(10,15,10,0.9)', backdropFilter: 'blur(12px)', fontSize: '12px', color: '#a7f3d0' }} />
                      <Bar dataKey="revenue" fill="#34d399" radius={[0, 6, 6, 0]} fillOpacity={0.8} />
                    </BarChart></ResponsiveContainer></div>
                    <div className="space-y-2">{topProducts.map((p, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                        <div className="flex items-center gap-3"><span className="w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-bold flex items-center justify-center">{i + 1}</span><span className="text-sm font-medium text-white/70">{p.name}</span></div>
                        <div className="flex items-center gap-4"><span className="text-xs text-white/25">{p.quantity} Stk.</span><span className="text-sm font-bold text-emerald-400">{formatEUR(p.revenue)}</span></div>
                      </div>
                    ))}</div>
                  </div> : <div className="py-16 text-center text-white/20 text-sm">Keine Produktdaten für diesen Zeitraum</div>}
                </div>
              </>
            })() : <div className={G.card}><EmptyState icon={BarChart3} title="Keine Analytik-Daten" description="Daten konnten nicht geladen werden." /></div>}
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
