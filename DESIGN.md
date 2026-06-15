# DESIGN.md - ZôOS (Linear Inspired)

Hệ thống thiết kế cho ZôOS dựa trên phong cách Linear: Tối giản, độ chính xác cao và trải nghiệm cao cấp.

## 1. Visual Theme & Atmosphere
- **Mood**: Chuyên nghiệp, tập trung, tinh tế.
- **Density**: Chặt chẽ nhưng thoáng đãng, sử dụng khoảng trắng (whitespace) một cách có mục đích.
- **Philosophy**: "Less is more". Mọi thành phần đều có viền sắc sảo và đổ bóng nhẹ nhàng.

## 2. Color Palette
| Màu | Giá trị Hex | Vai trò |
| --- | --- | --- |
| Void Black | `#000212` | Nền chính trang web |
| Slate Deep | `#08090a` | Nền các container/card |
| Linear Purple | `#5e6ad2` | Màu nhấn hành chính, nút chính |
| Pure White | `#f7f8f8` | Văn bản chính |
| Ghost Gray | `#8a8f98` | Văn bản phụ, icon không hoạt động |
| Border Translucent | `rgba(255, 255, 255, 0.08)` | Viền các thành phần |

## 3. Typography
- **Primary Font**: `Inter`, `-apple-system`, `sans-serif`.
- **Weights**: 
  - Thường (Regular): 400
  - Đậm vừa (Medium): 500
  - Rất đậm (Bold/Black): 700+
- **Size Scale**: 
  - Title: 32px
  - Header: 18px (Bold)
  - Body: 14px
  - Small: 12px

## 4. Component Stylings
### Buttons
- **Primary**: Nền `Linear Purple`, chữ trắng, bo góc 8px, hiệu ứng hover sáng nhẹ.
- **Secondary**: Nền trong suốt, viền `Border Translucent`, chữ trắng.
### Cards
- Nền `Slate Deep`, viền `Border Translucent`, bo góc 12px. Đổ bóng mờ mịn.
### Modals
- Hiệu ứng kính mờ (Backdrop blur: 20px), nền `rgba(8, 9, 10, 0.8)`.

## 5. Layout Principles
- **Grid**: 12 cột chuẩn.
- **Spacing**: Hệ tọa độ 4px (4, 8, 12, 16, 24, 32...).
- **Whitespace**: Sử dụng padding rộng cho các container chính để tạo cảm giác cao cấp.

## 6. Depth & Elevation
- **Lớp 0**: Void Black (Nền).
- **Lớp 1**: Slate Deep (Cards, Sidebars).
- **Lớp 2**: Popovers, Tooltips (Đổ bóng rộng).

---

## 7. Micro-interactions & Motion (Linear Precision)
Hệ thống chuyển động phải tạo cảm giác phản hồi tức thì và mượt mà (Snappy & Fluid).
- **Hover Transitions**: Sử dụng `transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`.
- **Button Click**: Hiệu ứng `active: scale(0.98)` để tạo cảm giác cơ học.
- **Modal Animation**: Sử dụng `spring` physics từ Framer Motion (stiffness: 300, damping: 30). Pop-up nhẹ từ dưới lên.
- **List Item**: Hiệu ứng nhấn mạnh (highlight) tinh tế khi di chuột qua, thay đổi nhẹ opacity của viền.

## 8. Form Behaviors & Validation
- **Focus State**: Sử dụng viền `Linear Purple` rực rỡ kèm `ring-2 ring-purple-500/20`. Tuyệt đối không dùng outline mặc định.
- **Inline Validation**: Thông báo lỗi xuất hiện ngay dưới input với màu `Rose 400`, font size 12px, có hiệu ứng slide-down nhẹ.
- **Input Groups**: Nhóm các thông tin liên quan bằng các separator (vạch chia) 1px mờ.
- **Empty Fields**: Sử dụng placeholder màu `Ghost Gray` với độ mờ cao (opacity 0.4).

## 9. Empty & Loading States
- **Empty States**: Sử dụng icon `Lucide` kích thước lớn (48px) màu `Ghost Gray`, kèm tiêu đề ngắn gọn và một nút CTA (Call to Action) chính giữa màn hình.
- **Loading Skeleton**: Sử dụng hiệu ứng `shimmer` (quét sáng) cho các card và bảng dữ liệu thay vì Spinner truyền thống.
- **Progressive Loading**: Hiển thị khung layout trước, sau đó mới nạp dữ liệu.

## 10. Accessibility (A11y)
- **Contrast**: Đảm bảo độ tương phản văn bản tối thiểu 4.5:1 (chuẩn WCAG AA).
- **Focus Trap**: Đảm bảo người dùng sử dụng phím Tab không bị "thoát" khỏi Modal khi nó đang mở.
- **Aria Labels**: Cung cấp mô tả cho mọi icon-button không có nhãn chữ.
- **Keyboard Shortcuts**: Hướng tới tích hợp `Cmd+K` (hoặc `Ctrl+K`) để mở thanh lệnh nhanh.

## 11. Responsive Design Strategy
- **Adaptive Sidebar**: Sidebar tự động thu gọn thành Icon trên Tablet và ẩn hoàn toàn trên Mobile (sử dụng Hamburger menu).
- **Mobile First Spacing**: Trên di động, giảm khoảng cách (padding/gap) từ hệ 8px xuống 4px để tối ưu không gian hiển thị.
- **Touch Targets**: Các phần tử tương tác trên Mobile phải có kích thước tối thiểu 44x44px.

---
*Bản thiết kế này được nâng cấp bởi Antigravity dựa trên bộ quy chuẩn UI-UX Pro Max & Frontend Design.*
