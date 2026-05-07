import { redirect } from 'next/navigation'
import { createClient } from '@/supabase/server'
import { DistributionForm } from '@/components/distribution-form'

export default async function NewDistributionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">New Distribution</h1>
      <DistributionForm userId={user.id} />
    </div>
  )
}
