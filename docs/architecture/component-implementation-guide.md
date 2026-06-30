# Ember Bistro — Component Implementation Guide

> **Bản cập nhật 2026-06-23**: Hướng dẫn chi tiết để implement các component mới được định nghĩa trong DESIGN.md v2.1

## 📚 Tóm tắt nhanh

Dự án ZôOS dùng **plain CSS** + **ASP.NET Core MVC** (server-render CSHTML). Không có build step, không Tailwind. 

### Files chính:
- `src/ShopManagement.Web/wwwroot/css/site.css` — Token, layout, component cơ bản
- `src/ShopManagement.Web/wwwroot/css/animations.css` — Keyframes & animation utilities (mới)
- `src/ShopManagement.Web/Views/` — CSHTML markup

---

## 🎨 Component Patterns

### 1. Status Badge with Real-time Pulse

**Khi nào dùng**: Order status, table occupancy, availability indicators

**Markup**:
```html
<!-- Pending order (with pulse animation) -->
<span class="badge badge-pending animate-pulse-border" 
      id="order-@Model.OrderId-badge">
  @Model.Status
</span>

<!-- Success status (static) -->
<span class="badge badge-available">
  Available
</span>

<!-- Alert/Flash state -->
<span class="badge badge-occupied animate-flash-twice">
  Order Ready
</span>
```

**CSS Classes**:
- `.badge-pending` — Amber background + border
- `.badge-available` — Emerald background + border
- `.badge-occupied` — Ember/orange background + border
- `.badge-cancelled` — Gray background + border
- `.animate-pulse-border` — Pulse animation 1.5s loop
- `.animate-flash-twice` — Flash 2× for alerts

**SignalR Integration** (JavaScript):
```javascript
hubConnection.on('OrderStatusChanged', function(orderId, newStatus) {
  const badge = document.getElementById(`order-${orderId}-badge`);
  if (badge) {
    // Update text & class
    badge.textContent = newStatus;
    badge.className = `badge badge-${newStatus.toLowerCase()}`;
    
    // Re-trigger animation if status is "pending"
    if (newStatus === 'Pending') {
      badge.classList.add('animate-pulse-border');
    } else {
      badge.classList.remove('animate-pulse-border');
    }
  }
});
```

---

### 2. Loading Skeleton (Data Grid)

**Khi nào dùng**: Thay thế spinner khi load table/card data — progressive enhancement.

**Markup**:
```html
<!-- Skeleton loader (show while data loading) -->
<div class="skeleton-card">
  <div class="skeleton-line" style="width: 60%;"></div>
  <div class="skeleton-line" style="width: 100%;"></div>
  <div class="skeleton-line" style="width: 80%;"></div>
</div>

<!-- Multiple skeleton rows -->
<div style="display: grid; gap: 12px;">
  <div class="skeleton-card"></div>
  <div class="skeleton-card"></div>
  <div class="skeleton-card"></div>
</div>
```

**CSS** (defined in `animations.css`):
- `.skeleton-card` — Container with padding, border, flex layout
- `.skeleton-line` — Individual line with shimmer animation
- `.animate-shimmer` — Keyframe animation (2s loop)

**React/Template Pattern**:
```html
@if (Model.IsLoading)
{
  <div class="skeleton-card"></div>
}
else
{
  <!-- Actual data here -->
}
```

---

### 3. Toast / Notification System

**Khi nào dùng**: Form submission success/error, real-time alerts, transient messages.

**Markup**:
```html
<!-- Success toast -->
<div class="toast toast-success animate-toast-enter" id="toast-order-created">
  <div class="toast-icon">✓</div>
  <div class="toast-content">Order #123 created successfully</div>
  <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
</div>

<!-- Error toast -->
<div class="toast toast-error animate-toast-enter" id="toast-error">
  <div class="toast-icon">✗</div>
  <div class="toast-content">Failed to create order. Please try again.</div>
  <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
</div>

<!-- Info toast (auto-dismiss after 4s) -->
<div class="toast toast-info animate-toast-enter auto-dismiss">
  <div class="toast-icon">ℹ</div>
  <div class="toast-content">New order from Table 5</div>
  <button class="toast-close">&times;</button>
</div>
```

