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
            className={`min-h-12 px-5 py-3 rounded-2xl font-bold whitespace-nowrap transition-all border ${
              selectedCategory === cat.id 
              ? 'bg-brand-purple/20 text-white border-brand-purple/30 shadow-glow-purple' 
              : 'bg-white/[0.02] text-brand-gray border-white/[0.05] hover:bg-white/[0.05] hover:text-white'
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
            className={`bg-[#08090a]/40 border border-white/[0.06] backdrop-blur-md p-4 rounded-3xl transition-all group shadow-xl ${
              product.isAvailable === false ? "opacity-50 cursor-not-allowed" : "hover:border-brand-purple/30 cursor-pointer hover:shadow-2xl"
            }`}
          >
            <div className="aspect-square bg-white/[0.03] border border-white/[0.06] rounded-2xl mb-4 overflow-hidden relative">
               {product.imageUrl ? (
                 <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
               ) : (
                   <div className="w-full h-full flex items-center justify-center text-xs text-brand-gray font-semibold uppercase tracking-widest">
                     Không có ảnh
                   </div>
               )}
               <div className="absolute top-2 right-2 bg-brand-purple text-white text-[10px] font-black px-2 py-1 rounded-lg shadow-glow-purple">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
               </div>
               {product.isAvailable === false && (
                  <div className="absolute inset-x-3 bottom-3 bg-black/70 border border-white/[0.10] text-white text-[10px] font-black px-3 py-2 rounded-xl uppercase tracking-widest text-center">
                    Hết bán
                  </div>
               )}
            </div>
            <h4 className="font-bold text-white group-hover:text-brand-purple transition-colors uppercase text-sm tracking-tight">{product.name}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};
