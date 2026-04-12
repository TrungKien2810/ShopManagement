# 🗺️ ZôOS Master Roadmap (Bản Đồ Trạng Thái Tính Năng)
*Sử dụng tài liệu này để xem tổng quan cái gì đã xong, cái gì đang Lên kế hoạch, và cái gì còn Thiếu.*

---

## 🎯 GIAI ĐOẠN 1: CORE MVP (Đã hoàn thiện Kỹ thuật cơ bản)
*Dành cho quản lý quán quy mô nhỏ & Khách order qua QR tĩnh.*

- [x] **Database Context:** Khởi tạo DB `.NET EF Core` và cấu trúc `AppDbContext`.
- [x] **Multi-Tenancy (Bảo mật SaaS):** Hệ thống Lõi nhận diện `ShopId` qua Auth Token để cô lập dữ liệu.
- [x] **Identity & Auth:** Đăng nhập, Đăng ký, Quản lý Token JWT.
- [x] **Quản lý Bàn (Table Management):** Khởi tạo sơ đồ bàn.
- [x] **Order SignalR (Real-time):** Đơn hàng từ Khách Order đập thẳng vào màn hình Thu ngân và Bếp qua SignalR.
- [x] **UI Frontend (React):** Base Component PWA, Menu Tự phục vụ cơ bản.

---

## 🚀 GIAI ĐOẠN 2: HRM & ĐIỀU HÀNH THUẬN TIỆN (Status: Đang Lập Kế Hoạch ⏳)
*Nâng cấp ZôOS thành công cụ bám sát đời sống mưu sinh của quán vỉa hè lẫn nhà hàng.*

### 1. Phân Ca & Quản lý kỷ luật nhân sự (Shift Management)
*Lịch sử ra quyết định: [Nhật ký lập kế hoạch](../sessions/2026-04-11_shift_management_planning.md)*
- [ ] ⏳ **Lõi Booking Slot:** Thiết kế Entity lưu Số khe hở làm việc (Shift Slot).
- [ ] ⏳ **Cấu hình (Toggle): Chế độ gán Ca:** Chế độ nhân viên tự Pick (Self-Pick) vs Quản lý gán cứng (Manual).
- [ ] ⏳ **Cấu hình (Toggle): Khóa sổ chấm công:** Chức năng bắt buộc Check-out cuối buổi (App Timeout Check-out).
- [ ] ⏳ **Chức Năng Bọt Lót:** (Cross Reports) Báo cáo sai sót chéo chặn nhân viên đùn đẩy trách nhiệm.

### 2. Trải nghiệm Cá nhân (User UX / User Context Dropdown)
*Lịch sử ra quyết định: [Nhật ký UX/UI Dropdown](../sessions/2026-04-11_user_profile_dropdown_planning.md)*
- [ ] ⏳ **Dynamic Profile Header:** UI Dropdown thông tin nhân sự chỉ hiện Vai trò khi ở chế độ "Truy cập trong Quán". Ở Landing page chỉ hiện chung chung.
- [ ] ⏳ **Màn hình Modal Cài Đặt Khẩn Cấp:** Đổi mật khẩu, Thay Avatar không bị nhảy Load Trang (Ngăn gãy dòng sự kiện).
- [ ] ⏳ **Multi-tenant Switcher:** Phím gạt chuyển Quán nhanh dành cho các Đại gia đa cơ sở.
- [ ] ⏳ **Logic Freemium Quota:** Check-out quá 5 Staff ở tài khoản Free sẽ block.

---

## 🏗️ GIAI ĐOẠN 3: KẾ TOÁN & KIỂM KÊ (Backlog - Chưa Lên Kế Hoạch ⬛)
*Chấm mốc chuẩn bị ý tưởng trong tương lai.*

- [ ] ⬛ **Z-Report (Chốt ca thu ngân - BẮT BUỘC):** Bản in tổng kết thu chi sau khi kết thúc ca (Tiền mặt vs Chuyển khoản).
- [ ] ⬛ **Kitchen Display System (KDS):** Màn hình cho Bếp gạch bỏ món đã nấu (Không cần dùng giấy).
- [ ] ⬛ **Kiểm Kho Nguyên Liệu (Inventory):** Nhập/Xuất kho hàng ngày. Tính định lượng tiêu hao.
- [ ] ⬛ **Báo Báo Doanh Thu (Analytics):** Biểu đồ ChartJS doanh thu hằng tháng.

---

*Ghi chú: Bất kể khi nào 1 file Kế hoạch `.md` mới sinh ra hoặc được chốt, Agent có trách nhiệm ghi danh tính năng đó vào bảng này.*
