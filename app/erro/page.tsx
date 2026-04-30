import Link from "next/link"

export default async function ErroPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  const { type } = await searchParams

  const message =
    type === "invalid_token"
      ? "O link de verificacao e invalido, expirou ou ja foi utilizado."
      : "Nao foi possivel concluir a operacao solicitada."

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold">Nao foi possivel continuar</h1>
        <p className="mb-6 text-sm text-muted-foreground">{message}</p>
        <div className="flex gap-3">
          <Link href="/dashboard" className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
            Ir para o dashboard
          </Link>
          <Link href="/conta" className="rounded-md border px-4 py-2 text-sm">
            Voltar para a conta
          </Link>
        </div>
      </div>
    </div>
  )
}
