import { Suspense } from 'react';
import { productCrud, categoryCrud } from '@/lib/prisma';
import ProductsClient from './components/ProductsClient';
import ProductsLoading from './components/ProductsLoading';

interface SearchParams {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  featured?: string;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = {
    search: searchParams.search || undefined,
    categoryId: searchParams.category
      ? parseInt(searchParams.category)
      : undefined,
    minPrice: searchParams.minPrice
      ? parseFloat(searchParams.minPrice)
      : undefined,
    maxPrice: searchParams.maxPrice
      ? parseFloat(searchParams.maxPrice)
      : undefined,
    featured:
      searchParams.featured === 'true'
        ? true
        : searchParams.featured === 'false'
        ? false
        : undefined,
  };

  const [rawProducts, categories] = await Promise.all([
    productCrud.getAll(filters),
    categoryCrud.getAll(),
  ]);

  const products = rawProducts.map(product => ({
    ...product,
    price: Number(product.price),
    rating: product.rating ? Number(product.rating) : null,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900  via-gray-900 to-black overflow-hidden ">
      <div className="relative bg-gradient-to-b from-black via-gray-950 to-gray-900 text-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nuestros Productos
            </h1>
          </div>
          <div className="w-24 h-1 bg-emerald-600 inline-block rounded-2xl" />
        </div>
      </div>

      <Suspense fallback={<ProductsLoading />}>
        <ProductsClient
          initialProducts={products}
          categories={categories}
          initialFilters={filters}
        />
      </Suspense>
    </div>
  );
}
