'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Props {
  id: string
  isArchived: boolean
}

export function ArchiveBeneficiaryButton({ id, isArchived }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('beneficiaries')
      .update({ is_archived: !isArchived, updated_at: new Date().toISOString() })
      .eq('id', id)

    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success(isArchived ? 'Beneficiary restored.' : 'Beneficiary archived.')
      router.refresh()
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={toggle} disabled={loading}>
      {isArchived ? 'Restore' : 'Archive'}
    </Button>
  )
}
