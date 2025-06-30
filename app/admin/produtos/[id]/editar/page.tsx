"use client";
import { useAuth } from "@/providers/auth-provider";
import { useRouter, useParams } from "next/navigation";
import ProductForm from "@/components/product/ProductForm";
import { ProductService } from "@/lib/services/productService";
import { useEffect, useState } from "react";

export default function EditarProdutoPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const product = await ProductService.getProductById(
          params.id as string
        );
        setInitialData(product);
      } catch (err) {
        setError("Produto não encontrado");
      }
    };
    fetchProduct();
  }, [params.id]);

  useEffect(() => {
    if (
      !user ||
      !userProfile ||
      (userProfile.role !== "admin" && userProfile.role !== "seller")
    ) {
      router.replace("/");
    }
  }, [user, userProfile, userProfile?.role, router]);

  if (
    !user ||
    !userProfile ||
    (userProfile.role !== "admin" && userProfile.role !== "seller")
  ) {
    return null;
  }

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      await ProductService.updateProduct(params.id as string, data, user.uid);
      router.push("/admin/produtos");
    } catch (err) {
      alert("Erro ao atualizar produto");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (!initialData) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Editar Produto</h1>
      <ProductForm
        initialData={initialData}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
}
