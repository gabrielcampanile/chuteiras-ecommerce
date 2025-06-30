"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Trash2 } from "lucide-react"
import { useFavorites } from "@/hooks/use-favorites"

export default function FavoritosPage() {
  const { favorites, removeFromFavorites } = useFavorites()

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-md mx-auto">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Sua lista de favoritos está vazia</h1>
          <p className="text-gray-600 mb-8">
            Adicione produtos aos seus favoritos para acompanhar preços e disponibilidade.
          </p>
          <Button asChild>
            <Link href="/produtos">Explorar Produtos</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-8">
        <Heart className="h-6 w-6 text-red-500 fill-current" />
        <h1 className="text-3xl font-bold">Meus Favoritos</h1>
        <Badge variant="secondary">{favorites.length} produtos</Badge>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow group border"
          >
            <div className="relative p-4">
              {/* Remove Button */}
              <button
                onClick={() => removeFromFavorites(product.id)}
                className="absolute top-2 right-2 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                <Trash2 className="h-4 w-4 text-gray-600" />
              </button>

              {/* Product Image */}
              <Link
                href={`/produto/${product.id}`}
                onClick={() => {
                  setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100)
                }}
              >
                <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              {/* Product Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  <span className="text-xs text-gray-500">{product.brand}</span>
                </div>

                <Link
                  href={`/produto/${product.id}`}
                  onClick={() => {
                    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100)
                  }}
                >
                  <h3 className="font-semibold text-sm hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

                {/* Price */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg text-primary">
                      R$ {product.price.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    ou 12x de R$ {(product.price / 12).toFixed(2).replace(".", ",")} sem juros
                  </p>
                </div>

                {/* Add to Cart Button */}
                <Button className="w-full mt-4" size="sm">
                  Ver Produto
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-8 text-center">
        <Button variant="outline" asChild>
          <Link href="/produtos">Continuar Comprando</Link>
        </Button>
      </div>
    </div>
  )
}
