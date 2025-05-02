export interface Post {
  id: string
  title: string
  slug: string
  content: string
  description?: string
  featured_image?: string
  author_id: string
  author_name?: string
  status: "draft" | "published" | "archived"
  created_at: string
  updated_at: string
  published_at?: string
  categories?: string[]
  tags?: string[]
  read_time?: number
}

export interface PostSummary {
  id: string
  title: string
  slug: string
  description?: string
  featured_image?: string
  author_name?: string
  published_at?: string
  read_time?: number
}
