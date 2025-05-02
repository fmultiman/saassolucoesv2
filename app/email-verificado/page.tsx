"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function EmailVerificado() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const [countdown, setCountdown] = useState(5)

  // Resto do código permanece o mesmo
}
