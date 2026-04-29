# Báo Cáo Kế Hoạch: Hệ Thống Quản Lý Cốt Lõi (Phân Khu, Bàn, Thực Đơn & QR)
*Phiên thảo luận ngày 18/04/2026 - Thiết lập nền tảng vận hành quán.*

---

## 1. ĐÁNH GIÁ ĐA LĂNG KÍNH (@Role-Playing Report)

### 🧑‍💻 @Frontend_UX (Chuyên gia Trải nghiệm Người dùng)
- **Tình trạng:** Hiện tại hệ thống "Table" đang bị đổ đống, chưa có sự phân chia logic.
- **Đề xuất:** 
  - Cần hệ thống **Phân khu (Area)**: Tầng 1, Tầng 2, Sân thượng... để nhân viên dễ tìm bàn.
  - **Mã QR:** Mỗi bàn cần một mã QR riêng. Khi quét, khách phải được dẫn trực tiếp vào Menu của quán ĐÃ CHỌN sẵn bàn đó. 
  - **UI Quản lý:** Phải có màn hình "Sơ đồ bàn" và màn hình "Quản lý thực đơn" trực quan (kéo thả hoặc upload ảnh món ăn nhanh).

### 👨‍💼 @Business (Chủ dự án / Chủ Quán)
- **Requirement:** 
  - Người tạo quán mặc định là **Chủ quán (Owner)**.
  - Có thể mời thêm nhân viên qua username/email và phân quyền (Staff/Manager).
  - Quản lý doanh thu theo từng khu vực để biết khu nào hiệu quả hơn.

### 👩‍🍳 @Staff (Nhân Viên)
- **Requirement:** 
  - Giao diện gọi món phải hiển thị đúng món của quán.
  - Trạng thái bàn (Trống/Đang dùng) phải cập nhật Real-time (SignalR).

---

## 2. KẾ HOẠCH TÍNH NĂNG CHI TIẾT (PRODUCT ROADMAP)

### Giai đoạn 1: Quản trị Phân khu & Bàn (Area & Table Management)
- **Cấu trúc dữ liệu:**
  - Thực thể `Area`: `Name`, `Description`, `ShopId`.
  - Thực thể `Table`: Cập nhật thêm `AreaId` (bắt buộc).
- **Tính năng:**
  - CRUD Phân khu.
  - Quản lý danh sách bàn theo từng khu vực.
  - **Mã QR:** Backend tạo nội dung mã QR chứa link: `https://zoos.vn/order/{shopId}/{tableId}`. Hỗ trợ xuất file ảnh để in ấn.

### Giai đoạn 2: Quản trị Thực đơn (Menu Management)
- **Tính năng:**
  - CRUD Danh mục món ăn (Category).
  - CRUD Món ăn (Product): Tên, Giá, Mô tả, Hình ảnh (Upload qua Cloudinary).
  - Trạng thái món: "Còn món" / "Hết món".

### Giai đoạn 3: Phân quyền & Nhân sự (Staff & RBAC)
- **Logic tự động:** Người tạo quán (Shop Creator) -> Auto assigned Role `Owner`.
- **Mời nhân viên:** Chức năng gửi lời mời thành viên tham gia quán qua `ShopController`.

---

## 3. CÁC THAY ĐỔI KỸ THUẬT DỰ KIẾN (TECHNICAL DESIGN)

### Backend:
- **Entities**: New `Area`, Update `Table`, `Product`, `Category`.
- **Services**: `AreaService`, `QrCodeService` (Sử dụng QRCoder).
- **Controllers**: `AreaController`, Update `TablesController` & `MenuController`.

### Frontend:
- **Pages**: `AreaManagement.tsx`, `MenuManagement.tsx`.
- **Components**: `TableCard`, `ProductForm`, `QrCodeDownloader`.

---

## 🎯 QUYẾT ĐỊNH CUỐI CÙNG TỪ PRODUCT OWNER
*(Đang chờ phê duyệt)*

> [!IMPORTANT]
> **Câu hỏi mở:**
> 1. Bạn muốn mã QR được tạo dưới dạng **ảnh PNG** trực tiếp từ Backend hay Frontend tự vẽ dựa trên URL? (Tôi đề xuất Backend tạo để đồng bộ in ấn).
> 2. Có cần giới hạn số lượng Bàn/Món cho các gói miễn phí ngay bây giờ không?

---
*(Tiến độ: Đã soạn thảo xong kế hoạch tại docs/sessions. CHƯA THỰC THI CODE).*
