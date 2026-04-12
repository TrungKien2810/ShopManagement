import axios from "axios";

// Khởi tạo một instance của Axios với các cấu hình mặc định
const apiClient = axios.create({
  baseURL: "http://localhost:5090/api",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
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
  
  return config;
});

export default apiClient;
