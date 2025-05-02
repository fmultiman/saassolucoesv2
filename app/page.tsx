import { SiteHeader } from "@/components/institucional/site-header"
import { SiteFooter } from "@/components/institucional/site-footer"
import { HeroSection } from "@/components/institucional/hero-section"
import { SolucoesSection } from "@/components/institucional/solucoes-section"
import { ComoFuncionaSection } from "@/components/institucional/como-funciona-section"
import { PlanosSection } from "@/components/institucional/planos-section"
import { ParaQuemSection } from "@/components/institucional/para-quem-section"
import { SobreSection } from "@/components/institucional/sobre-section"
import { FaqSection } from "@/components/institucional/faq-section"
import { ContatoSection } from "@/components/institucional/contato-section"
import { BlogSection } from "@/components/institucional/blog-section"

export const dynamic = "force-static"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader currentPath="/" />
      <main>
        <HeroSection />
        <SolucoesSection />
        <ComoFuncionaSection />
        <PlanosSection />
        <ParaQuemSection />
        <SobreSection />
        <BlogSection />
        <FaqSection />
        <ContatoSection />
      </main>
      <SiteFooter />
    </div>
  )
}
