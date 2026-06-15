import React, { useEffect, useState, Suspense } from "react";
import { tableApi } from "../api/tableApi";
import type { TableDto } from "../models/table";
import { TableStatus } from "../models/table";
import { OrderPage } from "../components/OrderPage";
import { orderApi } from "../api/orderApi";
import { paymentApi } from "../api/paymentApi";
import { reportApi, type RevenueSummary } from "../api/reportApi";
import { useSignalR } from "../hooks/useSignalR";
import { useAuth } from "../context/AuthContext";

import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Plus,
  CheckCircle2,
  Loader2,
  Trash2,
} from "lucide-react";
import { cn } from "../lib/utils";
import { InviteStaffModal } from "../components/InviteStaffModal";
import { CreateTableModal } from "../components/CreateTableModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { LinearSelect } from "../components/LinearSelect";
import { TableSkeleton } from "../components/Skeleton";
import { useLocation } from "react-router-dom";
import apiClient from "../api/apiClient";
import { toast } from "sonner";
import { TrendingUp, ShoppingBag, UserCheck, DollarSign } from "lucide-react";

// Lazy load heavy components for code-splitting
const TableViewMap = React.lazy(() =>
  import("../components/TableViewMap").then((module) => ({
    default: module.TableViewMap,
  })),
);

