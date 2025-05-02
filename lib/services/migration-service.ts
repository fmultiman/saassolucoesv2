import { createServiceRoleClient } from "@/lib/supabase/service-role"
import fs from "fs/promises"
import path from "path"
import { createAdminClient } from "@/lib/supabase/admin"

// Diretório onde estão armazenados os arquivos de migração
const MIGRATIONS_DIR = path.join(process.cwd(), "migrations")

// Interface para o histórico de migrações
export interface MigrationRecord {
  id: string
  filename: string
  executed_at: string
  executed_by: string
  status: "success" | "error"
  execution_time: number
  error_message?: string
}

export type MigrationFile = {
  name: string
  path: string
  content: string
  size: number
  createdAt: Date
}

// Listar todos os arquivos de migração disponíveis
export async function listMigrationFiles(): Promise<string[]> {
  try {
    const files = await fs.readdir(MIGRATIONS_DIR)
    return files.filter((file) => file.endsWith(".sql"))
  } catch (error) {
    console.error("Erro ao listar arquivos de migração:", error)
    return []
  }
}

// Ler o conteúdo de um arquivo de migração
export async function readMigrationFile(filename: string): Promise<string> {
  try {
    const filePath = path.join(MIGRATIONS_DIR, filename)
    return await fs.readFile(filePath, "utf-8")
  } catch (error) {
    console.error(`Erro ao ler arquivo de migração ${filename}:`, error)
    throw new Error(`Não foi possível ler o arquivo de migração: ${filename}`)
  }
}

// Obter o histórico de migrações executadas
export async function getExecutedMigrations(): Promise<MigrationRecord[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase.from("migrations").select("*").order("executed_at", { ascending: false })

  if (error) {
    console.error("Erro ao obter histórico de migrações:", error)
    return []
  }

  return data || []
}

// Executar uma migração
export async function executeMigration(
  filename: string,
  userId: string,
): Promise<{ success: boolean; message: string }> {
  const supabase = createAdminClient()
  const startTime = Date.now()

  try {
    // Verificar se a migração já foi executada com sucesso
    const { data: existingMigration } = await supabase
      .from("migrations")
      .select("*")
      .eq("filename", filename)
      .eq("status", "success")
      .maybeSingle()

    if (existingMigration) {
      return {
        success: false,
        message: `A migração ${filename} já foi executada com sucesso anteriormente.`,
      }
    }

    // Ler o conteúdo do arquivo SQL
    const sqlContent = await readMigrationFile(filename)

    // Executar o SQL usando a função personalizada
    const { data, error } = await supabase.rpc("execute_sql", {
      sql_query: sqlContent,
    })

    const executionTime = Date.now() - startTime

    if (error) {
      // Registrar falha na execução
      await supabase.from("migrations").insert({
        filename,
        executed_by: userId,
        status: "error",
        execution_time: executionTime,
        error_message: error.message,
      })

      return {
        success: false,
        message: `Erro ao executar migração: ${error.message}`,
      }
    }

    // Recarregar o cache de esquema do Supabase
    await supabase.rpc("reload_schema_cache")

    // Registrar execução bem-sucedida
    await supabase.from("migrations").insert({
      filename,
      executed_by: userId,
      status: "success",
      execution_time: executionTime,
    })

    return {
      success: true,
      message: `Migração ${filename} executada com sucesso em ${executionTime}ms`,
    }
  } catch (error: any) {
    const executionTime = Date.now() - startTime

    // Registrar erro inesperado
    await supabase.from("migrations").insert({
      filename,
      executed_by: userId,
      status: "error",
      execution_time: executionTime,
      error_message: error.message || "Erro desconhecido",
    })

    return {
      success: false,
      message: `Erro inesperado ao executar migração: ${error.message || "Erro desconhecido"}`,
    }
  }
}

