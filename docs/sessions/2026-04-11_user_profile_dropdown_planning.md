# Báo Cáo Kế Hoạch: Trung Tâm Cá Nhân & Trải Nghiệm Màn Hình Chính (User Profile Dropdown)
*Cập nhật lần 2: Tối ưu hiển thị theo Ngữ cảnh Dữ liệu (Context-Aware UI).*

---

## 1. ĐÁNH GIÁ ĐA LĂNG KÍNH (@Role-Playing Report)

### 🧑‍💻 @Frontend_UX (Chuyên gia Trải nghiệm Người dùng)
- **Tình trạng:** Khách hàng đã quen thuộc với mô hình "Global Navigation". Ở mọi trang phụ, góc phải màn hình LUÔN CẦN có Avatar của người dùng.
- **Lỗi Tư Duy Cũ:** Ban đầu tính hiển thị "Chủ Quán" hay "Phục vụ" ngay cạnh Avatar. Tuy nhiên, nếu user mới đăng nhập và đang ở màn hình Homepage (chưa chọn dữ liệu của quán nào), thì họ CHƯA CÓ vai trò gì cả! 
- **Đề xuất Mới (Context-Aware UI):**
  - **Ngoài trang chủ (No Shop Selected):** Dropdown chỉ hiển thị **[Avatar] + [Tên Đầy Đủ]** nguyên bản. Không có huy hiệu Vai trò, không có Tiến độ KPI ca làm.
  - **Bên trong Dashboard Quán (Shop Selected):** Dropdown sẽ Render thêm dòng UI phụ: Hiện rõ **Vai Trò của người đó ở quán này**, và nếu là tính năng Phân Ca, hiển thị thêm Thanh Tiến độ (KPI Ca làm vòng tuần).

### 👨‍💼 @Business (Chủ dự án / Chủ Quán)
- **Requirement:** Ở Dropdown này, mục Đổi quán **"Chuyển Quán (Switch Shop)"** là cực kỳ lý tưởng để một ông chủ 5 cơ sở thao tác chạy qua lại kiểm kê.

### 👩‍🍳 @Staff (Nhân Viên)
- **Requirement:** Nút **"Đăng xuất"** phải thật to để hết ca khóa máy nhanh chóng cho ca sau dùng Chung thiết bị tính tiền (Tablet trạm).

---

## 2. KẾ HOẠCH TÍNH NĂNG CHI TIẾT (PRODUCT ROADMAP)

Dựa trên phân tích, UI của *User Icon Dropdown* sẽ thay đổi linh hoạt:

**Khối 1: Header Tùy Biến (Dynamic Header)**
- Luôn hiển thị: Hình Avatar + Tên Đầy Đủ.
- *Nếu đang đứng trong 1 Quán cụ thể:* Hiển thị thêm Vai Trò (Ví dụ: `Nhân viên Bếp`) và Tiến độ KPI Ca làm.
- *Nếu đứng ở sảnh chung (Landing):* Chỉ là người dùng bình thường.

**Khối 2: Lối tắt Hệ thống Shop (Shop Context)**
- [ 🏢 Chuyển Cơ Sở (Switch Shop) ] -> Bật Modal chọn quán khác.
- [ 📝 Lịch Làm Việc Của Tôi ] -> Dẫn tới bảng Shift Management.

**Khối 3: Cài đặt Cá nhân qua Cửa Sổ (Modal Settings)**
- [ 📸 Đổi Hình Đại Diện ] -> Bật cửa sổ Upload ảnh cực nhanh.
- [ 🔑 Đổi Mật Khẩu ] -> Bật cửa sổ nhập MK, không tải trang mới làm mất Context.

**Khối 4: Thoát Lệnh (Exit)**
- [ 🚪 Đăng Xuất ] -> Khóa máy an toàn.

---

## 🎯 QUYẾT ĐỊNH CUỐI CÙNG TỪ PRODUCT OWNER
*(Đã cập nhật theo Rule số 6)*

- **Đồng thuận tuyệt đối:** Sử dụng cơ chế Modal (Bật Cửa Sổ) rọi bóng lên trên trang hện tại khi bấm chức năng "Đổi mật khẩu" hoặc "Đổi Avatar" để không gãy mạch trải nghiệm (Không điều hướng sang trang khác). Cùng với đó cung cấp nút Switch Shop xịn xò.
- **Sửa sai hiển thị thông tin:** Nhận định cực kỳ sắc bén từ User rằng *"Đang ở Landing Page thì làm gì có Vai trò với Quota Ca Làm"*. Thiết kế đã được sửa đổi thành "Hiển thị tĩnh" (Chỉ Avatar + Tên) ở màn hình ngoài, và biến thành "Hiển thị Động" (Có KPI, Roles) khi User đã chui vào vận hành 1 Quán cụ thể.

*(Tiến độ: Đã hoàn tất sửa đổi Bản Thiết Kế trên giấy. Mọi môi trường Code vẫn giữ nguyên gốc, KHÔNG BỊ CAN THIỆP).*
