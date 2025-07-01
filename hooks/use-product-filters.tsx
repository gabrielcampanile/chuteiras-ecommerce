"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface FilterState {
  categories: string[];
  brands: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  search: string;
  sort: string;
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  isNew?: boolean;
  discount?: number;
  colors: string[];
  sizes: string[];
  keywords: string[];
}

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  brands: [],
  sizes: [],
  colors: [],
  priceRange: [0, 2000],
  search: "",
  sort: "relevance",
};

export function useProductFilters(products: Product[]) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout>();
  const isInitializedRef = useRef(false);

  products = Array.isArray(products) ? products : [];

  // Initialize filters from URL params only once
  useEffect(() => {
    if (!isInitializedRef.current) {
      const initialFilters: FilterState = {
        categories: searchParams.getAll("categoria"),
        brands: searchParams.getAll("marca"),
        sizes: searchParams.getAll("tamanho"),
        colors: searchParams.getAll("cor"),
        priceRange: [
          Number.parseInt(searchParams.get("precoMin") || "0"),
          Number.parseInt(searchParams.get("precoMax") || "2000"),
        ],
        search: searchParams.get("busca") || "",
        sort: searchParams.get("ordenacao") || "relevance",
      };
      setFilters(initialFilters);
      isInitializedRef.current = true;
    }
  }, [searchParams]);

  // Stable update filter function
  const updateFilter = useCallback((key: keyof FilterState, value: any) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
  }, []);

  // Atualizar a URL quando filters mudar (exceto na primeira renderização)
  useEffect(() => {
    if (!isInitializedRef.current) return;

    const params = new URLSearchParams();

    if (filters.search) params.set("busca", filters.search);
    if (filters.sort !== "relevance") params.set("ordenacao", filters.sort);

    filters.categories.forEach((cat) => params.append("categoria", cat));
    filters.brands.forEach((brand) => params.append("marca", brand));
    filters.sizes.forEach((size) => params.append("tamanho", size));
    filters.colors.forEach((color) => params.append("cor", color));

    if (filters.priceRange[0] > 0)
      params.set("precoMin", filters.priceRange[0].toString());
    if (filters.priceRange[1] < 2000)
      params.set("precoMax", filters.priceRange[1].toString());

    const newUrl = params.toString()
      ? `/produtos?${params.toString()}`
      : "/produtos";
    router.push(newUrl, { scroll: false });
  }, [filters, router]);

  // Filter products - memoized to prevent unnecessary recalculations
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.keywords.some((keyword) =>
            keyword.toLowerCase().includes(searchTerm)
          )
      );
    }

    // Category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    // Brand filter
    if (filters.brands.length > 0) {
      filtered = filtered.filter((product) =>
        filters.brands.includes(product.brand)
      );
    }

    // Size filter
    if (filters.sizes.length > 0) {
      filtered = filtered.filter((product) =>
        product.sizes.some((size) => filters.sizes.includes(size))
      );
    }

    // Color filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter((product) =>
        product.colors.some((color) => filters.colors.includes(color))
      );
    }

    // Price filter
    filtered = filtered.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );

    // Sort products
    switch (filters.sort) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // Relevance
        filtered.sort((a, b) => {
          const aDiscount = a.discount || 0;
          const bDiscount = b.discount || 0;
          if (aDiscount > 0 && bDiscount === 0) return -1;
          if (aDiscount === 0 && bDiscount > 0) return 1;
          return b.rating - a.rating;
        });
    }

    return filtered;
  }, [products, filters]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    const clearedFilters = {
      ...DEFAULT_FILTERS,
      search: filters.search,
      sort: filters.sort,
    };
    setFilters(clearedFilters);
  }, [filters.search, filters.sort]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.categories.length > 0 ||
      filters.brands.length > 0 ||
      filters.sizes.length > 0 ||
      filters.colors.length > 0 ||
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 2000
    );
  }, [filters]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return {
    filters,
    filteredProducts,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    isLoading,
    totalProducts: products.length,
    filteredCount: filteredProducts.length,
    setFilter: updateFilter,
    sort: filters.sort,
    setSort: (value: string) => updateFilter("sort", value),
  };
}
