import type React from "react"
export default function VerifyLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex items-center justify-center bg-background">{children}</div>
}