// Lista de soluções do catálogo antigo
const solucoes = [
  {
    id: "autoatendimento-ia",
    nome: "Autoatendimento com IA",
    descricao: "Cliente interage com um fluxo que entende a intenção e responde sozinho.",
    categoria: "atendimento",
    icone: "Bot",
    cor: "bg-blue-500/10 text-blue-500",
    status: "ativo",
    bloqueado: false,
  },
  {
    id: "recuperar-cliente",
    nome: "Recuperar Cliente Inativo",
    descricao: "Reativa contatos que pararam de responder com mensagem personalizada.",
    categoria: "vendas",
    icone: "Users",
    cor: "bg-green-500/10 text-green-500",
    status: "ativo",
    bloqueado: false,
  },
  {
    id: "agendamento-rapido",
    nome: "Agendamento Rápido",
    descricao: "Permite que o cliente marque um horário via mensagem automática.",
    categoria: "agendamento",
    icone: "Calendar",
    cor: "bg-purple-500/10 text-purple-500",
    status: "inativo",
    bloqueado: false,
  },
  {
    id: "pesquisa-satisfacao",
    nome: "Pesquisa de Satisfação",
    descricao: "Coleta avaliação de atendimento ou serviço com emojis ou notas.",
    categoria: "feedback",
    icone: "ThumbsUp",
    cor: "bg-orange-500/10 text-orange-500",
    status: "inativo",
    bloqueado: false,
  },
  {
    id: "email-marketing",
    nome: "E-mail Marketing Automatizado",
    descricao: "Envia campanhas automáticas como boas-vindas e promoções em datas especiais.",
    categoria: "vendas",
    icone: "Mail",
    cor: "bg-red-500/10 text-red-500",
    status: "inativo",
    bloqueado: true,
    plano: "Premium",
  },
  {
    id: "funil-vendas",
    nome: "Funil de Vendas Automatizado",
    descricao: "Alimenta o cliente com conteúdo até a compra com mensagens automáticas.",
    categoria: "vendas",
    icone: "PieChart",
    cor: "bg-cyan-500/10 text-cyan-500",
    status: "inativo",
    bloqueado: true,
    plano: "Enterprise",
  },
  {
    id: "bot-comentarios",
    nome: "Bot para Interações em Comentários",
    descricao: "Responde automaticamente comentários no Instagram/Facebook com base em palavras-chave.",
    categoria: "atendimento",
    icone: "Zap",
    cor: "bg-yellow-500/10 text-yellow-500",
    status: "recomendado",
    bloqueado: false,
  },
  {
    id: "confirmacao-consulta",
    nome: "Confirmação de Consulta",
    descricao: "Lembra o cliente da consulta com botão para confirmar ou reagendar.",
    categoria: "agendamento",
    icone: "Clock",
    cor: "bg-indigo-500/10 text-indigo-500",
    status: "recomendado",
    bloqueado: false,
  },
  {
    id: "resposta-automatica",
    nome: "Resposta Automática Inteligente",
    descricao: "Responde perguntas frequentes com base em um banco de conhecimento personalizado.",
    categoria: "atendimento",
    icone: "MessageSquare",
    cor: "bg-blue-500/10 text-blue-500",
    status: "inativo",
    bloqueado: false,
  },
  {
    id: "qualificacao-leads",
    nome: "Qualificação de Leads",
    descricao: "Identifica e classifica potenciais clientes com base em critérios personalizados.",
    categoria: "vendas",
    icone: "Filter",
    cor: "bg-green-500/10 text-green-500",
    status: "inativo",
    bloqueado: false,
  },
  {
    id: "lembretes-aniversario",
    nome: "Lembretes de Aniversário",
    descricao: "Envia mensagens automáticas de felicitações em datas especiais dos clientes.",
    categoria: "relacionamento",
    icone: "Gift",
    cor: "bg-pink-500/10 text-pink-500",
    status: "inativo",
    bloqueado: false,
  },
  {
    id: "notificacoes-estoque",
    nome: "Notificações de Estoque",
    descricao: "Avisa clientes quando produtos desejados voltam ao estoque.",
    categoria: "vendas",
    icone: "Package",
    cor: "bg-amber-500/10 text-amber-500",
    status: "inativo",
    bloqueado: true,
    plano: "Premium",
  },
  {
    id: "campanhas-sazonais",
    nome: "Campanhas Sazonais",
    descricao: "Cria e gerencia campanhas automáticas para datas comemorativas.",
    categoria: "marketing",
    icone: "Calendar",
    cor: "bg-red-500/10 text-red-500",
    status: "inativo",
    bloqueado: true,
    plano: "Premium",
  },
  {
    id: "reengajamento-clientes",
    nome: "Reengajamento de Clientes",
    descricao: "Recupera clientes inativos com ofertas personalizadas baseadas em histórico.",
    categoria: "relacionamento",
    icone: "RefreshCw",
    cor: "bg-violet-500/10 text-violet-500",
    status: "inativo",
    bloqueado: false,
  },
  {
    id: "analise-sentimento",
    nome: "Análise de Sentimento",
    descricao: "Monitora e analisa o sentimento das interações com clientes.",
    categoria: "feedback",
    icone: "BarChart2",
    cor: "bg-orange-500/10 text-orange-500",
    status: "inativo",
    bloqueado: true,
    plano: "Enterprise",
  },
  {
    id: "segmentacao-clientes",
    nome: "Segmentação de Clientes",
    descricao: "Agrupa clientes com base em comportamento, histórico e preferências.",
    categoria: "marketing",
    icone: "Users",
    cor: "bg-emerald-500/10 text-emerald-500",
    status: "inativo",
    bloqueado: true,
    plano: "Premium",
  },
  {
    id: "chatbot-whatsapp",
    nome: "Chatbot para WhatsApp",
    descricao: "Automatiza conversas no WhatsApp com respostas inteligentes.",
    categoria: "atendimento",
    icone: "MessageCircle",
    cor: "bg-green-500/10 text-green-500",
    status: "inativo",
    bloqueado: false,
  },
  {
    id: "pesquisa-nps",
    nome: "Pesquisa NPS",
    descricao: "Coleta e analisa o Net Promoter Score dos seus clientes.",
    categoria: "feedback",
    icone: "Star",
    cor: "bg-yellow-500/10 text-yellow-500",
    status: "inativo",
    bloqueado: false,
  },
  {
    id: "cupons-personalizados",
    nome: "Cupons Personalizados",
    descricao: "Gera e envia cupons de desconto baseados no perfil do cliente.",
    categoria: "vendas",
    icone: "Tag",
    cor: "bg-blue-500/10 text-blue-500",
    status: "inativo",
    bloqueado: true,
    plano: "Premium",
  },
  {
    id: "onboarding-clientes",
    nome: "Onboarding de Clientes",
    descricao: "Guia novos clientes com mensagens sequenciais educativas.",
    categoria: "relacionamento",
    icone: "UserPlus",
    cor: "bg-indigo-500/10 text-indigo-500",
    status: "inativo",
    bloqueado: false,
  },
  {
    id: "notificacoes-eventos",
    nome: "Notificações de Eventos",
    descricao: "Envia lembretes automáticos sobre eventos, webinars e lançamentos.",
    categoria: "marketing",
    icone: "Bell",
    cor: "bg-purple-500/10 text-purple-500",
    status: "inativo",
    bloqueado: false,
  },
  {
    id: "recuperacao-carrinho",
    nome: "Recuperação de Carrinho",
    descricao: "Resgata vendas perdidas com lembretes de carrinho abandonado.",
    categoria: "vendas",
    icone: "ShoppingCart",
    cor: "bg-red-500/10 text-red-500",
    status: "inativo",
    bloqueado: true,
    plano: "Premium",
  },
  {
    id: "cross-selling",
    nome: "Cross-Selling Automático",
    descricao: "Sugere produtos complementares com base nas compras anteriores.",
    categoria: "vendas",
    icone: "GitBranch",
    cor: "bg-cyan-500/10 text-cyan-500",
    status: "inativo",
    bloqueado: true,
    plano: "Enterprise",
  },
  {
    id: "up-selling",
    nome: "Up-Selling Inteligente",
    descricao: "Oferece versões premium de produtos com base no interesse do cliente.",
    categoria: "vendas",
    icone: "TrendingUp",
    cor: "bg-emerald-500/10 text-emerald-500",
    status: "inativo",
    bloqueado: true,
    plano: "Enterprise",
  },
  {
    id: "fidelizacao-clientes",
    nome: "Programa de Fidelização",
    descricao: "Gerencia pontos, recompensas e níveis de fidelidade automaticamente.",
    categoria: "relacionamento",
    icone: "Award",
    cor: "bg-amber-500/10 text-amber-500",
    status: "inativo",
    bloqueado: true,
    plano: "Premium",
  },
  {
    id: "recomendacao-produtos",
    nome: "Recomendação de Produtos",
    descricao: "Sugere produtos personalizados com base no histórico e preferências.",
    categoria: "vendas",
    icone: "Gift",
    cor: "bg-pink-500/10 text-pink-500",
    status: "inativo",
    bloqueado: true,
    plano: "Premium",
  },
  {
    id: "monitoramento-redes",
    nome: "Monitoramento de Redes Sociais",
    descricao: "Acompanha e responde menções da sua marca nas redes sociais.",
    categoria: "redes-sociais",
    icone: "Activity",
    cor: "bg-blue-500/10 text-blue-500",
    status: "inativo",
    bloqueado: true,
    plano: "Enterprise",
  },
  {
    id: "publicacao-automatica",
    nome: "Publicação Automática",
    descricao: "Programa e publica conteúdo nas redes sociais automaticamente.",
    categoria: "redes-sociais",
    icone: "Clock",
    cor: "bg-indigo-500/10 text-indigo-500",
    status: "inativo",
    bloqueado: true,
    plano: "Premium",
  },
  {
    id: "gerenciamento-comentarios",
    nome: "Gerenciamento de Comentários",
    descricao: "Monitora e responde comentários nas redes sociais automaticamente.",
    categoria: "redes-sociais",
    icone: "MessageCircle",
    cor: "bg-purple-500/10 text-purple-500",
    status: "inativo",
    bloqueado: true,
    plano: "Premium",
  },
  {
    id: "analise-concorrentes",
    nome: "Análise de Concorrentes",
    descricao: "Monitora e compara sua presença digital com a dos concorrentes.",
    categoria: "marketing",
    icone: "TrendingUp",
    cor: "bg-red-500/10 text-red-500",
    status: "inativo",
    bloqueado: true,
    plano: "Enterprise",
  },
  {
    id: "geracao-leads",
    nome: "Geração de Leads",
    descricao: "Captura e qualifica leads através de formulários e chatbots.",
    categoria: "vendas",
    icone: "UserPlus",
    cor: "bg-green-500/10 text-green-500",
    status: "inativo",
    bloqueado: false,
  },
  {
    id: "automacao-email",
    nome: "Automação de E-mail",
    descricao: "Cria fluxos de e-mails automáticos baseados em gatilhos.",
    categoria: "marketing",
    icone: "Mail",
    cor: "bg-amber-500/10 text-amber-500",
    status: "inativo",
    bloqueado: true,
    plano: "Premium",
  },
  {
    id: "pesquisa-mercado",
    nome: "Pesquisa de Mercado",
    descricao: "Coleta e analisa dados de mercado para insights estratégicos.",
    categoria: "marketing",
    icone: "Search",
    cor: "bg-violet-500/10 text-violet-500",
    status: "inativo",
    bloqueado: true,
    plano: "Enterprise",
  },
  {
    id: "gestao-projetos",
    nome: "Gestão de Projetos",
    descricao: "Automatiza tarefas e fluxos de trabalho em projetos.",
    categoria: "administracao",
    icone: "Clipboard",
    cor: "bg-slate-500/10 text-slate-500",
    status: "inativo",
    bloqueado: true,
    plano: "Premium",
  },
  {
    id: "automacao-financeira",
    nome: "Automação Financeira",
    descricao: "Automatiza cobranças, faturas e lembretes de pagamento.",
    categoria: "administracao",
    icone: "DollarSign",
    cor: "bg-emerald-500/10 text-emerald-500",
    status: "inativo",
    bloqueado: true,
    plano: "Enterprise",
  },
  {
    id: "gestao-estoque",
    nome: "Gestão de Estoque",
    descricao: "Monitora e alerta sobre níveis de estoque automaticamente.",
    categoria: "administracao",
    icone: "Package",
    cor: "bg-orange-500/10 text-orange-500",
    status: "inativo",
    bloqueado: true,
    plano: "Premium",
  },
  {
    id: "analise-vendas",
    nome: "Análise de Vendas",
    descricao: "Gera relatórios e insights automáticos sobre desempenho de vendas.",
    categoria: "vendas",
    icone: "BarChart",
    cor: "bg-blue-500/10 text-blue-500",
    status: "inativo",
    bloqueado: true,
    plano: "Premium",
  },
  {
    id: "automacao-rh",
    nome: "Automação de RH",
    descricao: "Automatiza processos de recrutamento, onboarding e gestão de equipe.",
    categoria: "administracao",
    icone: "Users",
    cor: "bg-pink-500/10 text-pink-500",
    status: "inativo",
    bloqueado: true,
    plano: "Enterprise",
  },
  {
    id: "gestao-leads",
    nome: "Gestão de Leads",
    descricao: "Organiza e prioriza leads com base em critérios personalizados.",
    categoria: "vendas",
    icone: "List",
    cor: "bg-indigo-500/10 text-indigo-500",
    status: "inativo",
    bloqueado: false,
  },
  {
    id: "automacao-suporte",
    nome: "Automação de Suporte",
    descricao: "Classifica e encaminha tickets de suporte automaticamente.",
    categoria: "atendimento",
    icone: "LifeBuoy",
    cor: "bg-cyan-500/10 text-cyan-500",
    status: "inativo",
    bloqueado: false,
  },
  {
    id: "chatbot-site",
    nome: "Chatbot para Site",
    descricao: "Implementa um assistente virtual inteligente no seu site.",
    categoria: "atendimento",
    icone: "MessageSquare",
    cor: "bg-green-500/10 text-green-500",
    status: "inativo",
    bloqueado: false,
  },
  {
    id: "automacao-documentos",
    nome: "Automação de Documentos",
    descricao: "Gera e envia documentos personalizados automaticamente.",
    categoria: "administracao",
    icone: "FileText",
    cor: "bg-amber-500/10 text-amber-500",
    status: "inativo",
    bloqueado: true,
    plano: "Premium",
  },
  {
    id: "integracao-crm",
    nome: "Integração com CRM",
    descricao: "Sincroniza dados entre plataformas de comunicação e seu CRM.",
    categoria: "administracao",
    icone: "RefreshCw",
    cor: "bg-violet-500/10 text-violet-500",
    status: "inativo",
    bloqueado: true,
    plano: "Enterprise",
  },
  {
    id: "analise-atendimento",
    nome: "Análise de Atendimento",
    descricao: "Monitora e avalia a qualidade dos atendimentos automaticamente.",
    categoria: "atendimento",
    icone: "PieChart",
    cor: "bg-red-500/10 text-red-500",
    status: "inativo",
    bloqueado: true,
    plano: "Premium",
  },
  {
    id: "automacao-marketing",
    nome: "Automação de Marketing",
    descricao: "Cria e gerencia campanhas de marketing multicanal.",
    categoria: "marketing",
    icone: "Zap",
    cor: "bg-emerald-500/10 text-emerald-500",
    status: "inativo",
    bloqueado: true,
    plano: "Premium",
  },
  {
    id: "gestao-reputacao",
    nome: "Gestão de Reputação",
    descricao: "Monitora e gerencia avaliações online da sua empresa.",
    categoria: "marketing",
    icone: "Star",
    cor: "bg-yellow-500/10 text-yellow-500",
    status: "inativo",
    bloqueado: true,
    plano: "Premium",
  },
]

