import React, { useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./ui/Button";
import { menuManagementApi } from "../api/menuManagementApi";
import { toast } from "sonner";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string;
  categoryName: string;
  products: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
  onDone?: () => void;
};

export const DeleteConfirmModal: React.FC<Props> = ({ isOpen, onClose, categoryId, categoryName, products, categories, onDone }) => {
  const [loading, setLoading] = useState(false);
  const [option, setOption] = useState<"archive" | "reassign" | "force">("archive");
  const [targetCat, setTargetCat] = useState<string>(categories?.[0]?.id || "");

  const handleConfirm = async () => {
    setLoading(true);
    try {
      if (option === "reassign") {
        // Reassign each product to target category
        for (const p of products) {
          await menuManagementApi.updateProduct(p.id, { categoryId: targetCat });
        }
        await menuManagementApi.deleteCategory(categoryId);
      } else if (option === "archive") {
        for (const p of products) {
          await menuManagementApi.updateProduct(p.id, { isAvailable: false });
        }
        await menuManagementApi.deleteCategory(categoryId);
      } else if (option === "force") {
        await menuManagementApi.deleteCategory(categoryId, true);
      }

      onDone && onDone();
      onClose();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.response?.data?.message || "Xóa danh mục thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Delete category "${categoryName}"`}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-brand-gray">This category contains {products.length} products. Choose how to handle them:</p>

        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-3">
            <input type="radio" name="deloption" checked={option === "archive"} onChange={() => setOption("archive")} />
            <span className="ml-2 font-bold">Archive products</span>
            <span className="ml-2 text-xs text-brand-gray">Mark products inactive and remove category</span>
          </label>

          <label className="flex items-center gap-3">
            <input type="radio" name="deloption" checked={option === "reassign"} onChange={() => setOption("reassign")} />
            <span className="ml-2 font-bold">Move products to another category</span>
          </label>

          {option === "reassign" && (
            <select value={targetCat} onChange={(e) => setTargetCat(e.target.value)} className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-3 py-2 mt-2">
              {categories.filter(c => c.id !== categoryId).map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}

          <label className="flex items-center gap-3">
            <input type="radio" name="deloption" checked={option === "force"} onChange={() => setOption("force")} />
            <span className="ml-2 font-bold">Permanently delete (Admin only)</span>
            <span className="ml-2 text-xs text-brand-gray">This cannot be undone and will fail if products are referenced by orders.</span>
          </label>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleConfirm} disabled={loading || (option === "reassign" && !targetCat)}>
            {loading ? "Working..." : option === "force" ? "Delete Permanently" : "Confirm"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
