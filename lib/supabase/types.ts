export type Database = {
  public: {
    Tables: {
      solutions: {
        Row: {
          id: number
          slug: string
          name: string
          description: string | null
          is_active: boolean
          created_at: string | null
          updated_at: string | null
          category: string | null
          icon: string | null
          color: string | null
          is_premium: boolean | null
          premium_plan: string | null
          is_recommended: boolean | null
          activations: number | null
          is_available: boolean | null
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          is_active?: boolean
          created_at?: string | null
          updated_at?: string | null
          category?: string | null
          icon?: string | null
          color?: string | null
          is_premium?: boolean | null
          premium_plan?: string | null
          is_recommended?: boolean | null
          activations?: number | null
          is_available?: boolean | null
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          is_active?: boolean
          created_at?: string | null
          updated_at?: string | null
          category?: string | null
          icon?: string | null
          color?: string | null
          is_premium?: boolean | null
          premium_plan?: string | null
          is_recommended?: boolean | null
          activations?: number | null
          is_available?: boolean | null
        }
      }
      plans: {
        Row: {
          id: number
          name: string
          price: number | null
          description: string | null
          created_at: string | null
          billing_cycle: string | null
          features: string[] | null
        }
        Insert: {
          id?: number
          name: string
          price?: number | null
          description?: string | null
          created_at?: string | null
          billing_cycle?: string | null
          features?: string[] | null
        }
        Update: {
          id?: number
          name?: string
          price?: number | null
          description?: string | null
          created_at?: string | null
          billing_cycle?: string | null
          features?: string[] | null
        }
      }
      plan_solutions: {
        Row: {
          id: number
          plan_id: number | null
          solution_id: number | null
          created_at: string | null
        }
        Insert: {
          id?: number
          plan_id?: number | null
          solution_id?: number | null
          created_at?: string | null
        }
        Update: {
          id?: number
          plan_id?: number | null
          solution_id?: number | null
          created_at?: string | null
        }
      }
      posts: {
        Row: {
          id: string
          created_at: string | null
          titulo: string | null
          slug: string | null
          conteudo: string | null
          data_publicacao: string | null
          imagem_capa: string | null
          publicado: boolean | null
          description: string | null
        }
        Insert: {
          id?: string
          created_at?: string | null
          titulo?: string | null
          slug?: string | null
          conteudo?: string | null
          data_publicacao?: string | null
          imagem_capa?: string | null
          publicado?: boolean | null
          description?: string | null
        }
        Update: {
          id?: string
          created_at?: string | null
          titulo?: string | null
          slug?: string | null
          conteudo?: string | null
          data_publicacao?: string | null
          imagem_capa?: string | null
          publicado?: boolean | null
          description?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          name: string
          avatar_url: string | null
          bio: string | null
          phone: string | null
          job_title: string | null
          company_name: string | null
          company_size: string | null
          industry: string | null
          website: string | null
          location: string | null
          created_at: string | null
          updated_at: string | null
          // adicione aqui os outros campos reais da sua tabela
        }
      
        Insert: {
          id: string // obrigatório, geralmente = user.id
          name: string
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          job_title?: string | null
          company_name?: string | null
          company_size?: string | null
          industry?: string | null
          website?: string | null
          location?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      
        Update: {
          name?: string
          avatar_url?: string | null
          bio?: string | null
          phone?: string | null
          job_title?: string | null
          company_name?: string | null
          company_size?: string | null
          industry?: string | null
          website?: string | null
          location?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
