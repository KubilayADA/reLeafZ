'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { CreditCard, CheckCircle2, AlertCircle } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CartItem {
  productId: number
  quantity: number
  productName: string
}

function PaymentForm({ treatmentRequestId, selectedProducts, totalPrice }: { 
  treatmentRequestId: string
  selectedProducts: CartItem[]
  totalPrice: number 
}) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [error, setError] = useState<string>('')
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setProcessing(true)
    setError('')

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setError(submitError.message || 'Payment failed')
        setProcessing(false)
        return
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?type=prescription&requestId=${treatmentRequestId}`,
        },
      })

      if (confirmError) {
        setError(confirmError.message || 'Payment failed')
        setProcessing(false)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-black p-6">
        <h3 className="text-lg font-bold mb-4 title-gradient italic">Order Summary</h3>
        
        <div className="space-y-3 mb-4">
          {selectedProducts.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm subtitle-text">
              <span>{item.productName} x{item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="border-t-2 border-black pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="subtitle-text">Product Total:</span>
            <span className="font-bold">€{totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base">
            <span className="font-bold">Consultation Fee:</span>
            <span className="text-xl font-bold text-green-700">€14.99</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs subtitle-text">
            <strong>ℹ️ Why pay now?</strong> The €14.99 consultation fee covers your doctor review. 
            After approval, you'll pay for the products (€{totalPrice.toFixed(2)}).
          </p>
        </div>
      </div>

      {/* Stripe Payment Element */}
      <div className="bg-white rounded-xl border-2 border-black p-6">
        <PaymentElement />
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full btn-success inconsolata font-medium py-4 text-lg disabled:opacity-50"
      >
        {processing ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            Processing Payment...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <CreditCard className="w-5 h-5" />
            Pay €14.99 & Send to Doctor
          </span>
        )}
      </Button>

      <p className="text-xs text-center subtitle-text opacity-70">
        Secure payment powered by Stripe • Your card details are never stored
      </p>
    </form>
  )
}

export default function PrescriptionPaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [clientSecret, setClientSecret] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [treatmentRequestId, setTreatmentRequestId] = useState<string>('')
  const [selectedProducts, setSelectedProducts] = useState<CartItem[]>([])
  const [totalPrice, setTotalPrice] = useState<number>(0)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    initializePayment()
  }, [])

  const initializePayment = async () => {
    try {
      // Get data from localStorage (passed from marketplace)
      const requestId = localStorage.getItem('pendingTreatmentRequestId')
      const products = localStorage.getItem('selectedProducts')
      const total = localStorage.getItem('totalPrice')

      if (!requestId || !products || !total) {
        setError('Missing payment information. Please restart from marketplace.')
        setLoading(false)
        return
      }

      setTreatmentRequestId(requestId)
      setSelectedProducts(JSON.parse(products))
      setTotalPrice(parseFloat(total))

      // Get token
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      // Create payment intent
      const response = await fetch(`${API_BASE}/api/payments/prescription-fee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          treatmentRequestId: parseInt(requestId)
        })
      })

      const data = await response.json()

      if (response.ok && data.clientSecret) {
        setClientSecret(data.clientSecret)
      } else {
        setError(data.message || 'Failed to initialize payment')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initialize payment')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-beige inconsolata flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
          <p className="subtitle-text">Preparing payment...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-beige inconsolata flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl border-2 border-black p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Payment Error</h2>
            <p className="subtitle-text mb-6">{error}</p>
            <Button 
              onClick={() => router.push('/marketplace')}
              className="btn-primary inconsolata"
            >
              Back to Marketplace
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-beige inconsolata py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r-custom mb-4">
            <CreditCard className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium subtitle-text">Secure Payment</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold title-gradient mb-2 italic">
            CONSULTATION FEE
          </h1>
          <p className="subtitle-text">
            Pay €14.99 to send your request to a doctor for review
          </p>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-2xl border-2 border-black p-6 sm:p-8 shadow-xl">
          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm 
                treatmentRequestId={treatmentRequestId}
                selectedProducts={selectedProducts}
                totalPrice={totalPrice}
              />
            </Elements>
          )}
        </div>

        {/* Trust Badges */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-4 text-sm subtitle-text">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span>24h Doctor Review</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}