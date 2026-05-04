import React, { useEffect, useState } from 'react';
import { MenuGrid } from './MenuGrid';
import { OrderSidebar } from './OrderSidebar';
import { orderApi } from '../api/orderApi';
import { OrderItemStatus } from '../models/order';
import { tableApi } from '../api/tableApi';
import type { TableDto } from '../models/table';
import { TransferTableModal } from './TransferTableModal';

interface OrderPageProps {
  tableId: string;
  tableName: string;
  orderId: string;
  onClose: () => void;
  onTransferred: (newTableId: string, newTableName: string) => void;
}

export const OrderPage: React.FC<OrderPageProps> = ({ tableId, tableName, orderId, onClose, onTransferred }) => {
  const [pendingItems, setPendingItems] = useState<any[]>([]);
  const [placedItems, setPlacedItems] = useState<any[]>([]);
  const [acceptedAmount, setAcceptedAmount] = useState<number>(0);
  const [needsApprovalCount, setNeedsApprovalCount] = useState<number>(0);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [tables, setTables] = useState<TableDto[]>([]);

  useEffect(() => {
    loadOrder();
  }, [tableId]);

  const loadOrder = async () => {
    try {
      const order = await orderApi.getActiveOrder(tableId);
      setPlacedItems(order.items || []);
      setAcceptedAmount(order.acceptedAmount ?? 0);
      setNeedsApprovalCount(order.needsApprovalCount ?? 0);
    } catch (err) {
      console.error("Could not load order", err);
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
      alert("Order sent to kitchen!");
    } catch (err) {
      alert("Error sending order. Check your connection!");
    }
  };

  const handleApproveItem = async (productId: string) => {
    try {
      await orderApi.approveItem(orderId, productId);
      loadOrder();
    } catch (err) {
      alert("Could not approve item.");
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
    <div className="fixed inset-0 z-[500] bg-void flex flex-col md:flex-row animate-fadeIn overflow-hidden">
      {/* Main Menu Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-10">
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
           <div className="flex justify-between items-center">
              <div>
                 <h2 className="text-4xl font-black text-slate-100 mb-1">{tableName}</h2>
                 <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">ZOS dining menu</p>
                 <div className="mt-4 flex flex-wrap gap-3">
                   <div className="bg-slate-900/40 border border-slate-800 rounded-2xl px-4 py-3">
                     <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Temporary total (accepted)</div>
                     <div className="text-lg font-black text-emerald-400">
                       {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(acceptedAmount)}
                     </div>
                   </div>
                   <div className="bg-slate-900/40 border border-slate-800 rounded-2xl px-4 py-3">
                     <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pending approval</div>
                     <div className="text-lg font-black text-orange-400">{needsApprovalCount}</div>
                   </div>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    void loadTables();
                    setShowTransferModal(true);
                  }}
                  className="bg-slate-900/40 hover:bg-slate-900/60 text-slate-200 px-4 py-3 rounded-3xl border border-slate-800 transition-all font-black text-xs min-h-12"
                >
                  CHANGE TABLE
                </button>
                <button 
                  onClick={onClose}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-400 p-4 rounded-3xl border border-slate-700 transition-all font-black"
                >
                  BACK
                </button>
              </div>
           </div>

           {/* Placed Order Items Section */}
           {placedItems.length > 0 && (
             <div className="bg-slate-800/20 rounded-3xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-black text-slate-300 mb-4 uppercase tracking-widest">Ordered Items</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {placedItems.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                       <div>
                          <div className="font-bold text-slate-200">{item.productName}</div>
                          <div className="text-xs text-slate-500">{item.quantity} x {new Intl.NumberFormat('vi-VN').format(item.unitPrice)}</div>
                       </div>
                       <div className="flex items-center gap-3">
                          {item.status === OrderItemStatus.NeedsApproval && (
                            <button 
                              onClick={() => handleApproveItem(item.productId)}
                              className="bg-orange-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg hover:bg-orange-400 transition-all shadow-lg shadow-orange-900/20"
                            >
                              APPROVE
                            </button>
                          )}
                          <span className={`text-[10px] font-black px-2 py-1 rounded-md ${
                            item.status === OrderItemStatus.NeedsApproval ? 'bg-orange-500/10 text-orange-500 animate-pulse' :
                            item.status === OrderItemStatus.Cancelled ? 'bg-slate-700 text-slate-400' :
                            'bg-emerald-500/10 text-emerald-500'
                          }`}>
                            {item.status === OrderItemStatus.NeedsApproval ? 'PENDING' : item.status === OrderItemStatus.Cancelled ? 'CANCELLED' : 'OK'}
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

      {showTransferModal && (
        <TransferTableModal
          fromTableId={tableId}
          tables={tables}
          onClose={() => setShowTransferModal(false)}
          onConfirm={handleTransfer}
        />
      )}
    </div>
  );
};
