'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Eye, EyeOff, Lock, Mail, User, Clock, CheckCircle, XCircle, Package, LogOut, MapPin, Phone, AlertCircle, Truck, CheckCircle2, Circle, Loader2, TrendingUp, ShoppingCart, AlertTriangle } from 'lucide-react';
import { pharmacyLogin, fetchPharmacyDashboard, fetchPharmacyOrders, updateOrderStatus, markOrderReady, PharmacyOrder } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

type ViewType = 'dashboard' | 'orders' | 'inventory' | 'tracking'

interface PharmacyData {
  id: number;
  name: string;
  zip: string;
  zipRange?: string;
  contact: string;
  productCount: number;
  pendingRequests: number;
}

interface DashboardStats {
  totalProducts: number;
  pendingTreatments: number;
  activeOrders: number;
}

export default function PharmacyDashboard() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [token, setToken] = useState('')
  const [pharmacyId, setPharmacyId] = useState<number | null>(null)
  const [pharmacyData, setPharmacyData] = useState<PharmacyData | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [orders, setOrders] = useState<PharmacyOrder[]>([])
  const [activeView, setActiveView] = useState<ViewType>('dashboard')
  const [loading, setLoading] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<PharmacyOrder | null>(null)

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('pharmacy_token')
    const savedPharmacyId = localStorage.getItem('pharmacy_id')
    if (savedToken && savedPharmacyId) {
      setToken(savedToken)
      setPharmacyId(parseInt(savedPharmacyId))
      fetchDashboardData(savedToken)
      if (activeView === 'orders') {
        fetchOrders(parseInt(savedPharmacyId), savedToken)
      }
    }
  }, [])

  // Pharmacy login
  const handleLogin = async () => {
    try {
      setLoading(true)
      const data = await pharmacyLogin(email, password)
      if (data.token && data.pharmacy) {
        setToken(data.token)
        setPharmacyId(data.pharmacy.id)
        localStorage.setItem('pharmacy_token', data.token)
        localStorage.setItem('pharmacy_id', data.pharmacy.id.toString())
        await fetchDashboardData(data.token)
      } else {
        alert('Login failed: Invalid response')
      }
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Login error')
    } finally {
      setLoading(false)
    }
  }

  // Fetch dashboard data
  const fetchDashboardData = async (authToken: string) => {
    try {
      setLoading(true)
      const data = await fetchPharmacyDashboard(authToken)
      if (data.pharmacy) {
        setPharmacyData(data.pharmacy)
        setStats(data.stats)
      }
    } catch (err: any) {
      console.error('Error fetching dashboard:', err)
      alert('Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // Fetch orders
  const fetchOrders = async (pharmId: number, authToken: string) => {
    try {
      setLoading(true)
      const ordersData = await fetchPharmacyOrders(pharmId, authToken)
      setOrders(ordersData)
    } catch (err: any) {
      console.error('Error fetching orders:', err)
      alert('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  // Handle view change
  const handleViewChange = (view: ViewType) => {
    setActiveView(view)
    if (view === 'orders' && pharmacyId && token) {
      fetchOrders(pharmacyId, token)
    }
  }

  // Update order status
  const handleUpdateStatus = async (orderId: number, status: string) => {
    if (!pharmacyId || !token) return
    try {
      setLoading(true)
      await updateOrderStatus(pharmacyId, orderId, status, token)
      await fetchOrders(pharmacyId, token)
      await fetchDashboardData(token)
      alert('Order status updated successfully')
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  // Mark order as ready
  const handleMarkReady = async (orderId: number) => {
    if (!pharmacyId || !token) return
    try {
      setLoading(true)
      await markOrderReady(pharmacyId, orderId, token)
      await fetchOrders(pharmacyId, token)
      await fetchDashboardData(token)
      alert('Order marked as ready')
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'Failed to mark order as ready')
    } finally {
      setLoading(false)
    }
  }

  // Handle logout
  const handleLogout = () => {
    setToken('')
    setPharmacyId(null)
    setPharmacyData(null)
    setStats(null)
    setOrders([])
    setEmail('')
    setPassword('')
    setActiveView('dashboard')
    localStorage.removeItem('pharmacy_token')
    localStorage.removeItem('pharmacy_id')
  }

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower === 'ready' || statusLower === 'delivered') {
      return 'bg-green-100 text-green-800 border-green-200'
    } else if (statusLower === 'processing' || statusLower === 'approved') {
      return 'bg-blue-100 text-blue-800 border-blue-200'
    } else if (statusLower === 'declined' || statusLower === 'cancelled') {
      return 'bg-red-100 text-red-800 border-red-200'
    } else if (statusLower === 'picked_up') {
      return 'bg-purple-100 text-purple-800 border-purple-200'
    } else {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('de-DE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  // Get delivery status steps
  const getDeliverySteps = (status: string) => {
    const steps = [
      { key: 'PENDING', label: 'Pending', icon: Circle },
      { key: 'APPROVED', label: 'Approved', icon: CheckCircle },
      { key: 'PROCESSING', label: 'Processing', icon: Loader2 },
      { key: 'READY', label: 'Ready', icon: Package },
      { key: 'PICKED_UP', label: 'Picked Up', icon: Truck },
      { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle2 },
    ]
    return steps.map(step => ({
      ...step,
      completed: getStatusOrder(status) >= getStatusOrder(step.key)
    }))
  }

  const getStatusOrder = (status: string): number => {
    const order: Record<string, number> = {
      'PENDING': 0,
      'APPROVED': 1,
      'PROCESSING': 2,
      'READY': 3,
      'PICKED_UP': 4,
      'DELIVERED': 5,
    }
    return order[status.toUpperCase()] ?? 0
  }

  // If not logged in, show login form
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 inconsolata bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-2 title-gradient">Apotheke Login</h2>
          <p className="text-sm subtitle-text mb-6">Auf das Apotheken-Dashboard zugreifen</p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium form-label mb-2">
                E-Mail Adresse
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  id="email"
                  placeholder="pharmacy@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg inconsolata text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium form-label mb-2">
                Passwort
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg inconsolata text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin" size={20} />}
              Anmelden
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Logged in → show dashboard
  return (
    <div className="min-h-screen bg-gray-50 inconsolata">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold title-gradient mb-2">Apotheke Dashboard</h1>
            <p className="text-sm subtitle-text">
              {pharmacyData?.name} • {pharmacyData?.zip}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-outline flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg"
          >
            <LogOut size={16} />
            Abmelden
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => handleViewChange('dashboard')}
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${
              activeView === 'dashboard'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp size={18} />
              Dashboard
            </div>
          </button>
          <button
            onClick={() => handleViewChange('orders')}
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${
              activeView === 'orders'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} />
              Bestellungen
              {stats && stats.pendingTreatments > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">
                  {stats.pendingTreatments}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => handleViewChange('tracking')}
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${
              activeView === 'tracking'
                ? 'text-emerald-600 border-b-2 border-emerald-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Truck size={18} />
              Lieferverfolgung
            </div>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-emerald-600" />
          </div>
        )}

        {/* Dashboard View */}
        {!loading && activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Gesamt Produkte</CardTitle>
                  <Package className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Ausstehende Behandlungen</CardTitle>
                  <Clock className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{stats?.pendingTreatments || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Aktive Bestellungen</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats?.activeOrders || 0}</div>
                </CardContent>
              </Card>
            </div>

            {/* Pharmacy Info */}
            <Card>
              <CardHeader>
                <CardTitle>Apotheken Informationen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="font-semibold">{pharmacyData?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Postleitzahl</p>
                    <p className="font-semibold">{pharmacyData?.zip}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Kontakt</p>
                    <p className="font-semibold">{pharmacyData?.contact}</p>
                  </div>
                  {pharmacyData?.zipRange && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Lieferbereich</p>
                      <p className="font-semibold">{pharmacyData.zipRange}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orders View */}
        {!loading && activeView === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 px-6">
                  <div className="rounded-full bg-gray-100 p-4 mb-4">
                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Keine Bestellungen</h3>
                  <p className="text-sm text-gray-500 text-center max-w-sm">
                    Es gibt derzeit keine Bestellungen. Neue Bestellungen werden hier angezeigt.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {orders.map(order => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">{order.patientName}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Mail size={14} />
                              {order.patientEmail}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone size={14} />
                              {order.patientPhone}
                            </span>
                          </CardDescription>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex items-start gap-2 mb-2">
                          <AlertCircle size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Symptome</p>
                            <p className="text-sm text-gray-600">{order.symptoms}</p>
                          </div>
                        </div>

                        {/* Selected Products */}
                        {order.selectedProducts && order.selectedProducts.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm font-medium text-gray-700 mb-2">Bestellte Produkte:</p>
                            <ul className="space-y-1">
                              {order.selectedProducts.map((product: any, idx: number) => (
                                <li key={idx} className="text-sm text-gray-600 flex justify-between">
                                  <span>• {product.productName}</span>
                                  <span className="font-semibold">{product.quantity}g</span>
                                </li>
                              ))}
                            </ul>
                            {order.totalPrice && (
                              <div className="mt-2 pt-2 border-t border-gray-100">
                                <p className="text-sm font-bold text-gray-900 flex justify-between">
                                  <span>Gesamtpreis:</span>
                                  <span>€{order.totalPrice.toFixed(2)}</span>
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Prescription PDF Download */}
                        {order.prescriptionPdfPath && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <a
                              href={`${API_BASE}${order.prescriptionPdfPath}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                            >
                              <Package size={16} />
                              Rezept PDF herunterladen
                            </a>
                          </div>
                        )}
                        
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            Erstellt: {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4 border-t border-gray-100">
                        {order.status === 'APPROVED' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'PROCESSING')}
                              className="btn-primary flex-1 flex items-center justify-center gap-2 px-4 py-2.5 font-medium rounded-lg"
                            >
                              <Loader2 size={18} />
                              In Bearbeitung
                            </button>
                            <button
                              onClick={() => handleMarkReady(order.id)}
                              className="bg-green-600 hover:bg-green-700 text-white flex-1 flex items-center justify-center gap-2 px-4 py-2.5 font-medium rounded-lg"
                            >
                              <CheckCircle size={18} />
                              Als Bereit markieren
                            </button>
                          </>
                        )}
                        {order.status === 'PROCESSING' && (
                          <button
                            onClick={() => handleMarkReady(order.id)}
                            className="bg-green-600 hover:bg-green-700 text-white flex-1 flex items-center justify-center gap-2 px-4 py-2.5 font-medium rounded-lg"
                          >
                            <CheckCircle size={18} />
                            Als Bereit markieren
                          </button>
                        )}
                        {order.status === 'READY' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'PICKED_UP')}
                            className="bg-purple-600 hover:bg-purple-700 text-white flex-1 flex items-center justify-center gap-2 px-4 py-2.5 font-medium rounded-lg"
                          >
                            <Truck size={18} />
                            Als Abgeholt markieren
                          </button>
                        )}
                        {order.status === 'PICKED_UP' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                            className="bg-green-600 hover:bg-green-700 text-white flex-1 flex items-center justify-center gap-2 px-4 py-2.5 font-medium rounded-lg"
                          >
                            <CheckCircle2 size={18} />
                            Als Geliefert markieren
                          </button>
                        )}
                        {order.status === 'PENDING' && (
                          <div className="flex gap-2 w-full">
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'APPROVED')}
                              className="btn-success flex-1 flex items-center justify-center gap-2 px-4 py-2.5 font-medium rounded-lg"
                            >
                              <CheckCircle size={18} />
                              Genehmigen
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'DECLINED')}
                              className="btn-danger flex-1 flex items-center justify-center gap-2 px-4 py-2.5 font-medium rounded-lg"
                            >
                              <XCircle size={18} />
                              Ablehnen
                            </button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Delivery Tracking View */}
        {!loading && activeView === 'tracking' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 px-6">
                  <div className="rounded-full bg-gray-100 p-4 mb-4">
                    <Truck className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Keine Bestellungen zum Verfolgen</h3>
                  <p className="text-sm text-gray-500 text-center max-w-sm">
                    Es gibt derzeit keine Bestellungen zum Verfolgen.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {orders.filter(o => ['PROCESSING', 'READY', 'PICKED_UP', 'DELIVERED'].includes(o.status)).map(order => {
                  const steps = getDeliverySteps(order.status)
                  return (
                    <Card key={order.id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-1">{order.patientName}</CardTitle>
                            <CardDescription className="flex items-center gap-4 mt-2">
                              <span className="flex items-center gap-1">
                                <Mail size={14} />
                                {order.patientEmail}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone size={14} />
                                {order.patientPhone}
                              </span>
                            </CardDescription>
                          </div>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Delivery Progress Steps */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-4">
                            {steps.map((step, index) => {
                              const Icon = step.icon
                              const isLast = index === steps.length - 1
                              return (
                                <div key={step.key} className="flex items-center flex-1">
                                  <div className="flex flex-col items-center">
                                    <div className={`rounded-full p-2 ${
                                      step.completed 
                                        ? 'bg-emerald-600 text-white' 
                                        : 'bg-gray-200 text-gray-400'
                                    }`}>
                                      <Icon size={20} className={step.completed ? '' : 'opacity-50'} />
                                    </div>
                                    <p className={`text-xs mt-2 text-center ${
                                      step.completed ? 'text-emerald-600 font-semibold' : 'text-gray-500'
                                    }`}>
                                      {step.label}
                                    </p>
                                  </div>
                                  {!isLast && (
                                    <div className={`flex-1 h-1 mx-2 ${
                                      step.completed ? 'bg-emerald-600' : 'bg-gray-200'
                                    }`} />
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            Bestellung erstellt: {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

