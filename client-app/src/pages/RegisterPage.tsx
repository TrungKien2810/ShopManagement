import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// @ts-ignore
import axios from "axios";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  UserCircle,
  ArrowLeft,
  Flame,
  Sparkles,
  Clock,
  Smartphone,
} from "lucide-react";
import { Logo } from "../components/Logo";
import { toast } from "sonner";

const inputClass =
  "w-full pl-11 pr-4 py-3.5 bg-black/40 border border-border-normal rounded-xl focus:border-amber focus:ring-2 focus:ring-amber/20 outline-none transition-all placeholder:text-brand-gray/40 text-sm";
const labelClass =
  "block text-[10px] font-bold text-brand-gray uppercase tracking-widest ml-1";
const iconClass = "absolute left-4 top-3.5 w-4 h-4 text-brand-gray/60";

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await axios.post("http://localhost:5090/api/auth/register", {
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password,
      });
      toast.success("Đăng ký thành công!", {
        description: "Hãy đăng nhập để bắt đầu.",
      });
      navigate("/login");
    } catch (err: any) {
      setError(
        err.response?.data?.[0]?.description ||
          "Đăng ký thất bại. Hãy thử lại!",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand showcase panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-border-normal">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 15%, rgba(244,181,65,0.12), transparent 55%), radial-gradient(circle at 10% 85%, rgba(194,65,12,0.14), transparent 55%)",
          }}
        />
        <Logo iconSize={6} textSize="text-2xl" />

        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber/[0.08] border border-border-bright rounded-full text-amber text-[10px] font-bold uppercase tracking-widest mb-8">
            <Sparkles className="w-3 h-3" /> Bắt đầu miễn phí
          </div>
          <h2 className="font-display text-5xl font-black text-white leading-[1.05] tracking-tighter mb-10">
            Mở cửa hàng đầu tiên
            <br />
            <span className="italic font-light text-brand-gray/60">
              chỉ trong vài phút.
            </span>
          </h2>
          <div className="space-y-5">
            {[
              { icon: Clock, text: "Thiết lập nhanh, không cần thẻ tín dụng" },
              { icon: Smartphone, text: "QR order tại bàn ngay sau khi tạo" },
              { icon: Flame, text: "Quản lý chuỗi nhiều cơ sở từ một nơi" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-brand-gray">
                <div className="w-9 h-9 rounded-xl bg-white/[0.04] border border-border-normal flex items-center justify-center">
                  <f.icon className="w-4 h-4 text-amber" strokeWidth={1.5} />
                </div>
                <span className="text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[9px] font-bold text-brand-gray/50 uppercase tracking-[0.2em]">
          © 2026 ZôOS Management Platform
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 relative">
        <div className="relative z-10 w-full max-w-[480px]">
          <button
            onClick={() => navigate("/")}
            className="mb-8 text-brand-gray hover:text-white font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Quay lại trang chủ
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full linear-surface p-8 md:p-10 shadow-2xl"
          >
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6 lg:hidden">
                <Logo iconSize={6} textSize="text-3xl" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
                Tham gia ZôOS
              </h1>
              <p className="text-brand-gray text-[10px] font-bold uppercase tracking-widest">
                Nền tảng Quản lý Nhà hàng Thế hệ mới
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-lg"
              >
                ⚠️ {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Username</label>
                  <div className="relative">
                    <User className={iconClass} />
                    <input
                      name="username"
                      type="text"
                      className={inputClass}
                      placeholder="Tên dùng để đăng nhập"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Email</label>
                  <div className="relative">
                    <Mail className={iconClass} />
                    <input
                      name="email"
                      type="email"
                      className={inputClass}
                      placeholder="example@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={labelClass}>Họ và Tên</label>
                <div className="relative">
                  <UserCircle className={iconClass} />
                  <input
                    name="fullName"
                    type="text"
                    className={inputClass}
                    placeholder="Nhập tên đầy đủ của bạn"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Mật khẩu</label>
                  <div className="relative">
                    <Lock className={iconClass} />
                    <input
                      name="password"
                      type="password"
                      className={inputClass}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Xác nhận</label>
                  <div className="relative">
                    <Lock className={iconClass} />
                    <input
                      name="confirmPassword"
                      type="password"
                      className={inputClass}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary mt-4 flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Tạo tài khoản"
                )}
                {!loading && (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-brand-gray text-xs font-medium">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-white font-bold hover:text-amber transition-colors ml-1"
              >
                Đăng nhập ngay
              </Link>
            </p>

            <div className="mt-8 pt-6 border-t border-border-subtle text-center">
              <p className="text-[9px] font-bold text-brand-gray/40 uppercase tracking-widest italic">
                ZôOS Engine v1.0.8 • Secure Registration
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
