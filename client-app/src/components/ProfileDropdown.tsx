import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { EmergencySettingsModal } from './EmergencySettingsModal';
import { useNavigate } from 'react-router-dom';

export const ProfileDropdown: React.FC = () => {
  const { user, currentShop, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (!user) return null;

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1 pr-4 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-full transition-all focus:ring-2 focus:ring-orange-500/50"
      >
        <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-900 border-2 border-slate-700 flex items-center justify-center">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg font-black text-slate-400 uppercase">
              {user.username.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex flex-col items-start hidden sm:flex">
          <span className="text-sm font-bold text-white leading-tight">
            {user.username}
          </span>
          {currentShop ? (
            <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest mt-0.5" title="Truy cập trong quán">
              Vai trò: {currentShop.role}
            </span>
          ) : (
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">
              Hệ thống ZôOS
            </span>
          )}
        </div>
        <div className="text-slate-400 ml-1">
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
          <div className="px-4 py-4 border-b border-slate-800/50 bg-slate-800/20">
            <p className="text-sm font-bold text-white mb-1">{user.username}</p>
            {currentShop ? (
              <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest bg-orange-500/10 inline-block px-2 py-1 rounded-md">
                Đang ở: {currentShop.name} ({currentShop.role})
              </p>
            ) : (
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Màn hình chính
              </p>
            )}
          </div>
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                setShowSettings(true);
              }}
              className="w-full text-left px-4 py-3 text-sm font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-3"
            >
              <span className="text-xl">⚙️</span> Cài đặt khẩn cấp
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
                navigate('/login');
              }}
              className="w-full text-left px-4 py-3 text-sm font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors flex items-center gap-3 border-t border-slate-800/50 mt-1"
            >
              <span className="text-xl">🚪</span> Đăng xuất
            </button>
          </div>
        </div>
      )}

      {showSettings && (
        <EmergencySettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};
