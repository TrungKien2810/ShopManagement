# Sổ tay Kỹ thuật Frontend & UX (Frontend Playbook)

Tài liệu này định nghĩa các tiêu chuẩn khắt khe cho đội ngũ `@Frontend` và `@Designer` trong dự án ZôOS, đặc biệt chú trọng vào môi trường vận hành thực tế của quán nhậu (thiếu sáng, mạng yếu, nhân viên thao tác tốc độ cao).

## 1. PWA & Offline-First Strategy (Chiến lược Ngoại tuyến)

Môi trường F&B thường có các "vùng lõm" sóng Wifi (như tầng hầm, phòng VIP cách âm). Ứng dụng không được phép "trắng trang" khi mất mạng.

- **Service Workers**: Phải cache toàn bộ file tĩnh (HTML, CSS, JS, Fonts, App Shell) ngay lần truy cập đầu tiên.
- **IndexedDB**: Lưu trữ (Cache) danh sách Menu món ăn cục bộ. Nếu thu ngân vào khu vực mất mạng, họ vẫn có thể bấm chọn món bình thường.
- **Request Queueing (Hàng đợi lệnh)**: Khi mất mạng, các lệnh "Order món" sẽ được tống vào hàng đợi nội bộ (Redux Persist / IndexedDB). Ngay khi có mạng lại, hệ thống tự động đồng bộ (Sync) gỡ hàng đợi đẩy lên Server.

## 2. Quản lý Trạng thái & Socket (SignalR Reconnection)

- **Graceful Reconnect**: Nếu kết nối WebSocket (SignalR) bị đứt, Frontend phải tự động thiết lập Exponential Backoff (Thử gọi lại sau 1s, 2s, 4s, 8s) để tránh làm nghẽn Server khi 100 cái iPad cùng cố kết nối lại cùng một lúc.
- **Cảnh báo Trạng thái Mạng**: Luôn có một chấm xanh/đỏ nhỏ ở góc phải màn hình để Thu ngân biết máy tĩnh bảng của mình có đang online hay không. Khách gọi tính tiền mà máy đang offline thì thu ngân không được phép in bill.

## 3. Tiêu chuẩn Thiết kế Trải nghiệm Quán Nhậu (Tavern UX)

- **High Contrast & Dark Mode**: Bắt buộc hỗ trợ Dark Mode. Tương phản màn hình phải đạt chuẩn WCAG (AAA) để nhân viên chạy bàn ngoài trời tối vẫn đọc rõ tên món.
- **Fat-Finger Design (Chống chạm nhầm)**: Các nút thao tác quan trọng (In Bill, Hủy Món, Hoàn Thành) phải có kích thước tối thiểu `48x48px`. Giao diện không sử dụng thao tác "vuốt" quá nhiều vì tay nhân viên có dầu mỡ sẽ vuốt không ăn.
- **Micro-Interactions**: Cần có âm thanh (Bíp/Ting) hoặc rung (Haptic Feedback) ngay lập tức khi ấn nút Order để xúc giác nhân viên biết lệnh đã được ghi nhận mà không cần nhìn chằm chằm vào màn hình chờ load.

## 4. Hardware Integration via Browser

- Web App phải tích hợp tốt với WebUSB API hoặc Web Bluetooth API (nếu được hỗ trợ) để có thể bắn lệnh ESC/POS trực tiếp đến máy in nhiệt nội bộ (LAN Printer) của nhà bếp mà không cần thông qua Backend làm trung gian (giảm trễ/latency tối đa).
