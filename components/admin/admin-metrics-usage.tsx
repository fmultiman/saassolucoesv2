"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const solutionUsageData = [
  { name: "Automação de Email", value: 35 },
  { name: "Chatbot", value: 25 },
  { name: "Análise de Dados", value: 20 },
  { name: "Geração de Conteúdo", value: 15 },
  { name: "Outros", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

const userActivityData = [
  { hora: "08:00", ativos: 120 },
  { hora: "10:00", ativos: 240 },
  { hora: "12:00", ativos: 300 },
  { hora: "14:00", ativos: 380 },
  { hora: "16:00", ativos: 420 },
  { hora: "18:00", ativos: 350 },
  { hora: "20:00", ativos: 200 },
]

const deviceUsageData = [
  { device: "Desktop", percentage: 65 },
  { device: "Mobile", percentage: 30 },
  { device: "Tablet", percentage: 5 },
]

export function AdminMetricsUsage() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Uso por Solução</CardTitle>
            <CardDescription>Distribuição de uso entre soluções</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={solutionUsageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {solutionUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Uso por Dispositivo</CardTitle>
            <CardDescription>Distribuição de acesso por tipo de dispositivo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceUsageData.map((item) => (
                <div key={item.device} className="flex items-center">
                  <div className="w-[100px] flex-none">{item.device}</div>
                  <div className="flex-1">
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-primary" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                  <div className="w-[50px] flex-none text-right">{item.percentage}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle>Estatísticas de Uso</CardTitle>
            <CardDescription>Métricas principais de utilização</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Tempo médio por sessão</dt>
                <dd className="text-sm font-medium">18.5 minutos</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Sessões por usuário/mês</dt>
                <dd className="text-sm font-medium">24</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Taxa de retenção</dt>
                <dd className="text-sm font-medium">87%</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Usuários ativos diários</dt>
                <dd className="text-sm font-medium">320</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm font-medium text-muted-foreground">Usuários ativos mensais</dt>
                <dd className="text-sm font-medium">610</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Atividade de Usuários por Hora</CardTitle>
          <CardDescription>Número de usuários ativos ao longo do dia</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={userActivityData}>
              <XAxis dataKey="hora" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip />
              <Bar dataKey="ativos" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
