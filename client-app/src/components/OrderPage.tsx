import React, { useEffect, useState, useMemo } from "react";
import { MenuGrid } from "./MenuGrid";
import { OrderSidebar } from "./OrderSidebar";
import { orderApi } from "../api/orderApi";
import { paymentApi } from "../api/paymentApi";
import { OrderItemStatus } from "../models/order";
import { tableApi } from "../api/tableApi";
import type { TableDto } from "../models/table";
import { TransferTableModal } from "./TransferTableModal";
import { ConfirmModal } from "./ConfirmModal";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Modal } from "./Modal";
import { CreditCard, Banknote, Landmark, Loader2 } from "lucide-react";

interface OrderPageProps {
  tableId: string;
  tableName: string;
  orderId: string;
  onClose: () => void;
  onTransferred: (newTableId: string, newTableName: string) => void;
}

export const OrderPage: React.FC<OrderPageProps> = ({
  tableId,
  tableName,
  orderId,
  onClose,
  onTransferred,
}) => {
  const [pendingItems, setPendingItems] = useState<any[]>([]);
  const [placedItems, setPlacedItems] = useState<any[]>([]);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "card" | "transfer"
  >("cash");
  const [tables, setTables] = useState<TableDto[]>([]);

  useEffect(() => {
    loadOrder();
  }, [tableId]);

  const loadOrder = async () => {
    try {
      const order = await orderApi.getActiveOrder(tableId);
      setPlacedItems(order.items || []);
    } catch (err) {
      console.error("Could not load order", err);
    }
  };

  const { subtotal, tax, total } = useMemo(() => {
    let sum = 0;
    placedItems.forEach((item) => {
      if (item.status !== OrderItemStatus.Cancelled) {
        sum += item.quantity * item.unitPrice;
      }
    });

    pendingItems.forEach((item) => {
      sum += item.quantity * item.unitPrice;
    });

    const taxAmount = 0; // Configurable later
    const totalAmount = sum + taxAmount;

    return { subtotal: sum, tax: taxAmount, total: totalAmount };
  }, [placedItems, pendingItems]);

  const methodLabel: Record<typeof paymentMethod, string> = {
    cash: "Cash",
    card: "Card",
    transfer: "Transfer",
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      await paymentApi.createPayment({
        orderId,
        amount: total,
        method: methodLabel[paymentMethod],
      });
      toast.success("Thanh toán thành công", {
        description: "Đã ghi nhận thanh toán. Bàn đã chuyển về trạng thái Trống.",
      });
      setShowCheckoutModal(false);
      onClose(); // Đóng order page và quay lại Dashboard
    } catch (err: any) {
      toast.error("Lỗi thanh toán", {
        description: err.response?.data?.message || err.message,
      });
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleSelectItem = (product: any) => {
    setPendingItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: product.price,
        },
      ];
    });
  };

  const handleRemoveItem = (productId: string) => {
    setPendingItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setPendingItems((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const handleResetTable = async () => {
    try {
      await tableApi.reset(tableId);
      toast.success("Đã đóng bàn thành công");
      setShowResetConfirm(false);
      onClose();
    } catch (err: any) {
      setShowResetConfirm(false);
      toast.error("Không thể đóng bàn", {
        description: err.response?.data?.message || err.message,
      });
    }
  };

  const handleConfirmOrder = async () => {
    try {
      for (const item of pendingItems) {
        await orderApi.addItem(orderId, {
          productId: item.productId,
          quantity: item.quantity,
          idempotencyKey: `${orderId}-${item.productId}-${Date.now()}`,
        });
      }
      setPendingItems([]);
      loadOrder();
      toast.success("Đã gửi order xuống bếp!");
    } catch (err) {
      toast.error("Lỗi gửi order", {
        description: "Vui lòng kiểm tra kết nối và thử lại.",
      });
    }
  };

  const handleApproveItem = async (productId: string) => {
    try {
      await orderApi.approveItem(orderId, productId);
      toast.success("Đã duyệt món");
      loadOrder();
    } catch (err) {
      toast.error("Không thể duyệt món này.");
    }
  };

  const loadTables = async () => {
    try {
      const data = await tableApi.getAll();
      setTables(data || []);
    } catch (err) {
      console.error("Could not load table list", err);
    }
  };

  const handleTransfer = async (toTableId: string) => {
    const result = await tableApi.transfer(tableId, toTableId);
    onTransferred(result.toTableId, result.toTableName);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] modal-backdrop flex flex-col md:flex-row p-0 sm:p-0"
    >
      {/* Main Menu Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-10 relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h2 className="text-4xl font-black text-white mb-1">
                {tableName}
              </h2>
              <p className="text-brand-gray font-bold uppercase tracking-wider text-xs">
                ZOS dining menu
              </p>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="linear-surface px-4 py-3 border border-white/[0.08] bg-black/40 backdrop-blur-xl">
                  <div className="text-[10px] font-black uppercase tracking-widest text-brand-gray mb-1">
                    Tạm tính
                  </div>
                  <div className="text-lg font-black text-white">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(subtotal)}
                  </div>
                </div>
                <div className="linear-surface px-4 py-3 border border-white/[0.08] bg-black/40 backdrop-blur-xl">
                  <div className="text-[10px] font-black uppercase tracking-widest text-brand-gray mb-1">
                    Thuế / Phí (0%)
                  </div>
                  <div className="text-lg font-black text-brand-gray">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(tax)}
                  </div>
                </div>
                <div className="linear-surface px-4 py-3 border border-white/[0.08] bg-black/40 backdrop-blur-xl">
                  <div className="text-[10px] font-black uppercase tracking-widest text-brand-purple mb-1">
                    Tổng cộng
                  </div>
                  <div className="text-xl font-black text-brand-emerald">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(total)}
                  </div>
                </div>
                <button
                  onClick={() => setShowCheckoutModal(true)}
                  disabled={total === 0 || pendingItems.length > 0}
                  className="btn-primary w-full h-full flex flex-col items-center justify-center py-2"
                  title={
                    pendingItems.length > 0
                      ? "Vui lòng xác nhận gọi món trước khi thanh toán"
                      : "Thanh toán"
                  }
                >
                  <span className="text-sm font-black uppercase tracking-widest">
                    Thanh toán
                  </span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {placedItems.length === 0 && pendingItems.length === 0 && (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-5 py-2.5 rounded-lg bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/20 text-rose-500 font-bold transition-all active:scale-95"
                >
                  Hủy Bàn
                </button>
              )}
              <button
                onClick={() => {
                  void loadTables();
                  setShowTransferModal(true);
                }}
                className="btn-secondary"
              >
                Change Table
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-white font-bold transition-all active:scale-95"
              >
                Back
              </button>
            </div>
          </div>

          {/* Placed Order Items Section */}
          {placedItems.length > 0 && (
            <div className="linear-card p-6 border-white/[0.1]">
              <h3 className="text-sm font-black text-white mb-5 uppercase tracking-widest">
                Ordered Items
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {placedItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white/[0.02] hover:bg-white/[0.05] transition-colors p-4 rounded-xl border border-white/[0.05] flex justify-between items-center"
                  >
                    <div>
                      <div className="font-bold text-white mb-1">
                        {item.productName}
                      </div>
                      <div className="text-xs font-semibold text-brand-gray">
                        {item.quantity} x{" "}
                        {new Intl.NumberFormat("vi-VN").format(item.unitPrice)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.status === OrderItemStatus.NeedsApproval && (
                        <button
                          onClick={() => handleApproveItem(item.productId)}
                          className="bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black px-3 py-1.5 rounded-lg transition-all shadow-[0_0_15px_-3px_rgba(245,158,11,0.4)] active:scale-95"
                        >
                          APPROVE
                        </button>
                      )}
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-md border ${
                          item.status === OrderItemStatus.NeedsApproval
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                            : item.status === OrderItemStatus.Cancelled
                              ? "bg-white/[0.05] text-brand-gray border-white/[0.1]"
                              : "bg-brand-emerald/10 text-brand-emerald border-brand-emerald/20"
                        }`}
                      >
                        {item.status === OrderItemStatus.NeedsApproval
                          ? "PENDING"
                          : item.status === OrderItemStatus.Cancelled
                            ? "CANCELLED"
                            : "ACCEPTED"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <MenuGrid onSelectItem={handleSelectItem} />
        </div>
      </div>

      {/* Order Sidebar */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full md:w-96 shrink-0 relative z-20"
      >
        <OrderSidebar
          items={pendingItems}
          onConfirm={handleConfirmOrder}
          onRemove={handleRemoveItem}
          onClearAll={() => setPendingItems([])}
          onUpdateQuantity={handleUpdateQuantity}
        />
      </motion.div>

      {showTransferModal && (
        <TransferTableModal
          fromTableId={tableId}
          tables={tables}
          onClose={() => setShowTransferModal(false)}
          onConfirm={handleTransfer}
        />
      )}

      <ConfirmModal
        open={showResetConfirm}
        tone="danger"
        title="Đóng bàn này?"
        description="Bàn chưa có món nào. Xác nhận đóng bàn và giải phóng về trạng thái Trống."
        confirmLabel="Đóng bàn"
        onCancel={() => setShowResetConfirm(false)}
        onConfirm={handleResetTable}
      />

      {/* Checkout Modal */}
      <Modal
        isOpen={showCheckoutModal}
        onClose={() => !checkoutLoading && setShowCheckoutModal(false)}
        title="Thanh toán Đơn hàng"
        className="max-w-md"
      >
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-black text-white uppercase tracking-widest">
              Phương thức thanh toán
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                  paymentMethod === "cash"
                    ? "bg-brand-emerald/10 border-brand-emerald/50 text-brand-emerald"
                    : "bg-white/[0.02] border-white/[0.05] text-brand-gray hover:bg-white/[0.05]"
                }`}
              >
                <Banknote className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase">
                  Tiền mặt
                </span>
              </button>
              <button
                onClick={() => setPaymentMethod("transfer")}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                  paymentMethod === "transfer"
                    ? "bg-brand-purple/10 border-brand-purple/50 text-brand-purple"
                    : "bg-white/[0.02] border-white/[0.05] text-brand-gray hover:bg-white/[0.05]"
                }`}
              >
                <Landmark className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase">
                  Chuyển khoản
                </span>
              </button>
              <button
                onClick={() => setPaymentMethod("card")}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                  paymentMethod === "card"
                    ? "bg-amber-500/10 border-amber-500/50 text-amber-500"
                    : "bg-white/[0.02] border-white/[0.05] text-brand-gray hover:bg-white/[0.05]"
                }`}
              >
                <CreditCard className="w-6 h-6" />
                <span className="text-[10px] font-black uppercase">
                  Thẻ (POS)
                </span>
              </button>
            </div>
          </div>

          <div className="linear-surface p-4 border border-white/[0.05]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-brand-gray">
                Tạm tính
              </span>
              <span className="text-sm font-bold text-white">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(subtotal)}
              </span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-brand-gray">
                Thuế / Phí
              </span>
              <span className="text-sm font-bold text-white">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(tax)}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-white/[0.05] pt-4">
              <span className="text-sm font-black uppercase tracking-widest text-brand-purple">
                Tổng thanh toán
              </span>
              <span className="text-2xl font-black text-brand-emerald">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(total)}
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest"
          >
            {checkoutLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Xác nhận Thanh toán"
            )}
          </button>
        </div>
      </Modal>
    </motion.div>
  );
};
