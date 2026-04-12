# Nhật ký Bug #002: Lỗi CORS khi gọi API từ Frontend cổng 5174

- **Vấn đề gặp phải**:
  Frontend (cổng 5174) không thể gọi API Backend (cổng 5000). Trình duyệt báo lỗi: `Access to XMLHttpRequest ... has been blocked by CORS policy`.

- **Nguyên nhân**:
  Cấu hình `AddCors` trong `Program.cs` của Backend đang để cứng Origin là `http://localhost:5173`. Do mình vừa đổi cổng Frontend sang `5174` để tránh xung đột, Backend đã từ chối yêu cầu từ "người lạ" này.

- **Cách giải quyết**:
  - Cập nhật `WithOrigins` trong `Program.cs` để chấp nhận cả `http://localhost:5173` và `http://localhost:5174`.
  - Khởi động lại Backend Server.

- **Kết quả**:
  [Đang chờ xác minh sau khi restart Backend]
