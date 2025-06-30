"use client";
import { useAuth } from "@/providers/auth-provider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/hooks/use-products";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductService } from "@/lib/services/productService";

export default function AdminProdutosPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const {
    products,
    loading: loadingProducts,
    error,
    refresh,
  } = useProducts({ createdBy: user?.uid });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (
      !loading &&
      userProfile &&
      userProfile.role !== "admin" &&
      userProfile.role !== "seller"
    ) {
      router.replace("/");
    }
  }, [loading, userProfile, router]);

  const handleDelete = async (id: string) => {
    if (!user) return;
    if (!window.confirm("Tem certeza que deseja deletar este produto?")) return;
    setDeletingId(id);
    try {
      await ProductService.deleteProduct(id, user.uid);
      await refresh();
    } catch (err) {
      alert("Erro ao deletar produto");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading || !userProfile) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  if (userProfile.role !== "admin" && userProfile.role !== "seller") {
    return <div className="p-8 text-center text-red-600">Acesso negado.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Meus Produtos</h1>
        <Link href="/admin/produtos/novo">
          <Button>Novo Produto</Button>
        </Link>
      </div>
      {loadingProducts ? (
        <div>Carregando produtos...</div>
      ) : error ? (
        <div className="text-red-600">Erro: {error}</div>
      ) : (
        <div className="space-y-4">
          {products.length === 0 ? (
            <div>Nenhum produto cadastrado.</div>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="border rounded p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">{product.name}</div>
                  <div className="text-sm text-gray-500">
                    R$ {product.price.toFixed(2)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/produtos/${product.id}/editar`}>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                  >
                    {deletingId === product.id ? "Deletando..." : "Deletar"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
