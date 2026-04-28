import type { Metadata } from "next"
import { AuthRedirectDiagnostics } from "@/components/admin/auth-redirect-diagnostics"

export const metadata: Metadata = {
  title: "Configuracoes | Admin",
  description: "Configuracoes do sistema",
}

export default function ConfiguracoesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Configuracoes do Sistema</h1>

      <div className="grid gap-8">
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-xl font-semibold mb-4">Diagnostico de Autenticacao</h2>
          <AuthRedirectDiagnostics />
        </div>
      </div>
    </div>
  )
}
