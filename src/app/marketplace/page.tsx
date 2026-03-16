'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { Check, Leaf, ArrowRight, ChevronDown, ChevronUp, Package, Loader2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL

// =====================================================
// CENTRALIZED STRAIN IMAGE LIBRARY
// =====================================================
const STRAIN_IMAGE_LIBRARY: Record<string, string> = {
  'Mac Driver': '/strains/mac-driver.webp',
  'Black Cherry Punch': '/strains/black-cherry-punch.webp',
  'White Widow': '/strains/white-widow-cheese.jpg',
  'Slurricane': '/strains/slurricane.webp',
  'Hi Society': '/strains/hi-society-dfr.webp',
  'DFR': '/strains/hi-society-dfr.webp',
  'Madrecan': '/strains/madrecan-granddaddy-og.webp',
  'GDY': '/strains/madrecan-granddaddy-og.webp',
  'Granddaddy': '/strains/madrecan-granddaddy-og.webp',
  'Medical Saints': '/strains/medical-saints-lemon-skunk.jpg',
  'LSK': '/strains/medical-saints-lemon-skunk.jpg',
  'Lemon Skunk': '/strains/medical-saints-lemon-skunk.jpg',
  'Organic Sweetgrass': '/strains/organic-sweetgrass-mint-chocolate.webp',
  'MCC': '/strains/organic-sweetgrass-mint-chocolate.webp',
  'Mint Chocolate': '/strains/organic-sweetgrass-mint-chocolate.webp',
  'Remexian': '/strains/remexian-arr.webp',
  'ARR': '/strains/remexian-arr.webp',
  'Slouw': '/strains/slouw-ps3-og-kush.webp',
  'PS3': '/strains/slouw-ps3-og-kush.webp',
  'OGK': '/strains/slouw-ps3-og-kush.webp',
  'ZOIKS': '/strains/zoiks-bb.webp',
  'BB': '/strains/zoiks-bb.webp',
  'Space Rider': '/strains/zoiks-space-rider.webp',
}

const findStrainImage = (productName: string): string | null => {
  const nameLower = productName.toLowerCase()
  for (const [strainPattern, imageUrl] of Object.entries(STRAIN_IMAGE_LIBRARY)) {
    if (nameLower.includes(strainPattern.toLowerCase())) {
      return imageUrl
    }
  }
  return null
}

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='g1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2334d399'/%3E%3Cstop offset='100%25' stop-color='%2310b981'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='200' height='200' fill='%23f0fdf4'/%3E%3Ccircle cx='100' cy='85' r='50' fill='url(%23g1)' opacity='0.9'/%3E%3Cellipse cx='80' cy='75' rx='20' ry='25' fill='%2322c55e'/%3E%3Cellipse cx='120' cy='75' rx='20' ry='25' fill='%2316a34a'/%3E%3Cellipse cx='100' cy='95' rx='25' ry='20' fill='%2315803d'/%3E%3Ccircle cx='85' cy='70' r='3' fill='%23fbbf24' opacity='0.8'/%3E%3Ccircle cx='110' cy='80' r='2' fill='%23fb923c' opacity='0.7'/%3E%3Cpath d='M100 115 Q100 140 100 155' stroke='%2315803d' stroke-width='4' fill='none'/%3E%3Cpath d='M100 130 Q85 125 75 135' stroke='%2322c55e' stroke-width='2' fill='none'/%3E%3Cpath d='M100 130 Q115 125 125 135' stroke='%2322c55e' stroke-width='2' fill='none'/%3E%3C/svg%3E"

// localStorage treatmentRequest shape (city and zip/postcode)
interface TreatmentRequest {
  id: string
  patientId?: string
  pharmacyId?: string
  postcode?: string
  zip?: string
  city?: string
  fullName?: string
  email?: string
  phone?: string
  symptoms?: string
}

// API types
interface DeliveryOption {
  method: 'BOTENDIENST_NEARBY' | 'BOTENDIENST_FAR' | 'PICKUP'
  label: string
  fee: number
  estimatedTime: string
  available: boolean
}

interface MarketplacePharmacy {
  pharmacy: {
    id: number
    name: string
    zip: string
    city: string
    contact?: string
    deliveryType?: string
    withinDeliveryRadius?: boolean
  }
  deliveryOptions: DeliveryOption[]
  products: Product[]
  productCount: number
}

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

const getProductImage = (product: Product): string => {
  if (product.imageUrl) return product.imageUrl
  const strainImage = findStrainImage(product.name)
  if (strainImage) return strainImage
  return PLACEHOLDER_IMAGE
}

