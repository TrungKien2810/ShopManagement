# 🎨 Kế hoạch Đại tu Giao diện & Trải nghiệm (UI/UX Global Overhaul)

## 1. Tổng quan
Dựa trên yêu cầu của người dùng về việc hệ thống thiếu tính đồng bộ, lỗi Responsive trên Mobile/Tablet và nhiều trang bị trống trải, chúng tôi sẽ thực hiện một đợt nâng cấp toàn diện sử dụng bộ Skill **UI-UX Pro Max**.

**Mục tiêu:**
- Đồng bộ hóa nhận diện thương hiệu (Typography, Colors).
- Đảm bảo 100% các trang chính hoạt động hoàn hảo trên thiết bị di động.
- Xóa bỏ cảm giác "dang dở" của các trang trống bằng các mẫu Empty State cao cấp.

## 2. Thiết kế Hệ thống (Design System Tokens)
Sử dụng kết quả từ `ui-ux-pro-max` search:
- **Font:** Plus Jakarta Sans (SaaS focus).
- **Primary Color:** `#7C3AED` (Vibrant Purple).
- **Secondary Color:** `#A78BFA` (Action Orange).
- **Background:** Dark-deep mode (giữ sự ổn định của ZôOS).

## 3. Các bước thực hiện

### Bước 1: Cập nhật Global Styles (`index.css`)
- [ ] Nhúng font Plus Jakarta Sans.
- [ ] Định nghĩa lại bảng màu Tailwind config.
- [ ] Tạo các Utility classes cho: Glassmorphism, Premium Card, Responsive Container.

### Bước 2: Xây dựng Responsive Layout Engine
- [ ] Tạo `MainLayout.tsx`: Thành phần bọc toàn bộ App.
- [ ] Xử lý Mobile Sidebar: Tự động ẩn vào Hamburger Menu khi màn hình < 1024px.
- [ ] Xử lý Content Padding: Đảm bảo không bị dính sát mép trên điện thoại.

### Bước 3: Tối ưu hóa các trang trọng điểm (Priority Pages)
- [ ] **Landing Page:** Thiết kế lại Hero Section theo dạng Block-based, tối ưu hiển thị 1 cột trên Mobile.
- [ ] **Dashboard:** Chuyển đổi bảng dữ liệu sang dạng Card-list trên Mobile để tránh vỡ khung.
- [ ] **Login/Register:** Làm lại giao diện tối giản, tập trung vào Form input lớn, dễ chạm.

### Bước 4: Lấp đầy khoảng trống (Empty States)
- [ ] Tạo Component `EmptyState` dùng chung.
- [ ] Áp dụng vào `MenuPage.tsx` và các danh sách rỗng trong Dashboard.

## 4. Kiểm soát chất lượng (QA)
- Test trên các breakpoint: 375px (iPhone SE), 768px (iPad), 1440px (Desktop).
- Kiểm tra độ tương phản màu sắc (Accessibility).
