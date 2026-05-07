import { createClient } from '@/supabase/server'
import { AttendanceSheet } from '@/components/attendance-sheet'

export default async function AttendancePage({
  searchParams,
}: {
  searchParams: Promise<{ distribution?: string }>
}) {
  const { distribution: distributionId } = await searchParams
  const supabase = await createClient()

  // Active and planned distributions for the selector
  const { data: distributions } = await supabase
    .from('distributions')
    .select('id, title, date, location')
    .in('status', ['planned', 'active'])
    .order('date', { ascending: false })

  // If a distribution is selected, load its records
  let records: Array<{
    id: string
    beneficiary_id: string
    received: boolean
    received_at: string | null
    beneficiaries: { full_name: string; household_id: string } | null
  }> = []

  if (distributionId) {
    const { data } = await supabase
      .from('distribution_records')
      .select('id, beneficiary_id, received, received_at, beneficiaries(full_name, household_id)')
      .eq('distribution_id', distributionId)
      .order('beneficiaries(full_name)')

    records = (data as unknown as typeof records) ?? []
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Attendance / Verification</h1>
      <AttendanceSheet
        distributions={distributions ?? []}
        selectedId={distributionId}
        records={records}
      />
    </div>
  )
}
