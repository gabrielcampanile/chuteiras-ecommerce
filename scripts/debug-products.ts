import { ProductService } from '../lib/services/productService';

async function debugProducts() {
  console.log('🔍 Debugando produtos no banco de dados...');
  
  try {
    // Buscar todos os produtos
    const allProducts = await ProductService.getProducts(
      undefined,
      { field: 'createdAt', direction: 'desc' },
      50
    );
    
    console.log(`\n📊 Total de produtos encontrados: ${allProducts.products.length}`);
    
    // Agrupar por categoria
    const categories = {};
    allProducts.products.forEach(product => {
      const category = product.category || 'sem categoria';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(product);
    });
    
    console.log('\n📋 Produtos por categoria:');
    Object.keys(categories).forEach(category => {
      console.log(`\n${category.toUpperCase()} (${categories[category].length} produtos):`);
      categories[category].forEach(product => {
        console.log(`  - ${product.name} (${product.brand}) - Categoria: "${product.category}"`);
      });
    });
    
    // Verificar se há produtos com categorias em diferentes formatos
    console.log('\n🔍 Verificando formatos de categoria:');
    const uniqueCategories = [...new Set(allProducts.products.map(p => p.category))];
    uniqueCategories.forEach(cat => {
      const count = allProducts.products.filter(p => p.category === cat).length;
      console.log(`  "${cat}": ${count} produtos`);
    });
    
  } catch (error) {
    console.error('❌ Erro durante o debug:', error);
  }
}

// Executar o debug se o arquivo for executado diretamente
if (require.main === module) {
  debugProducts();
}

export { debugProducts }; 