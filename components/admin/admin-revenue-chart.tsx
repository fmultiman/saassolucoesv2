"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

const data = [
  {
    month: "Jan",
    revenue: 65432,
  },
  {
    month: "Fev",
    revenue: 68754,
  },
  {
    month: "Mar",
    revenue: 72145,
  },
  {
    month: "Abr",
    revenue: 74890,
  },
  {
    month: "Mai",
    revenue: 78321,
  },
  {
    month: "Jun",
    revenue: 80876,
  },
  {
    month: "Jul",
    revenue: 83210,
  },
  {
    month: "Ago",
    revenue: 84567,
  },
  {
    month: "Set",
    revenue: 85432,
  },
  {
    month: "Out",
    revenue: 86789,
  },
  {
    month: "Nov",
    revenue: 87432,
  },
  {
    month: "Dez",
    revenue: 89654,
  },
]

export function AdminRevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `R$ ${value.toLocaleString()}`}
        />
        <Tooltip
          formatter={(value: number) => [`R$ ${value.toLocaleString()}`, "Receita"]}
          labelFormatter={(label) => `Mês: ${label}`}
        />
        <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
