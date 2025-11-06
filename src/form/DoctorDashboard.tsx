'use client'

import React, { useState } from 'react'
import {Eye, EyeOff, Lock, Mail, User, Clock, CheckCircle, XCircle, FileText, Phone, MapPin, AlertCircle, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface TreatmentRequest {
  id: number
  fullName: string
  email: string
  phone: string
  city: string
  symptoms: string
  status: string
  createdAt?: string
  updatedAt?: string
}

type ViewType = 'pending' | 'past'

export default function DoctorDashboard() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [token, setToken] = useState('')
  const [requests, setRequests] = useState<TreatmentRequest[]>([])
  const [pastRequests, setPastRequests] = useState<TreatmentRequest[]>([])
  const [activeView, setActiveView] = useState<ViewType>('pending')
  const [loading, setLoading] = useState(false)

  // Doctor login
  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/doctor/doctor-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (res.ok) {
        setToken(data.token)
        fetchRequests(data.token)
        fetchPastRequests(data.token)
      } else {
        alert(data.message || 'Login failed')
      }
    } catch (err) {
      console.error(err)
      alert('Login error')
    }
  }

  // Fetch pending requests
  const fetchRequests = async (authToken: string) => {
    try {
      setLoading(true)
      const res = await fetch(`${API_BASE}/api/doctor/requests`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      const data = await res.json()
      if (res.ok) setRequests(data.requests || [])
      else alert(data.message || 'Failed to fetch requests')
    } catch (err) {
      console.error(err)
      alert('Fetch error')
    } finally {
      setLoading(false)
    }
  }

  // Fetch past requests (all requests)
  const fetchPastRequests = async (authToken: string) => {
    try {
      // Try the /all endpoint first
      let res = await fetch(`${API_BASE}/api/doctor/requests/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      
      // If that fails, try with a query parameter
      if (!res.ok) {
        res = await fetch(`${API_BASE}/api/doctor/requests?status=all`, {
          headers: { Authorization: `Bearer ${authToken}` },
        })
      }
      
      const data = await res.json()
      if (res.ok) {
        // Filter out pending requests to show only past ones
        const allRequests = data.requests || data.data || []
        const past = allRequests.filter((req: TreatmentRequest) => 
          req.status && req.status.toLowerCase() !== 'pending'
        )
        setPastRequests(past)
      }
    } catch (err) {
      // If endpoint doesn't exist, we'll just show empty state
      console.log('Past requests endpoint not available, showing empty state')
      setPastRequests([])
    }
  }

  // Approve or Decline
  const updateRequest = async (id: number, action: 'approve' | 'decline') => {
    try {
      const res = await fetch(`${API_BASE}/api/doctor/requests/${id}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        fetchRequests(token)
        fetchPastRequests(token)
      } else {
        alert(data.message || `Failed to ${action}`)
      }
    } catch (err) {
      console.error(err)
      alert('Update error')
    }
  }

  // Handle logout
  const handleLogout = () => {
    setToken('')
    setRequests([])
    setPastRequests([])
    setEmail('')
    setPassword('')
    setActiveView('pending')
  }

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower === 'approved' || statusLower === 'approve') {
      return 'bg-green-100 text-green-800 border-green-200'
    } else if (statusLower === 'declined' || statusLower === 'decline') {
      return 'bg-red-100 text-red-800 border-red-200'
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

  // go back to home page To do
  
  // If not logged in, show login form
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 inconsolata">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-2 title-gradient">Arzt Login</h2>
          <p className="text-sm subtitle-text mb-6">Auf das medizinische Dashboard zugreifen</p>
          
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
                  placeholder="doctor@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg inconsolata text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg inconsolata text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
              className="w-full inconsolata bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 text-lg rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              Anmelden
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Get current requests based on active view
  const currentRequests = activeView === 'pending' ? requests : pastRequests

  // Empty state component
  const EmptyState = ({ view }: { view: ViewType }) => (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6">
        <div className="rounded-full bg-gray-100 p-4 mb-4">
          {view === 'pending' ? (
            <Clock className="w-8 h-8 text-gray-400" />
          ) : (
            <FileText className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {view === 'pending' ? 'Keine ausstehenden Anfragen' : 'Keine vergangenen Anfragen'}
        </h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">
          {view === 'pending' 
            ? 'Es gibt derzeit keine ausstehenden Behandlungsanfragen. Neue Anfragen werden hier angezeigt.'
            : 'Es wurden noch keine abgeschlossenen Anfragen gefunden.'}
        </p>
      </CardContent>
    </Card>
  )

  // Logged in → show requests
  return (
    <div className="min-h-screen bg-gray-50 inconsolata">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold title-gradient mb-2">Arzt Dashboard</h1>
            <p className="text-sm subtitle-text">Verwalten Sie Behandlungsanfragen</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <LogOut size={16} />
            Abmelden
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveView('pending')}
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${
              activeView === 'pending'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock size={18} />
              Ausstehend
              {requests.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                  {requests.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveView('past')}
            className={`px-6 py-3 font-medium text-sm transition-colors relative ${
              activeView === 'past'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText size={18} />
              Vergangene Anfragen
              {pastRequests.length > 0 && (
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded-full">
                  {pastRequests.length}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Requests List */}
        {!loading && (
          <>
            {currentRequests.length === 0 ? (
              <EmptyState view={activeView} />
            ) : (
              <div className="grid gap-4">
                {currentRequests.map(req => (
                  <Card key={req.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-1">{req.fullName}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <Mail size={14} />
                              {req.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone size={14} />
                              {req.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={14} />
                              {req.city}
                            </span>
                          </CardDescription>
                        </div>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(req.status)}`}>
                          {req.status}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex items-start gap-2 mb-2">
                          <AlertCircle size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Symptome</p>
                            <p className="text-sm text-gray-600">{req.symptoms}</p>
                          </div>
                        </div>
                        {(req.createdAt || req.updatedAt) && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                              {req.createdAt && `Erstellt: ${formatDate(req.createdAt)}`}
                              {req.updatedAt && req.updatedAt !== req.createdAt && ` • Aktualisiert: ${formatDate(req.updatedAt)}`}
                            </p>
                          </div>
                        )}
                      </div>
                      {activeView === 'pending' && (
                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                          <button
                            onClick={() => updateRequest(req.id, 'approve')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle size={18} />
                            Genehmigen
                          </button>
                          <button
                            onClick={() => updateRequest(req.id, 'decline')}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <XCircle size={18} />
                            Ablehnen
                          </button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}