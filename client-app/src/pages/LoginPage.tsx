import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// @ts-ignore
import axios from "axios";
import { motion } from "framer-motion";
import {
  Lock,
  User,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Flame,
  Zap,
  ShieldCheck,
  BarChart3,
} from "lucide-react";
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
      login(
        response.data.token,
        response.data.username,
        response.data.avatarUrl,
      );
      navigate("/shops");
    } catch (error) {
      setError("Tài khoản hoặc mật khẩu không đúng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Brand showcase panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden border-r border-border-normal">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(244,181,65,0.12), transparent 55%), radial-gradient(circle at 80% 90%, rgba(194,65,12,0.14), transparent 55%)",
          }}
        />
        <Logo iconSize={6} textSize="text-2xl" />

        <div className="max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber/[0.08] border border-border-bright rounded-full text-amber text-[10px] font-bold uppercase tracking-widest mb-8">
            <Flame className="w-3 h-3" /> ZôOS Operating System
          </div>
          <h2 className="font-display text-5xl font-black text-white leading-[1.05] tracking-tighter mb-10">
            Quán của bạn,
            <br />
            <span className="italic font-light text-brand-gray/60">
              vận hành như một bản nhạc.
            </span>
          </h2>
          <div className="space-y-5">
            {[
              { icon: Zap, text: "Đồng bộ real-time Bàn · Bếp · Thu ngân" },
              { icon: BarChart3, text: "Báo cáo doanh thu trực quan từng ngày" },
              { icon: ShieldCheck, text: "Bảo mật chuẩn doanh nghiệp" },
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
        <div className="relative z-10 w-full max-w-[400px]">
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
                  <User className="absolute left-4 top-3.5 w-4 h-4 text-brand-gray/60" />
                  <input
                    type="text"
                    className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-border-normal rounded-xl focus:border-amber focus:ring-2 focus:ring-amber/20 outline-none transition-all placeholder:text-brand-gray/40 text-sm"
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
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-brand-gray/60" />
                  <input
                    type="password"
                    className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-border-normal rounded-xl focus:border-amber focus:ring-2 focus:ring-amber/20 outline-none transition-all placeholder:text-brand-gray/40 text-sm"
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
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Đăng Nhập"
                )}
                {!loading && (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-brand-gray text-xs font-medium">
              Chưa có tài khoản?{" "}
              <Link
                to="/register"
                className="text-white font-bold hover:text-amber transition-colors ml-1"
              >
                Đăng ký ngay
              </Link>
            </p>

            <div className="mt-8 pt-6 border-t border-border-subtle text-center">
              <p className="text-[9px] font-bold text-brand-gray/40 uppercase tracking-widest italic">
                ZôOS Engine v1.0.8 • Secure Access
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
