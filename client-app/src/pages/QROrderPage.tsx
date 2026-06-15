import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MenuGrid } from "../components/MenuGrid";
import { orderApi } from "../api/orderApi";
import { useSignalR } from "../hooks/useSignalR";
import { OrderItemStatus } from "../models/order";
import { PaymentButton } from "../components/ui";

export const QROrderPage: React.FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [cart, setCart] = useState<
    { productId: string; name: string; quantity: number; price: number }[]
  >([]);
  const [placedItems, setPlacedItems] = useState<any[]>([]);
  const [acceptedAmount, setAcceptedAmount] = useState<number>(0);
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
        setAcceptedAmount(order.acceptedAmount ?? 0);
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

    connection.on("OrderUpdated", (id: string) => {
      if (id === orderId || !orderId) {
        loadActiveOrder();
      }
    });

    connection.on("TableStatusUpdated", (id: string, status: number) => {
      if (id === tableId && status === 0) {
        // Available
        window.location.reload();
      }
    });
  });

  const handleAddToOrder = (product: { id: string; name: string; price: number }) => {
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

  const handlePaymentSuccess = () => {
    setMessage({
      text: "Thanh toán thành công! Cảm ơn quý khách.",
      type: "success",
    });
    // Refresh order or redirect
    loadActiveOrder();
  };

  return (
    <div className="pb-32 max-w-lg mx-auto">
        {message && (
          <div
            className={`p-4 rounded-2xl mb-4 text-sm font-bold animate-slideIn ${message.type === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
          >
            {message.text}
          </div>
        )}

        {/* Món đã gọi (Dành cho khách xem) */}
        {placedItems.length > 0 && (
          <div className="mb-8 linear-card p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-black text-brand-gray uppercase tracking-widest">
                MÓN ĐÃ GỌI
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-white font-bold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(acceptedAmount)}
                </span>
                <PaymentButton 
                  totalAmount={acceptedAmount} 
                  onPaymentSuccess={handlePaymentSuccess} 
                  className="scale-90 origin-right"
                />
              </div>
            </div>
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
                      item.status === OrderItemStatus.NeedsApproval
                        ? "bg-orange-500/10 text-orange-500"
                        : item.status === OrderItemStatus.Cancelled
                          ? "bg-slate-700 text-slate-400"
                          : "bg-emerald-500/10 text-emerald-500"
                    }`}
                  >
                    {item.status === OrderItemStatus.NeedsApproval
                      ? "ĐANG CHỜ DUYỆT"
                      : item.status === OrderItemStatus.Cancelled
                        ? "ĐÃ HỦY"
                        : "ĐÃ NHẬN"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}


        <MenuGrid onSelectItem={handleAddToOrder} />

      {/* Cart Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-4 right-4 z-50">
          <button
            onClick={handleSubmitOrder}
            disabled={isOrdering}
            className="w-full btn-primary p-6 rounded-3xl flex justify-between items-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex flex-col items-start">
              <span className="text-xs font-bold opacity-80">
                ĐÃ CHỌN {cart.length} MÓN
              </span>
              <span className="text-lg font-black text-white">
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
