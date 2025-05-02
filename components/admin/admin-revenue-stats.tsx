"use client"

import { ArrowUpRight, CreditCard, Users, TrendingUp, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminRevenueStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ 87.432</div>
          <p className="text-xs text-muted-foreground">
            <span className="flex items-center text-green-500">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              +8% este mês
            </span>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clientes Pagantes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">924</div>
          <p className="text-xs text-muted-foreground">
            <span className="flex items-center text-green-500">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              +12% este mês
            </span>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ 94,62</div>
          <p className="text-xs text-muted-foreground">
            <span className="flex items-center text-green-500">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              +2.4% este mês
            </span>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Próximas Renovações</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">43</div>
          <p className="text-xs text-muted-foreground">
            <span className="flex items-center">Nos próximos 7 dias</span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
