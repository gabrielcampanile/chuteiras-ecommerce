import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const categories = [
  {
    name: "Futsal",
    description: "Chuteiras para quadra com máxima aderência",
    image:
      "https://brand.assets.adidas.com/image/upload/f_auto,q_auto:best,fl_lossy/global_main_pack_1_pure_victory_football_ss25_launch_plp_statement_card_4in_d_a2aec953c6.jpg",
    href: "/produtos?categoria=futsal",
    features: ["Sola de borracha", "Máxima aderência", "Conforto superior"],
  },
  {
    name: "Society",
    description: "Perfeitas para grama sintética",
    image:
      "https://brand.assets.adidas.com/image/upload/f_auto,q_auto:best,fl_lossy/global_main_pack_1_pure_victory_football_ss25_launch_plp_statement_card_2tf_d_e7c204e02b.jpg",
    href: "/produtos?categoria=society",
    features: ["Travas baixas", "Estabilidade", "Durabilidade"],
  },
  {
    name: "Campo",
    description: "Para grama natural e máximo desempenho",
    image:
      "https://brand.assets.adidas.com/image/upload/f_auto,q_auto:best,fl_lossy/global_main_pack_1_pure_victory_football_ss25_launch_plp_statement_card_1fg_d_992232ca56.jpg",
    href: "/produtos?categoria=campo",
    features: ["Travas altas", "Tração superior", "Tecnologia avançada"],
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Escolha sua Modalidade
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Temos chuteiras especializadas para cada tipo de jogo. Encontre a
            perfeita para seu estilo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.name}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="relative h-32 sm:h-64 overflow-hidden">
                <Image
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 text-white">
                  <h3 className="text-lg sm:text-2xl font-bold mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-200">
                    {category.description}
                  </p>
                </div>
              </div>

              <div className="p-3 sm:p-6">
                <ul className="space-y-1 sm:space-y-2 mb-3 sm:mb-6">
                  {category.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-xs sm:text-sm text-gray-600"
                    >
                      <div className="w-2 h-2 bg-primary rounded-full mr-2 sm:mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="w-full text-xs sm:text-base py-2 sm:py-3"
                >
                  <Link href={category.href}>
                    Ver Chuteiras de {category.name}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
