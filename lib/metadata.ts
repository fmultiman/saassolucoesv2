import type { Metadata } from "next"

// Metadados base para o site
export const siteConfig = {
  name: "SaaS Soluções",
  description: "Plataforma de automação e inteligência artificial para empresas",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://saas.multihuman.com.br",
}

// Função para gerar metadados com valores padrão
export function generateMetadata({
  title,
  description,
  image,
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
}): Metadata {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name
  const metaDescription = description || siteConfig.description
  const metaImage = image || `${siteConfig.url}/og-image.png`

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: siteConfig.url,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      locale: "pt_BR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
    // Removida qualquer configuração de viewport daqui
  }
}
