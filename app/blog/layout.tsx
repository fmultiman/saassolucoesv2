import type React from "react"
import { SiteHeader } from "@/components/institucional/site-header"
import { SiteFooter } from "@/components/institucional/site-footer"
import { viewport } from "@/lib/viewport"

export { viewport }

export const metadata = {
  title: "Blog",
  description: "Artigos e novidades sobre automação, inteligência artificial e marketing digital.",
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader currentPath="/blog" />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  )
}
