# Quy định Phát triển (Development Guidelines)

Tài liệu này quy định các tiêu chuẩn về kiến trúc Backend và giao diện Frontend để đảm bảo tính thống nhất trong toàn bộ dự án ShopManagement.

---

## 1. Quy định Backend

### Mô hình kiến trúc (Architectural Pattern)

Dự án thống nhất sử dụng **Clean Architecture** (hoặc Onion Architecture) để đảm bảo tính dễ kiểm thử, bảo trì và độc lập với các framework bên ngoài.

- **Domain Layer**: Chứa các thực thể (Entities), Logic nghiệp vụ cốt lõi, Interface. Không phụ thuộc vào bất kỳ layer nào khác.
- **Application Layer**: Chứa các Use Cases, DTOs, Mappers, Validators và Interfaces cho Infrastructure.
- **Infrastructure Layer**: Triển khai các Interface từ Application (Repositories, Mail Service, Logging, v.v.). Chứa Entity Framework Core DbContext.
- **WebAPI Layer**: Điểm vào của ứng dụng, chứa Controllers, Middleware, Dependency Injection configuration.

### Tiêu chuẩn Code

- **Dependency Injection**: Luôn sử dụng Interface để đăng ký service.
- **Async/Await**: Sử dụng lập trình bất đồng bộ cho tất cả các thao tác I/O (Database, API call).
- **Error Handling**: Sử dụng Middleware tập trung để xử lý lỗi thay vì try-catch ở khắp nơi.
- **Validation**: Sử dụng FluentValidation để kiểm tra dữ liệu đầu vào.

---

## 2. Quy định Frontend

### Thống nhất màu sắc (Design System & Color Palette)

Để tránh sự bất đồng về giao diện giữa các trang, dự án thống nhất sử dụng hệ màu dựa trên Tailwind CSS với tông màu chủ đạo là **Emerald** (xanh lá - phù hợp với quán ăn/nhậu, tạo cảm giác tươi mới).

| Thành phần             | Màu sắc (Tailwind Class) | Mã HEX (Tham khảo) |
| :--------------------- | :----------------------- | :----------------- |
| **Primary (Chủ đạo)**  | `emerald-600`            | `#059669`          |
| **Secondary (Phụ)**    | `slate-700`              | `#334155`          |
| **Accent (Nhấn mạnh)** | `amber-500`              | `#f59e0b`          |
| **Background (Nền)**   | `slate-50`               | `#f8fafc`          |
| **Text (Chữ chính)**   | `slate-900`              | `#0f172a`          |
| **Danger (Lỗi/Xóa)**   | `rose-500`               | `#f43f5e`          |

### Quy tắc Giao diện

- **Tính đồng nhất**: Tất cả các nút bấm (Button) hành động chính phải có màu `bg-emerald-600`.
- **Bo góc (Border Radius)**: Thống nhất sử dụng `rounded-lg` cho card và input.
- **Font chữ**: Sử dụng **Inter** hoặc **System UI** để đảm bảo hiển thị rõ ràng trên mọi thiết bị.
- **Responsive**: Ưu tiên thiết kế Mobile-first (nhân viên dùng điện thoại để order).

### Cấu trúc Component

- Sử dụng **Functional Components** với React Hooks.
- **TypeScript**: Luôn định nghĩa Interface/Type cho Props và dữ liệu API.
- **Form**: Sử dụng một thư viện thống nhất (như React Hook Form) kết hợp với các component UI dùng chung.

---

## 3. Quy trình làm việc

- Mọi thay đổi về Database phải thông qua **Migrations**.
- API mới phải có **Swagger documentation**.
- Frontend component mới nên được đặt trong thư mục `src/components` để tái sử dụng.
