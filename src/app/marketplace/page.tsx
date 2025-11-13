'use client'

import { useState, useEffect } from 'react'
import { fetchPharmacyProducts, Product } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Package, CheckCircle2, Sparkles } from 'lucide-react'

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

      // Try to get pharmacyId from multiple sources ⬇️
    let pharmacyId = localStorage.getItem('assignedPharmacyId')
    
    if (!pharmacyId && request.pharmacyId) {
      pharmacyId = request.pharmacyId.toString()
    }

    console.log('Final pharmacy ID to use:', pharmacyId)

    if (!pharmacyId || pharmacyId === 'null' || pharmacyId === 'undefined') {
      setError('No pharmacy assigned. Please complete the form again.')
      setLoading(false)
      return
    }

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
    return (
      <div className="min-h-screen bg-beige inconsolata flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r-custom mb-4">
            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
            <span className="text-sm font-medium subtitle-text">Loading products...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-beige inconsolata flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-2xl border-2 border-black p-6 shadow-xl">
            <p className="text-lg font-semibold text-red-600 mb-2">Error</p>
            <p className="subtitle-text">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-beige inconsolata">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Header */}
        <div className="mb-8 sm:mb-12 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r-custom mb-6">
            <Package className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium subtitle-text">
              Select Your Preferred Strains
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold title-gradient mb-4 italic">
            CANNABIS MARKETPLACE
          </h1>
          <p className="text-base sm:text-lg subtitle-text max-w-2xl mx-auto mb-4">
            Your selection will be sent to the doctor for approval.
          </p>
          {treatmentRequest && (
            <div className="inline-flex items-center gap-4 text-sm subtitle-text bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 border border-black/10">
              <span className="font-medium">Patient:</span>
              <span>{treatmentRequest.fullName}</span>
              <span className="text-gray-400">|</span>
              <span className="font-medium">Coverage:</span>
              <span>{treatmentRequest.postcode}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* Products Section */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {products.map(product => (
                <div 
                  key={product.id} 
                  className="bg-white rounded-2xl border-2 border-black p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Product Info */}
                  <h3 className="font-bold text-xl sm:text-2xl mb-3 title-gradient italic">
                    {product.name}
                  </h3>

                  {/* Product Tags */}
                  {product.productTags && product.productTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.productTags.map(({ tag }) => (
                        <span
                          key={tag.id}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300 shadow-sm"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-sm subtitle-text mb-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Form:</span>
                      <span className="uppercase">{product.form}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">THC:</span>
                      <span>{product.thcPercent}%</span>
                      <span className="text-gray-400">|</span>
                      <span className="font-semibold">CBD:</span>
                      <span>{product.cbdPercent}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Price:</span>
                      <span className="text-lg font-bold text-green-700">
                        €{product.price.toFixed(2)}/{product.unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Stock:</span>
                      <span className={`font-bold ${product.stock > 5 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock} {product.stock === 1 ? 'unit' : 'units'}
                      </span>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantities[product.id] || 1}
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                      className="w-20 px-3 py-2 border-2 border-black rounded-lg inconsolata text-center font-semibold focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                    />
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock === 0}
                      className="flex-1 btn-success inconsolata font-medium"
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
            <div className="bg-white rounded-2xl border-2 border-black p-6 sticky top-4 shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <ShoppingCart className="w-5 h-5 text-green-700" />
                <h2 className="text-xl sm:text-2xl font-bold title-gradient italic">
                  Your Selection
                </h2>
                {cartCount > 0 && (
                  <span className="ml-auto bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full px-3 py-1 text-sm font-bold border-2 border-black">
                    {cartCount}
                  </span>
                )}
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="subtitle-text">No items selected yet</p>
                  <p className="text-xs subtitle-text mt-2 opacity-70">
                    Add products to your cart to continue
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto pr-2">
                    {cart.map(item => (
                      <div 
                        key={item.product.id} 
                        className="bg-beige rounded-lg border-2 border-black/20 p-3 hover:border-black/40 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-sm subtitle-text flex-1 pr-2">
                            {item.product.name}
                          </span>
                          <button
                            onClick={() => handleRemoveFromCart(item.product.id)}
                            className="text-red-600 hover:text-red-800 text-xs font-bold hover:underline transition-all"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="text-xs subtitle-text flex justify-between items-center">
                          <span>
                            {item.quantity}x €{item.product.price.toFixed(2)}
                          </span>
                          <span className="font-bold text-green-700">
                            = €{(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t-2 border-black pt-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold title-gradient">Total:</span>
                      <span className="text-2xl font-bold text-green-700">
                        €{cartTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Submit to Doctor Button */}
                  <Button 
                    onClick={handleCheckout}
                    disabled={submitting || cart.length === 0}
                    className="w-full btn-primary inconsolata font-medium py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Sending to Doctor...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Send to Doctor for Approval
                      </span>
                    )}
                  </Button>

                  <p className="text-xs subtitle-text mt-4 text-center opacity-70">
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