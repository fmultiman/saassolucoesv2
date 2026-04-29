"use client"

import type React from "react"

import { useEffect, useState } from "react"
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { supabase } from "@/lib/supabase/client"

interface AdminSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

export function AdminSidebar({ className, collapsed = false, onCollapsedChange }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    setIsCollapsed(collapsed)
  }, [collapsed])

  const toggleCollapsed = () => {
    const nextCollapsed = !isCollapsed
    setIsCollapsed(nextCollapsed)
    onCollapsedChange?.(nextCollapsed)
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Erro ao fazer logout:", error)
        throw error
      }

      window.location.href = "/"
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      window.location.href = "/"
    } finally {
      setIsLoggingOut(false)
    }
  }

  const menuItems = [
    { title: "Visão Geral", icon: LayoutDashboard, href: "/admin" },
    { title: "Gerenciar Usuários", icon: Users, href: "/admin/usuarios" },
    { title: "Soluções Ativas", icon: Zap, href: "/admin/solucoes-ativas" },
    { title: "Catálogo de Soluções", icon: BookOpen, href: "/admin/catalogo" },
    { title: "Marketplace", icon: ShoppingBag, href: "/admin/marketplace" },
    { title: "Blog", icon: FileText, href: "/admin/posts" },
    { title: "Modelos e Templates", icon: FileText, href: "/admin/modelos" },
    { title: "Planos e Assinaturas", icon: CreditCard, href: "/admin/planos" },
    { title: "Faturamento", icon: Receipt, href: "/admin/faturamento" },
    { title: "Notificações de Sistema", icon: Bell, href: "/admin/notificacoes" },
    { title: "Mensagens & Notificações", icon: Bell, href: "/admin/mensagens-notificacoes" },
    { title: "Métricas", icon: BarChart2, href: "/admin/metricas" },
    { title: "Documentação", icon: FileQuestion, href: "/admin/documentacao" },
    { title: "Armazenamento", icon: HardDrive, href: "/admin/armazenamento" },
    { title: "Migrações", icon: Database, href: "/admin/migracoes" },
    { title: "Configurações Avançadas", icon: Settings, href: "/admin/configuracoes" },
  ]

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  return (
    <>
      <Button variant="ghost" size="icon" className="fixed left-4 top-4 z-50 md:hidden" onClick={toggleSidebar}>
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-card transition-all duration-300 ease-in-out md:translate-x-0",
          isCollapsed ? "w-[70px]" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className,
        )}
      >
        <div className={cn("flex h-16 items-center border-b border-border", isCollapsed ? "justify-center px-2" : "px-6")}>
          {!isCollapsed ? (
            <Link href="/admin" className="flex items-center gap-2">
              <div className="rounded-md bg-primary/10 p-1">
                <Cube className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-semibold tracking-tight">Admin Panel</span>
            </Link>
          ) : (
            <Link href="/admin" className="flex items-center justify-center">
              <div className="rounded-md bg-primary/10 p-1">
                <Cube className="h-6 w-6 text-primary" />
              </div>
            </Link>
          )}
        </div>

        <ScrollArea className="flex-1 py-4">
          <TooltipProvider delayDuration={0}>
            <nav className={cn("grid gap-1", isCollapsed ? "px-1" : "px-2")}>
              {menuItems.map((item) => {
                const active = isActive(item.href)

                return isCollapsed ? (
                  <Tooltip key={item.href} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center justify-center rounded-lg p-2 text-sm transition-colors",
                          active ? "bg-accent text-accent-foreground" : "hover:bg-accent/50 hover:text-accent-foreground",
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {active && <span className="absolute right-2 h-2 w-2 rounded-full bg-primary" />}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.title}</TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      active ? "bg-accent text-accent-foreground" : "hover:bg-accent/50 hover:text-accent-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                    {active && <span className="ml-auto h-2 w-2 rounded-full bg-primary" />}
                  </Link>
                )
              })}
            </nav>
          </TooltipProvider>
        </ScrollArea>

        <div className={cn("border-t border-border p-4", isCollapsed && "p-2")}>
          {!isCollapsed ? (
            <div className="flex items-center gap-3 rounded-lg bg-accent/50 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
                <Cube className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Modo Administrador</p>
                <p className="text-xs text-muted-foreground">Acesso completo</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
                <Cube className="h-5 w-5 text-primary" />
              </div>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-20 hidden h-6 w-6 rounded-full border bg-background md:flex"
          onClick={toggleCollapsed}
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>

        <Button onClick={handleLogout} variant="ghost" size="sm" className={cn("absolute bottom-4 left-4", isCollapsed && "left-2")}>
          {isLoggingOut ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {!isCollapsed && <span>Saindo...</span>}
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              {!isCollapsed && <span>Sair</span>}
            </>
          )}
        </Button>
      </aside>
    </>
  )
}
