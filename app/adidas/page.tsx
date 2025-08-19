"use client";

import { useCallback } from "react";
import ProductGrid from "@/components/products/product-grid";
import ProductSort from "@/components/products/product-sort";
import { useProducts } from "@/hooks/use-products";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function AdidasPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-80 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function AdidasPage() {
  const sortMap: Record<
    string,
    {
      field: "price" | "name" | "rating" | "createdAt" | "popularity";
      direction: "asc" | "desc";
    }
  > = {
    "price-asc": { field: "price", direction: "asc" },
    "price-desc": { field: "price", direction: "desc" },
    "name-asc": { field: "name", direction: "asc" },
    "name-desc": { field: "name", direction: "desc" },
    rating: { field: "rating", direction: "desc" },
    newest: { field: "createdAt", direction: "desc" },
    relevance: { field: "createdAt", direction: "desc" },
  };

  // Filtro fixo para marca Adidas
  const adidasFilter = {
    brand: "Adidas",
  };

  const [sort, setSort] = useState("relevance");
  const sortObj = sortMap[sort] || sortMap["relevance"];

  const { products, loading, error, hasMore, loadMore } = useProducts(
    adidasFilter,
    sortObj
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Chuteiras Adidas</h1>
        <p className="text-muted-foreground">
          Descubra a excelência das chuteiras Adidas. Inovação e tradição se
          encontram para oferecer o melhor em performance e estilo no futebol.
        </p>
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Sort */}
        <div className="flex justify-end items-center mb-6">
          <ProductSort value={sort} onValueChange={setSort} />
        </div>

        {/* Products Grid */}
        {loading ? (
          <AdidasPageSkeleton />
        ) : error ? (
          <div className="text-red-600">Erro: {error}</div>
        ) : (
          <>
            <ProductGrid products={products} />
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button onClick={loadMore} disabled={loading}>
                  {loading ? "Carregando..." : "Carregar mais produtos"}
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
