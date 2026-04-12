# Module: Menu & Ordering (Thực đơn & Gọi món)

## 🎯 Mục tiêu
Cung cấp quy trình gọi món tại bàn nhanh chóng, chính xác và đồng bộ hóa thời gian thực (Real-time).

## 🏗️ Cấu trúc Kỹ thuật

### 1. Phía Backend (C# / .NET 9)
- **Entities**: 
  - `Product`: Thông tin sản phẩm (Tên, Giá, Ảnh, Danh mục).
  - `Category`: Phân loại sản phẩm (Đồ ăn, Đồ uống, Khai vị...).
  - `Order`: Thông tin phiên gọi món gắn với một Bàn (`TableId`).
  - `OrderItem`: Từng món lẻ trong Order với trạng thái (Pending, NeedsApproval, Served, Cancelled).
- **Repositories**: `ProductRepository`, `CategoryRepository`, `OrderRepository`.
- **Services**:
  - `MenuService`: Lấy danh sách thực đơn phân theo Category.
  - `OrderService`: Xử lý thêm món vào bàn, tính tổng tiền, **Rule Engine** (Luồng Xanh/Đỏ), và **bắn SignalR** thông báo cập nhật.
- **Rule Engine**:
  - **Luồng Xanh**: Món có số lượng < 20 và giá < 500k -> Trạng thái `Pending` (Tự động duyệt).
  - **Luồng Đỏ**: Vượt ngưỡng -> Trạng thái `NeedsApproval` -> Bắn `SendAlertAsync` cho quản lý.
- **SignalR**: `ShopHub` quản lý kênh `ReceiveTableUpdate` và `ReceiveAlert`.

### 2. Phía Frontend (React 19 / Vite)
- **Components**:
  - `MenuGrid`: Hiển thị thực đơn theo Tab Category, hỗ trợ Quick-Select.
  - `OrderSidebar`: Giỏ hàng tại bàn (Món đang chọn).
  - `OrderPage`: Hiển thị danh sách món **Đã gọi** (Placed Items) và món **Đang chọn** (Pending Items).
  - **Duyệt món**: Staff/Manager có thể bấm nút "Duyệt" cho các món ở trạng thái `CHỜ DUYỆT`.
- **Hooks**: `useSignalR` lắng nghe cập nhật từ Backend để tự động refresh `loadTables`.

## 🔄 Quy trình Nghiệp vụ (Flow)
1. Staff nhấn **Mở Bàn** -> Backend tạo `Order` (Open) -> Frontend chuyển hướng vào `OrderPage`.
2. Staff chọn món trong `MenuGrid` -> Danh sách món hiện ở `OrderSidebar`.
3. Nhấn **Xác nhận Gọi món** -> Gọi API `Order/items` -> Backend chạy Rule Engine -> Lưu vào DB -> Phát SignalR.
4. Nếu món bị liệt vào **Luồng Đỏ** -> Dashboard hiện Alert và Badge "Chờ Duyệt" trên bàn.
5. Staff vào `OrderPage` bấm **Duyệt** -> Món chuyển sang `Pending` (Sẵn sàng phục vụ).
6. Khách quét QR (`QROrderPage`) có thể xem danh sách món đã gọi và trạng thái món.

## ⚠️ Lưu ý Quan trọng
- **Idempotency**: Sử dụng `IdempotencyKey` khi gọi món để tránh trùng lặp dữ liệu khi mạng lag.
- **Real-time**: SignalR Group theo `ShopId` và `TableId`.
- Tiền tệ: Standard VNĐ.
- Ảnh sản phẩm: Lưu path tại `imageUrl`.
