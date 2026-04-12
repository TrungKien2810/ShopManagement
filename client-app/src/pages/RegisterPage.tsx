import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

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
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-slate-200 p-6 selection:bg-orange-500/30">
      <div className="max-w-xl w-full bg-slate-800/40 p-10 rounded-[40px] shadow-2xl border border-slate-700/50 backdrop-blur-xl animate-fadeIn">
        <div className="text-center mb-10">
          <div className="inline-block w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/20 mb-6 font-black italic text-3xl text-white">
            Z
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
            Tham gia ZôOS
          </h1>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">
            Bắt đầu quản lý quán nhậu của bạn
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-2xl mb-8 text-sm font-bold animate-shake">
            ⚠️ {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
              Username
            </label>
            <input
              name="username"
              type="text"
              className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all placeholder:text-slate-700"
              placeholder="zoodaduo"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all placeholder:text-slate-700"
              placeholder="hello@zoos.vn"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
              Họ và Tên
            </label>
            <input
              name="fullName"
              type="text"
              className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all placeholder:text-slate-700"
              placeholder="Nguyễn Văn Zô"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
              Mật khẩu
            </label>
            <input
              name="password"
              type="password"
              className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all placeholder:text-slate-700"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
              Xác nhận
            </label>
            <input
              name="confirmPassword"
              type="password"
              className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all placeholder:text-slate-700"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 mt-4 w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-black rounded-2xl shadow-2xl shadow-orange-900/30 transition-all transform active:scale-95 uppercase tracking-[0.2em] text-sm"
          >
            {loading ? "Đang tạo tài khoản..." : "Đăng ký ngay 🚀"}
          </button>
        </form>
        <p className="mt-8 text-center text-slate-500 text-sm font-medium">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="text-orange-400 font-black hover:text-orange-300 transition-colors uppercase tracking-widest ml-2"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};
