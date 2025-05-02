"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  {
    name: "Seg",
    WhatsApp: 4000,
    Email: 2400,
    Instagram: 1200,
  },
  {
    name: "Ter",
    WhatsApp: 4200,
    Email: 2100,
    Instagram: 1300,
  },
  {
    name: "Qua",
    WhatsApp: 5800,
    Email: 2800,
    Instagram: 1700,
  },
  {
    name: "Qui",
    WhatsApp: 4800,
    Email: 2300,
    Instagram: 1500,
  },
  {
    name: "Sex",
    WhatsApp: 5200,
    Email: 2900,
    Instagram: 1800,
  },
  {
    name: "Sáb",
    WhatsApp: 3800,
    Email: 1800,
    Instagram: 1100,
  },
  {
    name: "Dom",
    WhatsApp: 3200,
    Email: 1400,
    Instagram: 900,
  },
]

export function AdminInteractionsChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Legend />
        <Bar dataKey="WhatsApp" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Email" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Instagram" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