export const Dashboard: React.FC = () => {
  const { currentShop, currentBranch } = useAuth();
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
  const [confirmingCheckoutId, setConfirmingCheckoutId] = useState<
    string | null
  >(null);
  const [viewingOrder, setViewingOrder] = useState<{
    tableId: string;
    tableName: string;
    orderId: string;
  } | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateTableModal, setShowCreateTableModal] = useState(false);
  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const currentView = pathParts[pathParts.length - 1];
  let activeNav = currentView === "dashboard" ? "overview" : currentView;
  if (activeNav === "employees") activeNav = "staff"; // mapping

  const [staffList, setStaffList] = useState<
    { userId: string; username: string; role: number; joinedAt: string }[]
  >([]);
  const [deleteTableId, setDeleteTableId] = useState<string | null>(null);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [revenue, setRevenue] = useState<RevenueSummary | null>(null);

  const formatVnd = (value: number) =>
    new Intl.NumberFormat("vi-VN").format(Math.round(value)) + "đ";

  const loadRevenue = async () => {
    if (!currentShop) return;
    try {
      const data = await reportApi.getRevenueSummary();
      setRevenue(data);
    } catch (err) {
      console.error("Failed to load revenue summary", err);
    }
  };


  useSignalR("http://localhost:5090/hubs/shop", (connection) => {
    if (currentShop) connection.invoke("JoinShopGroup", currentShop.id);
    connection.on("TableStatusUpdated", () => {
      loadTables();
      toast.info("Trạng thái bàn đã cập nhật");
    });
    connection.on("ReceiveAlert", (message: string) =>
      toast.info(message),
    );
  });

  useEffect(() => {
    loadTables();
  }, [currentShop, currentBranch]);

  const getApiError = (err: any) =>
    err?.response?.data?.error ||
    err?.response?.data?.message ||
    "Có lỗi xảy ra";

  const handleDeleteTable = async (id: string) => {
    try {
      await tableApi.deleteTable(id);
      toast.success("Đã xóa bàn");
      setDeleteTableId(null);
      await loadTables();
    } catch (err: any) {
      toast.error(getApiError(err));
      setDeleteTableId(null);
    }
  };

  const handleTableAction = async (table: TableDto) => {
    if (table.status === TableStatus.Available) {
      handleOpenTable(table.id);
    } else {
      try {
        const activeOrder = await orderApi.getActiveOrder(table.id);
        setViewingOrder({
          tableId: table.id,
          tableName: table.name,
          orderId: activeOrder.id,
        });
      } catch (err) {
        toast.error("Không thể tải thông tin đơn hàng");
      }
    }
  };

  const loadTables = async () => {
    if (!currentShop) return;
    try {
      setLoading(true);
      const data = await tableApi.getAll(currentBranch?.id);
      setTables(data);
    } catch (err) {
      toast.error("Không thể kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
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
      await apiClient.put(`/shop/${currentShop.id}/members/${userId}/role`, {
        role,
      });
      await loadStaff();
      toast.success("Cập nhật quyền thành công");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Không thể cập nhật quyền");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!currentShop) return;
    try {
      await apiClient.delete(`/shop/${currentShop.id}/members/${userId}`);
      await loadStaff();
      toast.success("Đã xóa nhân viên khỏi cửa hàng");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Không thể xóa nhân viên");
    } finally {
      setRemovingMemberId(null);
    }
  };

  useEffect(() => {
    if (activeNav === "staff") {
      loadStaff();
    }
  }, [activeNav, currentShop]);

  useEffect(() => {
    if (activeNav === "overview") {
      loadRevenue();
    }
  }, [activeNav, currentShop, currentBranch]);

  const handleOpenTable = async (id: string) => {
    try {
      const response = await tableApi.open(id);
      toast.success(`Bàn ${response.tableName} đã được mở`);
      loadTables();
      setViewingOrder({
        tableId: id,
        tableName: response.tableName,
        orderId: response.orderId,
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Lỗi mở bàn");
    }
  };

  const handleCheckout = async (id: string) => {
    try {
      // Ghi nhận thanh toán tiền mặt (server tự tính tổng tiền của order đang mở).
      const activeOrder = await orderApi.getActiveOrder(id);
      await paymentApi.createPayment({
        orderId: activeOrder.id,
        amount: activeOrder.totalAmount ?? 0,
        method: "Cash",
      });
      toast.success("Thanh toán thành công", {
        description: "Đã ghi nhận thanh toán. Bàn đã chuyển về trạng thái Trống."
      });
      loadTables();
      loadRevenue();
      setConfirmingCheckoutId(null);
    } catch (err: any) {
      toast.error("Lỗi thanh toán", {
        description: err.response?.data?.message || err.message
      });
      setConfirmingCheckoutId(null);
    }
  };

  return (
    <div className="space-y-8">

      {activeNav === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Doanh thu hôm nay", value: revenue ? formatVnd(revenue.todayRevenue) : "—", trend: "Hôm nay", icon: DollarSign, color: "text-emerald-400" },
            { label: "Đơn đã thanh toán", value: revenue ? String(revenue.todayOrderCount) : "—", trend: "Hôm nay", icon: ShoppingBag, color: "text-brand-purple" },
            { label: "Bàn đang dùng", value: `${tables.filter(t => t.status !== 0).length}/${tables.length}`, trend: "Live", icon: UserCheck, color: "text-brand-orange" },
            { label: "Doanh thu 7 ngày", value: revenue ? formatVnd(revenue.weekRevenue) : "—", trend: "7 ngày", icon: TrendingUp, color: "text-amber-400" },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="linear-card p-5 group hover:border-brand-purple/30 transition-all cursor-default"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-white/[0.03] group-hover:bg-brand-purple/10 transition-colors">
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <span className={cn("text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/[0.03]", stat.color)}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-[10px] font-black text-brand-gray uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className="text-2xl font-black text-white">{stat.value}</h4>
            </motion.div>
          ))}
        </div>
      )}

      <div className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-1">
                {activeNav === "overview"
                  ? "Tổng quan"
                  : activeNav === "tables"
                    ? "Quản lý Bàn"
                    : activeNav === "staff"
                      ? "Nhân sự"
                      : "Shop"}
              </h2>
              <p className="text-sm text-brand-gray uppercase tracking-widest font-bold text-[10px]">
                {activeNav === "overview"
                  ? "Thống kê hoạt động"
                  : activeNav === "tables"
                    ? "Sơ đồ và trạng thái bàn"
                    : activeNav === "staff"
                      ? "Quản lý nhân viên"
                      : "Quản lý shop"}
              </p>
            </div>

            {activeNav === "staff" && canManage && (
              <button
                onClick={() => setShowInviteModal(true)}
                className="btn-primary flex items-center gap-2 text-xs"
              >
                <Plus className="w-4 h-4" /> Invite Staff
              </button>
            )}

            {activeNav === "tables" && canManage && (
              <button
                onClick={() => setShowCreateTableModal(true)}
                className="px-4 py-2 bg-brand-purple/20 hover:bg-brand-purple/40 border border-brand-purple/30 rounded-xl text-brand-purple hover:text-white transition-all flex items-center gap-2 text-xs font-bold"
              >
                <Plus className="w-4 h-4" /> Arrange Tables
              </button>
            )}
          </div>


          {loading && activeNav === "tables" ? (
            <TableSkeleton />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNav}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                {activeNav === "overview" ? (
                  <div className="linear-surface rounded-2xl border border-white/[0.05] p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-bold">Doanh thu 7 ngày qua</h3>
                        <p className="text-[10px] font-black text-brand-gray uppercase tracking-widest mt-1">
                          Giá trị đơn trung bình:{" "}
                          {revenue ? formatVnd(revenue.averageOrderValue) : "—"}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-brand-gray">
                        {revenue ? `${revenue.weekOrderCount} đơn` : ""}
                      </span>
                    </div>

                    {!revenue ? (
                      <div className="h-48 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-brand-purple" />
                      </div>
                    ) : revenue.weekRevenue === 0 ? (
                      <div className="h-48 flex flex-col items-center justify-center text-center">
                        <TrendingUp className="w-10 h-10 text-[#6b5d52] mb-3" />
                        <p className="text-sm text-brand-gray">
                          Chưa có doanh thu trong 7 ngày qua.
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-end justify-between gap-2 h-48">
                        {(() => {
                          const max = Math.max(
                            ...revenue.dailySeries.map((d) => d.revenue),
                            1,
                          );
                          return revenue.dailySeries.map((d) => {
                            const heightPct = (d.revenue / max) * 100;
                            const dayLabel = new Date(
                              d.date + "T00:00:00",
                            ).toLocaleDateString("vi-VN", {
                              weekday: "short",
                            });
                            return (
                              <div
                                key={d.date}
                                className="flex-1 flex flex-col items-center gap-2 group"
                              >
                                <div className="relative w-full flex-1 flex items-end">
                                  <div
                                    className="w-full rounded-t-md bg-gradient-to-t from-brand-purple/40 to-brand-purple group-hover:from-brand-purple/60 group-hover:to-brand-purple transition-all min-h-[4px]"
                                    style={{ height: `${heightPct}%` }}
                                    title={`${formatVnd(d.revenue)} • ${d.orderCount} đơn`}
                                  />
                                </div>
                                <span className="text-[10px] font-bold text-brand-gray capitalize">
                                  {dayLabel}
                                </span>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    )}
                  </div>
                ) : activeNav === "tables" ? (
                  <Suspense
                    fallback={
                      <div className="p-12 text-center flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-brand-purple my-12" />
                      </div>
                    }
                  >
                    <TableViewMap
                      tables={tables}
                      onTableClick={handleTableAction}
                      onOpenTable={handleOpenTable}
                      onDeleteTable={canManage ? (id) => setDeleteTableId(id) : undefined}
                    />
                  </Suspense>
                ) : activeNav === "staff" ? (
                  <div className="linear-surface rounded-2xl border border-white/[0.05]">
                    {loadingStaff ? (
                      <div className="p-12 text-center flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-brand-purple my-12" />
                      </div>
                    ) : staffList.length === 0 ? (
                      <div className="p-12 text-center border-dashed border-white/[0.1]">
                        <Users className="w-12 h-12 text-[#6b5d52] mx-auto mb-4" />
                        <p className="text-sm font-semibold text-brand-gray">
                          No staff members found.
                        </p>
                      </div>
                    ) : (
                      <>
                        <table className="w-full text-left text-sm hidden md:table">
                          <thead className="bg-void/60 border-b border-border-normal">
                            <tr>
                              <th className="px-6 py-4 font-bold text-brand-gray text-[10px] uppercase tracking-widest">
                                Username
                              </th>
                              <th className="px-6 py-4 font-bold text-brand-gray text-[10px] uppercase tracking-widest">
                                Role
                              </th>
                              <th className="px-6 py-4 font-bold text-brand-gray text-[10px] uppercase tracking-widest">
                                Joined At
                              </th>
                              {canManage && (
                                <th className="px-6 py-4 font-bold text-brand-gray text-[10px] uppercase tracking-widest text-right">
                                  Actions
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/[0.02]">
                            {staffList.map((st) => (
                              <tr
                                key={st.userId}
                                className="hover:bg-white/[0.02] transition-colors"
                              >
                                <td className="px-6 py-4 font-bold">
                                  {st.username}
                                </td>
                                <td className="px-6 py-4">
                                  {canManage ? (
                                    <LinearSelect
                                      options={[
                                        { value: 0, label: "Owner" },
                                        { value: 1, label: "Manager" },
                                        { value: 2, label: "Staff" },
                                      ]}
                                      value={st.role}
                                      onChange={(val) =>
                                        handleUpdateMemberRole(st.userId, val)
                                      }
                                      className="w-32"
                                    />
                                  ) : (
                                    <span
                                      className={cn(
                                        "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                        st.role === 0
                                          ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                          : st.role === 1
                                            ? "bg-brand-purple/10 text-brand-purple border border-brand-purple/20"
                                            : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
                                      )}
                                    >
                                      {st.role === 0
                                        ? "Owner"
                                        : st.role === 1
                                          ? "Manager"
                                          : "Staff"}
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-brand-gray font-medium">
                                  {new Date(st.joinedAt).toLocaleDateString(
                                    "vi-VN",
                                  )}
                                </td>
                                {canManage && (
                                  <td className="px-6 py-4 text-right">
                                    <button
                                      onClick={() =>
                                        setRemovingMemberId(st.userId)
                                      }
                                      aria-label={`Xóa nhân viên ${st.username}`}
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
                        <div className="md:hidden space-y-4">
                          {staffList.map((st) => (
                            <div
                              key={st.userId}
                              className="linear-surface p-4 rounded-xl"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-bold text-white">
                                    {st.username}
                                  </h4>
                                  <p className="text-sm text-brand-gray">
                                    Joined:{" "}
                                    {new Date(st.joinedAt).toLocaleDateString(
                                      "vi-VN",
                                    )}
                                  </p>
                                </div>
                                {canManage ? (
                                  <LinearSelect
                                    options={[
                                      { value: 0, label: "Owner" },
                                      { value: 1, label: "Manager" },
                                      { value: 2, label: "Staff" },
                                    ]}
                                    value={st.role}
                                    onChange={(val) =>
                                      handleUpdateMemberRole(st.userId, val)
                                    }
                                    className="w-24 text-xs"
                                  />
                                ) : (
                                  <span
                                    className={cn(
                                      "px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                      st.role === 0
                                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                        : st.role === 1
                                          ? "bg-brand-purple/10 text-brand-purple border border-brand-purple/20"
                                          : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
                                    )}
                                  >
                                    {st.role === 0
                                      ? "Owner"
                                      : st.role === 1
                                        ? "Manager"
                                        : "Staff"}
                                  </span>
                                )}
                              </div>
                              {canManage && (
                                <button
                                  onClick={() => setRemovingMemberId(st.userId)}
                                  className="w-full mt-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-sm font-semibold transition-all"
                                >
                                  Remove Member
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : tables.length === 0 ? (
                  <div className="linear-surface rounded-2xl border border-white/[0.05] p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-brand-purple/10 flex items-center justify-center mb-6 mx-auto">
                      <LayoutDashboard className="w-8 h-8 text-brand-purple" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No Tables Yet</h3>
                    <p className="text-sm text-brand-gray mb-6">
                      Get started by creating your first table to manage orders
                      and seating.
                    </p>
                    {canManage && (
                      <button
                        onClick={() => setShowCreateTableModal(true)}
                        className="btn-primary"
                      >
                        Create First Table
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {tables.map((table) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        key={table.id}
                        className="p-5 linear-card group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-brand-gray uppercase tracking-widest mb-1">
                              {table.location}
                            </span>
                            <h3 className="text-lg font-bold">{table.name}</h3>
                          </div>
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              table.status === TableStatus.Available
                                ? "bg-brand-emerald shadow-[0_0_10px_rgba(47,185,122,0.45)]"
                                : "bg-brand-purple shadow-[0_0_10px_rgba(194,65,12,0.45)]",
                            )}
                          />
                        </div>
                        <div className="mt-auto">
                          {table.status === TableStatus.Available ? (
                            <button
                              onClick={() => handleOpenTable(table.id)}
                              className="w-full py-2 bg-white/[0.03] hover:bg-brand-purple border border-white/[0.08] hover:border-brand-purple rounded-lg text-xs font-bold transition-all active:scale-95"
                            >
                              Serve Table
                            </button>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => handleTableAction(table)}
                                className="py-2 bg-brand-purple text-white rounded-lg text-xs font-bold active:scale-95"
                              >
                                Details
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setConfirmingCheckoutId(table.id);
                                }}
                                className="py-2 bg-white/[0.03] hover:bg-rose-500/20 hover:text-rose-400 rounded-lg text-xs font-bold transition-all active:scale-95"
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
              </motion.div>
            </AnimatePresence>
          )}
        </div>


      <ConfirmModal
        open={removingMemberId !== null}
        tone="danger"
        title="Xóa nhân viên?"
        description={`Xác nhận xóa ${
          staffList.find((s) => s.userId === removingMemberId)?.username ?? "nhân viên này"
        } khỏi cửa hàng. Họ sẽ mất quyền truy cập.`}
        confirmLabel="Xóa"
        onCancel={() => setRemovingMemberId(null)}
        onConfirm={() => removingMemberId && handleRemoveMember(removingMemberId)}
      />

      {showInviteModal && (
        <InviteStaffModal
          onClose={() => {
            setShowInviteModal(false);
            loadStaff();
          }}
        />
      )}

      {showCreateTableModal && (
        <CreateTableModal
          onClose={() => setShowCreateTableModal(false)}
          onSuccess={() => loadTables()}
          existingLocations={Array.from(
            new Set((tables || []).map((t) => t.location).filter(Boolean)),
          )}
        />
      )}

      {viewingOrder && (
        <OrderPage
          tableId={viewingOrder.tableId}
          orderId={viewingOrder.orderId}
          tableName={viewingOrder.tableName}
          onClose={() => {
            setViewingOrder(null);
            loadTables();
          }}
          onTransferred={(newTableId, newTableName) => {
            setViewingOrder((prev) =>
              prev
                ? { ...prev, tableId: newTableId, tableName: newTableName }
                : prev,
            );
            loadTables();
          }}
        />
      )}

      {/* Delete Table Confirmation Modal */}
      <AnimatePresence>
        {deleteTableId && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteTableId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm linear-surface p-8 shadow-2xl border border-white/[0.1]"
            >
              <div className="flex flex-col items-center text-center">
                <h3 className="text-xl font-bold mb-2">Xóa bàn?</h3>
                <p className="text-sm text-brand-gray mb-8">
                  Xác nhận xóa{" "}
                  {tables.find((t) => t.id === deleteTableId)?.name}. Hành động này
                  không thể hoàn tác.
                </p>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <button
                    onClick={() => setDeleteTableId(null)}
                    className="py-3 px-4 bg-white/[0.05] hover:bg-white/[0.1] rounded-xl text-xs font-bold transition-all"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => handleDeleteTable(deleteTableId)}
                    className="py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                  Xác nhận thanh toán cho{" "}
                  {tables.find((t) => t.id === confirmingCheckoutId)?.name}.
                  Hành động này sẽ đóng đơn hàng hiện tại.
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
