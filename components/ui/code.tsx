import * as React from "react"

import { cn } from "@/lib/utils"

export interface CodeProps extends React.HTMLAttributes<HTMLElement> {}

const Code = React.forwardRef<HTMLElement, CodeProps>(({ className, ...props }, ref) => {
  return (
    <code
      className={cn(
        "relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold transition-colors",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Code.displayName = "Code"

export { Code }
