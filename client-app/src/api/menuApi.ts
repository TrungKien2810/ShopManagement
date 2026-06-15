import apiClient from "./apiClient";

export type MenuProduct = {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  imageUrl?: string | null;
  isAvailable?: boolean;
  branchId?: string | null;
  categoryId: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  description?: string | null;
  isActive?: boolean;
  branchId?: string | null;
  products: MenuProduct[];
};

export const menuApi = {
  getMenu: async () => {
    const response = await apiClient.get<MenuCategory[]>("/menu");
    return response.data;
  },

  getCategories: async (branchId?: string) => {
    const response = await apiClient.get("/categories", {
      params: branchId ? { branchId } : {},
    });
    return response.data;
  },

  getMenuItems: async (branchId?: string) => {
    const response = await apiClient.get<MenuProduct[]>("/menuitems", {
      params: branchId ? { branchId } : {},
    });
    return response.data;
  },

  /** Build category tree with products for management UI */
  getMenuForScope: async (scope: "shared" | "branch", branchId?: string): Promise<MenuCategory[]> => {
    const isBranchScope = scope === "branch" && !!branchId;

    const [categoriesRaw, productsRaw] = await Promise.all([
      isBranchScope
        ? menuApi.getCategories(branchId)
        : menuApi.getCategories(),
      isBranchScope
        ? menuApi.getMenuItems(branchId)
        : menuApi.getMenuItems(),
    ]);

    const categories = (categoriesRaw as MenuCategory[]).filter((c) =>
      isBranchScope ? c.branchId != null : c.branchId == null,
    );
    const products = (productsRaw as MenuProduct[]).filter((p) =>
      isBranchScope ? p.branchId === branchId : p.branchId == null,
    );

    return categories.map((cat) => ({
      ...cat,
      products: products.filter((p) => p.categoryId === cat.id),
    }));
  },
};
