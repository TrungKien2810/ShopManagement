import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Store, 
  Settings, 
  Menu as MenuIcon, 
  X, 
  LogOut, 
  User,
  RefreshCw
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

interface MainLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  showSidebar = true 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, currentShop, currentBranch } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [];
  
  if (currentShop) {
    if (currentBranch) {
      navigation.push(
        { name: "Tổng quan", href: `/branch/${currentBranch.id}/dashboard`, icon: LayoutDashboard },
        { name: "Bàn", href: `/branch/${currentBranch.id}/tables`, icon: Store },
        { name: "Nhân viên", href: `/branch/${currentBranch.id}/employees`, icon: User },
        { name: "Thực đơn", href: `/branch/${currentBranch.id}/menu`, icon: MenuIcon }
      );
    } else {
      navigation.push(
        { name: "Danh sách cơ sở", href: `/shop/${currentShop.id}/branches`, icon: Store }
      );
    }
    navigation.push(
      { name: "Cài đặt chuỗi", href: `/shop/${currentShop.id}/settings`, icon: Settings }
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-void text-white font-sans selection:bg-brand-purple/30">
      {/* Mobile Header */}
      <header className="lg:hidden h-16 border-b border-white/[0.05] bg-void/50 backdrop-blur-md sticky top-0 z-40 px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-purple rounded-lg flex items-center justify-center shadow-glow-purple">
            <span className="font-black text-white italic text-xl">Z</span>
          </div>
          <span className="font-black tracking-tighter text-lg uppercase">ZôOS</span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-brand-gray hover:text-white transition-colors"
        >
          {isMobileMenuOpen ? <X /> : <MenuIcon />}
        </button>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        {showSidebar && (
          <aside className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-slate-deep border-r border-white/[0.05] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}>
            <div className="flex flex-col h-full p-6">
              {/* Logo */}
              <Link to="/" className="hidden lg:flex items-center gap-3 mb-10 group transition-all active:scale-95">
                <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center shadow-glow-purple group-hover:shadow-glow-purple-lg transition-all">
                  <span className="font-black text-white italic text-2xl">Z</span>
                </div>
                <div>
                  <h1 className="font-black tracking-tighter text-xl uppercase leading-none group-hover:text-brand-purple transition-colors">ZôOS</h1>
                  <p className="text-[10px] text-brand-gray font-bold tracking-[0.2em] uppercase">Management</p>
                </div>
              </Link>

              {/* Current Shop & Branch Info */}
              {currentShop && (
                <div 
                  onClick={() => navigate(currentBranch ? `/shop/${currentShop.id}/branches` : "/shops")}
                  className="mb-8 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] group cursor-pointer hover:bg-white/[0.05] hover:border-brand-purple/30 transition-all"
                  title={currentBranch ? "Nhấn để đổi cơ sở" : "Nhấn để đổi chuỗi"}
                >
                  <p className="text-[10px] text-brand-gray font-bold uppercase tracking-wider mb-2">
                    Chuỗi: {currentShop.name}
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-sm truncate text-white">
                      {currentBranch ? `📍 ${currentBranch.name}` : "Chọn cơ sở..."}
                    </span>
                    <div className="p-1.5 rounded-lg bg-brand-purple/10 text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-all shadow-sm">
                      <RefreshCw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <nav className="flex-1 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group
                      ${isActive(item.href) 
                        ? "bg-brand-purple/10 text-brand-purple-light border border-brand-purple/20 shadow-glow-purple" 
                        : "text-brand-gray hover:text-white hover:bg-white/[0.03] border border-transparent"}
                    `}
                  >
                    <item.icon className={`w-5 h-5 ${isActive(item.href) ? "text-brand-purple" : "group-hover:scale-110 transition-transform"}`} />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>

              {/* User Section */}
              <div className="mt-auto pt-6 border-t border-white/[0.05] space-y-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-purple to-brand-orange p-[2px]">
                    <div className="w-full h-full rounded-full bg-slate-deep flex items-center justify-center overflow-hidden">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-brand-gray" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{user?.username || "Người dùng"}</p>
                    <p className="text-[10px] text-brand-gray font-medium truncate uppercase">{currentShop?.role || "Staff"}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all font-medium border border-transparent hover:border-red-500/20"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Backdrop for mobile */}
        {isMobileMenuOpen && showSidebar && (
          <div 
            className="fixed inset-0 bg-void/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className={`flex-1 min-w-0 ${showSidebar ? "lg:p-8 p-4" : ""}`}>
          <div className={`${showSidebar ? "max-w-7xl mx-auto" : ""}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
