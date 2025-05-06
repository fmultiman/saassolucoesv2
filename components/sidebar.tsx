"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CuboidIcon as Cube,
  BarChart2,
  CreditCard,
  User,
  HelpCircle,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ShoppingBag,
  LogOut,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { supabase } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

export function Sidebar({ className, collapsed = false, onCollapsedChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    setIsCollapsed(collapsed)
  }, [collapsed])

  const toggleCollapsed = () => {
    const newCollapsed = !isCollapsed
    setIsCollapsed(newCollapsed)
    onCollapsedChange?.(newCollapsed)
  }

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
      href: "/dashboard",
    },
    {
      title: "Soluções Inteligentes",
      icon: Cube,
      href: "/solucoes",
    },
    {
      title: "Marketplace",
      icon: ShoppingBag,
      href: "/marketplace",
    },
    {
      title: "Desempenho e Métricas",
      icon: BarChart2,
      href: "/metricas",
    },
    {
      title: "Minha Assinatura",
      icon: CreditCard,
      href: "/assinatura",
    },
    // Removido: Minha Conta
    // {
    //   title: "Minha Conta",
    //   icon: User,
    //   href: "/conta",
    // },
    {
      title: "Ajuda",
      icon: HelpCircle,
      href: "/ajuda",
    },
  ]

  // Função para verificar se um item está ativo
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
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
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-card border-r border-border transition-all duration-300 ease-in-out md:translate-x-0",
          isCollapsed ? "w-[70px]" : "w-64",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className,
        )}
      >
        <div
          className={cn("flex h-16 items-center border-b border-border", isCollapsed ? "px-2 justify-center" : "px-6")}
        >
          {!isCollapsed ? (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="rounded-md bg-primary/10 p-1">
                <Cube className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-semibold tracking-tight">SaaS Soluções</span>
            </Link>
          ) : (
            <Link href="/dashboard" className="flex items-center justify-center">
              <div className="rounded-md bg-primary/10 p-1">
                <Cube className="h-6 w-6 text-primary" />
              </div>
            </Link>
          )}
        </div>
        <ScrollArea className="flex-1 py-4">
          <TooltipProvider delayDuration={0}>
            <nav className={cn("grid gap-1", isCollapsed ? "px-1" : "px-2")}>
              {menuItems.map((item, index) => {
                const active = isActive(item.href)

                return isCollapsed ? (
                  <Tooltip key={index} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center justify-center rounded-lg p-2 text-sm transition-colors",
                          active
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent/50 hover:text-accent-foreground",
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
                    key={index}
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
                <p className="text-sm font-medium">Plano Pro</p>
                <p className="text-xs text-muted-foreground">Renovação em 15 dias</p>
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
        {/* Collapse button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-20 hidden h-6 w-6 rounded-full border bg-background md:flex"
          onClick={toggleCollapsed}
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
        <Button onClick={handleLogout} variant="ghost" size="sm" className="absolute bottom-4 left-4">
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
