'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Star,
  Plus,
  Minus,
  Share2,
  Package,
  Truck,
  Shield,
  Clock,
} from 'lucide-react';
import { formatPrice } from '@/utils';
import { cartCrud } from '@/lib/prisma';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  featured: boolean;
  category: {
    id: number;
    name: string;
  };
  orderItems?: Array<{
    order: {
      id: number;
      orderNumber: string;
      status: string;
    };
  }>;
}

interface ProductDetailClientProps {
  product: Product;
  userId?: number;
}

export default function ProductDetailClient({
  product,
  userId,
}: ProductDetailClientProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Cambia los imgs aqui
  const images = [
    product.imageUrl || '/images/img_not_found.jpg',
    '/images/img_not_found.jpg',
    '/images/img_not_found.jpg',
    '/images/img_not_found.jpg',
  ];

  const totalPrice = product.price * quantity;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      router.push('/login');
      return;
    }

    setIsAddingToCart(true);

    try {
      await cartCrud.addItem(userId, product.id, quantity);

      alert(`${quantity} ${product.name}(s) agregado(s) al carrito`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error al agregar al carrito. Por favor, intenta de nuevo.');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images Principal */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-xl bg-white shadow-lg">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-96 lg:h-[500px] object-cover hover:scale-125 transition-all duration-300 ease-in-out"
            />
          </div>

          {/* Thumbnail */}
          <div className="grid grid-cols-4 gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                  selectedImage === index
                    ? 'border-green-500 ring-2 ring-green-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} - Vista ${index + 1}`}
                  className="w-full h-20 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <div className="mb-2 flex">
              <span className="text-sm text-emerald-600 font-semibold bg-green-50 px-1 py-1 rounded-full">
                {product.category.name}
              </span>
              {product.featured && (
                <div className="top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  Destacado
                </div>
              )}
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <div className="text-3xl font-bold text-emerald-600 mb-4">
              ${formatPrice(product.price)}
            </div>

            <div className="prose prose-gray max-w-none my-3">
              <p className="text-gray-600 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/*  */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg shadow-gray-300 shadow-md">
              <Package className="w-5 h-5 text-emerald-600" />
              <span className="text-sm text-gray-400 font-medium">
                Stock disponible
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg  shadow-gray-300 shadow-md">
              <Truck className="w-5 h-5 text-emerald-600" />
              <span className="text-sm text-gray-400 font-medium">
                Envío gratis
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg  shadow-gray-300 shadow-md">
              <Shield className="w-5 h-5 text-emerald-600" />
              <span className="text-sm text-gray-400 font-medium">
                Garantía incluida
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg  shadow-gray-300 shadow-md">
              <Clock className="w-5 h-5 text-emerald-600" />
              <span className="text-sm text-gray-400 font-medium">
                Entrega 24-48h
              </span>
            </div>
          </div>

          {/* Cantidad */}
          <div className="space-y-4 mt-12">
            <div className="mb-12 flex items-end h-10">
              <label className="w-24 text-md font-medium text-gray-500 mb-2 inline-block mr-3">
                CANTIDAD:
              </label>
              <div className="flex items-center">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-l-lg border border-gray-400 text-gray-600 flex items-center justify-center hover:border-green-500 hover:text-emerald-600 hover:shadow-xs hover:shadow-emerald-600 disabled:opacity-50 hover:font-bold disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center  h-10 border border-gray-400 ">
                  <span className="w-16 text-center text-lg font-semibold text-gray-500 ">
                    {quantity}
                  </span>
                </div>

                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 rounded-r-lg border border-gray-400 text-gray-600 flex items-center justify-center hover:border-green-500 hover:text-emerald-600 hover:shadow-xs hover:shadow-emerald-600 disabled:opacity-50 hover:font-bold disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <div className="ml-2 top-4 right-4 bg-opacity-50 text-gray-300 px-3 py-1 rounded-full text-lg">
                  {product.stock} in stock
                </div>
              </div>
            </div>

            {/* Total Precio */}

            <div className="border py-6 rounded-lg border-t-emerald-600  border-b-emerald-600">
              <div className="flex items-center gap-6 mt-2">
                <label className="text-md text-gray-500 w-18">TOTAL:</label>
                <span className="text-3xl font-bold text-emerald-600">
                  ${formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            {/* Cart */}
            <div className="space-y-3 flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {isAddingToCart
                  ? 'Agregando...'
                  : product.stock === 0
                  ? 'Sin stock'
                  : 'Agregar al carrito'}
              </button>

              <button
                onClick={handleShare}
                className="px-4 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
