import type React from "react"
// Exemplo de implementação de feature flags

type FeatureFlag = {
  name: string
  enabled: boolean
  description: string
  enabledForUsers?: string[] // IDs de usuários específicos
  enabledForRoles?: string[] // Roles específicas (ex: "admin", "premium")
  rolloutPercentage?: number // Porcentagem de usuários (0-100)
}

// Feature flags iniciais
const FEATURE_FLAGS: FeatureFlag[] = [
  {
    name: "improved-loading-states",
    enabled: false,
    description: "Novos estados de carregamento com esqueletos",
    rolloutPercentage: 0,
  },
  {
    name: "pagination",
    enabled: false,
    description: "Paginação em listas longas",
    rolloutPercentage: 0,
  },
  {
    name: "onboarding",
    enabled: false,
    description: "Fluxo de onboarding personalizado",
    rolloutPercentage: 0,
  },
  {
    name: "solution-customization",
    enabled: false,
    description: "Personalização de soluções",
    enabledForRoles: ["admin"],
    rolloutPercentage: 0,
  },
  {
    name: "trial-system",
    enabled: false,
    description: "Sistema de trial para soluções premium",
    enabledForRoles: ["admin"],
    rolloutPercentage: 0,
  },
]

// Função para verificar se uma feature está habilitada para um usuário específico
export function isFeatureEnabled(featureName: string, userId?: string, userRoles?: string[]): boolean {
  const feature = FEATURE_FLAGS.find((f) => f.name === featureName)

  if (!feature || !feature.enabled) {
    return false
  }

  // Verificar se está habilitado para usuários específicos
  if (userId && feature.enabledForUsers?.includes(userId)) {
    return true
  }

  // Verificar se está habilitado para roles específicas
  if (userRoles && feature.enabledForRoles?.some((role) => userRoles.includes(role))) {
    return true
  }

  // Verificar rollout percentual
  if (feature.rolloutPercentage !== undefined && userId) {
    // Usar o userId para determinar se o usuário está no percentual de rollout
    // Esta é uma implementação simples - em produção, você pode querer algo mais sofisticado
    const hash = hashString(userId)
    const userPercentile = hash % 100
    return userPercentile < feature.rolloutPercentage
  }

  // Se não há restrições específicas, a feature está habilitada para todos
  return true
}

// Função simples para gerar um hash de uma string
function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash)
}

// Hook para usar feature flags em componentes React
export function useFeatureFlag(featureName: string, userId?: string, userRoles?: string[]): boolean {
  return isFeatureEnabled(featureName, userId, userRoles)
}

// Componente para renderizar conteúdo condicionalmente com base em feature flags
export function FeatureFlag({
  name,
  userId,
  userRoles,
  children,
  fallback = null,
}: {
  name: string
  userId?: string
  userRoles?: string[]
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const isEnabled = isFeatureEnabled(name, userId, userRoles)
  return isEnabled ? <>{children}</> : <>{fallback}</>
}
