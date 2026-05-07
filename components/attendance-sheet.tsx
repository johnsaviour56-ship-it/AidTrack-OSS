'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { CheckCircle2, Circle } from 'lucide-react'

interface Distribution {
  id: string
  title: string
  date: string
  location: string
}

interface Record {
  id: string
  beneficiary_id: string
  received: boolean
  received_at: string | null
  beneficiaries: { full_name: string; household_id: string } | null
}

interface Props {
  distributions: Distribution[]
  selectedId?: string
  records: Record[]
}

export function AttendanceSheet({ distributions, selectedId, records }: Props) {
  const router = useRouter()
  const [localRecords, setLocalRecords] = useState<Record[]>(records)
  const [loading, setLoading] = useState<string | null>(null)

  function selectDistribution(id: string) {
    router.push(`/attendance?distribution=${id}`)
  }

  async function toggleReceived(record: Record) {
    setLoading(record.id)
    const supabase = createClient()
    const newReceived = !record.received

    const { error } = await supabase
      .from('distribution_records')
      .update({
        received: newReceived,
        received_at: newReceived ? new Date().toISOString() : null,
      })
      .eq('id', record.id)

    setLoading(null)
    if (error) {
      toast.error(error.message)
    } else {
      setLocalRecords((prev) =>
        prev.map((r) =>
          r.id === record.id
            ? { ...r, received: newReceived, received_at: newReceived ? new Date().toISOString() : null }
            : r
        )
      )
    }
  }

  const receivedCount = localRecords.filter((r) => r.received).length

  return (
    <div className="space-y-4">
      {/* Distribution selector */}
      <div className="max-w-sm">
        <Select value={selectedId ?? ''} onValueChange={(v: string | null) => v && selectDistribution(v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a distribution…" />
          </SelectTrigger>
          <SelectContent>
            {distributions.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.title} — {d.date}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Attendance list */}
      {selectedId && (
        <>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{receivedCount} / {localRecords.length} received</span>
            <Badge variant="secondary">{Math.round((receivedCount / (localRecords.length || 1)) * 100)}%</Badge>
          </div>

          {localRecords.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No beneficiaries assigned to this distribution yet.{' '}
              <a href={`/distributions/${selectedId}`} className="underline">Assign beneficiaries</a>
            </p>
          ) : (
            <ul className="divide-y border rounded-md max-w-lg">
              {localRecords.map((record) => (
                <li key={record.id} className="flex items-center justify-between px-4 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    {record.received
                      ? <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                      : <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                    }
                    <div>
                      <p className="font-medium">{record.beneficiaries?.full_name}</p>
                      <p className="text-muted-foreground">{record.beneficiaries?.household_id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {record.received && record.received_at && (
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {new Date(record.received_at).toLocaleTimeString()}
                      </span>
                    )}
                    <Button
                      size="sm"
                      variant={record.received ? 'secondary' : 'outline'}
                      disabled={loading === record.id}
                      onClick={() => toggleReceived(record)}
                    >
                      {record.received ? 'Undo' : 'Mark received'}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
