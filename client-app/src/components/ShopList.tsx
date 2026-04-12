import { useEffect, useState } from "react";
import { shopApi } from "../api/shopApi";
import type { ShopDto } from "../models/shop";

const ShopList = () => {
  const [shops, setShops] = useState<ShopDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true);
        const data = await shopApi.getAll();
        setShops(data);
      } catch (err) {
        setError("Không thể tải danh sách cửa hàng. Vui lòng thử lại!");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  if (loading)
    return <div className="p-4 text-center">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Danh sách Cửa hàng
      </h2>

      {shops.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          Chưa có cửa hàng nào. Hãy tạo một cửa hàng mới!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                {shop.name}
              </h3>
              <p className="text-gray-600 mb-1">
                <span className="font-medium text-gray-800">Địa chỉ:</span>{" "}
                {shop.address}
              </p>
              <p className="text-gray-600 mb-4">
                <span className="font-medium text-gray-800">SĐT:</span>{" "}
                {shop.phoneNumber}
              </p>

              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors shadow-sm"
                onClick={() => alert(`Sẽ xem bàn của quán: ${shop.name}`)}
              >
                Quản lý bàn
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopList;
