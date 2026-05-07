import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/supabase/server'
import { DistributionForm } from '@/components/distribution-form'
import { AssignBeneficiariesPanel } from '@/components/assign-beneficiaries-panel'
import { Badge } from '@/components/ui/badge'

interface Props {
  params: Promise<{ id: string }>
}

const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  planned: 'outline',
  active: 'default',
  completed: 'secondary',
}

export default async function DistributionDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: distribution } = await supabase
    .from('distributions')
    .select('*')
    .eq('id', id)
    .single()

  if (!distribution) notFound()

  // Beneficiaries already assigned to this distribution
  const { data: records } = await supabase
    .from('distribution_records')
    .select('beneficiary_id')
    .eq('distribution_id', id)

  const assignedIds = new Set(records?.map((r) => r.beneficiary_id) ?? [])

  // All active beneficiaries
  const { data: allBeneficiaries } = await supabase
    .from('beneficiaries')
    .select('id, full_name, household_id, location')
    .eq('is_archived', false)
    .order('full_name')

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-semibold">{distribution.title}</h1>
        <Badge variant={statusVariant[distribution.status] ?? 'outline'} className="capitalize">
          {distribution.status}
        </Badge>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Details</h2>
        <DistributionForm distribution={distribution} userId={user.id} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Assigned Beneficiaries</h2>
        <AssignBeneficiariesPanel
          distributionId={id}
          allBeneficiaries={allBeneficiaries ?? []}
          assignedIds={assignedIds}
        />
      </section>
    </div>
  )
}
