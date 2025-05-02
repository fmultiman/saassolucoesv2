"use client"

import { useFeatureFlag, FeatureFlag } from "@/lib/feature-flags"
import { useCurrentUser } from "@/hooks/use-current-user"

export function ExampleFeatureFlagUsage() {
  const user = useCurrentUser()
  const isOnboardingEnabled = useFeatureFlag("onboarding", user?.id, user?.roles)

  return (
    <div className="p-4 border rounded-md">
      <h3 className="font-medium mb-2">Exemplo de Uso de Feature Flags</h3>

      {/* Usando o hook */}
      {isOnboardingEnabled && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <p className="text-sm">Este é o novo fluxo de onboarding (usando hook)</p>
        </div>
      )}

      {/* Usando o componente */}
      <FeatureFlag
        name="solution-customization"
        userId={user?.id}
        userRoles={user?.roles}
        fallback={<p className="text-sm text-muted-foreground">Personalização de soluções em breve!</p>}
      >
        <div className="p-3 bg-green-50 rounded-md">
          <p className="text-sm">Personalize suas soluções aqui (usando componente)</p>
        </div>
      </FeatureFlag>
    </div>
  )
}
