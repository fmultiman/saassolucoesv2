"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const overviewData = [
  { name: "Jan", usuarios: 400, solucoes: 240, interacoes: 2400 },
  { name: "Fev", usuarios: 430, solucoes: 250, interacoes: 2600 },
  { name: "Mar", usuarios: 448, solucoes: 290, interacoes: 2900 },
  { name: "Abr", usuarios: 470, solucoes: 310, interacoes: 3100 },
  { name: "Mai", usuarios: 540, solucoes: 340, interacoes: 3400 },
  { name: "Jun", usuarios: 580, solucoes: 370, interacoes: 3700 },
  { name: "Jul", usuarios: 610, solucoes: 390, interacoes: 4000 },
]

const kpiCards = [
  { title: "Usuários Ativos", value: "610", change: "+5.2%", description: "vs. mês anterior" },
  { title: "Soluções Ativas", value: "390", change: "+5.4%", description: "vs. mês anterior" },
  { title: "Interações Totais", value: "4,000", change: "+8.1%", description: "vs. mês anterior" },
  { title: "Tempo Médio de Uso", value: "18.5 min", change: "+2.3%", description: "vs. mês anterior" },
]

export function AdminMetricsOverview() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={card.change.startsWith("+") ? "text-green-500" : "text-red-500"}>{card.change}</span>{" "}
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Crescimento de Usuários e Soluções</CardTitle>
            <CardDescription>Tendência de crescimento nos últimos 7 meses</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={overviewData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip />
                <Line type="monotone" dataKey="usuarios" stroke="#0ea5e9" strokeWidth={2} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="solucoes" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Volume de Interações</CardTitle>
            <CardDescription>Total de interações por mês</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={overviewData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip />
                <Bar dataKey="interacoes" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
