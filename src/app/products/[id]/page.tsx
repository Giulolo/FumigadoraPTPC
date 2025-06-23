import { productCrud } from '@/lib/prisma';
import ProductDetailClient from './components/ProductDetailClient';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import NotFound from './not-found';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const productId = parseInt(params.id);

  if (isNaN(productId)) {
    NotFound();
  }

  const rawProduct = await productCrud.getById(productId);

  if (!rawProduct) {
    NotFound();
  }

  const product = {
    ...rawProduct,
    price: Number(rawProduct.price),
    rating: rawProduct.rating ? Number(rawProduct.rating) : null,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Link
              href="/products"
              className="flex items-center gap-2 hover:text-green-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Productos
            </Link>
            <span>/</span>
            <span className="text-emerald-600 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

{/* usa este abajo */}
      {/* <ProductDetailClient product={product} userId={user?.id} /> */}
      <ProductDetailClient product={product}/>
{/* la secunda solo para prueba sin usuario */}
    </div>
  );
}
