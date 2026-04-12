import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ProfileDropdown } from "../components/ProfileDropdown";

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-inter selection:bg-orange-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20">
              <span className="text-2xl font-black text-white italic">Z</span>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              ZôOS
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-slate-400">
            <a
              href="#features"
              className="hover:text-orange-400 transition-colors"
            >
              Tính năng
            </a>
            <a
              href="#pricing"
              className="hover:text-orange-400 transition-colors"
            >
              Bảng giá
            </a>
            <a
              href="#contact"
              className="hover:text-orange-400 transition-colors"
            >
              Liên hệ
            </a>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <button
                  onClick={() => navigate("/shops")}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl border border-slate-700 transition-all active:scale-95 hidden sm:block"
                >
                  Vào Dashboard
                </button>
                <ProfileDropdown />
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-2.5 text-sm font-bold text-slate-300 hover:text-white transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-900/20 transition-all active:scale-95"
                >
                  Dùng thử miễn phí
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-red-600/10 blur-[100px] rounded-full"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-xs font-black uppercase tracking-[0.2em] mb-8 animate-fadeIn">
            Nền tảng Quản lý Nhà hàng Thế hệ mới
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9] animate-slideUp">
            QUẢN LÝ QUÁN NHẬU
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-red-500 to-rose-600 bg-clip-text text-transparent">
              CHỈ VỚI MỘT CHẠM
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-12 font-medium leading-relaxed animate-slideUp delay-100">
            ZôOS giúp bạn số hóa quy trình từ gọi món tại bàn bằng QR, quản lý
            bếp, đến thanh toán và báo cáo doanh thu theo thời gian thực.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slideUp delay-200">
            <button
              onClick={() => navigate(user ? "/shops" : "/register")}
              className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black rounded-2xl shadow-2xl shadow-orange-900/40 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-sm"
            >
              {user ? "Vào Dashboard Ngay" : "Bắt đầu ngay hôm nay"}
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-2xl border border-slate-700 transition-all active:scale-95 uppercase tracking-widest text-sm">
              Xem bản Demo 📺
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900/50 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: "Quán đang sử dụng", value: "500+" },
            { label: "Đơn hàng mỗi tháng", value: "1M+" },
            { label: "Tiết kiệm nhân lực", value: "30%" },
            { label: "Tốc độ gọi món", value: "2s" },
          ].map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-4xl font-black text-white mb-2 group-hover:text-orange-400 transition-colors">
                {stat.value}
              </div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-white mb-4">
              Mọi thứ bạn cần để vận hành
            </h2>
            <p className="text-slate-400 font-medium">
              Đơn giản hóa nghiệp vụ phức tạp bằng công nghệ thông minh
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "QR Order Tĩnh",
                desc: "Khách hàng tự quét mã QR tại bàn để xem menu và gọi món. Không cần cài ứng dụng, không cần đăng ký.",
                icon: "📱",
              },
              {
                title: "Quản lý Real-time",
                desc: "Đồng bộ hóa dữ liệu giữa Bàn - Bếp - Thu ngân tức thì qua công nghệ SignalR. Không bao giờ sót đơn.",
                icon: "⚡",
              },
              {
                title: "SaaS Multi-tenant",
                desc: "Một tài khoản quản lý nhiều chuỗi quán. Phân quyền chi tiết cho Chủ quán, Quản lý và Nhân viên.",
                icon: "🏢",
              },
              {
                title: "Báo cáo Thông minh",
                desc: "Biểu đồ doanh thu, món bán chạy, hiệu suất nhân viên được cập nhật liên tục trên Dashboard.",
                icon: "📊",
              },
              {
                title: "Giao diện 'Một Chạm'",
                desc: "Tối ưu hóa cho Tablet và điện thoại, giúp nhân viên thao tác nhanh nhất có thể trong giờ cao điểm.",
                icon: "👆",
              },
              {
                title: "An toàn & Bảo mật",
                desc: "Dữ liệu được mã hóa và cô lập giữa các Shop (Isolation Layer), đảm bảo tính riêng tư tuyệt đối.",
                icon: "🔒",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="p-8 bg-slate-800/30 border border-slate-700/50 rounded-3xl hover:bg-slate-800/50 hover:border-orange-500/30 transition-all group"
              >
                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">
                  {f.icon}
                </div>
                <h3 className="text-xl font-black text-white mb-4">
                  {f.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center font-black italic text-white">
              Z
            </div>
            <span className="text-xl font-black text-white uppercase tracking-tighter">
              ZôOS
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            © 2026 ZôOS Nền tảng Quản lý Nhà hàng. All rights reserved.
          </p>
          <div className="flex gap-6 text-slate-400 text-sm font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
