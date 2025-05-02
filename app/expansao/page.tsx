import { SiteHeader } from "@/components/institucional/site-header"
import { SiteFooter } from "@/components/institucional/site-footer"
import { MarketplaceContent } from "@/components/marketplace/marketplace-content"

export default function ExpansaoPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader currentPath="/expansao" />
      <main className="container py-8 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Recursos Adicionais</h1>
          <p className="text-xl text-muted-foreground">
            Expanda as capacidades da sua plataforma com nossas soluções e integrações
          </p>
        </div>
        <MarketplaceContent isPublic={true} />
      </main>
      <SiteFooter />
    </div>
  )
}
