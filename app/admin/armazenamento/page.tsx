import { StorageSetup } from "@/components/storage-setup"

export const metadata = {
  title: "Configuração de Armazenamento",
  description: "Configure o armazenamento para uploads de arquivos",
}

export default function StorageConfigPage() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Configuração de Armazenamento</h1>
      <p className="text-muted-foreground">
        Configure o armazenamento para permitir uploads de arquivos como avatares de usuários.
      </p>

      <StorageSetup />
    </div>
  )
}
