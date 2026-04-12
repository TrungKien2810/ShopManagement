# Báo Cáo Kế Hoạch: Chức Năng Phân Ca & Quản Lý Vận Hành Nhân Sự (ZôOS)
*Cập nhật lần 2: 11-04-2026 (Chốt requirement từ Chủ dự án)*
*Mục đích: Lên kế hoạch chi tiết, đánh giá đa lăng kính trước khi thi công code.*

---

## 1. ĐÁNH GIÁ ĐA LĂNG KÍNH (@Role-Playing Report)

### 👨‍💼 @Business (Chủ Đầu Tư)
- **Pain Point:** Sắp xếp ca bằng Zalo gây thất thoát nhân sự lẩn tránh ca khó. Việc giao ca (Sáng -> Tối) thường xuyên xảy ra tình trạng mất đồ, đổ lỗi do không có bằng chứng.
- **Goal:**
    - Giao quyền tự do xếp ca cho nhân viên (để họ thoải mái), nhưng **áp đặt KPI (Quota)** (Ví dụ: 1 tuần bắt buộc phải làm tối thiểu 5 ca).
    - Tạo tính minh bạch, ai làm sai người đó chịu, không có chuyện "quýt làm cam chịu".

### 👩‍🍳 @Staff (Nhân Viên Vận Hành: Bếp/Phục Vụ)
- **Pain Point:** Hay bị vạ lây vì ca trước làm mất đồ nhưng đến ca mình mới phát hiện ra.
- **Requirements:** 
    - Xem được lịch trống và tự Pick (chọn) ca trên App.
    - **Tính năng Báo cáo Sai sót (Incident Report):** Cho phép report ngay khi nhận ca nếu thấy hàng hóa/bia bị thiếu hoặc dọn dẹp bẩn, để đẩy trách nhiệm cho nhân viên hệ ca trước.

### 📊 @Accountant (Kế Toán & Quản Lý Kho)
- **Requirements:** Chấm công (Time & Attendance) không cần rườm rà lúc vào, nhưng **Yêu cầu Bắt buộc Check-out** vào thời gian kết thúc ca để khóa sổ và lưu log chấm công. Báo cáo sai sót (thiếu đồ) sẽ nối trực tiếp vào báo cáo Tồn kho (Inventory Loss).

### 🏗 @Architect (Kiến trúc sư Trưởng)
- **Technical Risk:** 
    - **Cơ chế tranh giành ca (Concurrency):** Khi nhân viên tự chọn ca, nếu Slot ca chỉ có 3 người mà 5 người cùng bấm chọn, phải xử lý Queue/Booking hoặc Optimistic Lock để tránh vỡ ca.
    - **Báo cáo sai sót:** Phải tracking (truy vết) chính xác "Ai là người trực ca ngay trước đó" để gắn cờ (Flag) vào đúng hồ sơ nhân sự đó.

---

## 2. KẾ HOẠCH TÍNH NĂNG CHI TIẾT (PRODUCT ROADMAP)

### Phase 1: Smart Shift Management (Phân Ca Thông Minh KPI)
- **Quản lý (Manager):** 
    - Định nghĩa các Ca trống (Open Shifts) trong tuần và đẩy lên "Chợ Ca".
    - Thiết lập KPI cho từng mức độ nhân viên (Ví dụ: Phục vụ part-time = 4 ca/tuần). Hệ thống cảnh báo tự động nếu ai chưa pick đủ KPI.
- **Nhân viên (Staff):**
    - Mở App, thấy kho ca trống và tự Pick.
    - **Check-out Chấm Công:** Nút [Kết thúc ca] sẽ hiện ra vào cuối giờ. Bắt buộc phải bấm để hệ thống ghi nhận hoàn thành ca (Làm cơ sở tính lương).

### Phase 2: Shift Handover & Incident Report (Giao Ca & Báo Cáo Sai Sót)
- **Nhận ca (Check-in Validation):** 
    - Khi nhân viên chuẩn bị vào ca, App yêu cầu xác nhận nhanh: *"Bạn có phát hiện thiếu xót từ ca trước không? (Thiếu bia, bàn bẩn, két tiền hụt)"*.
    - Nếu phát hiện -> Bấm [Báo cáo sự cố] -> Chụp ảnh/Ghi chú -> Ticket đổ thẳng về điện thoại Manager và gắn cờ vào Staff ca trước.
- **Đóng ca (Closing Validation):** Cảnh báo nhân viên dọn dẹp kỹ, vì ca sau vào sẽ "soi" lại kết quả.

---

## 3. CẤU TRÚC DATABASE DỰ KIẾN (BẢN NHÁP - KHÔNG IMPLEMENT)
*(Tuyệt đối chưa viết code - Chỉ Note để thiết kế)*

1. `ShiftTemplate`: Lưu các mẫu ca (Sáng, Trưa, Tối).
2. `ShiftSlot` (Hoặc OpenShift): Đại diện cho số lượng chỗ trống trong 1 ngày (VD: Ca sáng T2 cần 3 chỗ).
3. `EmployeeSchedule`: Lưu việc Nhân viên đã Pick ca nào. Ghi nhận thời gian Checkout thực tế.
4. `ShopMember`: Thêm field `WeeklyShiftQuota` (Chỉ tiêu số ca/tuần).
5. `ShiftIncident` (Mới): Bảng lưu Báo cáo sai sót giao ca (Ai report, Report về ca nào, Hình ảnh minh chứng).

