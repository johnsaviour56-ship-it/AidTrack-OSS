'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Package, ClipboardCheck, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/beneficiaries', label: 'Beneficiaries', icon: Users },
  { href: '/distributions', label: 'Distributions', icon: Package },
  { href: '/attendance', label: 'Attendance', icon: ClipboardCheck },
  { href: '/reports', label: 'Reports', icon: BarChart2 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 border-r bg-background flex flex-col">
      <div className="h-14 flex items-center px-4 border-b font-semibold text-lg">
        AidTrack
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname.startsWith(href)
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
