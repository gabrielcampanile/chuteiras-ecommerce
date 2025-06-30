import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Clock } from "lucide-react"

const promotionalProducts = [
  {
    id: 1,
    name: "Nike Mercurial Vapor 15 Elite FG",
    brand: "Nike",
    category: "Campo",
    price: 899.9,
    originalPrice: 1199.9,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.8,
    reviews: 124,
    discount: 25,
    endDate: "2024-02-15",
  },
  {
    id: 2,
    name: "Adidas Predator Accuracy.1 Low FG",
    brand: "Adidas",
    category: "Campo",
    price: 749.9,
    originalPrice: 999.9,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.9,
    reviews: 89,
    discount: 25,
    endDate: "2024-02-20",
  },
  {
    id: 3,
    name: "Puma Future 7.1 Netfit FG/AG",
    brand: "Puma",
    category: "Campo",
    price: 649.9,
    originalPrice: 849.9,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviews: 156,
    discount: 23,
    endDate: "2024-02-18",
  },
  {
    id: 5,
    name: "Nike Phantom GX Elite FG",
    brand: "Nike",
    category: "Campo",
    price: 799.9,
    originalPrice: 1099.9,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.6,
    reviews: 203,
    discount: 27,
    endDate: "2024-02-25",
  },
]

export default function PromocoesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-8 mb-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">🔥 Super Promoções</h1>
          <p className="text-xl mb-6">
            Descontos imperdíveis em chuteiras de primeira linha! Aproveite enquanto durarem os estoques.
          </p>
          <div className="flex items-center gap-2 text-red-100">
            <Clock className="h-5 w-5" />
            <span>Ofertas por tempo limitado</span>
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-blue-50 p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">ATÉ 30%</div>
          <p className="text-blue-800">de desconto em Nike</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">FRETE GRÁTIS</div>
          <p className="text-green-800">em compras acima de R$ 199</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">12X SEM JUROS</div>
          <p className="text-purple-800">em todos os produtos</p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Produtos em Promoção</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {promotionalProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow group border"
            >
              <div className="relative p-4">
                <Badge variant="destructive" className="absolute top-2 left-2 z-10">
                  -{product.discount}%
                </Badge>

                <Link href={`/produto/${product.id}`}>
                  <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <span className="text-xs text-gray-500">{product.brand}</span>
                  </div>

                  <Link href={`/produto/${product.id}`}>
                    <h3 className="font-semibold text-sm hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(product.rating) ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-primary">
                        R$ {product.price.toFixed(2).replace(".", ",")}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                    <p className="text-xs text-red-600 font-medium">
                      Economia de R$ {(product.originalPrice - product.price).toFixed(2).replace(".", ",")}
                    </p>
                  </div>

                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Até {new Date(product.endDate).toLocaleDateString("pt-BR")}
                  </div>

                  <Button className="w-full mt-4" size="sm">
                    Aproveitar Oferta
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
