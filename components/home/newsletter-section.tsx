"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Gift } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular envio
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Inscrição realizada!",
      description: "Você receberá nossas ofertas exclusivas em breve.",
    })

    setEmail("")
    setIsLoading(false)
  }

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Gift className="h-8 w-8" />
            <h2 className="text-3xl md:text-4xl font-bold">Ofertas Exclusivas</h2>
          </div>

          <p className="text-xl mb-8 opacity-90">
            Cadastre-se em nossa newsletter e receba 10% de desconto na primeira compra, além de ofertas exclusivas e
            lançamentos em primeira mão.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 opacity-70" />
                <Input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-white text-black"
                />
              </div>
              <Button type="submit" disabled={isLoading} variant="secondary" className="px-6">
                {isLoading ? "Enviando..." : "Cadastrar"}
              </Button>
            </div>
          </form>

          <p className="text-sm mt-4 opacity-70">
            Ao se cadastrar, você concorda com nossa política de privacidade. Você pode cancelar a inscrição a qualquer
            momento.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12 text-center">
            <div>
              <div className="text-2xl font-bold mb-2">10%</div>
              <p className="text-sm opacity-90">Desconto na primeira compra</p>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">5000+</div>
              <p className="text-sm opacity-90">Clientes satisfeitos</p>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">24h</div>
              <p className="text-sm opacity-90">Entrega expressa</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
