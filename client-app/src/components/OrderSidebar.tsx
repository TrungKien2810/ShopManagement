import React, { useState } from 'react';
import { ShoppingCart, Minus, Plus, X } from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';

interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
}

interface OrderSidebarProps {
  items: OrderItem[];
  onConfirm: () => void;
  onRemove: (productId: string) => void;
  onClearAll?: () => void;
  onUpdateQuantity?: (productId: string, quantity: number) => void;
}

const formatVnd = (value: number) =>
  new Intl.NumberFormat('vi-VN').format(value);

export const OrderSidebar: React.FC<OrderSidebarProps> = ({ items, onConfirm, onRemove, onClearAll, onUpdateQuantity }) => {
  const total = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <div className="bg-slate-deep/80 border-l border-white/[0.06] w-full md:w-[400px] h-full flex flex-col backdrop-blur-2xl shadow-2xl">
      <div className="p-6 border-b border-white/[0.06] flex justify-between items-center">
        <h2 className="text-sm font-black text-white uppercase tracking-widest">Đơn hàng</h2>
        <div className="flex items-center gap-3">
          {items.length > 0 && onClearAll && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-[10px] font-black text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-widest"
            >
              Hủy Order
            </button>
          )}
          <span className="bg-brand-purple/15 text-brand-purple border border-brand-purple/20 text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
            {items.length} món
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <ShoppingCart className="w-12 h-12 text-[#6b5d52] mb-4" />
            <p className="text-sm font-semibold text-brand-gray">Chưa có món nào được chọn</p>
            <p className="text-xs text-brand-gray/60 mt-1">Chạm vào món trong thực đơn để thêm</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.productId} className="linear-card p-4 flex flex-col gap-3 group relative">
              <div className="flex justify-between items-start pr-6">
                <div className="flex flex-col">
                  <span className="font-bold text-white text-sm">{item.productName}</span>
                  <span className="text-xs text-brand-gray">{formatVnd(item.unitPrice)}đ</span>
                </div>
                <span className="font-mono font-bold text-brand-emerald">
                   {formatVnd(item.unitPrice * item.quantity)}đ
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateQuantity && onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                  aria-label="Giảm số lượng"
                  className="w-7 h-7 rounded-md bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-white transition-all active:scale-95"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={item.quantity}
                  aria-label={`Số lượng ${item.productName}`}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val > 0 && onUpdateQuantity) {
                      onUpdateQuantity(item.productId, val);
                    }
                  }}
                  className="w-12 h-7 bg-black/40 border border-white/[0.1] rounded-md text-center text-sm font-bold text-white outline-none focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  onClick={() => onUpdateQuantity && onUpdateQuantity(item.productId, item.quantity + 1)}
                  aria-label="Tăng số lượng"
                  className="w-7 h-7 rounded-md bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center text-white transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => onRemove(item.productId)}
                aria-label={`Xóa ${item.productName}`}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-brand-gray hover:text-rose-400 transition-all p-1"
                title="Xóa món"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="p-6 bg-black/30 border-t border-white/[0.06] backdrop-blur-xl">
        <div className="flex justify-between items-end mb-6">
          <span className="text-brand-gray font-black uppercase text-[10px] tracking-widest">Tổng cộng</span>
          <span className="text-3xl font-black text-brand-emerald tracking-tighter">
            {formatVnd(total)}đ
          </span>
        </div>
        <button
          disabled={items.length === 0}
          onClick={onConfirm}
          className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-sm uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <ShoppingCart className="w-4 h-4" />
          Xác nhận Gọi món
        </button>
      </div>

      <ConfirmModal
        open={showClearConfirm}
        tone="danger"
        title="Hủy toàn bộ order?"
        description="Tất cả các món chưa gọi sẽ bị xóa khỏi đơn hiện tại."
        confirmLabel="Xóa hết"
        onCancel={() => setShowClearConfirm(false)}
        onConfirm={() => {
          onClearAll?.();
          setShowClearConfirm(false);
        }}
      />
    </div>
  );
};
