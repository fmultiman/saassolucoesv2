import type { Metadata } from "next"
import { AuthFixButton } from "@/components/admin/auth-fix-button"
import { UserSyncFixButton } from "@/components/admin/user-sync-fix-button"
import { AuthResetButton } from "@/components/admin/auth-reset-button"

export const metadata: Metadata = {
  title: "Configurações | Admin",
  description: "Configurações do sistema",
}

export default function ConfiguracoesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Configurações do Sistema</h1>

      <div className="grid gap-8">
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Manutenção do Sistema</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <AuthFixButton />
            <UserSyncFixButton />
            <AuthResetButton />
          </div>
        </div>
      </div>
    </div>
  )
}
