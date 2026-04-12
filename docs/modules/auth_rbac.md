# Module: Xác thực & Phân quyền (Auth & RBAC)

ZôOS sử dụng ASP.NET Core Identity kết hợp với mô hình RBAC (Role-Based Access Control) tùy chỉnh theo từng Tenant (Shop).

## 🛡️ Mô hình Phân quyền Đa cấp
Người dùng có một tài khoản hệ thống duy nhất nhưng có thể có các vai trò khác nhau tại các Quán khác nhau.

### 1. Vai trò trong Quán (ShopRole)
| Role | Quyền hạn |
| :--- | :--- |
| **Owner** | Chủ sở hữu. Có quyền tối cao tại Shop: Xóa Shop, Quản lý doanh thu, Mời/Đuổi Manager & Staff. |
| **Manager** | Quản lý. Quản lý danh mục, món ăn, sơ đồ bàn. Mời/Quản lý Staff. |
| **Staff** | Nhân viên. Thao tác nghiệp vụ: Mở bàn, Gọi món, In hóa đơn. |

## 🔑 Luồng xác thực (Authentication Flow)
1. **Login**: User gửi Username/Password -> API trả về **JWT Token**.
2. **Shop Selection**: Sau khi Login, User chọn Shop muốn làm việc. 
3. **Tenant Header**: Frontend gửi `ShopId` trong Header của mọi request kế tiếp.
4. **Backend Validation**: 
   - `ITenantService` trích xuất `ShopId`.
   - `ShopAuthorizationHandler` kiểm tra User có thuộc Shop đó không và có Role hợp lệ không.

## 📝 Quy tắc Bảo mật
- Dữ liệu luôn được lọc qua **Global Query Filter** (`ShopId == CurrentShopId`).
- Mọi API nghiệp vụ thực thi đều yêu cầu Header `ShopId`.
