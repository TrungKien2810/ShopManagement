# Product Requirements Document (PRD) - Core MVP

**Dự án**: ZôOS (Hệ thống Quản lý Quán nhậu)
**Người lập (Vai trò)**: `@PO / @BA`
**Ngày tạo**: Theo lộ trình BMAD
**Trạng thái**: Draft / Chờ Duyệt (Pending User Approval)

---

## 1. Mục tiêu kinh doanh (Business Objectives)
- Xây dựng một MVP (Minimum Viable Product) có khả năng vận hành được 1 quán nhậu cơ bản.
- Giảm thiểu nhân sự chạy bàn bằng tính năng Cốt lõi: **Khách tự quét QR order tại bàn**.
- Giải quyết nút thắt cổ chai ở quầy Thu ngân và Bếp trong giờ cao điểm.

## 2. Phạm vi MVP (Scope)
Trong phiên bản V1 này, hệ thống sẽ tập trung vào 3 phân hệ chính:
1. **Quản lý Bàn (Table Management)**: Mở bàn, Đóng bàn, Quản lý trạng thái (Trống, Đang phục vụ).
2. **Menu Tự phục vụ (Self-Order Menu)**: Quét QR tĩnh bằng điện thoại, không cần đăng nhập, nhập mã xác thực (nếu cấu hình) và chọn món.
3. **Luồng In phiếu & Thanh toán**: Bếp nhận được phiếu in tự động. Thu ngân tính tiền In Bill cuối cùng.

_(Các tính năng như Loyalty, Khuyến mãi chéo, Quản lý Tồn kho sẽ được dời sang Phase 2 hoặc V2)._

## 3. Chân dung Người dùng (User Personas)
- **Thu ngân / Quản lý tầng**: Người thao tác trên iPad/PC ở quầy. Mở bàn đón khách, thu tiền khách về.
- **Khách hàng**: Người quét QR trên điện thoại cá nhân. Độ tuổi 18-50, có thể đang say xỉn, không muốn thao tác rườm rà.
- **Bếp trưởng / Bar trưởng**: Người nhận phiếu In từ máy in nhiệt ESC/POS. Chỉ cần nhìn Tên món, Số lượng và Bàn số mấy.

## 4. Luồng vận hành Cốt lõi (Core User Flow)

### 4.1. Luồng Mở Bàn (Nhân viên)
1. Khách vào quán trúng Bàn số 12.
2. Nhân viên chạy bàn / Thu ngân dùng Tablet chọn Bàn 12 -> Bấm `Mở bàn` (Open Table).
3. Hệ thống đổi `TableStatus` sang `InUse`. Sinh ra một Session JWT ẩn đính kèm vào mã QR dán tĩnh ở Bàn 12.

### 4.2. Luồng Order (Khách hàng)
1. Khách dùng Zalo/Camera quét mã QR dán trên mặt bàn. Điện thoại mở ra `ZôOS.vn/t/12`.
2. Giao diện (Web App) check thấy bàn đang `InUse` -> Gửi JWT Token -> Lên giao diện Menu món ăn (Dark Mode, Nút to).
3. Khách ấn dấu [+] để thêm 5 lon Bia Tiger và 1 Khô Mực nướng. Bấm **[Gọi Món]**.
4. Khách không cần nhập mã PIN hay đăng nhập gì cả.

### 4.3. Luồng Duyệt Tự Động (Rule Engine)
1. Hệ thống Backend (C# .NET) nhận API từ Khách. Check giá trị tổng đơn hoặc số lượng món.
2. **Luồng Xanh**: (Ví dụ 5 Tiger + 1 Mực = 300k, an toàn). Tự động ghi OrderItem xuống DB, ném lệnh ra máy in nhà Bếp.
3. **Luồng Đỏ**: Khách bấm bùm bùm 50 thùng Tiger (Bất thường). Lệnh bị đưa vào list `PendingApproval` (Cần Duyệt). iPad thu ngân rú còi báo hiệu để phục vụ chạy ra bàn 12 check bằng miệng.

## 5. Ràng buộc Tùy chỉnh (Non-Functional Requirements)
- Nhiệm vụ Backend phải hỗ trợ Idempotency Key để khách lỡ tay bấm chạm 2 lần nút Đặt món thì không tính tiền 2 lần.
- C# dùng kiểu `decimal(18,2)` và `MidpointRounding.AwayFromZero` cho toàn bộ tài chính.

---
**Tiếp theo**: PRD này sẽ được băm nhỏ thành các `Epics` và `Stories` ở thư mục `docs/stories/` để giao cho `@Developer` code.
