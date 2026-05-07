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
import type { Beneficiary } from '@/types'

const VULNERABILITY_CATEGORIES = [
  'Food Insecure',
  'Displaced',
  'Elderly',
  'Child-headed Household',
  'Person with Disability',
  'Pregnant/Lactating',
  'Other',
]

interface Props {
  // Pass existing beneficiary to edit; omit for new registration
  beneficiary?: Beneficiary
}

export function BeneficiaryForm({ beneficiary }: Props) {
  const router = useRouter()
  const isEdit = !!beneficiary

  const [form, setForm] = useState({
    full_name: beneficiary?.full_name ?? '',
    household_id: beneficiary?.household_id ?? '',
    gender: beneficiary?.gender ?? ('female' as 'male' | 'female' | 'other'),
    phone_number: beneficiary?.phone_number ?? '',
    location: beneficiary?.location ?? '',
    vulnerability_category: beneficiary?.vulnerability_category ?? VULNERABILITY_CATEGORIES[0],
    household_size: beneficiary?.household_size ?? 1,
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
      ? await supabase
          .from('beneficiaries')
          .update({ ...form, updated_at: new Date().toISOString() })
          .eq('id', beneficiary.id)
      : await supabase.from('beneficiaries').insert(form)

    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success(isEdit ? 'Beneficiary updated.' : 'Beneficiary registered.')
      router.push('/beneficiaries')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div className="space-y-1">
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          value={form.full_name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => set('full_name', e.target.value)}
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="household_id">Household ID</Label>
        <Input
          id="household_id"
          value={form.household_id}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => set('household_id', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="gender">Gender</Label>
          <Select value={form.gender} onValueChange={(v: string | null) => v && set('gender', v)}>
            <SelectTrigger id="gender">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="household_size">Household size</Label>
          <Input
            id="household_size"
            type="number"
            min={1}
            value={form.household_size}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              set('household_size', parseInt(e.target.value))
            }
            required
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="phone_number">Phone number</Label>
        <Input
          id="phone_number"
          value={form.phone_number}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => set('phone_number', e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="location">Location / Community</Label>
        <Input
          id="location"
          value={form.location}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => set('location', e.target.value)}
          required
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="vulnerability_category">Vulnerability category</Label>
        <Select
          value={form.vulnerability_category}
          onValueChange={(v: string | null) => v && set('vulnerability_category', v)}
        >
          <SelectTrigger id="vulnerability_category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VULNERABILITY_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Register beneficiary'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
