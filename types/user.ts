export interface User {
  id: string
  email: string
  user_type: string
  plan: string
  status: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  name: string | null
  bio: string | null
  phone: string | null
  job_title: string | null
  company: string | null
  website: string | null
  location: string | null
  avatar_url: string | null
  preferences: Json | null
  company_name: string | null
  company_size: string | null
  industry: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  postal_code: string | null
  social_links: Json | null
  profile_complete: boolean | null
  created_at: string | null
  updated_at: string | null
}

export type ProfileUpdateData = Partial<Omit<Profile, "id" | "created_at" | "updated_at">>
import type { Json } from "@/lib/supabase/types"
