# Tranh luận: Tính năng Khách Tự Quét Mã QR Gọi Món (Self-Order)

**Ngữ cảnh:** Quán đang vào lúc cao điểm, nhân viên phục vụ chạy không kịp. Khách phàn nàn vì chờ gọi thêm vài lon bia quá lâu. Chủ quán (@Business) đưa ra ý tưởng làm QR Code dán tại mỗi bàn, khách dùng điện thoại quét để tự gọi món mà không cần gọi nhân viên.

---

**@Business**: Khách dạo này phàn nàn chờ gọi món lâu quá. Tôi muốn cuối tháng này phải có tính năng: Khách ngồi tại bàn quét mã QR, chọn món, sau đó order bay thẳng vào bếp. Giảm được áp lực cho nhân viên mà khách lại gọi được nhiều hơn.

**@Manager**: Ý tưởng rất hay để tăng doanh thu. Nhưng triển khai gấp trong 3 tuần thì rủi ro rất cao. Chỉ cần lúc khách đông mà app lỗi, khách order không được sẽ bực mình bỏ về. Tôi đề xuất làm bản thử nghiệm (Beta) trước cho 5 bàn VIP.

**@Staff (Vận hành)**: Khoan đã! Khách nhậu thường hay say xỉn. Nhỡ họ quét QR rồi bấm nhầm 10 thùng bia thì sao? Hoặc bàn kế bên chụp lén mã QR rồi cố tình order phá bàn này? Chắc chắn phải có nhân viên "duyệt" lại cái order đó trên máy tính bảng trước khi báo xuống Bếp.

**@Business**: Nếu nhân viên vẫn phải duyệt thì quét QR làm gì nữa? Chậm y như cũ! Bắt khách thanh toán trước qua VNPay ngay trên điện thoại luôn. Hủy đơn báo sau.

**@Staff**: Đang nhậu, đang cầm đũa dính dầu mỡ mà bắt mở app ngân hàng quét mặt thanh toán cho 2 lon bia gọi thêm á? Khách chửi cho sập quán sếp ơi!

**@Architect**: Xét về kiến trúc, @Staff nói đúng. Mã QR in ra giấy rất dễ bị chụp trộm (Fake Order). Giải pháp của tôi là: 
1. Mã QR chỉ chứa 1 cái link `https://bmad.vn/table/12`. 
2. Khi khách quét, nhân viên phục vụ phải ra xác nhận "Mở Bàn" trên phần mềm, lúc đó hệ thống mới sinh ra 1 **Token dùng 1 lần** (sống trong 3 tiếng) gắn vào mã QR đó. 
3. Hết 3 tiếng hoặc khách thanh toán xong, Token chết, ai quét cũng vô dụng.

**@Backend**: Đồng ý với @Architect. Tôi sẽ dùng JWT Token để quản lý Session của bàn. Phần thông báo cho Bếp, tôi sẽ dùng **SignalR (WebSocket)**. Ngay khi khách bấm "Đặt món", một sự kiện (Event) sẽ bắn thẳng từ server xuống màn hình của Bếp trong chưa tới 0.1 giây mà không cần tải lại trang.

**@DevOps**: Nhớ lưu ý lúc 8h tối cuối tuần (Giờ vàng). Lượng connection của SignalR giữ liên tục cho 100 bàn là khá lớn. Tôi sẽ chuẩn bị Redis Backplane để chia tải (Load Balancing) phòng khi server quá tải.

**@Frontend / @Designer**: Giao diện quét mã QR trên điện thoại khách (Web App) phải RẤT NHẸ. Khách quét xong phải lên ngay trong 2 giây (Dùng Next.js/Vite PWA). Màu nền tôi sẽ dùng tông Dark Mode (tối) chữ cam/vàng, vì quán nhậu thường thiếu sáng. **Nút "Gọi món" phải to bằng 1/3 màn hình**, đảm bảo khách say tới mức mắt hoa vẫn bấm trúng!

**@Tester**: Kịch bản test của tôi: Khách vào tầng hầm/góc khuất không có Wifi, dùng 4G chập chờn thì sao? Khách bấm "Gọi bia" liên tục 5 lần vì tưởng mạng lag, hệ thống xử lý (Debounce/Rate Limit) thế nào để bếp không bị in ra 5 tờ bill giống nhau?

**@DataAnalyst**: Khi làm tính năng này, @Backend nhớ lưu lại cho tôi trường `Platform=SelfOrder`. Tôi muốn đo lường xem: Cùng một bàn, nếu nhân viên ra order và khách tự order, thì cái nào mang lại hóa đơn giá trị cao hơn. Nhờ đó @Business sẽ quyết định có nên triển khai đồng loạt 100% bàn hay không.

---

### KẾT LUẬN & QUYẾT ĐỊNH (Resolutions)

1. **Chốt nghiệp vụ:** Làm QR Code, nhưng khách thao tác gọi xong thì thu ngân/nhân viên sẽ nhận một "Draft Order" (Đơn nháp) trên app. Nhân viên chỉ cần liếc mắt sang bàn khách gật đầu xác nhận 1 chạm là lệnh bay xuống bếp (Dung hòa giữa @Business và @Staff).
2. **Kỹ thuật:** Sử dụng JWT Token có hạn sử dụng ngắn (Dynamic QR) như @Architect đề xuất, kết nối Real-time bằng SignalR (@Backend, @DevOps).
3. **Mặt trận UI/UX:** Dark mode, nút siêu to khổng lồ, Rate Limit chống bấm đúp (@Frontend, @Tester).
