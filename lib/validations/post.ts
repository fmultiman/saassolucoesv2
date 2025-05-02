import { z } from "zod"

export const postSchema = z.object({
  title: z.string().min(5, "Título deve ter pelo menos 5 caracteres").max(100),
  slug: z
    .string()
    .min(5, "Slug deve ter pelo menos 5 caracteres")
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
  content: z.string().min(10, "Conteúdo deve ter pelo menos 10 caracteres"),
  description: z.string().max(160).optional(),
  featured_image: z.string().url("URL da imagem inválida").optional(),
  author_id: z.string().uuid("ID do autor inválido"),
  status: z.enum(["draft", "published", "archived"]),
  published_at: z.string().datetime().optional(),
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
})

export const createPostSchema = postSchema
export const updatePostSchema = postSchema.partial()

export type CreatePostInput = z.infer<typeof createPostSchema>
export type UpdatePostInput = z.infer<typeof updatePostSchema>
