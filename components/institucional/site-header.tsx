"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CuboidIcon as Cube, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

interface SiteHeaderProps {
  currentPath?: string
}

export function SiteHeader({ currentPath = "/" }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Função para determinar o prefixo correto dos links
  const getLinkPrefix = () => {
    return currentPath === "/" ? "" : "/"
  }

  const handleTestarGratisClick = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (session) {
      router.push("/dashboard")
    } else {
      // Redirecionar para a página de registro com o plano gratuito
      router.push("/signup?plan=gratuito")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-md bg-primary/10 p-1">
              <Cube className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-semibold tracking-tight">SaaS Soluções</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href={`${getLinkPrefix()}#solucoes`}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Soluções
          </Link>
          <Link
            href={`${getLinkPrefix()}#como-funciona`}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Como Funciona
          </Link>
          <Link href={`${getLinkPrefix()}#planos`} className="text-sm font-medium hover:text-primary transition-colors">
            Planos
          </Link>
          <Link href="/expansao" className="text-sm font-medium hover:text-primary transition-colors">
            Recursos Adicionais
          </Link>
          <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors">
            Blog
          </Link>
          <Link href={`${getLinkPrefix()}#faq`} className="text-sm font-medium hover:text-primary transition-colors">
            FAQ
          </Link>
          <Link
            href={`${getLinkPrefix()}#contato`}
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Contato
          </Link>
        </nav>

        <div className="hidden md:block">
          <Button onClick={handleTestarGratisClick}>Testar Grátis</Button>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden container py-4 pb-6 border-b border-border/40">
          <nav className="flex flex-col space-y-4">
            <Link
              href={`${getLinkPrefix()}#solucoes`}
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Soluções
            </Link>
            <Link
              href={`${getLinkPrefix()}#como-funciona`}
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Como Funciona
            </Link>
            <Link
              href={`${getLinkPrefix()}#planos`}
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Planos
            </Link>
            <Link
              href="/expansao"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Recursos Adicionais
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href={`${getLinkPrefix()}#faq`}
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              FAQ
            </Link>
            <Link
              href={`${getLinkPrefix()}#contato`}
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contato
            </Link>
            <Button onClick={handleTestarGratisClick} className="w-full mt-2">
              Testar Grátis
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
