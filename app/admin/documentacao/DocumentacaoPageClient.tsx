"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VisaoGeralDocs from "./visao-geral-docs"
import ArquiteturaDocs from "./arquitetura-docs"
import ApiDocs from "./api-docs"
import ComponentsDocs from "./components-docs"
import GuidesDocs from "./guides-docs"
import MigrationsDocs from "./migrations-docs"
import DatabaseDocs from "./database-docs"
import ViewsDocs from "./views-docs"
import ServicesDocs from "./services-docs"
import AuthDocs from "./auth-docs"

export default function DocumentacaoPageClient() {
  const [activeTab, setActiveTab] = useState("visao-geral")

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Documentação Técnica</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 mb-6">
          <TabsTrigger value="visao-geral">Visão Geral</TabsTrigger>
          <TabsTrigger value="arquitetura">Arquitetura</TabsTrigger>
          <TabsTrigger value="database">Banco de Dados</TabsTrigger>
          <TabsTrigger value="views">Views</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="components">Componentes</TabsTrigger>
          <TabsTrigger value="services">Serviços</TabsTrigger>
          <TabsTrigger value="auth">Autenticação</TabsTrigger>
          <TabsTrigger value="guides">Guias</TabsTrigger>
          <TabsTrigger value="migrations">Migrações</TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral">
          <VisaoGeralDocs />
        </TabsContent>

        <TabsContent value="arquitetura">
          <ArquiteturaDocs />
        </TabsContent>

        <TabsContent value="database">
          <DatabaseDocs />
        </TabsContent>

        <TabsContent value="views">
          <ViewsDocs />
        </TabsContent>

        <TabsContent value="api">
          <ApiDocs />
        </TabsContent>

        <TabsContent value="components">
          <ComponentsDocs />
        </TabsContent>

        <TabsContent value="services">
          <ServicesDocs />
        </TabsContent>

        <TabsContent value="auth">
          <AuthDocs />
        </TabsContent>

        <TabsContent value="guides">
          <GuidesDocs />
        </TabsContent>

        <TabsContent value="migrations">
          <MigrationsDocs />
        </TabsContent>
      </Tabs>
    </div>
  )
}
