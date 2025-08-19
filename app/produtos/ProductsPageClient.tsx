"use client";

import { useCallback } from "react";
import ProductFilters from "@/components/products/product-filters";
import ProductGrid from "@/components/products/product-grid";
import ProductSort from "@/components/products/product-sort";
import { useProductFilters } from "@/hooks/use-product-filters";
import { useProducts } from "@/hooks/use-products";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

function ProductsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 flex-shrink-0">
          <Skeleton className="h-96 w-full" />
        </aside>
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-48" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ProductsPageClient() {
  const { filters, setFilter, sort, setSort, clearFilters } = useProductFilters(
    [] // Array vazio porque não precisamos filtrar produtos no frontend
  );

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

  // Converter filtros do frontend para o formato do backend
  const backendFilters = {
    category:
      filters.categories.length === 1
        ? filters.categories[0]
        : filters.categories.length > 1
        ? filters.categories
        : undefined,
    brand:
      filters.brands.length === 1
        ? filters.brands[0]
        : filters.brands.length > 1
        ? filters.brands
        : undefined,
    search: filters.search || undefined,
    priceRange:
      filters.priceRange[0] > 0 || filters.priceRange[1] < 2000
        ? { min: filters.priceRange[0], max: filters.priceRange[1] }
        : undefined,
    sizes: filters.sizes.length > 0 ? filters.sizes : undefined,
    colors: filters.colors.length > 0 ? filters.colors : undefined,
  };

  // Remover propriedades undefined
  Object.keys(backendFilters).forEach((key) => {
    if (backendFilters[key] === undefined) {
      delete backendFilters[key];
    }
  });

  const sortObj = sortMap[sort] || sortMap["relevance"];

  const { products, loading, error, hasMore, loadMore } = useProducts(
    backendFilters,
    sortObj
  );

  const getPageTitle = () => {
    if (filters.search) return `Resultados para "${filters.search}"`;
    if (filters.categories.length === 1) {
      const categoryNames: Record<string, string> = {
        futsal: "Chuteiras de Futsal",
        society: "Chuteiras de Society",
        campo: "Chuteiras de Campo",
      };
      return categoryNames[filters.categories[0]] || "Produtos";
    }
    if (filters.brands.length === 1) {
      const brandNames: Record<string, string> = {
        nike: "Chuteiras Nike",
        adidas: "Chuteiras Adidas",
        puma: "Chuteiras Puma",
        mizuno: "Chuteiras Mizuno",
      };
      return brandNames[filters.brands[0]] || "Produtos";
    }
    return "Todas as Chuteiras";
  };

  const getPageDescription = () => {
    if (filters.search)
      return `Encontre as melhores chuteiras relacionadas a "${filters.search}"`;
    if (filters.categories.length === 1) {
      const descriptions: Record<string, string> = {
        futsal:
          "Chuteiras especializadas para quadra com máxima aderência e controle",
        society:
          "Chuteiras perfeitas para grama sintética com travas baixas e estabilidade",
        campo:
          "Chuteiras para grama natural com máximo desempenho e tecnologia avançada",
      };
      return (
        descriptions[filters.categories[0]] ||
        "Encontre a chuteira perfeita para seu estilo de jogo"
      );
    }
    if (filters.brands.length === 1) {
      const brand = filters.brands[0];
      return `Explore toda a linha de chuteiras ${
        brand.charAt(0).toUpperCase() + brand.slice(1)
      }`;
    }
    return "Encontre a chuteira perfeita para seu estilo de jogo";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{getPageTitle()}</h1>
        <p className="text-muted-foreground">{getPageDescription()}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-24">
            <ProductFilters
              filters={filters}
              onFilterChange={setFilter}
              onClearFilters={clearFilters}
              hasActiveFilters={false}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile Filters & Sort */}
          <div className="flex justify-between items-center mb-6">
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <Filter className="w-4 h-4 mr-2" /> Filtros
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <ProductFilters
                  filters={filters}
                  onFilterChange={setFilter}
                  onClearFilters={clearFilters}
                  hasActiveFilters={false}
                />
              </SheetContent>
            </Sheet>

            {/* Sort */}
            <ProductSort value={sort} onValueChange={setSort} />
          </div>

          {/* Products Grid */}
          {loading ? (
            <ProductsPageSkeleton />
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
    </div>
  );
}
