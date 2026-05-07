import { createClient } from '@/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Package, Home, ClipboardCheck } from 'lucide-react'

async function getStats() {
  const supabase = await createClient()

  const [{ count: totalBeneficiaries }, { count: totalHouseholds }, { count: activeDistributions }, { count: completedRecords }] =
    await Promise.all([
      supabase.from('beneficiaries').select('*', { count: 'exact', head: true }).eq('is_archived', false),
      supabase.from('beneficiaries').select('household_id', { count: 'exact', head: true }).eq('is_archived', false),
      supabase.from('distributions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('distribution_records').select('*', { count: 'exact', head: true }).eq('received', true),
    ])

  return { totalBeneficiaries, totalHouseholds, activeDistributions, completedRecords }
}

async function getRecentDistributions() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('distributions')
    .select('id, title, location, date, status')
    .order('created_at', { ascending: false })
    .limit(5)
  return data ?? []
}

export default async function DashboardPage() {
  const [stats, recentDistributions] = await Promise.all([getStats(), getRecentDistributions()])

  const statCards = [
    { label: 'Total Beneficiaries', value: stats.totalBeneficiaries ?? 0, icon: Users },
    { label: 'Households Registered', value: stats.totalHouseholds ?? 0, icon: Home },
    { label: 'Active Distributions', value: stats.activeDistributions ?? 0, icon: Package },
    { label: 'Aid Received (records)', value: stats.completedRecords ?? 0, icon: ClipboardCheck },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent distributions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Distributions</CardTitle>
        </CardHeader>
        <CardContent>
          {recentDistributions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No distributions yet.</p>
          ) : (
            <ul className="divide-y">
              {recentDistributions.map((d) => (
                <li key={d.id} className="py-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">{d.title}</p>
                    <p className="text-muted-foreground">{d.location} · {d.date}</p>
                  </div>
                  <span className="capitalize text-xs bg-muted px-2 py-0.5 rounded-full">
                    {d.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
