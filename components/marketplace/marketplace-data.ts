export interface MarketplaceProduct {
  id: string
  name: string
  description: string
  categories: string[]
  status: "included" | "premium" | "external" | "coming-soon" | "available"
  requiresLogin: boolean
  image?: string
}

export const marketplaceProducts: MarketplaceProduct[] = [
  {
    id: "evolution-api",
    name: "Instância Evolution API",
    description: "Conecte seu número de WhatsApp via API profissional.",
    categories: ["integration", "external"],
    status: "external",
    requiresLogin: false,
  },
  {
    id: "whaticket",
    name: "Whaticket (Sistema de Suporte Multiatendimento)",
    description: "Atenda WhatsApp, Instagram e Facebook em um só lugar.",
    categories: ["integration", "external"],
    status: "external",
    requiresLogin: false,
  },
  {
    id: "agenda-pro",
    name: "Agenda Pro (Sistema de Agendamento)",
    description: "Plataforma completa para gerenciamento de horários.",
    categories: ["integration", "external"],
    status: "external",
    requiresLogin: false,
  },
  {
    id: "template-pascoa",
    name: "Template Premium - Fluxo de Páscoa com IA",
    description: "Campanha de Páscoa automatizada com IA para fidelizar clientes.",
    categories: ["template", "premium"],
    status: "premium",
    requiresLogin: true,
  },
  {
    id: "servico-fluxo",
    name: "Serviço: Criamos o fluxo ideal pra você",
    description: "Nos diga sua necessidade e entregamos sua automação pronta.",
    categories: ["service"],
    status: "external",
    requiresLogin: false,
  },
  {
    id: "upgrade-plano",
    name: "Upgrade para Plano Avançado",
    description: "Desbloqueie soluções exclusivas, mais execuções e IA avançada.",
    categories: ["capacity", "premium"],
    status: "premium",
    requiresLogin: true,
  },
  {
    id: "capacidade-extra",
    name: "Capacidade Extra – Execuções Ilimitadas por 30 dias",
    description: "Ideal para períodos de pico ou campanhas intensas.",
    categories: ["capacity"],
    status: "premium",
    requiresLogin: true,
  },
  {
    id: "typebot-pro",
    name: "Integração com Typebot Pro",
    description: "Use seus bots do Typebot direto na nossa plataforma.",
    categories: ["integration", "external"],
    status: "external",
    requiresLogin: false,
  },
  {
    id: "funil-vendas",
    name: "Modelo de Funil de Vendas com IA",
    description: "Geração de leads com conteúdo automatizado.",
    categories: ["template", "premium", "recommended"],
    status: "included",
    requiresLogin: true,
  },
  {
    id: "consultoria-express",
    name: "Serviço: Consultoria Express para montar seu fluxo ideal",
    description: "Agende uma reunião e saia com seu sistema funcionando.",
    categories: ["service"],
    status: "external",
    requiresLogin: false,
  },
  {
    id: "template-black-friday",
    name: "Template Premium - Campanha Black Friday",
    description: "Automação completa para Black Friday com gatilhos de urgência.",
    categories: ["template", "premium", "recommended"],
    status: "premium",
    requiresLogin: true,
  },
  {
    id: "integracao-zapier",
    name: "Integração com Zapier",
    description: "Conecte a plataforma com mais de 3000 aplicativos.",
    categories: ["integration", "recommended"],
    status: "included",
    requiresLogin: true,
  },
  {
    id: "template-natal",
    name: "Template Premium - Campanha de Natal",
    description: "Automação para vendas de fim de ano com IA.",
    categories: ["template", "premium"],
    status: "premium",
    requiresLogin: true,
  },
  {
    id: "integracao-hotmart",
    name: "Integração com Hotmart",
    description: "Conecte sua conta Hotmart para automação de infoprodutos.",
    categories: ["integration", "external"],
    status: "external",
    requiresLogin: false,
  },
  {
    id: "template-reengajamento",
    name: "Template - Reengajamento de Clientes Inativos",
    description: "Recupere clientes que não compram há mais de 60 dias.",
    categories: ["template", "recommended"],
    status: "included",
    requiresLogin: true,
  },
  {
    id: "integracao-rdstation",
    name: "Integração com RD Station",
    description: "Sincronize leads e automações com o RD Station.",
    categories: ["integration", "coming-soon"],
    status: "coming-soon",
    requiresLogin: true,
  },
]
