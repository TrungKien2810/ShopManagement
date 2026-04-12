import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

export const EmergencySettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user, updateUserAvatar } = useAuth();
  const [activeTab, setActiveTab] = useState<'avatar' | 'password'>('avatar');
  
  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  
  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleUpdateAvatar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarUrl.trim()) return;
    
    setLoading(true);
    setMessage(null);
    try {
      await apiClient.put('/api/auth/profile/avatar', { avatarUrl });
      updateUserAvatar(avatarUrl);
      setMessage({ text: 'Cập nhật Avatar thành công!', type: 'success' });
    } catch (err: any) {
      setMessage({ text: err.response?.data?.message || 'Lỗi khi cập nhật Avatar', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword) return;
    
    setLoading(true);
    setMessage(null);
    try {
      await apiClient.put('/api/auth/profile/password', { oldPassword, newPassword });
      setMessage({ text: 'Đổi mật khẩu thành công!', type: 'success' });
      setOldPassword('');
      setNewPassword('');
    } catch (err: any) {
      setMessage({ text: err.response?.data?.message || 'Lỗi khi đổi mật khẩu', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/50 p-6 sm:p-8 rounded-[32px] shadow-2xl animate-bounceIn overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">
            Cài Đặt Khẩn Cấp ⚙️
          </h2>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-white bg-slate-800 hover:bg-rose-500/20 rounded-full transition-colors">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-slate-950/50 rounded-2xl">
          <button
            onClick={() => { setActiveTab('avatar'); setMessage(null); }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${activeTab === 'avatar' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Đổi Avatar
          </button>
          <button
            onClick={() => { setActiveTab('password'); setMessage(null); }}
            className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all ${activeTab === 'password' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Đổi Mật Khẩu
          </button>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-4 p-4 rounded-2xl text-sm font-semibold flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
            <span>{message.type === 'success' ? '✅' : '⚠️'}</span> {message.text}
          </div>
        )}

        {/* Content */}
        {activeTab === 'avatar' ? (
          <form onSubmit={handleUpdateAvatar} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                URL Ảnh đại diện
              </label>
              <input
                type="url"
                className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-orange-500/50 outline-none transition-all text-slate-200 placeholder:text-slate-700"
                placeholder="https://example.com/avatar.jpg"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                required
              />
            </div>
            {/* Preview */}
            {avatarUrl && (
              <div className="flex justify-center my-4">
                <img src={avatarUrl} alt="Preview" className="w-20 h-20 rounded-full object-cover border-4 border-slate-800" onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Error&background=random'; }} />
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-900/20 transition-all uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật Avatar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-orange-500/50 outline-none transition-all text-slate-200 placeholder:text-slate-700 font-mono"
                placeholder="••••••••"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                Mật khẩu mới
              </label>
              <input
                type="password"
                className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-orange-500/50 outline-none transition-all text-slate-200 placeholder:text-slate-700 font-mono"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-2 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl shadow-xl shadow-rose-900/20 transition-all uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật Mật khẩu'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
