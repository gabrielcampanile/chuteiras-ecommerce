import { ProductService } from '../lib/services/productService';

async function testHook() {
  console.log('🔍 Testando hook useProducts...');
  
  try {
    // Simular o que o hook faz
    console.log('\n📋 Testando filtro de Futsal (como o hook faria)...');
    
    // Primeira chamada - reset
    const result1 = await ProductService.getProducts(
      { category: 'Futsal' },
      { field: 'createdAt', direction: 'desc' },
      20,
      undefined // reset
    );
    console.log(`✅ Primeira chamada - Produtos encontrados: ${result1.products.length}`);
    result1.products.forEach(product => {
      console.log(`  - ${product.name} (${product.brand})`);
    });

    // Segunda chamada - loadMore
    if (result1.products.length === 20) {
      console.log('\n📋 Testando loadMore...');
      const result2 = await ProductService.getProducts(
        { category: 'Futsal' },
        { field: 'createdAt', direction: 'desc' },
        20,
        result1.lastDoc
      );
      console.log(`✅ Segunda chamada - Produtos encontrados: ${result2.products.length}`);
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Executar o teste se o arquivo for executado diretamente
if (require.main === module) {
  testHook();
}

export { testHook }; 