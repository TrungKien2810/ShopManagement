import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const EmergencySettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user, updateUserAvatar } = useAuth();
  const [activeTab, setActiveTab] = useState<'avatar' | 'password'>('avatar');
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(user?.avatarUrl || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleUpdateAvatar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarFile) return;
    setLoading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append('File', avatarFile);
      const response = await apiClient.put('/auth/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newAvatarUrl = response.data?.avatarUrl || previewUrl;
      updateUserAvatar(newAvatarUrl);
      setMessage({ text: 'Cập nhật ảnh thành công!', type: 'success' });
    } catch (err: any) {
      setMessage({ text: 'Lỗi khi tải ảnh lên Cloudinary', type: 'error' });
    } finally { setLoading(false); }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;
    setLoading(true);
    setMessage(null);
    try {
      await apiClient.put('/auth/profile/password', { oldPassword, newPassword });
      setMessage({ text: 'Đã thay đổi mật khẩu!', type: 'success' });
      setOldPassword(''); setNewPassword('');
    } catch (err: any) {
      setMessage({ text: 'Sai mật khẩu hoặc lỗi hệ thống', type: 'error' });
    } finally { setLoading(false); }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex justify-center items-start md:items-center overflow-y-auto p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
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
              Cài đặt tài khoản
            </h2>
            <button onClick={onClose} className="p-1 px-1.5 text-brand-gray hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-md transition-all">
               <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-brand-gray font-medium">Quản lý định danh và bảo mật cho ZôOS</p>
        </div>

        {/* Tab Navigation */}
        <div className="px-8 py-4 flex gap-6 border-b border-white/[0.05] bg-black/20">
          <button 
            onClick={() => setActiveTab('avatar')}
            className={cn("text-xs font-bold uppercase tracking-widest pb-1 transition-all border-b-2", activeTab === 'avatar' ? "border-brand-purple text-white" : "border-transparent text-brand-gray hover:text-slate-300")}
          >
            Ảnh đại diện
          </button>
          <button 
            onClick={() => setActiveTab('password')}
            className={cn("text-xs font-bold uppercase tracking-widest pb-1 transition-all border-b-2", activeTab === 'password' ? "border-brand-purple text-white" : "border-transparent text-brand-gray hover:text-slate-300")}
          >
            Mật khẩu
          </button>
        </div>

        <div className="px-8 py-8">
          <AnimatePresence mode="wait">
            {message && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className={cn("mb-6 p-3 rounded-lg text-xs font-bold flex items-center gap-3 border", message.type === 'success' ? "bg-brand-emerald/10 border-brand-emerald/20 text-brand-emerald" : "bg-rose-500/10 border-rose-500/20 text-rose-400")}
              >
                {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeTab === 'avatar' ? (
              <motion.form 
                key="avatar"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                onSubmit={handleUpdateAvatar} className="space-y-6"
              >
                <div className="flex flex-col items-center gap-6">
                  <div className="relative group">
                    <img 
                      src={previewUrl || 'https://ui-avatars.com/api/?name=User&background=020617&color=fff'} 
                      className="w-24 h-24 rounded-full object-cover ring-2 ring-white/[0.08] shadow-2xl transition-all group-hover:ring-brand-purple/50" 
                      alt="Avatar Preview" 
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
                       <Camera className="w-6 h-6 text-white" />
                       <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setAvatarFile(e.target.files[0]);
                            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                          }
                       }} />
                    </label>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-brand-gray uppercase tracking-widest">Khuyến nghị: 512x512px</p>
                  </div>
                </div>

                <button type="submit" disabled={loading || !avatarFile} className="w-full btn-primary disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Lưu thay đổi
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="password"
                initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                onSubmit={handleUpdatePassword} className="space-y-4"
              >
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-brand-gray uppercase ml-1">Mật khẩu cũ</label>
                  <div className="relative">
                    <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full bg-black/40 border border-white/[0.08] rounded-lg px-4 py-3 text-sm focus:border-brand-purple outline-none transition-all placeholder:text-slate-800" placeholder="••••••••" required />
                    <Lock className="absolute right-3 top-3.5 w-4 h-4 text-slate-800" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-brand-gray uppercase ml-1">Mật khẩu mới</label>
                  <div className="relative">
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-black/40 border border-white/[0.08] rounded-lg px-4 py-3 text-sm focus:border-brand-purple outline-none transition-all placeholder:text-slate-800" placeholder="••••••••" required minLength={6} />
                    <Lock className="absolute right-3 top-3.5 w-4 h-4 text-slate-800" />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full btn-primary mt-4 disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  Cập nhật mật khẩu
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        <div className="px-8 py-4 bg-black/40 text-center border-t border-white/[0.05]">
           <p className="text-[9px] font-bold text-[#3d342c] uppercase tracking-widest italic">Protected by ZôOS Security Infrastructure</p>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
