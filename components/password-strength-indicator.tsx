import { cn } from "@/lib/utils"

interface PasswordStrengthIndicatorProps {
  strength: number // 0-5, onde 0 é vazio e 5 é muito forte
}

export function PasswordStrengthIndicator({ strength }: PasswordStrengthIndicatorProps) {
  if (strength === 0) return null

  // Determinar a cor e o texto com base na força
  const getStrengthInfo = () => {
    if (strength === 1) return { text: "Muito fraca", color: "text-red-500", barColor: "bg-red-500", width: "w-1/5" }
    if (strength === 2) return { text: "Fraca", color: "text-orange-500", barColor: "bg-orange-500", width: "w-2/5" }
    if (strength === 3) return { text: "Média", color: "text-yellow-500", barColor: "bg-yellow-500", width: "w-3/5" }
    if (strength === 4) return { text: "Forte", color: "text-green-500", barColor: "bg-green-500", width: "w-4/5" }
    return { text: "Muito forte", color: "text-green-700", barColor: "bg-green-700", width: "w-full" }
  }

  const { text, color, barColor, width } = getStrengthInfo()

  return (
    <div className="mt-1 space-y-1">
      <div className="flex items-center gap-2">
        <div className="h-1 flex-1 bg-gray-700 rounded-full overflow-hidden">
          <div className={cn("h-full transition-all duration-300", barColor, width)} />
        </div>
        <span className={cn("text-xs font-medium", color)}>{text}</span>
      </div>
    </div>
  )
}
