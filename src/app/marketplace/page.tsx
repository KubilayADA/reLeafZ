'use client'

import { useState, useEffect } from 'react'
import { fetchPharmacyProducts, Product } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface CartItem {
  product: Product
  quantity: number
}

interface TreatmentRequest {
  id: string
  patientId: string
  pharmacyId: string
  postcode: string
  fullName: string
  email: string
  phone: string
  symptoms: string
}

export default function MarketplacePage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [pharmacy, setPharmacy] = useState<any>(null)
  const [treatmentRequest, setTreatmentRequest] = useState<TreatmentRequest | null>(null)
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})

  const API_BASE = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // Get treatment request from localStorage
      const treatmentData = localStorage.getItem('treatmentRequest')
      if (!treatmentData) {
        setError('No treatment request found. Please complete the form first.')
        setLoading(false)
        return
      }

      const request: TreatmentRequest = JSON.parse(treatmentData)
      setTreatmentRequest(request)

      // Fetch products for assigned pharmacy
      const data = await fetchPharmacyProducts(parseInt(request.pharmacyId))
      setProducts(data)
      setError('')
    } catch (err: any) {
      setError('Failed to load products: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product: Product) => {
    const qty = quantities[product.id] || 1

    const existingItem = cart.find(item => item.product.id === product.id)

    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + qty }
          : item
      ))
    } else {
      setCart([...cart, { product, quantity: qty }])
    }

    setQuantities({ ...quantities, [product.id]: 1 })
  }

  const handleRemoveFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId))
  }

  const handleQuantityChange = (productId: number, value: string) => {
    const qty = parseInt(value) || 1
    setQuantities({ ...quantities, [productId]: Math.max(1, qty) })
  }

  // NEW: Submit order to doctor with selected strain
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Please add at least one product to cart')
      return
    }

    if (!treatmentRequest) {
      alert('Treatment request not found')
      return
    }

    setSubmitting(true)

    try {
      // Send finalized request to doctor with selected strains
      const response = await fetch(`${API_BASE}/api/treatment/finalize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          treatmentRequestId: treatmentRequest.id,
          selectedProducts: cart.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            productName: item.product.name,
          })),
          totalPrice: cartTotal,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        alert('Request sent to doctor for approval!')
        // Clear localStorage and redirect
        localStorage.removeItem('treatmentRequest')
        router.push('/doctor-approval-pending') // Or wherever you want to redirect
      } else {
        alert(result.message || 'Checkout failed')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('An error occurred during checkout')
    } finally {
      setSubmitting(false)
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  if (loading) {
    return <div className="p-8 text-center">Loading products...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Cannabis Marketplace</h1>
          <p className="text-gray-600">
            Select your preferred strains. Your selection will be sent to the doctor for approval.
          </p>
          {treatmentRequest && (
            <p className="text-sm text-gray-500 mt-2">
              Patient: {treatmentRequest.fullName} | Pharmacy Coverage: {treatmentRequest.postcode}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Products Section */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  {/* Product Info */}
                  <h3 className="font-bold text-lg mb-2">{product.name}</h3>

                  <div className="text-sm text-gray-600 mb-3 space-y-1">
                    <p>Form: {product.form}</p>
                    <p>THC: {product.thcPercent}% | CBD: {product.cbdPercent}%</p>
                    <p>Price: €{product.price.toFixed(2)}/{product.unit}</p>
                    <p className={product.stock > 5 ? 'text-green-600' : 'text-red-600'}>
                      Stock: {product.stock}
                    </p>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantities[product.id] || 1}
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded"
                    />
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Your Selection ({cartCount})</h2>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No items selected yet</p>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.product.id} className="border-b pb-3">
                        <div className="flex justify-between mb-1">
                          <span className="font-semibold text-sm">{item.product.name}</span>
                          <button
                            onClick={() => handleRemoveFromCart(item.product.id)}
                            className="text-red-600 hover:text-red-800 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="text-xs text-gray-600">
                          {item.quantity}x €{item.product.price.toFixed(2)} = €{(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>€{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Submit to Doctor Button */}
                  <Button 
                    onClick={handleCheckout}
                    disabled={submitting || cart.length === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                  >
                    {submitting ? 'Sending to Doctor...' : 'Send to Doctor for Approval'}
                  </Button>

                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Your selection will be reviewed by our doctor
                  </p>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}