# Nhật ký Phiên làm việc - 24/03/2026: Hệ thống Gọi món & Thực đơn

## 🎯 Mục tiêu
Hoàn thiện luồng nghiệp vụ lõi: Mở bàn -> Xem thực đơn -> Gọi món -> Cập nhật trạng thái bàn.

## 🏗️ Trạng thái hiện tại
### Backend (90% Hoàn thành)
- **Entities**: Category, Product, Order, OrderItem đã sẵn sàng.
- **Repositories**: `ProductRepository`, `CategoryRepository`, `OrderRepository` đã triển khai và đăng ký trong `UnitOfWork`.
- **Services**: `MenuService` (Lấy thực đơn), `OrderService` (Thêm món, lấy đơn hàng hiện tại).
- **Controllers**: `MenuController`, `OrderController` đã sẵn sàng.
- **Lưu ý**: Cần kiểm tra kỹ việc Migrate DB cho các bảng mới.

### Frontend (60% Hoàn thành)
- **API Layers**: `menuApi.ts`, `orderApi.ts`, `tableApi.ts`.
- **Components**: `MenuGrid` (Hiển thị món), `OrderSidebar` (Giỏ hàng), `OrderPage` (Trang gọi món tổng hợp).
- **Việc cần làm**: Tích hợp `OrderPage` vào `App.tsx`.

## 🛡️ Ý kiến từ Đội ngũ Agent (Simulated)
- **@Architect**: Cấu trúc Layered sạch, Repo/Service pattern ổn. Cần thêm SignalR để Dashboard cập nhật realtime khi có món mới được gọi.
- **@Business**: Luồng gọi món cần cho phép chọn số lượng (Đã có). Cần thêm nút "Thanh toán/Trả bàn" để kết thúc chu kỳ.
- **@Staff**: Giao diện `MenuGrid` cần ảnh minh họa sinh động. Thông báo "Bell" cần kích hoạt khi bếp nhận đơn.
- **@Tester**: Cần bổ sung Integration Test cho luồng `AddItemToOrder`.

## 📝 Kế hoạch Tiếp theo (Execution)
1. Cập nhật `App.tsx` để điều hướng vào `OrderPage` khi nhấn "Mở bàn" hoặc click vào bàn "Đang dùng".
2. Khởi tạo dữ liệu mẫu cho Menu (Seed Data).
3. Triển khai SignalR (Cơ bản) để sync trạng thái bàn.
