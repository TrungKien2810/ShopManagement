import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { shopApi } from "../api/shopApi";
import { ProfileDropdown } from "../components/ProfileDropdown";
import { ArrowLeft } from "lucide-react";

export const ShopListPage: React.FC = () => {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectShop } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadShops();
  }, []);

  const loadShops = async () => {
    try {
      setLoading(true);
      const data = await shopApi.getAll();
      setShops(data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách quán:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (shop: any) => {
    selectShop(shop);
    navigate(`/shop/${shop.id}/branches`);
  };

  return (
    <div className="min-h-screen bg-void text-white p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto relative z-10">
        <button
          onClick={() => navigate("/")}
          className="mb-8 text-brand-gray hover:text-white font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back Home
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Your Shops
            </h1>
            <p className="text-brand-gray text-xs font-bold uppercase tracking-widest">
              Select or create a workspace
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/create-shop")}
              className="px-6 py-2.5 bg-brand-purple hover:bg-[#6e7be2] text-white rounded-xl font-bold transition-all text-sm flex items-center gap-2 shadow-lg shadow-brand-purple/20"
            >
              ✨ New Shop
            </button>
            <ProfileDropdown />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-40 linear-surface rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : shops.length === 0 ? (
          <div className="py-20 text-center linear-surface rounded-3xl border border-dashed border-white/[0.05]">
            <div className="w-16 h-16 rounded-full bg-brand-purple/10 flex items-center justify-center mb-6 mx-auto">
              <svg
                className="w-8 h-8 text-brand-purple"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">No Shops Yet</h3>
            <p className="text-brand-gray mb-6">
              Create your first shop to get started managing tables and orders.
            </p>
            <button
              onClick={() => navigate("/create-shop")}
              className="px-6 py-2 bg-brand-purple hover:bg-[#6e7be2] text-white rounded-lg font-bold transition-all inline-flex items-center gap-2"
            >
              Create First Shop
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {shops.map((shop) => (
              <div
                key={shop.id}
                onClick={() => handleSelect(shop)}
                className="linear-card p-6 sm:p-8 rounded-2xl cursor-pointer group active:scale-95 transition-transform"
              >
                <div className="flex justify-between items-start mb-4 gap-3">
                  <h3 className="text-lg sm:text-2xl font-bold group-hover:text-brand-purple transition-colors line-clamp-2">
                    {shop.name}
                  </h3>
                  <span className="px-3 py-1 bg-brand-purple/20 rounded-full text-xs font-semibold text-brand-purple uppercase tracking-wider whitespace-nowrap flex-shrink-0">
                    {shop.role}
                  </span>
                </div>
                <p className="text-brand-gray mb-6 text-sm">
                  📊 Manage Tables & Orders
                </p>
                <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden border border-white/[0.05]">
                  <div className="w-full h-full bg-gradient-to-r from-brand-purple to-brand-emerald"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
