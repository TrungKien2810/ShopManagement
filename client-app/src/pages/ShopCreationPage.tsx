import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { shopApi } from '../api/shopApi';

export const ShopCreationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await shopApi.create({
        name: formData.name,
        address: formData.address,
        phoneNumber: formData.phoneNumber
      });
      alert('Tạo quán thành công!');
      navigate('/shops');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tạo quán. Hãy thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-void text-white font-sans selection:bg-brand-purple/30 overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-purple/5 blur-[120px] rounded-full" />
      
      <div className="max-w-xl mx-auto pt-20 px-6 relative z-10">
        <button 
          onClick={() => navigate('/shops')}
          className="mb-12 text-brand-gray hover:text-white font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 transition-colors transition-all"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Quay lại danh sách
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="linear-surface p-12 shadow-2xl"
        >
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Tạo Quán Mới</h1>
            <p className="text-brand-gray text-[10px] font-bold uppercase tracking-[0.2em]">Khởi tạo không gian ZôOS mới của bạn</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-lg">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-brand-gray uppercase tracking-widest ml-1">Tên Quán</label>
              <input 
                name="name"
                type="text" 
                className="w-full px-5 py-4 bg-black/40 border border-white/[0.08] rounded-xl focus:border-brand-purple outline-none transition-all placeholder:text-[#31343e] text-sm font-semibold"
                placeholder="Ví dụ: Zô Zô Quán"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-brand-gray uppercase tracking-widest ml-1">Địa chỉ</label>
              <input 
                name="address"
                type="text" 
                className="w-full px-5 py-4 bg-black/40 border border-white/[0.08] rounded-xl focus:border-brand-purple outline-none transition-all placeholder:text-[#31343e] text-sm font-semibold"
                placeholder="123 Đường ABC, Quận XYZ..."
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-brand-gray uppercase tracking-widest ml-1">Số điện thoại</label>
              <input 
                name="phoneNumber"
                type="text" 
                className="w-full px-5 py-4 bg-black/40 border border-white/[0.08] rounded-xl focus:border-brand-purple outline-none transition-all placeholder:text-[#31343e] text-sm font-semibold"
                placeholder="090x xxx xxx"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 font-bold rounded-xl mt-6 uppercase tracking-widest text-xs"
            >
              {loading ? 'Đang khởi tạo...' : 'Xác nhận tạo quán'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
