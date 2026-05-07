import Link from 'next/link'
import { createClient } from '@/supabase/server'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

export default async function BeneficiariesPage() {
  const supabase = await createClient()
  const { data: beneficiaries } = await supabase
    .from('beneficiaries')
    .select('*')
    .eq('is_archived', false)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Beneficiaries</h1>
        <Link href="/beneficiaries/new" className={cn(buttonVariants({ size: 'sm' }))}>
          <Plus className="h-4 w-4 mr-1" />
          Register
        </Link>
      </div>

      {!beneficiaries?.length ? (
        <p className="text-sm text-muted-foreground">No beneficiaries registered yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Household ID</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Vulnerability</TableHead>
              <TableHead>HH Size</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {beneficiaries.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">{b.full_name}</TableCell>
                <TableCell>{b.household_id}</TableCell>
                <TableCell>{b.location}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{b.vulnerability_category}</Badge>
                </TableCell>
                <TableCell>{b.household_size}</TableCell>
                <TableCell>
                  <Link
                    href={`/beneficiaries/${b.id}`}
                    className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                  >
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
