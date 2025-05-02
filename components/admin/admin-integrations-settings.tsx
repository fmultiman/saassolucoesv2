"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, RefreshCw } from "lucide-react"

export function AdminIntegrationsSettings() {
  const [whatsappEnabled, setWhatsappEnabled] = useState(true)
  const [instagramEnabled, setInstagramEnabled] = useState(true)
  const [facebookEnabled, setFacebookEnabled] = useState(false)
  const [openaiEnabled, setOpenaiEnabled] = useState(true)
  const [googleEnabled, setGoogleEnabled] = useState(false)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Integrações de Canais</CardTitle>
          <CardDescription>Configure as integrações com canais de comunicação.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="whatsapp" className="font-medium">
                  WhatsApp Business API
                </Label>
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  Conectado
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Integração com a API oficial do WhatsApp Business.</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="whatsapp" checked={whatsappEnabled} onCheckedChange={setWhatsappEnabled} />
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="instagram" className="font-medium">
                  Instagram API
                </Label>
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  Conectado
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Integração com a API do Instagram para mensagens diretas.</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="instagram" checked={instagramEnabled} onCheckedChange={setInstagramEnabled} />
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="facebook" className="font-medium">
                  Facebook Messenger
                </Label>
                <Badge variant="outline" className="bg-red-500/10 text-red-500">
                  Desconectado
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Integração com o Facebook Messenger para atendimento.</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="facebook" checked={facebookEnabled} onCheckedChange={setFacebookEnabled} />
              <Button variant="outline" size="sm">
                Conectar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integrações de IA</CardTitle>
          <CardDescription>Configure as integrações com provedores de IA.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="openai" className="font-medium">
                  OpenAI
                </Label>
                <Badge variant="outline" className="bg-green-500/10 text-green-500">
                  Conectado
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Integração com a API da OpenAI para geração de texto.</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="openai" checked={openaiEnabled} onCheckedChange={setOpenaiEnabled} />
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="google" className="font-medium">
                  Google AI
                </Label>
                <Badge variant="outline" className="bg-red-500/10 text-red-500">
                  Desconectado
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Integração com a API do Google AI para processamento de linguagem.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="google" checked={googleEnabled} onCheckedChange={setGoogleEnabled} />
              <Button variant="outline" size="sm">
                Conectar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>Configure webhooks para eventos da plataforma.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">URL do Webhook</Label>
            <Input
              id="webhook-url"
              placeholder="https://seu-dominio.com/webhook"
              defaultValue="https://api.empresa.com/webhooks/saas-solucoes"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="webhook-secret">Chave Secreta</Label>
            <div className="flex gap-2">
              <Input id="webhook-secret" type="password" value="••••••••••••••••••••••" readOnly />
              <Button variant="outline">Copiar</Button>
              <Button variant="outline">Regenerar</Button>
            </div>
          </div>
          <div className="pt-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Último teste: Sucesso (15/04/2023 14:32)</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button>
            <RefreshCw className="mr-2 h-4 w-4" />
            Testar Webhook
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
