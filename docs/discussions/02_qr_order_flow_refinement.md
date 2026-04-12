# Tranh luận: Tối ưu luồng Gọi món tự động qua QR Code (Bỏ thao tác thừa)

**Người khởi xướng:** @Business / @User (Quyết định từ Stakeholder chính)
**Vấn đề:** 
1. Khách quét QR order xong lại chờ nhân viên chạy ra hỏi "Anh gọi món A B C à?" làm hỏng hoàn toàn trải nghiệm tự động và tốc độ phục vụ.
2. Việc bắt khách nhập mã PIN bảo mật khi quét QR là quá phiền hà (Bad UX) so với một môi trường quán nhậu. Và lo ngại "bàn khác quét trộm" của @Staff là quá mức cần thiết, thiếu tính thực tế.

---

### PHIÊN TRANH LUẬN & ĐIỀU CHỈNH

**@User / @Business (Vai trò quyết định)**: 
Tôi chốt lại: 
- Không cần dùng mã PIN check vì rất phiền. 
- Chuyện bàn khác cố tình quét mã của bàn này là vô lý và hiếm khi xảy ra ở quán nhậu. Đừng vì 1% rủi ro vô lý mà làm khó 99% khách hàng đàng hoàng.
- Đã quét mã order xong thì Bếp phải nhận luôn, nhân viên không chạy ra hỏi lại nữa.

**@Manager**: Hoàn toàn đồng ý với sếp. Chúng ta sinh ra phần mềm để giải quyết nút thắt cổ chai (bottleneck) lúc quán đông. Nút thắt ở đây là khâu "đứng ghi món". Khách tự ghi món rồi mà nhân viên còn phải ra gật gù thì không giải phóng được sức lao động.

**@Staff (Thuyết phục)**: Vâng, tôi đồng ý. Ở quán nhậu thực tế, khách các bàn hiếm khi cà khịa nhau kiểu đó vì dễ sinh sự đánh nhau. Tôi sẽ bỏ qua rủi ro này. Về việc "Khách bấm nhầm số lượng khổng lồ", các sếp tính sao?

**@Backend (Xử lý kỹ thuật - Auto Approve Rule)**: 
Đơn giản thôi. Chúng ta sẽ lập trình một **Bộ lọc động (Rule Engine)**:
- **Luồng Tự Động (Auto-Print)**: Khi order thỏa mãn điều kiện (Ví dụ: Tổng tiền dưới 1 triệu VNĐ, hoặc dưới 10 món/lần). Lệnh order sẽ bay thẳng vào máy in ở Quầy Bar / Khu Bếp. Nhân viên pha chế làm rẹt rẹt rồi bưng ra luôn. Không ai phải hỏi ai.
- **Luồng Cảnh Báo (Manual Review)**: Nếu khách lỡ tay bấm 50 lon bia (Tổng tiền vọt lên 1 triệu rưỡi). Lệnh Order sẽ bị giữ lại ở trạng thái "Cần Xác Nhận" (Pending Review) và thông báo Đỏ nháy liên tục trên điện thoại Quản lý. Lúc đó Quản lý mới lội bộ ra bàn hỏi "Dạ anh gọi tận 2 Thùng chia đúng không ạ?".

**@Architect (Thiết kế luồng Data & QR)**: 
Cách làm QR cũng sẽ tối giản luôn theo yêu cầu không cần PIN:
1. **Dynamic Link**: Mã QR dán trên bàn chỉ là 1 Link (`ZôOS.vn/t/12`).
2. **Session Mở Bàn**: Khách vào bàn, phục vụ lấy điện thoại quét/bấm "Bắt đầu phục vụ". Trạng thái bàn (TableStatus) chuyển sang `InUse`. Hệ thống sinh ra 1 Session JWT ảo cho bàn đó.
3. Khi khách quét, API sẽ kiểm tra bàn `InUse` -> Cho phép vào Menu. Đặt xong là lệnh In chạy.
4. Bàn thanh toán xong -> Trạng thái về `Available` -> Session chết. Khách đứng lên vác mã QR về nhà cũng không gọi được vì Bàn đang tắt.

**@Frontend (UI/UX)**:
Giao diện quét xong không bắt Login, không bắt PIN. Vào là đập thẳng Menu có hình lon bia mát lạnh vào mặt khách. Bấm [+] -> Thanh toán rẹt rẹt.

---

### 🏆 NGHỊ QUYẾT BÀN GIAO (Quyết định bởi @User)
1. **BỎ MÃ PIN**: Khách quét mã vào thẳng giao diện gọi món.
2. **TỰ ĐỘNG LÊN ĐƠN**: Order lọt vào "Luồng an toàn" sẽ tự động in phiếu ở bếp. Bỏ qua hoàn toàn khâu chờ phục vụ xác nhận bằng miệng.
3. **RULE KIỂM SOÁT TỰ ĐỘNG (Auto-Alert)**: Áp dụng AI / Rule-based đơn giản để chặn các lệnh gọi bất thường (Ví dụ > 10 món/lần) báo hiệu cho nhân viên kiểm tra, phòng trường hợp khách say bấm nhầm.

*(Quyết định này là thiết kế cuối cùng cho tính năng Self-Order)*
