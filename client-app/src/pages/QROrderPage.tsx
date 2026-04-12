import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MenuGrid } from "../components/MenuGrid";
import { orderApi } from "../api/orderApi";
import { useSignalR } from "../hooks/useSignalR";

export const QROrderPage: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [cart, setCart] = useState<
    { productId: string; name: string; quantity: number; price: number }[]
  >([]);
  const [placedItems, setPlacedItems] = useState<any[]>([]);
  const [isOrdering, setIsOrdering] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Initialize table session
  useEffect(() => {
    loadActiveOrder();
  }, [tableId]);

  const loadActiveOrder = async () => {
    if (tableId) {
      try {
        const order = await orderApi.getActiveOrder(tableId);
        setOrderId(order.id);
        setPlacedItems(order.items || []);
      } catch (err) {
        setMessage({
          text: "Bàn chưa được mở. Vui lòng báo nhân viên!",
          type: "error",
        });
      }
    }
  };

  useSignalR("http://localhost:5090/hubs/shop", (connection) => {
    if (tableId) {
      connection.invoke("JoinTableGroup", tableId);
    }

    connection.on("OrderUpdated", (id) => {
      if (id === orderId || !orderId) {
        loadActiveOrder();
      }
    });

    connection.on("TableStatusUpdated", (id, status) => {
      if (id === tableId && status === 0) {
        // Available
        window.location.reload();
      }
    });
  });

  const handleAddToOrder = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          quantity: 1,
          price: product.price,
        },
      ];
    });
  };

  const handleSubmitOrder = async () => {
    if (!orderId || cart.length === 0) return;
    setIsOrdering(true);
    try {
      for (const item of cart) {
        await orderApi.addItem(orderId, {
          productId: item.productId,
          quantity: item.quantity,
          idempotencyKey: `${orderId}-${item.productId}-${Date.now()}`,
        });
      }
      setCart([]);
      loadActiveOrder();
      setMessage({
        text: "Đã gửi yêu cầu gọi món thành công!",
        type: "success",
      });
    } catch (err) {
      setMessage({
        text: "Có lỗi khi gọi món. Vui lòng thử lại!",
        type: "error",
      });
    } finally {
      setIsOrdering(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200">
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4">
        <h1 className="text-xl font-black text-center text-emerald-500 uppercase tracking-widest">
          ZôOS QR ORDER
        </h1>
      </header>

      <main className="p-4 pb-32 max-w-lg mx-auto">
        {message && (
          <div
            className={`p-4 rounded-2xl mb-4 text-sm font-bold animate-slideIn ${message.type === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
          >
            {message.text}
          </div>
        )}

        {/* Món đã gọi (Dành cho khách xem) */}
        {placedItems.length > 0 && (
          <div className="mb-8 bg-slate-800/30 rounded-3xl p-6 border border-slate-700/50">
            <h3 className="text-xs font-black text-slate-500 mb-4 uppercase tracking-widest flex justify-between">
              <span>MÓN ĐÃ GỌI</span>
              <span className="text-emerald-500">
                TỔNG:{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(
                  placedItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
                )}
              </span>
            </h3>
            <div className="space-y-3">
              {placedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800/50"
                >
                  <div>
                    <div className="text-sm font-bold text-slate-300">
                      {item.productName}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {item.quantity} x{" "}
                      {new Intl.NumberFormat("vi-VN").format(item.unitPrice)}
                    </div>
                  </div>
                  <span
                    className={`text-[9px] font-black px-2 py-1 rounded-md ${
                      item.status === 0
                        ? "bg-emerald-500/10 text-emerald-500"
                        : item.status === 1
                          ? "bg-orange-500/10 text-orange-500"
                          : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {item.status === 0
                      ? "ĐÃ NHẬN"
                      : item.status === 1
                        ? "ĐANG CHỜ DUYỆT"
                        : "ĐÃ HỦY"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <MenuGrid onSelectItem={handleAddToOrder} />
      </main>

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-50">
          <button
            onClick={handleSubmitOrder}
            disabled={isOrdering}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-white p-6 rounded-3xl shadow-2xl shadow-emerald-900/40 flex justify-between items-center transition-all animate-bounceIn"
          >
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold opacity-80">
                ĐÃ CHỌN {cart.length} MÓN
              </span>
              <span className="text-lg font-black">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(cart.reduce((s, i) => s + i.price * i.quantity, 0))}
              </span>
            </div>
            <span className="font-black text-lg">
              {isOrdering ? "ĐANG GỬI..." : "GỌI MÓN NGAY 🚀"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
