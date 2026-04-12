import React, { useEffect, useState } from 'react';
import { menuApi } from '../api/menuApi';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  products: Product[];
}

interface MenuGridProps {
  onSelectItem: (product: Product) => void;
}

export const MenuGrid: React.FC<MenuGridProps> = ({ onSelectItem }) => {
  const [menu, setMenu] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    menuApi.getMenu().then(data => {
      setMenu(data);
      if (data.length > 0) setSelectedCategory(data[0].id);
    });
  }, []);

  const currentProducts = menu.find(c => c.id === selectedCategory)?.products || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {menu.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat.id 
              ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/40' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {currentProducts.map(product => (
          <div 
            key={product.id}
            onClick={() => onSelectItem(product)}
            className="bg-slate-800/50 border border-slate-700 p-4 rounded-3xl hover:border-emerald-500/50 transition-all cursor-pointer group shadow-xl"
          >
            <div className="aspect-square bg-slate-700 rounded-2xl mb-4 overflow-hidden relative">
               {product.imageUrl ? (
                 <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-3xl opacity-20 italic">🍽️</div>
               )}
               <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
               </div>
            </div>
            <h4 className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors uppercase text-sm tracking-tight">{product.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};
