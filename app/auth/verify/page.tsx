"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const queryString = searchParams.toString()
    router.replace(queryString ? `/auth/callback?${queryString}` : "/auth/callback")
  }, [router, searchParams])

  return null
}