const PRESCRIPTION_FEE = 14.99
const MIN_FLOWER_QUANTITY = 5
const FLOWER_INCREMENT = 5
const MIN_OTHER_QUANTITY = 1

const getMinQuantity = (product: Product): number =>
  product.form === 'FLOWER' ? MIN_FLOWER_QUANTITY : MIN_OTHER_QUANTITY
const getQuantityIncrement = (product: Product): number =>
  product.form === 'FLOWER' ? FLOWER_INCREMENT : 1
const getDefaultQuantity = (product: Product): number =>
  product.form === 'FLOWER' ? MIN_FLOWER_QUANTITY : MIN_OTHER_QUANTITY
const isFlower = (product: Product): boolean => product.form === 'FLOWER'

export default function MarketplacePage() {
  const router = useRouter()
  const [marketplaceData, setMarketplaceData] = useState<MarketplacePharmacy[]>([])
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<number | null>(null)
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState<'BOTENDIENST_NEARBY' | 'BOTENDIENST_FAR' | 'PICKUP' | null>(null)
  const [selectedDeliveryFee, setSelectedDeliveryFee] = useState<number>(0)
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set())
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [treatmentRequest, setTreatmentRequest] = useState<TreatmentRequest | null>(null)
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())
  const [isClient, setIsClient] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [expandedPharmacyId, setExpandedPharmacyId] = useState<number | null>(null)

  const MAX_SELECTIONS = 3

  const products = selectedPharmacyId
    ? (marketplaceData.find(m => m.pharmacy.id === selectedPharmacyId)?.products ?? [])
    : []

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) loadData()
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
      const city = request.city ?? ''
      const zip = request.zip ?? request.postcode ?? ''
      if (!city || !zip) {
        setError('Stadt und Postleitzahl fehlen in der Behandlungsanfrage.')
        setLoading(false)
        return
      }
      const url = `${API_BASE}/api/marketplace?city=${encodeURIComponent(city)}&patientZip=${encodeURIComponent(zip)}`
      const res = await fetch(url, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Marketplace-Anfrage fehlgeschlagen')
      const json = await res.json()
      const data: MarketplacePharmacy[] = json.data ?? []
      setMarketplaceData(data)
      const initialQuantities: Record<number, number> = {}
      data.forEach(m => m.products.forEach(p => { initialQuantities[p.id] = getDefaultQuantity(p) }))
      setQuantities(prev => ({ ...initialQuantities, ...prev }))
      setError('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError('Fehler beim Laden der Apotheken: ' + message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = (productId: number) => {
    setFailedImages(prev => new Set(prev).add(productId))
  }

  const selectPharmacyAndDelivery = (pharmacyId: number, option: DeliveryOption) => {
    if (!option.available) return
    setSelectedPharmacyId(pharmacyId)
    setSelectedDeliveryMethod(option.method)
    setSelectedDeliveryFee(option.fee)
    setSelectedProducts(new Set())
    const pharmacy = marketplaceData.find(m => m.pharmacy.id === pharmacyId)
    if (pharmacy) {
      const initialQuantities: Record<number, number> = {}
      pharmacy.products.forEach(p => { initialQuantities[p.id] = getDefaultQuantity(p) })
      setQuantities(prev => ({ ...prev, ...initialQuantities }))
    }
    setValidationError(null)
  }

  const toggleProduct = (productId: number) => {
    const product = products.find(p => p.id === productId)
    setSelectedProducts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else if (newSet.size < MAX_SELECTIONS) {
        newSet.add(productId)
        if (product) {
          setQuantities(prevQty => ({ ...prevQty, [productId]: getDefaultQuantity(product) }))
        }
      }
      return newSet
    })
    setValidationError(null)
  }

  const handleQuantityChange = (productId: number, value: number, direction?: 'up' | 'down') => {
    const product = products.find(p => p.id === productId)
    if (!product) return
    const minQty = getMinQuantity(product)
    const increment = getQuantityIncrement(product)
    let newValue = value
    if (isFlower(product)) {
      if (direction === 'up') newValue = Math.ceil(value / increment) * increment
      else if (direction === 'down') newValue = Math.floor(value / increment) * increment
      else newValue = Math.round(value / increment) * increment
    }
    newValue = Math.max(minQty, Math.min(newValue, product.stock))
    setQuantities(prev => ({ ...prev, [productId]: newValue }))
    setValidationError(null)
  }

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

  const isSubmitDisabled = (): boolean => {
    if (selectedProducts.size === 0) return true
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
    if (!selectedPharmacyId || !selectedDeliveryMethod) {
      alert('Bitte wählen Sie eine Apotheke und Lieferoption.')
      return
    }
    if (!validateFlowerQuantities()) return

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
    const grandTotal = productsTotal + PRESCRIPTION_FEE + selectedDeliveryFee

    localStorage.setItem('pendingTreatmentRequestId', treatmentRequest.id)
    localStorage.setItem('selectedProducts', JSON.stringify(selectedItems))
    localStorage.setItem('productsTotal', productsTotal.toString())
    localStorage.setItem('prescriptionFee', PRESCRIPTION_FEE.toString())
    localStorage.setItem('deliveryFee', selectedDeliveryFee.toString())
    localStorage.setItem('totalPrice', grandTotal.toString())
    localStorage.setItem('selectedPharmacyId', String(selectedPharmacyId))
    localStorage.setItem('selectedDeliveryMethod', selectedDeliveryMethod)
    localStorage.setItem('deliveryFee', selectedDeliveryFee.toString())

    router.push('/payment/prescription')
  }

  const totalPrice = Array.from(selectedProducts).reduce((sum, id) => {
    const product = products.find(p => p.id === id)
    if (!product) return sum
    const qty = quantities[id] || getDefaultQuantity(product)
    return sum + product.price * qty
  }, 0)

  const displayDeliveryFee = selectedDeliveryFee

  if (!isClient || loading) {
    return (
      <div className="min-h-screen bg-beige inconsolata flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="subtitle-text text-lg">Apotheken werden geladen...</p>
        </div>
      </div>
    )
  }

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
      <div className="sticky top-0 z-40 bg-beige/95 backdrop-blur-sm border-b border-black/10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                <Check className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:inline text-sm font-medium text-emerald-700">Anfrage</span>
            </div>
            <div className="w-8 sm:w-16 h-0.5 bg-emerald-600" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center ring-4 ring-emerald-100">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <span className="hidden sm:inline text-sm font-bold text-emerald-700">Produktauswahl</span>
            </div>
            <div className="w-8 sm:w-16 h-0.5 bg-gray-300" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 font-bold text-sm">3</span>
              </div>
              <span className="hidden sm:inline text-sm font-medium text-gray-500">Anfrage absenden</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 pb-32">
        <div className="mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r-custom rounded-full mb-4">
            <Leaf className="w-4 h-4 mr-2 text-emerald-700" />
            <span className="text-sm font-medium subtitle-text">Apotheken & Lieferung</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold title-gradient mb-3 italic">
            Apotheke & Lieferart wählen
          </h1>
          <p className="subtitle-text text-base sm:text-lg">
            Wähle eine Apotheke und eine Lieferoption. Anschließend siehst du die verfügbaren Produkte (max. {MAX_SELECTIONS} Blüten).
          </p>
        </div>

        {/* Pharmacy cards */}
        <div className="space-y-3">
          {marketplaceData.map(m => {
            const isExpanded = expandedPharmacyId === m.pharmacy.id
            const isSelected = selectedPharmacyId === m.pharmacy.id
            const showProducts = isSelected && selectedDeliveryMethod !== null

            return (
              <div
                key={m.pharmacy.id}
                className={`bg-white rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                  isSelected ? 'border-emerald-500 shadow-lg shadow-emerald-500/10' : 'border-black/10'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedPharmacyId(isExpanded ? null : m.pharmacy.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <div>
                    <h2 className="font-bold text-lg text-gray-900">{m.pharmacy.name}</h2>
                    <p className="text-sm text-gray-600">
                      {m.pharmacy.zip} {m.pharmacy.city} · {m.productCount} Produkte
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mt-3 mb-2">Lieferoptionen:</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {m.deliveryOptions.map(opt => {
                        const active = isSelected && selectedDeliveryMethod === opt.method
                        return (
                          <button
                            key={opt.method}
                            type="button"
                            disabled={!opt.available}
                            onClick={() => selectPharmacyAndDelivery(m.pharmacy.id, opt)}
                            className={`
                              px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all
                              ${!opt.available
                                ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                                : active
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                                  : 'border-black/20 hover:border-emerald-400 hover:bg-emerald-50/50 text-gray-700'
                              }
                            `}
                          >
                            {opt.label} · €{opt.fee.toFixed(2)} · {opt.estimatedTime}
                          </button>
                        )
                      })}
                    </div>

                    {showProducts && (
                      <div className="pt-4">
                        <p className="text-sm font-bold text-gray-800 mb-3">Produkte:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                          {products.map(product => {
                            const isProductSelected = selectedProducts.has(product.id)
                            const strainInfo = getStrainType(product.name)
                            const imageUrl = failedImages.has(product.id) ? PLACEHOLDER_IMAGE : getProductImage(product)
                            return (
                              <div
                                key={product.id}
                                onClick={() => toggleProduct(product.id)}
                                className={`
                                  relative bg-white rounded-xl overflow-hidden cursor-pointer
                                  transition-all duration-300 ease-out
                                  ${isProductSelected
                                    ? 'ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                                    : 'border border-black/10 hover:border-black/20 hover:shadow-md hover:-translate-y-0.5'
                                  }
                                  ${selectedProducts.size >= MAX_SELECTIONS && !isProductSelected ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                              >
                                <div className={`
                                  absolute top-2 right-2 z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200
                                  ${isProductSelected ? 'bg-emerald-600 border-emerald-600' : 'bg-white/90 border-gray-300 backdrop-blur-sm'}
                                `}>
                                  {isProductSelected && <Check className="w-3 h-3 text-white" />}
                                </div>
                                <div className="absolute top-2 left-2 z-10">
                                  <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${strainInfo.color}`}>
                                    {strainInfo.type}
                                  </span>
                                </div>
                                <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 p-3">
                                  <img
                                    src={imageUrl}
                                    alt={product.name}
                                    onError={() => handleImageError(product.id)}
                                    className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                                  />
                                </div>
                                <div className="p-3">
                                  <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-1.5 line-clamp-2 leading-snug">
                                    {product.name}
                                  </h3>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-bold text-emerald-700">€{product.price.toFixed(2)}/g</span>
                                    <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">inkl. MwSt.</span>
                                  </div>
                                  <div className="flex gap-2 text-xs text-gray-600">
                                    <span><b>THC:</b> {product.thcPercent}%</span>
                                    <span><b>CBD:</b> {product.cbdPercent}%</span>
                                  </div>
                                  {isProductSelected && (
                                    <div className="mt-2 pt-2 border-t border-gray-100" onClick={e => e.stopPropagation()}>
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
                                              handleQuantityChange(product.id, currentQty - getQuantityIncrement(product), 'down')
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
                                              handleQuantityChange(product.id, currentQty + getQuantityIncrement(product), 'up')
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
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Floating Cart */}
      <div className={`
        fixed bottom-6 right-6 z-50 transition-all duration-300 ease-out
        ${selectedProducts.size > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
      `}>
        <div className="group relative">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transition-all duration-300 ease-out hover:shadow-[0_20px_60px_-15px_rgba(16,185,129,0.3)]">
            <div className="flex items-center gap-3 p-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-700 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white">
                  {selectedProducts.size}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 font-medium">Gesamtsumme</p>
                <p className="text-xl font-bold text-gray-900">
                  €{(totalPrice + PRESCRIPTION_FEE + displayDeliveryFee).toFixed(2)}
                </p>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isSubmitDisabled() || submitting}
                className={`
                  flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 whitespace-nowrap
                  ${!isSubmitDisabled()
                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:shadow-lg hover:scale-105 active:scale-95'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }
                `}
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (<><span>Weiter</span><ArrowRight className="w-4 h-4" /></>)}
              </button>
            </div>
            <div className="max-h-0 overflow-hidden transition-all duration-300 ease-out group-hover:max-h-[300px] border-t-0 group-hover:border-t border-gray-100">
              <div className="p-4 pt-3 space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(selectedProducts).map(id => {
                    const product = products.find(p => p.id === id)
                    if (!product) return null
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-1 rounded-full"
                      >
                        {product.name.split(' - ')[1]?.split(' ')[0] || product.name.split(' ')[0]}
                        <span className="text-emerald-500">{quantities[id] || getDefaultQuantity(product)}g</span>
                      </span>
                    )
                  })}
                </div>
                <div className="text-xs space-y-1 text-gray-600">
                  <div className="flex justify-between"><span>Produkte</span><span className="font-medium text-gray-900">€{totalPrice.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Rezeptgebühr</span><span>€{PRESCRIPTION_FEE.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Lieferung</span><span>€{displayDeliveryFee.toFixed(2)}</span></div>
                </div>
                {validationError && <p className="text-xs text-red-600 font-medium">{validationError}</p>}
              </div>
            </div>
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-400 to-green-400 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
        </div>
      </div>
    </div>
  )
}
