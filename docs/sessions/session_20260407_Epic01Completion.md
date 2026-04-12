# Session Log: 2026-04-07 - Epic 01 Completion & Rule Engine Implementation

**Thời gian**: 2026-04-07
**Agent**: Captain (Antigravity)
**Nội dung**: Review và hoàn thiện Epic 01 (Core Ordering & Table Management).

## ✅ Các công việc đã hoàn thành
1. **Hoàn thiện Story 04 (Manual Approve)**:
   - Backend: Thêm API `ApproveOrderItemAsync` trong `OrderService` và endpoint `POST /api/Order/{orderId}/approve/{productId}`.
   - Frontend: Cập nhật `OrderPage.tsx` để hiển thị danh sách món đã gọi và nút "Duyệt" cho nhân viên.
2. **Hoàn thiện Story 05 (Close Table & Checkout)**:
   - Backend: Thêm API `CheckoutAsync` trong `TableService` và endpoint `POST /api/Tables/{id}/checkout`.
   - Frontend: Thêm nút "Thanh toán" trong `Dashboard.tsx` và tích hợp API.
3. **Cải tiến QR Order**:
   - Cập nhật `QROrderPage.tsx` để khách hàng có thể thấy danh sách món mình đã gọi và trạng thái món (Đã nhận / Chờ duyệt).
4. **Cập nhật Tài liệu (Preservation)**:
   - Cập nhật `docs/modules/table_management.md` và `docs/modules/menu_ordering.md` với logic mới về Rule Engine và Checkout.
   - Cập nhật `docs/stories/epic_01_core_ordering.md`: Đánh dấu tất cả Story là **[DONE]**.

## 🛠️ Quyết định Kỹ thuật
- **Rule Engine**: Sử dụng ngưỡng (500k VNĐ hoặc 20 món) để phân loại món cần duyệt (Luồng Đỏ) hay tự động nhận (Luồng Xanh).
- **SignalR**: Tích hợp thông báo real-time khi có món cần duyệt để nhân viên xử lý kịp thời.
- **Idempotency**: Áp dụng `IdempotencyKey` cho toàn bộ luồng gọi món từ phía Khách (QR Order) để tránh lỗi do mạng lag/bấm đúp.

## 🔜 Kế hoạch tiếp theo
- Triển khai Phase 2: Quản lý Kho (Inventory) và In phiếu tự động qua ESC/POS.
- Tối ưu UI/UX cho tablet của nhân viên (Staff UX "Một chạm").
