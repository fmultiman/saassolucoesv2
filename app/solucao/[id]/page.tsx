"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import {
  MessageSquare,
  Calendar,
  ThumbsUp,
  Users,
  Bot,
  Zap,
  Mail,
  Heart,
  Megaphone,
  Share2,
  Briefcase,
  ArrowLeft,
  AlertCircle,
  MessageCircle,
  Instagram,
  Phone,
  Headphones,
  Send,
  UserCheck,
  Filter,
  ShoppingCart,
  Gift,
  Star,
  Repeat,
  CalendarCheck,
  CalendarPlus,
  Smile,
  FileText,
  CheckSquare,
  Bell,
  PenTool,
  Layers,
  ArrowRight,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { viewport } from "@/lib/viewport"
import { useCurrentUser } from "@/hooks/use-current-user"
import Link from "next/link"

export { viewport }

type SolucaoDetalhes = {
  id: string
  nome: string
  descricao: string
  categoria: string
  status: string
  ativacoes: number
  estatisticas: {
    interacoes?: number
    tempoEconomizado?: string
    taxaResolucao?: string
    [key: string]: string | number | undefined
  }
  configuracoes: {
    mensagemPadrao?: string
    horasFuncionamento?: string
    notificacoes?: boolean
    [key: string]:
      | string
      | number
      | boolean
      | Array<{ pergunta: string; resposta: string }>
      | undefined
  }
}

type CategoriaInfo = {
  icon: LucideIcon
  cor: string
  label: string
}

type UpgradePlan = {
  name: string
}

type ApiSolution = {
  id: number | string
  slug?: string | null
  name: string
  description: string | null
  category: string | null
  is_active: boolean | null
  activations: number | null
}

