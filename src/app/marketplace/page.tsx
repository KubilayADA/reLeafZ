'use client'

import { useState, useEffect } from 'react'
import { fetchPharmacyProducts, Product } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { Check, Leaf, ArrowRight, Sparkles, ShieldCheck, Clock, Package, Loader2 } from 'lucide-react'

// =====================================================
// STRAIN IMAGES - Replace placeholder URLs with real ones
// =====================================================
// Format: [productId]: 'your-image-url'
// Example: 1: 'https://example.com/strain1.jpg'
const STRAIN_IMAGES: Record<number, string> = {
  // Add your image URLs here, keyed by product ID
  // 1: 'https://your-image-url.com/strain1.jpg',
  // 2: 'https://your-image-url.com/strain2.jpg',
}

// Placeholder SVG for products without images
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='g1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2334d399'/%3E%3Cstop offset='100%25' stop-color='%2310b981'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='200' height='200' fill='%23f0fdf4'/%3E%3Ccircle cx='100' cy='85' r='50' fill='url(%23g1)' opacity='0.9'/%3E%3Cellipse cx='80' cy='75' rx='20' ry='25' fill='%2322c55e'/%3E%3Cellipse cx='120' cy='75' rx='20' ry='25' fill='%2316a34a'/%3E%3Cellipse cx='100' cy='95' rx='25' ry='20' fill='%2315803d'/%3E%3Ccircle cx='85' cy='70' r='3' fill='%23fbbf24' opacity='0.8'/%3E%3Ccircle cx='110' cy='80' r='2' fill='%23fb923c' opacity='0.7'/%3E%3Cpath d='M100 115 Q100 140 100 155' stroke='%2315803d' stroke-width='4' fill='none'/%3E%3Cpath d='M100 130 Q85 125 75 135' stroke='%2322c55e' stroke-width='2' fill='none'/%3E%3Cpath d='M100 130 Q115 125 125 135' stroke='%2322c55e' stroke-width='2' fill='none'/%3E%3C/svg%3E"

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

