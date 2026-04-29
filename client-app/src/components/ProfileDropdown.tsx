import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { EmergencySettingsModal } from './EmergencySettingsModal';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, LogOut, ChevronDown, User, Store } from 'lucide-react';
import { cn } from '../lib/utils';

export const ProfileDropdown: React.FC = () => {
  const { user, currentShop, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  if (!user) return null;

  return (
    <div className="relative z-50 font-sans">
      <motion.button
        whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1 pr-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] rounded-full transition-all group"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-[#08090a] border border-white/[0.1] flex items-center justify-center relative">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <User className="w-4 h-4 text-brand-gray" />
          )}
        </div>
        
        <div className="flex flex-col items-start hidden sm:flex">
          <span className="text-xs font-semibold text-white leading-tight">
            {user.username}
          </span>
          {currentShop ? (
            <span className="text-[9px] font-bold text-brand-purple uppercase tracking-wider mt-0.5">
              {currentShop.role}
            </span>
          ) : (
            <span className="text-[9px] font-bold text-[#4c4f5a] uppercase tracking-wider mt-0.5">
              ZôOS System
            </span>
          )}
        </div>
        
        <ChevronDown className={cn("w-3.5 h-3.5 text-[#4c4f5a] transition-transform duration-300", isOpen && "rotate-180")} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-60 linear-surface overflow-hidden z-[100] shadow-2xl origin-top-right"
          >
            <div className="px-4 py-4 border-b border-white/[0.06] bg-white/[0.01]">
              <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-lg bg-[#0f1115] border border-white/[0.08] flex items-center justify-center shadow-inner">
                    <Store className="w-4.5 h-4.5 text-brand-purple" />
                 </div>
                 <div className="flex flex-col">
                    <p className="text-sm font-bold text-white tracking-tight">{user.username}</p>
                    <p className="text-[10px] text-brand-gray font-medium">ZôOS Ecosystem</p>
                 </div>
              </div>
            </div>

            <div className="p-1.5 space-y-0.5">
              <button
                onClick={() => {
                  setIsOpen(false);
                  setShowSettings(true);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-[#8a8f98] hover:bg-white/[0.06] hover:text-white rounded-lg transition-all group"
              >
                <Settings className="w-4 h-4 text-[#4c4f5a] group-hover:text-brand-purple transition-colors" />
                Cài đặt khẩn cấp
              </button>
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-rose-400/80 hover:bg-rose-500/10 hover:text-rose-400 rounded-lg transition-all group"
              >
                <LogOut className="w-4 h-4 opacity-70" />
                Đăng xuất
              </button>
            </div>
            
            <div className="px-4 py-2 bg-black/20 flex items-center justify-between border-t border-white/[0.04]">
               <span className="text-[8px] font-bold text-[#31343e] uppercase tracking-widest">Engine v1.0.8</span>
               <div className="w-1.5 h-1.5 rounded-full bg-brand-purple animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showSettings && (
        <EmergencySettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};
