# DESIGN.md - ZôOS · "Ember Bistro"

Hệ thống thiết kế warm-dark cho một ứng dụng F&B/POS: ấm áp, kích thích vị giác,
cao cấp nhưng không lạnh lẽo. Nguồn token thực thi: [src/ShopManagement.Web/wwwroot/css/site.css](src/ShopManagement.Web/wwwroot/css/site.css)
(CSS custom properties thuần, render server-side bằng ASP.NET Core MVC/CSHTML — không có build step JS).

## 1. Visual Theme & Atmosphere
- **Mood**: Ấm, mời gọi, tập trung vào món ăn.
- **Atmosphere**: Nền espresso tối + lưới gradient ấm (ember/amber) + lớp film-grain mờ.
- **Philosophy**: Viền tinh tế, glow ấm thay vì bóng lạnh. Whitespace có chủ đích.

## 2. Color Palette
| Màu | Giá trị Hex | Token | Vai trò |
| --- | --- | --- | --- |
| Void (espresso) | `#0c0a09` | `--color-void` | Nền chính |
| Slate Deep | `#18130f` | `--color-slate-deep` | Nền card/container |
| Ember (terracotta) | `#c2410c` | `--color-ember` / `bg-ember` | Màu chính, nút primary |
| Ember Bright | `#e2562a` | `--color-ember-bright` | Hover/nhấn |
| Saffron Amber | `#f4b541` | `--color-amber` / `text-amber` | Glow, heading, icon |
| Clay | `#9a3412` | `--color-clay` / `text-clay` | Accent đậm |
| Emerald | `#2fb97a` | `--color-brand-emerald` | Success / tiền / "available" |
| Warm White | `#f6f1ea` | — | Văn bản chính |
| Warm Gray | `#9b938b` | `--color-brand-gray` | Văn bản phụ, icon mờ |

> ⚠️ Không dùng lại theme tím/lạnh cũ (`#7c3aed`, `rgba(94,106,210)`).

## 3. Typography
- **Display (h1–h4)**: `Fraunces` (serif có cá tính) qua `--font-display` / class `font-display`.
- **Body**: `Plus Jakarta Sans`.
- **Size Scale**: Title 32px · Header 18px · Body 14px · Small 12px · Micro-label 10px (uppercase, tracking rộng).

## 4. Component Stylings
### Buttons (`.btn-primary` / `.btn-secondary`)
- **Primary**: gradient ember `#d9531a → #c2410c`, chữ trắng, bo `rounded-xl`, glow ember, `active:scale-95`.
- **Secondary**: nền trong suốt, viền `border-normal`, hover sáng viền amber.
### Cards (`.linear-card`)
- Nền `slate-deep/50`, viền `border-subtle`, `backdrop-blur`, bo `rounded-2xl`; hover lên glow amber.
### Modals (`.modal-backdrop`)
- Backdrop `bg-void/80` + `backdrop-blur-xl`.

## 5. Layout Principles
- **Grid**: 12 cột chuẩn.
- **Spacing**: Hệ tọa độ 4px (4, 8, 12, 16, 24, 32...).
- **Whitespace**: Sử dụng padding rộng cho các container chính để tạo cảm giác cao cấp.

## 6. Depth & Elevation
- **Lớp 0**: Void Black (Nền).
- **Lớp 1**: Slate Deep (Cards, Sidebars).
- **Lớp 2**: Popovers, Tooltips (Đổ bóng rộng).

---

## 7. Micro-interactions & Motion (Spring Physics + Snappy Feedback)
Hệ thống chuyển động phải tạo cảm giác phản hồi tức thì, mượt mà và cao cấp (Snappy & Fluid).

### Transition Easing
- **Standard Transition** (hover, state change): `all 0.2s cubic-bezier(0.4, 0, 0.2, 1)` — snappy.
- **Slow Transition** (layout shift, expand/collapse): `all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)` — easeOutBack.
- **Skip transitions** cho các state instant (e.g., confirm dialog appearing, tab switch).

### Button & Interactive Elements
- **Hover**: `filter: brightness(1.1)` (no color shift, just brightness).
- **Active (Click)**: `transform: scale(0.97)` — tactile press-down feel.
- **Disabled**: `opacity: 0.5; pointer-events: none; cursor: not-allowed`.
- **Focus**: Sử dụng outline `2px solid var(--color-amber)` cho keyboard navigation.

