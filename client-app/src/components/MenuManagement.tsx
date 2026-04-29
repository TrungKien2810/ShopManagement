import React, { useEffect, useMemo, useState } from "react";
import { menuApi } from "../api/menuApi";
import { menuManagementApi } from "../api/menuManagementApi";
import { cn } from "../lib/utils";

type Category = {
  id: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
  products: Product[];
};

type Product = {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  imageUrl?: string | null;
  isAvailable?: boolean;
};

export const MenuManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [newProductCategoryId, setNewProductCategoryId] = useState<string>("");
  const [newProductDescription, setNewProductDescription] = useState("");
  const [newProductImageUrl, setNewProductImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const categories = useMemo(() => menu, [menu]);

  const loadMenu = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await menuApi.getMenu();
      setMenu(data || []);
      if (!newProductCategoryId && (data || []).length > 0) {
        setNewProductCategoryId((data || [])[0].id);
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || "Không thể tải menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;
    setError(null);
    try {
      await menuManagementApi.createCategory({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || undefined,
        isActive: true,
      });
      setNewCategoryName("");
      setNewCategoryDescription("");
      await loadMenu();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Tạo danh mục thất bại");
    }
  };

  const handleToggleCategory = async (category: Category) => {
    setError(null);
    try {
      await menuManagementApi.updateCategory(category.id, { isActive: !(category.isActive ?? true) });
      await loadMenu();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Cập nhật danh mục thất bại");
    }
  };

  const handleUploadImage = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const { url } = await menuManagementApi.uploadPhoto(file);
      setNewProductImageUrl(url);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Upload ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!newProductName.trim()) return;
    if (!newProductCategoryId) return;
    const price = Number(newProductPrice);
    if (Number.isNaN(price) || price < 0) {
      setError("Giá không hợp lệ");
      return;
    }
    setError(null);
    try {
      await menuManagementApi.createProduct({
        name: newProductName.trim(),
        price,
        categoryId: newProductCategoryId,
        description: newProductDescription.trim() || undefined,
        imageUrl: newProductImageUrl.trim() || undefined,
        isAvailable: true,
      });
      setNewProductName("");
      setNewProductPrice("");
      setNewProductDescription("");
      setNewProductImageUrl("");
      await loadMenu();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Tạo món thất bại");
    }
  };

  const handleToggleProduct = async (productId: string, currentIsAvailable: boolean | undefined) => {
    setError(null);
    try {
      await menuManagementApi.updateProduct(productId, { isAvailable: !(currentIsAvailable ?? true) });
      await loadMenu();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Cập nhật món thất bại");
    }
  };

  return (
    <div className="linear-surface rounded-2xl border border-white/[0.05] p-6">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-black">Quản lý thực đơn</h3>
          <p className="text-xs font-bold text-brand-gray uppercase tracking-widest">Tạo danh mục, tạo món, bật/tắt bán</p>
        </div>
        <button onClick={loadMenu} className="btn-primary text-xs">
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-sm text-brand-gray font-semibold">Đang tải menu...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-black/20 border border-white/[0.06] rounded-2xl p-5">
            <div className="text-[10px] font-black uppercase tracking-widest text-brand-gray mb-4">Tạo danh mục</div>
            <div className="grid grid-cols-1 gap-3">
              <input
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Tên danh mục"
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/[0.06] text-sm font-semibold outline-none focus:border-white/[0.15]"
              />
              <input
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Mô tả (tuỳ chọn)"
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/[0.06] text-sm font-semibold outline-none focus:border-white/[0.15]"
              />
              <button onClick={handleCreateCategory} className="btn-primary text-xs">
                Tạo danh mục
              </button>
            </div>

            <div className="mt-8">
              <div className="text-[10px] font-black uppercase tracking-widest text-brand-gray mb-3">Danh mục</div>
              <div className="space-y-2">
                {categories.map((c) => (
                  <div
                    key={c.id}
                    className={cn(
                      "flex items-center justify-between gap-3 px-4 py-3 rounded-xl border",
                      c.isActive === false ? "bg-white/[0.02] border-white/[0.04]" : "bg-white/[0.03] border-white/[0.06]",
                    )}
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-black truncate">{c.name}</div>
                      {c.description ? <div className="text-xs text-brand-gray truncate">{c.description}</div> : null}
                    </div>
                    <button
                      onClick={() => handleToggleCategory(c)}
                      className={cn(
                        "text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl border transition-all",
                        c.isActive === false
                          ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                          : "border-slate-500/20 text-brand-gray bg-white/[0.02] hover:bg-white/[0.05] hover:text-white",
                      )}
                    >
                      {c.isActive === false ? "Bật" : "Tắt"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-black/20 border border-white/[0.06] rounded-2xl p-5">
            <div className="text-[10px] font-black uppercase tracking-widest text-brand-gray mb-4">Tạo món</div>
            <div className="grid grid-cols-1 gap-3">
              <select
                value={newProductCategoryId}
                onChange={(e) => setNewProductCategoryId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/[0.06] text-sm font-semibold outline-none focus:border-white/[0.15]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                placeholder="Tên món"
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/[0.06] text-sm font-semibold outline-none focus:border-white/[0.15]"
              />
              <input
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(e.target.value)}
                placeholder="Giá (VND)"
                inputMode="numeric"
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/[0.06] text-sm font-semibold outline-none focus:border-white/[0.15]"
              />
              <input
                value={newProductDescription}
                onChange={(e) => setNewProductDescription(e.target.value)}
                placeholder="Mô tả (tuỳ chọn)"
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/[0.06] text-sm font-semibold outline-none focus:border-white/[0.15]"
              />

              <div className="flex items-center gap-3">
                <input
                  value={newProductImageUrl}
                  onChange={(e) => setNewProductImageUrl(e.target.value)}
                  placeholder="Image URL (hoặc upload)"
                  className="flex-1 px-4 py-3 rounded-xl bg-black/30 border border-white/[0.06] text-sm font-semibold outline-none focus:border-white/[0.15]"
                />
                <label className={cn("px-4 py-3 rounded-xl border text-xs font-black uppercase tracking-widest cursor-pointer", uploading ? "opacity-60 cursor-not-allowed" : "hover:bg-white/[0.05]", "border-white/[0.06] bg-white/[0.02]")}>
                  {uploading ? "Đang up..." : "Upload"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      void handleUploadImage(file);
                    }}
                  />
                </label>
              </div>

              <button onClick={handleCreateProduct} className="btn-primary text-xs">
                Tạo món
              </button>
            </div>

            <div className="mt-8">
              <div className="text-[10px] font-black uppercase tracking-widest text-brand-gray mb-3">Món</div>
              <div className="space-y-2 max-h-[420px] overflow-auto pr-1">
                {categories.flatMap((c) =>
                  (c.products || []).map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.03]">
                      <div className="min-w-0">
                        <div className="text-sm font-black truncate">{p.name}</div>
                        <div className="text-xs text-brand-gray truncate">
                          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p.price)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleProduct(p.id, p.isAvailable)}
                        className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl border transition-all",
                          p.isAvailable === false
                            ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20"
                            : "border-slate-500/20 text-brand-gray bg-white/[0.02] hover:bg-white/[0.05] hover:text-white",
                        )}
                      >
                        {p.isAvailable === false ? "Bật" : "Hết"}
                      </button>
                    </div>
                  )),
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

