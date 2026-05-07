'use client'

import { buttonVariants } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ExportButton() {
  return (
    <a href="/api/export" download className={cn(buttonVariants({ size: 'sm', variant: 'outline' }))}>
      <Download className="h-4 w-4 mr-1" />
      Export CSV
    </a>
  )
}
