# Nguyên tắc Nghiệp vụ Kế toán & Vận hành (Business Rules & Accounting)

Dành cho `@Business`, `@Accountant` và `@PO`. Kỹ thuật tốt đến đâu mà tính sai tiền thì phần mềm cũng vứt đi.

## 1. Bài toán Làm Tròn Số (Rounding Anomalies)

Tiền tệ trong F&B cực kỳ nhạy cảm với việc làm tròn số, đặc biệt khi tính Thuế VAT (8% hoặc 10%) và Phí Phục Vụ (Service Charge 5%).
- **Quy tắc Backend**: Trong C# luôn sử dụng kiểu dữ liệu `decimal` cho mọi trường liên quan đến tiền. KHÔNG BAO GIỜ dùng `float` hay `double`.
- **Thứ tự Tính Toán**: Tổng tiền hàng -> Trừ Khuyến Mãi -> Cộng Phí Phục Vụ -> Cộng Thuế VAT.
- Phải áp dụng thuật toán `MidpointRounding.AwayFromZero` thống nhất toàn hệ thống để khi hóa đơn là `250,500.5 VND` thì hệ thống luôn làm tròn lên `250,501 VND`, tránh việc Kế toán cuối ngày bị lệch 1 đồng khi chốt sổ.

## 2. Quản lý Khuyến mãi Chéo (Combo & Voucher Interfacing)

Quán nhậu thường xuyên có trò: "Uống 1 tháp bia tặng 1 đĩa trái cây" HOẶC "Giảm 10% tổng bill cho khách check-in".
- **Rule Xung Đột**: Hệ thống (Application Layer) phải có Rule Engine định nghĩa việc "Khuyến mãi có được cộng dồn (Stackable) hay không?". 
- VD: Khách đã dùng mã Trái Cây thì không được dùng Vochcher Giảm Giá 10%. Tránh việc nhân viên lợi dụng add nhiều mã giảm giá làm công ty lỗ nặng.

## 3. Tách Bill & Gộp Bàn (Split & Merge Orders)

Luồng phức tạp nhất của dân nhậu là "Sang bàn" (Đang ngồi bàn 1 chuyển sang bàn 5) và "Chia tiền trả" (Anh A trả bia, Anh B trả mồi).
- **Sang bàn (Merge/Transfer)**: Khi chuyển bàn, OrderItem không được hủy mà chỉ đổi `OrderId` và in ra bếp 1 phiếu thông báo nhỏ "Bàn 1 -> Bàn 5" để nhân viên bưng đúng mâm.
- **Tách Bill (Split Bill)**: Cho phép chuyển một số `OrderItem` sang một `Order` mới ngay trên hệ thống. Tổng tiền phải được recalculate lại toàn bộ quy trình tính thuế và khuyến mãi cho cả 2 bill.

## 4. Chốt Ca Giao Tiền (End-of-Shift Reconciliation)

- Khi Thu Ngân A giao ca cho Thu Ngân B, ngân kéo chứa bao nhiêu tiền mặt (Cash in Drawer)?
- Hệ thống phải khớp: `Tiền mặt đầu ca` + `Tổng thu tiền mặt` - `Tiền thối lại` - `Tiền chi ra đi chợ` = `Tiền mặt cuối ca`.
- Bắt buộc phải có chức năng in Phiếu Trực Ca (Z-Report) phân tách rõ: VNPay bao nhiêu, Momo bao nhiêu, Tiền mặt bao nhiêu để đối soát với biến động số dư ngân hàng của Chủ quán.
