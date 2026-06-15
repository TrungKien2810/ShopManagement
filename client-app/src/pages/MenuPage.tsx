import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cn } from "../lib/utils";
import { MenuManagement } from "../components/MenuManagement";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";
import apiClient from "../api/apiClient";

export type MenuFilterType = "shared" | "branch";

export const MenuPage: React.FC = () => {
  const { branchId } = useParams<{ branchId: string }>();
  const { currentShop, currentBranch, selectBranch } = useAuth();
  const [filterType, setFilterType] = useState<MenuFilterType>("shared");
  const [syncingBranch, setSyncingBranch] = useState(false);

  useEffect(() => {
    if (!branchId || !currentShop) return;
    if (currentBranch?.id === branchId) return;

    const syncBranch = async () => {
      setSyncingBranch(true);
      try {
        const resp = await apiClient.get(`/shop/${currentShop.id}/branches`);
        const found = resp.data.find((b: { id: string; name: string }) => b.id === branchId);
        selectBranch(
          found ? { id: found.id, name: found.name } : { id: branchId, name: "Cơ sở" },
        );
      } catch {
        selectBranch({ id: branchId, name: "Cơ sở" });
      } finally {
        setSyncingBranch(false);
      }
    };

    syncBranch();
  }, [branchId, currentShop, currentBranch, selectBranch]);

  const effectiveBranchId = branchId ?? currentBranch?.id;

  if (syncingBranch && !currentBranch) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">Thực đơn</h2>
        <p className="text-sm text-brand-gray uppercase tracking-widest font-bold text-[10px]">
          Quản lý món ăn {currentBranch ? `— ${currentBranch.name}` : ""}
        </p>
      </div>

      <div className="flex bg-white/[0.03] p-1 rounded-2xl border border-white/[0.08] w-full sm:w-fit">
        <button
          type="button"
          onClick={() => setFilterType("shared")}
          className={cn(
            "flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-widest",
            filterType === "shared"
              ? "bg-brand-purple text-white shadow-lg"
              : "text-brand-gray hover:text-white",
          )}
        >
          Menu chung
        </button>
        <button
          type="button"
          onClick={() => setFilterType("branch")}
          disabled={!effectiveBranchId}
          className={cn(
            "flex-1 sm:flex-none px-6 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-widest",
            filterType === "branch"
              ? "bg-brand-purple text-white shadow-lg"
              : "text-brand-gray hover:text-white",
            !effectiveBranchId && "opacity-40 cursor-not-allowed",
          )}
        >
          Menu riêng
        </button>
      </div>

      <MenuManagement filterType={filterType} branchId={effectiveBranchId} />
    </div>
  );
};