### Modal & Drawer Animations
- **Modal Enter**: Fade-in backdrop (0.2s), Content slide-up + scale (0.3s, easeOutBack from bottom).
- **Modal Exit**: Reverse animation (0.15s), backdrop fade-out faster để cảm giác exit nhanh.
- **Drawer (Offcanvas)**: Slide-in từ left/right (0.25s), backdrop fade (0.25s).

### List & Table Item Transitions
- **Row Hover**: `background: rgba(255,255,255,0.03)`, border glow nhẹ 0.15s.
- **Row Addition**: Fade-in + slight slide-down (0.2s) — skeleton loader trước rồi content fade-in.
- **Row Removal**: Fade-out + collapse height (0.15s) — nhanh để avoid visual jank.
- **Selection Highlight**: Glow amber border (0.15s), không làm thay hình nền.

### Notification & Toast Animations
- **Toast Enter**: Slide-in từ bottom-right (0.25s, easeOutBack) + stagger 0.1s nếu có multiple.
- **Toast Exit**: Fade-out + slide-out (0.15s), auto-dismiss sau 4s default.
- **Progress Bar** (auto-dismiss): Linear animation `width: 100% → 0%` qua 4s.

### Real-time Status Updates (SignalR)
- **Status Change Badge**: Color transition (0.2s) + pulse glow effect (1s loop, `animation: pulse 1s infinite`).
- **Order Ready Alert**: Flash amber glow 2x (0.1s on/off × 2), rồi return to normal — captures attention.
- **Spinner (Loading)**: `@keyframes spin: 0% { transform: rotate(0deg) } 100% { ... 360deg }; animation: spin 0.6s linear infinite`.

## 8. Real-time Status Indicators (SignalR Integration)
Vì dự án dùng SignalR cho real-time updates (ShopHub), các thành phần status phải phản ánh nhanh:

### Order Status Badge
- **Pending** (`badge-pending`): Amber glow, animated border pulse `border: 2px solid rgba(244,181,65,1); animation: pulse-border 1.5s ease-in-out infinite`.
- **Confirmed** (`badge-available` + glow): Emerald tĩnh, no pulse.
- **Ready** (`badge-occupied`): Ember bright, flash animation 2 lần (0.1s on/off).
- **Completed**: Clay/gray, no animation.

### Table Status Update
- **Row status change**: Background flash `rgba(244,181,65,0.15)` → normal (0.6s, ease-out) — không startle người dùng.
- **Real-time sync**: Nếu dữ liệu change từ user khác, update mà không reset scroll position.

### Notification Badge (Sidebar/Topbar)
- **Unread count**: Red badge `background: #e11d48; color: white` with subtle pulse `scale(1, 1.1, 1)` qua 1.5s loop.
- **Dismissal**: Click badge → fade-out + remove từ DOM (0.15s).

## 9. Form Behaviors & Validation (Progressive Disclosure)
- **Focus State**: Viền `2px solid var(--color-amber)` + halo shadow `box-shadow: 0 0 0 3px rgba(244,181,65,0.18)`.
- **Inline Validation**: 
  - Error message xuất hiện **instantly** (không fade-in) dưới input, màu rose `#fb7185`.
  - Success checkmark icon (✓) appear inside input right side, color emerald (0.15s fade-in).
  - Suggestion/hint text: color `var(--color-warm-gray)`, font-size 12px, dưới label.
- **Input Groups**: Nhóm các field liên quan bằng container với border-left `3px solid var(--color-amber)`.
- **Disabled State**: `opacity: 0.5; background: rgba(0,0,0,0.15); cursor: not-allowed`.
- **Empty Placeholder**: Color `rgba(155,147,139,0.5)`, italic nếu cần.

## 10. Data Visualization & Dashboard Components
Vì ZôOS quản lý đơn hàng, bàn, inventory, cần basic chart components:

### Chart Types (CSS-only, no external library)
1. **Simple Bar Chart** (Orders/Revenue): Dùng `<div>` với `height: calc(var(--value) * 1px)`, hover show tooltip.
2. **Donut/Pie** (Table status): SVG `<circle>` + `stroke-dasharray` + `stroke-dashoffset` animation.
3. **Sparkline** (Trend): SVG polyline trong card header, color amber.

### Metric Card
```html
<div class="metric-card">
  <div class="metric-label">Revenue (Today)</div>
  <div class="metric-value">$1,250.50</div>
  <div class="metric-trend">↑ 12% vs yesterday</div>
  <div class="metric-chart"><!-- sparkline SVG --></div>
</div>
```
- **Value**: Font display `Fraunces`, size 24px–32px, color white.
- **Trend**: Emerald nếu UP, rose nếu DOWN, animated (fade-in 0.3s khi data refresh).
- **Chart area**: Max-height 40px, subtle glow on hover.

