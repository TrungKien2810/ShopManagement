import React, { useEffect, useState } from 'react';
import { menuApi } from '../api/menuApi';

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  isAvailable?: boolean;
}

interface Category {
  id: string;
  name: string;
  isActive?: boolean;
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
      const activeCategories = (data || []).filter((c: Category) => c.isActive !== false);
      setMenu(activeCategories);
      if (activeCategories.length > 0) setSelectedCategory(activeCategories[0].id);
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
            onClick={() => {
              if (product.isAvailable === false) return;
              onSelectItem(product);
            }}
            className={`bg-slate-800/50 border border-slate-700 p-4 rounded-3xl transition-all group shadow-xl ${
              product.isAvailable === false ? "opacity-50 cursor-not-allowed" : "hover:border-emerald-500/50 cursor-pointer"
            }`}
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
               {product.isAvailable === false && (
                 <div className="absolute inset-x-3 bottom-3 bg-slate-950/80 border border-white/10 text-white text-[10px] font-black px-3 py-2 rounded-xl uppercase tracking-widest text-center">
                   Hết bán
                 </div>
               )}
            </div>
            <h4 className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors uppercase text-sm tracking-tight">{product.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};
