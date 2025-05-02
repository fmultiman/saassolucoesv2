export const APP_NAME = "SaaS Soluções"

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  DASHBOARD: "/dashboard",
  ADMIN: "/admin",
  BLOG: "/blog",
  MARKETPLACE: "/marketplace",
}

export const MESSAGES = {
  ERRORS: {
    GENERIC: "Ocorreu um erro. Por favor, tente novamente mais tarde.",
    AUTHENTICATION: "Erro de autenticação. Por favor, faça login novamente.",
    PERMISSION: "Você não tem permissão para acessar este recurso.",
    NOT_FOUND: "O recurso solicitado não foi encontrado.",
    VALIDATION: "Por favor, verifique os dados informados e tente novamente.",
    SERVER: "Erro no servidor. Nossa equipe foi notificada.",
  },
  SUCCESS: {
    GENERIC: "Operação realizada com sucesso!",
    LOGIN: "Login realizado com sucesso!",
    SIGNUP: "Cadastro realizado com sucesso!",
    UPDATE: "Dados atualizados com sucesso!",
    DELETE: "Item excluído com sucesso!",
    CREATE: "Item criado com sucesso!",
  },
  CONFIRMATIONS: {
    DELETE: "Tem certeza que deseja excluir este item?",
    CANCEL: "Tem certeza que deseja cancelar esta operação?",
    LOGOUT: "Tem certeza que deseja sair?",
  },
}

export const PLANS = {
  GRATUITO: {
    id: "gratuito",
    code: "gratuito",
    name: "Gratuito",
    price: "R$ 0",
    features: ["Até 3 soluções ativas", "Suporte básico", "Acesso à comunidade"],
  },
  ESSENCIAL: {
    id: "essencial",
    code: "essencial",
    name: "Essencial",
    price: "R$ 99/mês",
    features: ["Até 10 soluções ativas", "Suporte prioritário", "Acesso a templates premium"],
  },
  PROFISSIONAL: {
    id: "profissional",
    code: "profissional",
    name: "Profissional",
    price: "R$ 249/mês",
    features: ["Até 25 soluções ativas", "Suporte prioritário", "Acesso a todas as integrações", "API personalizada"],
  },
  COMPLETO: {
    id: "completo",
    code: "completo",
    name: "Completo",
    price: "R$ 599/mês",
    features: ["Soluções ilimitadas", "Gerente de conta dedicado", "Treinamento personalizado", "SLA garantido"],
  },
}

// Mapeamento de planos para uso interno no sistema
export const PLAN_MAPPING = {
  // Códigos em português
  gratuito: "gratuito",
  essencial: "essencial",
  profissional: "profissional",
  completo: "completo",

  // Compatibilidade com códigos antigos
  free: "gratuito",
  basic: "essencial",
  pro: "profissional",
  enterprise: "completo",
}

// Plano padrão caso não seja especificado ou seja inválido
export const DEFAULT_PLAN = "gratuito"
