"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type KpiCard = {
  title: string
  value: string | number
  change: string | number
  description: string
}

type ChartPoint = {
  name: string
  usuarios: number
  solucoes: number
  interacoes: number
}

const emptyKpis: KpiCard[] = [
  { title: "Usuarios Ativos", value: "-", change: "-", description: "vs. mes anterior" },
  { title: "Solucoes Ativas", value: "-", change: "-", description: "vs. mes anterior" },
  { title: "Interacoes Totais", value: "-", change: "-", description: "vs. mes anterior" },
  { title: "Tempo Medio de Uso", value: "-", change: "-", description: "vs. mes anterior" },
]

function formatPercent(value: unknown) {
  if (typeof value !== "number") return "-"
  return `${value > 0 ? "+" : ""}${value}%`
}

export function AdminMetricsOverview() {
  const [loading, setLoading] = useState(true)
  const [kpis, setKpis] = useState<KpiCard[]>(emptyKpis)
  const [chartData, setChartData] = useState<ChartPoint[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function fetchMetrics() {
      setLoading(true)
      setError(null)

      try {
        const [overviewRes, growthRes, volumeRes] = await Promise.all([
          fetch("/api/admin/metrics/overview"),
          fetch("/api/admin/metrics/users-solutions-growth"),
          fetch("/api/admin/metrics/interactions-volume"),
        ])

        if (!overviewRes.ok || !growthRes.ok || !volumeRes.ok) {
          throw new Error("Nao foi possivel carregar as metricas.")
        }

        const overview = await overviewRes.json()
        const growth = await growthRes.json()
        const volume = await volumeRes.json()

        if (!active) return

        setKpis([
          {
            title: "Usuarios Ativos",
            value: overview.usuariosAtivos ?? "-",
            change: formatPercent(overview.variacoes?.usuarios),
            description: "vs. mes anterior",
          },
          {
            title: "Solucoes Ativas",
            value: overview.solucoesAtivas ?? "-",
            change: formatPercent(overview.variacoes?.solucoes),
            description: "vs. mes anterior",
          },
          {
            title: "Interacoes Totais",
            value: overview.interacoesTotais ?? "-",
            change: formatPercent(overview.variacoes?.interacoes),
            description: "vs. mes anterior",
          },
          {
            title: "Tempo Medio de Uso",
            value: overview.tempoMedioUso ?? "-",
            change: formatPercent(overview.variacoes?.tempoUso),
            description: "vs. mes anterior",
          },
        ])

        const months = Array.from(new Set<string>([...(growth.meses ?? []), ...(volume.meses ?? [])]))
        setChartData(
          months.map((month) => {
            const growthIndex = growth.meses?.indexOf(month) ?? -1
            const volumeIndex = volume.meses?.indexOf(month) ?? -1

            return {
              name: month,
              usuarios: growthIndex >= 0 ? Number(growth.usuarios?.[growthIndex] ?? 0) : 0,
              solucoes: growthIndex >= 0 ? Number(growth.solucoes?.[growthIndex] ?? 0) : 0,
              interacoes: volumeIndex >= 0 ? Number(volume.interacoes?.[volumeIndex] ?? 0) : 0,
            }
          }),
        )
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : "Erro ao carregar metricas.")
          setKpis(emptyKpis)
          setChartData([])
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchMetrics()

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="space-y-4">
      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
          : kpis.map((card) => (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className={String(card.change).startsWith("+") ? "text-green-500" : "text-red-500"}>
                      {card.change}
                    </span>{" "}
                    {card.description}
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Crescimento de Usuarios e Solucoes</CardTitle>
            <CardDescription>Tendencia de crescimento nos ultimos 7 meses</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            {loading ? (
              <Skeleton className="h-[350px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="usuarios" stroke="#0ea5e9" strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="solucoes" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Volume de Interacoes</CardTitle>
            <CardDescription>Total de interacoes por mes</CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            {loading ? (
              <Skeleton className="h-[350px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="interacoes" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
