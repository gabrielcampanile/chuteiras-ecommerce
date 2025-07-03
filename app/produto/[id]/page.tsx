"use client";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductGallery from "@/components/product/product-gallery";
import ProductInfo from "@/components/product/product-info";
import ProductTabs from "@/components/product/product-tabs";
import RelatedProducts from "@/components/product/related-products";
import { ProductService } from "@/lib/services/productService";

export default function ProdutoPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      const prod = await ProductService.getProductById(params.id as string);
      setProduct(prod);
      setLoading(false);
    }
    fetchProduct();
  }, [params.id]);

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (!product) return notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <span>Home</span> / <span>Chuteiras</span> /{" "}
        <span>{product.category}</span> /{" "}
        <span className="text-gray-900">{product.name}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProductGallery images={product.images} />
        <ProductInfo product={product} />
      </div>
      <ProductTabs
        description={product.description}
        features={product.features}
        specifications={product.specifications}
        reviews={product.reviews || []}
        rating={product.rating}
        productId={product.id}
      />
      <RelatedProducts
        category={product.category}
        currentProductId={product.id}
      />
    </div>
  );
}
