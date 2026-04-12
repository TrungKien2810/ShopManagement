namespace ShopManagement.Domain.Enums;

public enum OrderItemStatus
{
    Pending = 0,        // Chờ bếp/pha chế
    Served = 1,         // Đã lên món
    Cancelled = 2,      // Bị hủy
    NeedsApproval = 3   // Cần người quản lý duyệt (Luồng Đỏ)
}
