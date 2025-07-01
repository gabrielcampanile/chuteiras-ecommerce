import { useEffect, useState } from "react";
import ProductCard from "@/components/shared/product-card";
import { ProductService } from "@/lib/services/productService";

interface RelatedProductsProps {
  category: string;
  currentProductId: string;
}

export default function RelatedProducts({
  category,
  currentProductId,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRelated() {
      setLoading(true);
      const prods = await ProductService.getProductsByCategory(category, 4);
      setProducts(prods.filter((p) => p.id !== currentProductId));
      setLoading(false);
    }
    fetchRelated();
  }, [category, currentProductId]);

  if (loading)
    return <div className="p-4 text-center">Carregando relacionados...</div>;
  if (!products.length) return null;

  return (
    <div className="mt-12">
      <h3 className="text-xl font-bold mb-4">Produtos Relacionados</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
