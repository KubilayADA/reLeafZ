'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Package, CreditCard, CheckCircle2, AlertCircle, FileText } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function PaymentForm({ treatmentRequestId }: { treatmentRequestId: string }) {
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
          return_url: `${window.location.origin}/payment/success?type=products&requestId=${treatmentRequestId}`,
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
            Complete Payment
          </span>
        )}
      </Button>

      <p className="text-xs text-center subtitle-text opacity-70">
        Secure payment powered by Stripe
      </p>
    </form>
  )
}

export default function ProductPaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const treatmentRequestId = searchParams.get('requestId')
  
  const [clientSecret, setClientSecret] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [requestData, setRequestData] = useState<any>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (treatmentRequestId) {
      initializePayment()
    } else {
      setError('Missing treatment request ID')
      setLoading(false)
    }
  }, [treatmentRequestId])

  const initializePayment = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      // Create product payment intent
      const response = await fetch(`${API_BASE}/api/payments/product-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          treatmentRequestId: parseInt(treatmentRequestId!)
        })
      })

      const data = await response.json()

      if (response.ok && data.clientSecret) {
        setClientSecret(data.clientSecret)
        // Optionally fetch treatment request details to show products
        fetchRequestDetails(token)
      } else {
        setError(data.message || 'Failed to initialize payment')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initialize payment')
    } finally {
      setLoading(false)
    }
  }

  const fetchRequestDetails = async (token: string) => {
    try {
      // You'll need to add this endpoint or fetch from existing data
      // For now, we'll skip this
    } catch (err) {
      console.error('Failed to fetch request details:', err)
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
              onClick={() => router.push('/')}
              className="btn-primary inconsolata"
            >
              Back to Home
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
            <Package className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium subtitle-text">Doctor Approved</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold title-gradient mb-2 italic">
            COMPLETE YOUR ORDER
          </h1>
          <p className="subtitle-text">
            Your prescription has been approved! Complete payment to receive your products.
          </p>
        </div>

        {/* Success Notice */}
        <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-lg mb-2 text-green-900">Prescription Approved ✓</h3>
              <p className="text-sm subtitle-text mb-3">
                A qualified doctor has reviewed and approved your treatment request.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4" />
                <span className="font-medium">Request #{treatmentRequestId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-2xl border-2 border-black p-6 sm:p-8 shadow-xl">
          {clientSecret && (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentForm treatmentRequestId={treatmentRequestId!} />
            </Elements>
          )}
        </div>

        {/* What's Next */}
        <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-3 text-blue-900">📦 What Happens Next?</h3>
          <ol className="space-y-2 text-sm subtitle-text">
            <li className="flex gap-2">
              <span className="font-bold text-blue-700">1.</span>
              <span>Your payment is processed securely</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-700">2.</span>
              <span>The pharmacy prepares your order</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-700">3.</span>
              <span>You'll receive tracking information via email</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-blue-700">4.</span>
              <span>Your products will be delivered or ready for pickup</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  )
}