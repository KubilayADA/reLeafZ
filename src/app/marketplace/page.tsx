'use client'

import { useState, useEffect } from 'react'
import { Product, API_BASE } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { Check, Leaf, ArrowRight, ChevronDown, ChevronUp, Package, Loader2, Trash2 } from 'lucide-react'
import { isLocalAccessBypassEnabled } from '@/lib/devAccess'
import './marketplace.css'

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

/* LOCAL ACCESS BYPASS BLOCK START (demo treatment + marketplace fallback data) */
const LOCALHOST_FALLBACK_TREATMENT_REQUEST: TreatmentRequest = {
  id: 'local-demo-request',
  postcode: '10115',
  zip: '10115',
  city: 'Berlin',
  fullName: 'Local Demo',
  email: 'local@releafz.dev',
  phone: '+49 30 000000',
  symptoms: 'Local testing',
}

const LOCALHOST_FALLBACK_MARKETPLACE_DATA: MarketplacePharmacy[] = [
  {
    pharmacy: {
      id: 9991,
      name: 'Demo Apotheke Mitte',
      zip: '10115',
      city: 'Berlin',
      contact: '030 000000',
      deliveryType: 'BOTENDIENST',
      withinDeliveryRadius: true,
    },
    deliveryOptions: [
      { method: 'BOTENDIENST_NEARBY', label: 'Botendienst (nah)', fee: 4.99, estimatedTime: '60-90 min', available: true },
      { method: 'PICKUP', label: 'Abholung', fee: 0, estimatedTime: 'Heute', available: true },
    ],
    products: [
      {
        id: 90001,
        pharmacyId: 9991,
        name: 'Demo Flower - White Widow',
        form: 'FLOWER',
        thcPercent: 22,
        cbdPercent: 1,
        price: 9.9,
        unit: 'g',
        stock: 100,
      },
      {
        id: 90002,
        pharmacyId: 9991,
        name: 'Demo Oil - Balanced 10/10',
        form: 'OIL',
        thcPercent: 10,
        cbdPercent: 10,
        price: 59.9,
        unit: 'ml',
        stock: 30,
      },
      {
        id: 90003,
        pharmacyId: 9991,
        name: 'Demo Flower - Lemon Skunk',
        form: 'FLOWER',
        thcPercent: 18,
        cbdPercent: 1,
        price: 8.4,
        unit: 'g',
        stock: 60,
      },
    ],
    productCount: 3,
  },
]
/* LOCAL ACCESS BYPASS BLOCK END (demo treatment + marketplace fallback data) */

type StrainTagVariant = 'indica' | 'sativa' | 'hybrid'

