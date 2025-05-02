import type { Metadata } from "next"
import DocumentacaoPageClient from "./DocumentacaoPageClient"

export const metadata: Metadata = {
  title: "Documentação - SaaS Soluções",
  description: "Documentação técnica e guias para a área administrativa",
}

export default function DocumentacaoPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <DocumentacaoPageClient />
    </div>
  )
}
