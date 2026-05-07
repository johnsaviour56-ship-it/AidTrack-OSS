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

const statusVariant: Record<string, 'default' | 'secondary' | 'outline'> = {
  planned: 'outline',
  active: 'default',
  completed: 'secondary',
}

export default async function DistributionsPage() {
  const supabase = await createClient()
  const { data: distributions } = await supabase
    .from('distributions')
    .select('*')
    .order('date', { ascending: false })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Distributions</h1>
        <Link href="/distributions/new" className={cn(buttonVariants({ size: 'sm' }))}>
          <Plus className="h-4 w-4 mr-1" />
          New distribution
        </Link>
      </div>

      {!distributions?.length ? (
        <p className="text-sm text-muted-foreground">No distributions created yet.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {distributions.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.title}</TableCell>
                <TableCell>{d.distribution_type}</TableCell>
                <TableCell>{d.location}</TableCell>
                <TableCell>{d.date}</TableCell>
                <TableCell>{d.quantity} {d.unit}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[d.status] ?? 'outline'} className="capitalize">
                    {d.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/distributions/${d.id}`}
                    className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                  >
                    Manage
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
