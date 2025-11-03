'use client'

import React, { useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface TreatmentRequest {
  id: number
  fullName: string
  email: string
  phone: string
  city: string
  symptoms: string
  status: string
}

export default function DoctorDashboard() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [requests, setRequests] = useState<TreatmentRequest[]>([])

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
      const res = await fetch(`${API_BASE}/api/doctor/requests`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      const data = await res.json()
      if (res.ok) setRequests(data.requests)
      else alert(data.message || 'Failed to fetch requests')
    } catch (err) {
      console.error(err)
      alert('Fetch error')
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
      if (res.ok) fetchRequests(token)
      else alert(data.message || `Failed to ${action}`)
    } catch (err) {
      console.error(err)
      alert('Update error')
    }
  }

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
              <input
                type="email"
                id="email"
                placeholder="doctor@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg inconsolata text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium form-label mb-2">
                Passwort
              </label>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg inconsolata text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
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

  // Logged in → show requests
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Pending Treatment Requests</h1>
      {requests.length === 0 && <p>No pending requests</p>}
      {requests.map(req => (
        <div key={req.id} className="border p-4 mb-4 rounded shadow-sm">
          <p><strong>Name:</strong> {req.fullName}</p>
          <p><strong>Email:</strong> {req.email}</p>
          <p><strong>Phone:</strong> {req.phone}</p>
          <p><strong>City:</strong> {req.city}</p>
          <p><strong>Symptoms:</strong> {req.symptoms}</p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => updateRequest(req.id, 'approve')}
              className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
            >
              Approve
            </button>
            <button
              onClick={() => updateRequest(req.id, 'decline')}
              className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}