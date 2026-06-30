# ShopManagement

ASP.NET Core MVC app (server-rendered Razor views) quản lý nhà hàng/quán ăn đa chi nhánh.
Chạy: `dotnet run --project src/ShopManagement.Web/ShopManagement.Web.csproj`.
Xem [AGENTS.md](AGENTS.md) cho kiến trúc & quy ước, [DESIGN.md](DESIGN.md) cho design system.

## 📋 Checklist Kiểm thử (Giả lập)

| Tính năng | Trạng thái | Ghi chú |
| :--- | :---: | :--- |
| Menu branch hiển thị đúng món chung + riêng | ⬜ | `Menu/Index` (MenuController) |
| Tạo bàn mới với khu vực tùy chỉnh hoạt động | ⬜ | `Table/Create` + `Table/Areas` |
| Thêm món với số lượng >1 | ⬜ | `Order/Index` (form AddItem) |
| Thanh toán tạo payment record | ⬜ | `Payment/Checkout` → `Payment/Confirm` |
| Xóa bàn khi chưa có order | ⬜ | `Table/Delete` |
