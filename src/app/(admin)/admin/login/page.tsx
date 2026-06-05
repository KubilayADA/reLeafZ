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
      router.push('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`${dmSans.className} fixed inset-0 flex items-center justify-center px-4`}
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(16,185,129,0.08) 0%, transparent 70%), #fbfdfb',
      }}
    >
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative w-full max-w-[400px]">
        {/* Card */}
        <div
          className="rounded-2xl bg-white border border-black/[0.08] p-8"
          style={{ boxShadow: '0 8px 48px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)' }}
        >
          {/* Logo */}
          <div className="mb-8">
            <p className="text-2xl font-bold tracking-tight text-gray-900">
              releaf<span className="text-emerald-500">Z</span>
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-widest font-semibold text-gray-400">
              Admin Control Panel
            </p>
          </div>

          {step === 1 ? (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Sign in</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Enter your admin email to receive a one-time code.
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="admin-email"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gray-500"
                  >
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
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    placeholder="admin@releafz.de"
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full rounded-xl bg-[#10b981] px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ boxShadow: '0 2px 12px rgba(16,185,129,0.25)' }}
                >
                  {loading ? 'Sending code…' : 'Send code →'}
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">Check your email</h1>
                <p className="mt-1 text-sm text-gray-500">
                  We sent a 6-digit code to{' '}
                  <span className="font-medium text-gray-700">{email}</span>.
                </p>
              </div>

              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="admin-otp"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gray-500"
                  >
                    One-time code
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
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center text-2xl font-bold tracking-[0.4em] text-gray-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    placeholder="······"
                    autoComplete="one-time-code"
                    disabled={loading}
                  />
                  <p className="mt-1.5 text-xs text-gray-400 text-center">
                    Enter the 6-digit code from your inbox
                  </p>
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full rounded-xl bg-[#10b981] px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  style={{ boxShadow: '0 2px 12px rgba(16,185,129,0.25)' }}
                >
                  {loading ? 'Verifying…' : 'Verify & sign in →'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1)
                    setOtp('')
                    setError('')
                  }}
                  className="w-full text-sm text-gray-500 hover:text-gray-800 transition underline underline-offset-2"
                >
                  ← Use a different email
                </button>
              </form>
            </>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-gray-400">
          releafZ · Admin access is restricted to authorized personnel
        </p>
      </div>
    </div>
  )
}
