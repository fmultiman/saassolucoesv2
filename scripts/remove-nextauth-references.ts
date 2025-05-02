// Este script é apenas para referência e deve ser executado manualmente
// Ele lista os arquivos que podem conter referências ao NextAuth

import fs from "fs"
import path from "path"

const rootDir = process.cwd()

// Extensões de arquivo a serem verificadas
const extensions = [".ts", ".tsx", ".js", ".jsx"]

// Termos a serem procurados
const searchTerms = [
  "next-auth",
  "NextAuth",
  "getServerSession",
  "useSession",
  "SessionProvider",
  "signIn(",
  "signOut(",
]

// Função para verificar se um arquivo contém os termos de pesquisa
function checkFile(filePath: string): boolean {
  try {
    const content = fs.readFileSync(filePath, "utf8")
    return searchTerms.some((term) => content.includes(term))
  } catch (error) {
    console.error(`Erro ao ler o arquivo ${filePath}:`, error)
    return false
  }
}

// Função para percorrer diretórios recursivamente
function walkDir(dir: string, callback: (filePath: string) => void) {
  fs.readdirSync(dir).forEach((f) => {
    const dirPath = path.join(dir, f)
    const isDirectory = fs.statSync(dirPath).isDirectory()
    if (isDirectory) {
      walkDir(dirPath, callback)
    } else {
      const ext = path.extname(f)
      if (extensions.includes(ext)) {
        callback(path.join(dir, f))
      }
    }
  })
}

// Arquivos que contêm referências ao NextAuth
const filesWithNextAuth: string[] = []

// Percorrer diretórios e verificar arquivos
walkDir(rootDir, (filePath) => {
  if (checkFile(filePath)) {
    filesWithNextAuth.push(filePath)
  }
})

// Exibir resultados
console.log("Arquivos que contêm referências ao NextAuth:")
filesWithNextAuth.forEach((file) => {
  console.log(`- ${path.relative(rootDir, file)}`)
})

console.log(`\nTotal: ${filesWithNextAuth.length} arquivo(s)`)
