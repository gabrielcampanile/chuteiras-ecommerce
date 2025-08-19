import { ProductService } from '../lib/services/productService';

async function testProducts() {
  console.log('🧪 Testando carregamento de produtos...');
  
  try {
    // Testar produtos de futsal
    console.log('\n📋 Testando produtos de futsal...');
    const futsalProducts = await ProductService.getProducts(
      { category: 'futsal' },
      { field: 'createdAt', direction: 'desc' },
      10
    );
    console.log(`✅ Produtos de futsal encontrados: ${futsalProducts.products.length}`);
    futsalProducts.products.forEach(product => {
      console.log(`  - ${product.name} (${product.brand})`);
    });

    // Testar produtos de society
    console.log('\n📋 Testando produtos de society...');
    const societyProducts = await ProductService.getProducts(
      { category: 'society' },
      { field: 'createdAt', direction: 'desc' },
      10
    );
    console.log(`✅ Produtos de society encontrados: ${societyProducts.products.length}`);
    societyProducts.products.forEach(product => {
      console.log(`  - ${product.name} (${product.brand})`);
    });

    // Testar produtos de campo
    console.log('\n📋 Testando produtos de campo...');
    const campoProducts = await ProductService.getProducts(
      { category: 'campo' },
      { field: 'createdAt', direction: 'desc' },
      10
    );
    console.log(`✅ Produtos de campo encontrados: ${campoProducts.products.length}`);
    campoProducts.products.forEach(product => {
      console.log(`  - ${product.name} (${product.brand})`);
    });

    // Testar todos os produtos
    console.log('\n📋 Testando todos os produtos...');
    const allProducts = await ProductService.getProducts(
      undefined,
      { field: 'createdAt', direction: 'desc' },
      10
    );
    console.log(`✅ Total de produtos encontrados: ${allProducts.products.length}`);
    
    console.log('\n🎉 Teste concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Executar o teste se o arquivo for executado diretamente
if (require.main === module) {
  testProducts();
}

export { testProducts }; 