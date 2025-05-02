"use client"

import { ArrowUpRight, Users, Zap, TrendingUp, AlertTriangle } from "lucide-react"

export function AdminOverviewStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-lg border bg-card text-card-foreground shadow">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Clientes Ativos</p>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">
              <span className="flex items-center text-green-500">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +12% este mês
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Soluções Ativas</p>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">3,782</div>
            <p className="text-xs text-muted-foreground">
              <span className="flex items-center text-green-500">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +8% este mês
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Taxa de Conversão</p>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">24.8%</div>
            <p className="text-xs text-muted-foreground">
              <span className="flex items-center text-green-500">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +2.4% este mês
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Alertas Ativos</p>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              <span className="flex items-center text-destructive">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                +3 desde ontem
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