## 11. Drawer / Offcanvas Pattern
Dùng cho:
- Mobile: Sidebar navigation (khi screen < 768px).
- Supplementary panels: Filters, settings, order details sidebar.

### Drawer Structure
```html
<div class="drawer drawer-left" id="drawer">
  <div class="drawer-header">
    <h3>Navigation</h3>
    <button class="drawer-close">&times;</button>
  </div>
  <div class="drawer-body"><!-- content --></div>
</div>
<div class="drawer-backdrop"></div>
```
- **Width**: 280px (desktop sidebar width).
- **Animation**: Slide-in từ left/right (0.25s), backdrop fade (0.25s).
- **Dismiss**: Click backdrop or close button.
- **Keyboard**: Esc key to close (implement in JS).

## 12. Toast / Notification System
Cho success/error/info messages từ form submit, real-time events:

### Toast Types
- **Success** (`toast-success`): Emerald background, icon ✓.
- **Error** (`toast-error`): Rose/red background, icon ✗.
- **Info** (`toast-info`): Amber background, icon ℹ.
- **Warning** (`toast-warning`): Amber dark, icon ⚠.

### Toast Structure
```html
<div class="toast toast-success" role="alert">
  <div class="toast-icon">✓</div>
  <div class="toast-content">Order #123 confirmed</div>
  <button class="toast-close">&times;</button>
</div>
```
- **Position**: Fixed top-right, stack vertically (gap 8px).
- **Width**: 320px max, padding 12px 16px.
- **Auto-dismiss**: 4s default (customizable per toast).
- **Entrance**: Slide-in từ right + fade (0.25s, easeOutBack).
- **Exit**: Fade-out + slide-out (0.15s, ease-in).

## 13. Loading & Skeleton States
Dùng thay vì spinner để progressive display:

### Skeleton Loader
```html
<div class="skeleton skeleton-card">
  <div class="skeleton-line" style="width: 60%;"></div>
  <div class="skeleton-line" style="width: 100%; margin-top: 8px;"></div>
  <div class="skeleton-line" style="width: 80%; margin-top: 8px;"></div>
</div>
```
- **Shimmer Effect**: `background: linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05), rgba(255,255,255,0.1))`.
- **Animation**: `background-position: -1000px 0` → `1000px 0` qua 2s infinite.
- **Radius**: Match actual component (rounded-16 for cards, rounded-10 for table rows).

### Full Page Loading
- Spinner ở center (khi initial page load) OR skeleton grid (khi loading data).
- Backdrop `bg-void/40` để hint user không interact với page.

## 14. Empty State Patterns
Khi không có dữ liệu:

### Empty State Card
```html
<div class="empty-state">
  <div class="empty-icon"><!-- Lucide icon 48px --></div>
  <h3 class="empty-title">No orders yet</h3>
  <p class="empty-description">Create your first order to get started</p>
  <button class="btn-primary">New Order</button>
</div>
```
- **Icon**: 48px, color `var(--color-warm-gray)`, center.
- **Title**: 16px, white, margin-top 16px.
- **Description**: 14px, warm gray, margin-top 8px.
- **CTA Button**: Centered, margin-top 16px.
- **Container**: Padding 40px, text-center, min-height 240px, flex center.

## 15. Responsive Design & Mobile Adaptation
Dự án dùng server-render, không có SPA, nên responsive design bằng CSS media queries + server-side View logic:

### Breakpoints
- **xs**: 0px (default).
- **sm**: 576px (small phones).
- **md**: 768px (tablets, sidebar collapse).
- **lg**: 992px (desktop, full layout).
- **xl**: 1200px (large desktop).

### Mobile Sidebar (< 768px)
- Default: Hidden (offscreen left).
- Toggle button (hamburger ☰) ở topbar.
- Drawer overlay backdrop.
- Full-width when open.

### Touch Targets
- **Button**: Min 44×44px (WCAG).
- **Input**: Min 44px height.
- **List item**: Min 48px height, padding 12px vertical.

### Spacing Mobile-first
- **Desktop**: 4px base unit (4, 8, 12, 16, 20, 24, 32).
- **Mobile**: 4px unit but reduce padding on containers (e.g., padding: 16px → 12px on < 768px).

