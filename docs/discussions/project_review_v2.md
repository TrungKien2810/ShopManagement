# Thảo luận Review Dự án v2: Kiểm tra tính đầy đủ và rủi ro

Ngày: 2026-03-07
Chủ đề: Rà soát lại mục tiêu dự án và tìm kiếm các tính năng còn thiếu

---

## 1. Tranh luận Review giữa các vai trò (@ZôOS)

**@Business**: Tôi thấy chúng ta đang thiếu phần **Quản lý Combo và Khuyến mãi**. Quán nhậu thường có các gói như "Combo 10 chai bia tặng 1 đĩa mồi". Hệ thống cần tự động tính toán giá này thay vì nhân viên phải trừ tay. Ngoài ra, việc **Tách hóa đơn (Split Bill)** cho các nhóm khách muốn chia tiền cũng rất quan trọng.

**@Manager**: Một điểm cực kỳ quan trọng trong vận hành quán nhậu là **Gộp bàn và Chuyển bàn**. Khách nhậu thường đi đông hơn dự kiến hoặc muốn chuyển sang khu vực thoáng hơn. Nếu hệ thống không hỗ trợ gộp order từ 2 bàn thành 1, thu ngân sẽ rất dễ nhầm lẫn khi tính tiền.

**@Architect**: Tôi nhận ra chúng ta cần phân tách **Bếp (Kitchen)** và **Quầy Bar (Bar)**. Đồ ăn thì đẩy xuống bếp, nhưng bia và nước ngọt thì phải đẩy lệnh ra quầy bar. Hai bộ phận này cần màn hình (KDS) riêng biệt để không bị lẫn lộn đơn hàng của nhau.

**@Developer**: Về phần **Xóa món/Hủy món**, ngoài việc lưu Log như @Business nói, chúng ta cần quy trình **Hoàn kho**. Nếu món đã nấu rồi mới hủy thì không hoàn kho nguyên liệu, nhưng nếu mới order mà hủy thì phải hoàn lại số lượng vào kho. Điều này cần logic xử lý trạng thái món ăn rất chặt chẽ.

**@Designer**: Tôi muốn bổ sung **Hệ thống gọi nhân viên (Staff Paging)**. Khách có thể nhấn một nút "Gọi phục vụ" hoặc "Thanh toán" ngay trên giao diện QR Code. Nhân viên sẽ nhận được thông báo rung trên điện thoại của họ để biết chính xác bàn nào đang cần gì, tránh việc khách phải vẫy tay gọi trong tiếng nhạc ồn ào.

**@Business**: Thêm một ý nữa, các quán nhậu thường có tình trạng **Khách gửi lại rượu**. Hệ thống cần có một mục quản lý "Hàng gửi" để khi khách quay lại, nhân viên có thể tra cứu nhanh chóng dựa trên số điện thoại hoặc mã thẻ gửi.

---

## 2. Danh sách các tính năng đề xuất bổ sung sau Review

1. **Quản lý Combo & Khuyến mãi**: Tự động áp dụng giá ưu đãi theo điều kiện.
2. **Gộp bàn / Chuyển bàn**: Linh hoạt trong việc điều phối chỗ ngồi và hóa đơn.
3. **Phân tách Bếp & Bar**: Luồng đơn hàng riêng biệt cho đồ ăn và đồ uống.
4. **Hệ thống Gọi phục vụ (Staff Paging)**: Thông báo thời gian thực từ khách đến nhân viên.
5. **Quản lý Hàng gửi (Rượu gửi)**: Lưu trữ thông tin đồ uống khách chưa dùng hết.
6. **Tách hóa đơn (Split Bill)**: Hỗ trợ thanh toán linh hoạt cho nhóm khách.
7. **Quy trình Hủy món & Hoàn kho**: Logic chặt chẽ để quản lý thất thoát nguyên liệu.

---

## 3. Kết luận
Dự án cần mở rộng thêm các tính năng về vận hành thực tế tại hiện trường (bàn, bếp, bar) để đảm bảo tính thực dụng cao nhất cho mô hình quán nhậu.
