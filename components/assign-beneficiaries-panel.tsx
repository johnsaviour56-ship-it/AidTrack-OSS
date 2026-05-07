'use client'

import { useState } from 'react'
import { createClient } from '@/supabase/client'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Beneficiary {
  id: string
  full_name: string
  household_id: string
  location: string
}

interface Props {
  distributionId: string
  allBeneficiaries: Beneficiary[]
  assignedIds: Set<string>
}

export function AssignBeneficiariesPanel({ distributionId, allBeneficiaries, assignedIds }: Props) {
  const [assigned, setAssigned] = useState<Set<string>>(new Set(assignedIds))
  const [loading, setLoading] = useState<string | null>(null)

  async function toggle(beneficiaryId: string) {
    setLoading(beneficiaryId)
    const supabase = createClient()
    const isAssigned = assigned.has(beneficiaryId)

    if (isAssigned) {
      const { error } = await supabase
        .from('distribution_records')
        .delete()
        .eq('distribution_id', distributionId)
        .eq('beneficiary_id', beneficiaryId)

      if (error) { toast.error(error.message) }
      else { setAssigned((prev) => { const s = new Set(prev); s.delete(beneficiaryId); return s }) }
    } else {
      const { error } = await supabase
        .from('distribution_records')
        .insert({ distribution_id: distributionId, beneficiary_id: beneficiaryId, received: false })

      if (error) { toast.error(error.message) }
      else { setAssigned((prev) => new Set([...prev, beneficiaryId])) }
    }

    setLoading(null)
  }

  if (!allBeneficiaries.length) {
    return <p className="text-sm text-muted-foreground">No beneficiaries registered yet.</p>
  }

  return (
    <ul className="divide-y border rounded-md max-w-lg">
      {allBeneficiaries.map((b) => {
        const isAssigned = assigned.has(b.id)
        return (
          <li key={b.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <div>
              <p className="font-medium">{b.full_name}</p>
              <p className="text-muted-foreground">{b.household_id} · {b.location}</p>
            </div>
            <Button
              size="sm"
              variant={isAssigned ? 'secondary' : 'outline'}
              disabled={loading === b.id}
              onClick={() => toggle(b.id)}
            >
              {isAssigned ? 'Remove' : 'Assign'}
            </Button>
          </li>
        )
      })}
    </ul>
  )
}
