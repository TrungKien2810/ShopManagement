import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { shopApi } from '../api/shopApi';

export const ShopCreationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    description: ''
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
        phoneNumber: formData.phoneNumber,
        description: formData.description
      });
      alert('Tạo quán thành công!');
      navigate('/shops');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể tạo quán. Hãy thử lại!');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 md:p-12 selection:bg-orange-500/30">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate('/shops')}
          className="mb-8 text-slate-500 hover:text-slate-300 font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-colors"
        >
          ← Quay lại danh sách
        </button>

        <div className="bg-slate-800/40 p-10 md:p-16 rounded-[40px] shadow-2xl border border-slate-700/50 backdrop-blur-xl animate-fadeIn">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-4">
              Tạo Quán Mới
            </h1>
            <p className="text-slate-400 font-medium">Bắt đầu hành trình kinh doanh thông minh cùng ZôOS</p>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl mb-8 text-sm font-bold">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Tên Quán <span className="text-rose-500">*</span></label>
              <input 
                name="name"
                type="text" 
                className="w-full px-6 py-5 bg-slate-900/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all placeholder:text-slate-700 text-lg font-bold"
                placeholder="Ví dụ: Zô Zô Quán - Nướng & Lẩu"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Số điện thoại</label>
                <input 
                  name="phoneNumber"
                  type="text" 
                  className="w-full px-6 py-5 bg-slate-900/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all placeholder:text-slate-700 font-bold"
                  placeholder="090x xxx xxx"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Địa chỉ <span className="text-rose-500">*</span></label>
                <input 
                  name="address"
                  type="text" 
                  className="w-full px-6 py-5 bg-slate-900/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all placeholder:text-slate-700 font-bold"
                  placeholder="123 Đường Zô, Quận 1, TP.HCM"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Mô tả ngắn</label>
              <textarea 
                name="description"
                rows={4}
                className="w-full px-6 py-5 bg-slate-900/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all placeholder:text-slate-700 font-medium resize-none"
                placeholder="Quán chuyên các món nướng và bia tươi..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-black rounded-3xl shadow-2xl shadow-orange-900/40 transition-all transform active:scale-95 uppercase tracking-[0.2em] text-lg mt-4"
            >
              {loading ? 'Đang khởi tạo quán...' : 'Xác nhận tạo quán 🍻'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