const getStrainType = (name: string): { type: string; variant: StrainTagVariant } => {
  const nameLower = name.toLowerCase()
  if (nameLower.includes('indica') || nameLower.includes('kush') || nameLower.includes('og') || nameLower.includes('punch') || nameLower.includes('slurricane')) {
    return { type: 'Indica', variant: 'indica' }
  }
  if (nameLower.includes('sativa') || nameLower.includes('haze') || nameLower.includes('lemon') || nameLower.includes('skunk')) {
    return { type: 'Sativa', variant: 'sativa' }
  }
  return { type: 'Hybrid', variant: 'hybrid' }
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
  /* LOCAL ACCESS BYPASS BLOCK START (toggle usage) */
  const canBypassAccess = isLocalAccessBypassEnabled()
  /* LOCAL ACCESS BYPASS BLOCK END (toggle usage) */
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
  const [flippedProductIds, setFlippedProductIds] = useState<Set<number>>(new Set())

  const MAX_SELECTIONS = 3

  const toggleProductCardFlip = (productId: number) => {
    setFlippedProductIds(prev => {
      const next = new Set(prev)
      if (next.has(productId)) next.delete(productId)
      else next.add(productId)
      return next
    })
  }

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
      const treatmentData = sessionStorage.getItem('treatmentRequest')
      /* LOCAL ACCESS BYPASS BLOCK START (seed treatmentRequest locally) */
      if (!treatmentData && canBypassAccess) {
        sessionStorage.setItem(
          'treatmentRequest',
          JSON.stringify(LOCALHOST_FALLBACK_TREATMENT_REQUEST)
        )
      }
      /* LOCAL ACCESS BYPASS BLOCK END (seed treatmentRequest locally) */

      const resolvedTreatmentData = sessionStorage.getItem('treatmentRequest')
      if (!resolvedTreatmentData) {
        setError('Keine Behandlungsanfrage gefunden. Bitte füllen Sie zuerst das Formular aus.')
        setLoading(false)
        return
      }
      let request: TreatmentRequest
      try {
        request = JSON.parse(resolvedTreatmentData)
      } catch {
        sessionStorage.removeItem('treatmentRequest')
        setError('Your session data is corrupted. Please return to the home page and start over.')
        setLoading(false)
        return
      }
      setTreatmentRequest(request)
      let city = request.city ?? ''
      let zip = request.zip ?? request.postcode ?? ''
      /* LOCAL ACCESS BYPASS BLOCK START (fill missing city/zip locally) */
      if ((!city || !zip) && canBypassAccess) {
        city = city || LOCALHOST_FALLBACK_TREATMENT_REQUEST.city || ''
        zip = zip || LOCALHOST_FALLBACK_TREATMENT_REQUEST.zip || ''
        request = { ...request, city, zip }
        setTreatmentRequest(request)
      }
      /* LOCAL ACCESS BYPASS BLOCK END (fill missing city/zip locally) */

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
      /* LOCAL ACCESS BYPASS BLOCK START (fallback to demo marketplace data locally) */
      if (canBypassAccess) {
        const initialQuantities: Record<number, number> = {}
        LOCALHOST_FALLBACK_MARKETPLACE_DATA.forEach(m =>
          m.products.forEach(p => { initialQuantities[p.id] = getDefaultQuantity(p) })
        )
        setMarketplaceData(LOCALHOST_FALLBACK_MARKETPLACE_DATA)
        setQuantities(prev => ({ ...initialQuantities, ...prev }))
        setTreatmentRequest(LOCALHOST_FALLBACK_TREATMENT_REQUEST)
        setError('')
        return
      }
      /* LOCAL ACCESS BYPASS BLOCK END (fallback to demo marketplace data locally) */
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

    sessionStorage.setItem('pendingTreatmentRequestId', treatmentRequest.id)
    sessionStorage.setItem('selectedProducts', JSON.stringify(selectedItems))
    sessionStorage.setItem('productsTotal', productsTotal.toString())
    sessionStorage.setItem('prescriptionFee', PRESCRIPTION_FEE.toString())
    sessionStorage.setItem('deliveryFee', selectedDeliveryFee.toString())
    sessionStorage.setItem('totalPrice', grandTotal.toString())
    sessionStorage.setItem('selectedPharmacyId', String(selectedPharmacyId))
    sessionStorage.setItem('selectedDeliveryMethod', selectedDeliveryMethod)
    sessionStorage.setItem('deliveryFee', selectedDeliveryFee.toString())

    const treatmentRequestId = parseInt(sessionStorage.getItem('pendingTreatmentRequestId') || '0')
    if (treatmentRequestId > 0) {
      try {
        await fetch(`${API_BASE}/api/treatment/${treatmentRequestId}/selection`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            pharmacyId: selectedPharmacyId,
            deliveryMethod: selectedDeliveryMethod,
            selectedProducts: selectedItems
          })
        })
      } catch (err) {
        if (process.env.NODE_ENV === 'development') console.error('Selection save failed:', err)
      }
    }

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
      <div className="marketplace-page">
        <div className="marketplace-loading">
          <div className="marketplace-loading-inner">
            <Loader2 className="marketplace-loading-icon" aria-hidden />
            <p className="marketplace-loading-text">Apotheken werden geladen...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="marketplace-page">
        <div className="marketplace-error">
          <div className="marketplace-error-inner">
            <div className="marketplace-error-card">
              <div className="marketplace-error-icon-wrap">
                <Package className="marketplace-error-icon" aria-hidden />
              </div>
              <p className="marketplace-error-title">Fehler</p>
              <p className="marketplace-error-text">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="marketplace-page">
      <header className="marketplace-header">
        <div className="marketplace-header-inner">
          <div className="marketplace-steps">
            <div className="marketplace-step-group">
              <div className="marketplace-step-dot">
                <Check className="shrink-0" aria-hidden />
              </div>
              <span className="marketplace-step-label marketplace-step-label--active">Anfrage</span>
            </div>
            <div className="marketplace-step-line" role="presentation" />
            <div className="marketplace-step-group">
              <div className="marketplace-step-dot marketplace-step-dot--current">
                <span className="marketplace-step-num">2</span>
              </div>
              <span className="marketplace-step-label marketplace-step-label--active">Produktauswahl</span>
            </div>
            <div className="marketplace-step-line marketplace-step-line--muted" role="presentation" />
            <div className="marketplace-step-group">
              <div className="marketplace-step-dot marketplace-step-dot--muted">
                <span className="marketplace-step-num">3</span>
              </div>
              <span className="marketplace-step-label marketplace-step-label--inactive">Anfrage absenden</span>
            </div>
          </div>
        </div>
      </header>

      <main className="marketplace-main">
        <div className="marketplace-intro">
          <div className="marketplace-pill">
            <Leaf aria-hidden />
            <span>Apotheken & Lieferung</span>
          </div>
          <h1 className="marketplace-title">
            Apotheke & Lieferart wählen
          </h1>
          <p className="marketplace-lead">
            Wähle eine Apotheke und eine Lieferoption. Anschließend siehst du die verfügbaren Produkte (max. {MAX_SELECTIONS} Blüten).
          </p>
        </div>

        <div className="marketplace-pharmacy-list">
          {marketplaceData.map(m => {
            const isExpanded = expandedPharmacyId === m.pharmacy.id
            const isSelected = selectedPharmacyId === m.pharmacy.id
            const showProducts = isSelected && selectedDeliveryMethod !== null

            return (
              <div
                key={m.pharmacy.id}
                className={`marketplace-pharmacy-card${isSelected ? ' marketplace-pharmacy-card--selected' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedPharmacyId(isExpanded ? null : m.pharmacy.id)}
                  className="marketplace-pharmacy-toggle"
                >
                  <div>
                    <h2 className="marketplace-pharmacy-name">{m.pharmacy.name}</h2>
                    <p className="marketplace-pharmacy-meta">
                      {m.pharmacy.zip} {m.pharmacy.city} · {m.productCount} Produkte
                    </p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="marketplace-chevron marketplace-chevron--open" aria-hidden />
                  ) : (
                    <ChevronDown className="marketplace-chevron" aria-hidden />
                  )}
                </button>

                <div className={`marketplace-pharmacy-expand ${isExpanded ? 'marketplace-pharmacy-expand--open' : 'marketplace-pharmacy-expand--closed'}`}>
                  <div className="marketplace-pharmacy-expand-inner">
                    <div className="marketplace-pharmacy-body">
                    <p className="marketplace-delivery-label">Lieferoptionen:</p>
                    <div className="marketplace-delivery-options">
                      {m.deliveryOptions.map(opt => {
                        const active = isSelected && selectedDeliveryMethod === opt.method
                        return (
                          <button
                            key={opt.method}
                            type="button"
                            disabled={!opt.available}
                            onClick={() => selectPharmacyAndDelivery(m.pharmacy.id, opt)}
                            className={`marketplace-delivery-btn${active ? ' marketplace-delivery-btn--active' : ''}${!opt.available ? ' marketplace-delivery-btn--disabled' : ''}`}
                          >
                            {opt.label} · €{opt.fee.toFixed(2)} · {opt.estimatedTime}
                          </button>
                        )
                      })}
                    </div>

                    <div className={`marketplace-products-reveal ${showProducts ? 'marketplace-products-reveal--open' : 'marketplace-products-reveal--closed'}`}>
                        <div className="marketplace-products-reveal-inner">
                          <div className="marketplace-products-inner">
                            <p className="marketplace-products-title">Produkte:</p>
                            <div className="marketplace-product-grid">
                              {products
                                .filter(product => {
                                  const minQty = product.form === 'FLOWER' ? MIN_FLOWER_QUANTITY : MIN_OTHER_QUANTITY
                                  return product.stock >= minQty
                                })
                                .map(product => {
                                const isProductSelected = selectedProducts.has(product.id)
                                const strainInfo = getStrainType(product.name)
                                const imageUrl = failedImages.has(product.id) ? PLACEHOLDER_IMAGE : getProductImage(product)
                                const atSelectionLimit = selectedProducts.size >= MAX_SELECTIONS && !isProductSelected
                                const currentQty = quantities[product.id] || getDefaultQuantity(product)
                                const minQty = getMinQuantity(product)
                                const isFlipped = flippedProductIds.has(product.id)
                                return (
                                  <div
                                    key={product.id}
                                    onClick={() => toggleProductCardFlip(product.id)}
                                    className={`marketplace-product-card${isProductSelected ? ' marketplace-product-card--selected' : ''}${atSelectionLimit ? ' marketplace-product-card--limit' : ''}${isFlipped ? ' marketplace-product-card--flipped' : ''}`}
                                  >
                                    <div className="marketplace-product-card-flip">
                                      <div className="marketplace-product-card-face marketplace-product-card-face--front">
                                        <button
                                          type="button"
                                          onClick={e => {
                                            e.stopPropagation()
                                            toggleProduct(product.id)
                                          }}
                                          disabled={atSelectionLimit}
                                          aria-label={isProductSelected ? 'Produkt abwählen' : 'Produkt auswählen'}
                                          className={`marketplace-product-check${isProductSelected ? ' marketplace-product-check--on' : ''}`}
                                        >
                                          {isProductSelected && <Check className="shrink-0" aria-hidden />}
                                        </button>
                                        <span className={`marketplace-strain-tag marketplace-strain-tag--${strainInfo.variant}`}>
                                          {strainInfo.type}
                                        </span>
                                        <div className="marketplace-product-media">
                                          <img
                                            src={imageUrl}
                                            alt={product.name}
                                            onError={() => handleImageError(product.id)}
                                            className="marketplace-product-img"
                                          />
                                        </div>
                                        <div className="marketplace-product-body">
                                          <h3 className="marketplace-product-name">
                                            {product.name}
                                          </h3>
                                          <div className="marketplace-product-price-row">
                                            <span className="marketplace-product-price">€{product.price.toFixed(2)}/g</span>
                                            <span className="marketplace-product-vat">inkl. MwSt.</span>
                                          </div>
                                          <div className="marketplace-product-meta">
                                            <span><b>THC:</b> {product.thcPercent}%</span>
                                            <span><b>CBD:</b> {product.cbdPercent}%</span>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={e => {
                                              e.stopPropagation()
                                              toggleProduct(product.id)
                                            }}
                                            disabled={atSelectionLimit}
                                            className={`marketplace-product-action${isProductSelected ? ' marketplace-product-action--selected' : ''}`}
                                          >
                                            {isProductSelected ? 'Entfernen' : 'Auswählen'}
                                          </button>
                                          <div
                                            className={`marketplace-qty-reveal ${isProductSelected ? 'marketplace-qty-reveal--open' : 'marketplace-qty-reveal--closed'}`}
                                            onClick={e => e.stopPropagation()}
                                          >
                                            <div className="marketplace-qty-reveal-inner">
                                              <div className="marketplace-qty-block">
                                                <div className="marketplace-qty-row">
                                                  <div className="marketplace-qty-labels">
                                                    <small>Menge:</small>
                                                    {isFlower(product) && (
                                                      <span className="marketplace-qty-hint">(nur {FLOWER_INCREMENT}g Schritte)</span>
                                                    )}
                                                  </div>
                                                  <div className="marketplace-qty-controls">
                                                    <button
                                                      type="button"
                                                      onClick={e => {
                                                        e.stopPropagation()
                                                        if (currentQty <= minQty) {
                                                          toggleProduct(product.id)
                                                          return
                                                        }
                                                        handleQuantityChange(product.id, currentQty - getQuantityIncrement(product), 'down')
                                                      }}
                                                      className="marketplace-qty-btn"
                                                      aria-label={currentQty <= minQty ? 'Produkt entfernen' : 'Menge reduzieren'}
                                                    >
                                                      {currentQty <= minQty ? <Trash2 size={12} aria-hidden /> : '-'}
                                                    </button>
                                                    <span className="marketplace-qty-value">{currentQty}g</span>
                                                    <button
                                                      type="button"
                                                      onClick={e => {
                                                        e.stopPropagation()
                                                        handleQuantityChange(product.id, currentQty + getQuantityIncrement(product), 'up')
                                                      }}
                                                      disabled={currentQty >= product.stock}
                                                      className="marketplace-qty-btn"
                                                    >
                                                      +
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="marketplace-product-card-face marketplace-product-card-face--back">
                                        <div className="marketplace-product-card-back-inner">
                                          <p className="marketplace-product-back-label">{strainInfo.type}</p>
                                          <h3 className="marketplace-product-back-title">{product.name}</h3>
                                          <p className="marketplace-product-back-placeholder">
                                            Hier erscheinen später Details zur Sorte.
                                          </p>
                                          <button
                                            type="button"
                                            className="marketplace-product-back-dismiss"
                                            onClick={e => {
                                              e.stopPropagation()
                                              toggleProductCardFlip(product.id)
                                            }}
                                          >
                                            Zurück
                                          </button>
                                          <p className="marketplace-product-back-hint">Oder auf die Karte tippen</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      <div
        className={`marketplace-floating-cart${
          selectedProducts.size > 0 ? ' marketplace-floating-cart--visible' : ' marketplace-floating-cart--hidden'
        }`}
      >
        <div className="marketplace-cart-wrap">
          <div className="marketplace-cart-panel">
            <div className="marketplace-cart-row-main">
              <div className="marketplace-cart-icon-wrap">
                <div className="marketplace-cart-icon-bg">
                  <Leaf aria-hidden />
                </div>
                <div className="marketplace-cart-badge">{selectedProducts.size}</div>
              </div>
              <div className="marketplace-cart-totals">
                <p className="marketplace-cart-label">Gesamtsumme</p>
                <p className="marketplace-cart-amount">
                  €{(totalPrice + PRESCRIPTION_FEE + displayDeliveryFee).toFixed(2)}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isSubmitDisabled() || submitting}
                className={`marketplace-cart-cta${!isSubmitDisabled() && !submitting ? ' marketplace-cart-cta--active' : ' marketplace-cart-cta--disabled'}`}
              >
                {submitting ? (
                  <Loader2 className="marketplace-cart-spinner" aria-hidden />
                ) : (
                  <>
                    <span>Weiter</span>
                    <ArrowRight aria-hidden />
                  </>
                )}
              </button>
            </div>
            <div className="marketplace-cart-details">
              <div className="marketplace-cart-details-inner">
                <div className="marketplace-cart-chips">
                  {Array.from(selectedProducts).map(id => {
                    const product = products.find(p => p.id === id)
                    if (!product) return null
                    return (
                      <span key={id} className="marketplace-cart-chip">
                        {product.name.split(' - ')[1]?.split(' ')[0] || product.name.split(' ')[0]}
                        <span className="marketplace-cart-chip-qty">{quantities[id] || getDefaultQuantity(product)}g</span>
                      </span>
                    )
                  })}
                </div>
                <div className="marketplace-cart-breakdown">
                  <div className="marketplace-cart-breakdown-row">
                    <span>Produkte</span>
                    <span>€{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="marketplace-cart-breakdown-row">
                    <span>Rezeptgebühr</span>
                    <span>€{PRESCRIPTION_FEE.toFixed(2)}</span>
                  </div>
                  <div className="marketplace-cart-breakdown-row">
                    <span>Lieferung</span>
                    <span>€{displayDeliveryFee.toFixed(2)}</span>
                  </div>
                </div>
                {validationError && <p className="marketplace-cart-validation">{validationError}</p>}
              </div>
            </div>
          </div>
          <div className="marketplace-cart-glow" aria-hidden />
        </div>
      </div>
    </div>
  )
}
