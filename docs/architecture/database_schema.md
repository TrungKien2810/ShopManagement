# Thiết kế Cơ sở Dữ liệu (Database Schema) - Dự án Quản lý Quán nhậu

Dưới đây là thiết kế cơ sở dữ liệu dựa trên các yêu cầu đã chốt. Hệ thống được thiết kế theo hướng **Multi-tenancy** (nhiều quán dùng chung một hệ thống).

---

## 1. Góc nhìn từ @Architect

**@Architect**: Để đáp ứng các yêu cầu phức tạp như phân quyền, gộp bàn, tách bill và quản lý kho, tôi thiết kế schema này với các nguyên tắc sau:
1. **Multi-tenancy**: Mọi bảng quan trọng đều có `shop_id` để cô lập dữ liệu giữa các quán.
2. **Audit Trail**: Bảng `audit_logs` sẽ ghi lại mọi hành động nhạy cảm (xóa món, giảm giá, xác nhận hộ bếp).
3. **Trạng thái linh hoạt**: Đơn hàng (`orders`) và chi tiết đơn hàng (`order_items`) có các trạng thái riêng biệt (Pending, Processing, Completed, Cancelled) để phục vụ luồng Bếp/Bar.
4. **Cấu trúc Kho & Công thức**: Tách biệt `products` (món bán) và `ingredients` (nguyên liệu trong kho) thông qua bảng trung gian `recipes` để tự động trừ kho khi bán.

---

## 2. Các thực thể chính (Entities)

### A. Xác thực & Đa chủ sở hữu (SaaS & Identity)
- **AspNetUsers (ApplicationUser)**: Lưu thông tin định danh (Username, Email, HashPassword, FullName).
- **Shops**: Danh sách các Tenant (Id, Name, Address, OwnerId).
- **ShopMembers**: Liên kết User với Shop (ShopId, UserId, Role: Owner, Manager, Staff).

### B. Danh mục & Sản phẩm (Tenant-Isolated)
- **Categories**: Phân loại món (Id, Name, **ShopId**).
- **Products**: Món ăn/uống (Id, Name, Price, **ShopId**).

### C. Vận hành & Bán hàng (Tenant-Isolated)
- **Tables**: Sơ đồ bàn (Id, Name, Status, **ShopId**).
- **Orders**: Đơn hàng tổng (Id, TableId, TotalAmount, Status, **ShopId**).
- **OrderItems**: Chi tiết món (Id, OrderId, ProductId, Quantity, **ShopId**).

### D. Giám sát & Thông báo
- **AuditLogs**: Nhật ký hệ thống (user_id, action, target_id, old_value, new_value, reason).
- **StaffPaging**: Thông báo gọi nhân viên từ bàn (table_id, type: Gọi phục vụ/Thanh toán, status).

---

## 3. Sơ đồ Quan hệ (ER Diagram - Tóm tắt)

```mermaid
erDiagram
    SHOP ||--o{ EMPLOYEE : has
    SHOP ||--o{ TABLE : has
    SHOP ||--o{ PRODUCT : sells
    SHOP ||--o{ INGREDIENT : manages
    
    USER ||--o{ EMPLOYEE : is
    USER ||--o{ ALCOHOL_DEPOSIT : owns
    
    TABLE ||--o{ ORDER : contains
    ORDER ||--o{ ORDER_ITEM : consists_of
    ORDER ||--o{ PAYMENT : paid_by
    
    PRODUCT ||--o{ RECIPE : defined_by
    INGREDIENT ||--o{ RECIPE : used_in
    
    ORDER_ITEM }|--|| PRODUCT : refers_to
    ORDER_ITEM }|--|| USER : action_by (Kitchen/Cashier)
    
    AUDIT_LOG }|--|| USER : performed_by
```

---

## 4. Chi tiết một số bảng quan trọng (Ví dụ SQL)

```sql
-- Bảng lưu vết các hành động nhạy cảm
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    shop_id UUID REFERENCES shops(id),
    user_id UUID REFERENCES users(id),
    action VARCHAR(50), -- 'DELETE_ITEM', 'OVERRIDE_KITCHEN', 'APPLY_DISCOUNT'
    target_table VARCHAR(50),
    target_id UUID,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng chi tiết món ăn để quản lý luồng Bếp/Bar
CREATE TABLE order_items (
    id UUID PRIMARY KEY,
    order_id UUID REFERENCES orders(id),
    product_id UUID REFERENCES products(id),
    quantity INTEGER,
    price_at_order DECIMAL,
    status VARCHAR(20), -- 'PENDING', 'KITCHEN_CONFIRMED', 'COMPLETED', 'CANCELLED'
    note TEXT,
    kitchen_user_id UUID REFERENCES users(id), -- Người xác nhận xong
    cancelled_by UUID REFERENCES users(id), -- Thu ngân hoặc Manager xóa
    created_at TIMESTAMP
);
```
