"use client";
import { useState, useEffect, useCallback } from "react";
import { ProductService } from "../lib/services/productService";
import { Product, ProductFilter, ProductSort } from "../types/product";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  lastDoc: QueryDocumentSnapshot<DocumentData> | null;
  loadProducts: (
    filters?: ProductFilter,
    sort?: ProductSort,
    reset?: boolean
  ) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useProducts(
  initialFilters?: ProductFilter,
  initialSort?: ProductSort
): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadProducts = useCallback(
    async (
      filters?: ProductFilter,
      sort?: ProductSort,
      reset: boolean = false
    ) => {
      try {
        setLoading(true);
        setError(null);

        const result = await ProductService.getProducts(
          filters || initialFilters,
          sort || initialSort,
          20,
          reset ? undefined : lastDoc || undefined
        );

        if (reset) {
          setProducts(Array.isArray(result.products) ? result.products : []);
        } else {
          setProducts((prev) => [
            ...prev,
            ...(Array.isArray(result.products) ? result.products : []),
          ]);
        }

        setLastDoc(result.lastDoc);
        setHasMore(result.products.length === 20);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar produtos"
        );
      } finally {
        setLoading(false);
      }
    },
    [initialFilters, initialSort, lastDoc]
  );

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await loadProducts();
    }
  }, [loading, hasMore, loadProducts]);

  const refresh = useCallback(async () => {
    setLastDoc(null);
    setHasMore(true);
    await loadProducts(undefined, undefined, true);
  }, [loadProducts]);

  useEffect(() => {
    loadProducts(undefined, undefined, true);
  }, []);

  return {
    products,
    loading,
    error,
    hasMore,
    lastDoc,
    loadProducts,
    loadMore,
    refresh,
  };
}

interface UseProductReturn {
  product: Product | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useProduct(id: string): UseProductReturn {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProduct = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const productData = await ProductService.getProductById(id);
      setProduct(productData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar produto");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const refresh = useCallback(async () => {
    await loadProduct();
  }, [loadProduct]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  return {
    product,
    loading,
    error,
    refresh,
  };
}

interface UseProductCategoriesReturn {
  categories: string[];
  loading: boolean;
  error: string | null;
}

export function useProductCategories(): UseProductCategoriesReturn {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar produtos para extrair categorias únicas
        const result = await ProductService.getProducts(
          undefined,
          undefined,
          1000
        );
        const uniqueCategories = [
          ...new Set(result.products.map((p) => p.category)),
        ];
        setCategories(uniqueCategories.sort());
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar categorias"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return {
    categories,
    loading,
    error,
  };
}

interface UseProductBrandsReturn {
  brands: string[];
  loading: boolean;
  error: string | null;
}

export function useProductBrands(): UseProductBrandsReturn {
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBrands = async () => {
      try {
        setLoading(true);
        setError(null);

        // Buscar produtos para extrair marcas únicas
        const result = await ProductService.getProducts(
          undefined,
          undefined,
          1000
        );
        const uniqueBrands = [...new Set(result.products.map((p) => p.brand))];
        setBrands(uniqueBrands.sort());
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Erro ao carregar marcas"
        );
      } finally {
        setLoading(false);
      }
    };

    loadBrands();
  }, []);

  return {
    brands,
    loading,
    error,
  };
}
