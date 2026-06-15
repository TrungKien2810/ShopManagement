// @ts-ignore
import axios from "axios";

// Khởi tạo một instance của Axios với các cấu hình mặc định
const apiClient = axios.create({
  baseURL: "http://localhost:5090/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: any) => {
  const userStr = localStorage.getItem("zoos_user");
  const shopStr = localStorage.getItem("zoos_shop");

  if (userStr) {
    const user = JSON.parse(userStr);
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  if (shopStr) {
    const shop = JSON.parse(shopStr);
    config.headers["ShopId"] = shop.id;
  }

  const branchStr = localStorage.getItem("zoos_branch");
  if (branchStr) {
    const branch = JSON.parse(branchStr);
    config.headers["BranchId"] = branch.id;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response && error.response.status === 401) {
      console.warn(
        "Token expired or unauthorized. Clearing storage and redirecting to login...",
      );
      localStorage.removeItem("zoos_user");
      localStorage.removeItem("zoos_shop");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default apiClient;
