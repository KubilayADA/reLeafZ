'use client'

import { useState } from 'react'
import { 
  fetchAllProducts, 
  fetchPharmacyProducts, 
  checkProductAvailability,
  patientLogin,
  patientRegister 
} from '@/lib/api'

export default function TestPage() {
  const [results, setResults] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(false)

  const log = (key: string, data: any) => {
    setResults(prev => ({ ...prev, [key]: data }))
    console.log(`[${key}]`, data)
  }

  // Test 1: Fetch all products
  const testAllProducts = async () => {
    setLoading(true)
    try {
      const data = await fetchAllProducts()
      log('allProducts', { success: true, count: data.length, sample: data[0] })
    } catch (error: any) {
      log('allProducts', { error: error.message })
    }
    setLoading(false)
  }

  // Test 2: Fetch pharmacy 1 products
  const testPharmacyProducts = async () => {
    setLoading(true)
    try {
      const data = await fetchPharmacyProducts(8)
      log('pharmacyProducts', { success: true, count: data.length, sample: data[0] })
    } catch (error: any) {
      log('pharmacyProducts', { error: error.message })
    }
    setLoading(false)
  }

  // Test 3: Check availability
  const testAvailability = async () => {
    setLoading(true)
    try {
      const result = await checkProductAvailability([
        { productId: 1, quantity: 5 },
        { productId: 2, quantity: 10 }
      ])
      log('checkAvailability', result)
    } catch (error: any) {
      log('checkAvailability', { error: error.message })
    }
    setLoading(false)
  }

  // Test 4: Patient register
  const testRegister = async () => {
    setLoading(true)
    try {
      const data = await patientRegister({
        email: `test${Date.now()}@example.com`,
        postcode: '10115',
        fullName: 'Test User',
        phone: '+49 30 12345678',
        city: 'Berlin',
        symptoms: 'Test symptoms'
      })
      log('patientRegister', { success: true, token: data.token.slice(0, 20) + '...', patientId: data.treatmentRequest.patientId })
    } catch (error: any) {
      log('patientRegister', { error: error.message })
    }
    setLoading(false)
  }

  // Test 5: Patient login
  const testLogin = async () => {
    setLoading(true)
    try {
      const data = await patientLogin('testpatient@example.com', '10115')
      log('patientLogin', { ...data, token: data.token?.slice(0, 20) + '...' || 'N/A' })
    } catch (error: any) {
      log('patientLogin', { error: error.message })
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Testing Dashboard</h1>

        {/* Test Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <button
            onClick={testAllProducts}
            disabled={loading}
            className="bg-blue-600 text-white p-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            1. Fetch All Products
          </button>

          <button
            onClick={testPharmacyProducts}
            disabled={loading}
            className="bg-blue-600 text-white p-4 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            2. Fetch Pharmacy 1 Products
          </button>

          <button
            onClick={testAvailability}
            disabled={loading}
            className="bg-green-600 text-white p-4 rounded hover:bg-green-700 disabled:opacity-50"
          >
            3. Check Availability
          </button>

          <button
            onClick={testRegister}
            disabled={loading}
            className="bg-purple-600 text-white p-4 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            4. Patient Register
          </button>

          <button
            onClick={testLogin}
            disabled={loading}
            className="bg-purple-600 text-white p-4 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            5. Patient Login
          </button>
        </div>

        {/* Results */}
        <div className="bg-white rounded p-6 shadow">
          <h2 className="text-xl font-bold mb-4">Results</h2>
          {Object.keys(results).length === 0 ? (
            <p className="text-gray-500">Click buttons to run tests...</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(results).map(([key, value]: [string, any]) => (
                <div key={key} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">{key}</h3>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Backend Status */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded p-4">
          <p className="text-sm text-gray-600">
            Backend URL: <code className="bg-gray-100 px-2 py-1 rounded">{process.env.NEXT_PUBLIC_API_URL}</code>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Make sure backend is running: <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code>
          </p>
        </div>
      </div>
    </div>
  )
}