"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CuboidIcon as Cube,
  LayoutDashboard,
  Users,
  Zap,
  BookOpen,
  FileText,
  CreditCard,
  Receipt,
  Bell,
  Settings,
  Menu,
  X,
  BarChart2,
  ShoppingBag,
  LogOut,
  Loader2,
  FileQuestion,
  Database,
  HardDrive,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    try {
      console.log("Iniciando processo de logout")

      // Fazer logout no Supabase
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Erro ao fazer logout:", error)
        throw error
      }

      console.log("Logout bem-sucedido")

      // Redirecionar para a página inicial
      window.location.href = "/"
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      // Mesmo em caso de erro, vamos redirecionar para a página inicial
      window.location.href = "/"
    } finally {
      setIsLoggingOut(false)
    }
  }

  const menuItems = [
    {
      title: "Visão Geral",
      icon: LayoutDashboard,
      href: "/admin",
    },
    {
      title: "Gerenciar Usuários",
      icon: Users,
      href: "/admin/usuarios",
    },
    {
      title: "Soluções Ativas",
      icon: Zap,
      href: "/admin/solucoes-ativas",
    },
    {
      title: "Catálogo de Soluções",
      icon: BookOpen,
      href: "/admin/catalogo",
    },
    {
      title: "Marketplace",
      icon: ShoppingBag,
      href: "/admin/marketplace",
    },
    {
      title: "Blog",
      icon: FileText,
      href: "/admin/posts",
    },
    {
      title: "Modelos e Templates",
      icon: FileText,
      href: "/admin/modelos",
    },
    {
      title: "Planos e Assinaturas",
      icon: CreditCard,
      href: "/admin/planos",
    },
    {
      title: "Faturamento",
      icon: Receipt,
      href: "/admin/faturamento",
    },
    {
      title: "Notificações",
      icon: Bell,
      href: "/admin/notificacoes",
    },
    {
      title: "Métricas",
      icon: BarChart2,
      href: "/admin/metricas",
    },
    {
      title: "Documentação",
      icon: FileQuestion,
      href: "/admin/documentacao",
    },
    {
      title: "Armazenamento",
      icon: HardDrive,
      href: "/admin/armazenamento",
    },
    {
      title: "Migrações",
      icon: Database,
      href: "/admin/migracoes",
    },
    {
      title: "Configurações Avançadas",
      icon: Settings,
      href: "/admin/configuracoes",
    },
  ]

  // Função para verificar se um item está ativo
  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 md:hidden" onClick={toggleSidebar}>
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-card border-r border-border transition-all duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="rounded-md bg-primary/10 p-1">
              <Cube className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Admin Panel</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
            {menuItems.map((item, index) => {
              const active = isActive(item.href)

              return (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    active ? "bg-accent text-accent-foreground" : "hover:bg-accent/50 hover:text-accent-foreground",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                  {active && <span className="ml-auto h-2 w-2 rounded-full bg-primary" />}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-accent/50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
              <Cube className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Modo Administrador</p>
              <p className="text-xs text-muted-foreground">Acesso completo</p>
            </div>
          </div>
        </div>
        <Button onClick={handleLogout} variant="ghost" size="sm" className="m-4">
          {isLoggingOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Saindo...</span>
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </>
          )}
        </Button>
      </aside>
    </>
  )
}
