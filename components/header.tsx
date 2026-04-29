"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Search, User } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabase/client"
import { useState } from "react"

export function Header() {
  const pathname = usePathname()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    try {
      console.log("Iniciando processo de logout")

      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Erro ao fazer logout:", error)
        throw error
      }

      console.log("Logout bem-sucedido")
      window.location.href = "/"
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      window.location.href = "/"
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="rounded-md bg-primary/10 p-1">
            <div className="h-6 w-6 text-primary" />
          </div>
          <span className="text-xl font-semibold tracking-tight">SaaS Soluções</span>
        </Link>
      </div>
      <div className="flex flex-1 items-center gap-4 md:gap-6">
        <form className="hidden flex-1 md:flex">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Pesquisar..."
              className="w-full bg-background pl-8 md:w-[300px] lg:w-[400px]"
            />
          </div>
        </form>
        <nav className="flex-1 md:flex-none">
          <ul className="hidden gap-4 md:flex md:gap-6">
            <li>
              <Link
                href="/dashboard"
                className={`text-sm font-medium ${
                  pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground"
                } transition-colors hover:text-foreground`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/minhas-solucoes"
                className={`text-sm font-medium ${
                  pathname === "/minhas-solucoes" ? "text-foreground" : "text-muted-foreground"
                } transition-colors hover:text-foreground`}
              >
                Minhas Soluções
              </Link>
            </li>
            <li>
              <Link
                href="/proximos-envios"
                className={`text-sm font-medium ${
                  pathname === "/proximos-envios" ? "text-foreground" : "text-muted-foreground"
                } transition-colors hover:text-foreground`}
              >
                Próximos Envios
              </Link>
            </li>
            <li>
              <Link
                href="/interacoes"
                className={`text-sm font-medium ${
                  pathname === "/interacoes" ? "text-foreground" : "text-muted-foreground"
                } transition-colors hover:text-foreground`}
              >
                Interações
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-primary" />
          <span className="sr-only">Notificações</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Minha Conta</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/perfil">Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/assinatura">Assinatura</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/configuracoes">Configurações</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? "Saindo..." : "Sair"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
