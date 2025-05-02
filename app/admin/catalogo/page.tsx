import { AdminSolutionsCatalog } from "@/components/admin/admin-solutions-catalog"

export const metadata = {
  title: "Catálogo de Soluções",
  description: "Gerencie o catálogo de soluções disponíveis na plataforma.",
}

export default function CatalogoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Catálogo de Soluções</h2>
        <p className="text-muted-foreground">
          Gerencie todas as soluções disponíveis na plataforma. As soluções ativas poderão ser associadas a planos.
        </p>
      </div>
      <AdminSolutionsCatalog />
    </div>
  )
}
