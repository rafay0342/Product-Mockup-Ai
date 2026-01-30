
import React from 'react';
import { PRODUCTS } from '../constants';
import { ProductType } from '../types';

interface ProductGridProps {
  selectedId: string | null;
  onSelect: (product: ProductType) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ selectedId, onSelect }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">2. Select Product</h3>
      <div className="grid grid-cols-2 gap-3">
        {PRODUCTS.map((product) => (
          <button
            key={product.id}
            onClick={() => onSelect(product)}
            className={`p-4 rounded-xl border-2 transition-all text-left flex flex-col items-start gap-1 ${
              selectedId === product.id
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-100'
                : 'border-gray-100 hover:border-gray-200 bg-white'
            }`}
          >
            <span className="text-2xl">{product.icon}</span>
            <span className="font-semibold text-sm text-gray-700">{product.name}</span>
            <span className="text-xs text-gray-400 leading-tight">{product.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
