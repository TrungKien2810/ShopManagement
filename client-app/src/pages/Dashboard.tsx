import React, { useEffect, useState } from "react";
import { tableApi } from "../api/tableApi";
import type { TableDto } from "../models/table";
import { TableStatus } from "../models/table";
import { OrderPage } from "../components/OrderPage";
import { orderApi } from "../api/orderApi";
import { useSignalR } from "../hooks/useSignalR";
import { useAuth } from "../context/AuthContext";

import { ProfileDropdown } from "../components/ProfileDropdown";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Users, 
  UtensilsCrossed,
  RefreshCcw, 
  Plus, 
  ChevronRight,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Trash2
} from "lucide-react";
import { cn } from "../lib/utils";
import { TableViewMap } from "../components/TableViewMap";
import { Logo } from "../components/Logo";
import { InviteStaffModal } from "../components/InviteStaffModal";
import { CreateTableModal } from "../components/CreateTableModal";
import { MenuManagement } from "../components/MenuManagement";
import { LinearSelect } from "../components/LinearSelect";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

export const Dashboard: React.FC = () => {
  const { currentShop } = useAuth();
  const shopRole = currentShop?.role;
  const roleRank =
    typeof shopRole === "number"
      ? shopRole
      : shopRole === "Owner"
        ? 0
        : shopRole === "Manager"
          ? 1
          : shopRole === "Staff"
            ? 2
            : undefined;
  const canManage = roleRank !== undefined && roleRank <= 1;
  const [tables, setTables] = useState<TableDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingCheckoutId, setConfirmingCheckoutId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<{ id: number; message: string; type: "info" | "success" }[]>([]);
  const [viewingOrder, setViewingOrder] = useState<{ tableId: string; tableName: string; orderId: string; } | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateTableModal, setShowCreateTableModal] = useState(false);
  const [activeNav, setActiveNav] = useState("tables");
  const [staffList, setStaffList] = useState<{ userId: string; username: string; role: number; joinedAt: string }[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const navigate = useNavigate();

  const addNotification = (message: string, type: "info" | "success" = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => { setNotifications((prev) => prev.filter((n) => n.id !== id)); }, 4000);
  };

  useSignalR("http://localhost:5090/hubs/shop", (connection) => {
    if (currentShop) connection.invoke("JoinShopGroup", currentShop.id);
    connection.on("TableStatusUpdated", () => { loadTables(); addNotification("Table status updated", "info"); });
    connection.on("ReceiveAlert", (message: string) => addNotification(message, "info"));
  });

  useEffect(() => { loadTables(); }, [currentShop]);

  const handleTableAction = async (table: TableDto) => {
    if (table.status === TableStatus.Available) {
       handleOpenTable(table.id);
    } else {
       try {
         const activeOrder = await orderApi.getActiveOrder(table.id);
         setViewingOrder({ tableId: table.id, tableName: table.name, orderId: activeOrder.id });
       } catch (err) { setError("Could not load order information"); }
    }
  };

  const loadTables = async () => {
    if (!currentShop) return;
    try { setLoading(true); const data = await tableApi.getAll(); setTables(data); }
    catch (err) { setError("Failed to connect to the backend"); }
    finally { setLoading(false); }
  };

  const loadStaff = async () => {
    if (!currentShop) return;
    setLoadingStaff(true);
    try {
      const resp = await apiClient.get(`/shop/${currentShop.id}/members`);
      setStaffList(resp.data);
    } catch (err) {
      console.error("Failed to load staff list", err);
    } finally {
      setLoadingStaff(false);
    }
  };

  const handleUpdateMemberRole = async (userId: string, role: number) => {
    if (!currentShop) return;
    try {
      await apiClient.put(`/shop/${currentShop.id}/members/${userId}/role`, { role });
      await loadStaff();
      addNotification("Role updated successfully", "success");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not update role");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!currentShop) return;
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await apiClient.delete(`/shop/${currentShop.id}/members/${userId}`);
      await loadStaff();
      addNotification("Member removed from shop", "success");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Could not remove member");
    }
  };

  useEffect(() => {
    if (activeNav === 'staff') {
      loadStaff();
    }
  }, [activeNav, currentShop]);

  const handleOpenTable = async (id: string) => {
    try {
      const response = await tableApi.open(id);
      addNotification(`Table ${response.tableName} opened`, "success");
      loadTables();
      setViewingOrder({ tableId: id, tableName: response.tableName, orderId: response.orderId });
    } catch (err: any) { setError(err.response?.data?.message || "Lỗi mở bàn"); }
  };

  const handleCheckout = async (id: string) => {
    try { 
      await tableApi.checkout(id); 
      addNotification("Thanh toán thành công", "success"); 
      loadTables(); 
      setConfirmingCheckoutId(null);
    } catch (err: any) { 
      setError("Lỗi thanh toán: " + (err.response?.data?.message || err.message)); 
      setConfirmingCheckoutId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-void text-white font-sans selection:bg-brand-purple/30">
      <aside className="w-64 border-r border-white/[0.05] bg-slate-deep hidden md:flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex flex-col h-full">
          <div className="mb-8 px-2">
            <Logo iconSize={4} textSize="text-lg" />
          </div>

          <nav className="space-y-1 flex-1">
             {[
               { id: 'tables', label: 'Tables', icon: LayoutDashboard },
               { id: 'map', label: 'Floor Plan', icon: MapIcon },
               { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
               { id: 'staff', label: 'Staff', icon: Users },
             ].map((item) => (
               <button
                 key={item.id}
                 onClick={() => setActiveNav(item.id)}
                 className={cn(
                   "w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg transition-all group",
                   activeNav === item.id 
                    ? "bg-white/[0.05] text-white" 
                    : "text-brand-gray hover:text-white hover:bg-white/[0.02]"
                 )}
               >
                 <item.icon className={cn("w-4 h-4 transition-colors", activeNav === item.id ? "text-brand-purple" : "text-[#4c4f5a] group-hover:text-brand-gray")} />
                 {item.label}
               </button>
             ))}
           </nav>

          <div className="mt-auto pt-6 border-t border-white/[0.05]">
            <button 
              onClick={() => navigate('/shops')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group font-semibold bg-white/[0.02] text-brand-gray border border-white/[0.05] hover:bg-white/[0.05] hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Shops
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-void">
        <header className="h-16 border-b border-white/[0.05] flex items-center justify-between px-8 bg-void/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4 text-sm font-medium text-brand-gray">
            <span>{currentShop?.name}</span>
            <ChevronRight className="w-3 h-3 text-[#31343e]" />
            <span className={cn(activeNav === 'map' ? "text-white" : "")}>
              {activeNav === 'map' ? 'Floor Plan' : activeNav === 'menu' ? 'Menu Management' : activeNav === 'staff' ? 'Staff Management' : 'Table List'}
            </span>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={loadTables} className="p-2 text-brand-gray hover:text-white transition-colors">
                <RefreshCcw className={cn("w-4.5 h-4.5", loading && "animate-spin")} />
             </button>
             <ProfileDropdown />
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
           <div className="flex justify-between items-end mb-8">
              <div>
                 <h2 className="text-2xl font-bold tracking-tight mb-1">
                    {activeNav === 'map' ? 'Floor Plan' : activeNav === 'menu' ? 'Menu Management' : activeNav === 'staff' ? 'Staff Management' : 'Table List'}
                 </h2>
                 <p className="text-sm text-brand-gray uppercase tracking-widest font-bold text-[10px]">
                    {activeNav === 'map' ? 'Visual layout' : activeNav === 'menu' ? 'Categories & products' : activeNav === 'staff' ? 'Staff list' : 'Table status management'}
                 </p>
              </div>

              {activeNav === 'staff' && canManage && (
                <button onClick={() => setShowInviteModal(true)} className="btn-primary flex items-center gap-2 text-xs">
                  <Plus className="w-4 h-4" /> Invite Staff
                </button>
              )}

              {activeNav === 'map' && canManage && (
                <button onClick={() => setShowCreateTableModal(true)} className="px-4 py-2 bg-brand-purple/20 hover:bg-brand-purple/40 border border-brand-purple/30 rounded-xl text-brand-purple hover:text-white transition-all flex items-center gap-2 text-xs font-bold">
                  <Plus className="w-4 h-4" /> Arrange Tables
                </button>
              )}
           </div>

           {error && (
             <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm font-semibold flex items-center justify-between">
               <span>{error}</span>
               <button onClick={() => setError(null)} className="text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100">Dismiss</button>
             </div>
           )}

           {loading && activeNav === 'tables' ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
               {[1,2,3,4].map(i => <div key={i} className="h-40 linear-surface animate-pulse" />)}
             </div>
           ) : (
             <>
               {activeNav === 'map' ? (
                  <TableViewMap 
                    tables={tables} 
                    onTableClick={handleTableAction}
                    onOpenTable={handleOpenTable}
                  />
               ) : activeNav === 'menu' ? (
                  canManage ? (
                    <MenuManagement />
                  ) : (
                    <div className="linear-surface rounded-2xl border border-white/[0.05] p-10 text-center">
                      <p className="text-sm font-semibold text-brand-gray">You do not have permission to manage the menu.</p>
                    </div>
                  )
               ) : activeNav === 'staff' ? (
                  <div className="linear-surface rounded-2xl border border-white/[0.05]">
                    {loadingStaff ? (
                       <div className="p-12 text-center flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-purple my-12" /></div>
                    ) : staffList.length === 0 ? (
                      <div className="p-12 text-center border-dashed border-white/[0.1]">
                         <Users className="w-12 h-12 text-[#4c4f5a] mx-auto mb-4" />
                         <p className="text-sm font-semibold text-brand-gray">No staff members found.</p>
                      </div>
                    ) : (
                      <table className="w-full text-left text-sm">
                        <thead className="bg-[#0b0c10] border-b border-white/[0.05]">
                           <tr>
                              <th className="px-6 py-4 font-bold text-brand-gray text-[10px] uppercase tracking-widest">Username</th>
                              <th className="px-6 py-4 font-bold text-brand-gray text-[10px] uppercase tracking-widest">Role</th>
                              <th className="px-6 py-4 font-bold text-brand-gray text-[10px] uppercase tracking-widest">Joined At</th>
                              {canManage && <th className="px-6 py-4 font-bold text-brand-gray text-[10px] uppercase tracking-widest text-right">Actions</th>}
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                           {staffList.map((st, i) => (
                             <tr key={st.userId} className="hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4 font-bold">{st.username}</td>
                                <td className="px-6 py-4">
                                  {canManage ? (
                                    <LinearSelect 
                                      options={[
                                        { value: 0, label: "Owner" },
                                        { value: 1, label: "Manager" },
                                        { value: 2, label: "Staff" }
                                      ]}
                                      value={st.role}
                                      onChange={(val) => handleUpdateMemberRole(st.userId, val)}
                                      className="w-32"
                                    />
                                  ) : (
                                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", st.role === 0 ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : st.role === 1 ? "bg-brand-purple/10 text-brand-purple border border-brand-purple/20" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20")}>
                                       {st.role === 0 ? "Owner" : st.role === 1 ? "Manager" : "Staff"}
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-brand-gray font-medium">
                                  {new Date(st.joinedAt).toLocaleDateString('vi-VN')}
                                </td>
                                {canManage && (
                                  <td className="px-6 py-4 text-right">
                                    <button 
                                      onClick={() => handleRemoveMember(st.userId)}
                                      className="p-2 hover:bg-rose-500/10 rounded-lg text-brand-gray hover:text-rose-400 transition-all"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                )}
                             </tr>
                           ))}
                        </tbody>
                      </table>
                    )}
                  </div>
               ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {tables.map((table) => (
                      <motion.div layout key={table.id} className="p-5 linear-card group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex flex-col">
                             <span className="text-[10px] font-bold text-brand-gray uppercase tracking-widest mb-1">{table.location}</span>
                             <h3 className="text-lg font-bold">{table.name}</h3>
                          </div>
                          <div className={cn("w-2 h-2 rounded-full", table.status === TableStatus.Available ? "bg-brand-emerald shadow-[0_0_10px_rgba(16,185,129,0.4)]" : "bg-brand-purple")} />
                        </div>
                        <div className="mt-auto">
                          {table.status === TableStatus.Available ? (
                            <button onClick={() => handleOpenTable(table.id)} className="w-full py-2 bg-white/[0.03] hover:bg-brand-purple border border-white/[0.08] hover:border-brand-purple rounded-lg text-xs font-bold transition-all">
                              Serve Table
                            </button>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                               <button onClick={() => handleTableAction(table)} className="py-2 bg-brand-purple text-white rounded-lg text-xs font-bold">Details</button>
                               <button 
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   setConfirmingCheckoutId(table.id);
                                 }} 
                                 className="py-2 bg-white/[0.03] hover:bg-rose-500/20 hover:text-rose-400 rounded-lg text-xs font-bold transition-all"
                               >
                                 Checkout
                               </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
               )}
             </>
           )}
        </div>
      </main>

      <AnimatePresence>
         {notifications.map((n) => (
           <motion.div
             key={n.id}
             initial={{ opacity: 0, y: 20, scale: 0.9 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, scale: 0.9 }}
             className={cn(
               "fixed bottom-8 right-8 z-[500] px-6 py-4 linear-surface shadow-2xl flex items-center gap-3 min-w-[300px]",
               n.type === "success" ? "border-brand-emerald/30" : "border-brand-purple/30"
             )}
           >
             {n.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-brand-emerald" /> : <Loader2 className="w-5 h-5 text-brand-purple animate-spin" />}
             <span className="text-sm font-semibold">{n.message}</span>
           </motion.div>
         ))}
      </AnimatePresence>

      {showInviteModal && (
        <InviteStaffModal onClose={() => { setShowInviteModal(false); loadStaff(); }} />
      )}

      {showCreateTableModal && (
        <CreateTableModal
          onClose={() => setShowCreateTableModal(false)}
          onSuccess={() => loadTables()}
          existingLocations={Array.from(new Set((tables || []).map((t) => t.location).filter(Boolean)))}
        />
      )}

      {viewingOrder && (
        <OrderPage
          tableId={viewingOrder.tableId}
          orderId={viewingOrder.orderId}
          tableName={viewingOrder.tableName}
          onClose={() => { setViewingOrder(null); loadTables(); }}
          onTransferred={(newTableId, newTableName) => {
            setViewingOrder((prev) => (prev ? { ...prev, tableId: newTableId, tableName: newTableName } : prev));
            loadTables();
          }}
        />
      )}

      {/* Checkout Confirmation Modal */}
      <AnimatePresence>
        {confirmingCheckoutId && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setConfirmingCheckoutId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm linear-surface p-8 shadow-2xl border border-white/[0.1]"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-brand-purple/10 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-brand-purple" />
                </div>
                <h3 className="text-xl font-bold mb-2">Thanh toán bàn?</h3>
                <p className="text-sm text-brand-gray mb-8">
                  Xác nhận thanh toán cho {tables.find(t => t.id === confirmingCheckoutId)?.name}. Hành động này sẽ đóng đơn hàng hiện tại.
                </p>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button 
                    onClick={() => setConfirmingCheckoutId(null)}
                    className="py-3 px-4 bg-white/[0.05] hover:bg-white/[0.1] rounded-xl text-xs font-bold transition-all"
                  >
                    Hủy
                  </button>
                  <button 
                    onClick={() => handleCheckout(confirmingCheckoutId)}
                    className="py-3 px-4 bg-brand-purple hover:bg-brand-purple/80 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-brand-purple/20"
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
