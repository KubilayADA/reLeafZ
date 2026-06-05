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
  ChevronRight,
} from 'lucide-react'
import { adminLogout, adminMe } from '@/lib/adminApi'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

const ADMIN_BASE = '/admin'

const navItems = [
  { label: 'Dashboard', href: `${ADMIN_BASE}/dashboard`, icon: LayoutDashboard },
  { label: 'Patients', href: `${ADMIN_BASE}/patients`, icon: Users },
  { label: 'Doctors', href: `${ADMIN_BASE}/doctors`, icon: Stethoscope },
  { label: 'Pharmacies', href: `${ADMIN_BASE}/pharmacies`, icon: Building2 },
  { label: 'Prescriptions', href: `${ADMIN_BASE}/prescriptions`, icon: FileText },
  { label: 'Team', href: `${ADMIN_BASE}/team`, icon: UserCog },
  { label: 'Analytics', href: `${ADMIN_BASE}/analytics`, icon: BarChart3 },
]

type AdminUser = {
  id: number
  email: string
  name: string
  role: string
  isActive: boolean
}

function navItemIsActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function roleChipClass(role: string) {
  switch (role.toUpperCase()) {
    case 'ADMIN':
      return 'bg-emerald-500/20 text-emerald-400'
    case 'OPERATOR':
      return 'bg-cyan-500/20 text-cyan-400'
    default:
      return 'bg-gray-500/20 text-gray-400'
  }
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
        if (mounted) setAdmin(null)
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
      router.push(`${ADMIN_BASE}/login`)
    }
  }

  const activeNav = navItems.find((item) => navItemIsActive(pathname, item.href))
  const pageTitle = activeNav?.label ?? 'Admin'

  if (pathname.startsWith(`${ADMIN_BASE}/login`)) {
    return <div className={`${dmSans.className} min-h-screen`}>{children}</div>
  }

  return (
    <div className={`${dmSans.className} min-h-screen bg-[#fbfdfb] text-gray-900`}>
      {/* ── Sidebar ── */}
      <aside className="fixed left-0 top-0 h-screen w-[260px] bg-[#111] flex flex-col z-30">
        <div className="px-6 py-6 border-b border-white/[0.07]">
          <p className="text-xl font-bold tracking-tight text-white">
            releaf<span className="text-emerald-400">Z</span>
          </p>
          <p className="mt-1 text-[10px] tracking-widest uppercase text-gray-500 font-semibold">
            Admin Control Panel
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = navItemIsActive(pathname, item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-all duration-150 border-l-2 ${
                  isActive
                    ? 'border-l-emerald-500 bg-emerald-500/[0.12] text-emerald-400 font-medium'
                    : 'border-l-transparent text-gray-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Icon
                  size={16}
                  className={isActive ? 'text-emerald-400' : 'text-gray-500 group-hover:text-white'}
                />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/[0.07]">
          <div className="mb-3 px-2 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm flex-shrink-0">
              {(admin?.name ?? 'A').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{admin?.name ?? 'Admin'}</p>
              {admin?.role && (
                <span
                  className={`mt-0.5 inline-block text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wide ${roleChipClass(admin.role)}`}
                >
                  {admin.role}
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-400 border border-white/[0.1] rounded-xl hover:bg-white/[0.06] hover:text-white transition-colors"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Topbar ── */}
      <div className="fixed top-0 right-0 left-[260px] h-[58px] bg-[#fbfdfb]/95 backdrop-blur-sm border-b border-black/[0.06] z-20 flex items-center px-8">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Admin</span>
          <ChevronRight size={13} className="text-gray-300" />
          <span className="font-semibold text-gray-700">{pageTitle}</span>
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="ml-[260px] min-h-screen pt-[58px]">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
