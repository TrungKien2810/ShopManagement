# Story 01: API Mở Bàn (Open Table & Session Gen)

## 1. Mục đích (Why)
Để biến 1 mã QR dán tĩnh (Plastic/Giấy) gắn chặt trên bàn trở nên "Sống" (Có khả năng order). Nhân viên bắt buộc phải kích hoạt (Mở bàn) trên hệ thống. 
Thao tác này giúp hệ thống biết quán đang có khách ngồi, và chống chuyện người ngoài lấy mã QR mang về nhà quét lén (vì phiên Session có giới hạn thời gian).

## 2. Mô tả / Yêu cầu Kỹ thuật (Requirements)
Vai trò: `@Backend`
- **Khung dự án**: `ShopManagement.WebAPI`, `ShopManagement.Application`, `ShopManagement.Infrastructure`.
- **Database Entity**: Bảng `Tables` có thuộc tính `Status` (Enum `TableStatus`).
- **Nhiệm vụ đầu ra**:
  1. Viết Endpoint `POST /api/tables/{id}/open`.
  2. Logic kiểm tra (Validation): Nếu bàn đã ở trạng thái `InUse` hoặc `Reserved`, trả về `400 Bad Request` ("Bàn này đã có khách hoặc đã đặt trước").
  3. Logic xử lý:
     a. Hệ thống khởi tạo `Order` mới gắn với `table_id` và `shop_id` của quán hiện tại, với trạng thái `Open`. Gắn `Order.TableId = {id}` và `CheckInTime = DateTime.UtcNow`.
     b. Trạng thái bàn chuyển từ `Available` sang `InUse`.
  4. **Bảo mật**: Sinh ra một JWT Token phụ (Hoặc chuỗi Session Token Hash) đại diện cho Order này để gửi trả về Frontend. Các Request gọi món sau này từ QR Code bắt buộc phải kẹp Token này lên Header. Đoạn này có thể làm đơn giản: Chỉ trả về `OrderId`. 

## 3. Tiêu chí Nghiệm thu (Acceptance Criteria - Dành cho `@Tester`)
- [ ] Chạy Postman gọi API với ID bàn đang trống -> Trả về HTTP 200, status bàn trong DB thành 1 (InUse). Entity `Order` mới xuất hiện trong DB.
- [ ] Gọi API lần 2 với ID bàn trên -> Trả về HTTP 400 và JSON báo lỗi "Bàn không còn trống".
- [ ] Response Payload phải chứa `orderId` vừa sinh ra và/hoặc `sessionToken` đại diện cho phiên đó.

## 4. Ràng buộc Playbook (Playbook Cảnh báo)
- *(Theo Backend Playbook)*: Vui lòng bọc logic đổi trạng thái bàn và tạo Hóa Đơn (Order) trong CÙNG MỘT DB TRANSACTION để đảm bảo tính Toàn vẹn (ACID). Rớt mạng giữa chừng thì không lưu gì cả. Lỗi Code ở đoạn này sẽ dính án Tử (Red Line).
