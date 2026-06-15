import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../api/apiClient";
import { ProfileDropdown } from "../components/ProfileDropdown";
import { ArrowLeft, Store, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const BranchListPage: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBranch, setNewBranch] = useState({ name: "", address: "", phone: "" });
  
  const { currentShop, selectBranch } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (shopId) {
      loadBranches();
    }
  }, [shopId]);

  const loadBranches = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/shop/${shopId}/branches`);
      setBranches(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Lỗi khi tải danh sách chi nhánh:", err);
      toast.error("Không thể tải danh sách cơ sở");
      setLoading(false);
    }
  };

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranch.name.trim()) return toast.error("Tên cơ sở không được để trống");
    
    setIsSubmitting(true);
    try {
      const response = await apiClient.post(`/shop/${shopId}/branches`, newBranch);
      toast.success(response.data.Message || "Tạo cơ sở thành công!");
      setBranches([...branches, response.data]);
      setShowCreateModal(false);
      setNewBranch({ name: "", address: "", phone: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.Message || "Có lỗi xảy ra khi tạo cơ sở");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelect = (branch: any) => {
    selectBranch(branch);
    navigate(`/branch/${branch.id}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-void text-white p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto relative z-10">
        <button
          onClick={() => navigate("/shops")}
          className="mb-8 text-brand-gray hover:text-white font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all group"
        >
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
          Back to Shops
        </button>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {currentShop?.name || "Chi nhánh"}
            </h1>
            <p className="text-brand-gray text-xs font-bold uppercase tracking-widest">
              Select a branch to manage
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 bg-brand-purple hover:bg-[#6e7be2] text-white rounded-xl font-bold transition-all text-sm flex items-center gap-2 shadow-lg shadow-brand-purple/20"
            >
              ✨ Thêm cơ sở
            </button>
            <ProfileDropdown />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="h-40 linear-surface rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : branches.length === 0 ? (
          <div className="py-20 text-center linear-surface rounded-3xl border border-dashed border-white/[0.05]">
            <div className="w-16 h-16 rounded-full bg-brand-purple/10 flex items-center justify-center mb-6 mx-auto">
              <Store className="w-8 h-8 text-brand-purple" />
            </div>
            <h3 className="text-xl font-bold mb-2">Chưa có cơ sở nào</h3>
            <p className="text-brand-gray mb-6">
              Hệ thống của bạn chưa có chi nhánh nào. Hãy thêm cơ sở đầu tiên.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {branches.map((branch) => (
              <div
                key={branch.id}
                onClick={() => handleSelect(branch)}
                className="linear-card p-6 sm:p-8 rounded-2xl cursor-pointer group active:scale-95 transition-transform border border-white/[0.05] hover:border-brand-purple/30"
              >
                <div className="flex justify-between items-start mb-4 gap-3">
                  <h3 className="text-lg sm:text-2xl font-bold group-hover:text-brand-purple transition-colors line-clamp-2">
                    {branch.name}
                  </h3>
                </div>
                <p className="text-brand-gray mb-6 text-sm flex items-center gap-2">
                  <Store className="w-4 h-4" /> {branch.address}
                </p>
                <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden border border-white/[0.05]">
                  <div className="w-full h-full bg-gradient-to-r from-brand-purple to-brand-emerald"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowCreateModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg linear-surface rounded-3xl border border-white/[0.05] shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/[0.05] flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">Thêm cơ sở mới</h2>
                  <p className="text-sm text-brand-gray mt-1">Thiết lập chi nhánh mới cho chuỗi {currentShop?.name}</p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 text-brand-gray hover:text-white bg-white/[0.03] hover:bg-white/[0.05] rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateBranch} className="p-6 space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-gray uppercase tracking-widest">
                    Tên cơ sở <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newBranch.name}
                    onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-brand-purple/50 focus:bg-white/[0.05] transition-all"
                    placeholder="VD: Chi nhánh Lê Lợi"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-gray uppercase tracking-widest">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={newBranch.address}
                    onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-brand-purple/50 focus:bg-white/[0.05] transition-all"
                    placeholder="VD: 10 Lê Lợi, Quận 1"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-gray uppercase tracking-widest">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={newBranch.phone}
                    onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-brand-purple/50 focus:bg-white/[0.05] transition-all"
                    placeholder="VD: 0901234567"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.05] rounded-xl font-bold transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !newBranch.name.trim()}
                    className="flex-1 py-3 bg-brand-purple hover:bg-[#6e7be2] text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Tạo cơ sở"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
