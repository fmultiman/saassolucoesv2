"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Copy, RefreshCw, Plus } from "lucide-react"

export function AdminApiSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Chaves de API</CardTitle>
          <CardDescription>Gerencie as chaves de API para acesso à plataforma.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="api-key-prod">Chave de Produção</Label>
              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                Ativa
              </Badge>
            </div>
            <div className="flex gap-2">
              <Input id="api-key-prod" type="password" value="••••••••••••••••••••••" readOnly />
              <Button variant="outline">
                <Copy className="mr-2 h-4 w-4" />
                Copiar
              </Button>
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Última atualização: 10/03/2023</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="api-key-test">Chave de Teste</Label>
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                Teste
              </Badge>
            </div>
            <div className="flex gap-2">
              <Input id="api-key-test" type="password" value="••••••••••••••••••••••" readOnly />
              <Button variant="outline">
                <Copy className="mr-2 h-4 w-4" />
                Copiar
              </Button>
              <Button variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerar
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Última atualização: 15/04/2023</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Criar Nova Chave
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações de API</CardTitle>
          <CardDescription>Configure os limites e comportamentos da API.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="rate-limiting" className="font-medium">
                Limitação de Taxa
              </Label>
              <p className="text-sm text-muted-foreground">Limitar o número de requisições por minuto.</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="rate-limiting" defaultChecked />
              <Input className="w-20" type="number" defaultValue="100" />
              <span className="text-sm text-muted-foreground">req/min</span>
            </div>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="cors" className="font-medium">
                CORS
              </Label>
              <p className="text-sm text-muted-foreground">Permitir requisições de origens específicas.</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="cors" defaultChecked />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allowed-origins">Origens Permitidas</Label>
            <Input id="allowed-origins" placeholder="https://exemplo.com, https://app.exemplo.com" defaultValue="*" />
            <p className="text-xs text-muted-foreground">
              Separe múltiplas origens com vírgulas ou use * para permitir todas.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button>Salvar Configurações</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Documentação da API</CardTitle>
          <CardDescription>Links para documentação e recursos da API.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Button variant="outline" className="justify-start">
              Documentação OpenAPI
            </Button>
            <Button variant="outline" className="justify-start">
              Exemplos de Código
            </Button>
            <Button variant="outline" className="justify-start">
              Guia de Integração
            </Button>
            <Button variant="outline" className="justify-start">
              Changelog da API
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
