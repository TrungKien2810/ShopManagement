import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import apiClient from '../api/apiClient';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LayoutDashboard, Users, MapPin, AlertCircle, Loader2 } from 'lucide-react';

interface CreateTableModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateTableModal: React.FC<CreateTableModalProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState<number>(4);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || capacity <= 0) return;
    
    setLoading(true);
    setError(null);
    try {
      await apiClient.post(`/tables`, { name, capacity, location: location || 'Khu vực chung' });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Không thể tạo bàn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex justify-center items-start md:items-center overflow-y-auto p-4 md:p-8 font-sans">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-[440px] linear-surface p-0 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] overflow-hidden my-auto z-10"
      >
        <div className="px-8 pt-8 pb-6 border-b border-white/[0.05]">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-brand-purple" />
              Tạo Bàn mới
            </h2>
            <button onClick={onClose} className="p-1 px-1.5 text-brand-gray hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-md transition-all">
               <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-brand-gray font-medium">Bố trí thêm bàn vào không gian quán của bạn.</p>
        </div>

        <div className="px-8 py-8">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="p-4 rounded-xl text-xs font-bold flex items-center gap-3 border overflow-hidden bg-rose-500/10 border-rose-500/20 text-rose-400"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p className="break-words line-clamp-2">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-gray uppercase tracking-widest ml-1 flex items-center gap-2">
                Tên Bàn
              </label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:border-brand-purple outline-none transition-all placeholder:text-[#31343e] text-white" 
                placeholder="VD: Bàn VIP 01" 
                required 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-brand-gray uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Users className="w-3 h-3" />
                  Sức chứa
                </label>
                <input 
                  type="number" 
                  min={1}
                  value={capacity} 
                  onChange={(e) => setCapacity(parseInt(e.target.value) || 2)} 
                  className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:border-brand-purple outline-none transition-all placeholder:text-[#31343e] text-white" 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-brand-gray uppercase tracking-widest ml-1 flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  Khu vực (Zone)
                </label>
                <input 
                  type="text" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-4 py-3 text-sm focus:border-brand-purple outline-none transition-all placeholder:text-[#31343e] text-white" 
                  placeholder="Trong nhà, Ngoài trời..." 
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary mt-2 flex items-center justify-center gap-2 py-3.5">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Tạo bàn
            </button>
          </form>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
