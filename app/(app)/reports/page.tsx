import { createClient } from '@/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ExportButton } from '@/components/export-button'

export default async function ReportsPage() {
  const supabase = await createClient()

  const [
    { count: totalBeneficiaries },
    { count: totalDistributions },
    { count: totalReceived },
    { data: byType },
  ] = await Promise.all([
    supabase.from('beneficiaries').select('*', { count: 'exact', head: true }).eq('is_archived', false),
    supabase.from('distributions').select('*', { count: 'exact', head: true }),
    supabase.from('distribution_records').select('*', { count: 'exact', head: true }).eq('received', true),
    supabase.from('distributions').select('distribution_type'),
  ])

  // Count distributions by type
  const typeCounts: Record<string, number> = {}
  byType?.forEach(({ distribution_type }) => {
    typeCounts[distribution_type] = (typeCounts[distribution_type] ?? 0) + 1
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reports</h1>
        <ExportButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Beneficiaries</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalBeneficiaries ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Distributions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalDistributions ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aid Received (records)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalReceived ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {Object.keys(typeCounts).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distributions by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {Object.entries(typeCounts).map(([type, count]) => (
                <li key={type} className="flex items-center justify-between text-sm">
                  <span>{type}</span>
                  <span className="font-medium">{count}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
