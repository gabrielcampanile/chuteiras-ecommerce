"use client";
import { useState, useRef } from "react";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  uploadBytes,
  getDownloadURL,
  ref as storageRef,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (
    data: Omit<
      Product,
      "id" | "createdAt" | "updatedAt" | "createdBy" | "reviewCount" | "rating"
    > & { images: string[] }
  ) => Promise<void>;
  loading?: boolean;
}

export default function ProductForm({
  initialData = {},
  onSubmit,
  loading,
}: ProductFormProps) {
  const [name, setName] = useState(initialData.name || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [price, setPrice] = useState(initialData.price?.toString() || "");
  const [originalPrice, setOriginalPrice] = useState(
    initialData.originalPrice?.toString() || ""
  );
  const [category, setCategory] = useState(initialData.category || "");
  const [brand, setBrand] = useState(initialData.brand || "");
  const [sizes, setSizes] = useState(initialData.sizes?.join(",") || "");
  const [colors, setColors] = useState(initialData.colors?.join(",") || "");
  const [inStock, setInStock] = useState(initialData.inStock ?? true);
  const [stockQuantity, setStockQuantity] = useState(
    initialData.stockQuantity?.toString() || "1"
  );
  const [isNew, setIsNew] = useState(initialData.isNew ?? false);
  const [isOnSale, setIsOnSale] = useState(initialData.isOnSale ?? false);
  const [discountPercentage, setDiscountPercentage] = useState(
    initialData.discountPercentage?.toString() || "0"
  );
  const [images, setImages] = useState<string[]>(initialData.images || []);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleAddImageUrl = () => {
    if (!imageUrl.trim()) return;
    if (!/^https?:\/\//.test(imageUrl.trim())) {
      setError("Insira uma URL válida começando com http:// ou https://");
      return;
    }
    setImages((prev) => [...prev, imageUrl.trim()]);
    setImageUrl("");
    setError(null);
  };

  const handleRemoveImage = (url: string) => {
    setImages((prev) => prev.filter((img) => img !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name || !price || !category || !brand) {
      setError("Preencha todos os campos obrigatórios.");
      return;
    }
    if (images.length === 0) {
      setError("Adicione pelo menos uma URL de imagem.");
      return;
    }
    try {
      await onSubmit({
        name,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        images,
        category,
        brand,
        sizes: sizes
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        colors: colors
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        inStock,
        stockQuantity: parseInt(stockQuantity, 10),
        isNew,
        isOnSale,
        discountPercentage: parseInt(discountPercentage, 10),
        tags: [],
        status: "active",
        specifications: {},
        shipping: { weight: 0, dimensions: { length: 0, width: 0, height: 0 } },
      });
    } catch (err: any) {
      setError(err.message || "Erro ao salvar produto.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Nome*</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Marca*</label>
          <Input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Categoria*</label>
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Preço*</label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min={0}
            step={0.01}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Preço Original</label>
          <Input
            type="number"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            min={0}
            step={0.01}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Tamanhos (separados por vírgula)
          </label>
          <Input value={sizes} onChange={(e) => setSizes(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Cores (separadas por vírgula)
          </label>
          <Input value={colors} onChange={(e) => setColors(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Quantidade em estoque
          </label>
          <Input
            type="number"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            min={0}
          />
        </div>
        <div className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          <span>Em estoque</span>
        </div>
        <div className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            checked={isNew}
            onChange={(e) => setIsNew(e.target.checked)}
          />
          <span>Novo</span>
        </div>
        <div className="flex items-center gap-2 mt-6">
          <input
            type="checkbox"
            checked={isOnSale}
            onChange={(e) => setIsOnSale(e.target.checked)}
          />
          <span>Em promoção</span>
        </div>
        <div>
          <label className="block text-sm font-medium">% Desconto</label>
          <Input
            type="number"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(e.target.value)}
            min={0}
            max={100}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">Descrição</label>
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Imagens (URL)</label>
        <div className="flex gap-2 flex-wrap mb-2">
          {images.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={img}
                alt="Imagem do produto"
                className="w-24 h-24 object-cover rounded border"
              />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-xs opacity-80 group-hover:opacity-100"
                onClick={() => handleRemoveImage(img)}
                title="Remover imagem"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mb-2">
          <Input
            type="url"
            placeholder="Cole a URL da imagem e pressione Enter"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddImageUrl();
              }
            }}
          />
          <Button type="button" onClick={handleAddImageUrl}>
            Adicionar
          </Button>
        </div>
        {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Salvando..." : "Salvar Produto"}
      </Button>
    </form>
  );
}