export async function migrateSolutions() {
  try {
    const supabase = createServiceRoleClient()
    let successCount = 0
    let errorCount = 0
    const errors = []

    console.log("Iniciando migração de soluções...")

    // Primeiro, vamos verificar se a tabela solutions existe
    const { data: tableExists, error: tableError } = await supabase.from("solutions").select("id").limit(1)

    if (tableError) {
      console.error("Erro ao verificar tabela solutions:", tableError)
      return {
        success: false,
        message: `Erro ao verificar tabela solutions: ${tableError.message}`,
      }
    }

    console.log("Tabela solutions verificada:", tableExists ? "Existe" : "Não existe")

    // Abordagem alternativa: usar SQL direto para inserir os dados
    try {
      for (const solucao of solucoes) {
        // Inserir cada solução individualmente para melhor diagnóstico
        const { error: insertError } = await supabase.rpc("execute_sql", {
          sql: `
            INSERT INTO public.solutions (
              slug, name, description, category, icon, color, 
              is_active, is_recommended, is_premium, premium_plan, 
              created_at, updated_at
            ) VALUES (
              '${solucao.id}', 
              '${solucao.nome.replace(/'/g, "''")}', 
              '${solucao.descricao.replace(/'/g, "''")}', 
              '${solucao.categoria.replace(/'/g, "''")}', 
              '${solucao.icone.replace(/'/g, "''")}', 
              '${solucao.cor.replace(/'/g, "''")}', 
              ${solucao.status === "ativo" || solucao.status === "recomendado"}, 
              ${solucao.status === "recomendado"}, 
              ${solucao.bloqueado || false}, 
              ${solucao.plano ? `'${solucao.plano.replace(/'/g, "''")}'` : "NULL"}, 
              NOW(), 
              NOW()
            )
            ON CONFLICT (slug) DO UPDATE SET
              name = EXCLUDED.name,
              description = EXCLUDED.description,
              category = EXCLUDED.category,
              icon = EXCLUDED.icon,
              color = EXCLUDED.color,
              is_active = EXCLUDED.is_active,
              is_recommended = EXCLUDED.is_recommended,
              premium_plan = EXCLUDED.premium_plan,
              updated_at = EXCLUDED.updated_at
          `,
        })

        if (insertError) {
          console.error(`Erro ao inserir solução ${solucao.id}:`, insertError)
          errorCount++
          errors.push(`Erro ao inserir ${solucao.id}: ${insertError.message}`)
        } else {
          successCount++
          console.log(`Solução ${solucao.id} inserida com sucesso`)
        }
      }
    } catch (sqlError) {
      console.error("Erro ao executar SQL:", sqlError)
      return {
        success: false,
        message: `Erro ao executar SQL: ${sqlError instanceof Error ? sqlError.message : String(sqlError)}`,
      }
    }

    return {
      success: true,
      message: `Migração concluída: ${successCount} soluções migradas com sucesso, ${errorCount} erros.`,
      errors: errors.length > 0 ? errors : undefined,
    }
  } catch (error) {
    console.error("Erro durante a migração:", error)
    return {
      success: false,
      message: "Erro durante a migração de soluções.",
      error: error instanceof Error ? error.message : String(error),
    }
  }
}
