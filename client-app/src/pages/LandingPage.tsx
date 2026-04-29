import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ProfileDropdown } from "../components/ProfileDropdown";
import { Logo } from "../components/Logo";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Store, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Smartphone, 
  Globe,
  MonitorCheck
} from "lucide-react";


export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-void text-white font-sans selection:bg-brand-purple/30 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-[100] border-b border-white/[0.05] bg-void/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <Logo />
          
          <div className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-brand-gray">
            <a href="#features" className="hover:text-white transition-colors">Tính năng</a>
            <a href="#solutions" className="hover:text-white transition-colors">Giải pháp</a>
            <a href="#support" className="hover:text-white transition-colors">Hỗ trợ</a>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/shops")}
                  className="px-5 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] text-xs font-bold rounded-full border border-white/[0.1] transition-all active:scale-95 hidden sm:block"
                >
                  Dashboard
                </button>
                <ProfileDropdown />
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-1.5 text-xs font-bold text-brand-gray hover:text-white transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-5 py-1.5 bg-brand-purple hover:bg-brand-purple/90 text-white text-xs font-bold rounded-full shadow-lg shadow-brand-purple/20 transition-all active:scale-95 flex items-center gap-2 group"
                >
                  Dùng thử
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-8 relative">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-purple/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex px-3 py-1 bg-brand-purple/10 border border-brand-purple/20 rounded-full text-brand-purple text-[10px] font-bold uppercase tracking-widest mb-10"
          >
            Nền tảng Quản lý Nhà hàng Thế hệ mới
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-bold text-white mb-10 tracking-tight leading-[0.9]"
          >
            Vận hành tinh gọn.
            <br />
            <span className="text-brand-gray italic">Tăng trưởng vượt bậc.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-brand-gray text-lg md:text-xl mb-14 font-medium leading-relaxed"
          >
            Hệ điều hành ZôOS số hóa toàn bộ quy trình từ QR Order, quản lý bếp 
            đến báo cáo real-time chỉ trong một nền tảng duy nhất.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate(user ? "/shops" : "/register")}
              className="btn-primary px-10 py-3.5 flex items-center gap-3 text-sm group"
            >
              Bắt đầu hành trình
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-10 py-3.5 bg-white/[0.02] hover:bg-white/[0.05] text-white text-sm font-bold rounded-lg border border-white/[0.08] transition-all">
              Xem bản Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Card Wall */}
      <section id="features" className="py-24 bg-black/20 border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-8">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { label: "Thiết bị không giới hạn", value: "Infinity", icon: Smartphone },
                { label: "Độ trễ vận hành", value: "< 200ms", icon: Zap },
                { label: "Bảo mật dữ liệu", value: "Enterprise", icon: ShieldCheck },
                { label: "Hỗ trợ 24/7", value: "Direct", icon: Globe },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-2">
                   <item.icon className="w-5 h-5 text-brand-gray mb-2" />
                   <div className="text-3xl font-bold text-white tracking-tight">{item.value}</div>
                   <div className="text-[10px] font-bold text-brand-gray uppercase tracking-widest">{item.label}</div>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "QR Order Tĩnh & Động",
                desc: "Khách hàng quét mã QR tại bàn để gọi món tức thì. Tối ưu cho cả quầy bar và bàn tiệc.",
                icon: Smartphone,
              },
              {
                title: "Đồng bộ SignalR",
                desc: "Mọi thay đổi từ Bàn - Bếp - Thu ngân được cập nhật trong tích tắc mà không cần tải lại trang.",
                icon: Zap,
              },
              {
                title: "Hệ sinh thái SaaS",
                desc: "Quản lý đa cửa hàng trên cùng một tài khoản. Phân quyền vai trò Owner, Manager, Staff linh hoạt.",
                icon: Store,
              },
              {
                title: "Phân tích Dữ liệu",
                desc: "Biểu đồ trực quan về doanh thu và món bán chạy giúp bạn đưa ra quyết định kinh doanh chính xác.",
                icon: BarChart3,
              },
              {
                title: "Giám sát Thiết bị",
                desc: "Theo dõi trạng thái kết nối và hiệu suất của từng thiết bị trong hệ thống theo thời gian thực.",
                icon: MonitorCheck,
              },
              {
                title: "Chứng chỉ Bảo mật",
                desc: "Dữ liệu được mã hóa và cô lập hoàn toàn giữa các doanh nghiệp trên nền tảng ZôOS.",
                icon: ShieldCheck,
              },
            ].map((f, i) => (
              <motion.div
                whileHover={{ y: -5 }}
                key={i}
                className="p-8 linear-card group"
              >
                <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-6 group-hover:border-brand-purple transition-colors">
                  <f.icon className="w-5 h-5 text-brand-gray group-hover:text-brand-purple transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight">
                  {f.title}
                </h3>
                <p className="text-brand-gray text-sm font-medium leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-white/[0.05] bg-slate-deep">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2.5 opacity-50">
            <div className="w-6 h-6 bg-brand-gray rounded flex items-center justify-center">
              <Store className="w-4 h-4 text-void" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-brand-gray">ZôOS Platform</span>
          </div>
          
          <div className="flex gap-8 text-[10px] font-bold text-[#31343e] uppercase tracking-[0.2em]">
            <span>v1.0.8 stable</span>
            <span>All rights reserved © 2026</span>
          </div>

          <div className="flex gap-6 text-brand-gray text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
