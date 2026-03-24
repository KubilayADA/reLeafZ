'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DM_Sans } from 'next/font/google'
import { adminLogin, adminVerify } from '@/lib/adminApi'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export default function AdminLoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await adminLogin(email.trim())
      setStep(2)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifySubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await adminVerify(email.trim(), otp.trim())
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`${dmSans.className} fixed inset-0 z-50 flex items-center justify-center bg-beige px-4`}
    >
      <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white shadow-xl shadow-black/10 p-7 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-black">
          releaf<span className="text-green-600">Z</span> Admin
        </h1>
        <p className="mt-1 text-sm text-gray-500">Admin Control Panel</p>

        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="mt-7 space-y-4">
            <div>
              <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (error) setError('')
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-black outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-200"
                placeholder="admin@releafz.de"
                autoComplete="email"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full rounded-lg border border-black bg-[#72906F] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit} className="mt-7 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                value={email}
                readOnly
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5 text-sm text-gray-500"
              />
            </div>
            <div>
              <label htmlFor="admin-otp" className="mb-1.5 block text-sm font-medium text-gray-700">
                6-digit OTP
              </label>
              <input
                id="admin-otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => {
                  const next = e.target.value.replace(/\D/g, '').slice(0, 6)
                  setOtp(next)
                  if (error) setError('')
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm tracking-widest text-black outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-200"
                placeholder="000000"
                autoComplete="one-time-code"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full rounded-lg border border-black bg-[#72906F] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="button"
              onClick={() => {
                setStep(1)
                setOtp('')
                setError('')
              }}
              className="text-sm text-gray-600 underline underline-offset-2 hover:text-black"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
