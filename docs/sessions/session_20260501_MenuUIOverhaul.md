# Session: Cải tổ Giao diện Quản lý Menu (2026-05-01)

## Bối cảnh
Người dùng yêu cầu nâng cấp giao diện quản lý Menu (Danh mục & Món ăn) trong Dashboard. Hiện tại UI cho việc thêm/sửa đang bị đánh giá là chưa đạt yêu cầu ("tệ"). Ngoài ra, cần làm rõ vị trí của Menu (chỉ nằm trong Dashboard quản trị, không để ở Landing Page).

## Mục tiêu
1.  **Chỉnh sửa UI/UX**: Chuyển các form thêm danh mục/món ăn từ hiển thị trực tiếp trên bề mặt sang các **Modal/Dialog** sang trọng (Linear style).
2.  **Cải thiện List View**: Hiển thị danh sách danh mục và món ăn gọn gàng hơn, có trạng thái rõ ràng (Active/Hidden).
3.  **Tái cấu trúc điều hướng**: Gỡ bỏ link Menu khỏi Landing Page. Đảm bảo `MenuManagement` tích hợp mượt mà trong `Dashboard.tsx`.
4.  **Tuân thủ Design System**: Sử dụng đúng các token màu `void`, `linear-purple` và các hiệu ứng `glow`.

## Thảo luận Giải pháp
- **Layout**: Sử dụng mẫu 2 cột (Sidebar danh mục - Main content món ăn) nhưng với thiết kế "borderless" và "soft elevation".
- **Interaction**: Khi nhấn "Add Category" hoặc "Add Product", một Modal sẽ hiện ra với backdrop mờ (backdrop-blur). Form trong modal sẽ có label tinh tế và input focus effect màu tím.
- **Reference**: Lấy cảm hứng từ `linear.app` (cách họ quản lý Issues/Projects) và `Claude` (sự sạch sẽ, font Inter).

---
*Link tới Implementation Plan:* [plan_20260501_MenuUIOverhaul.md](../plans/plan_20260501_MenuUIOverhaul.md)
