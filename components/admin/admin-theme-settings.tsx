"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export function AdminThemeSettings() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme !== "light"

  return (
    <div className="border rounded-lg p-6 bg-card">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Aparencia</h2>
        <p className="text-sm text-muted-foreground">Escolha como o painel administrativo deve ser exibido.</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <Label htmlFor="admin-theme-toggle">Modo escuro</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Alterne entre os temas claro e escuro do ambiente administrativo.
          </p>
        </div>

        <Switch
          id="admin-theme-toggle"
          checked={mounted ? isDark : true}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          disabled={!mounted}
        />
      </div>
    </div>
  )
}
