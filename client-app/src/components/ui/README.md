# UI Components Library

## 📦 Components

### 1. QuantityInput
Một input number có nút tăng/giảm, sử dụng Tailwind, hỗ trợ aria-label cho accessibility.

**Props:**
- `value`: Số lượng hiện tại.
- `onChange`: Callback khi thay đổi số lượng.
- `min`: Giá trị tối thiểu (mặc định: 1).
- `max`: Giá trị tối đa.

---

### 2. PaymentButton
Button mở modal thanh toán, hiển thị tổng tiền và xác nhận thanh toán.

**Props:**
- `totalAmount`: Tổng số tiền cần thanh toán.
- `onPaymentSuccess`: Callback khi thanh toán thành công.

---

### 3. Modal
Component Modal cơ bản với hiệu ứng animation (Framer Motion).

**Props:**
- `isOpen`: Trạng thái đóng/mở.
- `onClose`: Callback khi đóng modal.
- `title`: Tiêu đề modal.
- `children`: Nội dung bên trong.

---

### 4. Button & IconButton
Các component button cơ bản hỗ trợ nhiều variant (primary, outline, ghost) và trạng thái loading.

## 🎨 Styles
Tất cả các button trong hệ thống đều được áp dụng:
- `hover:bg-opacity-80` hoặc `hover:brightness-110`
- `focus:ring-2 focus:ring-brand-purple/50`
- `transition-all active:scale-95`
