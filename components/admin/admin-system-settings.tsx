"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, RefreshCw, Download } from "lucide-react"

export function AdminSystemSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações do Sistema</CardTitle>
          <CardDescription>Configure parâmetros gerais do sistema.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="maintenance-mode" className="font-medium">
                Modo de Manutenção
              </Label>
              <p className="text-sm text-muted-foreground">Ativar modo de manutenção para todos os usuários.</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="maintenance-mode" />
            </div>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="debug-mode" className="font-medium">
                Modo de Depuração
              </Label>
              <p className="text-sm text-muted-foreground">Registrar informações detalhadas para depuração.</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="debug-mode" />
            </div>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="auto-backup" className="font-medium">
                Backup Automático
              </Label>
              <p className="text-sm text-muted-foreground">Realizar backups automáticos do sistema.</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="auto-backup" defaultChecked />
              <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-upload">Tamanho Máximo de Upload (MB)</Label>
            <Input id="max-upload" type="number" defaultValue="10" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-timeout">Tempo Limite de Sessão (minutos)</Label>
            <Input id="session-timeout" type="number" defaultValue="60" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Salvar Configurações</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Logs do Sistema</CardTitle>
          <CardDescription>Visualize e gerencie os logs do sistema.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium">Nível de Log</h3>
              <p className="text-xs text-muted-foreground">Defina o nível de detalhamento dos logs.</p>
            </div>
            <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="error">Erro</option>
              <option value="warning">Alerta</option>
              <option value="info" selected>
                Informação
              </option>
              <option value="debug">Depuração</option>
            </select>
          </div>

          <div className="rounded-md border bg-muted/50 p-4">
            <pre className="text-xs">
              <code>
                [2023-04-15 14:32:15] [INFO] Sistema iniciado com sucesso [2023-04-15 14:35:22] [INFO] Novo usuário
                registrado: usuario@exemplo.com [2023-04-15 14:40:18] [WARNING] Tentativa de login falhou para:
                usuario@exemplo.com [2023-04-15 14:45:30] [ERROR] Falha na conexão com a API do WhatsApp [2023-04-15
                14:50:45] [INFO] Backup automático iniciado [2023-04-15 14:55:12] [INFO] Backup automático concluído com
                sucesso
              </code>
            </pre>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Baixar Logs
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ações do Sistema</CardTitle>
          <CardDescription>Execute ações de manutenção no sistema.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Button variant="outline" className="justify-start">
              Limpar Cache
            </Button>
            <Button variant="outline" className="justify-start">
              Otimizar Banco de Dados
            </Button>
            <Button variant="outline" className="justify-start">
              Verificar Atualizações
            </Button>
            <Button variant="outline" className="justify-start">
              Backup Manual
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center gap-2 text-sm text-amber-500">
            <AlertTriangle className="h-4 w-4" />
            <span>Algumas ações podem causar interrupção temporária no serviço.</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
