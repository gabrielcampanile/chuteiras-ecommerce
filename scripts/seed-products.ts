import { ProductService } from '../lib/services/productService';

const sampleProducts = [
  {
    name: "Nike Mercurial Vapor 15 Elite FG",
    description: "Chuteira de velocidade para jogadores que priorizam agilidade e explosão. Tecnologia Flyknit oferece ajuste perfeito e leveza incomparável.",
    price: 899.9,
    originalPrice: 1199.9,
    images: ["/placeholder.svg?height=300&width=300"],
    category: "campo",
    brand: "Nike",
    sizes: ["39", "40", "41", "42", "43"],
    colors: ["Preto", "Branco", "Azul"],
    inStock: true,
    stockQuantity: 15,
    rating: 4.8,
    reviewCount: 124,
    tags: ["nike", "mercurial", "vapor", "elite", "campo", "velocidade", "profissional"],
    isNew: true,
    isOnSale: true,
    discountPercentage: 25,
    specifications: {
      material: "Flyknit",
      sole: "FG (Firm Ground)",
      weight: "180g",
      closure: "Lace-up"
    },
    shipping: {
      weight: 0.5,
      dimensions: {
        length: 30,
        width: 20,
        height: 15
      }
    }
  },
  {
    name: "Adidas Predator Accuracy.1 Low FG",
    description: "Chuteira focada em controle e precisão. Tecnologia Demonskin 2.0 oferece controle excepcional da bola.",
    price: 749.9,
    originalPrice: 999.9,
    images: ["/placeholder.svg?height=300&width=300"],
    category: "campo",
    brand: "Adidas",
    sizes: ["38", "39", "40", "41", "42"],
    colors: ["Preto", "Vermelho"],
    inStock: true,
    stockQuantity: 12,
    rating: 4.9,
    reviewCount: 89,
    tags: ["adidas", "predator", "accuracy", "campo", "controle", "precisão"],
    isNew: false,
    isOnSale: true,
    discountPercentage: 25,
    specifications: {
      material: "Primeknit",
      sole: "FG (Firm Ground)",
      weight: "200g",
      closure: "Lace-up"
    },
    shipping: {
      weight: 0.6,
      dimensions: {
        length: 32,
        width: 22,
        height: 16
      }
    }
  },
  {
    name: "Puma Future 7.1 Netfit FG/AG",
    description: "Chuteira adaptável com sistema Netfit que permite personalização do ajuste. Ideal para jogadores que buscam conforto personalizado.",
    price: 649.9,
    originalPrice: 849.9,
    images: ["/placeholder.svg?height=300&width=300"],
    category: "campo",
    brand: "Puma",
    sizes: ["39", "40", "41", "42"],
    colors: ["Verde", "Preto"],
    inStock: true,
    stockQuantity: 8,
    rating: 4.7,
    reviewCount: 156,
    tags: ["puma", "future", "netfit", "campo", "adaptável", "personalização"],
    isNew: true,
    isOnSale: true,
    discountPercentage: 23,
    specifications: {
      material: "evoKNIT",
      sole: "FG/AG (Firm Ground/Artificial Grass)",
      weight: "190g",
      closure: "Netfit"
    },
    shipping: {
      weight: 0.55,
      dimensions: {
        length: 31,
        width: 21,
        height: 15
      }
    }
  },
  {
    name: "Mizuno Morelia Neo IV Beta Japan",
    description: "Chuteira premium feita no Japão com couro de alta qualidade. Tradição e qualidade em um produto excepcional.",
    price: 1299.9,
    originalPrice: 1299.9,
    images: ["/placeholder.svg?height=300&width=300"],
    category: "campo",
    brand: "Mizuno",
    sizes: ["39", "40", "41", "42", "43"],
    colors: ["Preto"],
    inStock: true,
    stockQuantity: 5,
    rating: 4.9,
    reviewCount: 67,
    tags: ["mizuno", "morelia", "neo", "japan", "campo", "couro", "tradicional"],
    isNew: true,
    isOnSale: false,
    discountPercentage: 0,
    specifications: {
      material: "Couro Kangaroo",
      sole: "FG (Firm Ground)",
      weight: "170g",
      closure: "Lace-up"
    },
    shipping: {
      weight: 0.45,
      dimensions: {
        length: 29,
        width: 19,
        height: 14
      }
    }
  },
  {
    name: "Nike Phantom GX Elite FG",
    description: "Chuteira de toque com tecnologia Gripknit que oferece controle excepcional da bola em qualquer condição.",
    price: 799.9,
    originalPrice: 1099.9,
    images: ["/placeholder.svg?height=300&width=300"],
    category: "campo",
    brand: "Nike",
    sizes: ["38", "39", "40", "41", "42", "43"],
    colors: ["Branco", "Azul"],
    inStock: true,
    stockQuantity: 18,
    rating: 4.6,
    reviewCount: 203,
    tags: ["nike", "phantom", "elite", "campo", "toque", "precisão"],
    isNew: false,
    isOnSale: true,
    discountPercentage: 27,
    specifications: {
      material: "Gripknit",
      sole: "FG (Firm Ground)",
      weight: "185g",
      closure: "Lace-up"
    },
    shipping: {
      weight: 0.52,
      dimensions: {
        length: 30,
        width: 20,
        height: 15
      }
    }
  },
  {
    name: "Nike Mercurial Vapor 15 Academy IC",
    description: "Chuteira de futsal com design aerodinâmico e tecnologia de velocidade. Ideal para jogadores de quadra.",
    price: 299.9,
    originalPrice: 399.9,
    images: ["/placeholder.svg?height=300&width=300"],
    category: "futsal",
    brand: "Nike",
    sizes: ["38", "39", "40", "41", "42"],
    colors: ["Preto", "Branco"],
    inStock: true,
    stockQuantity: 25,
    rating: 4.5,
    reviewCount: 87,
    tags: ["nike", "mercurial", "vapor", "futsal", "quadra", "indoor"],
    isNew: false,
    isOnSale: true,
    discountPercentage: 25,
    specifications: {
      material: "Synthetic",
      sole: "IC (Indoor Court)",
      weight: "150g",
      closure: "Lace-up"
    },
    shipping: {
      weight: 0.3,
      dimensions: {
        length: 28,
        width: 18,
        height: 12
      }
    }
  },
  {
    name: "Adidas Predator Freak.4 IN",
    description: "Chuteira de futsal com tecnologia Demonskin para controle excepcional. Design agressivo e funcional.",
    price: 249.9,
    originalPrice: 329.9,
    images: ["/placeholder.svg?height=300&width=300"],
    category: "futsal",
    brand: "Adidas",
    sizes: ["37", "38", "39", "40", "41"],
    colors: ["Azul", "Preto"],
    inStock: true,
    stockQuantity: 20,
    rating: 4.4,
    reviewCount: 156,
    tags: ["adidas", "predator", "freak", "futsal", "quadra", "controle"],
    isNew: false,
    isOnSale: true,
    discountPercentage: 24,
    specifications: {
      material: "Synthetic",
      sole: "IN (Indoor)",
      weight: "160g",
      closure: "Lace-up"
    },
    shipping: {
      weight: 0.35,
      dimensions: {
        length: 29,
        width: 19,
        height: 13
      }
    }
  },
  {
    name: "Nike Mercurial Vapor 15 Academy TF",
    description: "Chuteira para society com solado TF (Turf) ideal para grama sintética. Velocidade e conforto em um só produto.",
    price: 349.9,
    originalPrice: 449.9,
    images: ["/placeholder.svg?height=300&width=300"],
    category: "society",
    brand: "Nike",
    sizes: ["38", "39", "40", "41", "42", "43"],
    colors: ["Verde", "Preto"],
    inStock: true,
    stockQuantity: 22,
    rating: 4.6,
    reviewCount: 134,
    tags: ["nike", "mercurial", "vapor", "society", "grama sintética", "tf"],
    isNew: false,
    isOnSale: true,
    discountPercentage: 22,
    specifications: {
      material: "Synthetic",
      sole: "TF (Turf)",
      weight: "170g",
      closure: "Lace-up"
    },
    shipping: {
      weight: 0.4,
      dimensions: {
        length: 30,
        width: 20,
        height: 14
      }
    }
  }
];

async function seedProducts() {
  console.log('🌱 Iniciando seed de produtos...');
  
  try {
    // ID temporário para o seed (será substituído pelo sistema de autenticação)
    const tempUserId = 'seed-user-id';
    
    for (const product of sampleProducts) {
      const productId = await ProductService.createProduct(product, tempUserId);
      console.log(`✅ Produto criado: ${product.name} (ID: ${productId})`);
    }
    
    console.log('🎉 Seed de produtos concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  }
}

// Executar o seed se o arquivo for executado diretamente
if (require.main === module) {
  seedProducts();
}

export { seedProducts }; 