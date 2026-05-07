'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import type { Distribution } from '@/types'

const DISTRIBUTION_TYPES = ['Food', 'NFI', 'Cash', 'Seeds', 'Hygiene Kit', 'Other']

interface Props {
  distribution?: Distribution
  userId: string
}

export function DistributionForm({ distribution, userId }: Props) {
  const router = useRouter()
  const isEdit = !!distribution

  const [form, setForm] = useState({
    title: distribution?.title ?? '',
    distribution_type: distribution?.distribution_type ?? DISTRIBUTION_TYPES[0],
    location: distribution?.location ?? '',
    date: distribution?.date ?? new Date().toISOString().split('T')[0],
    quantity: distribution?.quantity ?? 1,
    unit: distribution?.unit ?? 'kg',
    status: distribution?.status ?? ('planned' as 'planned' | 'active' | 'completed'),
  })
  const [loading, setLoading] = useState(false)

  function set(field: string, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const supabase = createClient()

    const { error } = isEdit
      ? await supabase.from('distributions').update(form).eq('id', distribution.id)
      : await supabase.from('distributions').insert({ ...form, created_by: userId })

    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success(isEdit ? 'Distribution updated.' : 'Distribution created.')
      router.push('/distributions')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => set('title', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="distribution_type">Type</Label>
          <Select
            value={form.distribution_type}
            onValueChange={(v: string | null) => v && set('distribution_type', v)}
          >
            <SelectTrigger id="distribution_type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DISTRIBUTION_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="status">Status</Label>
          <Select value={form.status} onValueChange={(v: string | null) => v && set('status', v)}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={form.location}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => set('location', e.target.value)}
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={form.date}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => set('date', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min={1}
            value={form.quantity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              set('quantity', parseFloat(e.target.value))
            }
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            value={form.unit}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => set('unit', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create distribution'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
