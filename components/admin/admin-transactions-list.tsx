"use client"

import { useState } from "react"
import { MoreHorizontal, ArrowUpDown, Eye, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// Dados de exemplo para transações
const transactions = [
  {
    id: "t1",
    date: "15/04/2023",
    customer: "João Silva",
    plan: "Pro",
    amount: 249.0,
    status: "completed",
    paymentMethod: "credit_card",
  },
  {
    id: "t2",
    date: "15/04/2023",
    customer: "Maria Oliveira",
    plan: "Enterprise",
    amount: 599.0,
    status: "completed",
    paymentMethod: "credit_card",
  },
  {
    id: "t3",
    date: "14/04/2023",
    customer: "Carlos Santos",
    plan: "Basic",
    amount: 99.0,
    status: "completed",
    paymentMethod: "pix",
  },
  {
    id: "t4",
    date: "14/04/2023",
    customer: "Ana Pereira",
    plan: "Pro",
    amount: 249.0,
    status: "failed",
    paymentMethod: "credit_card",
  },
  {
    id: "t5",
    date: "13/04/2023",
    customer: "Roberto Almeida",
    plan: "Pro",
    amount: 249.0,
    status: "completed",
    paymentMethod: "boleto",
  },
  {
    id: "t6",
    date: "13/04/2023",
    customer: "Fernanda Lima",
    plan: "Enterprise",
    amount: 599.0,
    status: "completed",
    paymentMethod: "credit_card",
  },
  {
    id: "t7",
    date: "12/04/2023",
    customer: "Gabriel Mendes",
    plan: "Pro",
    amount: 249.0,
    status: "pending",
    paymentMethod: "boleto",
  },
  {
    id: "t8",
    date: "12/04/2023",
    customer: "Juliana Costa",
    plan: "Basic",
    amount: 99.0,
    status: "completed",
    paymentMethod: "pix",
  },
]

export function AdminTransactionsList() {
  const [sortColumn, setSortColumn] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            Concluído
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
            Pendente
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-500">
            Falhou
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Cartão de Crédito"
      case "boleto":
        return "Boleto"
      case "pix":
        return "PIX"
      default:
        return method
    }
  }

  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="border-b transition-colors hover:bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium">
                <Button variant="ghost" onClick={() => handleSort("date")} className="flex items-center gap-1">
                  Data
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                <Button variant="ghost" onClick={() => handleSort("customer")} className="flex items-center gap-1">
                  Cliente
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                <Button variant="ghost" onClick={() => handleSort("plan")} className="flex items-center gap-1">
                  Plano
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                <Button variant="ghost" onClick={() => handleSort("amount")} className="flex items-center gap-1">
                  Valor
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                <Button variant="ghost" onClick={() => handleSort("status")} className="flex items-center gap-1">
                  Status
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">
                <Button variant="ghost" onClick={() => handleSort("paymentMethod")} className="flex items-center gap-1">
                  Método
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 align-middle">{transaction.date}</td>
                <td className="p-4 align-middle font-medium">{transaction.customer}</td>
                <td className="p-4 align-middle">{transaction.plan}</td>
                <td className="p-4 align-middle">R$ {transaction.amount.toFixed(2)}</td>
                <td className="p-4 align-middle">{getStatusBadge(transaction.status)}</td>
                <td className="p-4 align-middle">{getPaymentMethodLabel(transaction.paymentMethod)}</td>
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" title="Visualizar">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Baixar recibo
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-4">
        <div className="text-sm text-muted-foreground">Mostrando 8 de 248 transações</div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Anterior
          </Button>
          <Button variant="outline" size="sm">
            Próxima
          </Button>
        </div>
      </div>
    </div>
  )
}
