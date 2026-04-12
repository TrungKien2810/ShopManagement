# Nhật ký Bug #003: Lỗi File Lock và Hệ thống bị kẹt (System Lockup)

- **Vấn đề gặp phải**:
  - Không thể Build Backend: `Unable to copy file ... because it is being used by another process`.
  - Frontend báo lỗi `Connection Refused` mặc dù terminal báo `Ready`.
  - Browser hiện lỗi `Unsafe attempt to load URL ... from frame with URL chrome-error`.

- **Nguyên nhân**:
  1. **Zombie Processes**: Các tiến trình `dotnet.exe` và `node.exe` cũ không tự thoát hoàn toàn sau khi gặp lỗi, tiếp tục giữ Port và khóa file hữu hình (.dll).
  2. **Vite Crash**: Frontend bị crash do port 5173/5174 bị chiếm dụng ảo.

- **Cách giải quyết (Kỹ thuật Debug tốt nhất)**:
  - **Lệnh hủy diệt**: Sử dụng `taskkill /F /IM` để ép buộc kết thúc toàn bộ cây tiến trình liên quan.
  - **Làm sạch**: Chạy `dotnet clean` để xóa các file tạm (`bin/`, `obj/`) đang bị kẹt.
  - **Tái cấu trúc**: Build lại toàn bộ Solution từ trạng thái sạch.

- **Kết quả**:
  - Build Succeeded ✅
  - File Lock đã được giải phóng.
  - Sẵn sàng khởi động lại Dashboard sạch sẽ.
