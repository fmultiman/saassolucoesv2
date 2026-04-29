"use client"

import { useState } from "react"
import { ArrowUpDown, Download, Eye, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  const [selectedTransaction, setSelectedTransaction] = useState<(typeof transactions)[number] | null>(null)
  const [dialogMode, setDialogMode] = useState<"details" | "receipt" | null>(null)
  const [copied, setCopied] = useState(false)

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

  const openDialog = (mode: "details" | "receipt", transaction: (typeof transactions)[number]) => {
    setSelectedTransaction(transaction)
    setCopied(false)
    window.setTimeout(() => setDialogMode(mode), 0)
  }

  const getRecommendedAction = (status: string) => {
    switch (status) {
      case "failed":
        return "Revisar tentativa de cobrança e oferecer nova forma de pagamento."
      case "pending":
        return "Acompanhar compensação e notificar o cliente se necessário."
      default:
        return "Registrar cobrança concluída e seguir com a operação normalmente."
    }
  }

  const handleCopyReceipt = async () => {
    if (!selectedTransaction || !navigator?.clipboard) return

    const receiptSummary = [
      `Transação: ${selectedTransaction.id}`,
      `Cliente: ${selectedTransaction.customer}`,
      `Plano: ${selectedTransaction.plan}`,
      `Valor: R$ ${selectedTransaction.amount.toFixed(2)}`,
      `Data: ${selectedTransaction.date}`,
      `Método: ${getPaymentMethodLabel(selectedTransaction.paymentMethod)}`,
      `Status: ${selectedTransaction.status}`,
    ].join("\n")

    await navigator.clipboard.writeText(receiptSummary)
    setCopied(true)
  }

  return (
    <>
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
                      <Button variant="ghost" size="icon" title="Visualizar" onClick={() => openDialog("details", transaction)}>
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
                          <DropdownMenuItem
                            onSelect={(event) => {
                              event.preventDefault()
                              openDialog("receipt", transaction)
                            }}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Baixar recibo
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={(event) => {
                              event.preventDefault()
                              openDialog("details", transaction)
                            }}
                          >
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

      <Dialog
        open={!!dialogMode && !!selectedTransaction}
        onOpenChange={(open) => {
          if (!open) {
            setDialogMode(null)
            setSelectedTransaction(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-[520px]">
          {dialogMode === "details" && selectedTransaction && (
            <>
              <DialogHeader>
                <DialogTitle>Detalhes da transação</DialogTitle>
                <DialogDescription>Resumo administrativo da cobrança selecionada.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3 py-4 text-sm">
                <div><strong>Cliente:</strong> {selectedTransaction.customer}</div>
                <div><strong>Plano:</strong> {selectedTransaction.plan}</div>
                <div><strong>Data:</strong> {selectedTransaction.date}</div>
                <div><strong>Valor:</strong> R$ {selectedTransaction.amount.toFixed(2)}</div>
                <div><strong>Status:</strong> {selectedTransaction.status}</div>
                <div><strong>Método:</strong> {getPaymentMethodLabel(selectedTransaction.paymentMethod)}</div>
                <div className="rounded-md border p-3 text-muted-foreground">
                  <strong className="text-foreground">Próxima ação sugerida:</strong> {getRecommendedAction(selectedTransaction.status)}
                </div>
              </div>
            </>
          )}

          {dialogMode === "receipt" && selectedTransaction && (
            <>
              <DialogHeader>
                <DialogTitle>Recibo da transação</DialogTitle>
                <DialogDescription>Prepare o próximo passo operacional sem sair da tela.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4 text-sm text-muted-foreground">
                <p>O download real do recibo ainda não está conectado a um emissor financeiro, mas o resumo abaixo já ajuda no atendimento e no suporte.</p>
                <p>
                  Transação: <strong className="text-foreground">{selectedTransaction.id}</strong>
                </p>
                <p>
                  Cliente: <strong className="text-foreground">{selectedTransaction.customer}</strong>
                </p>
                <p>
                  Valor: <strong className="text-foreground">R$ {selectedTransaction.amount.toFixed(2)}</strong>
                </p>
              </div>
            </>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDialogMode(null)
                setSelectedTransaction(null)
              }}
            >
              Fechar
            </Button>
            {dialogMode === "receipt" && (
              <Button onClick={() => void handleCopyReceipt()}>{copied ? "Resumo copiado" : "Copiar resumo"}</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
