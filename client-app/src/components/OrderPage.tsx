import React, { useEffect, useState } from 'react';
import { MenuGrid } from './MenuGrid';
import { OrderSidebar } from './OrderSidebar';
import { orderApi } from '../api/orderApi';

interface OrderPageProps {
  tableId: string;
  tableName: string;
  orderId: string;
  onClose: () => void;
}

export const OrderPage: React.FC<OrderPageProps> = ({ tableId, tableName, orderId, onClose }) => {
  const [pendingItems, setPendingItems] = useState<any[]>([]);
  const [placedItems, setPlacedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [tableId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const order = await orderApi.getActiveOrder(tableId);
      setPlacedItems(order.items || []);
    } catch (err) {
      console.error("Không thể tải đơn hàng", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (product: any) => {
    setPendingItems(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { productId: product.id, productName: product.name, quantity: 1, unitPrice: product.price }];
    });
  };

  const handleRemoveItem = (productId: string) => {
    setPendingItems(prev => prev.filter(i => i.productId !== productId));
  };

  const handleConfirmOrder = async () => {
    try {
      for (const item of pendingItems) {
        await orderApi.addItem(orderId, {
          productId: item.productId,
          quantity: item.quantity,
          idempotencyKey: `${orderId}-${item.productId}-${Date.now()}`
        });
      }
      setPendingItems([]);
      loadOrder();
      alert("Đã gửi đơn hàng đến nhà bếp!");
    } catch (err) {
      alert("Có lỗi khi gửi đơn hàng. Kiểm tra kết nối!");
    }
  };

  const handleApproveItem = async (productId: string) => {
    try {
      await orderApi.approveItem(orderId, productId);
      loadOrder();
    } catch (err) {
      alert("Không thể duyệt món.");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-[#0c1222] flex flex-col md:flex-row animate-fadeIn">
      {/* Main Menu Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-10">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
           <div className="flex justify-between items-center">
              <div>
                 <h2 className="text-4xl font-black text-slate-100 mb-1">{tableName}</h2>
                 <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Thực đơn ZôOS sành điệu</p>
              </div>
              <button 
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-700 text-slate-400 p-4 rounded-3xl border border-slate-700 transition-all font-black"
              >
                QUAY LẠI
              </button>
           </div>

           {/* Placed Order Items Section */}
           {placedItems.length > 0 && (
             <div className="bg-slate-800/20 rounded-3xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-black text-slate-300 mb-4 uppercase tracking-widest">Món Đã Gọi</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {placedItems.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                       <div>
                          <div className="font-bold text-slate-200">{item.productName}</div>
                          <div className="text-xs text-slate-500">{item.quantity} x {new Intl.NumberFormat('vi-VN').format(item.unitPrice)}</div>
                       </div>
                       <div className="flex items-center gap-3">
                          {item.status === 1 && ( // NeedsApproval
                            <button 
                              onClick={() => handleApproveItem(item.productId)}
                              className="bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg hover:bg-orange-400 transition-all shadow-lg shadow-orange-900/20"
                            >
                              DUYỆT
                            </button>
                          )}
                          <span className={`text-[10px] font-black px-2 py-1 rounded-md ${
                            item.status === 0 ? 'bg-emerald-500/10 text-emerald-500' : 
                            item.status === 1 ? 'bg-orange-500/10 text-orange-500 animate-pulse' : 
                            'bg-slate-700 text-slate-400'
                          }`}>
                            {item.status === 0 ? 'OK' : item.status === 1 ? 'CHỜ DUYỆT' : 'ĐÃ HỦY'}
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
      <OrderSidebar 
        items={pendingItems} 
        onConfirm={handleConfirmOrder} 
        onRemove={handleRemoveItem}
      />
    </div>
  );
};
