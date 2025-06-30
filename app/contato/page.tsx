"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ContatoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular envio
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Mensagem enviada!",
      description: "Entraremos em contato em breve. Obrigado!",
    })

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    })
    setIsLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Entre em Contato</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo ou envie uma mensagem.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Telefone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">(15) 99747-0049</p>
              <p className="text-sm text-gray-600">WhatsApp disponível</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                E-mail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">contato@chuteiraspro.com</p>
              <p className="text-sm text-gray-600">Respondemos em até 24h</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">Rua das Chuteiras, 123</p>
              <p className="text-gray-600">Vila Olímpica - São Paulo, SP</p>
              <p className="text-gray-600">CEP: 01234-567</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Horário de Funcionamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Segunda a Sexta:</span> 9h às 18h
                </p>
                <p>
                  <span className="font-medium">Sábado:</span> 9h às 16h
                </p>
                <p>
                  <span className="font-medium">Domingo:</span> Fechado
                </p>
              </div>
            </CardContent>
          </Card>

          <Button
            className="w-full bg-green-500 hover:bg-green-600"
            onClick={() => window.open("https://wa.me/5515997470049", "_blank")}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Falar no WhatsApp
          </Button>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Envie uma Mensagem</CardTitle>
              <CardDescription>
                Preencha o formulário abaixo e entraremos em contato o mais breve possível.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto</Label>
                    <Select value={formData.subject} onValueChange={(value) => handleInputChange("subject", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um assunto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="duvida-produto">Dúvida sobre produto</SelectItem>
                        <SelectItem value="pedido">Acompanhar pedido</SelectItem>
                        <SelectItem value="troca-devolucao">Troca/Devolução</SelectItem>
                        <SelectItem value="sugestao">Sugestão</SelectItem>
                        <SelectItem value="reclamacao">Reclamação</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensagem</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    placeholder="Descreva sua dúvida ou mensagem..."
                    required
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Enviando..." : "Enviar Mensagem"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">Perguntas Frequentes</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Como posso rastrear meu pedido?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Após a confirmação do pagamento, você receberá um código de rastreamento por e-mail. Você também pode
                acompanhar pelo site dos Correios ou em sua conta.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Qual o prazo de entrega?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                O prazo varia conforme sua região: Sudeste (2-5 dias úteis), Sul (3-7 dias úteis), demais regiões (5-10
                dias úteis). Frete expresso disponível.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Posso trocar se não servir?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Sim! Você tem até 30 dias para trocar produtos que não serviram, desde que estejam em perfeito estado e
                com etiquetas.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Os produtos são originais?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Todos os nossos produtos são 100% originais e vêm com garantia do fabricante. Somos revendedores
                autorizados das principais marcas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
