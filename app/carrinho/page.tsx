"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useRouter } from "next/navigation"

export default function CarrinhoPage() {
  const { items, total, updateQuantity, removeItem, clearCart } = useCart()
  const router = useRouter()

  const shippingCost = total > 299 ? 0 : 29.9
  const finalTotal = total + shippingCost

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
          <p className="text-gray-600 mb-8">Adicione produtos ao seu carrinho para continuar com a compra.</p>
          <Button asChild>
            <Link href="/produtos">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continuar Comprando
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <ShoppingBag className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Carrinho de Compras</h1>
        <Badge variant="secondary">{items.length} produtos</Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.id}-${item.size}-${item.color}`} className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex gap-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover rounded" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm mb-1 line-clamp-2">{item.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <span>Tamanho: {item.size}</span>
                    <span>•</span>
                    <span>Cor: {item.color}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.size, item.color, Math.max(1, item.quantity - 1))}
                        disabled={item.quantity <= 1}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">
                        R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                      </div>
                      <div className="text-xs text-gray-500">R$ {item.price.toFixed(2).replace(".", ",")} cada</div>
                    </div>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4">
            <Button variant="outline" asChild>
              <Link href="/produtos">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continuar Comprando
              </Link>
            </Button>
            <Button variant="ghost" onClick={clearCart} className="text-red-500 hover:text-red-700">
              Limpar Carrinho
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg border shadow-sm sticky top-4">
            <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} produtos)</span>
                <span>R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete</span>
                <span className={shippingCost === 0 ? "text-green-600 font-medium" : ""}>
                  {shippingCost === 0 ? "Grátis" : `R$ ${shippingCost.toFixed(2).replace(".", ",")}`}
                </span>
              </div>
              {total < 299 && (
                <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                  Adicione mais R$ {(299 - total).toFixed(2).replace(".", ",")} para ganhar frete grátis!
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total</span>
              <span className="text-primary">R$ {finalTotal.toFixed(2).replace(".", ",")}</span>
            </div>

            <div className="space-y-3">
              <Button className="w-full" size="lg" onClick={() => router.push("/checkout")}>Finalizar Compra</Button>
              <div className="text-center text-xs text-gray-500">
                ou 12x de R$ {(finalTotal / 12).toFixed(2).replace(".", ",")} sem juros
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Entrega em todo o Brasil</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>Troca grátis em 30 dias</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>Produtos 100% originais</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
