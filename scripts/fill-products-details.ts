import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

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
const tagsList = ["leve", "conforto", "profissional", "amador", "promoção", "lançamento", "durável", "macia", "trendy", "clássica"];

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
function randomReview(productId: string) {
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
  return {
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
  };
}

async function main() {
  const productsCol = collection(db, "products");
  const snapshot = await getDocs(productsCol);
  for (const docSnap of snapshot.docs) {
    const product = docSnap.data();
    const discount = randomDiscount();
    const rating = randomRating();
    const reviewCount = randomReviewCount();
    const specifications = randomSpec();
    const tags = randomTags();
    const description = randomFrom(descriptions);
    const reviews = Array.from({ length: Math.max(2, Math.floor(Math.random() * 5)) }, () => randomReview(docSnap.id));
    await updateDoc(docSnap.ref, {
      description,
      specifications,
      tags,
      discountPercentage: discount,
      isOnSale: discount > 0,
      rating,
      reviewCount,
      reviews,
    });
    console.log(`Produto ${docSnap.id} atualizado.`);
  }
  console.log("Todos os produtos foram preenchidos com dados aleatórios!");
}

main(); 