**CSS Classes**:
- `.toast` — Base styles (fixed, top-right, 320px max-width)
- `.toast-success`, `.toast-error`, `.toast-info`, `.toast-warning` — Type variants
- `.animate-toast-enter` — Slide-in from right (0.25s)
- `.auto-dismiss` — Auto fade-out after 3.85s (total 4s)

**JavaScript Helper** (recommended):
```javascript
function showToast(message, type = 'info', duration = 4000) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type} animate-toast-enter`;
  toast.innerHTML = `
    <div class="toast-icon">${getIcon(type)}</div>
    <div class="toast-content">${message}</div>
    <button class="toast-close">&times;</button>
  `;
  document.body.appendChild(toast);
  
  toast.querySelector('.toast-close').onclick = () => toast.remove();
  
  if (duration > 0) {
    setTimeout(() => {
      toast.classList.remove('animate-toast-enter');
      toast.classList.add('animate-toast-exit');
      setTimeout(() => toast.remove(), 150);
    }, duration);
  }
}

function getIcon(type) {
  const icons = { success: '✓', error: '✗', info: 'ℹ', warning: '⚠' };
  return icons[type] || '';
}

// Usage: showToast('Order placed!', 'success');
```

---

### 4. Modal with Spring Animation

**Khi nào dùng**: Confirmation dialogs, forms, detail views.

**Markup**:
```html
<!-- Modal HTML structure -->
<div class="modal-backdrop" id="modal-backdrop" onclick="closeModal()"></div>
<div class="linear-card animate-modal-enter" style="
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  max-width: 480px;
  width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
">
  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
    <h2 class="font-display" style="margin: 0;">Confirm Action</h2>
    <button onclick="closeModal()" style="background: none; border: none; color: var(--color-warm-white); font-size: 24px; cursor: pointer;">&times;</button>
  </div>
  
  <p style="color: var(--color-warm-gray); margin: 16px 0;">Are you sure you want to complete this order?</p>
  
  <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
    <button class="btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn-primary" onclick="confirmAction()">Confirm</button>
  </div>
</div>

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 999;
    animation: fade-in 0.2s;
  }
</style>

<script>
  function closeModal() {
    const modal = document.querySelector('.animate-modal-enter');
    modal.classList.remove('animate-modal-enter');
    modal.classList.add('animate-modal-exit');
    document.querySelector('.modal-backdrop').style.animation = 'fade-out 0.15s forwards';
    setTimeout(() => {
      modal.remove();
      document.querySelector('.modal-backdrop').remove();
    }, 200);
  }
  
  function confirmAction() {
    // Submit form or trigger action
    closeModal();
  }
</script>
```

**CSS**:
- `.animate-modal-enter` — Slide-up + scale (0.3s, spring easing)
- `.animate-modal-exit` — Slide-down (0.15s, quick exit)
- `.modal-backdrop` — Fixed overlay with blur + fade animation

---

### 5. Drawer / Offcanvas (Mobile Navigation)

**Khi nào dùng**: Mobile sidebar (< 768px), supplementary filters/settings panel.

**Markup**:
```html
<!-- Drawer (hidden by default, shown via JS) -->
<div class="drawer drawer-left" id="sidebar-drawer" style="
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 280px;
  background: rgba(24, 19, 15, 0.95);
  backdrop-filter: blur(8px);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  animation: slide-in-left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
">
  <div style="padding: 16px; border-bottom: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center;">
    <h3 class="font-display" style="margin: 0;">Menu</h3>
    <button class="drawer-close" onclick="toggleDrawer()" style="background: none; border: none; color: var(--color-warm-white); font-size: 24px; cursor: pointer;">&times;</button>
  </div>
  
  <nav style="flex: 1; padding: 16px; overflow-y: auto;">
    <!-- Navigation links (same as sidebar nav) -->
    <a href="/orders" class="app-nav-link">Orders</a>
    <a href="/tables" class="app-nav-link active">Tables</a>
    <a href="/menu" class="app-nav-link">Menu</a>
  </nav>
</div>

<!-- Drawer backdrop -->
<div class="drawer-backdrop" id="drawer-backdrop" onclick="toggleDrawer()" style="
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  animation: fade-in 0.25s;
  display: none;
