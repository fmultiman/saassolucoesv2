"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { X, ChevronRight, ChevronLeft, Zap, Settings, BarChart } from "lucide-react"

type OnboardingSlide = {
  title: string
  text: string
  icon: React.ElementType
}

interface OnboardingModalProps {
  onComplete: () => void
}

const slides: OnboardingSlide[] = [
  {
    title: "Descubra soluções inteligentes",
    text: "Acesse dezenas de automações e agentes que transformam sua rotina.",
    icon: Zap,
  },
  {
    title: "Configure em poucos minutos",
    text: "Personalize suas soluções de forma rápida e fácil para começar a usar.",
    icon: Settings,
  },
  {
    title: "Ative e acompanhe suas soluções",
    text: "Gerencie suas ativações e expanda sua produtividade com nossa plataforma.",
    icon: BarChart,
  },
]

export function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Configurar autoplay
  useEffect(() => {
    if (autoplay) {
      autoplayTimerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev))
      }, 5000) // Muda a cada 5 segundos
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current)
      }
    }
  }, [autoplay])

  // Parar autoplay quando o usuário interagir
  const stopAutoplay = () => {
    setAutoplay(false)
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current)
    }
  }

  const nextSlide = () => {
    stopAutoplay()
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    stopAutoplay()
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const handleComplete = () => {
    onComplete()
  }

  const CurrentIcon = slides[currentSlide].icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 sm:max-w-[85%] md:max-w-md">
        {/* Botão de pular */}
        <button
          onClick={handleSkip}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          aria-label="Pular onboarding"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Conteúdo do slide */}
        <div className="flex flex-col items-center justify-center py-8">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <CurrentIcon className="h-12 w-12 text-primary" />
          </div>

          <h2 className="mb-2 text-center text-2xl font-bold">{slides[currentSlide].title}</h2>
          <p className="mb-8 text-center text-gray-600 dark:text-gray-300">{slides[currentSlide].text}</p>

          {/* Indicadores de slide */}
          <div className="mb-6 flex space-x-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentSlide ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>

          {/* Botões de navegação */}
          <div className="flex w-full items-center justify-between">
            <Button
              variant="outline"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={currentSlide === 0 ? "invisible" : ""}
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Anterior
            </Button>

            {currentSlide < slides.length - 1 ? (
              <Button onClick={nextSlide}>
                Próximo <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete}>Começar Agora</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
