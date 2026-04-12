import React, { useState } from "react";
import { CreateShopDto } from "../models/shop";
import { shopApi } from "../api/shopApi";

interface ShopFormProps {
  onSuccess: () => void;
}

const ShopForm: React.FC<ShopFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<CreateShopDto>({
    name: "",
    address: "",
    phoneNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await shopApi.create(formData);
      // Xóa form sau khi tạo thành công
      setFormData({ name: "", address: "", phoneNumber: "" });
      // Gọi hàm callback để báo cho App.tsx biết cần làm mới danh sách
      onSuccess();
    } catch (err) {
      console.error("Lỗi khi tạo quán:", err);
      setError("Không thể tạo quán mới. Vui lòng kiểm tra lại kết nối.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-md mb-12">
      <h3 className="text-2xl font-bold mb-6 text-orange-500 border-b border-gray-700 pb-2">
        Đăng ký Quán mới
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Tên quán nhậu
          </label>
          <input
            required
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
            placeholder="VD: Quán Nhậu A King"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Địa chỉ
          </label>
          <input
            required
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
            placeholder="VD: 153 Bùi Xuân Phái"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">
            Số điện thoại
          </label>
          <input
            required
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-orange-500 transition-colors"
            placeholder="VD: 0983139876"
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
            isSubmitting
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-900/20"
          }`}
        >
          {isSubmitting ? "Đang xử lý..." : "Tạo Quán Ngay"}
        </button>
      </form>
    </div>
  );
};

export default ShopForm;
