'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DM_Sans } from 'next/font/google'
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  Building2,
  FileText,
  UserCog,
  BarChart3,
  LogOut,
} from 'lucide-react'
import { adminLogout, adminMe } from '@/lib/adminApi'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Patients', href: '/patients', icon: Users },
  { label: 'Doctors', href: '/doctors', icon: Stethoscope },
  { label: 'Pharmacies', href: '/pharmacies', icon: Building2 },
  { label: 'Prescriptions', href: '/prescriptions', icon: FileText },
  { label: 'Team', href: '/team', icon: UserCog },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
]

type AdminUser = {
  id: number
  email: string
  name: string
  role: string
  isActive: boolean
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [admin, setAdmin] = useState<AdminUser | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const me = await adminMe()
        if (mounted) setAdmin(me)
      } catch {
        if (mounted) {
          setAdmin(null)
        }
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const handleLogout = async () => {
    try {
      await adminLogout()
    } finally {
      router.push('/login')
    }
  }

  return (
    <div className={`${dmSans.className} min-h-screen bg-beige text-black`}>
      <aside className="fixed left-0 top-0 h-screen w-[240px] border-r border-black/10 bg-white/90 backdrop-blur-sm">
        <div className="h-full flex flex-col">
          <div className="px-6 py-7 border-b border-black/10">
            <p className="text-xl font-bold tracking-tight">
              releaf<span className="text-green-600">Z</span>
            </p>
            <p className="mt-3 text-xs text-gray-500">Admin Control Panel</p>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-colors border-l-2 ${
                    isActive
                      ? 'border-l-green-600 text-green-700 bg-green-50/70 font-medium'
                      : 'border-l-transparent text-gray-700 hover:text-black hover:bg-black/5'
                  }`}
                >
                  <Icon size={17} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="px-4 py-4 border-t border-black/10">
            <div className="mb-3 px-2">
              <p className="text-sm font-medium text-gray-900 truncate">
                {admin?.name ?? 'Admin'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {admin?.role ?? 'Loading role...'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm border border-black/15 rounded-md bg-white hover:bg-black/5 transition-colors"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="ml-[240px] min-h-screen p-6 md:p-8">{children}</main>
    </div>
  )
}
