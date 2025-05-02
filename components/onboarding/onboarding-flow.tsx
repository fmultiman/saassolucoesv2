"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Check, ArrowRight, Rocket, Settings, Users, BarChart } from "lucide-react"

// Tipos para o onboarding
type OnboardingStep = {
  id: string
  title: string
  description: string
  icon: React.ElementType
  component: React.FC<{ onComplete: () => void; onSkip: () => void }>
}

// Componente de boas-vindas
const WelcomeStep: React.FC<{ onComplete: () => void; onSkip: () => void }> = ({ onComplete }) => {
  return (
    <div className="space-y-4 text-center">
      <Rocket className="mx-auto h-12 w-12 text-primary" />
      <h2 className="text-2xl font-bold">Bem-vindo ao SaaS Soluções!</h2>
      <p className="text-muted-foreground">
        Estamos animados por você estar aqui! Vamos configurar sua conta para que você possa aproveitar ao máximo nossa
        plataforma.
      </p>
      <Button onClick={onComplete} className="mt-4">
        Vamos começar <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}

// Componente de configuração de perfil
const ProfileSetupStep: React.FC<{ onComplete: () => void; onSkip: () => void }> = ({ onComplete, onSkip }) => {
  return (
    <div className="space-y-4">
      <Users className="mx-auto h-12 w-12 text-primary" />
      <h2 className="text-2xl font-bold text-center">Configure seu perfil</h2>
      <p className="text-muted-foreground text-center">
        Adicione informações sobre sua empresa para personalizar sua experiência.
      </p>

      <div className="space-y-4 mt-6">
        <div className="grid gap-2">
          <label htmlFor="company" className="text-sm font-medium">
            Nome da empresa
          </label>
          <input
            id="company"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Sua Empresa Ltda."
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="industry" className="text-sm font-medium">
            Setor de atuação
          </label>
          <select
            id="industry"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Selecione um setor</option>
            <option value="retail">Varejo</option>
            <option value="services">Serviços</option>
            <option value="technology">Tecnologia</option>
            <option value="education">Educação</option>
            <option value="healthcare">Saúde</option>
            <option value="other">Outro</option>
          </select>
        </div>

        <div className="grid gap-2">
          <label htmlFor="size" className="text-sm font-medium">
            Tamanho da empresa
          </label>
          <select id="size" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
            <option value="">Selecione o tamanho</option>
            <option value="1-10">1-10 funcionários</option>
            <option value="11-50">11-50 funcionários</option>
            <option value="51-200">51-200 funcionários</option>
            <option value="201-500">201-500 funcionários</option>
            <option value="501+">501+ funcionários</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onSkip}>
          Pular por agora
        </Button>
        <Button onClick={onComplete}>
          Continuar <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Componente de seleção de soluções
const SolutionsSelectionStep: React.FC<{ onComplete: () => void; onSkip: () => void }> = ({ onComplete, onSkip }) => {
  const [selectedSolutions, setSelectedSolutions] = useState<string[]>([])

  const solutions = [
    { id: "email-marketing", name: "Email Marketing", description: "Automatize suas campanhas de email" },
    { id: "customer-support", name: "Suporte ao Cliente", description: "Atendimento automatizado 24/7" },
    { id: "sales-automation", name: "Automação de Vendas", description: "Aumente suas conversões" },
    { id: "appointment", name: "Agendamento", description: "Simplifique o agendamento de reuniões" },
  ]

  const toggleSolution = (id: string) => {
    setSelectedSolutions((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]))
  }

  return (
    <div className="space-y-4">
      <Settings className="mx-auto h-12 w-12 text-primary" />
      <h2 className="text-2xl font-bold text-center">Escolha suas soluções</h2>
      <p className="text-muted-foreground text-center">Selecione as soluções que você gostaria de começar a usar.</p>

      <div className="grid gap-3 mt-6">
        {solutions.map((solution) => (
          <div
            key={solution.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedSolutions.includes(solution.id)
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => toggleSolution(solution.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{solution.name}</h3>
                <p className="text-sm text-muted-foreground">{solution.description}</p>
              </div>
              {selectedSolutions.includes(solution.id) && <Check className="h-5 w-5 text-primary" />}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onSkip}>
          Pular por agora
        </Button>
        <Button onClick={onComplete} disabled={selectedSolutions.length === 0}>
          Continuar <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Componente de objetivos
const GoalsStep: React.FC<{ onComplete: () => void; onSkip: () => void }> = ({ onComplete, onSkip }) => {
  return (
    <div className="space-y-4">
      <BarChart className="mx-auto h-12 w-12 text-primary" />
      <h2 className="text-2xl font-bold text-center">Defina seus objetivos</h2>
      <p className="text-muted-foreground text-center">O que você espera alcançar com o SaaS Soluções?</p>

      <div className="space-y-3 mt-6">
        {[
          { id: "increase-sales", label: "Aumentar vendas" },
          { id: "improve-support", label: "Melhorar atendimento ao cliente" },
          { id: "automate-tasks", label: "Automatizar tarefas repetitivas" },
          { id: "reduce-costs", label: "Reduzir custos operacionais" },
          { id: "expand-reach", label: "Expandir alcance de mercado" },
        ].map((goal) => (
          <label
            key={goal.id}
            className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:border-primary/50"
          >
            <input type="checkbox" id={goal.id} className="h-4 w-4 rounded border-gray-300" />
            <span>{goal.label}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onSkip}>
          Pular por agora
        </Button>
        <Button onClick={onComplete}>
          Finalizar <Check className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Componente de conclusão
const CompletionStep: React.FC<{ onComplete: () => void; onSkip: () => void }> = ({ onComplete }) => {
  return (
    <div className="space-y-4 text-center">
      <div className="mx-auto rounded-full bg-primary/10 p-3 w-16 h-16 flex items-center justify-center">
        <Check className="h-8 w-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold">Tudo pronto!</h2>
      <p className="text-muted-foreground">
        Sua conta foi configurada com sucesso. Você está pronto para começar a usar o SaaS Soluções.
      </p>
      <Button onClick={onComplete} className="mt-4">
        Ir para o Dashboard
      </Button>
    </div>
  )
}

// Definição dos passos do onboarding
const onboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Bem-vindo",
    description: "Introdução à plataforma",
    icon: Rocket,
    component: WelcomeStep,
  },
  {
    id: "profile",
    title: "Perfil",
    description: "Informações da empresa",
    icon: Users,
    component: ProfileSetupStep,
  },
  {
    id: "solutions",
    title: "Soluções",
    description: "Escolha suas soluções",
    icon: Settings,
    component: SolutionsSelectionStep,
  },
  {
    id: "goals",
    title: "Objetivos",
    description: "Defina seus objetivos",
    icon: BarChart,
    component: GoalsStep,
  },
  {
    id: "completion",
    title: "Conclusão",
    description: "Tudo pronto",
    icon: Check,
    component: CompletionStep,
  },
]

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const currentStep = onboardingSteps[currentStepIndex]
  const progress = (completedSteps.length / (onboardingSteps.length - 1)) * 100

  const handleStepComplete = () => {
    setCompletedSteps((prev) => [...prev, currentStep.id])

    if (currentStepIndex < onboardingSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
    } else {
      onComplete()
    }
  }

  const handleStepSkip = () => {
    if (currentStepIndex < onboardingSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
    } else {
      onComplete()
    }
  }

  const StepComponent = currentStep.component

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle>Configuração da conta</CardTitle>
            <span className="text-sm text-muted-foreground">
              Passo {currentStepIndex + 1} de {onboardingSteps.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <CardDescription className="pt-2">
            {currentStep.title} - {currentStep.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StepComponent onComplete={handleStepComplete} onSkip={handleStepSkip} />
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex space-x-2">
            {onboardingSteps.map((step, index) => (
              <div
                key={step.id}
                className={`w-2 h-2 rounded-full ${
                  index === currentStepIndex
                    ? "bg-primary"
                    : completedSteps.includes(step.id)
                      ? "bg-primary/50"
                      : "bg-muted"
                }`}
              />
            ))}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
