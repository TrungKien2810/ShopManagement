import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// @ts-ignore
import axios from "axios";
import { motion } from "framer-motion";
import { Lock, User, Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { Logo } from "../components/Logo";

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:5090/api/auth/login",
        { username, password },
      );
      login(response.data.token, response.data.username, response.data.avatarUrl);
      navigate("/shops");
    } catch (error) {
      setError("Tài khoản hoặc mật khẩu không đúng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-void p-6 relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-purple/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-emerald/5 blur-[120px] rounded-full" />

        <div className="relative z-10 w-full max-w-[400px]">
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
            className="max-w-[400px] w-full linear-surface p-10 shadow-2xl"
          >
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <Logo iconSize={6} textSize="text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
            Chào mừng trở lại
          </h1>
          <p className="text-brand-gray text-xs font-medium uppercase tracking-widest">
            Hệ điều hành ZôOS SaaS
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold rounded-lg flex items-center gap-2"
          >
            <p>{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-brand-gray uppercase tracking-widest ml-1">
              Tài khoản
            </label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-4 h-4 text-[#4c4f5a]" />
              <input
                type="text"
                className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/[0.08] rounded-xl focus:border-brand-purple outline-none transition-all placeholder:text-[#31343e] text-sm"
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-brand-gray uppercase tracking-widest ml-1">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-[#4c4f5a]" />
              <input
                type="password"
                className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/[0.08] rounded-xl focus:border-brand-purple outline-none transition-all placeholder:text-[#31343e] text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary mt-4 flex items-center justify-center gap-2 group"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Đăng Nhập"}
            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="mt-8 text-center text-brand-gray text-xs font-medium">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-white font-bold hover:text-brand-purple transition-colors ml-1"
          >
            Đăng ký ngay
          </Link>
        </p>

        <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
            <p className="text-[9px] font-bold text-[#31343e] uppercase tracking-widest italic">ZôOS Engine v1.0.8 • Secure Access</p>
        </div>
        </motion.div>
      </div>
    </div>
  );
};
