import { AdminUsersList } from "@/components/admin/admin-users-list"
import { CreateUserModal } from "@/components/admin/create-user-modal"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export const metadata = {
  title: "Gerenciar Usuarios | Admin Dashboard",
  description: "Gerencie todos os usuarios da plataforma, seus perfis e permissoes.",
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminUsersPage() {
  const supabase = createServiceRoleClient()

  const { data: users, error } = await supabase
    .from("users")
    .select("id, name, email, status, plan, user_type, created_at, last_sign_in_at, active_solutions")
    .order("created_at", { ascending: false })

  if (error) {
    return (
      <div className="container mx-auto max-w-full overflow-x-hidden px-4 py-10">
        <h1 className="mb-4 text-2xl font-bold">Gerenciar Usuarios</h1>
        <div className="mb-6 flex items-center justify-between">
          <p>Erro ao carregar usuarios. Por favor, tente novamente mais tarde.</p>
          <CreateUserModal />
        </div>
      </div>
    )
  }

  const normalizedUsers = (users ?? []).map((user) => ({
    ...user,
    name: user.name ?? "Sem nome",
    status: user.status ?? "active",
    plan: user.plan ?? "gratuito",
    user_type: user.user_type ?? "client",
    created_at: user.created_at ?? new Date().toISOString(),
    last_sign_in_at: user.last_sign_in_at ?? undefined,
    active_solutions: user.active_solutions ?? 0,
  }))

  return (
    <div className="w-full overflow-x-hidden">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Usuarios</h1>
          <p className="text-muted-foreground">Gerencie todos os usuarios da plataforma, seus perfis e permissoes.</p>
        </div>
        <CreateUserModal />
      </div>
      <div className="w-full overflow-hidden">
        <AdminUsersList initialUsers={normalizedUsers} />
      </div>
    </div>
  )
}
