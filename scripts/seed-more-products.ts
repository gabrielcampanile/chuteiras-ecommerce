import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const brands = ["Nike", "Adidas", "Puma", "Mizuno", "Umbro", "Penalty", "Topper", "Asics"];
const categories = ["Futsal", "Society", "Campo"];
const lines = ["Mercurial", "Predator", "Future", "Morelia", "King", "Neo", "One", "Alpha"];
const colors = ["Preto", "Branco", "Azul", "Vermelho", "Verde", "Amarelo", "Laranja", "Rosa", "Cinza", "Dourado"];
const sizes = ["37", "38", "39", "40", "41", "42", "43", "44"];
const images = [
  "https://imgnike-a.akamaihd.net/branding/futebol/cdp-guia-chuteira/assets/img/p1.jpg",
  "https://wallpaper.dog/large/17003355.jpg",
  "https://images.mantosdofutebol.com.br/wp-content/uploads/2022/07/22SS_Social_TS_Football_Q3_Fastest-Pack_Future_Neymar_0247_16x9-1170x658.jpg",
  "https://brand.assets.adidas.com/image/upload/f_auto,q_auto:best,fl_lossy/global_main_pack_1_pure_victory_football_ss25_launch_plp_statement_card_4in_d_a2aec953c6.jpg",
  "https://brand.assets.adidas.com/image/upload/f_auto,q_auto:best,fl_lossy/global_main_pack_1_pure_victory_football_ss25_launch_plp_statement_card_2tf_d_e7c204e02b.jpg",
  "https://brand.assets.adidas.com/image/upload/f_auto,q_auto:best,fl_lossy/global_main_pack_1_pure_victory_football_ss25_launch_plp_statement_card_1fg_d_992232ca56.jpg",
];
const tagsList = ["leve", "conforto", "profissional", "amador", "promoção", "lançamento", "durável", "macia", "trendy", "clássica"];
const descriptions = [
  "Chuteira de alta performance para jogadores exigentes.",
  "Ideal para partidas em qualquer condição de campo.",
  "Tecnologia de amortecimento e conforto superior.",
  "Design inovador e materiais de última geração.",
  "Leveza e precisão para dribles rápidos.",
  "Ajuste perfeito e excelente tração.",
  "Inspirada nos grandes craques do futebol mundial.",
  "Durabilidade e estilo para todos os níveis de jogo.",
];
const materials = ["Couro sintético", "Malha têxtil", "Knit", "Microfibra", "Mesh", "Couro natural"];
const soles = ["Borracha", "TPU", "TR", "Poliuretano", "EVA"];
const closures = ["Cadarço", "Elástico", "Velcro", "Slip-on"];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomTags() {
  return Array.from(new Set(Array.from({ length: 3 + Math.floor(Math.random() * 3) }, () => randomFrom(tagsList))));
}
function randomDiscount() {
  return Math.random() > 0.5 ? Math.floor(Math.random() * 30) : 0;
}
function randomRating() {
  return Math.round((3 + Math.random() * 2) * 10) / 10;
}
function randomReviewCount() {
  return Math.floor(Math.random() * 80) + 5;
}
function randomSpec() {
  return {
    material: randomFrom(materials),
    sole: randomFrom(soles),
    weight: `${250 + Math.floor(Math.random() * 80)}g`,
    closure: randomFrom(closures),
  };
}
function randomReviews(productId: string) {
  const names = ["João", "Maria", "Carlos", "Ana", "Lucas", "Fernanda", "Pedro", "Juliana"];
  const comments = [
    "Excelente chuteira, super confortável!",
    "Gostei muito do design e da leveza.",
    "Entrega rápida e produto de qualidade.",
    "Ajustou perfeitamente no meu pé.",
    "Ótimo custo-benefício.",
    "Superou minhas expectativas!",
    "Recomendo para todos que jogam futebol.",
    "Material resistente e acabamento impecável.",
  ];
  return Array.from({ length: Math.max(2, Math.floor(Math.random() * 5)) }, () => ({
    id: Math.random().toString(36).substring(2, 10),
    productId,
    userId: Math.random().toString(36).substring(2, 10),
    userName: randomFrom(names),
    rating: Math.floor(3 + Math.random() * 2),
    comment: randomFrom(comments),
    createdAt: new Date(),
    updatedAt: new Date(),
    helpful: Math.floor(Math.random() * 10),
    images: [],
  }));
}

async function main() {
  let count = 0;
  for (const category of categories) {
    for (const brand of brands) {
      for (let i = 0; i < 8; i++) {
        const price = 199 + Math.floor(Math.random() * 400);
        const originalPrice = price + Math.floor(Math.random() * 100);
        const discount = randomDiscount();
        const rating = randomRating();
        const reviewCount = randomReviewCount();
        const specifications = randomSpec();
        const tags = randomTags();
        const description = randomFrom(descriptions);
        const productImages = [randomFrom(images)];
        const name = `${brand} ${randomFrom(lines)} ${category} ${sizes[Math.floor(Math.random() * sizes.length)]}`;
        const reviews = randomReviews("seed");
        await addDoc(collection(db, "products"), {
          name,
          description,
          price,
          originalPrice,
          images: productImages,
          category,
          brand,
          sizes,
          colors,
          inStock: true,
          stockQuantity: 10 + Math.floor(Math.random() * 30),
          rating,
          reviewCount,
          tags,
          isNew: Math.random() > 0.7,
          isOnSale: discount > 0,
          discountPercentage: discount,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: "seed-script",
          status: "active",
          specifications,
          shipping: {
            weight: 0.5 + Math.random(),
            dimensions: {
              length: 30 + Math.random() * 10,
              width: 20 + Math.random() * 5,
              height: 10 + Math.random() * 5,
            },
          },
          reviews,
        });
        count++;
        console.log(`Produto ${name} criado.`);
      }
    }
  }
  console.log(`Seed finalizado. ${count} produtos criados!`);
}

main(); 