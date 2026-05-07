// User roles in the system
export type UserRole = 'admin' | 'field_officer' | 'volunteer'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  created_at: string
}

// Beneficiary registered in the system
export interface Beneficiary {
  id: string
  full_name: string
  household_id: string
  gender: 'male' | 'female' | 'other'
  phone_number: string | null
  location: string
  vulnerability_category: string
  household_size: number
  is_archived: boolean
  created_at: string
  updated_at: string
}

// A distribution event (e.g. food distribution on a specific date)
export interface Distribution {
  id: string
  title: string
  distribution_type: string
  location: string
  date: string
  quantity: number
  unit: string
  status: 'planned' | 'active' | 'completed'
  created_by: string
  created_at: string
}

// Records whether a beneficiary received aid in a distribution
export interface DistributionRecord {
  id: string
  distribution_id: string
  beneficiary_id: string
  received: boolean
  received_at: string | null
  notes: string | null
}
