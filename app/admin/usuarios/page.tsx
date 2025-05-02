import { CreateUserModal } from "@/components/admin/create-user-modal"
import { AdminUsersList } from "@/components/admin/admin-users-list"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

export const metadata = {
  title: "Gerenciar Usuários | Admin Dashboard",
  description: "Gerencie todos os usuários da plataforma, seus perfis e permissões.",
}

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function AdminUsersPage() {
  // Inicializar o cliente Supabase com a chave de serviço
  const supabaseAdmin = createServiceRoleClient()

  // Buscar usuários do Supabase
  const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()

  if (authError) {
    console.error("Erro ao buscar usuários:", authError)
    return (
      <div className="container mx-auto py-10 px-4 overflow-x-hidden max-w-full">
        <h1 className="text-2xl font-bold mb-4">Gerenciar Usuários</h1>
        <div className="flex justify-between items-center mb-6">
          <p>Erro ao carregar usuários. Por favor, tente novamente mais tarde.</p>
          <CreateUserModal />
        </div>
      </div>
    )
  }

  // Buscar dados adicionais da tabela users
  const { data: publicUsers, error: publicError } = await supabaseAdmin.from("users").select("*")

  if (publicError) {
    console.error("Erro ao buscar dados adicionais dos usuários:", publicError)
  }

  // Combinar dados de auth.users e public.users
  const users =
    authUsers?.users.map((authUser) => {
      const publicUser = publicUsers?.find((pu) => pu.id === authUser.id)
      return {
        id: authUser.id,
        name: authUser.user_metadata?.name || publicUser?.name || "Sem nome",
        email: authUser.email,
        status: publicUser?.status || "active",
        plan: publicUser?.plan || "free",
        user_type: publicUser?.user_type || authUser.user_metadata?.tipo || "cliente",
        created_at: authUser.created_at,
        last_sign_in_at: authUser.last_sign_in_at,
        active_solutions: publicUser?.active_solutions || 0,
      }
    }) || []

  return (
    <div className="w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Usuários</h1>
          <p className="text-muted-foreground">Gerencie todos os usuários da plataforma, seus perfis e permissões.</p>
        </div>
        <CreateUserModal />
      </div>
      <div className="w-full overflow-hidden">
        <AdminUsersList initialUsers={users} />
      </div>
    </div>
  )
}
