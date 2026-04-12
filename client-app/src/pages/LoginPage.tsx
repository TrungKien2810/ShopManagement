import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5090/api/auth/login",
        { username, password },
      );
      login(response.data.token, response.data.username);
      navigate("/shops");
    } catch (error) {
      alert("Đăng nhập thất bại!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-slate-200 p-6 selection:bg-orange-500/30">
      <div className="max-w-md w-full bg-slate-800/40 p-10 rounded-[40px] shadow-2xl border border-slate-700/50 backdrop-blur-xl animate-fadeIn">
        <div className="text-center mb-10">
          <div className="inline-block w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-900/20 mb-6 font-black italic text-3xl text-white">
            Z
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
            Chào mừng trở lại
          </h1>
          <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">
            Đăng nhập vào hệ điều hành ZôOS
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
              Tài khoản
            </label>
            <input
              type="text"
              className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all placeholder:text-slate-700"
              placeholder="zoodaduo"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">
              Mật khẩu
            </label>
            <input
              type="password"
              className="w-full px-5 py-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 outline-none transition-all placeholder:text-slate-700"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-5 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-black rounded-2xl shadow-2xl shadow-orange-900/30 transition-all transform active:scale-95 uppercase tracking-[0.2em] text-sm"
          >
            Đăng Nhập 🚀
          </button>
        </form>
        <p className="mt-8 text-center text-slate-500 text-sm font-medium">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-orange-400 font-black hover:text-orange-300 transition-colors uppercase tracking-widest ml-2"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};
