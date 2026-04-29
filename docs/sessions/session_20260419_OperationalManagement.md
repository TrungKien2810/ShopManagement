# Cập nhật và Lên Kế hoạch: Tính năng Vận hành Thực chiến (Tạo Bàn, Khu Vực, Mời Nhân Sự)
Date: 2026-04-19

## Bối cảnh và Rà soát (Context & Assessment)
- Lỗi UX ở `EmergencySettingsModal` (bị giam z-index) đã được giải quyết triệt để bằng React Portal (`createPortal`) để nâng cấp thành phần này lên Layer trên cùng của DOM.
- Người dùng yêu cầu tạo Bản thiết kế chi tiết (Implementation Plan) cho các chức năng mở rộng tính năng vận hành: Mời nhân viên, Tạo Bàn, Tạo Khu vực, nhưng tuyệt đối không viết code logic ngay lúc này.

## Kế hoạch Triển khai (Implementation Plan)

Đội ngũ Agent (`@Architect`, `@Frontend Specialist`) đề xuất các bước triển khai sau đây với nguyên tắc *Awesome Design* làm trọng tâm:

### 1. Quản lý Không gian (Space Management: Zones & Tables)
#### Ý tưởng UI (Awesome Design)
- **Tạo Khu vực (Zones)**: Sử dụng một Pop-over Modal (`AddZoneModal`) thông qua React Portal (tránh lỗi z-index đã biết). Modal tối màu với đường viền mờ ảo, nhập tên khu vực và icon đặc trưng.
- **Tạo Bàn (Tables)**: Bổ sung nút "Tạo Bàn Mới" có hiệu ứng `framer-motion` tại trang Dashboard/Map. 
  - **Dữ liệu**: Tên bàn, Sức chứa, Dropdown vùng khu vực (Kéo từ bảng Zones).

#### Tương tác Hệ thống (API & State)
- Chỉnh sửa/Mở rộng Controller `TableController` hoặc tạo mới `ZoneController`.
- Áp dụng SignalR Broadcaster `tableApi.create()` để khi thêm bàn mới, bản đồ trên tất cả máy truy cập trong shop đều cập nhật Real-time.

### 2. Mời Nhân Viên (Staff Invitations)
#### Ý tưởng UI (Awesome Design)
- Tạo Tab `Staffs` trong Dashboard.
- Nhấn "Thêm thành viên" sẽ mở Modal `InviteStaffModal`.
- **Thẩm mỹ**: Input Field `bg-black/40`, chọn phân quyền qua các thẻ màu sắc:
  - Manager (Linear Purple)
  - Staff (Emerald Green)
  - Chef (Bright Orange)
  
#### Tương tác Hệ thống (API & State)
- Flow API sẽ gửi Endpoint `/api/shop/{id}/invite` hoặc tương tự để gửi lời mời hoặc add trực tiếp Member vào Shop (Thông qua logic đa người thuê).
- Đẩy Toast Notification ngay góc màn hình phản hồi nhanh theo chuẩn PWA.

## Quyết định cuối cùng (Final Decision)
- Kế hoạch đã được phác thảo và cập nhật vào `MASTER_ROADMAP.md` (Mục 3, Giai đoạn 2).
- Chờ sự đồng ý (Approval) của người dùng để bắt đầu giai đoạn Code (Thi công).
