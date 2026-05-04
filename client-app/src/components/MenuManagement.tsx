import React, { useEffect, useMemo, useState } from "react";
import { menuApi } from "../api/menuApi";
import { menuManagementApi } from "../api/menuManagementApi";
import { cn } from "../lib/utils";
import { Modal } from "./Modal";
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Package, 
  Layers, 
  ChevronRight,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

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
  const [success, setSuccess] = useState<string | null>(null);

  // Selection states
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [categoryModal, setCategoryModal] = useState<{ open: boolean; editId?: string }>({ open: false });
  const [productModal, setProductModal] = useState<{ open: boolean; editId?: string }>({ open: false });

  // Form states
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "", isActive: true });
  const [productForm, setProductForm] = useState({ 
    name: "", 
    price: "", 
    categoryId: "", 
    description: "", 
    imageUrl: "",
    isAvailable: true 
  });
  const [uploading, setUploading] = useState(false);

  // Derived data
  const categories = useMemo(() => menu, [menu]);
  const selectedCategory = useMemo(() => 
    categories.find((c) => c.id === selectedCategoryId) || categories[0] || null, 
  [categories, selectedCategoryId]);

  const filteredProducts = useMemo(() => {
    const products = selectedCategory?.products ?? [];
    if (!searchQuery.trim()) return products;
    return products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [selectedCategory, searchQuery]);

  const loadMenu = async () => {
    setLoading(true);
    try {
      const data = await menuApi.getMenu();
      setMenu(data || []);
      if (data && data.length > 0 && !selectedCategoryId) {
        setSelectedCategoryId(data[0].id);
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || "Could not load menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  // Category Actions
  const handleOpenCategoryModal = (editCategory?: Category) => {
    if (editCategory) {
      setCategoryForm({
        name: editCategory.name,
        description: editCategory.description || "",
        isActive: editCategory.isActive ?? true
      });
      setCategoryModal({ open: true, editId: editCategory.id });
    } else {
      setCategoryForm({ name: "", description: "", isActive: true });
      setCategoryModal({ open: true });
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name.trim()) return;
    setLoading(true);
    try {
      if (categoryModal.editId) {
        await menuManagementApi.updateCategory(categoryModal.editId, categoryForm);
        showSuccess("Updated category successfully");
      } else {
        await menuManagementApi.createCategory(categoryForm);
        showSuccess("Created category successfully");
      }
      setCategoryModal({ open: false });
      await loadMenu();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to save category");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category? All products inside will be hidden.")) return;
    try {
      await menuManagementApi.deleteCategory(id);
      showSuccess("Category deleted");
      await loadMenu();
    } catch (e: any) {
      setError("Failed to delete category");
    }
  };

  const handleToggleCategory = async (cat: Category) => {
    try {
      await menuManagementApi.updateCategory(cat.id, { isActive: !cat.isActive });
      await loadMenu();
    } catch (e) {
      setError("Failed to toggle status");
    }
  };

  // Product Actions
  const handleOpenProductModal = (editProduct?: Product) => {
    if (editProduct) {
      setProductForm({
        name: editProduct.name,
        price: String(editProduct.price),
        categoryId: selectedCategoryId,
        description: editProduct.description || "",
        imageUrl: editProduct.imageUrl || "",
        isAvailable: editProduct.isAvailable ?? true
      });
      setProductModal({ open: true, editId: editProduct.id });
    } else {
      setProductForm({
        name: "",
        price: "",
        categoryId: selectedCategoryId,
        description: "",
        imageUrl: "",
        isAvailable: true
      });
      setProductModal({ open: true });
    }
  };

  const handleSaveProduct = async () => {
    if (!productForm.name.trim() || !productForm.price) return;
    setLoading(true);
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        categoryId: selectedCategoryId
      };
      if (productModal.editId) {
        await menuManagementApi.updateProduct(productModal.editId, payload);
        showSuccess("Updated product successfully");
      } else {
        await menuManagementApi.createProduct(payload);
        showSuccess("Created product successfully");
      }
      setProductModal({ open: false });
      await loadMenu();
    } catch (e: any) {
      setError(e?.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await menuManagementApi.deleteProduct(id);
      showSuccess("Product deleted");
      await loadMenu();
    } catch (e) {
      setError("Failed to delete product");
    }
  };

  const handleUploadImage = async (file: File) => {
    setUploading(true);
    try {
      const { url } = await menuManagementApi.uploadPhoto(file);
      setProductForm(prev => ({ ...prev, imageUrl: url }));
    } catch (e) {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Alert Messages */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-semibold">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto text-xs uppercase font-black opacity-60 hover:opacity-100">Dismiss</button>
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-semibold">{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
        
        {/* Left: Category Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-brand-gray">Categories</h3>
            <button 
              onClick={() => handleOpenCategoryModal()}
              className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-brand-purple transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="linear-surface p-2 flex flex-col gap-1 max-h-[600px] overflow-y-auto">
            {categories.length === 0 && !loading && (
              <div className="p-8 text-center text-xs font-bold text-brand-gray italic">No categories</div>
            )}
            {categories.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={cn(
                  "group flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all",
                  selectedCategoryId === cat.id 
                    ? "bg-brand-purple/10 text-white" 
                    : "text-brand-gray hover:bg-white/[0.03] hover:text-white"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    cat.isActive ? "bg-emerald-500" : "bg-brand-gray/30"
                  )} />
                  <span className="text-sm font-bold truncate">{cat.name}</span>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={(e) => { e.stopPropagation(); handleOpenCategoryModal(cat); }} className="p-1.5 hover:bg-white/[0.1] rounded-lg text-brand-gray hover:text-white">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id); }} className="p-1.5 hover:bg-rose-500/20 rounded-lg text-brand-gray hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {loading && <div className="p-4 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-brand-purple" /></div>}
          </div>
        </div>

        {/* Right: Products Area */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
            <div>
              <h2 className="text-xl font-black text-white">{selectedCategory?.name || "Products"}</h2>
              <p className="text-[10px] font-bold text-brand-gray uppercase tracking-widest mt-1">
                {selectedCategory?.products?.length || 0} items in this category
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" />
                <input 
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs font-semibold focus:border-brand-purple/50 outline-none w-48 transition-all focus:w-64"
                />
              </div>
              <button 
                onClick={() => handleOpenProductModal()}
                disabled={!selectedCategory}
                className="btn-primary py-2 px-4 text-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredProducts.length === 0 && !loading && (
              <div className="col-span-full linear-surface p-12 flex flex-col items-center justify-center text-center opacity-50">
                <Package className="w-12 h-12 mb-4 text-brand-gray" />
                <p className="font-bold text-sm">No products found</p>
                <p className="text-xs mt-1">Add your first product to this category to get started.</p>
              </div>
            )}
            
            {filteredProducts.map((p) => (
              <div key={p.id} className="linear-card p-4 group">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl bg-white/[0.03] border border-white/[0.08] flex-shrink-0 overflow-hidden relative group-hover:border-brand-purple/30 transition-all">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-brand-gray/20" />
                      </div>
                    )}
                    {!p.isAvailable && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                        <span className="text-[8px] font-black uppercase text-white bg-rose-500 px-1.5 py-0.5 rounded shadow-lg">Inactive</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate text-white">{p.name}</h4>
                    <p className="text-brand-purple text-xs font-black mt-1">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p.price)}
                    </p>
                    <p className="text-[10px] text-brand-gray line-clamp-2 mt-2 font-medium leading-relaxed">
                      {p.description || "No description provided."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={() => handleOpenProductModal(p)}
                    className="p-2 hover:bg-white/[0.05] rounded-lg text-brand-gray hover:text-white transition-all"
                   >
                     <Edit3 className="w-4 h-4" />
                   </button>
                   <button 
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-2 hover:bg-rose-500/10 rounded-lg text-brand-gray hover:text-rose-400 transition-all"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Modal */}
      <Modal 
        isOpen={categoryModal.open} 
        onClose={() => setCategoryModal({ open: false })}
        title={categoryModal.editId ? "Edit Category" : "New Category"}
      >
        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-brand-gray px-1">Name</label>
            <input 
              type="text"
              value={categoryForm.name}
              onChange={e => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Appetizers"
              className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-brand-purple/50 focus:bg-white/[0.04] transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-brand-gray px-1">Description</label>
            <textarea 
              value={categoryForm.description}
              onChange={e => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Tell us more about this category..."
              rows={3}
              className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-brand-purple/50 focus:bg-white/[0.04] transition-all resize-none"
            />
          </div>
          <div className="flex items-center justify-between p-1">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Active Status</span>
              <span className="text-[10px] text-brand-gray font-bold">Show this category on the menu</span>
            </div>
            <button 
              onClick={() => setCategoryForm(prev => ({ ...prev, isActive: !prev.isActive }))}
              className={cn(
                "w-12 h-6 rounded-full relative transition-all duration-300",
                categoryForm.isActive ? "bg-emerald-500" : "bg-white/[0.1]"
              )}
            >
              <div className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300",
                categoryForm.isActive ? "left-7" : "left-1"
              )} />
            </button>
          </div>
          <div className="flex gap-3 mt-4">
            <button 
              onClick={() => setCategoryModal({ open: false })}
              className="flex-1 btn-secondary"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveCategory}
              disabled={loading || !categoryForm.name.trim()}
              className="flex-[2] btn-primary flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : categoryModal.editId ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Product Modal */}
      <Modal 
        isOpen={productModal.open} 
        onClose={() => setProductModal({ open: false })}
        title={productModal.editId ? "Edit Product" : "New Product"}
        className="max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-brand-gray px-1">Product Image</label>
              <div className="aspect-square rounded-2xl bg-white/[0.02] border border-white/[0.08] border-dashed flex flex-col items-center justify-center relative overflow-hidden group hover:border-brand-purple/50 transition-all">
                {productForm.imageUrl ? (
                  <>
                    <img src={productForm.imageUrl} className="w-full h-full object-cover" alt="" />
                    <button 
                      onClick={() => setProductForm(prev => ({ ...prev, imageUrl: "" }))}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center gap-2 cursor-pointer p-8 text-center">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 animate-spin text-brand-purple" />
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-brand-gray/30" />
                        <span className="text-[10px] font-black uppercase text-brand-gray">Upload Photo</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      disabled={uploading}
                      onChange={e => e.target.files?.[0] && handleUploadImage(e.target.files[0])} 
                    />
                  </label>
                )}
              </div>
              <input 
                type="text"
                value={productForm.imageUrl}
                onChange={e => setProductForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="Or paste image URL"
                className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-3 py-2 text-[10px] font-bold outline-none focus:border-brand-purple/50"
              />
            </div>
          </div>

          <div className="flex flex-col gap-5">
             <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-gray px-1">Name</label>
                <input 
                  type="text"
                  value={productForm.name}
                  onChange={e => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Wagyu Beef Steak"
                  className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-brand-purple/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-gray px-1">Price (VND)</label>
                <input 
                  type="number"
                  value={productForm.price}
                  onChange={e => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="e.g. 250000"
                  className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-brand-purple/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-brand-gray px-1">Description</label>
                <textarea 
                  value={productForm.description}
                  onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What's special about this dish?"
                  rows={3}
                  className="w-full bg-white/[0.02] border border-white/[0.08] rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-brand-purple/50 resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-1">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white">Available</span>
                  <span className="text-[10px] text-brand-gray font-bold">Can customers order this?</span>
                </div>
                <button 
                  onClick={() => setProductForm(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-all duration-300",
                    productForm.isAvailable ? "bg-emerald-500" : "bg-white/[0.1]"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300",
                    productForm.isAvailable ? "left-7" : "left-1"
                  )} />
                </button>
              </div>

              <div className="flex gap-3 mt-4">
                <button 
                  onClick={() => setProductModal({ open: false })}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveProduct}
                  disabled={loading || !productForm.name.trim() || !productForm.price}
                  className="flex-[2] btn-primary flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : productModal.editId ? "Update" : "Create"}
                </button>
              </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
