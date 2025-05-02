// Arquivo para configuração centralizada de autenticação
// Isso ajuda a evitar conflitos entre diferentes sistemas de autenticação

export const authConfig = {
  // Definir qual sistema de autenticação está ativo
  activeAuthSystem: "supabase", // 'supabase' ou 'nextauth'

  // Configurações específicas do Supabase
  supabase: {
    // Tempo limite para requisições em milissegundos
    requestTimeout: 15000,

    // Número máximo de tentativas para operações de autenticação
    maxRetries: 3,

    // Intervalo entre tentativas (em milissegundos)
    retryInterval: 1000,

    // Rotas de redirecionamento
    redirects: {
      afterSignIn: "/dashboard",
      afterSignUp: "/dashboard",
      afterSignOut: "/",
    },
  },
}
