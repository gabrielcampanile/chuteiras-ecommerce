"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Share2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

export default function ProductCard({
  product,
  showAddToCart = true,
}: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toast } = useToast();

  const handleAddToCart = () => {
    const defaultSize = product.sizes?.[0] || "40";
    const defaultColor = product.colors?.[0] || "Preto";

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image:
        Array.isArray(product.images) && product.images.length > 0
          ? product.images[0]
          : "/placeholder.svg",
      size: defaultSize,
      color: defaultColor,
      quantity: 1,
    });

    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  const handleToggleFavorite = () => {
    toggleFavorite({
      id: product.id,
      name: product.name,
      price: product.price,
      image:
        Array.isArray(product.images) && product.images.length > 0
          ? product.images[0]
          : "/placeholder.svg",
      brand: product.brand,
      category: product.category,
    });

    toast({
      title: isFavorite(product.id)
        ? "Removido dos favoritos"
        : "Adicionado aos favoritos",
      description: `${product.name} ${
        isFavorite(product.id) ? "foi removido dos" : "foi adicionado aos"
      } seus favoritos.`,
    });
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/produto/${product.id}`;
    const text = `Confira esta chuteira: ${product.name}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: text,
          url: url,
        });
      } catch (error) {
        await navigator.clipboard.writeText(`${text} - ${url}`);
        toast({
          title: "Link copiado!",
          description:
            "O link do produto foi copiado para a área de transferência.",
        });
      }
    } else {
      await navigator.clipboard.writeText(`${text} - ${url}`);
      toast({
        title: "Link copiado!",
        description:
          "O link do produto foi copiado para a área de transferência.",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow group border">
      <div className="relative p-4">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="bg-green-500 hover:bg-green-600">Novo</Badge>
          )}
          {product.isOnSale &&
            product.discountPercentage &&
            product.discountPercentage > 0 && (
              <Badge variant="destructive">
                -{product.discountPercentage}%
              </Badge>
            )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1">
          <button
            onClick={handleToggleFavorite}
            className="relative p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <Heart
              className={`h-4 w-4 ${
                isFavorite(product.id)
                  ? "text-red-500 fill-current"
                  : "text-gray-600"
              }`}
            />
            {isFavorite(product.id) && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>
          <button
            onClick={handleShare}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <Share2 className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Product Image */}
        <Link href={`/produto/${product.id}`} onClick={scrollToTop}>
          <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
            <Image
              src={
                Array.isArray(product.images) && product.images.length > 0
                  ? product.images[0]
                  : "/placeholder.svg"
              }
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

          <Link href={`/produto/${product.id}`} onClick={scrollToTop}>
            <h3 className="font-semibold text-sm hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviewCount})
            </span>
          </div>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Cores:</span>
              <div className="flex gap-1">
                {product.colors.slice(0, 3).map((color, index) => (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-full border border-gray-300"
                    title={color}
                  />
                ))}
                {product.colors.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{product.colors.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">Tamanhos:</span>
              <span className="text-xs text-gray-700">
                {product.sizes[0]} - {product.sizes[product.sizes.length - 1]}
              </span>
            </div>
          )}

          {/* Price */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-primary">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              ou 12x de R$ {(product.price / 12).toFixed(2).replace(".", ",")}{" "}
              sem juros
            </p>
          </div>

          {/* Add to Cart Button */}
          {showAddToCart && (
            <Button onClick={handleAddToCart} className="w-full mt-4" size="sm">
              Adicionar ao Carrinho
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
