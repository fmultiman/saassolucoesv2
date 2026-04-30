export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

type Relationship = {
  foreignKeyName: string
  columns: string[]
  isOneToOne?: boolean
  referencedRelation: string
  referencedColumns: string[]
}

type TableDefinition<Row, Insert = Partial<Row>, Update = Partial<Row>, Relationships extends Relationship[] = []> = {
  Row: Row
  Insert: Insert
  Update: Update
  Relationships: Relationships
}

type UserRow = {
  id: string
  created_at: string | null
  email: string
  status: string | null
  plan: string | null
  plan_id: number | null
  onboarding_completed: boolean | null
  user_type: string | null
  last_sign_in_at: string | null
  name: string | null
  updated_at: string | null
  active_solutions: number | null
  last_active: string | null
}

type ProfileRow = {
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
  profile_complete: boolean | null
  company_name: string | null
  company_size: string | null
  industry: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  postal_code: string | null
  social_links: Json | null
  created_at: string | null
  updated_at: string | null
  email: string | null
  username: string | null
  full_name: string | null
}

type SolutionRow = {
  id: number
  slug: string | null
  name: string
  description: string | null
  category: string | null
  icon: string | null
  color: string | null
  is_active: boolean | null
  is_recommended: boolean | null
  is_premium: boolean | null
  premium_plan: string | null
  activations: number | null
  is_available: boolean | null
  created_at: string | null
  updated_at: string | null
}

type PlanRow = {
  id: number
  name: string
  price: number | null
  description: string | null
  created_at: string | null
  code: string | null
  features: Json | null
  interval: string | null
  billing_cycle: string | null
  is_active: boolean | null
  is_featured: boolean | null
  max_solutions: number | null
  sort_order: number | null
  updated_at: string | null
}

type PlanSolutionRow = {
  id: number
  plan_id: number | null
  solution_id: number | null
  created_at: string | null
  custom_price: number | null
  custom_limits: Json | null
  updated_at?: string | null
}

type SubscriptionRow = {
  id: string
  user_id: string | null
  plan_id: number | null
  status: string | null
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean | null
  canceled_at: string | null
  payment_method: string | null
  payment_id: string | null
  created_at: string | null
  updated_at: string | null
}

type PostRow = {
  id: string
  created_at: string | null
  titulo: string | null
  title?: string | null
  slug: string | null
  conteudo: string | null
  data_publicacao: string | null
  imagem_capa: string | null
  featured_image?: string | null
  publicado: boolean | null
  status?: string | null
  description: string | null
}

type NotificationRow = {
  id: string
  title: string
  message: string
  type: string | null
  category: string | null
  user_target: string | null
  plan_target: string | null
  role_target: string | null
  expires_at: string | null
  created_at: string | null
}

type UserNotificationRow = {
  id: string
  user_id: string | null
  notification_id: string | null
  read_at: string | null
  created_at: string | null
}

type EmailVerificationRow = {
  id: string
  user_id: string | null
  email: string
  token: string | null
  verified: boolean | null
  expires_at: string | null
  created_at: string | null
  updated_at: string | null
}

type MarketplaceItemRow = {
  id: string
  name: string
  description: string
  type: string | null
  categories: string[] | null
  status: string | null
  requires_login: boolean | null
  created_at: string | null
  views: number | null
  clicks: number | null
  activations: number | null
  last_access: string | null
  full_description: string | null
  category: string | null
  related_area: string | null
  min_plan: string | null
  client_action: string | null
  show_institutional: boolean | null
  show_dashboard: boolean | null
  display_status: string | null
  updated_at: string | null
}

type MigrationRow = {
  id: string
  filename: string
  executed_at: string | null
  executed_by: string | null
  status: string
  execution_time: number | null
  error_message: string | null
}

type InternalMigrationRow = {
  id: string
  name: string | null
  executed_at: string | null
}

type UserProfilesViewRow = UserRow &
  Partial<ProfileRow> & {
    role: string | null
    verified: boolean | null
    has_profile: boolean | null
  }

export type Database = {
  public: {
    Tables: {
      users: TableDefinition<UserRow, Partial<UserRow> & Pick<UserRow, "id" | "email">>
      profiles: TableDefinition<ProfileRow, Partial<ProfileRow> & Pick<ProfileRow, "id">>
      solutions: TableDefinition<SolutionRow, Partial<SolutionRow> & Pick<SolutionRow, "name">>
      plans: TableDefinition<PlanRow, Partial<PlanRow> & Pick<PlanRow, "name">>
      plan_solutions: TableDefinition<
        PlanSolutionRow,
        Partial<PlanSolutionRow>,
        Partial<PlanSolutionRow>,
        [
          {
            foreignKeyName: "plan_solutions_plan_id_fkey"
            columns: ["plan_id"]
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plan_solutions_solution_id_fkey"
            columns: ["solution_id"]
            referencedRelation: "solutions"
            referencedColumns: ["id"]
          },
        ]
      >
      subscriptions: TableDefinition<
        SubscriptionRow,
        Partial<SubscriptionRow>,
        Partial<SubscriptionRow>,
        [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      >
      posts: TableDefinition<PostRow>
      notifications: TableDefinition<NotificationRow, Partial<NotificationRow> & Pick<NotificationRow, "title" | "message">>
      user_notifications: TableDefinition<
        UserNotificationRow,
        Partial<UserNotificationRow>,
        Partial<UserNotificationRow>,
        [
          {
            foreignKeyName: "user_notifications_notification_id_fkey"
            columns: ["notification_id"]
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_notifications_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      >
      email_verification: TableDefinition<EmailVerificationRow, Partial<EmailVerificationRow> & Pick<EmailVerificationRow, "email">>
      marketplace_items: TableDefinition<
        MarketplaceItemRow,
        Partial<MarketplaceItemRow> & Pick<MarketplaceItemRow, "id" | "name" | "description">,
        Partial<MarketplaceItemRow>
      >
      migrations: TableDefinition<MigrationRow, Partial<MigrationRow> & Pick<MigrationRow, "filename" | "status">>
      _migrations: TableDefinition<InternalMigrationRow>
    }
    Views: {
      user_profiles_view: {
        Row: UserProfilesViewRow
        Relationships: []
      }
    }
    Functions: {
      execute_sql: {
        Args: { sql_query?: string; sql?: string }
        Returns: unknown
      }
      reload_schema_cache: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      pg_query: {
        Args: { query: string }
        Returns: unknown
      }
      create_storage_policy: {
        Args: {
          bucket_name?: string
          policy_name?: string
          definition?: string
          operation?: string
        }
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Post = Database["public"]["Tables"]["posts"]["Row"]