## 16. Accessibility (A11y) — Enhanced
- **Color Contrast**: Ensure 4.5:1 for text (WCAG AA standard). Ember + white = OK. Warm-gray + void = 6:1+ OK.
- **Focus Visible**: Always show focus indicator for keyboard users (`focus-visible` pseudo-class, outline or glow).
- **ARIA Labels**: Every icon-button has `aria-label`. Example: `<button aria-label="Close menu">×</button>`.
- **Semantic HTML**: Use `<button>`, `<form>`, `<label>`, `<nav>`, `<main>`, etc. (server-render in CSHTML).
- **Focus Trap**: Modal `<dialog>` auto-traps focus. Drawer should also manage focus.
- **Keyboard Shortcuts** (future):
  - `Cmd+K` / `Ctrl+K`: Command palette (search orders, tables, menu).
  - `Esc`: Close drawer, modal, dropdown.
  - `Tab`: Navigate focusable elements.
  - `Enter`: Submit form, select item.

---

## 17. Implementation Guide & CSS/HTML Patterns
Vì project dùng **plain CSS** (không Tailwind) + **ASP.NET Core MVC** (CSHTML views), các component được implement trực tiếp:

### File Organization
- **Color & Token Definition**: `/wwwroot/css/site.css` `:root` section.
- **Component Styles**: Sections trong `site.css` (cards, buttons, forms, etc.).
- **View Markup**: CSHTML files sử dụng semantic HTML + class names.
- **Utility Classes**: `row`, `col-*`, `mb-3`, `text-center`, `g-3` (spacing).

### Naming Convention (BEM-inspired)
- **Block**: `.linear-card`, `.app-shell`, `.metric-card`.
- **Modifier**: `.linear-card.hover`, `.btn-primary.disabled`, `.badge-available`.
- **Element**: `.drawer-header`, `.toast-icon`, `.form-label` (optional, được flatten nếu simple).

### CSS Variable Usage
```css
/* Use custom properties để dễ re-skin */
.metric-card {
  border-color: var(--border-subtle);
  background: rgba(24, 19, 15, 0.5);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Animation Keyframes (in site.css)
```css
@keyframes pulse-border {
  0%, 100% { border-color: rgba(244, 181, 65, 0.3); }
  50% { border-color: rgba(244, 181, 65, 1); }
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
```

### View Example (CSHTML)
```html
<!-- Order Card (linear-card pattern) -->
<div class="linear-card">
  <div class="d-flex justify-content-between align-items-start">
    <div>
      <h4 class="font-display">Order #@Model.OrderNumber</h4>
      <p class="text-muted">@Model.CreatedAt.ToString("HH:mm")</p>
    </div>
    <span class="badge badge-pending">@Model.Status</span>
  </div>
  
  <div style="margin-top: 16px; border-top: 1px solid var(--border-subtle); padding-top: 12px;">
    <!-- Order items -->
  </div>
  
  <div class="page-head" style="margin-top: 12px; margin-bottom: 0;">
    <button class="btn-primary">Complete</button>
    <button class="btn-secondary">Edit</button>
  </div>
</div>
```

### Real-time Update (SignalR Integration)
```html
<!-- Status badge with real-time binding -->
<span class="badge @Model.StatusClass" id="order-@Model.Id-status">
  @Model.Status
</span>

<script>
// In a shared SignalR hub listener
hubConnection.on('OrderStatusChanged', function(orderId, newStatus) {
  const badge = document.getElementById(`order-${orderId}-status`);
  if (badge) {
    badge.textContent = newStatus;
    badge.className = `badge badge-${newStatus.toLowerCase()}`;
    // Trigger animation (flash effect)
    badge.style.animation = 'none';
    setTimeout(() => { badge.style.animation = 'pulse-border 0.6s'; }, 10);
  }
});
</script>
```

---

## 18. Theme Overrides & Customization
Nếu client muốn override theme (khác màu, font, spacing):

### Via CSS Variables (Recommended)
```css
/* Override in custom stylesheet or <style> tag */
:root {
  --color-ember: #d97706; /* Change to orange */
  --color-amber: #fbbf24;
  --font-display: "Georgia", serif; /* Change to Georgia */
}
```

### Spacing Scale (4px base)
```
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
```
Dùng trong padding, margin, gap. Adjust via `:root` để scale toàn ứng dụng.

---

*Phiên bản 2.1 — Cập nhật: 2026-06-23*
*Bằng cách refine animations, thêm data visualization, real-time indicators, và mobile patterns, Ember Bistro giờ đây là một design system hoàn chỉnh cho F&B/POS application, ready cho production implementation.*
