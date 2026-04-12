# Mục tiêu Dự án v2: ZôOS (Hệ thống Quản lý Quán nhậu Tự động hóa)

Ngày cập nhật: (Hiện tại)
Chủ đề: Chốt hạ mục tiêu cốt lõi sau các vòng thảo luận BMAD (Version 2)

---

## 1. Định vị Sản phẩm (Product Vision)
ZôOS không chỉ là phần mềm thu ngân thông thường. Định vị của ZôOS là một **Hệ điều hành vận hành quán nhậu tự động**, tập trung cắt giảm tối đa chi phí nhân sự chạy bàn thông qua công nghệ tự phục vụ (Self-Order) và máy học (Rule-based Auto-Approve).

## 2. Mục tiêu Cốt lõi (Core Business Goals)
- **Giảm 50% nhân sự chạy bàn**: Hướng khách hàng chủ động chạm QR để gọi món, thay vì vẫy tay gọi nhân viên.
- **Tăng Tốc độ Vòng quay bàn (Table Turnover)**: Không bắt khách phải chờ đợi. Lệnh Order bay thẳng vào máy in khu Bếp/Bar trong chưa tới 1 giây nhờ WebSockets (SignalR).
- **Chống Thất thoát Tuyệt đối**: Moi luồng giao dịch đều đi qua Audit Logging. Thu ngân không thể xóa món nắp tay nếu không có Role Quản lý cấp cao.
- **Hoạt động Khắc nghiệt**: Phần mềm chịu được tình huống mạng 4G/Wifi chập chờn (Offline-First, PWA) và thao tác chạm vuốt bằng tay dính mỡ (Finger-fat UI).

## 3. Các Tính năng Trụ cột (Pillar Features - Chốt)

### Trụ cột 1: QR Self-Order Nâng cao (Vũ khí chính)
- Khách tự quét QR tại bàn để chọn món.
- KHÔNG yêu cầu tải App, KHÔNG yêu cầu nhập PIN rườm rà.
- **Luồng Rule Engine Xanh/Đỏ**: 
  - Khách order dưới 1 Triệu -> Bếp nhận và in ngay lập tức.
  - Khách order số lượng khổng lồ -> Lệnh bị treo (Red Alert), rung điện thoại Quản lý ra xác nhận. Tránh rủi ro bị phá hoại.

### Trụ cột 2: KDS (Kitchen Display System) & Auto-Print
- Giao diện dạng Thẻ (Cards) trên màn hình Bếp để đầu bếp vuốt (Swipe) khi làm xong món.
- Kết nối trực tiếp máy in nhiệt ESC/POS (LAN/Bluetooth).

### Trụ cột 3: Kiến trúc Vững chắc (Clean Architecture)
- .NET 8 WebAPI, SQL Server (Sẵn sàng mở rộng Multi-tenant cho chuỗi 100 quán).
- JWT Authentication, Fine-grained RBAC (Phân quyền đến từng nút bấm Mở bàn, Xóa món, In Bill).
- Tính nguyên vẹn IDEMPOTENCY: Chống lỗi khách hàng bấm thanh toán/gọi món 2 lần liên tục gây trừ tiền đúp.

---
## Lịch sử Quyết định (Decision Log)
1. Quyết định (v2): *Bỏ yêu cầu khách nhập mã PIN khi quét QR để tối ưu trải nghiệm người dùng. Thay bằng Rule Tự động lọc hóa đơn bất thường.* 
2. Tên dự án: Đổi từ dự án vô danh / BMAD sang định danh chính thức: **ZôOS**.
3. Phương pháp phát triển: BMAD Method (Băm nhỏ User Story và phân vai 15 Agents).
