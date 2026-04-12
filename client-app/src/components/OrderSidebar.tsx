import React from 'react';

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
}

export const OrderSidebar: React.FC<OrderSidebarProps> = ({ items, onConfirm, onRemove }) => {
  const total = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  return (
    <div className="bg-slate-900/80 border-l border-slate-800 w-full md:w-[400px] h-full flex flex-col backdrop-blur-3xl shadow-2xl">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-xl font-black text-slate-100 uppercase tracking-widest">Đơn hàng</h2>
        <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-md">{items.length} món</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 italic">
            <span className="text-4xl mb-4">🛒</span>
            Chưa có món nào được chọn
          </div>
        ) : (
          items.map(item => (
            <div key={item.productId} className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 flex justify-between items-center group">
              <div className="flex flex-col">
                <span className="font-bold text-slate-200 text-sm">{item.productName}</span>
                <span className="text-xs text-slate-500">{item.quantity} x {new Intl.NumberFormat('vi-VN').format(item.unitPrice)}</span>
              </div>
              <div className="flex items-center gap-3">
                 <span className="font-mono font-bold text-emerald-400">
                    {new Intl.NumberFormat('vi-VN').format(item.unitPrice * item.quantity)}
                 </span>
                 <button onClick={() => onRemove(item.productId)} className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-400 transition-all">✕</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 bg-slate-800/50 border-t border-slate-700 backdrop-blur-xl">
        <div className="flex justify-between items-end mb-6">
          <span className="text-slate-500 font-bold uppercase text-xs">Tổng cộng</span>
          <span className="text-3xl font-black text-emerald-400 tracking-tighter">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}
          </span>
        </div>
        <button 
          disabled={items.length === 0}
          onClick={onConfirm}
          className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-700 disabled:to-slate-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-900/20 transition-all active:scale-95 uppercase tracking-widest"
        >
          Xác nhận Gọi món
        </button>
      </div>
    </div>
  );
};