export default function SolucaoDetalhesPage() {
  const params = useParams()
  const router = useRouter()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [solucao, setSolucao] = useState<SolucaoDetalhes | null>(null)
  const [isActive, setIsActive] = useState(false)
  const { user, loading: userLoading } = useCurrentUser()
  const [available, setAvailable] = useState(false)
  const [checkingAvailability, setCheckingAvailability] = useState(true)
  const [reason, setReason] = useState("")
  const [upgradePlan, setUpgradePlan] = useState<UpgradePlan | null>(null)
  const solutionId = Array.isArray(params.id) ? params.id[0] : params.id
  const isNumericSolutionId = !!solutionId && /^\d+$/.test(solutionId)

  // Verificar se o usuário tem acesso à solução
  const checkAvailability = useCallback(async (solutionId: string, userId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/solutions/${solutionId}/availability?userId=${userId}`,
        {
          cache: "no-store",
        },
      )

      if (!response.ok) {
        return { available: false, reason: "Erro ao verificar disponibilidade" }
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Erro ao verificar disponibilidade:", error)
      return { available: false, reason: "Erro ao verificar disponibilidade" }
    }
  }, [])

  useEffect(() => {
    if (!solutionId || userLoading) return

    if (!user?.id) {
      setAvailable(false)
      setReason("Usuário não autenticado")
      setCheckingAvailability(false)
      return
    }

    if (!isNumericSolutionId) {
      setAvailable(true)
      setCheckingAvailability(false)
      return
    }

    setCheckingAvailability(true)
    checkAvailability(solutionId, user.id)
      .then((data) => {
        setAvailable(data.available)
        setReason(data.reason)
        setUpgradePlan(data.upgradePlan)
      })
      .finally(() => setCheckingAvailability(false))
  }, [solutionId, isNumericSolutionId, user?.id, userLoading, checkAvailability])

  // Se a solução não estiver disponível, mostre uma mensagem
  if (!checkingAvailability && !available) {
    return (
      <div className="container max-w-4xl py-10">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Solução não disponível</h2>
          <p className="text-yellow-700 mb-4">{reason}</p>
          {upgradePlan && (
            <Link
              href="/assinatura"
              className="inline-flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
            >
              Fazer upgrade para o plano {upgradePlan.name}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        <Button variant="outline" asChild>
          <Link href="/solucoes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para soluções
          </Link>
        </Button>
      </div>
    )
  }

  // Mapeamento de ícones por categoria
  const iconesPorCategoria = {
    atendimento: {
      icon: MessageSquare,
      cor: "bg-blue-500/10 text-blue-500",
      label: "Atendimento",
    },
    vendas: {
      icon: ShoppingCart,
      cor: "bg-green-500/10 text-green-500",
      label: "Vendas",
    },
    relacionamento: {
      icon: Heart,
      cor: "bg-pink-500/10 text-pink-500",
      label: "Relacionamento",
    },
    agendamento: {
      icon: Calendar,
      cor: "bg-purple-500/10 text-purple-500",
      label: "Agendamento",
    },
    feedback: {
      icon: ThumbsUp,
      cor: "bg-orange-500/10 text-orange-500",
      label: "Feedback",
    },
    marketing: {
      icon: Megaphone,
      cor: "bg-red-500/10 text-red-500",
      label: "Marketing",
    },
    "redes-sociais": {
      icon: Share2,
      cor: "bg-indigo-500/10 text-indigo-500",
      label: "Redes Sociais",
    },
    administracao: {
      icon: Briefcase,
      cor: "bg-slate-500/10 text-slate-500",
      label: "Administração",
    },
  }

  // Mapeamento de ícones por ID de solução
  const iconesPorId = {
    "chat-rapido": MessageSquare,
    "atendimento-menu": MessageCircle,
    "autoatendimento-ia": Bot,
    "atendente-whatsapp": Phone,
    "chatbot-instagram": Instagram,
    "central-mensagens": MessageSquare,
    "bot-comentarios": MessageCircle,
    "assistente-suporte": Headphones,
    "recuperar-cliente": Users,
    "promocao-rapida": Zap,
    "pos-orcamento": Send,
    "captura-leads": UserCheck,
    "funil-vendas": Filter,
    "crm-basico": Users,
    "bot-orcamentos": ShoppingCart,
    "promocoes-cupons": Gift,
    "solicitacao-avaliacoes": Star,
    "pedidos-whatsapp": ShoppingCart,
    "boas-vindas": Heart,
    "pos-venda-ia": UserCheck,
    reengajamento: Repeat,
    aniversario: Gift,
    "chatbot-boasvindas": MessageCircle,
    "agendamento-rapido": Calendar,
    "confirmacao-consulta": CalendarCheck,
    reagendamento: CalendarPlus,
    "agendamento-online": Calendar,
    "agendamento-chatbot": MessageCircle,
    "assistente-reservas": Calendar,
    "pesquisa-satisfacao": ThumbsUp,
    "feedback-ia": Smile,
    "coleta-opiniao": MessageSquare,
    "feedback-aberto": FileText,
    "solicitacao-avaliacoes-feedback": Star,
    "sequencia-conteudo": Layers,
    "texto-divulgacao": FileText,
    "campanha-sazonal": Calendar,
    "conteudo-ia": PenTool,
    "email-marketing": Mail,
    "captura-leads-marketing": UserCheck,
    "sugestao-post": PenTool,
    "resposta-comentarios": MessageCircle,
    "agendamento-post": Calendar,
    "agendamento-postagens": Share2,
    "lembrete-diario": Bell,
    "checklist-tarefas": CheckSquare,
    "notificacoes-internas": AlertCircle,
  }

  // Descrições das soluções
  const descricoesSolucoes = {
    "chat-rapido": "Responde dúvidas comuns com mensagens automáticas.",
    "atendimento-menu": "Cria um menu interativo para guiar o cliente automaticamente.",
    "autoatendimento-ia": "Cliente interage com um fluxo que entende a intenção e responde sozinho.",
    "recuperar-cliente": "Reativa contatos que pararam de responder com mensagem personalizada.",
    "promocao-rapida": "Envia uma oferta direta para clientes com texto gerado automaticamente.",
    "pos-orcamento": "Envia uma mensagem automática após envio de orçamento para relembrar o cliente.",
    "boas-vindas": "Envia uma mensagem calorosa automática para quem entrar em contato.",
    "pos-venda-ia": "Agradece a compra e pergunta se o cliente ficou satisfeito.",
    reengajamento: "Tenta reativar contatos antigos com uma abordagem personalizada.",
    "agendamento-rapido": "Permite que o cliente marque um horário via mensagem automática.",
    "confirmacao-consulta": "Lembra o cliente da consulta com botão para confirmar ou reagendar.",
    reagendamento: "Sugere automaticamente novas datas quando o cliente falta ou cancela.",
    "pesquisa-satisfacao": "Coleta avaliação de atendimento ou serviço com emojis ou notas.",
    "feedback-ia": "Analisa o que o cliente escreveu e classifica como positivo ou negativo.",
    "coleta-opiniao": "Faz 1 pergunta simples e registra a resposta do cliente.",
    "sequencia-conteudo": "Envia dicas e conteúdos por WhatsApp em sequência programada.",
    "texto-divulgacao": "Gera um texto promocional automático com IA com base em palavras-chave.",
    "campanha-sazonal": "Envia mensagem em datas comemorativas para gerar engajamento.",
    "sugestao-post": "Gera sugestões de posts semanais com base no nicho do cliente.",
    "resposta-comentarios": "Responde comentários e directs com IA.",
    "agendamento-post": "Permite definir postagens com texto e imagem para horários específicos.",
    "lembrete-diario": "Envia recado automático diário para a equipe.",
    "checklist-tarefas": "Cria checklist automatizado para rotina interna da empresa.",
    "notificacoes-internas": "Gera alertas com base em eventos internos usando IA simples.",
    "atendente-whatsapp": "Responde perguntas frequentes e saudações automáticas a qualquer hora.",
    "chatbot-instagram": "Responde mensagens diretas com informações sobre horário, serviços e dúvidas básicas.",
    "central-mensagens": "Reúne WhatsApp, Instagram, Facebook e e-mail em um único painel de atendimento.",
    "bot-comentarios": "Responde automaticamente comentários no Instagram/Facebook com base em palavras-chave.",
    "assistente-suporte": "Guia o usuário para resolver problemas técnicos comuns antes de acionar o suporte humano.",
    "captura-leads": "Coleta dados de visitantes via formulário ou chatbot e envia para uma base de contatos.",
    "funil-vendas": "Alimenta o cliente com conteúdo até a compra com mensagens automáticas.",
    "crm-basico": "Organiza clientes em etapas e envia lembretes ou mensagens automáticas.",
    "bot-orcamentos": "Recebe pedidos ou orçamentos por WhatsApp e responde com valores e confirmações.",
    "promocoes-cupons": "Envia cupons e promoções por mensagens com base em comportamento ou datas.",
    "solicitacao-avaliacoes": "Envia mensagens pedindo avaliação pública após uma boa experiência.",
    aniversario: "Envia felicitações no aniversário do cliente com ou sem bônus promocional.",
    "chatbot-boasvindas": "Envia mensagem automática de agradecimento ou instruções após a compra.",
    "agendamento-online": "Cliente escolhe data e hora disponíveis sem necessidade de interação humana.",
    "agendamento-chatbot": "Bot conversa com o cliente para agendar horário disponível e confirmar.",
    "assistente-reservas": "Automatiza reservas com controle de disponibilidade em tempo real.",
    "feedback-aberto": "Usa IA para interpretar opiniões abertas e extrair sentimentos e ideias.",
    "conteudo-ia": "Gera textos para posts, e-mails ou anúncios com base no tema ou produto.",
    "email-marketing": "Envia campanhas automáticas como boas-vindas e promoções em datas especiais.",
    "agendamento-postagens": "Agenda publicações com texto e imagem para várias redes.",
    "pedidos-whatsapp":
      "Permite que o cliente visualize um cardápio interativo, faça o pedido e receba confirmação automática via WhatsApp.",
    "solicitacao-avaliacoes-feedback": "Envia mensagens pedindo avaliação pública após uma boa experiência.",
    "captura-leads-marketing":
      "Coleta dados de visitantes via formulário ou chatbot e envia para uma base de contatos.",
  }

  // Categorias das soluções
  const categoriasSolucoes = {
    "chat-rapido": "atendimento",
    "atendimento-menu": "atendimento",
    "autoatendimento-ia": "atendimento",
    "atendente-whatsapp": "atendimento",
    "chatbot-instagram": "atendimento",
    "central-mensagens": "atendimento",
    "bot-comentarios": "atendimento",
    "assistente-suporte": "atendimento",
    "recuperar-cliente": "vendas",
    "promocao-rapida": "vendas",
    "pos-orcamento": "vendas",
    "captura-leads": "vendas",
    "funil-vendas": "vendas",
    "crm-basico": "vendas",
    "bot-orcamentos": "vendas",
    "promocoes-cupons": "vendas",
    "solicitacao-avaliacoes": "vendas",
    "pedidos-whatsapp": "vendas",
    "boas-vindas": "relacionamento",
    "pos-venda-ia": "relacionamento",
    reengajamento: "relacionamento",
    aniversario: "relacionamento",
    "chatbot-boasvindas": "relacionamento",
    "agendamento-rapido": "agendamento",
    "confirmacao-consulta": "agendamento",
    reagendamento: "agendamento",
    "agendamento-online": "agendamento",
    "agendamento-chatbot": "agendamento",
    "assistente-reservas": "agendamento",
    "pesquisa-satisfacao": "feedback",
    "feedback-ia": "feedback",
    "coleta-opiniao": "feedback",
    "feedback-aberto": "feedback",
    "solicitacao-avaliacoes-feedback": "feedback",
    "sequencia-conteudo": "marketing",
    "texto-divulgacao": "marketing",
    "campanha-sazonal": "marketing",
    "conteudo-ia": "marketing",
    "email-marketing": "marketing",
    "captura-leads-marketing": "marketing",
    "sugestao-post": "redes-sociais",
    "resposta-comentarios": "redes-sociais",
    "agendamento-post": "redes-sociais",
    "agendamento-postagens": "redes-sociais",
    "lembrete-diario": "administracao",
    "checklist-tarefas": "administracao",
    "notificacoes-internas": "administracao",
  }

  // Dados fictícios para a solução
  const solucoesDados = {
    "autoatendimento-ia": {
      id: "autoatendimento-ia",
      nome: "Autoatendimento com IA",
      descricao: "Cliente interage com um fluxo que entende a intenção e responde sozinho.",
      categoria: "atendimento",
      status: "ativo",
      ativacoes: 2341,
      estatisticas: {
        interacoes: 487,
        tempoEconomizado: "12h",
        taxaResolucao: "78%",
      },
      configuracoes: {
        mensagemBoasVindas: "Olá! Sou o assistente virtual da [Nome da Empresa]. Como posso ajudar hoje?",
        horasFuncionamento: "24/7",
        transferirHumano: true,
        respostasPersonalizadas: [
          { pergunta: "Qual o horário de funcionamento?", resposta: "Funcionamos de segunda a sexta, das 9h às 18h." },
          {
            pergunta: "Como faço para cancelar um pedido?",
            resposta: "Para cancelar um pedido, acesse sua conta e vá em 'Meus Pedidos'.",
          },
        ],
      },
    },
    "recuperar-cliente": {
      id: "recuperar-cliente",
      nome: "Recuperar Cliente Inativo",
      descricao: "Reativa contatos que pararam de responder com mensagem personalizada.",
      categoria: "vendas",
      status: "ativo",
      ativacoes: 1543,
      estatisticas: {
        clientesAlcancados: 156,
        taxaReativacao: "23%",
        roiEstimado: "R$ 4.850",
      },
      configuracoes: {
        diasInatividade: 30,
        mensagemPadrao: "Olá [Nome], sentimos sua falta! Que tal voltar com um desconto especial de 15%?",
        ofertaEspecial: true,
        percentualDesconto: 15,
      },
    },
  }

  useEffect(() => {
    // Simular busca da solução pelo ID
    let ignore = false

    async function loadSolution() {
    const id = solutionId
    if (!id) return

    const solucoesPorId = solucoesDados as Record<string, SolucaoDetalhes>
    const categoriasPorId = categoriasSolucoes as Record<string, string>
    const descricoesPorId = descricoesSolucoes as Record<string, string>

    if (isNumericSolutionId) {
      try {
        const response = await fetch(`/api/solutions/${id}`, { cache: "no-store" })
        if (response.ok) {
          const data = (await response.json()) as ApiSolution
          const solucaoEncontrada: SolucaoDetalhes = {
            id: String(data.id),
            nome: data.name,
            descricao: data.description || "Descrição da solução",
            categoria: data.category || "atendimento",
            status: data.is_active ? "ativo" : "inativo",
            ativacoes: data.activations || 0,
            estatisticas: {
              interacoes: data.activations || 0,
              tempoEconomizado: "0h",
              taxaResolucao: "0%",
            },
            configuracoes: {
              mensagemPadrao: "Configure esta solução para personalizar a experiência do cliente.",
              horasFuncionamento: "Horário comercial",
              notificacoes: true,
            },
          }

          if (!ignore) {
            setSolucao(solucaoEncontrada)
            setIsActive(solucaoEncontrada.status === "ativo")
          }
          return
        }
      } catch (error) {
        console.error("Erro ao carregar solução da API:", error)
      }
    }

    if (id in solucoesPorId) {
      const solucaoEncontrada = solucoesPorId[id]
      if (!ignore) {
        setSolucao(solucaoEncontrada)
        setIsActive(solucaoEncontrada.status === "ativo")
      }
    } else {
      // Solução genérica para IDs não encontrados nos dados fictícios
      const categoria = categoriasPorId[id] || "atendimento"
      const descricao = descricoesPorId[id] || "Descrição da solução"

      const solucaoGenerica: SolucaoDetalhes = {
        id,
        nome: id
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
        descricao,
        categoria,
        status: "inativo",
        ativacoes: Math.floor(Math.random() * 1000) + 100,
        estatisticas: {
          interacoes: Math.floor(Math.random() * 500) + 50,
          tempoEconomizado: Math.floor(Math.random() * 10) + 2 + "h",
          taxaResolucao: Math.floor(Math.random() * 30) + 60 + "%",
        },
        configuracoes: {
          mensagemPadrao: "Olá [Nome], esta é uma mensagem padrão que pode ser personalizada.",
          horasFuncionamento: "Horário comercial",
          notificacoes: true,
        },
      }

      if (!ignore) {
        setSolucao(solucaoGenerica)
        setIsActive(solucaoGenerica.status === "ativo")
      }
    }
    }

    loadSolution()

    return () => {
      ignore = true
    }
  }, [solutionId, isNumericSolutionId])

  if (!solucao) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
        <div
          className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? "md:ml-[70px]" : "md:ml-64"}`}
        >
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-semibold">Carregando solução...</h2>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const categoriasIcones = iconesPorCategoria as Record<string, CategoriaInfo>
  const iconesSolucoes = iconesPorId as Record<string, LucideIcon>
  const categoriaInfo = categoriasIcones[solucao.categoria] || categoriasIcones.atendimento
  const SolucaoIcone = iconesSolucoes[solucao.id] || categoriaInfo.icon

  const handleToggleActive = () => {
    setIsActive(!isActive)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      <div
        className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${sidebarCollapsed ? "md:ml-[70px]" : "md:ml-64"}`}
      >
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="md:flex md:items-center md:justify-between">
            <div>
              <Button variant="ghost" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <h1 className="font-semibold text-2xl mt-2">{solucao.nome}</h1>
            </div>
            <div className="mt-4 md:mt-0">
              <Button onClick={handleToggleActive} variant={isActive ? "destructive" : "default"}>
                {isActive ? "Desativar" : "Ativar"}
              </Button>
            </div>
          </div>

          <Tabs defaultValue="detalhes" className="mt-4">
            <TabsList>
              <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
              <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
              <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
            </TabsList>
            <TabsContent value="detalhes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Solução</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <SolucaoIcone className={`h-4 w-4 ${categoriaInfo.cor}`} />
                      <Badge className={categoriaInfo.cor}>{categoriaInfo.label}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{solucao.descricao}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="configuracoes">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="notificacoes" defaultChecked={solucao.configuracoes.notificacoes} />
                      <Label htmlFor="notificacoes">Notificações</Label>
                    </div>
                    <div>
                      <Label htmlFor="mensagemPadrao">Mensagem Padrão</Label>
                      <Textarea
                        id="mensagemPadrao"
                        defaultValue={solucao.configuracoes.mensagemPadrao}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="horasFuncionamento">Horas de Funcionamento</Label>
                      <Input id="horasFuncionamento" defaultValue={solucao.configuracoes.horasFuncionamento} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="estatisticas">
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <p className="text-sm font-medium">Interações</p>
                      <p className="text-lg">{solucao.estatisticas.interacoes}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Tempo Economizado</p>
                      <p className="text-lg">{solucao.estatisticas.tempoEconomizado}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Taxa de Resolução</p>
                      <p className="text-lg">{solucao.estatisticas.taxaResolucao}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
