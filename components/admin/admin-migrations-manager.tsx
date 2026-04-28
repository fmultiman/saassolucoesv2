"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertCircle, CheckCircle, Clock, FileText, Play, RefreshCw, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface MigrationFile {
  filename: string
  content?: string
}

interface MigrationRecord {
  id: string
  filename: string
  executed_at: string
  executed_by: string
  status: "success" | "error"
  execution_time: number
  error_message?: string
}

export function AdminMigrationsManager() {
  const [files, setFiles] = useState<MigrationFile[]>([])
  const [executedMigrations, setExecutedMigrations] = useState<MigrationRecord[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [executing, setExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<{ success: boolean; message: string } | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Carregar arquivos de migração e histórico
  useEffect(() => {
    loadMigrations()
  }, [])

  async function loadMigrations() {
    try {
      setRefreshing(true)
      const response = await fetch("/api/admin/migrations")
      if (!response.ok) throw new Error("Falha ao carregar migrações")

      const data = await response.json()

      // Ordenar arquivos por nome (assumindo que começam com números)
      const sortedFiles = data.files
        .map((filename: string) => ({ filename }))
        .sort((a: MigrationFile, b: MigrationFile) => {
          // Extrair o número do início do nome do arquivo (se existir)
          const numA = a.filename.match(/^(\d+)_/) ? Number.parseInt(a.filename.match(/^(\d+)_/)?.[1] || "0") : 0
          const numB = b.filename.match(/^(\d+)_/) ? Number.parseInt(b.filename.match(/^(\d+)_/)?.[1] || "0") : 0

          return numA - numB
        })

      setFiles(sortedFiles)
      setExecutedMigrations(data.executedMigrations)

      // Selecionar o primeiro arquivo se não houver nenhum selecionado
      if (!selectedFile && sortedFiles.length > 0) {
        setSelectedFile(sortedFiles[0].filename)
      }
    } catch (error) {
      console.error("Erro ao carregar migrações:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Carregar conteúdo do arquivo selecionado
  useEffect(() => {
    if (!selectedFile) {
      setFileContent("")
      return
    }

    async function loadFileContent() {
      try {
        const response = await fetch(`/api/admin/migrations/content?filename=${encodeURIComponent(selectedFile || "")}`)
        if (!response.ok) throw new Error("Falha ao carregar conteúdo do arquivo")

        const data = await response.json()
        setFileContent(data.content)
      } catch (error) {
        console.error("Erro ao carregar conteúdo do arquivo:", error)
        setFileContent("Erro ao carregar conteúdo do arquivo")
      }
    }

    loadFileContent()
  }, [selectedFile])

  // Executar migração
  async function executeMigration(filename: string) {
    setExecuting(true)
    setExecutionResult(null)

    try {
      const response = await fetch("/api/admin/migrations/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename }),
      })

      const result = await response.json()
      setExecutionResult(result)

      // Recarregar histórico de migrações
      await loadMigrations()
    } catch (error) {
      console.error("Erro ao executar migração:", error)
      setExecutionResult({
        success: false,
        message: "Erro ao executar migração: falha na comunicação com o servidor",
      })
    } finally {
      setExecuting(false)
    }
  }

  // Verificar se um arquivo já foi executado com sucesso
  function isFileExecuted(filename: string): boolean {
    return executedMigrations.some((migration) => migration.filename === filename && migration.status === "success")
  }

  // Renderizar lista de arquivos
  function renderFilesList() {
    if (loading) {
      return Array(5)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="mb-2">
            <Skeleton className="h-10 w-full" />
          </div>
        ))
    }

    if (files.length === 0) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Nenhum arquivo encontrado</AlertTitle>
          <AlertDescription>Não foram encontrados arquivos de migração na pasta /migrations.</AlertDescription>
        </Alert>
      )
    }

    return files.map((file) => {
      const executed = isFileExecuted(file.filename)

      return (
        <div
          key={file.filename}
          className={`
            flex items-center justify-between p-3 mb-2 rounded-md cursor-pointer
            ${selectedFile === file.filename ? "bg-primary/10" : "hover:bg-muted"}
          `}
          onClick={() => setSelectedFile(file.filename)}
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="font-mono text-sm">{file.filename}</span>
          </div>
          {executed && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Executado
            </Badge>
          )}
        </div>
      )
    })
  }

  // Renderizar histórico de execuções
  function renderExecutionHistory() {
    if (loading) {
      return Array(3)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="mb-4">
            <Skeleton className="h-24 w-full" />
          </div>
        ))
    }

    if (executedMigrations.length === 0) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Nenhuma execução registrada</AlertTitle>
          <AlertDescription>Não há registros de execuções de migrações.</AlertDescription>
        </Alert>
      )
    }

    return executedMigrations.map((migration) => (
      <Card key={migration.id} className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-base font-mono">{migration.filename}</CardTitle>
              <CardDescription>
                <Clock className="h-3 w-3 inline mr-1" />
                {formatDistanceToNow(new Date(migration.executed_at), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </CardDescription>
            </div>
            <Badge
              variant={migration.status === "success" ? "outline" : "destructive"}
              className={migration.status === "success" ? "bg-green-50 text-green-700 border-green-200" : ""}
            >
              {migration.status === "success" ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Sucesso
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Erro
                </>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Tempo de execução:</span> {migration.execution_time}ms
          </div>
          {migration.error_message && (
            <Alert variant="destructive" className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription className="font-mono text-xs">{migration.error_message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    ))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Gerenciador de Migrações</CardTitle>
            <CardDescription>Visualize e execute migrações SQL para manter o banco de dados atualizado</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadMigrations} disabled={refreshing}>
            {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2 hidden sm:inline">Atualizar</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="files" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="files">Arquivos de Migração</TabsTrigger>
            <TabsTrigger value="history">Histórico de Execuções</TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <h3 className="text-sm font-medium mb-2">Arquivos SQL</h3>
                <ScrollArea className="h-[400px] border rounded-md p-2">{renderFilesList()}</ScrollArea>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-medium mb-2">
                  {selectedFile ? <span className="font-mono">{selectedFile}</span> : "Conteúdo do Arquivo"}
                </h3>
                <ScrollArea className="h-[400px] w-full border rounded-md">
                  {selectedFile ? (
                    <pre className="p-4 bg-muted/50 rounded-md overflow-x-auto font-mono text-sm">
                      {fileContent || "Carregando conteúdo..."}
                    </pre>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      <FileText className="h-12 w-12 opacity-20" />
                    </div>
                  )}
                </ScrollArea>
                {selectedFile && (
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      {isFileExecuted(selectedFile) && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Já executado
                        </Badge>
                      )}
                    </div>
                    <Button onClick={() => executeMigration(selectedFile)} disabled={executing}>
                      {executing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Executando...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Executar Migração
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {executionResult && (
              <Alert variant={executionResult.success ? "default" : "destructive"} className="mt-6">
                {executionResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{executionResult.success ? "Sucesso" : "Erro"}</AlertTitle>
                <AlertDescription>{executionResult.message}</AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <ScrollArea className="h-[600px]">{renderExecutionHistory()}</ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
