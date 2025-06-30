"use client";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/product/ProductForm";
import { ProductService } from "@/lib/services/productService";
import { useState, useEffect } from "react";

export default function NovoProdutoPage() {
  const { user, userProfile } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
      await ProductService.createProduct(
        { ...data, createdBy: user.uid },
        user.uid
      );
      router.push("/admin/produtos");
    } catch (err) {
      alert("Erro ao criar produto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Novo Produto</h1>
      <ProductForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
