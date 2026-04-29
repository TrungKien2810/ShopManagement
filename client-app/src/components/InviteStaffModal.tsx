import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ShieldCheck, UserPlus, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const InviteStaffModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { currentShop } = useAuth();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<number>(2); // Default to Staff (0: Owner, 1: Manager, 2: Staff)
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !currentShop) return;
    setLoading(true);
    setMessage(null);
    try {
      await apiClient.post(`/shop/${currentShop.id}/invite`, { username, role });
      setMessage({ text: `Đã gửi lời mời đến ${username}!`, type: 'success' });
      setUsername('');
      // Tự đóng sau 2 giây nếu thành công
      setTimeout(onClose, 2000);
    } catch (err: any) {
      setMessage({ 
        text: err.response?.data?.message || err.response?.data || 'Không tìm thấy người dùng hoặc đã thuộc quán.', 
        type: 'error' 
      });
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
        {/* Header Section */}
        <div className="px-8 pt-8 pb-6 border-b border-white/[0.05]">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-brand-purple" />
              Mời nhân sự
            </h2>
            <button onClick={onClose} className="p-1 px-1.5 text-brand-gray hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-md transition-all">
               <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-brand-gray font-medium">Tìm và cấp quyền cho thành viên mới tham gia không gian làm việc.</p>
        </div>

        <div className="px-8 py-8">
          <AnimatePresence mode="wait">
            {message && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }} 
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className={cn("p-4 rounded-xl text-xs font-bold flex items-center gap-3 border overflow-hidden", message.type === 'success' ? "bg-brand-emerald/10 border-brand-emerald/20 text-brand-emerald" : "bg-rose-500/10 border-rose-500/20 text-rose-400")}
              >
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <p className="break-words line-clamp-2">{message.text}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleInvite} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-brand-gray uppercase tracking-widest ml-1">Username / Tên định danh</label>
              <div className="relative">
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="w-full bg-black/40 border border-white/[0.08] rounded-xl px-11 py-3 text-sm focus:border-brand-purple outline-none transition-all placeholder:text-[#31343e] text-white" 
                  placeholder="Ví dụ: nva_2026" 
                  required 
                />
                <Mail className="absolute left-4 top-3.5 w-4 h-4 text-[#4c4f5a]" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-brand-gray uppercase tracking-widest ml-1 flex items-center gap-2">
                Phân quyền truy cập 
                <ShieldCheck className="w-3 h-3 text-brand-purple" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div 
                  onClick={() => setRole(1)}
                  className={cn(
                    "p-3 rounded-xl border border-white/[0.05] cursor-pointer transition-all flex items-center gap-3 relative overflow-hidden",
                    role === 1 ? "bg-brand-purple/10 border-brand-purple shadow-[0_0_15px_rgba(94,106,210,0.15)]" : "bg-white/[0.02] hover:bg-white/[0.05]"
                  )}
                >
                  <div className={cn("w-3 h-3 rounded-full shrink-0", role === 1 ? "bg-brand-purple" : "bg-[#31343e]")} />
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">Quản lý</h4>
                    <p className="text-[9px] text-brand-gray font-medium mt-0.5">Toàn quyền vận hành</p>
                  </div>
                </div>

                <div 
                  onClick={() => setRole(2)}
                  className={cn(
                    "p-3 rounded-xl border border-white/[0.05] cursor-pointer transition-all flex items-center gap-3 relative overflow-hidden",
                    role === 2 ? "bg-brand-emerald/10 border-brand-emerald shadow-[0_0_15px_rgba(16,185,129,0.15)]" : "bg-white/[0.02] hover:bg-white/[0.05]"
                  )}
                >
                  <div className={cn("w-3 h-3 rounded-full shrink-0", role === 2 ? "bg-brand-emerald" : "bg-[#31343e]")} />
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">Nhân viên</h4>
                    <p className="text-[9px] text-brand-gray font-medium mt-0.5">Order / Phục vụ ban</p>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary mt-2 disabled:opacity-50 flex items-center justify-center gap-2 py-3.5">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Gửi thư mời
            </button>
          </form>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
