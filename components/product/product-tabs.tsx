import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

interface ProductTabsProps {
  description: string;
  features: string[];
  specifications: Record<string, string>;
  reviews: any[];
  rating: number;
  productId?: string;
}

export default function ProductTabs({
  description,
  features,
  specifications,
  reviews,
  rating,
  productId,
}: ProductTabsProps) {
  const [productReviews, setProductReviews] = useState<any[]>(reviews || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productId) {
      setLoading(true);
      import("@/lib/services/productService").then(({ ProductService }) => {
        ProductService.getProductReviews(productId).then((data) => {
          setProductReviews(data);
          setLoading(false);
        });
      });
    }
  }, [productId]);

  return (
    <Tabs defaultValue="description" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="description">Descrição</TabsTrigger>
        <TabsTrigger value="specifications">Especificações</TabsTrigger>
        <TabsTrigger value="reviews">
          Avaliações ({productReviews.length})
        </TabsTrigger>
        <TabsTrigger value="size-guide">Guia de Tamanhos</TabsTrigger>
      </TabsList>

      <TabsContent value="description" className="mt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Descrição do Produto</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-3">
              Características Principais
            </h4>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="specifications" className="mt-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Especificações Técnicas
          </h3>
          <div className="grid gap-4">
            {Object.entries(specifications).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between py-3 border-b border-gray-200"
              >
                <span className="font-medium text-gray-900">{key}</span>
                <span className="text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Avaliações dos Clientes
            </h3>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-lg">{rating}</span>
              </div>
              <span className="text-gray-600">
                baseado em {productReviews.length} avaliações
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {productReviews.map((review) => (
              <div key={review.id} className="border-b border-gray-200 pb-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage
                      src={review.avatar || "/placeholder.svg"}
                      alt={review.name}
                    />
                    <AvatarFallback>
                      {review.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{review.name}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {review.date}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="size-guide" className="mt-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Guia de Tamanhos</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Tamanho BR
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Tamanho US
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Tamanho EU
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Comprimento (cm)
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { br: "33", us: "2", eu: "34", cm: "21.0" },
                  { br: "34", us: "3", eu: "35", cm: "21.5" },
                  { br: "35", us: "4", eu: "36", cm: "22.0" },
                  { br: "36", us: "5", eu: "37", cm: "22.5" },
                  { br: "37", us: "6", eu: "38", cm: "23.0" },
                  { br: "38", us: "7", eu: "39", cm: "23.5" },
                  { br: "39", us: "8", eu: "40", cm: "24.0" },
                  { br: "40", us: "9", eu: "41", cm: "24.5" },
                  { br: "41", us: "10", eu: "42", cm: "25.0" },
                  { br: "42", us: "11", eu: "43", cm: "25.5" },
                  { br: "43", us: "12", eu: "44", cm: "26.0" },
                  { br: "44", us: "13", eu: "45", cm: "26.5" },
                ].map((size) => (
                  <tr key={size.br}>
                    <td className="border border-gray-300 px-4 py-2">
                      {size.br}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {size.us}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {size.eu}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {size.cm}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              Dica de Medição
            </h4>
            <p className="text-blue-800 text-sm">
              Para medir seu pé corretamente, coloque uma folha de papel no
              chão, apoie o pé sobre ela e marque o ponto mais distante do
              calcanhar e dos dedos. Meça a distância entre os pontos com uma
              régua.
            </p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
