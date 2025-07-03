# 🥅 Chuteiras E-commerce - Sistema de Vendas Esportivas

Um sistema de e-commerce moderno especializado em artigos esportivos, com foco em chuteiras de futebol. Desenvolvido como projeto final para a disciplina de Aspectos e Implementação de Banco de Dados, utilizando tecnologias web modernas e Firebase como banco de dados NoSQL.

## 🎯 Visão Geral

Este projeto é uma plataforma completa de e-commerce que permite a gestão e venda de produtos esportivos, oferecendo uma experiência de usuário moderna e responsiva. O sistema utiliza Next.js como framework principal e Firebase Firestore como banco de dados não-relacional.

## 🚀 Tecnologias Utilizadas

### Frontend

- **Next.js 15.2.4** - Framework React para desenvolvimento full-stack
- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Tailwind CSS** - Framework utilitário para estilização
- **Radix UI** - Componentes acessíveis e não-estilizados
- **Lucide React** - Ícones modernos e customizáveis

### Backend e Banco de Dados

- **Firebase 11.9.1** - Plataforma de desenvolvimento Google
- **Firestore** - Banco de dados NoSQL em tempo real
- **Firebase Auth** - Sistema de autenticação
- **Firebase Storage** - Armazenamento de arquivos

### Ferramentas de Desenvolvimento

- **ESLint** - Linter para qualidade de código
- **PostCSS** - Processador de CSS
- **TSX** - Executor TypeScript para scripts

## 🏗️ Arquitetura do Projeto

```
chuteiras-ecommerce/
├── 📁 app/                    # Páginas e rotas (App Router)
│   ├── 📄 layout.tsx         # Layout principal
│   ├── 📄 page.tsx           # Página inicial
│   ├── 📁 admin/             # Área administrativa
│   ├── 📁 produtos/          # Catálogo de produtos
│   ├── 📁 carrinho/          # Carrinho de compras
│   └── 📁 [outras-rotas]/    # Demais páginas
├── 📁 components/            # Componentes reutilizáveis
│   ├── 📁 ui/               # Componentes base do design system
│   ├── 📁 product/          # Componentes específicos de produtos
│   ├── 📁 cart/             # Componentes do carrinho
│   └── 📁 layout/           # Componentes de layout
├── 📁 lib/                  # Bibliotecas e utilitários
│   ├── 📄 firebase.ts       # Configuração do Firebase
│   ├── 📄 utils.ts          # Funções utilitárias
│   └── 📁 services/         # Serviços de API
├── 📁 types/                # Definições de tipos TypeScript
├── 📁 hooks/                # Custom hooks React
├── 📁 data/                 # Dados mockados e constantes
└── 📁 scripts/              # Scripts de desenvolvimento
```

## 📊 Modelo de Dados (Firestore)

### Coleção: `products`

```typescript
interface Product {
  id: string; // ID único do documento
  name: string; // Nome do produto
  description: string; // Descrição detalhada
  price: number; // Preço atual
  originalPrice?: number; // Preço original (para promoções)
  images: string[]; // URLs das imagens
  category: string; // Categoria (campo, society, futsal)
  brand: string; // Marca (Nike, Adidas, Puma, etc.)
  sizes: string[]; // Tamanhos disponíveis
  colors: string[]; // Cores disponíveis
  inStock: boolean; // Se está em estoque
  stockQuantity: number; // Quantidade em estoque
  rating: number; // Avaliação média
  reviewCount: number; // Número de avaliações
  tags: string[]; // Tags para busca
  isNew: boolean; // Se é produto novo
  isOnSale: boolean; // Se está em promoção
  discountPercentage?: number; // Percentual de desconto
  createdAt: Date; // Data de criação
  updatedAt: Date; // Data de atualização
  createdBy: string; // ID do criador
  status: "active" | "inactive" | "draft"; // Status do produto
  specifications: {
    // Especificações técnicas
    material?: string;
    sole?: string;
    weight?: string;
    closure?: string;
  };
  shipping: {
    // Informações de envio
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
  };
}
```

### Características do Banco NoSQL

O Firebase Firestore oferece:

- **Flexibilidade de Schema**: Permite adicionar campos sem migração
- **Consultas em Tempo Real**: Sincronização automática de dados
- **Escalabilidade**: Escala automaticamente conforme o uso
- **Indexação Automática**: Otimização automática de consultas
- **Segurança**: Regras de segurança integradas

