'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, Star, X } from 'lucide-react';
import { ProductFilters } from '@/lib/types';
import { formatPrice, refreshPage } from '@/utils';
// import { Router as next_router } from "next/router";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  featured: boolean;
  category: {
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
  initialFilters: ProductFilters[];
}

export default function ProductsClient({
  initialProducts,
  categories,
  initialFilters,
}: ProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products] = useState(initialProducts);
  const [showFilters, setShowFilters] = useState(false);

  const getFiltersFromURL = () => {
    return {
      search: initialFilters.search || searchParams.get('search') || '',
      categoryId:
        searchParams.get('category') || searchParams.get('categoryId') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      featured: searchParams.get('featured') || '',
      isActive: searchParams.get('isActive') === 'true',
    };
  };

  const [filters, setFilters] = useState(getFiltersFromURL);

  // Sync filters with URL parameters when searchParams change
  useEffect(() => {
    const urlFilters = getFiltersFromURL();
    setFilters(urlFilters);
  }, [searchParams]);

  const updateURL = (newFilters: typeof filters) => {
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        if (key === 'categoryId') {
          params.set('category', value.toString());
        } else if (key !== 'isActive') {
          params.set(key, value.toString());
        } else if (key === 'isActive' && value === true) {
          params.set(key, 'true');
        }
      }
    });

    const newURL = params.toString()
      ? `/products?${params.toString()}`
      : '/products';
    router.push(newURL, { scroll: false });

    refreshPage();
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      categoryId: '',
      minPrice: '',
      maxPrice: '',
      featured: '',
      isActive: false,
    };
    setFilters(clearedFilters);
    router.push('/products');
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-transparent pt-1.5 relative rounded-xl">
      <div
        className="bg-gradient-to-b from-gray-700 to-transparent text-white rounded-xl hover:cursor-pointer transition-all duration-600 ease-in-out overflow-hidden group h-full"
        onClick={() => router.push(`/products/${product.id}`)}
      >
        <div className="relative overflow-hidden">
          <img
            src={product.imageUrl || '/images/img_not_found.jpg'}
            alt={product.name}
            className="w-full h-64 object-cover hover:scale-125 hover:rotate-5 hover:brightness-[.75] transition-transform duration-600 ease-in-out  "
            onError={e => {
              e.currentTarget.src = '/images/img_not_found.jpg';
            }}
          />
          {product.featured && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-green-400 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Destacado
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="font-bold text-gray-100 text-lg mb-3 line-clamp-2 text-nowrap">
            {product.name}
          </h3>

          <p className="text-gray-400 text-sm mb-4 line-clamp-3 text-nowrap">
            {product.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            <div className="text-2xl font-bold text-green-600">
              ${formatPrice(product.price)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Filters */}
      <div className="bg-transparent rounded-xl shadow-none p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="flex-1 relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 hover:cursor-pointer transition-all ease-in-out duration-300`}
              onClick={() => {
                if (filters.search) {
                  handleFilterChange('search', ''); // Clear search if there's text
                } else {
                  refreshPage(); // Refresh if no text
                }
              }}
            />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={filters.search}
              onChange={e => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg transition-colors 
            ${
              showFilters === true
                ? 'bg-emerald-600 hover:bg-transparent'
                : 'bg-transparent hover:bg-emerald-600 '
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <select
                value={filters.categoryId}
                onChange={e => handleFilterChange('categoryId', e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="" className="bg-emerald-600">
                  Todas las categorías
                </option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Precio mínimo"
                value={filters.minPrice}
                onChange={e => handleFilterChange('minPrice', e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />

              <input
                type="number"
                placeholder="Precio máximo"
                value={filters.maxPrice}
                onChange={e => handleFilterChange('maxPrice', e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />

              <select
                value={filters.featured}
                onChange={e => handleFilterChange('featured', e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Todos los productos</option>
                <option value="true">Solo destacados</option>
                <option value="false">No destacados</option>
              </select>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
                Limpiar filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">Mostrando {products.length} productos</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-48 h-48 inline-block mb-12 " />
          <h3 className="text-xl font-semibold text-gray-500 mb-2">
            No se encontraron productos
          </h3>
          <p className="text-gray-400 mb-4">
            Intenta ajustar tus filtros de búsqueda
          </p>
          <button
            onClick={clearFilters}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
