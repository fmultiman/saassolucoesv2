// Uma versão simplificada do sistema de feature flags para começar rapidamente

// Armazenamento local de flags
const featureFlags: Record<string, boolean> = {
  onboarding: true, // Habilitamos o onboarding imediatamente
  "solution-customization": false,
  "trial-system": false,
}

// Função simples para verificar se uma feature está habilitada
export function isFeatureEnabled(featureName: string): boolean {
  return featureFlags[featureName] === true
}

// Função para habilitar/desabilitar uma feature
export function setFeatureFlag(featureName: string, enabled: boolean): void {
  featureFlags[featureName] = enabled

  // Em um ambiente real, você salvaria isso no banco de dados
  console.log(`Feature flag "${featureName}" set to ${enabled}`)
}

// Hook para usar feature flags em componentes React
export function useFeatureFlag(featureName: string): boolean {
  return isFeatureEnabled(featureName)
}
