"use client";

import { useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, Package } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useFavorites } from "@/hooks/use-favorites";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "@/components/shared/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Product } from "@/types/product";

function ProductGridSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  hasActiveFilters,
  onClearFilters,
  searchQuery,
}: {
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  searchQuery?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Package className="h-16 w-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">
        {searchQuery
          ? "Nenhum produto encontrado"
          : "Nenhum produto corresponde aos filtros"}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {searchQuery
          ? `Não encontramos produtos para "${searchQuery}". Tente uma busca diferente.`
          : hasActiveFilters
          ? "Tente ajustar ou remover alguns filtros para ver mais produtos."
          : "Não há produtos disponíveis no momento."}
      </p>
      {hasActiveFilters && onClearFilters && (
        <Button onClick={onClearFilters} variant="outline">
          Limpar Filtros
        </Button>
      )}
    </div>
  );
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <Alert className="my-8">
        <AlertCircle className="h-5 w-5 text-yellow-500" />
        <AlertDescription>Nenhum produto encontrado.</AlertDescription>
      </Alert>
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