---

## 4. QUYẾT ĐỊNH CUỐI CÙNG TỪ PRODUCT OWNER (Chốt tính năng)

Dựa trên phản biện chuyên sâu, chúng ta chia hệ thống Phân Ca thành 2 phần (Bắt buộc & Tùy chọn) để tương thích với mọi loại hình quán:

### 🔴 NHÓM TÍNH NĂNG BẮT BUỘC (Core Flow)
- **Self-Service Scheduling & KPI:** Nhân viên giữ quyền tự mở App và chọn ca làm. Tuy nhiên, hệ thống sẽ giám sát bằng chỉ tiêu KPI Quota (Số ca tối thiểu trong tuần).
- **Cross-Shift Incident Reporting:** Báo cáo thiếu xót giao ca. Lỗi của ai người đó chịu, ca sau báo cáo ca trước.
- **Context-Aware User Profile (Sửa lỗi hiển thị UI Dropdown):** Không hiển thị "Vai trò" (Chủ quán/Nhận viên) hay "KPI Ca làm" nếu User chưa truy cập vào một quán cụ thể (ví dụ đang ở Landing Page/Dashboard tổng). Thông tin này chỉ hiện khi đã lọt vào "Context" của 1 Quán.

### 🟢 NHÓM TÍNH NĂNG TÙY CHỌN (Optional Modules)
- **Time Tracking (Chấm công Check-out):** Mặc định tính năng Ép Check-out kết thúc ca được đưa vào diện TÙY CHỌN (Toggle). 
  - Một số chủ quán sẽ chỉ dùng Web để "Xếp lịch làm việc", còn việc chấm công thực tế thì họ tự giám sát sổ sách bên ngoài.
  - Sẽ thêm 1 Flag `IsTimeTrackingEnabled` vào cấu hình Quán.

*(Kế hoạch đã được bảo tồn lịch sử phân tích và cập nhật quyết định đóng đinh. Hoàn toàn chưa xuất mã nguồn thi công).*

---

## 5. LẦN ĐÁNH GIÁ BỔ SUNG (PHẢN BIỆN LẦN 2 TỪ PRODUCT OWNER)
*Dựa trên góc nhìn sắc sảo của Chủ dự án: "Nhóm Bắt buộc đã thực sự bắt buộc chưa?"*

### 🧐 Phân tích Lỗ hổng (Gap Analysis):
Khi đóng vai `@Business` (Nhóm quản lý rập khuôn/truyền thống) và `@Staff` (Nhân sự thụ động), chúng ta nhận ra:
1. **Self-Service Scheduling (Nhân viên tự chọn ca):** Nếu để nhóm nhân viên thụ động làm việc này, họ sẽ luôn né ca cực (ca tối T7, CN). Chủ quán bắt buộc phải nhảy vào gán ca. Vì vậy, Hệ thống cần một cấu hình **Shift Allocation Mode (Chế độ Phân Ca)**:
   - `Auto/Self-pick`: Nhân viên tự giành ca (Có KPI).
   - `Manual/Forced`: Quản lý ép lịch từ trên xuống, nhân viên chỉ việc tuân thủ.
2. **Cross-Shift Incident Reporting (Báo cáo sai sót):** Chủ quán nhỏ lẻ đôi khi chỉ cần hét 1 tiếng ngoài đời là xong, bắt nhân viên lôi điện thoại ra bấm report có thể gây sứt mẻ tình cảm hoặc quá cồng kềnh với người low-tech. 

### 🎯 Quy Định Chốt Cuối Lần 2 (The Ultimate Logic)
SaaS của ZôOS phải là một nền tảng **Kiến tạo Khuôn Bấm (Toggle-driven Architecture)** siêu dẻo dai. 

**Về Cốt lõi (Core - Thực sự bắt buộc mang tính phần cứng):**
- Chỉ có 1 thứ duy nhất bắt buộc: **Mô hình Khung Giờ Làm Việc (Shift Slot)**. Hệ thống có hiển thị ca làm. Các thành phần còn lại đều là Tính năng bật tắt!

**Về Tùy chỉnh Quản trị (Shop Settings Toggles):**
- **Toggle 1: Phương thức Chọn Ca:** [ Tự do (nhân viên tự pick) | Ép buộc (Quản lý xếp) ]
- **Toggle 2: Chấm Công (Check-out):** [ Bật (Bắt buộc dùng App khóa sổ) | Tắt (Hết giờ tự đóng) ]
- **Toggle 3: Báo Cáo Sai Sót Chéo:** [ Bật (Phải report/xác nhận khi vào ca) | Tắt (Bỏ trang thái xác nhận) ]

*Quyết định này chuyển trục ZôOS từ một phần mềm "Cứng nhắc ép kỷ luật" thành một nền tảng "Quản trị Tùy chỉnh (Highly Configurable)", chiều chuộng được cả chủ quán Gen Z công nghệ lẫn chủ quán truyền thống.*
