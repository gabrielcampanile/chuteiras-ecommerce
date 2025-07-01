import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const productNames = [
  'Mizuno Morelia Neo Sala β',
  'Topper Max 1000',
  'Nike Mercurial Vapor 16 Academy',
  'Adidas Predator Elite',
  'Nike Mercurial Vapor 15 Academy',
  'Nike Phantom GX 2 Elite Campo',
  'Mizuno Morelia DNA Japan',
  'PUMA x NEYMAR FUTURE 7 ULTIMATE "BNA"',
  'Adidas F50+',
  'Nike Air Zoom Mercurial Vapor 16 Elite Vini Jr',
];

async function restoreProducts() {
  for (const name of productNames) {
    try {
      await addDoc(collection(db, 'products'), {
        name,
        createdAt: serverTimestamp(),
      });
      console.log(`✅ Produto criado: ${name}`);
    } catch (error) {
      console.error(`❌ Erro ao criar produto: ${name}`, error);
    }
  }
  console.log('🟢 Todos os produtos foram recriados!');
}

restoreProducts(); 