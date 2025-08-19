import { ProductService } from '../lib/services/productService';

async function testFilter() {
  console.log('🔍 Testando filtro de categoria...');
  
  try {
    // Testar com categoria exata
    console.log('\n📋 Testando filtro "Futsal"...');
    const futsalProducts = await ProductService.getProducts(
      { category: 'Futsal' },
      { field: 'createdAt', direction: 'desc' },
      10
    );
    console.log(`✅ Produtos de Futsal encontrados: ${futsalProducts.products.length}`);
    futsalProducts.products.forEach(product => {
      console.log(`  - ${product.name} (${product.brand}) - Categoria: "${product.category}"`);
    });

    // Testar com array de categorias
    console.log('\n📋 Testando filtro com array ["Futsal"]...');
    const futsalArrayProducts = await ProductService.getProducts(
      { category: ['Futsal'] },
      { field: 'createdAt', direction: 'desc' },
      10
    );
    console.log(`✅ Produtos de Futsal (array) encontrados: ${futsalArrayProducts.products.length}`);
    futsalArrayProducts.products.forEach(product => {
      console.log(`  - ${product.name} (${product.brand}) - Categoria: "${product.category}"`);
    });

    // Testar sem filtro para comparar
    console.log('\n📋 Testando sem filtro...');
    const allProducts = await ProductService.getProducts(
      undefined,
      { field: 'createdAt', direction: 'desc' },
      10
    );
    console.log(`✅ Total de produtos encontrados: ${allProducts.products.length}`);
    
    // Mostrar categorias dos produtos retornados
    const categories = [...new Set(allProducts.products.map(p => p.category))];
    console.log(`📊 Categorias encontradas: ${categories.join(', ')}`);
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Executar o teste se o arquivo for executado diretamente
if (require.main === module) {
  testFilter();
}

export { testFilter }; 