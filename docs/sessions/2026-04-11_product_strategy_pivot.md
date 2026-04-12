# Session Log: 2026-04-11 - Product Strategy Pivot (Phase 2 Ideas)

## Bối cảnh
Người dùng đề xuất hủy bỏ tính năng phân luồng Onboarding cũ và đưa ra một loạt ý tưởng mới:
1. Freemium Model: Miễn phí quán đầu tiên, giới hạn 5 nhân viên. Vượt quá phải nâng cấp (Trả phí).
2. Trang News (Job Board): Nơi đăng tin tuyển dụng/tìm việc.
3. AI Moderation: Kiểm duyệt nội dung đăng bằng AI (LLM).
4. Direct Messaging: Nhắn tin trao đổi giữa các User.
5. User Profile: Cập nhật Bio, Avatar, quản lý danh sách quán, đổi mật khẩu, đăng xuất.

## Phản biện Đa lăng kính (@Role)

### 1. @Business (Chủ Đầu Tư)
- **Tiered Pricing (Giới hạn 5 nhân viên)**: Tuyệt vời! Đây là "mỏ vàng" của SaaS. Freemium giúp thu hút người dùng nhanh, và giới hạn slot nhân viên là nút thắt (bottleneck) hoàn hảo để buộc các quán đang phát triển phải trả tiền.
- **Trang Tuyển dụng & Chat**: Có thể tạo ra "hiệu ứng mạng" (Network Effect), giữ chân user. Nhưng cẩn thận, nó không sinh ra tiền trực tiếp bằng tính năng quản lý cốt lõi.

### 2. @PO / @BA (Product Owner)
- **Cảnh báo Scope Creep (Phình to dự án)**: Cốt lõi của ZôOS là **Quản lý quán nhậu (POS, Order, Bếp)** (B2B). Việc thêm Bảng tin, Chat, AI Kiểm duyệt biến ứng dụng thành một **Mạng xã hội / Nền tảng tuyển dụng**. Nó phân tán nguồn lực trầm trọng.
- **User Profile**: Cực kỳ cần thiết. Đây là tính năng cơ bản bắt buộc phải có của mọi hệ thống.

### 3. @Architect & @Security
- **Tiered Pricing**: Cần tích hợp Payment Gateway (VNPay/MoMo), thiết kế cơ chế đếm Slot trong `ShopMembers`, chặn API Invite khi đạt giới hạn. 
- **Direct Messaging (Chat)**: Tốc độ phình to Database sẽ rất khủng khiếp. Đòi hỏi thiết kế NoSQL (MongoDB) hoặc partition cho tin nhắn. Dùng SignalR scale ra nhiều node rất tốn tiền server.
- **Bảo mật**: Mạng xã hội/Bảng tin sinh ra hàng tá vấn đề về Spam, Phishing, rác dữ liệu. AI LLM check content API gọi sẽ bị trễ (Latency ~2-3 giây), làm chậm trải nghiệm.

## Đề xuất Thay Thế Ban Đầu (Captain)
- Phanh lại (Hold) Job Board & Global Chat. Chuyển hướng "Global Chat" thành "Internal Shop Chat" hoặc tập trung vào Vận hành nhân sự.

---

## 🔥 QUYẾT ĐỊNH CUỐI CÙNG TỪ PRODUCT OWNER (USER LÝ LỊCH)
Sau quá trình review và mở rộng nghiên cứu thực tế, Product Owner (User) đã **chính thức bác bỏ hoàn toàn** định hướng Xã hội/Tuyển dụng và chốt lại **Chiến lược Quản lý Nguồn lực (Shift Management)** với các luồng Kỷ luật Sắt sau:

1. **Self-Service Scheduling có Ép KPI (Quản trị Tự Trị):**
   - Nhân viên được quyền tự mở App và chọn ca làm (Pick Shift) theo độ rảnh của cá nhân.
   - BẮT BUỘC có KPI Quota (Ví dụ: Yêu cầu tối thiểu 5 ca/tuần). Quản lý không cần xếp lịch mệt mỏi, nhân viên tự thân vận động để lấp đủ Quota nếu không muốn bị phạt.

2. **Lazy Check-in & Strict Check-out (Chấm công khóa sổ):**
   - Lược bỏ tính năng Check-in rườm rà lúc mới đến (vì quán nhậu lúc đông khách nhân viên hay quên).
   - Chỉ yêu cầu bắt buộc mở App chấm công (Check-out) vào thời gian kết thúc ca để chốt sổ tính lương.

3. **Cross-Shift Incident Reporting (Báo cáo Sai sót Giao ca chéo):**
   - Giải quyết triệt để vấn đề "Quýt làm Cam chịu" trong F&B.
   - Nhân viên ca sau khi vào nhận ca, nếu phát hiện thiếu hàng (Ví dụ: Bia hụt két, Bàn chưa dọn), có quyền tạo báo cáo sai sót đâm ngược lại đánh dấu lỗi cho ca trước.

*(Ghi chú: Toàn bộ quá trình hiện đang dừng ở mức lập Kế Hoạch, tuyệt đối không thi công Code cho đến khi bắt đầu phase Implementation chính thức).*
