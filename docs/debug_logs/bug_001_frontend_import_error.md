# Nhật ký Bug #001: Lỗi Import TableDto trong Frontend

- **Vấn đề gặp phải**:
  Trình duyệt báo lỗi: `Uncaught SyntaxError: The requested module '/src/models/table.ts' does not provide an export named 'TableDto'`. Mặc dù trong file `table.ts` đã có `export interface TableDto`.

- **Nguyên nhân dự kiến**:
  1. **Vite 7 + TypeScript Isolated Modules**: Khi import một `interface` (chỉ tồn tại ở mức type) mà không dùng từ khóa `type`, Vite có thể hiểu lầm đó là một giá trị runtime (value) và cố gắng tìm nó trong file `.js` kết quả, dẫn đến lỗi vì interfaces bị xóa bỏ sau khi compile.
  2. **Xung đột tên**: Mặc dù ít khả năng nhưng có thể do cách đặt tên hoặc cấu trúc thư mục.

- **Cách giải quyết**:
  - Chuyển sang sử dụng `import type { TableDto }` trong `App.tsx` để chỉ thị rõ ràng đây là dữ liệu kiểu, không phải biến runtime.
  - Kiểm tra lại file `table.ts` để đảm bảo không có lỗi cú pháp ẩn.

- **Kết quả**:
  - Đã fix lỗi SyntaxError. Dashboard đã render thành công.
  - Các lỗi phụ về TypeScript (Missing imports, implicit any) cũng đã được dọn dẹp sạch sẽ.
