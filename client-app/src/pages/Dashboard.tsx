import React, { useEffect, useState } from "react";
import { tableApi } from "../api/tableApi";
import type { TableDto } from "../models/table";
import { TableStatus } from "../models/table";
import { OrderPage } from "../components/OrderPage";
import { orderApi } from "../api/orderApi";
import { useSignalR } from "../hooks/useSignalR";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { shopApi } from "../api/shopApi";
import { ProfileDropdown } from "../components/ProfileDropdown";

export const Dashboard: React.FC = () => {
  const { currentShop } = useAuth();
  const navigate = useNavigate();
  const [tables, setTables] = useState<TableDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<
    { id: number; message: string; type: "info" | "success" }[]
  >([]);
  const [viewingOrder, setViewingOrder] = useState<{
    tableId: string;
    tableName: string;
    orderId: string;
  } | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({ username: "", role: 2 }); // 2 is Staff

  useSignalR("http://localhost:5090/hubs/shop", (connection) => {
    if (currentShop) {
      connection.invoke("JoinShopGroup", currentShop.id);
    }

    connection.on("TableStatusUpdated", () => {
      loadTables();
      addNotification("Có thay đổi trạng thái bàn!", "info");
    });

    connection.on("ReceiveAlert", (message: string) => {
      addNotification(`CẢNH BÁO: ${message}`, "info");
    });
  });

  useEffect(() => {
    loadTables();
  }, [currentShop]);

  const addNotification = (
    message: string,
    type: "info" | "success" = "info",
  ) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  const loadTables = async () => {
    if (!currentShop) return;
    try {
      setLoading(true);
      const data = await tableApi.getAll();
      setTables(data);
    } catch (err) {
      setError("Không thể tải danh sách bàn. Kiểm tra Backend!");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTable = async (id: string) => {
    try {
      const response = await tableApi.open(id);
      addNotification(
        `Bàn ${response.tableName} đã được mở thành công!`,
        "success",
      );
      loadTables();
      setViewingOrder({
        tableId: id,
        tableName: response.tableName,
        orderId: response.orderId,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể mở bàn.");
    }
  };

  const handleResetTable = async (id: string) => {
    try {
      await tableApi.reset(id);
      addNotification("Đã dọn dẹp bàn xong!", "info");
      loadTables();
    } catch (err: any) {
      setError("Không thể reset bàn.");
    }
  };

  const handleCheckout = async (id: string) => {
    if (!window.confirm("Xác nhận thanh toán và đóng bàn?")) return;
    try {
      await tableApi.checkout(id);
      addNotification("Thanh toán thành công!", "success");
      loadTables();
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể thanh toán.");
    }
  };

  const handleEnterTable = async (table: TableDto) => {
    try {
      const activeOrder = await orderApi.getActiveOrder(table.id);
      setViewingOrder({
        tableId: table.id,
        tableName: table.name,
        orderId: activeOrder.id,
      });
    } catch (err) {
      setError("Không thể lấy thông tin đơn hàng.");
    }
  };

  const handleInviteStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentShop) return;
    try {
      await shopApi.invite(currentShop.id, inviteData);
      addNotification(`Đã mời ${inviteData.username} thành công!`, "success");
      setShowInviteModal(false);
      setInviteData({ username: "", role: 2 });
    } catch (err: any) {
      setError(
        err.response?.data || "Không tìm thấy người dùng hoặc lỗi hệ thống.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-inter p-4 md:p-8 relative overflow-hidden">
      {viewingOrder && (
        <OrderPage
          tableId={viewingOrder.tableId}
          orderId={viewingOrder.orderId}
          tableName={viewingOrder.tableName}
          onClose={() => {
            setViewingOrder(null);
            loadTables();
          }}
        />
      )}

      {/* Notifications */}
      <div className="fixed top-24 right-6 z-50 flex flex-col gap-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl animate-slideIn flex items-center gap-3 transition-all ${
              n.type === "success"
                ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-100"
                : "bg-cyan-500/20 border-cyan-500/30 text-cyan-100"
            }`}
          >
            <span className="font-semibold text-sm">{n.message}</span>
          </div>
        ))}
      </div>

      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-center bg-slate-800/50 p-6 rounded-3xl border border-slate-700 backdrop-blur-md shadow-2xl">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-1">
            {currentShop?.name}{" "}
            <span className="text-slate-500 text-lg font-medium">
              Dashboard
            </span>
          </h1>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3 items-center">
          {(currentShop?.role === "Owner" ||
            currentShop?.role === "Manager") && (
            <button
              onClick={() => setShowInviteModal(true)}
              className="px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-all font-bold"
            >
              + Mời nhân viên
            </button>
          )}
          <button
            onClick={() => navigate("/shops")}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl transition-all border border-slate-600"
          >
            Đổi quán
          </button>
          <button
            onClick={loadTables}
            className="bg-slate-700 hover:bg-slate-600 p-3 rounded-xl border border-slate-600 transition-all"
          >
            🔄
          </button>
          <ProfileDropdown />
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 p-4 rounded-2xl mb-6 flex items-center gap-3">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-48 bg-slate-800/30 rounded-3xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tables.map((table) => (
              <div
                key={table.id}
                className={`p-6 rounded-3xl border transition-all duration-300 group hover:scale-[1.02] ${
                  table.status === TableStatus.Available
                    ? "bg-slate-800/40 border-slate-700 hover:border-emerald-500/50"
                    : "bg-slate-800/20 border-slate-700/50 opacity-80"
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold">{table.name}</h3>
                  <span
                    className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                      table.status === TableStatus.Available
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-slate-700 text-slate-500"
                    }`}
                  >
                    {table.status === TableStatus.Available
                      ? "Còn Trống"
                      : "Đang Dùng"}
                  </span>
                </div>
                <p className="text-slate-500 text-sm mb-6">
                  {table.location} • {table.capacity} chỗ
                </p>
                {table.status === TableStatus.Available ? (
                  <button
                    onClick={() => handleOpenTable(table.id)}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-900/20"
                  >
                    Mở Bàn
                  </button>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={() => handleEnterTable(table)}
                      className="w-full py-3 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-bold rounded-2xl border border-emerald-500/30 transition-all"
                    >
                      Gọi Món
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleCheckout(table.id)}
                        className="py-2 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 font-bold rounded-xl border border-orange-500/30 transition-all text-sm"
                      >
                        Thanh Toán
                      </button>
                      <button
                        onClick={() => handleResetTable(table.id)}
                        className="py-2 bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700 text-xs font-medium rounded-xl transition-all"
                      >
                        Dọn Bàn
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setShowInviteModal(false)}
          ></div>
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-[32px] shadow-2xl animate-bounceIn">
            <h2 className="text-2xl font-black text-white mb-2 italic tracking-tighter uppercase">
              Mời Thành Viên 🍻
            </h2>
            <p className="text-slate-500 text-sm mb-8 font-medium">
              Thêm nhân viên hoặc quản lý vào quán của bạn
            </p>

            <form onSubmit={handleInviteStaff} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-800 font-bold"
                  placeholder="Nhập username nhân viên..."
                  value={inviteData.username}
                  onChange={(e) =>
                    setInviteData({ ...inviteData, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">
                  Vai trò
                </label>
                <select
                  className="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all font-bold text-slate-300"
                  value={inviteData.role}
                  onChange={(e) =>
                    setInviteData({
                      ...inviteData,
                      role: parseInt(e.target.value),
                    })
                  }
                >
                  <option value={2}>Nhân viên (Staff)</option>
                  <option value={1}>Quản lý (Manager)</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 font-black rounded-2xl transition-all uppercase tracking-widest text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-2 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-900/20 transition-all uppercase tracking-widest text-xs px-8"
                >
                  Gửi lời mời 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
