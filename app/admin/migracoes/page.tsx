import type { Metadata } from "next"
import { MigrationSetup } from "@/components/admin/migration-setup"
import { AdminMigrationsManager } from "@/components/admin/admin-migrations-manager"

export const metadata: Metadata = {
  title: "Gerenciamento de Migrações | Admin",
  description: "Gerencie migrações de banco de dados",
}

export default function MigracoesPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Migrações</h1>
        <p className="text-muted-foreground mt-2">Gerencie e execute migrações de banco de dados</p>
      </div>

      <div className="border rounded-lg p-4 bg-card">
        <MigrationSetup />
      </div>

      <div className="border rounded-lg p-4 bg-card">
        <AdminMigrationsManager />
      </div>
    </div>
  )
}