// Get strain type from name for badge color
const getStrainType = (name: string): { type: string; color: string } => {
  const nameLower = name.toLowerCase()
  if (nameLower.includes('indica') || nameLower.includes('kush') || nameLower.includes('og') || nameLower.includes('punch') || nameLower.includes('slurricane')) {
    return { type: 'Indica', color: 'bg-purple-100 text-purple-700 border-purple-200' }
  }
  if (nameLower.includes('sativa') || nameLower.includes('haze') || nameLower.includes('lemon') || nameLower.includes('skunk')) {
    return { type: 'Sativa', color: 'bg-amber-100 text-amber-700 border-amber-200' }
  }
  return { type: 'Hybrid', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' }
}

// Get image for product
const getProductImage = (product: Product): string => {
  if (STRAIN_IMAGES[product.id]) {
    return STRAIN_IMAGES[product.id]
  }
  return PLACEHOLDER_IMAGE
}

// Pricing constants
const PRESCRIPTION_FEE = 14.99
const DELIVERY_FEE = 4.99

// Minimum quantities by product form
const MIN_FLOWER_QUANTITY = 5
const FLOWER_INCREMENT = 5  // Flowers can only be ordered in 5g increments
const MIN_OTHER_QUANTITY = 1

// Get minimum quantity for a product based on its form
const getMinQuantity = (product: Product): number => {
  return product.form === 'FLOWER' ? MIN_FLOWER_QUANTITY : MIN_OTHER_QUANTITY
}

// Get quantity increment for a product
const getQuantityIncrement = (product: Product): number => {
  return product.form === 'FLOWER' ? FLOWER_INCREMENT : 1
}

// Get default quantity for a product
const getDefaultQuantity = (product: Product): number => {
  return product.form === 'FLOWER' ? MIN_FLOWER_QUANTITY : MIN_OTHER_QUANTITY
}

// Check if product is a flower
const isFlower = (product: Product): boolean => {
  return product.form === 'FLOWER'
}

export default function MarketplacePage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set())
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [pharmacyName, setPharmacyName] = useState('Apotheke')
  const [treatmentRequest, setTreatmentRequest] = useState<TreatmentRequest | null>(null)
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())
  const [isClient, setIsClient] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const MAX_SELECTIONS = 3

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      loadData()
    }
  }, [isClient])

  const loadData = async () => {
    try {
      setLoading(true)

      const treatmentData = localStorage.getItem('treatmentRequest')
      if (!treatmentData) {
        setError('Keine Behandlungsanfrage gefunden. Bitte füllen Sie zuerst das Formular aus.')
        setLoading(false)
        return
      }

      const request: TreatmentRequest = JSON.parse(treatmentData)
      setTreatmentRequest(request)

      let pharmacyId = localStorage.getItem('assignedPharmacyId')
      if (!pharmacyId && request.pharmacyId) {
        pharmacyId = request.pharmacyId.toString()
      }

      if (!pharmacyId || pharmacyId === 'null' || pharmacyId === 'undefined') {
        setError('Keine Apotheke zugewiesen. Bitte füllen Sie das Formular erneut aus.')
        setLoading(false)
        return
      }

      const data = await fetchPharmacyProducts(parseInt(request.pharmacyId))
      setProducts(data)
      
      // Initialize quantities based on product form (5g for flowers, 1 for others)
      const initialQuantities: Record<number, number> = {}
      data.forEach(p => { 
        initialQuantities[p.id] = getDefaultQuantity(p) 
      })
      setQuantities(initialQuantities)
      
      setError('')
    } catch (err: any) {
      setError('Fehler beim Laden der Produkte: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = (productId: number) => {
    setFailedImages(prev => new Set(prev).add(productId))
  }

  const toggleProduct = (productId: number) => {
    const product = products.find(p => p.id === productId)
    
    setSelectedProducts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else if (newSet.size < MAX_SELECTIONS) {
        newSet.add(productId)
        // Set default quantity when selecting (5g for flowers, 1 for others)
        if (product) {
          setQuantities(prevQty => ({
            ...prevQty,
            [productId]: getDefaultQuantity(product)
          }))
        }
      }
      return newSet
    })
    // Clear validation error when selection changes
    setValidationError(null)
  }

  const handleQuantityChange = (productId: number, value: number, direction?: 'up' | 'down') => {
    const product = products.find(p => p.id === productId)
    if (product) {
      const minQty = getMinQuantity(product)
      const increment = getQuantityIncrement(product)
      let newValue = value
      
      // For flowers, ensure value is in 5g increments
      if (isFlower(product)) {
        if (direction === 'up') {
          // Round up to next increment
          newValue = Math.ceil(value / increment) * increment
        } else if (direction === 'down') {
          // Round down to previous increment
          newValue = Math.floor(value / increment) * increment
        } else {
          // Direct input - snap to nearest valid increment
          newValue = Math.round(value / increment) * increment
        }
      }
      
      // Clamp to min and max (stock)
      newValue = Math.max(minQty, Math.min(newValue, product.stock))
      
      setQuantities(prev => ({
        ...prev,
        [productId]: newValue
      }))
      // Clear validation error when quantity changes
      setValidationError(null)
    }
  }

  // Validate all flower products have minimum 5g
  const validateFlowerQuantities = (): boolean => {
    for (const productId of selectedProducts) {
      const product = products.find(p => p.id === productId)
      if (product && isFlower(product)) {
        const qty = quantities[productId] || getDefaultQuantity(product)
        if (qty < MIN_FLOWER_QUANTITY) {
          setValidationError(`Mindestbestellmenge für Blüten: ${MIN_FLOWER_QUANTITY}g`)
          return false
        }
      }
    }
    setValidationError(null)
    return true
  }

  // Check if submit should be disabled
  const isSubmitDisabled = (): boolean => {
    if (selectedProducts.size === 0) return true
    // Check if any flower product has less than minimum quantity
    for (const productId of selectedProducts) {
      const product = products.find(p => p.id === productId)
      if (product && isFlower(product)) {
        const qty = quantities[productId] || getDefaultQuantity(product)
        if (qty < MIN_FLOWER_QUANTITY) return true
      }
    }
    return false
  }

  const handleCheckout = async () => {
    if (selectedProducts.size === 0) {
      alert('Bitte wählen Sie mindestens ein Produkt aus')
      return
    }

    if (!treatmentRequest) {
      alert('Behandlungsanfrage nicht gefunden')
      return
    }

    // Validate flower quantities
    if (!validateFlowerQuantities()) {
      return
    }

    const selectedItems = Array.from(selectedProducts).map(id => {
      const product = products.find(p => p.id === id)!
      const qty = quantities[id] || getDefaultQuantity(product)
      return {
        productId: id,
        quantity: qty,
        productName: product.name,
        pricePerUnit: product.price,
        subtotal: product.price * qty,
      }
    })

    const productsTotal = selectedItems.reduce((sum, item) => sum + item.subtotal, 0)
    const grandTotal = productsTotal + PRESCRIPTION_FEE + DELIVERY_FEE

    // Save pricing breakdown
    localStorage.setItem('pendingTreatmentRequestId', treatmentRequest.id)
    localStorage.setItem('selectedProducts', JSON.stringify(selectedItems))
    localStorage.setItem('productsTotal', productsTotal.toString())
    localStorage.setItem('prescriptionFee', PRESCRIPTION_FEE.toString())
    localStorage.setItem('deliveryFee', DELIVERY_FEE.toString())
    localStorage.setItem('totalPrice', grandTotal.toString())

    router.push('/payment/prescription')
  }

  const totalPrice = Array.from(selectedProducts).reduce((sum, id) => {
    const product = products.find(p => p.id === id)
    if (!product) return sum
    const qty = quantities[id] || getDefaultQuantity(product)
    return sum + (product.price * qty)
  }, 0)

  // Loading state
  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-beige inconsolata flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="subtitle-text text-lg">Produkte werden geladen...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-beige inconsolata flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-3xl border-2 border-black p-8 shadow-2xl">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-xl font-bold text-red-600 mb-2">Fehler</p>
            <p className="subtitle-text">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-beige inconsolata">
      {/* Progress Stepper */}
      <div className="sticky top-0 z-40 bg-beige/95 backdrop-blur-sm border-b border-black/10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {/* Step 1 - Complete */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:inline text-sm font-medium text-emerald-700">Anfrage</span>
            </div>
            
            <div className="w-8 sm:w-16 h-0.5 bg-emerald-600" />
            
            {/* Step 2 - Current */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center ring-4 ring-emerald-100">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <span className="hidden sm:inline text-sm font-bold text-emerald-700">Produktauswahl</span>
            </div>
            
            <div className="w-8 sm:w-16 h-0.5 bg-gray-300" />
            
            {/* Step 3 - Pending */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 font-bold text-sm">3</span>
              </div>
              <span className="hidden sm:inline text-sm font-medium text-gray-500">Anfrage absenden</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 pb-48">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r-custom rounded-full mb-4">
            <Leaf className="w-4 h-4 mr-2 text-emerald-700" />
            <span className="text-sm font-medium subtitle-text">{pharmacyName}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold title-gradient mb-3 italic">
            Gewünschte Blüten
          </h1>
          <p className="subtitle-text text-base sm:text-lg">
            Bitte wähle aus, welches Produkt für dich passend ist (max. {MAX_SELECTIONS} Blüten).
          </p>
        </div>

        {/* Product Grid - 4 columns on large screens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {products.map(product => {
            const isSelected = selectedProducts.has(product.id)
            const strainInfo = getStrainType(product.name)
            const imageUrl = failedImages.has(product.id) ? PLACEHOLDER_IMAGE : getProductImage(product)
            
            return (
              <div
                key={product.id}
                onClick={() => toggleProduct(product.id)}
                className={`
                  relative bg-white rounded-xl overflow-hidden cursor-pointer
                  transition-all duration-300 ease-out
                  ${isSelected 
                    ? 'ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/20 scale-[1.02]' 
                    : 'border border-black/10 hover:border-black/20 hover:shadow-md hover:-translate-y-0.5'
                  }
                  ${selectedProducts.size >= MAX_SELECTIONS && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {/* Selection indicator */}
                <div className={`
                  absolute top-2 right-2 z-10 w-5 h-5 rounded-full border-2 
                  flex items-center justify-center transition-all duration-200
                  ${isSelected 
                    ? 'bg-emerald-600 border-emerald-600' 
                    : 'bg-white/90 border-gray-300 backdrop-blur-sm'
                  }
                `}>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>

                {/* Strain type badge */}
                <div className="absolute top-2 left-2 z-10">
                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${strainInfo.color}`}>
                    {strainInfo.type}
                  </span>
                </div>

                {/* Product Image - smaller aspect ratio */}
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 p-3">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    onError={() => handleImageError(product.id)}
                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* Product Info - more compact */}
                <div className="p-3">
                  <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-1.5 line-clamp-2 leading-snug">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-emerald-700">
                      €{product.price.toFixed(2)}/g
                    </span>
                    <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      inkl. MwSt.
                    </span>
                  </div>

                  {/* THC/CBD Info - compact */}
                  <div className="flex gap-2 text-xs text-gray-600">
                    <span><b>THC:</b> {product.thcPercent}%</span>
                    <span><b>CBD:</b> {product.cbdPercent}%</span>
                  </div>

                  {/* Quantity selector (only when selected) */}
                  {isSelected && (
                    <div 
                      className="mt-2 pt-2 border-t border-gray-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium text-gray-600">Menge:</span>
                          {isFlower(product) && (
                            <span className="text-[10px] text-amber-600 font-medium">(nur {FLOWER_INCREMENT}g Schritte)</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              const currentQty = quantities[product.id] || getDefaultQuantity(product)
                              const increment = getQuantityIncrement(product)
                              handleQuantityChange(product.id, currentQty - increment, 'down')
                            }}
                            disabled={(quantities[product.id] || getDefaultQuantity(product)) <= getMinQuantity(product)}
                            className={`w-6 h-6 rounded flex items-center justify-center font-bold text-sm transition-colors
                              ${(quantities[product.id] || getDefaultQuantity(product)) <= getMinQuantity(product)
                                ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                              }`}
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold text-sm">{quantities[product.id] || getDefaultQuantity(product)}g</span>
                          <button
                            onClick={() => {
                              const currentQty = quantities[product.id] || getDefaultQuantity(product)
                              const increment = getQuantityIncrement(product)
                              handleQuantityChange(product.id, currentQty + increment, 'up')
                            }}
                            disabled={(quantities[product.id] || getDefaultQuantity(product)) >= product.stock}
                            className={`w-6 h-6 rounded flex items-center justify-center font-bold text-sm transition-colors
                              ${(quantities[product.id] || getDefaultQuantity(product)) >= product.stock
                                ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                              }`}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Fixed Bottom Bar with Summary */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black shadow-2xl z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            
            {/* Left: Selected Products Summary */}
            <div className="flex-1 w-full lg:w-auto">
              {selectedProducts.size === 0 ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Bitte wähle mindestens ein Produkt aus</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Deine Auswahl:</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(selectedProducts).map(id => {
                      const product = products.find(p => p.id === id)
                      if (!product) return null
                      return (
                        <div
                          key={id}
                          className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1"
                        >
                          <Leaf className="w-3 h-3 text-emerald-600" />
                          <span className="text-xs font-medium text-emerald-800 max-w-[120px] truncate">
                            {product.name.split(' - ')[1] || product.name.split(' ')[0]}
                          </span>
                          <span className="text-xs text-emerald-600">
                            {quantities[id] || getDefaultQuantity(product)}g
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Price Breakdown & Button */}
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4 w-full lg:w-auto">
              
              {/* Price Breakdown */}
              <div className="bg-gray-50 rounded-xl px-4 py-3 min-w-[220px]">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Produkte:</span>
                    <span className="font-medium">€{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Rezeptgebühr:</span>
                    <span className="font-medium">€{PRESCRIPTION_FEE.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Lieferung:</span>
                    <span className="font-medium">€{DELIVERY_FEE.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">Gesamt:</span>
                      <span className="font-bold text-lg text-emerald-700">
                        €{(totalPrice + PRESCRIPTION_FEE + DELIVERY_FEE).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <div className="flex flex-col items-end gap-1">
                {validationError && (
                  <p className="text-xs text-red-600 font-medium">{validationError}</p>
                )}
                <button
                  onClick={handleCheckout}
                  disabled={isSubmitDisabled() || submitting}
                  className={`
                    flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-base
                    transition-all duration-200 whitespace-nowrap
                    ${!isSubmitDisabled()
                      ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Wird gesendet...</span>
                    </>
                  ) : (
                    <>
                      <span>Weiter</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
