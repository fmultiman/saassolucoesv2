"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Atendimento IA",
    total: 432,
  },
  {
    name: "Recuperação",
    total: 356,
  },
  {
    name: "Pós-venda",
    total: 271,
  },
  {
    name: "Agendamento",
    total: 190,
  },
  {
    name: "Promoções",
    total: 134,
  },
  {
    name: "Pesquisa",
    total: 98,
  },
]

export function AdminSolutionsChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