## 🔧 Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- npm ou pnpm
- Conta no Firebase

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd chuteiras-ecommerce
```

### 2. Instale as dependências

```bash
npm install
# ou
pnpm install
```

### 3. Configure o Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com)
2. Configure o Firestore Database
3. Copie as credenciais para `lib/firebase.ts`

### 4. Execute o projeto

```bash
npm run dev
# ou
pnpm dev
```

### 5. Popule o banco de dados (opcional)

```bash
npm run seed
# ou
pnpm seed
```

## 📱 Funcionalidades

### Para Usuários

- ✅ **Catálogo de Produtos**: Navegação por categorias e filtros
- ✅ **Busca Avançada**: Filtros por marca, preço, tamanho, cor
- ✅ **Detalhes do Produto**: Galeria de imagens, especificações
- ✅ **Carrinho de Compras**: Adicionar, remover, calcular totais
- ✅ **Lista de Favoritos**: Salvar produtos de interesse
- ✅ **Responsivo**: Otimizado para mobile e desktop

### Para Administradores

- ✅ **Gestão de Produtos**: Criar, editar, excluir produtos
- ✅ **Controle de Estoque**: Gerenciar quantidades
- ✅ **Categorização**: Organizar produtos por categoria/marca
- ✅ **Status de Produtos**: Ativar/desativar produtos

## 🎨 Interface e Design

O projeto utiliza um design system baseado em:

- **Tailwind CSS**: Para estilização utilitária e responsiva
- **Radix UI**: Para componentes acessíveis (modais, dropdowns, etc.)
- **Design Responsivo**: Funciona perfeitamente em todos os dispositivos
- **Dark/Light Mode**: Suporte a temas claro e escuro
- **Animações Suaves**: Transições e micro-interações

## 🔍 Principais Consultas do Banco

### 1. Buscar Produtos Ativos

```typescript
const q = query(
  collection(db, "products"),
  where("status", "==", "active"),
  orderBy("createdAt", "desc")
);
```

### 2. Filtrar por Categoria

```typescript
const q = query(
  collection(db, "products"),
  where("category", "==", "campo"),
  where("status", "==", "active")
);
```

### 3. Produtos em Promoção

```typescript
const q = query(
  collection(db, "products"),
  where("isOnSale", "==", true),
  where("status", "==", "active"),
  orderBy("discountPercentage", "desc")
);
```

### 4. Busca com Filtros Múltiplos

```typescript
const q = query(
  collection(db, "products"),
  where("brand", "==", "Nike"),
  where("inStock", "==", true),
  where("price", ">=", 100),
  where("price", "<=", 500)
);
```

## 📈 Vantagens do Firebase Firestore

### 1. **Tempo Real**

- Sincronização automática entre cliente e servidor
- Atualizações instantâneas na interface

### 2. **Escalabilidade**

- Escala automaticamente conforme demanda
- Sem necessidade de configurar servidores

### 3. **Flexibilidade**

- Schema flexível para adicionar novos campos
- Estrutura de dados adaptável

### 4. **Performance**

- Consultas otimizadas automaticamente
- Cache offline para melhor experiência

### 5. **Segurança**

- Regras de segurança declarativas
- Autenticação integrada

## 🚦 Scripts Disponíveis

```bash
# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm run start

# Executar linter
npm run lint

# Popular banco com produtos de exemplo
npm run seed
```

## 📝 Estrutura de Pastas Detalhada

### `/app` - Páginas e Rotas

Utiliza o App Router do Next.js 13+ para roteamento baseado em pastas.

### `/components` - Componentes React

- **ui/**: Componentes base reutilizáveis
- **product/**: Componentes específicos para produtos
- **cart/**: Componentes do carrinho de compras
- **layout/**: Header, footer e layouts

### `/lib` - Configurações e Serviços

- **firebase.ts**: Configuração do Firebase
- **services/**: Serviços para comunicação com Firestore
- **utils.ts**: Funções utilitárias

### `/types` - Tipagem TypeScript

Definições de tipos para garantir type safety.

### `/hooks` - Custom Hooks

Hooks personalizados para lógica de estado e efeitos.

## 🔮 Próximos Passos

- [ ] Sistema de autenticação completo
- [ ] Processamento de pagamentos
- [ ] Sistema de avaliações
- [ ] Dashboard administrativo avançado
- [ ] Notificações em tempo real
- [ ] API REST para integrações

## 📚 Recursos de Aprendizado

Este projeto demonstra conceitos importantes:

- **Banco de Dados NoSQL**: Modelagem e consultas no Firestore
- **React/Next.js**: Framework moderno para desenvolvimento web
- **TypeScript**: Desenvolvimento type-safe
- **Design Systems**: Componentização e reutilização
- **Responsive Design**: Interface adaptativa

## 🤝 Contribuição

Este é um projeto acadêmico desenvolvido para demonstrar conhecimentos em banco de dados NoSQL e desenvolvimento web moderno.

## 📄 Licença

Projeto acadêmico - Disciplina de Aspectos e Implementação de Banco de Dados.

---

**Desenvolvido por Gabriel Belchior para demonstrar a aplicação prática de conceitos de banco de dados NoSQL com Firebase Firestore.**
