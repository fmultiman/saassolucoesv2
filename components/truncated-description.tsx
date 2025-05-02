"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TruncatedDescriptionProps {
  text: string
  maxLength?: number
  className?: string
  as?: React.ElementType
}

export function TruncatedDescription({
  text,
  maxLength = 80,
  className = "",
  as: Component = "span",
}: TruncatedDescriptionProps) {
  const [isTruncated, setIsTruncated] = useState(false)
  const textRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        setIsTruncated(text.length > maxLength)
      }
    }

    checkTruncation()
    window.addEventListener("resize", checkTruncation)
    return () => window.removeEventListener("resize", checkTruncation)
  }, [text, maxLength])

  const truncatedText = isTruncated ? `${text.substring(0, maxLength)}...` : text

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <Component ref={textRef} className={className}>
            {truncatedText}
          </Component>
        </TooltipTrigger>
        {isTruncated && <TooltipContent>{text}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  )
}
