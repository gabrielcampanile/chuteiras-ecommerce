"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [showThanks, setShowThanks] = useState(false);
  const [processing, setProcessing] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const processCheckout = async () => {
      // 1. Decrementar estoque dos produtos
      for (const item of items) {
        const productRef = doc(db, "products", String(item.id));
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          const data = productSnap.data();
          const newStock = (data.stockQuantity || 0) - item.quantity;
          await updateDoc(productRef, { stockQuantity: Math.max(newStock, 0) });
        }
      }
      // 2. Limpar carrinho
      clearCart();
      // 3. Simular envio de e-mail (mock)
      await new Promise((res) => setTimeout(res, 1000));
      // 4. Exibir pop-up de agradecimento
      setShowThanks(true);
      setProcessing(false);
      // 5. Redirecionar para home após 4s
      setTimeout(() => {
        router.push("/");
      }, 4000);
    };
    if (items.length > 0) {
      processCheckout();
    } else {
      // Se não houver itens, redireciona para home
      router.replace("/");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        {processing && <div className="text-lg">Processando sua compra...</div>}
        {showThanks && (
          <>
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              Compra realizada com sucesso!
            </h2>
            <p className="mb-4">
              Obrigado por comprar na ChuteirasPro. Você receberá um e-mail com
              os detalhes do pedido.
            </p>
            <Button onClick={() => router.push("/")}>Voltar para a Home</Button>
          </>
        )}
      </div>
    </div>
  );
}
