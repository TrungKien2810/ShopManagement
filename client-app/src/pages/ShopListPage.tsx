import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { shopApi } from '../api/shopApi';
import { ProfileDropdown } from '../components/ProfileDropdown';
import { ArrowLeft } from 'lucide-react';

export const ShopListPage: React.FC = () => {
  const [shops, setShops] = useState<any[]>([]);
  const { selectShop } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      const data = await shopApi.getAll();
      setShops(data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách quán:", err);
    }
  };

  const handleSelect = (shop: any) => {
    selectShop(shop);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-void text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto pt-4 relative z-10">
        <button 
          onClick={() => navigate('/')}
          className="mb-8 text-brand-gray hover:text-white font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Quay lại trang chủ
        </button>

        <div className="flex justify-between items-center mb-12">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold tracking-tight">Cửa hàng của bạn</h1>
            <p className="text-brand-gray text-xs font-bold uppercase tracking-widest">Chọn hoặc tạo một không gian quản lý</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/create-shop')}
              className="px-6 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] rounded-xl font-bold transition-all border border-white/[0.08] hover:border-brand-purple text-sm flex items-center gap-2"
            >
              Tạo quán mới
            </button>
            <ProfileDropdown />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shops.map(shop => (
            <div 
              key={shop.id}
              onClick={() => handleSelect(shop)}
              className="p-8 bg-gray-800 rounded-2xl border border-gray-700 hover:border-orange-500/50 cursor-pointer transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold group-hover:text-orange-400">{shop.name}</h3>
                <span className="px-3 py-1 bg-gray-700 rounded-full text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {shop.role}
                </span>
              </div>
              <p className="text-gray-400 mb-6">Nhân viên & Quản lý bàn</p>
              <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-orange-500 to-red-500"></div>
              </div>
            </div>
          ))}
          {shops.length === 0 && (
            <div className="col-span-full py-20 text-center bg-gray-800/50 rounded-3xl border border-dashed border-gray-700">
              <p className="text-xl text-gray-500 mb-4">Bạn chưa có quán nào.</p>
              <p className="text-gray-600">Hãy tạo quán đầu tiên để bắt đầu trải nghiệm "Một Chạm"!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
