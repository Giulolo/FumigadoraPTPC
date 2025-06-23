import { ArrowLeft, Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <Search className="w-48 h-48 inline-block mb-12" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Producto no encontrado
        </h1>
        <p className="text-gray-600 mb-6">
          El producto que buscas no existe o ha sido eliminado.
        </p>
        <Link
          href="/products"
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a productos
        </Link>
      </div>
    </div>
  );
}
