"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Plus, RefreshCw } from "lucide-react"

export function AdminAgentSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações de Agentes IA</CardTitle>
          <CardDescription>Configure os modelos e comportamentos dos agentes de IA.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="default-model" className="font-medium">
                  Modelo Padrão
                </Label>
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  Ativo
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Modelo de IA usado por padrão nas soluções.</p>
            </div>
            <div className="flex items-center gap-2">
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-2">Claude 2</option>
                <option value="palm-2">PaLM 2</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="system-prompt">Prompt de Sistema Padrão</Label>
            <Textarea
              id="system-prompt"
              placeholder="Instruções para o modelo de IA..."
              defaultValue="Você é um assistente virtual da plataforma SaaS Soluções. Seu objetivo é ajudar os usuários de forma educada, precisa e concisa. Sempre forneça informações relevantes e úteis, e evite respostas muito longas ou complexas."
              className="min-h-32"
            />
            <p className="text-xs text-muted-foreground">
              Este prompt será usado como base para todos os agentes, a menos que seja substituído.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="temperature">Temperatura (Criatividade)</Label>
              <span className="text-sm">0.7</span>
            </div>
            <Slider defaultValue={[0.7]} max={1} step={0.1} />
            <p className="text-xs text-muted-foreground">
              Valores mais baixos geram respostas mais previsíveis, valores mais altos geram respostas mais criativas.
            </p>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="memory" className="font-medium">
                Memória de Contexto
              </Label>
              <p className="text-sm text-muted-foreground">Armazenar histórico de conversas para contexto.</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="memory" defaultChecked />
              <Input className="w-20" type="number" defaultValue="10" />
              <span className="text-sm text-muted-foreground">mensagens</span>
            </div>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="fallback" className="font-medium">
                Fallback Automático
              </Label>
              <p className="text-sm text-muted-foreground">Alternar para modelo secundário em caso de falha.</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="fallback" defaultChecked />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Restaurar Padrões
          </Button>
          <Button>Salvar Configurações</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Agentes Personalizados</CardTitle>
              <CardDescription>Agentes de IA com configurações específicas.</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Novo Agente
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead>
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <th className="h-12 px-4 text-left align-middle font-medium">Nome</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Modelo</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Temperatura</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
                    <th className="h-12 px-4 text-left align-middle font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">Atendente Virtual</td>
                    <td className="p-4 align-middle">GPT-4</td>
                    <td className="p-4 align-middle">0.7</td>
                    <td className="p-4 align-middle">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        Ativo
                      </Badge>
                    </td>
                    <td className="p-4 align-middle">
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">Vendas</td>
                    <td className="p-4 align-middle">GPT-4</td>
                    <td className="p-4 align-middle">0.8</td>
                    <td className="p-4 align-middle">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        Ativo
                      </Badge>
                    </td>
                    <td className="p-4 align-middle">
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </td>
                  </tr>
                  <tr className="transition-colors hover:bg-muted/50">
                    <td className="p-4 align-middle font-medium">Suporte Técnico</td>
                    <td className="p-4 align-middle">Claude 2</td>
                    <td className="p-4 align-middle">0.5</td>
                    <td className="p-4 align-middle">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500">
                        Ativo
                      </Badge>
                    </td>
                    <td className="p-4 align-middle">
                      <Button variant="ghost" size="sm">
                        Editar
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
