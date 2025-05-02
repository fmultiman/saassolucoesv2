import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminTemplatesList } from "@/components/admin/admin-templates-list"

export const metadata = {
  title: "Modelos e Templates | Admin Dashboard",
  description: "Gerencie os modelos e templates disponíveis na plataforma.",
}

export default function AdminTemplatesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Modelos e Templates</h1>
        <p className="text-muted-foreground">Gerencie todos os modelos e templates disponíveis na plataforma.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Biblioteca de Modelos</CardTitle>
          <CardDescription>Total de 24 modelos disponíveis em 4 categorias diferentes</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <AdminTemplatesList />
        </CardContent>
      </Card>
    </div>
  )
}
