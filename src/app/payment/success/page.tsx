'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle2, Package, FileText, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paymentType = searchParams.get('type') // 'prescription' or 'products'
  const requestId = searchParams.get('requestId')
  
  const [loading, setLoading] = useState(true)
  const [finalized, setFinalized] = useState(false)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (paymentType === 'prescription' && requestId) {
      // After prescription payment, finalize the request (send to doctor)
      finalizeRequest()
    } else {
      setLoading(false)
    }
  }, [paymentType, requestId])

  const finalizeRequest = async () => {
    try {
      const token = localStorage.getItem('token')
      const selectedProducts = localStorage.getItem('selectedProducts')
      const totalPrice = localStorage.getItem('totalPrice')

      if (!selectedProducts || !totalPrice) {
        setLoading(false)
        return
      }

      const response = await fetch(`${API_BASE}/api/treatment/finalize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          treatmentRequestId: parseInt(requestId!),
          selectedProducts: JSON.parse(selectedProducts),
          totalPrice: parseFloat(totalPrice)
        })
      })

      if (response.ok) {
        setFinalized(true)
        // Clear localStorage
        localStorage.removeItem('pendingTreatmentRequestId')
        localStorage.removeItem('selectedProducts')
        localStorage.removeItem('totalPrice')
      }
    } catch (err) {
      console.error('Finalize error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-beige inconsolata flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
          <p className="subtitle-text">Finalizing your request...</p>
        </div>
      </div>
    )
  }

  // PRESCRIPTION PAYMENT SUCCESS
  if (paymentType === 'prescription') {
    return (
      <div className="min-h-screen bg-beige inconsolata py-12 px-4">
        <div className="max-w-2xl mx-auto">
          
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4 animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold title-gradient mb-2 italic">
              PAYMENT SUCCESSFUL!
            </h1>
            <p className="subtitle-text text-lg">
              Your consultation fee has been processed
            </p>
          </div>

          {/* Success Card */}
          <div className="bg-white rounded-2xl border-2 border-black p-8 shadow-xl mb-6">
            <div className="space-y-6">
              
              {/* Payment Details */}
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border-2 border-green-500">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-bold text-green-900">€14.99 Paid</p>
                  <p className="text-sm subtitle-text">Request #{requestId}</p>
                </div>
              </div>

              {/* What's Next */}
              <div>
                <h3 className="font-bold text-xl mb-4 title-gradient italic">What Happens Next?</h3>
                <div className="space-y-4">
                  
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Doctor Review (24 hours)</h4>
                      <p className="text-sm subtitle-text">
                        A qualified doctor will review your treatment request and selected products.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Prescription Approval</h4>
                      <p className="text-sm subtitle-text">
                        If approved, you'll receive an email with your prescription and a payment link for your products.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Package className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">Pharmacy Fulfillment</h4>
                      <p className="text-sm subtitle-text">
                        After product payment, the pharmacy will prepare your order for delivery or pickup.
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Email Notice */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm subtitle-text">
                  📧 <strong>Check your email</strong> - You'll receive updates about your request status.
                </p>
              </div>

            </div>
          </div>

          {/* Actions */}
          <div className="text-center">
            <Button 
              onClick={() => router.push('/')}
              className="btn-primary inconsolata px-8"
            >
              Return to Home
            </Button>
          </div>

        </div>
      </div>
    )
  }

  // PRODUCT PAYMENT SUCCESS
  return (
    <div className="min-h-screen bg-beige inconsolata py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4 animate-bounce">
            <Package className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold title-gradient mb-2 italic">
            ORDER CONFIRMED!
          </h1>
          <p className="subtitle-text text-lg">
            Your products are being prepared
          </p>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-2xl border-2 border-black p-8 shadow-xl mb-6">
          
          <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border-2 border-green-500 mb-6">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-bold text-green-900">Payment Successful</p>
              <p className="text-sm subtitle-text">Order #{requestId}</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-xl mb-4 title-gradient italic">Next Steps</h3>
            
            <div className="space-y-3 text-sm subtitle-text">
              <div className="flex gap-3">
                <span className="font-bold text-green-600">✓</span>
                <span>Your payment has been processed</span>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-blue-600">→</span>
                <span>The pharmacy is now preparing your order</span>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-purple-600">📧</span>
                <span>You'll receive tracking information via email</span>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-orange-600">📦</span>
                <span>Your products will be delivered or ready for pickup soon</span>
              </div>
            </div>
          </div>

        </div>

        {/* Actions */}
        <div className="text-center">
          <Button 
            onClick={() => router.push('/')}
            className="btn-primary inconsolata px-8"
          >
            Return to Home
          </Button>
        </div>

      </div>
    </div>
  )
}