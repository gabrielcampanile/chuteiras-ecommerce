import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { Product, ProductFilter, ProductSort } from '../../types/product';

const PRODUCTS_COLLECTION = 'products';

export class ProductService {
  // Buscar todos os produtos ativos
  static async getProducts(
    filters?: ProductFilter,
    sort?: ProductSort,
    pageSize: number = 20,
    lastDoc?: QueryDocumentSnapshot<DocumentData>
  ): Promise<{ products: Product[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null }> {
    try {
      let q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('status', '==', 'active')
      );

      // Aplicar filtros
      if (filters) {
        if (filters.category) {
          q = query(q, where('category', '==', filters.category));
        }
        if (filters.brand) {
          q = query(q, where('brand', '==', filters.brand));
        }
        if (filters.inStock !== undefined) {
          q = query(q, where('inStock', '==', filters.inStock));
        }
        if (filters.isNew !== undefined) {
          q = query(q, where('isNew', '==', filters.isNew));
        }
        if (filters.isOnSale !== undefined) {
          q = query(q, where('isOnSale', '==', filters.isOnSale));
        }
        if (filters.rating) {
          q = query(q, where('rating', '>=', filters.rating));
        }
      }

      // Aplicar ordenação
      if (sort) {
        q = query(q, orderBy(sort.field, sort.direction));
      } else {
        q = query(q, orderBy('createdAt', 'desc'));
      }

      // Paginação
      q = query(q, limit(pageSize));
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const products: Product[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Product);
      });

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

      return { products, lastDoc: lastVisible };
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      throw new Error('Falha ao carregar produtos');
    }
  }

  // Buscar produto por ID
  static async getProductById(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Product;
      }

      return null;
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      throw new Error('Falha ao carregar produto');
    }
  }

  // Criar novo produto
  static async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<string> {
    try {
      const productToCreate = {
        ...productData,
        createdBy: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: 'active',
        rating: 0,
        reviewCount: 0,
      };

      const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), productToCreate);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      throw new Error('Falha ao criar produto');
    }
  }

  // Atualizar produto
  static async updateProduct(id: string, updates: Partial<Product>, userId: string): Promise<void> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Produto não encontrado');
      }

      const productData = docSnap.data();
      
      // Verificar se o usuário tem permissão para editar
      if (productData.createdBy !== userId) {
        throw new Error('Sem permissão para editar este produto');
      }

      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw new Error('Falha ao atualizar produto');
    }
  }

  // Deletar produto (soft delete)
  static async deleteProduct(id: string, userId: string): Promise<void> {
    try {
      const docRef = doc(db, PRODUCTS_COLLECTION, id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Produto não encontrado');
      }

      const productData = docSnap.data();
      
      // Verificar se o usuário tem permissão para deletar
      if (productData.createdBy !== userId) {
        throw new Error('Sem permissão para deletar este produto');
      }

      // Soft delete - apenas marca como inativo
      await updateDoc(docRef, {
        status: 'inactive',
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      throw new Error('Falha ao deletar produto');
    }
  }

  // Buscar produtos por categoria
  static async getProductsByCategory(category: string, limit: number = 20): Promise<Product[]> {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('category', '==', category),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );

      const querySnapshot = await getDocs(q);
      const products: Product[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Product);
      });

      return products;
    } catch (error) {
      console.error('Erro ao buscar produtos por categoria:', error);
      throw new Error('Falha ao carregar produtos da categoria');
    }
  }

  // Buscar produtos em promoção
  static async getProductsOnSale(limit: number = 20): Promise<Product[]> {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('isOnSale', '==', true),
        where('status', '==', 'active'),
        orderBy('discountPercentage', 'desc'),
        limit(limit)
      );

      const querySnapshot = await getDocs(q);
      const products: Product[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Product);
      });

      return products;
    } catch (error) {
      console.error('Erro ao buscar produtos em promoção:', error);
      throw new Error('Falha ao carregar produtos em promoção');
    }
  }

  // Buscar produtos novos
  static async getNewProducts(limit: number = 20): Promise<Product[]> {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('isNew', '==', true),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );

      const querySnapshot = await getDocs(q);
      const products: Product[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Product);
      });

      return products;
    } catch (error) {
      console.error('Erro ao buscar produtos novos:', error);
      throw new Error('Falha ao carregar produtos novos');
    }
  }

  // Buscar produtos por marca
  static async getProductsByBrand(brand: string, limit: number = 20): Promise<Product[]> {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('brand', '==', brand),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );

      const querySnapshot = await getDocs(q);
      const products: Product[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Product);
      });

      return products;
    } catch (error) {
      console.error('Erro ao buscar produtos por marca:', error);
      throw new Error('Falha ao carregar produtos da marca');
    }
  }

  static async getFeaturedProducts(limitCount = 8) {
    const productsRef = collection(db, 'products');
    let q = query(productsRef, orderBy('createdAt', 'desc'), limit(limitCount));
    // Se quiser filtrar por destaque, descomente a linha abaixo e ajuste o campo
    // q = query(productsRef, where('isFeatured', '==', true), limit(limitCount));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
} 