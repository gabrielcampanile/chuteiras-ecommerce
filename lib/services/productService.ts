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
      let appliedInequality: 'price' | 'sizes' | 'colors' | null = null;
      if (filters) {
        if (filters.category) {
          if (Array.isArray(filters.category)) {
            if (filters.category.length === 1) {
              q = query(q, where('category', '==', filters.category[0]));
            } else if (filters.category.length > 1) {
              q = query(q, where('category', 'in', filters.category));
            }
          } else {
            q = query(q, where('category', '==', filters.category));
          }
        }
        if (filters.brand) {
          if (Array.isArray(filters.brand)) {
            if (filters.brand.length === 1) {
              q = query(q, where('brand', '==', filters.brand[0]));
            } else if (filters.brand.length > 1) {
              q = query(q, where('brand', 'in', filters.brand));
            }
          } else {
            q = query(q, where('brand', '==', filters.brand));
          }
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
        // Range/inequality: priorize price, depois sizes, depois colors
        if (filters.priceRange && (filters.priceRange.min > 0 || filters.priceRange.max < 2000)) {
          q = query(q, where('price', '>=', filters.priceRange.min));
          q = query(q, where('price', '<=', filters.priceRange.max));
          appliedInequality = 'price';
        } else if (filters.sizes && filters.sizes.length > 0) {
          q = query(q, where('sizes', 'array-contains-any', filters.sizes));
          appliedInequality = 'sizes';
        } else if (filters.colors && filters.colors.length > 0) {
          q = query(q, where('colors', 'array-contains-any', filters.colors));
          appliedInequality = 'colors';
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
      let products: Product[] = [];



      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Product);
      });



      // Aplicar busca no frontend se necessário
      if (filters?.search) {
        const searchTerm = filters.search.toLowerCase();
        products = products.filter((product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm) ||
          (product.tags && product.tags.some((tag: string) =>
            tag.toLowerCase().includes(searchTerm)
          ))
        );
      }

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

      // const productData = docSnap.data();
      
      // // Verificar se o usuário tem permissão para editar
      // if (productData.createdBy !== userId) {
      //   throw new Error('Sem permissão para editar este produto');
      // }

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

      // const productData = docSnap.data();
      
      // // Verificar se o usuário tem permissão para deletar
      // if (productData.createdBy !== userId) {
      //   throw new Error('Sem permissão para deletar este produto');
      // }

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
  static async getProductsByCategory(category: string, limitCount: number = 20): Promise<Product[]> {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('category', '==', category),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
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
  static async getProductsOnSale(limitCount: number = 20): Promise<Product[]> {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('isOnSale', '==', true),
        where('status', '==', 'active'),
        orderBy('discountPercentage', 'desc'),
        limit(limitCount)
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
  static async getNewProducts(limitCount: number = 20): Promise<Product[]> {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('isNew', '==', true),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
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
  static async getProductsByBrand(brand: string, limitCount: number = 20): Promise<Product[]> {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('brand', '==', brand),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
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

  // Buscar produtos em destaque
  static async getFeaturedProducts(limitCount = 8) {
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        where('status', '==', 'active'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
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
      console.error('Erro ao buscar produtos em destaque:', error);
      throw new Error('Falha ao carregar produtos em destaque');
    }
  }

  // Mock para reviews de produto
  static async getProductReviews(productId: string): Promise<any[]> {
    // Retorne vazio por enquanto
    return [];
  }
} 