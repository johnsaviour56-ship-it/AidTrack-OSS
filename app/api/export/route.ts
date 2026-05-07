import { NextResponse } from 'next/server'
import { createClient } from '@/supabase/server'

// Returns a CSV of all distribution records with beneficiary and distribution info
export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('distribution_records')
    .select(`
      received,
      received_at,
      notes,
      beneficiaries(full_name, household_id, location, vulnerability_category),
      distributions(title, distribution_type, date, location, quantity, unit, status)
    `)
    .order('received_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const headers = [
    'Beneficiary Name',
    'Household ID',
    'Beneficiary Location',
    'Vulnerability Category',
    'Distribution Title',
    'Distribution Type',
    'Distribution Date',
    'Distribution Location',
    'Quantity',
    'Unit',
    'Status',
    'Received',
    'Received At',
    'Notes',
  ]

  function escape(val: unknown): string {
    const str = val == null ? '' : String(val)
    // Wrap in quotes if contains comma, quote, or newline
    return str.includes(',') || str.includes('"') || str.includes('\n')
      ? `"${str.replace(/"/g, '""')}"`
      : str
  }

  const rows = (data ?? []).map((r) => {
    const b = r.beneficiaries as unknown as Record<string, unknown> | null
    const d = r.distributions as unknown as Record<string, unknown> | null
    return [
      b?.full_name, b?.household_id, b?.location, b?.vulnerability_category,
      d?.title, d?.distribution_type, d?.date, d?.location, d?.quantity, d?.unit, d?.status,
      r.received ? 'Yes' : 'No',
      r.received_at ?? '',
      r.notes ?? '',
    ].map(escape).join(',')
  })

  const csv = [headers.join(','), ...rows].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="aidtrack-report-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
