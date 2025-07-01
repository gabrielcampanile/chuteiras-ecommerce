"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Heart, Share2, Truck, Shield, RotateCcw } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

interface ProductInfoProps {
  product: {
    id: string | number;
    name: string;
    brand: string;
    model: string;
    category: string;
    price: number;
    originalPrice?: number;
    description: string;
    colors: { id: string; name: string; hex: string }[] | string[];
    sizes: { size: string; available: boolean }[] | string[];
    rating: number;
    reviews: number;
    stock: number;
    sku: string;
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.id || ""
  );
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Selecione um tamanho",
        description:
          "Por favor, escolha o tamanho desejado antes de adicionar ao carrinho.",
        variant: "destructive",
      });
      return;
    }

    const selectedColorObj = product.colors.find((c) => c.id === selectedColor);

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: "/placeholder.svg?height=300&width=300",
      size: selectedSize,
      color: selectedColorObj?.name || "",
      quantity,
    });

    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao seu carrinho.`,
    });
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500">
        <span>Home</span> / <span>Chuteiras</span> /{" "}
        <span>{product.category}</span> /{" "}
        <span className="text-gray-900">{product.name}</span>
      </div>

      {/* Product Title */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">{product.brand}</Badge>
          <Badge variant="secondary">{product.category}</Badge>
        </div>
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600">{product.model}</p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="font-medium">{product.rating}</span>
          <span className="text-gray-500">
            (
            {Array.isArray(product.reviews)
              ? product.reviews.length
              : product.reviews || 0}{" "}
            avaliações)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Heart className="h-4 w-4 mr-1" />
            Favoritar
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            Compartilhar
          </Button>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-primary">
            R$ {product.price.toFixed(2).replace(".", ",")}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-xl text-gray-500 line-through">
                R$ {product.originalPrice.toFixed(2).replace(".", ",")}
              </span>
              <Badge variant="destructive">-{discount}%</Badge>
            </>
          )}
        </div>
        <p className="text-gray-600">
          ou{" "}
          <span className="font-semibold">
            12x de R$ {(product.price / 12).toFixed(2).replace(".", ",")}
          </span>{" "}
          sem juros
        </p>
        <p className="text-green-600 font-medium">💳 5% de desconto no PIX</p>
      </div>

      <Separator />

      {/* Color Selection */}
      <div className="space-y-3">
        <h3 className="font-semibold">
          Cor:{" "}
          {Array.isArray(product.colors) &&
          typeof product.colors[0] === "object"
            ? product.colors.find((c: any) => c.id === selectedColor)?.name
            : selectedColor}
        </h3>
        <div className="flex gap-2">
          {Array.isArray(product.colors) &&
            product.colors.map((color: any) => (
              <button
                key={color.id || color}
                onClick={() => setSelectedColor(color.id || color)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === (color.id || color)
                    ? "border-primary scale-110"
                    : "border-gray-300 hover:border-gray-400"
                }`}
                style={{ backgroundColor: color.hex || color }}
                title={color.name || color}
              />
            ))}
        </div>
      </div>

      {/* Size Selection */}
      <div className="space-y-3">
        <h3 className="font-semibold">
          Tamanho: {selectedSize || "Selecione"}
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {Array.isArray(product.sizes) &&
            product.sizes.map((sizeOption: any) => (
              <Button
                key={sizeOption.size || sizeOption}
                variant={
                  selectedSize === (sizeOption.size || sizeOption)
                    ? "default"
                    : "outline"
                }
                disabled={
                  typeof sizeOption === "object" ? !sizeOption.available : false
                }
                onClick={() => setSelectedSize(sizeOption.size || sizeOption)}
                className="h-12"
              >
                {sizeOption.size || sizeOption}
              </Button>
            ))}
        </div>
        <p className="text-sm text-gray-500">
          Não sabe seu tamanho?{" "}
          <button className="text-primary hover:underline">
            Guia de tamanhos
          </button>
        </p>
      </div>

      {/* Quantity */}
      <div className="space-y-3">
        <h3 className="font-semibold">Quantidade</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span className="px-4 py-2 min-w-[3rem] text-center">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={quantity >= product.stock}
            >
              +
            </Button>
          </div>
          <span className="text-sm text-gray-500">
            {product.stock} unidades disponíveis
          </span>
        </div>
      </div>

      {/* Add to Cart */}
      <div className="space-y-3">
        <Button onClick={handleAddToCart} size="lg" className="w-full">
          Adicionar ao Carrinho - R${" "}
          {(product.price * quantity).toFixed(2).replace(".", ",")}
        </Button>
        <Button variant="outline" size="lg" className="w-full">
          Comprar Agora
        </Button>
      </div>

      {/* Benefits */}
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <Truck className="h-5 w-5 text-green-600" />
          <span className="text-sm">
            Frete grátis para compras acima de R$ 299
          </span>
        </div>
        <div className="flex items-center gap-3">
          <RotateCcw className="h-5 w-5 text-blue-600" />
          <span className="text-sm">Troca grátis em até 30 dias</span>
        </div>
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-purple-600" />
          <span className="text-sm">Produto original com garantia</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <span className="font-medium">SKU:</span> {product.sku}
        </p>
        <p>
          <span className="font-medium">Categoria:</span> {product.category}
        </p>
        <p>
          <span className="font-medium">Marca:</span> {product.brand}
        </p>
      </div>
    </div>
  );
}
