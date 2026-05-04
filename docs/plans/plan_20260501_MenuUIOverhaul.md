# Plan: Menu UI Overhaul & Dashboard Integration

## 1. Mô tả bài toán (Problem Description)
Nâng cấp toàn diện UI/UX cho module `MenuManagement`. Chuyển đổi từ giao diện form thô cứng sang trải nghiệm hiện đại dùng Modal/Dialog, đồng thời tối ưu hóa Layout trong Dashboard.

## 2. Stack & Constraints
- **Frontend**: React 19, Tailwind CSS v4, Lucide React (Icons), Framer Motion (Animations).
- **Design Style**: Linear Inspired (Void Black, Slate Deep, Linear Purple Glow).
- **Constraints**: Phải giữ nguyên các logic API hiện có trong `menuManagementApi.ts`.

## 3. Các bước triển khai (Proposed Steps)

### Bước 1: Chuẩn bị Component UI mới
- [ ] Xây dựng component `Modal.tsx` dùng chung (Reusable) với hiệu ứng backdrop blur và animation mượt mả.
- [ ] Tạo các UI Atom mới: `LinearInput`, `LinearSelect`, `LinearButton` (nếu cần tinh chỉnh thêm từ `index.css`).

### Bước 2: Tái cấu trúc MenuManagement.tsx
- [ ] **Giao diện chính**: Chia layout thành 2 phần rõ rệt:
    - Trái: Danh sách Danh mục (Category List) với thiết kế gọn hơn, có icon trạng thái.
    - Phải: Danh sách Món ăn (Product List) của danh mục đang chọn.
- [ ] **Form Add/Edit**: Đưa toàn bộ form vào Modal. 
    - Nút "Add Category" nằm phía trên danh sách danh mục.
    - Nút "Add Product" nằm trong vùng nội dung món ăn.
- [ ] **Empty States**: Thêm minh họa/text đẹp khi chưa có danh mục hoặc món ăn.

### Bước 3: Tích hợp và Dọn dẹp
- [ ] Cập nhật `Dashboard.tsx` để đảm bảo `MenuManagement` chiếm trọn không gian nội dung một cách hợp lý.
- [ ] **Xóa link `/menu` công khai**: Theo yêu cầu, menu management phải ở trong Dashboard. Tôi sẽ xóa link tại Landing Page. Lưu ý: QR Order vẫn sẽ dùng link `/t/:tableId` nên `/menu` có thể xóa hoặc ẩn.

### Bước 4: Kiểm tra & Tinh chỉnh
- [ ] Kiểm tra Responsive trên Mobile (Mobile cần chuyển đổi pane mượt mà).
- [ ] Kiểm tra lỗi binding dữ liệu khi edit.

## 4. Xác minh (Verification)
- Mở Dashboard -> Menu.
- Tạo danh mục mới qua Modal -> Thành công.
- Tạo món ăn mới qua Modal -> Thành công.
- Giao diện đạt chuẩn "Wow" (màu sắc hài hòa, shadow mịn).

---
**Yêu cầu phản hồi:** Bạn có đồng ý với hướng chuyển Form sang Modal không? Và bạn có muốn giữ lại trang xem Menu công khai cho khách (QR Order vẫn cần nó) hay chỉ xóa link ở Landing Page?
