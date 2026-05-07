import { notFound } from 'next/navigation'
import { createClient } from '@/supabase/server'
import { BeneficiaryForm } from '@/components/beneficiary-form'
import { ArchiveBeneficiaryButton } from '@/components/archive-beneficiary-button'
import { Badge } from '@/components/ui/badge'

interface Props {
  params: Promise<{ id: string }>
}

export default async function BeneficiaryDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: beneficiary } = await supabase
    .from('beneficiaries')
    .select('*')
    .eq('id', id)
    .single()

  if (!beneficiary) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{beneficiary.full_name}</h1>
          <p className="text-sm text-muted-foreground">Household: {beneficiary.household_id}</p>
        </div>
        <div className="flex items-center gap-2">
          {beneficiary.is_archived && <Badge variant="secondary">Archived</Badge>}
          <ArchiveBeneficiaryButton id={beneficiary.id} isArchived={beneficiary.is_archived} />
        </div>
      </div>

      <BeneficiaryForm beneficiary={beneficiary} />
    </div>
  )
}
