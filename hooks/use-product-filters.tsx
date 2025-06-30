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

  // Stable URL update function
  const updateURL = useCallback(
    (newFilters: FilterState) => {
      const params = new URLSearchParams();

      if (newFilters.search) params.set("busca", newFilters.search);
      if (newFilters.sort !== "relevance")
        params.set("ordenacao", newFilters.sort);

      newFilters.categories.forEach((cat) => params.append("categoria", cat));
      newFilters.brands.forEach((brand) => params.append("marca", brand));
      newFilters.sizes.forEach((size) => params.append("tamanho", size));
      newFilters.colors.forEach((color) => params.append("cor", color));

      if (newFilters.priceRange[0] > 0)
        params.set("precoMin", newFilters.priceRange[0].toString());
      if (newFilters.priceRange[1] < 2000)
        params.set("precoMax", newFilters.priceRange[1].toString());

      const newUrl = params.toString()
        ? `/produtos?${params.toString()}`
        : "/produtos";
      router.push(newUrl, { scroll: false });
    },
    [router]
  );

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

  // Stable update filter function
  const updateFilter = useCallback(
    (key: keyof FilterState, value: any) => {
      setFilters((prevFilters) => {
        const newFilters = { ...prevFilters, [key]: value };

        // Clear any existing timeout
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current);
        }

        // Debounce price range updates, immediate for others
        if (key === "priceRange") {
          updateTimeoutRef.current = setTimeout(() => {
            updateURL(newFilters);
          }, 500);
        } else {
          updateURL(newFilters);
        }

        return newFilters;
      });
    },
    [updateURL]
  );

  // Clear all filters
  const clearFilters = useCallback(() => {
    const clearedFilters = {
      ...DEFAULT_FILTERS,
      search: filters.search,
      sort: filters.sort,
    };
    setFilters(clearedFilters);
    updateURL(clearedFilters);
  }, [filters.search, filters.sort, updateURL]);

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
  };
}