"></div>

<!-- Hamburger button (in topbar, mobile only) -->
<button class="hamburger-toggle" onclick="toggleDrawer()" style="
  display: none; /* shown via @media < 768px */
  background: none;
  border: none;
  color: var(--color-warm-white);
  font-size: 24px;
  cursor: pointer;
">
  ☰
</button>

<script>
  function toggleDrawer() {
    const drawer = document.getElementById('sidebar-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    const isOpen = backdrop.style.display !== 'none';
    
    if (isOpen) {
      // Close
      drawer.style.animation = 'slide-out-left 0.2s cubic-bezier(0.4, 0, 0.6, 1) forwards';
      backdrop.style.animation = 'fade-out 0.15s forwards';
      setTimeout(() => {
        backdrop.style.display = 'none';
      }, 200);
    } else {
      // Open
      backdrop.style.display = 'block';
      drawer.style.animation = 'slide-in-left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)';
    }
  }
  
  // Close on Esc key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('drawer-backdrop').style.display !== 'none') {
      toggleDrawer();
    }
  });
</script>

<!-- Media query to show/hide hamburger -->
<style>
  @media (max-width: 767px) {
    .hamburger-toggle { display: block; }
    .app-sidebar { display: none; } /* Hide sidebar on mobile */
  }
</style>
```

---

### 6. Form with Validation & Inline Feedback

**Khi nào dùng**: Order creation, settings, menu item editing.

**Markup**:
```html
<form onsubmit="submitForm(event)">
  <!-- Text input with validation -->
  <div style="margin-bottom: 20px;">
    <label class="form-label" for="order-table">Table Number</label>
    <input 
      type="text" 
      class="form-control" 
      id="order-table" 
      name="tableNumber" 
      placeholder="e.g., T-01"
      required
    />
    <div class="validation-message" style="display: none; color: #fb7185; font-size: 12px; margin-top: 6px;">
      Table number is required
    </div>
    <div class="validation-success" style="display: none; color: var(--color-emerald); font-size: 12px; margin-top: 6px; display: flex; align-items: center; gap: 6px;">
      ✓ Valid
    </div>
  </div>

  <!-- Select input -->
  <div style="margin-bottom: 20px;">
    <label class="form-label" for="menu-category">Category</label>
    <select class="form-select" id="menu-category" name="category" required>
      <option value="">Select a category...</option>
      <option value="appetizer">Appetizer</option>
      <option value="main">Main Course</option>
      <option value="dessert">Dessert</option>
    </select>
  </div>

  <!-- Textarea -->
  <div style="margin-bottom: 20px;">
    <label class="form-label" for="special-notes">Special Notes</label>
    <textarea 
      class="form-control" 
      id="special-notes" 
      name="notes" 
      placeholder="Any special requests?"
      rows="4"
    ></textarea>
  </div>

  <!-- Buttons -->
  <div style="display: flex; gap: 12px; justify-content: flex-end;">
    <button type="reset" class="btn-secondary">Reset</button>
    <button type="submit" class="btn-primary">Create Order</button>
  </div>
</form>

<script>
  // Real-time validation on input
  document.getElementById('order-table').addEventListener('blur', function() {
    const value = this.value.trim();
    const errorMsg = this.parentElement.querySelector('.validation-message');
    const successMsg = this.parentElement.querySelector('.validation-success');
    
    if (value === '') {
      errorMsg.style.display = 'block';
      successMsg.style.display = 'none';
      this.classList.add('is-invalid');
    } else {
      errorMsg.style.display = 'none';
      successMsg.style.display = 'flex';
      this.classList.remove('is-invalid');
    }
  });

  function submitForm(e) {
    e.preventDefault();
    // Validate & submit
    showToast('Order created successfully!', 'success');
    e.target.reset();
  }
</script>

<style>
  .form-control.is-invalid {
    border-color: #fb7185;
    background: rgba(251, 113, 133, 0.08);
  }
