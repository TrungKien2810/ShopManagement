import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// @ts-ignore
import axios from "axios";
import { motion } from "framer-motion";
import { User, Mail, Lock, ArrowRight, Loader2, UserCircle, ArrowLeft } from "lucide-react";
import { Logo } from "../components/Logo";

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
      alert("Đăng ký thành công! Hãy đăng nhập để bắt đầu.");
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
    <div className="min-h-screen flex items-center justify-center bg-void p-6 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-purple/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-emerald/5 blur-[120px] rounded-full" />

        <div className="relative z-10 w-full max-w-[480px]">
          <button 
            onClick={() => navigate('/')}
            className="mb-8 text-brand-gray hover:text-white font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all group"
          >
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            Quay lại trang chủ
          </button>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full linear-surface p-10 shadow-2xl"
          >
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
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
                <label className="block text-[10px] font-bold text-brand-gray uppercase tracking-widest ml-1">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-[#4c4f5a]" />
                  <input
                    name="username"
                    type="text"
                    className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/[0.08] rounded-xl focus:border-brand-purple outline-none transition-all placeholder:text-[#31343e] text-sm"
                    placeholder="Tên dùng để đăng nhập"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-brand-gray uppercase tracking-widest ml-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-[#4c4f5a]" />
                  <input
                    name="email"
                    type="email"
                    className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/[0.08] rounded-xl focus:border-brand-purple outline-none transition-all placeholder:text-[#31343e] text-sm"
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
           </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-brand-gray uppercase tracking-widest ml-1">
              Họ và Tên
            </label>
            <div className="relative">
              <UserCircle className="absolute left-4 top-3.5 w-4 h-4 text-[#4c4f5a]" />
              <input
                name="fullName"
                type="text"
                className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/[0.08] rounded-xl focus:border-brand-purple outline-none transition-all placeholder:text-[#31343e] text-sm"
                placeholder="Nhập tên đầy đủ của bạn"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-brand-gray uppercase tracking-widest ml-1">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-[#4c4f5a]" />
                <input
                  name="password"
                  type="password"
                  className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/[0.08] rounded-xl focus:border-brand-purple outline-none transition-all placeholder:text-[#31343e] text-sm"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold text-brand-gray uppercase tracking-widest ml-1">
                Xác nhận
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-[#4c4f5a]" />
                <input
                  name="confirmPassword"
                  type="password"
                  className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/[0.08] rounded-xl focus:border-brand-purple outline-none transition-all placeholder:text-[#31343e] text-sm"
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Tạo tài khoản"}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="mt-8 text-center text-brand-gray text-xs font-medium">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-white font-bold hover:text-brand-purple transition-colors ml-1"
          >
            Đăng nhập ngay
          </Link>
        </p>

        <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
            <p className="text-[9px] font-bold text-[#31343e] uppercase tracking-widest italic">ZôOS Engine v1.0.8 • Secure Registration</p>
        </div>
        </motion.div>
      </div>
    </div>
  );
};
