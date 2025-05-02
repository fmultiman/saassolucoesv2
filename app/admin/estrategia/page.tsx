import type { Metadata } from "next"
import ImplementationSequence from "@/components/implementation-sequence"

export const metadata: Metadata = {
  title: "Estratégia de Implementação | SaaS Soluções",
  description: "Estratégia para implementação segura de melhorias no SaaS Soluções",
}

export default function ImplementationStrategyPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Estratégia de Implementação Segura</h1>

      <div className="mb-8">
        <p className="text-muted-foreground mb-4">
          Esta estratégia foi desenvolvida para implementar melhorias no SaaS Soluções de forma segura, minimizando
          riscos e evitando quebrar funcionalidades existentes.
        </p>
      </div>

      <ImplementationSequence />
    </div>
  )
}
