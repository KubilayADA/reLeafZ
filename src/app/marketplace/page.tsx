'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Product, API_BASE } from '@/lib/api'
import { useRouter } from 'next/navigation'
import { Check, Leaf, ArrowRight, Package, Loader2, Trash2, ShoppingBag } from 'lucide-react'
import { isLocalAccessBypassEnabled } from '@/lib/devAccess'
import { getStrainImage, STRAIN_PLACEHOLDER_IMAGE } from '@/lib/strains'
import {
  ProductStrainCard,
  fulfillmentFromDeliveryMethod,
} from '@/components/ui/faq/market-carousel/product-strain-card'
import './marketplace.css'

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
  const MAX_SELECTIONS = 3

  const selectedPharmacy = selectedPharmacyId
    ? (marketplaceData.find(m => m.pharmacy.id === selectedPharmacyId) ?? null)
    : null
  const products = selectedPharmacy?.products ?? []

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

  const selectPharmacy = (pharmacyId: number) => {
    if (pharmacyId === selectedPharmacyId) return
    setSelectedPharmacyId(pharmacyId)
    setSelectedProducts(new Set())
    const pharmacy = marketplaceData.find(m => m.pharmacy.id === pharmacyId)
    // Keep the previously chosen Lieferoption if the new pharmacy offers it.
    const carriedOver = pharmacy?.deliveryOptions.find(
      opt => opt.method === selectedDeliveryMethod && opt.available
    )
    if (carriedOver) {
      setSelectedDeliveryFee(carriedOver.fee)
    } else {
      setSelectedDeliveryMethod(null)
      setSelectedDeliveryFee(0)
    }
    if (pharmacy) {
      const initialQuantities: Record<number, number> = {}
      pharmacy.products.forEach(p => { initialQuantities[p.id] = getDefaultQuantity(p) })
      setQuantities(prev => ({ ...prev, ...initialQuantities }))
    }
    setValidationError(null)
  }

  const selectDelivery = (option: DeliveryOption) => {
    if (!option.available || selectedPharmacyId === null) return
    setSelectedDeliveryMethod(option.method)
    setSelectedDeliveryFee(option.fee)
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
  const cartGrandTotal = totalPrice + PRESCRIPTION_FEE + displayDeliveryFee

  const marketplaceHeader = (
    <MarketplaceLogoHeader
      cartCount={selectedProducts.size}
      cartTotal={cartGrandTotal}
      onCheckout={handleCheckout}
      checkoutDisabled={isSubmitDisabled()}
      submitting={submitting}
      validationError={validationError}
    />
  )

  if (!isClient || loading) {
    return (
      <div className="marketplace-page">
        {marketplaceHeader}
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
        {marketplaceHeader}
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
      {marketplaceHeader}

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

        <div className="marketplace-shell">
          <aside className="marketplace-sidebar">
            <section className="marketplace-sidebar-section">
              <h2 className="marketplace-sidebar-title">
                <span className="marketplace-step-badge">1</span>
                Apotheke wählen
              </h2>
              <div className="marketplace-choice-list" role="radiogroup" aria-label="Apotheke">
                {marketplaceData.map(m => {
                  const isSelected = selectedPharmacyId === m.pharmacy.id
                  return (
                    <button
                      key={m.pharmacy.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => selectPharmacy(m.pharmacy.id)}
                      className={`marketplace-choice marketplace-choice--radio${isSelected ? ' marketplace-choice--selected' : ''}`}
                    >
                      <span className="marketplace-choice-tick" aria-hidden>
                        {isSelected && <Check className="shrink-0" />}
                      </span>
                      <span className="marketplace-choice-body">
                        <span className="marketplace-choice-name">{m.pharmacy.name}</span>
                        <span className="marketplace-choice-meta">
                          {m.pharmacy.zip} {m.pharmacy.city} · {m.productCount} Produkte
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>

            <section
              className={`marketplace-sidebar-section${selectedPharmacy ? '' : ' marketplace-sidebar-section--locked'}`}
            >
              <h2 className="marketplace-sidebar-title">
                <span className="marketplace-step-badge">2</span>
                Lieferoption
              </h2>
              {selectedPharmacy ? (
                <div className="marketplace-choice-list" role="radiogroup" aria-label="Lieferoption">
                  {selectedPharmacy.deliveryOptions.map(opt => {
                    const active = selectedDeliveryMethod === opt.method
                    return (
                      <button
                        key={opt.method}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        disabled={!opt.available}
                        onClick={() => selectDelivery(opt)}
                        className={`marketplace-choice marketplace-choice--check${active ? ' marketplace-choice--selected' : ''}${!opt.available ? ' marketplace-choice--disabled' : ''}`}
                      >
                        <span className="marketplace-choice-tick" aria-hidden>
                          {active && <Check className="shrink-0" />}
                        </span>
                        <span className="marketplace-choice-body">
                          <span className="marketplace-choice-name">{opt.label}</span>
                          <span className="marketplace-choice-meta">
                            €{opt.fee.toFixed(2)} · {opt.estimatedTime}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p className="marketplace-sidebar-hint">Bitte zuerst eine Apotheke wählen.</p>
              )}
            </section>
          </aside>

          <section className="marketplace-products-panel">
            {!selectedPharmacy || selectedDeliveryMethod === null ? (
              <div className="marketplace-products-empty">
                <div className="marketplace-products-empty-icon" aria-hidden>
                  <Package />
                </div>
                <p className="marketplace-products-empty-title">Noch keine Produkte</p>
                <p className="marketplace-products-empty-text">
                  Wähle eine Apotheke und eine Lieferoption, um die verfügbaren Produkte zu sehen.
                </p>
              </div>
            ) : (
              <>
                <div className="marketplace-products-panel-header">
                  <h2 className="marketplace-products-panel-title">Produkte wählen</h2>
                  <span className="marketplace-products-counter">
                    {selectedProducts.size} / {MAX_SELECTIONS} Blüten
                  </span>
                </div>
                <div className="marketplace-product-grid">
                  {products
                    .filter(product => {
                      const minQty = product.form === 'FLOWER' ? MIN_FLOWER_QUANTITY : MIN_OTHER_QUANTITY
                      return product.stock >= minQty
                    })
                    .map(product => {
                      const isProductSelected = selectedProducts.has(product.id)
                      const imageUrl = failedImages.has(product.id)
                        ? STRAIN_PLACEHOLDER_IMAGE
                        : getStrainImage(product.name, product.imageUrl)
                      const atSelectionLimit = selectedProducts.size >= MAX_SELECTIONS && !isProductSelected
                      const currentQty = quantities[product.id] || getDefaultQuantity(product)
                      const minQty = getMinQuantity(product)
                      return (
                        <div
                          key={product.id}
                          className={`marketplace-product-card${isProductSelected ? ' marketplace-product-card--selected' : ''}${atSelectionLimit ? ' marketplace-product-card--limit' : ''}`}
                        >
                          <ProductStrainCard
                            strain={{
                              name: product.name,
                              thc: product.thcPercent,
                              cbd: product.cbdPercent,
                              price: product.price,
                              pharmacy: {
                                name: selectedPharmacy.pharmacy.name,
                                city: selectedPharmacy.pharmacy.city,
                              },
                              fulfillment: fulfillmentFromDeliveryMethod(selectedDeliveryMethod),
                              image: imageUrl,
                            }}
                            onImageError={() => handleImageError(product.id)}
                            mediaOverlay={
                              <button
                                type="button"
                                onClick={() => toggleProduct(product.id)}
                                disabled={atSelectionLimit}
                                aria-label={
                                  isProductSelected ? 'Produkt abwählen' : 'Produkt auswählen'
                                }
                                className={`marketplace-product-check${isProductSelected ? ' marketplace-product-check--on' : ''}`}
                              >
                                {isProductSelected && <Check className="shrink-0" aria-hidden />}
                              </button>
                            }
                            footer={
                              <>
                                <button
                                  type="button"
                                  onClick={() => toggleProduct(product.id)}
                                  disabled={atSelectionLimit}
                                  className={`marketplace-product-action${isProductSelected ? ' marketplace-product-action--selected' : ''}`}
                                >
                                  {isProductSelected ? 'Entfernen' : 'Auswählen'}
                                </button>
                                <div
                                  className={`marketplace-qty-reveal ${isProductSelected ? 'marketplace-qty-reveal--open' : 'marketplace-qty-reveal--closed'}`}
                                >
                                  <div className="marketplace-qty-reveal-inner">
                                    <div className="marketplace-qty-block">
                                      <div className="marketplace-qty-row">
                                        <div className="marketplace-qty-labels">
                                          <small>Menge:</small>
                                          {isFlower(product) && (
                                            <span className="marketplace-qty-hint">
                                              (nur {FLOWER_INCREMENT}g Schritte)
                                            </span>
                                          )}
                                        </div>
                                        <div className="marketplace-qty-controls">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (currentQty <= minQty) {
                                                toggleProduct(product.id)
                                                return
                                              }
                                              handleQuantityChange(
                                                product.id,
                                                currentQty - getQuantityIncrement(product),
                                                'down'
                                              )
                                            }}
                                            className="marketplace-qty-btn"
                                            aria-label={
                                              currentQty <= minQty
                                                ? 'Produkt entfernen'
                                                : 'Menge reduzieren'
                                            }
                                          >
                                            {currentQty <= minQty ? (
                                              <Trash2 size={12} aria-hidden />
                                            ) : (
                                              '-'
                                            )}
                                          </button>
                                          <span className="marketplace-qty-value">{currentQty}g</span>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleQuantityChange(
                                                product.id,
                                                currentQty + getQuantityIncrement(product),
                                                'up'
                                              )
                                            }
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
                              </>
                            }
                          />
                        </div>
                      )
                    })}
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

interface MarketplaceLogoHeaderProps {
  cartCount: number
  cartTotal: number
  onCheckout: () => void
  checkoutDisabled: boolean
  submitting: boolean
  validationError?: string | null
}

function MarketplaceLogoHeader({
  cartCount,
  cartTotal,
  onCheckout,
  checkoutDisabled,
  submitting,
  validationError,
}: MarketplaceLogoHeaderProps) {
  return (
    <header className="marketplace-logo-bar">
      <Link href="/" className="marketplace-logo-link" aria-label="reLeafZ Startseite">
        <img src="/logo1.png" alt="reLeafZ" className="marketplace-logo" />
      </Link>

      {cartCount > 0 && (
        <div className="marketplace-nav-cart">
          <div className="marketplace-nav-cart-summary">
            <span className="marketplace-nav-cart-icon-wrap" aria-hidden>
              <ShoppingBag />
              <span className="marketplace-nav-cart-badge">{cartCount}</span>
            </span>
            <div className="marketplace-nav-cart-total">
              <span className="marketplace-nav-cart-label">Gesamt</span>
              <span className="marketplace-nav-cart-amount">€{cartTotal.toFixed(2)}</span>
            </div>
          </div>
          {validationError && (
            <p className="marketplace-nav-cart-error">{validationError}</p>
          )}
          <button
            type="button"
            onClick={onCheckout}
            disabled={checkoutDisabled || submitting}
            className="marketplace-nav-cart-btn"
          >
            {submitting ? (
              <Loader2 className="marketplace-nav-cart-spinner" aria-hidden />
            ) : (
              <>
                <span>Weiter</span>
                <ArrowRight aria-hidden />
              </>
            )}
          </button>
        </div>
      )}
    </header>
  )
}
