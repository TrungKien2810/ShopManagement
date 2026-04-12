# Sổ tay Kỹ thuật Backend & API (Backend Playbook)

Dành cho đội ngũ `@Backend`, `@Architect`, `@Security` và `@DevOps`. Đây là xương sống chịu tải của toàn bộ hệ thống quán nhậu chuỗi.

## 1. Tính Toàn năng & Kháng Rủi ro (Idempotency & Resilience)

Thu ngân thường có thói quen "Bấm đúp" (Double-click) liên tục vào nút "Thanh toán" nếu mạng hơi chậm.
- **Idempotency Keys**: Mọi API liên quan đến thay đổi trạng thái (Ghi nhận thanh toán, Đặt món) bắt buộc phải có `Idempotency-Key` trên Header. Nếu Backend nhận được 2 Request giống hệt key này trong vòng 5 giây, chỉ Request đầu tiên được xử lý, Request thứ 2 trả về kết quả của Request 1. (Chống việc trừ tiền khách 2 lần).
- **Rate Limiting**: Giới hạn số lượng Request API từ 1 máy khách để chống DDoS hoặc app bị lỗi vòng lặp vô hạn (Infinite Loop).

## 2. Cơ chế Đồng bộ Dữ liệu Thời gian thực (Real-time Sync)

- **Redis Backplane**: Nếu hệ thống scale lên 3 con Server WebAPI, lệnh "Có món mới" từ Server 1 phải được Redis bắn sang Server 2 và 3 để tất cả nhân viên (dù kết nối vào Server nào) cũng thấy món ăn đó nháy lên màn hình.
- **Event-Driven Architecture**: Bếp bấm "Hoàn thành món" -> Bắn Event `FoodReadyEvent` -> Service gửi tin nhắn Zalo/Push App cho khách hàng tự động, đồng thời máy in ở quầy thu ngân in phiếu ra món. Các logic này phải chạy ngầm (Background Task / Hangfire) để không làm chậm Request API.

## 3. Bảo mật & Authorization (Security)

- **Fine-Grained RBAC**: Tránh việc chỉ có role `Admin` và `Staff`. Cần chia nhỏ quyền (Claims/Permissions) rõ ràng: `Permissions.Orders.Create`, `Permissions.Orders.Delete`, `Permissions.Payments.Refund`.
- Một nhân viên phục vụ có quyền `Create Order` nhưng tuyệt đối không có quyền `Delete Order`. Quyền `Delete` (Hủy món) cần quẹt thẻ thẻ từ/mật mã của Quản lý tầng (`Manager` role).

## 4. Audit Logs (Dấu vết Hệ thống)

Trong F&B, việc mất đồ, hao hụt kho hoặc bill thu tiền bị sai xảy ra như cơm bữa.
- Hệ thống bắt buộc phải **Soft Delete** (IsDeleted = true) đối với Hóa đơn và Món ăn. TUYỆT ĐỐI không dùng lệnh `DbSet.Remove()` thực sự trên DB để tránh mất dấu vết.
- Bảng `AuditLogs` riêng lẻ (hoặc dùng thư viện EntityFrameworkCore.AuditTrail) để ghi lại: `"Lúc 19:40, NV Nguyễn Văn A (ID: 123) đã sửa giá bill HĐ-99 từ 500k xuống 200k"`.
