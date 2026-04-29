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
*Bản thiết kế này được tạo ra dựa trên cảm hứng từ Linear.app để tối ưu hóa AI Generation.*
