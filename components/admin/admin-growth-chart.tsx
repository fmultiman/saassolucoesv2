"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    month: "Jan",
    users: 820,
  },
  {
    month: "Fev",
    users: 932,
  },
  {
    month: "Mar",
    users: 1041,
  },
  {
    month: "Abr",
    users: 1120,
  },
  {
    month: "Mai",
    users: 1187,
  },
  {
    month: "Jun",
    users: 1248,
  },
]

export function AdminGrowthChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Line type="monotone" dataKey="users" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
