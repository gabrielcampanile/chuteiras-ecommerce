# Configuração do Firebase

## 1. Criar projeto no Firebase Console

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Digite o nome do projeto (ex: "chuteiras-ecommerce")
4. Siga os passos para criar o projeto

## 2. Configurar Firestore Database

1. No console do Firebase, vá para "Firestore Database"
2. Clique em "Criar banco de dados"
3. Escolha "Iniciar no modo de teste" (para desenvolvimento)
4. Escolha a localização mais próxima (ex: us-central1)

## 3. Configurar Authentication (opcional para esta fase)

1. No console do Firebase, vá para "Authentication"
2. Clique em "Começar"
3. Habilite "Email/Password" como provedor

## 4. Configurar Storage (opcional para esta fase)

1. No console do Firebase, vá para "Storage"
2. Clique em "Começar"
3. Escolha a localização mais próxima

## 5. Obter configuração do projeto

1. No console do Firebase, clique na engrenagem (⚙️) ao lado de "Visão geral do projeto"
2. Selecione "Configurações do projeto"
3. Role para baixo até "Seus aplicativos"
4. Clique em "Adicionar app" e escolha "Web"
5. Digite um nome para o app (ex: "chuteiras-web")
6. Copie as configurações

## 6. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=seu_app_id
```

## 7. Regras de Segurança do Firestore

Configure as regras de segurança no Firestore. Para desenvolvimento, você pode usar:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura de produtos ativos para todos
    match /products/{productId} {
      allow read: if resource.data.status == 'active';
      allow write: if request.auth != null && request.auth.uid == resource.data.createdBy;
    }

    // Permitir leitura de categorias e marcas
    match /categories/{categoryId} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /brands/{brandId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 8. Estrutura de Dados

O Firestore será organizado da seguinte forma:

```
/products/{productId}
  - name: string
  - description: string
  - price: number
  - originalPrice: number
  - images: string[]
  - category: string
  - brand: string
  - sizes: string[]
  - colors: string[]
  - inStock: boolean
  - stockQuantity: number
  - rating: number
  - reviewCount: number
  - tags: string[]
  - isNew: boolean
  - isOnSale: boolean
  - discountPercentage: number
  - createdAt: timestamp
  - updatedAt: timestamp
  - createdBy: string (userId)
  - status: 'active' | 'inactive' | 'draft'
  - specifications: map
  - shipping: map

/reviews/{reviewId}
  - productId: string
  - userId: string
  - userName: string
  - rating: number
  - comment: string
  - createdAt: timestamp
  - updatedAt: timestamp
  - helpful: number
  - images: string[]

/users/{userId}
  - email: string
  - name: string
  - role: 'admin' | 'seller' | 'customer'
  - createdAt: timestamp
  - updatedAt: timestamp
```

## 9. Testar a configuração

Após configurar tudo, execute:

```bash
npm run dev
```

A aplicação deve iniciar sem erros relacionados ao Firebase.

## 10. Próximos passos

1. Implementar autenticação de usuários
2. Criar interface para gerenciamento de produtos
3. Implementar sistema de reviews
4. Adicionar sistema de favoritos
5. Implementar carrinho de compras
6. Adicionar sistema de pagamento
