"use client"

import { ArrowUpRight, Users, CreditCard, Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminSubscriptionsStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Assinantes Ativos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,248</div>
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
          <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
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
          <CardTitle className="text-sm font-medium">Vencimentos Próximos</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">43</div>
          <p className="text-xs text-muted-foreground">
            <span className="flex items-center">Nos próximos 7 dias</span>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tempo Médio de Assinatura</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">7.2 meses</div>
          <p className="text-xs text-muted-foreground">
            <span className="flex items-center text-green-500">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              +0.8 meses vs. trimestre anterior
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
