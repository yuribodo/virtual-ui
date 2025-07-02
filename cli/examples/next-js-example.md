# Exemplo Next.js com Virtual UI

Este exemplo mostra como usar Virtual UI em um projeto Next.js.

## Configuração Inicial

```bash
# 1. Criar novo projeto Next.js
npx create-next-app@latest my-virtual-ui-app --typescript --tailwind --eslint --app

# 2. Navegar para o diretório
cd my-virtual-ui-app

# 3. Inicializar Virtual UI
npx virtual-ui init

# 4. Adicionar componentes
npx virtual-ui add parallax-card
```

## Estrutura do Projeto

```
my-virtual-ui-app/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/
│       └── parallax-card.tsx
├── lib/
│   └── utils.ts
├── virtual-ui.json
├── tailwind.config.js
└── package.json
```

## Exemplo de Uso Básico

### app/page.tsx

```tsx
import { ParallaxCard } from '@/components/ui/parallax-card';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Virtual UI Components
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Componentes interativos com efeitos incríveis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ParallaxCard
            title="Produto Premium"
            description="Um produto incrível com tecnologia de ponta e design moderno."
            image="https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400"
            variant="default"
            onClick={() => alert('Produto clicado!')}
          />

          <ParallaxCard
            title="Serviço Profissional"
            description="Serviços de alta qualidade para sua empresa crescer."
            variant="glass"
            parallaxSpeed={12}
            onClick={() => alert('Serviço clicado!')}
          />

          <ParallaxCard
            title="Solução Inovadora"
            description="Tecnologia que transforma ideias em realidade."
            variant="gradient"
            parallaxSpeed={15}
          >
            <div className="flex gap-2 mt-4">
              <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Saiba Mais
              </button>
              <button className="px-4 py-2 border border-white/30 text-white rounded-lg font-medium hover:bg-white/10 transition-colors">
                Contato
              </button>
            </div>
          </ParallaxCard>
        </div>
      </div>
    </main>
  );
}
```

## Exemplo com Estado e Interatividade

### app/interactive/page.tsx

```tsx
'use client';

import { useState } from 'react';
import { ParallaxCard } from '@/components/ui/parallax-card';

interface Product {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  variant: 'default' | 'glass' | 'gradient' | 'shadow' | 'neon';
}

const products: Product[] = [
  {
    id: 1,
    title: 'MacBook Pro',
    description: 'Poder e performance para profissionais.',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
    price: 2499,
    variant: 'default',
  },
  {
    id: 2,
    title: 'iPhone 15',
    description: 'O futuro em suas mãos.',
    image: 'https://images.unsplash.com/photo-1592910147542-1d3e90f993c5?w=400',
    price: 999,
    variant: 'glass',
  },
  {
    id: 3,
    title: 'AirPods Pro',
    description: 'Som imersivo com cancelamento de ruído.',
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c28b64?w=400',
    price: 249,
    variant: 'gradient',
  },
];

export default function InteractivePage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<Product[]>([]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const addToCart = (product: Product) => {
    setCart(prev => [...prev, product]);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Loja Virtual UI
          </h1>
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Carrinho: {cart.length} itens
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {products.map((product) => (
            <ParallaxCard
              key={product.id}
              title={product.title}
              description={product.description}
              image={product.image}
              variant={product.variant}
              parallaxSpeed={10}
              onClick={() => handleProductClick(product)}
            >
              <div className="mt-4 flex justify-between items-center">
                <span className="text-xl font-bold text-blue-600">
                  ${product.price}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </ParallaxCard>
          ))}
        </div>

        {selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                {selectedProduct.title}
              </h2>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {selectedProduct.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">
                  ${selectedProduct.price}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => addToCart(selectedProduct)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

## Configuração Personalizada

### virtual-ui.json

```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "cssVariables": true,
    "baseColor": "blue"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui"
  }
}
```

### tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      perspective: {
        '1000': '1000px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
```

## Comandos Úteis

```bash
# Adicionar mais componentes
npx virtual-ui add button-glow card-hover

# Listar componentes disponíveis
npx virtual-ui list

# Reconfigurar projeto
npx virtual-ui init --yes

# Sobrescrever componentes existentes
npx virtual-ui add parallax-card --overwrite
```

## Próximos Passos

1. **Personalize** os componentes conforme sua marca
2. **Adicione** mais variantes aos componentes
3. **Crie** composições complexas combinando componentes
4. **Otimize** para performance em produção
5. **Teste** em diferentes dispositivos e navegadores

## Suporte

- 📖 [Documentação completa](https://virtual-ui.dev/docs)
- 🐛 [Reportar bugs](https://github.com/yourusername/virtual-ui/issues)
- 💬 [Discussões](https://github.com/yourusername/virtual-ui/discussions) 