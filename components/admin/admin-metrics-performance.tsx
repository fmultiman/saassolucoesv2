"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

const performanceData = [
  { name: "01/07", tempoResposta: 120, taxaErro: 2.0, cpu: 45 },
  { name: "02/07", tempoResposta: 132, taxaErro: 2.2, cpu: 48 },
  { name: "03/07", tempoResposta: 101, taxaErro: 1.5, cpu: 38 },
  { name: "04/07", tempoResposta: 134, taxaErro: 2.0, cpu: 43 },
  { name: "05/07", tempoResposta: 90, taxaErro: 1.2, cpu: 39 },
  { name: "06/07", tempoResposta: 230, taxaErro: 3.1, cpu: 78 },
  { name: "07/07", tempoResposta: 210, taxaErro: 2.9, cpu: 62 },
  { name: "08/07", tempoResposta: 120, taxaErro: 1.8, cpu: 45 },
  { name: "09/07", tempoResposta: 105, taxaErro: 1.6, cpu: 40 },
  { name: "10/07", tempoResposta: 95, taxaErro: 1.2, cpu: 37 },
]

const systemHealth = [
  { name: "API Gateway", status: "healthy", uptime: "99.98%", load: 42 },
  { name: "Banco de Dados", status: "healthy", uptime: "99.95%", load: 68 },
  { name: "Serviço de IA", status: "warning", uptime: "99.82%", load: 87 },
  { name: "Sistema de Arquivos", status: "healthy", uptime: "100%", load: 23 },
  { name: "Serviço de Email", status: "healthy", uptime: "99.97%", load: 35 },
]

export function AdminMetricsPerformance() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tempo Médio de Resposta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">118ms</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">-12%</span> vs. semana anterior
            </p>
            <div className="mt-4 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <Line type="monotone" dataKey="tempoResposta" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.8%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-amber-500">+0.3%</span> vs. semana anterior
            </p>
            <div className="mt-4 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <Line type="monotone" dataKey="taxaErro" stroke="#f59e0b" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Uso de CPU</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">-5%</span> vs. semana anterior
            </p>
            <div className="mt-4 h-[80px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <Line type="monotone" dataKey="cpu" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Disponibilidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.95%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+0.02%</span> vs. semana anterior
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="ml-2 text-xs">Últimas 24h: 100%</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="ml-2 text-xs">Últimos 7 dias: 99.95%</span>
              </div>
              <div className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="ml-2 text-xs">Últimos 30 dias: 99.92%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Saúde do Sistema</CardTitle>
          <CardDescription>Status atual dos componentes principais</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemHealth.map((service) => (
              <div key={service.name} className="grid grid-cols-4 items-center gap-4">
                <div className="col-span-1 font-medium">{service.name}</div>
                <div className="col-span-1">
                  <Badge
                    variant={service.status === "healthy" ? "outline" : "secondary"}
                    className={
                      service.status === "healthy"
                        ? "bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700"
                        : "bg-yellow-50 text-yellow-700 hover:bg-yellow-50 hover:text-yellow-700"
                    }
                  >
                    {service.status === "healthy" ? "Saudável" : "Atenção"}
                  </Badge>
                </div>
                <div className="col-span-1 text-sm text-muted-foreground">{service.uptime}</div>
                <div className="col-span-1">
                  <div className="flex items-center gap-2">
                    <Progress value={service.load} className="h-2" />
                    <span className="text-xs text-muted-foreground">{service.load}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Métricas de Performance</CardTitle>
          <CardDescription>Tendências de performance nos últimos 10 dias</CardDescription>
        </CardHeader>
        <CardContent className="px-2">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={performanceData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip />
              <Line
                type="monotone"
                name="Tempo de Resposta (ms)"
                dataKey="tempoResposta"
                stroke="#0ea5e9"
                strokeWidth={2}
              />
              <Line type="monotone" name="Taxa de Erro (%)" dataKey="taxaErro" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" name="Uso de CPU (%)" dataKey="cpu" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
