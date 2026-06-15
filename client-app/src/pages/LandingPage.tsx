import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Logo } from "../components/Logo";
import { motion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Store,
  Zap,
  ShieldCheck,
  BarChart3,
  Smartphone,
  Globe,
  MonitorCheck,
  Check,
  Flame,
} from "lucide-react";

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="relative">
      {/* Atmospheric glows */}
      <div className="fixed top-[-10%] left-1/2 -translate-x-1/2 w-full max-w-[1100px] h-[640px] bg-amber/[0.06] blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="fixed top-[20%] right-[-5%] w-[480px] h-[480px] bg-brand-purple/[0.08] blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* Navigation */}
      <nav className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between px-4 py-3 rounded-2xl border border-border-normal bg-void/60 backdrop-blur-xl lg:px-8">
        <Logo />
        <div className="flex items-center gap-2">
          {user ? (
            <button
              onClick={() => navigate("/shops")}
              className="px-4 py-2 bg-brand-purple/10 hover:bg-brand-purple/20 text-brand-purple-light text-xs font-bold rounded-xl border border-brand-purple/20 transition-all active:scale-95"
            >
              Dashboard
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-bold rounded-xl border border-white/[0.1] transition-all active:scale-95"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-4 md:pt-44 md:pb-20 overflow-hidden">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="max-w-5xl mx-auto text-center relative z-10"
        >
          <motion.div
            variants={rise}
            className="inline-flex items-center gap-2 px-3 py-1 bg-amber/[0.08] border border-border-bright rounded-full text-amber text-[10px] font-bold uppercase tracking-widest mb-6 md:mb-10"
          >
            <Flame className="w-3 h-3" />
            Nền tảng Quản lý F&B Thế hệ mới
          </motion.div>

          <motion.h1
            variants={rise}
            className="font-display text-5xl sm:text-7xl md:text-8xl font-black text-white mb-6 md:mb-8 tracking-tighter leading-[0.95]"
          >
            Vận hành tinh gọn.
            <br />
            <span className="italic font-light bg-gradient-to-r from-amber via-brand-purple-light to-ember-bright bg-clip-text text-transparent">
              Tăng trưởng vượt bậc.
            </span>
          </motion.h1>

          <motion.p
            variants={rise}
            className="max-w-2xl mx-auto text-brand-gray text-base md:text-xl mb-9 md:mb-12 font-medium leading-relaxed"
          >
            Số hóa toàn bộ quy trình từ Order, quản lý nhân sự đến báo cáo
            real-time chỉ trong một nền tảng duy nhất.
          </motion.p>

          <motion.div
            variants={rise}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
          >
            <button
              onClick={() => navigate(user ? "/shops" : "/register")}
              className="btn-primary w-full sm:w-auto px-10 py-4 flex items-center justify-center gap-3 text-sm group"
            >
              Bắt đầu ngay
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-10 py-4 bg-white/[0.02] hover:bg-white/[0.05] text-white text-sm font-bold rounded-xl border border-border-normal hover:border-border-bright transition-all">
              Xem bản Demo
            </button>
          </motion.div>
        </motion.div>

        {/* Layered hero visual — overlapping live-order cards (grid-breaking) */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-3xl mx-auto mt-16 md:mt-24 h-[220px] md:h-[300px]"
        >
          <div className="absolute inset-x-8 top-6 bottom-0 linear-surface mask-fade-bottom" />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-2 md:left-10 top-0 w-56 md:w-72 linear-card p-4 -rotate-3 shadow-glow-ember"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white">Bàn 04 · Tầng 1</span>
              <span className="text-[9px] font-bold text-brand-emerald uppercase tracking-widest">
                Đang phục vụ
              </span>
            </div>
            {["Phở bò tái", "Cà phê sữa", "Bánh mì"].map((m) => (
              <div
                key={m}
                className="flex items-center gap-2 text-xs text-brand-gray py-1"
              >
                <Check className="w-3 h-3 text-brand-emerald" /> {m}
              </div>
            ))}
          </motion.div>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute right-2 md:right-10 top-10 w-48 md:w-64 linear-card p-4 rotate-3"
          >
            <div className="text-[9px] font-bold text-brand-gray uppercase tracking-widest mb-1">
              Doanh thu hôm nay
            </div>
            <div className="font-display text-2xl md:text-3xl font-black text-white tracking-tight">
              12.480.000₫
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-ember to-amber" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats band */}
      <section
        id="features"
        className="py-16 md:py-24 bg-black/20 border-y border-border-subtle px-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: "Thiết bị", value: "Unlimited", icon: Smartphone },
              { label: "Độ trễ", value: "< 200ms", icon: Zap },
              { label: "Bảo mật", value: "AES-256", icon: ShieldCheck },
              { label: "Hỗ trợ", value: "24/7", icon: Globe },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex flex-col gap-2 items-center md:items-start text-center md:text-left"
              >
                <item.icon className="w-5 h-5 text-amber mb-2" />
                <div className="font-display text-2xl md:text-3xl font-black text-white tracking-tight">
                  {item.value}
                </div>
                <div className="text-[9px] font-bold text-brand-gray uppercase tracking-widest">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-20 md:py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-5xl font-black text-white tracking-tighter text-center mb-14 md:mb-20 max-w-2xl mx-auto leading-tight"
          >
            Mọi thứ một quán cần,{" "}
            <span className="text-brand-gray/50 italic font-light">gói gọn một nơi.</span>
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { title: "QR Order Siêu Tốc", desc: "Khách quét mã QR tại bàn để gọi món tức thì. Tối ưu trải nghiệm không cần chờ đợi.", icon: Smartphone },
              { title: "Real-time Sync", desc: "Mọi thay đổi từ Bàn - Bếp - Thu ngân được cập nhật trong tích tắc qua SignalR.", icon: Zap },
              { title: "Quản lý Đa cửa hàng", desc: "Hệ sinh thái SaaS cho phép quản lý chuỗi cửa hàng chỉ với một tài khoản duy nhất.", icon: Store },
              { title: "Báo cáo Thông minh", desc: "Theo dõi doanh thu, món bán chạy và hiệu suất nhân viên qua biểu đồ trực quan.", icon: BarChart3 },
              { title: "Cross-platform", desc: "Hoạt động mượt mà trên mọi thiết bị từ Smartphone, Tablet đến Desktop.", icon: MonitorCheck },
              { title: "Bảo mật Tuyệt đối", desc: "Dữ liệu doanh nghiệp được cô lập và mã hóa chuẩn Enterprise SaaS.", icon: ShieldCheck },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: (i % 3) * 0.08, duration: 0.5 }}
                whileHover={{ y: -6 }}
                className="p-6 md:p-8 linear-card group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber/[0.08] border border-border-bright flex items-center justify-center mb-6 group-hover:bg-amber/[0.16] transition-all">
                  <f.icon className="w-6 h-6 text-amber" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
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

      {/* CTA band */}
      <section className="px-4 pb-20 md:pb-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto relative overflow-hidden rounded-3xl border border-border-bright p-10 md:p-16 text-center"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 0%, rgba(244,181,65,0.12), transparent 60%), linear-gradient(180deg, rgba(194,65,12,0.10), transparent)",
          }}
        >
          <h2 className="font-display text-3xl md:text-5xl font-black text-white tracking-tighter mb-5">
            Sẵn sàng nâng tầm cửa hàng?
          </h2>
          <p className="text-brand-gray max-w-xl mx-auto mb-8 font-medium">
            Khởi tạo cửa hàng đầu tiên trong vài phút. Không cần thẻ tín dụng.
          </p>
          <button
            onClick={() => navigate(user ? "/shops" : "/register")}
            className="btn-primary px-10 py-4 inline-flex items-center gap-3 text-sm group"
          >
            Tạo cửa hàng miễn phí
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-20 px-4 border-t border-border-normal bg-slate-deep">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <Logo />
            <div className="hidden md:block h-4 w-[1px] bg-white/10" />
            <p className="text-[10px] text-brand-gray font-bold uppercase tracking-[0.2em]">
              © 2026 ZôOS Management Platform
            </p>
          </div>

          <div className="flex gap-6 text-brand-gray text-[10px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-amber transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-amber transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
