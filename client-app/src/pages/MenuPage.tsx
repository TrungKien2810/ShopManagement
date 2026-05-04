import React from "react";
import { MenuGrid } from "../components/MenuGrid";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MenuPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-void text-white font-sans selection:bg-brand-purple/30">
      <header className="h-16 border-b border-white/[0.05] bg-void/50 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
        <button 
          onClick={() => navigate("/")}
          className="text-brand-gray hover:text-white font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Trang chủ
        </button>
        <h1 className="text-sm font-black text-white uppercase tracking-widest">
          Thực Đơn (Menu)
        </h1>
        <div className="w-20" /> {/* Spacer to balance header */}
      </header>

      <main className="p-6 max-w-5xl mx-auto mt-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-white">Khám phá Thực Đơn</h2>
          <p className="text-brand-gray font-medium max-w-xl mx-auto">
            Chọn danh mục bên dưới để xem các món ăn nổi bật của chúng tôi.
          </p>
        </div>

        {/* We pass an empty function because this is view-only, or we can optionally handle clicks */}
        <MenuGrid onSelectItem={(product) => console.log("Selected:", product)} />
      </main>
    </div>
  );
};