</style>
```

---

### 7. Data Visualization — Metric Card

**Khi nào dùng**: Dashboard, KPI display, revenue/orders trends.

**Markup**:
```html
<!-- Metric card with sparkline -->
<div class="linear-card" style="display: grid; grid-template-columns: 1fr 80px; gap: 16px;">
  <div>
    <div style="color: var(--color-warm-gray); font-size: 12px; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 6px;">
      Total Orders (Today)
    </div>
    <div class="font-display" style="font-size: 32px; color: white; margin: 0; line-height: 1;">
      24
    </div>
    <div style="color: var(--color-emerald); font-size: 12px; margin-top: 8px;">
      ↑ 12% vs yesterday
    </div>
  </div>
  
  <!-- Sparkline chart (simple SVG) -->
  <svg viewBox="0 0 80 40" style="width: 80px; height: 40px;">
    <polyline
      points="0,30 10,25 20,28 30,18 40,22 50,15 60,20 70,10 80,12"
      fill="none"
      stroke="var(--color-amber)"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <polyline
      points="0,30 10,25 20,28 30,18 40,22 50,15 60,20 70,10 80,12"
      fill="url(#gradient)"
      opacity="0.1"
    />
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:var(--color-amber);stop-opacity:0.3" />
        <stop offset="100%" style="stop-color:var(--color-amber);stop-opacity:0" />
      </linearGradient>
    </defs>
  </svg>
</div>

<!-- Simple bar chart (table orders by time) -->
<div class="linear-card">
  <h4 class="font-display" style="margin: 0 0 16px 0;">Orders by Hour</h4>
  <div style="display: flex; gap: 12px; align-items: flex-end; height: 80px;">
    <div style="flex: 1; background: var(--color-amber); border-radius: 8px 8px 0 0; height: 40%; position: relative;" title="10 AM: 8 orders">
      <span style="position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); font-size: 10px; color: var(--color-warm-gray);">10 AM</span>
    </div>
    <div style="flex: 1; background: var(--color-amber); border-radius: 8px 8px 0 0; height: 70%; position: relative;" title="11 AM: 14 orders">
      <span style="position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); font-size: 10px; color: var(--color-warm-gray);">11 AM</span>
    </div>
    <div style="flex: 1; background: var(--color-ember); border-radius: 8px 8px 0 0; height: 100%; position: relative;" title="12 PM: 20 orders (peak)">
      <span style="position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); font-size: 10px; color: var(--color-warm-gray);">12 PM</span>
    </div>
    <div style="flex: 1; background: var(--color-amber); border-radius: 8px 8px 0 0; height: 55%; position: relative;" title="1 PM: 11 orders">
      <span style="position: absolute; bottom: -20px; left: 50%; transform: translateX(-50%); font-size: 10px; color: var(--color-warm-gray);">1 PM</span>
    </div>
  </div>
</div>
```

---

## 🚀 Best Practices

### Transition & Animation
- Mọi interactive element phải có `.transition-snappy` (0.2s) hoặc `.transition-smooth` (0.3s).
- Modal/toast luôn dùng spring easing: `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- Exit animations luôn nhanh hơn enter (0.15s vs 0.25s).

### Accessibility
- Badge status changes phải dùng text content, không chỉ color.
- Form labels luôn có `<label for="...">`, không placeholder-only.
- Icon buttons luôn có `aria-label`.
- Focus indicators luôn visible (2px outline hoặc glow).

### Performance
- Dùng CSS animations (GPU-accelerated), không JavaScript animation.
- Skeleton loaders thay vì spinner để progressive render.
- Debounce real-time updates từ SignalR (e.g., 100ms throttle).

### Responsive
- Mobile-first: mặc định full-width.
- Drawer sidebar thay vì collapse trên < 768px.
- Touch targets tối thiểu 44×44px.

---

## 📝 Checklist: Khi thêm component mới

- [ ] Thêm HTML markup vào CSHTML view
- [ ] CSS class đặt tên theo pattern: `.component-name`, `.component-name-variant`
- [ ] Animation: sử dụng class từ `animations.css` (.animate-*, .transition-*)
- [ ] Focus state: thêm `:focus` hoặc `:focus-visible` styles
- [ ] Mobile: test với < 768px screen width
- [ ] Accessibility: ARIA labels, semantic HTML, contrast check
- [ ] Documentation: add comment trong code, update DESIGN.md nếu cần

---

*Last updated: 2026-06-23 | Ref: DESIGN.md v2.1*
