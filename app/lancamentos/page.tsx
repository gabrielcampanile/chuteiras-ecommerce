"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { ProductService } from "@/lib/services/productService";

export default function LancamentosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewProducts() {
      setLoading(true);
      const prods = await ProductService.getNewProducts(8);
      setProducts(prods);
      setLoading(false);
    }
    fetchNewProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8 mb-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8" />
            <h1 className="text-4xl font-bold">Lançamentos</h1>
          </div>
          <p className="text-xl mb-6">
            Seja o primeiro a ter as chuteiras mais inovadoras do mercado.
            Tecnologia de ponta para elevar seu jogo.
          </p>
          <div className="flex items-center gap-4 text-purple-100">
            <span>✨ Tecnologias exclusivas</span>
            <span>🚀 Performance superior</span>
            <span>🎯 Precisão máxima</span>
          </div>
        </div>
      </div>

      {/* New Arrivals */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Novidades da Semana</h2>
        {loading ? (
          <div className="text-center py-12">Carregando lançamentos...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow group border"
              >
                <div className="relative p-4">
                  <Badge className="absolute top-2 left-2 z-10 bg-gradient-to-r from-purple-500 to-blue-500">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Novo
                  </Badge>

                  <Link href={`/produto/${product.id}`}>
                    <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                      <Image
                        src={product.images?.[0] || "/placeholder.svg"}
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
                      <span className="text-xs text-gray-500">
                        {product.brand}
                      </span>
                    </div>

                    <Link href={`/produto/${product.id}`}>
                      <h3 className="font-semibold text-sm hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-gray-600 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating || 0)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        ({product.reviewCount || 0})
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-primary">
                          R$ {product.price.toFixed(2).replace(".", ",")}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            R${" "}
                            {product.originalPrice.toFixed(2).replace(".", ",")}
                          </span>
                        )}
                      </div>
                    </div>

                    {product.createdAt && (
                      <div className="text-xs text-gray-500">
                        Lançado em{" "}
                        {new Date(product.createdAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </div>
                    )}

                    <Button className="w-full mt-4" size="sm">
                      Ver Lançamento
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Coming Soon */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Em Breve</h2>
        <p className="text-gray-600 mb-6">
          Fique por dentro dos próximos lançamentos e seja notificado quando
          chegarem.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Nike Air Zoom Mercurial 2024</h3>
            <p className="text-sm text-gray-600 mb-4">
              A próxima geração da linha Mercurial com tecnologia Air Zoom
              revolucionária.
            </p>
            <Badge variant="outline">Março 2024</Badge>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <h3 className="font-semibold mb-2">Adidas Predator Edge 2024</h3>
            <p className="text-sm text-gray-600 mb-4">
              Controle absoluto da bola com a nova tecnologia de superfície
              adaptativa.
            </p>
            <Badge variant="outline">Abril 2024</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
