import { GeneratedFile } from '../index';

export function getEcommerceTemplate(): GeneratedFile[] {
  return [
    {
      path: 'src/App.tsx',
      content: `import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import { useState, useEffect } from 'react';

interface CartEntry {
  productId: string;
  quantity: number;
}

function App() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchCartCount();
  }, []);

  async function fetchCartCount() {
    try {
      const res = await fetch('/api/cart');
      const items: CartEntry[] = await res.json();
      setCartCount(items.reduce((sum, i) => sum + i.quantity, 0));
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <a href="/" className="text-2xl font-bold text-gray-900">{{APP_NAME}}</a>
          <a href="/cart" className="relative rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200">
            Cart
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                {cartCount}
              </span>
            )}
          </a>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage onCartUpdate={fetchCartCount} />} />
        <Route path="/cart" element={<CartPage onCartUpdate={fetchCartCount} />} />
      </Routes>
    </div>
  );
}

export default App;
`,
    },
    {
      path: 'src/pages/HomePage.tsx',
      content: `import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Products</h2>
        <p className="mt-1 text-gray-500">Browse our collection</p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-gray-400">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center text-gray-400">No products available</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

export default HomePage;
`,
    },
    {
      path: 'src/pages/ProductPage.tsx',
      content: `import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface ProductPageProps {
  onCartUpdate: () => void;
}

function ProductPage({ onCartUpdate }: ProductPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch(\`/api/products/\${id}\`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(setProduct)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function addToCart() {
    if (!product) return;
    setAdding(true);
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      onCartUpdate();
    } catch {
      console.error('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  }

  if (loading) return <div className="py-20 text-center text-gray-400">Loading...</div>;
  if (!product) return null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <button
        onClick={() => navigate('/')}
        className="mb-6 text-sm text-gray-500 hover:text-gray-700"
      >
        &larr; Back to products
      </button>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl bg-gray-200">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Image';
            }}
          />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-2 text-3xl font-semibold text-indigo-600">
            \${product.price.toFixed(2)}
          </p>
          <p className="mt-4 leading-relaxed text-gray-600">{product.description}</p>

          <button
            onClick={addToCart}
            disabled={adding}
            className="mt-8 w-full rounded-xl bg-indigo-600 py-3 text-lg font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 sm:w-auto sm:px-10"
          >
            {adding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </main>
  );
}

export default ProductPage;
`,
    },
    {
      path: 'src/pages/CartPage.tsx',
      content: `import { useState, useEffect } from 'react';
import CartItem from '../components/CartItem';

interface CartItemData {
  id: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
}

interface CartPageProps {
  onCartUpdate: () => void;
}

function CartPage({ onCartUpdate }: CartPageProps) {
  const [items, setItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      setItems(data);
    } catch {
      console.error('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) return removeItem(id);
    try {
      await fetch(\`/api/cart/\${id}\`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
      onCartUpdate();
    } catch {
      console.error('Failed to update quantity');
    }
  }

  async function removeItem(id: string) {
    try {
      await fetch(\`/api/cart/\${id}\`, { method: 'DELETE' });
      setItems((prev) => prev.filter((i) => i.id !== id));
      onCartUpdate();
    } catch {
      console.error('Failed to remove item');
    }
  }

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h2 className="mb-8 text-3xl font-bold text-gray-900">Shopping Cart</h2>

      {loading ? (
        <div className="py-20 text-center text-gray-400">Loading cart...</div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-20 text-center">
          <p className="text-lg text-gray-500">Your cart is empty</p>
          <a href="/" className="mt-2 inline-block text-indigo-600 hover:underline">
            Continue shopping
          </a>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>
          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium text-gray-700">Total</span>
              <span className="text-2xl font-bold text-gray-900">\${total.toFixed(2)}</span>
            </div>
            <button className="mt-4 w-full rounded-xl bg-indigo-600 py-3 text-lg font-medium text-white transition-colors hover:bg-indigo-700">
              Checkout
            </button>
          </div>
        </>
      )}
    </main>
  );
}

export default CartPage;
`,
    },
    {
      path: 'src/components/ProductCard.tsx',
      content: `interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <a
      href={\`/product/\${product.id}\`}
      className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Image';
          }}
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <p className="mt-2 text-lg font-bold text-indigo-600">\${product.price.toFixed(2)}</p>
      </div>
    </a>
  );
}

export default ProductCard;
`,
    },
    {
      path: 'src/components/CartItem.tsx',
      content: `interface CartItemProps {
  item: {
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      price: number;
      image: string;
    };
  };
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x80?text=No+Image';
          }}
        />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
        <p className="text-sm text-gray-500">\${item.product.price.toFixed(2)} each</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50"
        >
          -
        </button>
        <span className="w-8 text-center font-medium">{item.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50"
        >
          +
        </button>
      </div>

      <div className="w-20 text-right font-semibold text-gray-900">
        \${(item.product.price * item.quantity).toFixed(2)}
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="rounded p-1 text-gray-400 transition-colors hover:text-red-500"
        aria-label="Remove item"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default CartItem;
`,
    },
    {
      path: 'server/index.ts',
      content: `import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Get all products
app.get('/api/products', async (_req, res) => {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(products);
});

// Get a single product
app.get('/api/products/:id', async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
  });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Get cart items
app.get('/api/cart', async (_req, res) => {
  const items = await prisma.cartItem.findMany({
    include: { product: true },
  });
  res.json(items);
});

// Add to cart
app.post('/api/cart', async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId) return res.status(400).json({ error: 'productId is required' });

  const existing = await prisma.cartItem.findFirst({ where: { productId } });
  if (existing) {
    const updated = await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + (quantity || 1) },
      include: { product: true },
    });
    return res.json(updated);
  }

  const item = await prisma.cartItem.create({
    data: { productId, quantity: quantity || 1 },
    include: { product: true },
  });
  res.status(201).json(item);
});

// Update cart item quantity
app.patch('/api/cart/:id', async (req, res) => {
  const { quantity } = req.body;
  try {
    const item = await prisma.cartItem.update({
      where: { id: req.params.id },
      data: { quantity },
      include: { product: true },
    });
    res.json(item);
  } catch {
    res.status(404).json({ error: 'Cart item not found' });
  }
});

// Remove from cart
app.delete('/api/cart/:id', async (req, res) => {
  try {
    await prisma.cartItem.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Cart item not found' });
  }
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    },
    {
      path: 'prisma/schema.prisma',
      content: `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Product {
  id          String     @id @default(cuid())
  name        String
  description String
  price       Float
  image       String     @default("")
  createdAt   DateTime   @default(now())
  cartItems   CartItem[]
}

model CartItem {
  id        String   @id @default(cuid())
  productId String
  quantity  Int      @default(1)
  product   Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}
`,
    },
    {
      path: '.env',
      content: `DATABASE_URL="file:./dev.db"
`,
    },
  ];
}
