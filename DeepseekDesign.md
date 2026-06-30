Bạn là một chuyên gia thiết kế UI/UX cao cấp, từng thiết kế cho các hệ thống quản lý nhà hàng được đánh giá cao trên Dribbble, Behance và từng đoạt giải A' Design Award. Tôi cần bạn nâng cấp TOÀN BỘ giao diện Web cho Hệ thống quản lý quán nhậu (Beer & Pub Restaurant Management System) dựa trên ASP.NET MVC với các file .cshtml.

⚠️ QUAN TRỌNG: Tôi muốn giao diện TRÔNG TỰ NHIÊN NHẤT có thể, không bị "template" hay "AI-generated". Hãy áp dụng các nguyên tắc thiết kế từ các sản phẩm thực tế đã được chứng minh là thành công.

---

## 🎨 DESIGN SYSTEM (Áp dụng toàn bộ hệ thống)

### Màu sắc (Tham khảo từ các thiết kế đoạt giải):
- **Nền chính**: Trắng (#FFFFFF) hoặc Xám nhạt (#F8F9FA)
- **Màu nhấn DUY NHẤT**: Vàng/Da bò (#D4A373) hoặc Cam đậm (#E63A00) - CHỈ dùng 1 màu nhấn xuyên suốt[reference:16]
- **Text chính**: Đen than (#1A1A2E) hoặc Xám đậm (#2D2D2D)
- **Text phụ**: Xám vừa (#6B7280)
- **Border/Divider**: Xám siêu nhạt (#E5E7EB)
- **Shadow**: Soft elevation, không quá đậm[reference:17]
- **Status colors**: Xanh (#10B981) - Trống, Vàng (#F59E0B) - Đang dùng, Đỏ (#EF4444) - Cần dọn[reference:18]

### Typography:
- **Font chính**: Inter hoặc Plus Jakarta Sans (hiện đại, dễ đọc trên mọi thiết bị)[reference:19]
- **Font size hệ thống**: 12px (phụ), 14px (body), 16px (subtitle), 20px (title), 24px+ (heading)

### Spacing & Layout:
- **Grid system**: 12-column, gutter 16-24px[reference:20]
- **Card**: Bo góc 12-16px, shadow nhẹ (0 1px 3px rgba(0,0,0,0.06)), padding 16-24px[reference:21]
- **Whitespace**: Tối thiểu 16px giữa các component, tối đa 32px cho các section chính[reference:22]

---

## 📄 CHI TIẾT TỪNG TRANG

### 1. Nhóm Quản lý Tài khoản (Account)

**Login.cshtml**:
- Bố cục: **Split screen** - 50% ảnh nền (không gian quán nhậu/ly bia), 50% form đăng nhập
- Form: Glassmorphism nhẹ (nền trắng đục, blur 10px), căn giữa hoàn toàn
- Input: Có icon trái (User, Lock), border khi focus chuyển sang màu nhấn
- Nút Login: Màu nhấn, full width, có hiệu ứng hover scale(1.02)
- Link "Quên mật khẩu" và "Đăng ký" ở dưới cùng
- **Tham khảo**: Thiết kế đăng nhập của các POS system hiện đại[reference:23]

**Register.cshtml**:
- Bố cục tương tự Login nhưng chia làm 2 bước (Step 1: Thông tin cá nhân, Step 2: Thông tin cửa hàng)
- Progress bar ở trên cùng hiển thị trạng thái
- Validation: Hiển thị lỗi ngay dưới mỗi input (màu đỏ), không dùng alert popup

**Profile.cshtml**:
- Layout: Avatar lớn (có thể upload) bên trái, thông tin bên phải
- Chia tab: "Thông tin chung" | "Bảo mật" | "Lịch sử hoạt động"
- Avatar: Hình tròn, có hover effect "Đổi ảnh"

**ChangePassword.cshtml**:
- Dạng Modal hoặc Page nhẹ, chỉ 3 trường
- Có thanh hiển thị độ mạnh mật khẩu (Weak/Medium/Strong) với màu sắc tương ứng

**AccessDenied.cshtml**:
- Trang 403 có illustration (vector lock hoặc forbidden)
- Nút "Quay lại trang chủ" màu nhấn

---

### 2. Trang chủ & POS (Home) - QUAN TRỌNG NHẤT

**Index.cshtml (POS)**:
Đây là trung tâm của hệ thống, cần được thiết kế **tối ưu cho touch** (dùng trên tablet)[reference:24].

**Bố cục** (Flex/Grid, KHÔNG dùng bảng):
- **Bên trái (65%)**: Sơ đồ tầng (Floor Plan)
  - Hiển thị các bàn ăn dạng **Card/Block** với trạng thái màu:
    - 🟢 Xanh (#10B981): Trống
    - 🟡 Vàng (#F59E0B): Đang dùng
    - 🔴 Đỏ (#EF4444): Cần dọn
  - Mỗi bàn hiển thị: Tên bàn (Bàn 1, Bàn 2...) + Số người đang ngồi (nếu có)
  - **Click vào bàn**: Mở popup/slide-over hiển thị order hiện tại, có nút "Thêm món", "Chuyển bàn", "Tách hóa đơn"
  - Có dropdown chọn khu vực (Tầng 1, Tầng 2, Sân vườn...)[reference:25]

- **Bên phải (35%)**: Order Cart - Real-time
  - Header: Tên bàn đang phục vụ + số lượng món
  - Danh sách món đã chọn: Mỗi món là 1 row nhỏ, có tên, số lượng (có nút +/-), giá, nút xóa
  - Tổng tiền: Hiển thị nổi bật ở cuối, font lớn
  - Nút "Thanh toán" - Màu nhấn, full width, size lớn (dễ touch)
  - **Tham khảo**: CosyPOS layout[reference:26] và Tabetei POS[reference:27]

- **Thanh công cụ nhanh** (phía trên cùng hoặc dưới cùng):
  - Nút "Gộp bàn", "Tách hóa đơn", "In hóa đơn tạm"

**Privacy.cshtml**:
- Nội dung chính sách bảo mật, hiển thị trong Modal hoặc Page đơn giản
- Font nhỏ, chia cột cho dễ đọc

---

### 3. Nhóm Quản lý Cửa hàng (Shop)

**Index.cshtml**:
- Hiển thị danh sách cửa hàng dạng **Card Grid** (3 cột trên desktop)[reference:28]
- Mỗi Card: Logo (hình tròn), Tên cửa hàng (font lớn), Địa chỉ (font nhỏ), Số chi nhánh, Trạng thái (Online/Offline - dạng dot màu), nút "Vào quản lý"
- Thanh tìm kiếm + bộ lọc trạng thái ở trên cùng
- Nút "Thêm cửa hàng" nổi bật (màu nhấn)

**Create.cshtml**:
- Form chia 3 bước (Step wizard) - sử dụng progress indicator
- Step 1: Tên, SĐT, Email
- Step 2: Địa chỉ (có tích hợp Google Maps picker)
- Step 3: Cấu hình thuế, Mã số thuế

**Settings.cshtml**:
- Sử dụng Tab: "Thông tin chung" | "Hóa đơn & In ấn" | "Tích hợp"
- Mỗi setting là 1 row: Label bên trái, Control bên phải (input/switch/select)
- Switch có animation mượt

---

### 4. Nhóm Quản lý Chi nhánh (Branch)

**Index.cshtml**:
- Dạng **Table** hiện đại (không có border cứng, dùng divider mảnh)[reference:29]
- Các cột: Tên chi nhánh | Địa chỉ | Số bàn | Trạng thái (Badge) | Ngày tạo | Hành động (Icon buttons: Edit, Delete)
- Hover row: Background đổi màu nhẹ
- Nút "Thêm chi nhánh" ở góc phải trên cùng

**Create.cshtml**:
- Form đơn giản, 2 cột
- Tích hợp bản đồ chọn vị trí (Mapbox hoặc Google Maps)

---

### 5. Nhóm Quản lý Thực đơn (Menu) - QUAN TRỌNG

**Index.cshtml**:
- **Layout 2 cột**:
  - **Bên trái (25%)**: Danh sách danh mục (Categories) - dạng Vertical Tabs hoặc Accordion[reference:30]
    - Mỗi danh mục có: Icon nhỏ + Tên + Số lượng món
    - Màu sắc: Mỗi danh mục một màu nhấn riêng (pastel)[reference:31]
  - **Bên phải (75%)**: Danh sách món dạng **Card Grid** (3-4 cột)[reference:32]
    - Mỗi Card: Ảnh món (trên cùng), Tên món, Giá, Trạng thái (Còn/Bán hết - Badge), Nút Edit (icon), Toggle Ẩn/Hiện (switch nhỏ)
    - Card có hover effect: scale(1.02) + shadow đậm hơn
- Thanh tìm kiếm + bộ lọc (theo danh mục, giá, trạng thái) ở trên cùng

**CreateCategory.cshtml / EditCategory.cshtml**:
- Form 2 trường: Tên danh mục, Icon (chọn từ thư viện Emoji hoặc Icon set)
- Preview icon bên cạnh

**CreateProduct.cshtml / EditProduct.cshtml**:
- Form chia 2 cột:
  - **Cột trái**: Tên món, Mô tả (textarea), Giá bán, Giá vốn, Danh mục (dropdown)
  - **Cột phải**: Upload ảnh (drag-and-drop)[reference:33], Preview ảnh, Tùy chọn (Size, Topping)
- Nút "Lưu" và "Lưu và tạo mới" ở dưới cùng

---

### 6. Nhóm Quản lý Bàn ăn (Table)

**Index.cshtml**:
- Dạng **Table** hiện đại với các cột[reference:34]:
  - Mã bàn | Tên bàn | Khu vực (Badge) | Sức chứa | Trạng thái (Badge màu) | Hành động
- Nút "Tạo bàn hàng loạt" và "Sắp xếp lại sơ đồ"
- Có thể kéo thả (drag-drop) để sắp xếp lại thứ tự bàn

**Create.cshtml / Edit.cshtml**:
- Form: Tên bàn, Chọn khu vực (dropdown), Sức chứa (number)
- Optional: Chọn vị trí trên sơ đồ (mini floor plan)

**Areas.cshtml**:
- Dạng Card Grid: Mỗi khu vực là 1 Card, hiển thị tên, số bàn, nút Edit/Delete

---

### 7. Nhóm Hóa đơn & Đơn hàng (Order)

**Index.cshtml**:
- **Table** với các cột[reference:35]:
  - Mã đơn | Bàn | Tổng tiền | Thời gian | Trạng thái (Badge: Chờ/Đang phục vụ/Đã thanh toán/Hủy)[reference:36] | Nhân viên
- Bộ lọc: Theo ngày (date picker), Theo trạng thái (dropdown)
- Click vào dòng → Mở Modal xem chi tiết hóa đơn
- Xuất file: Nút "Xuất Excel" và "Xuất PDF" ở trên cùng

---

### 8. Nhóm Thanh toán (Payment)

**Checkout.cshtml**:
- Layout 2 cột:
  - **Bên trái (60%)**: Hóa đơn tóm tắt - Danh sách món, số lượng, đơn giá, tổng tiền
  - **Bên phải (40%)**: Phương thức thanh toán (Card: Tiền mặt, Chuyển khoản, Thẻ quẹt)[reference:37]
- Nút "Xác nhận thanh toán" (màu nhấn, size lớn) và "In hóa đơn"
- Có checkbox "Gửi hóa đơn qua email/SMS"

**Receipt.cshtml**:
- Thiết kế dạng **biên lai giấy** nhưng hiển thị trên màn hình
- Thông tin: Logo quán, Tên quán, SĐT, Địa chỉ (ở trên cùng)
- Danh sách món (dạng bảng đơn giản)
- Tổng tiền (font lớn, đậm)
- Mã QR thanh toán (ở cuối)
- Nút "In" và "Quay lại"

---

### 9. Nhóm Báo cáo & Thống kê (Report) - QUAN TRỌNG

**Index.cshtml**:
- **KPI Cards** ở trên cùng (4-5 card)[reference:38]:
  - Doanh thu hôm nay | Số đơn hôm nay | Trung bình đơn/bàn | Tỉ lệ quay lại | Nhân viên xuất sắc
- **Biểu đồ** (sử dụng Recharts/Chart.js/ApexCharts):
  - Biểu đồ cột (Bar): Doanh thu theo ngày trong tuần[reference:39]
  - Biểu đồ tròn (Pie): Tỉ lệ doanh thu theo danh mục món[reference:40]
  - Biểu đồ đường (Line): Xu hướng khách hàng theo giờ (xác định giờ vàng)[reference:41]
- **Bảng Top 5**:
  - Top 5 món bán chạy (có ảnh thumbnail, tên, số lượng bán)
  - Top 5 nhân viên phục vụ tốt nhất (có avatar, tên, số đơn phục vụ)
- Bộ lọc thời gian: Hôm nay, Tuần này, Tháng này, Tùy chỉnh

---

### 10. Nhóm Giao diện Dùng chung (Shared) - QUAN TRỌNG

**_Layout.cshtml**:
- **Sidebar** (bên trái, thu gọn được)[reference:42]:
  - Logo + Tên hệ thống (ở trên cùng)
  - Menu items: Dashboard, POS, Cửa hàng, Chi nhánh, Thực đơn, Bàn ăn, Đơn hàng, Báo cáo, Cài đặt
  - Mỗi item có Icon + Label
  - Item đang active: Màu nhấn (background hoặc text)
  - Cuối sidebar: Avatar + Tên nhân viên đang đăng nhập
- **Topbar** (phía trên):
  - Bên trái: Tên cửa hàng/chi nhánh đang làm việc (có dropdown để chuyển)
  - Bên phải: Thông báo (icon bell + số lượng), Avatar + Tên, Nút Logout
- **Main Content**: Padding 24px, nền trắng/xám nhạt

**_FlashMessages.cshtml**:
- Toast notification ở góc phải trên cùng
- 4 loại: Success (xanh), Error (đỏ), Warning (vàng), Info (xanh dương)
- Tự động biến mất sau 3-5 giây, có nút đóng (X)

**Error.cshtml**:
- Trang lỗi 404/500 với illustration
- Thông báo thân thiện, gợi ý quay lại trang chủ
- Có nút "Quay lại" và "Báo cáo sự cố"

---

## 🔧 YÊU CẦU KỸ THUẬT

### Micro-interactions (BẮT BUỘC):
- **Hover**: Card scale(1.02) + shadow đậm hơn[reference:43]
- **Click**: Ripple effect hoặc feedback tức thì
- **Loading**: Skeleton loading cho danh sách, Spinner cho nút
- **Transition**: Tất cả animation 150-300ms, ease-in-out
- **Toast**: Trượt vào từ phải, trượt ra sau 3s

### Responsive (BẮT BUỘC)[reference:44]:
- **Desktop (>1024px)**: Full layout, sidebar mở
- **Tablet (768-1024px)**: Sidebar thu gọn (chỉ icon), card grid 2 cột
- **Mobile (<768px)**: Sidebar thành hamburger menu, card grid 1 cột, POS chuyển thành 1 cột (cart ở dưới cùng)

### Touch Optimization (CHO POS)[reference:45][reference:46]:
- Nút tối thiểu 44x44px (dễ touch)
- Khoảng cách giữa các nút tối thiểu 8px
- Không dùng hover trên tablet (dùng active state)
- Gesture: Vuốt để xóa món trong cart

---

## 💻 CODE MẪU YÊU CẦU

Sau khi mô tả xong, hãy viết **đoạn code mẫu** cho component **Table Card** (sơ đồ bàn ăn) bằng React + TailwindCSS (hoặc HTML/CSS/JS thuần nếu giữ MVC), thể hiện:
1. Card bàn với 3 trạng thái (Trống/Đang dùng/Cần dọn)
2. Hover effect
3. Click → mở modal/popup
4. Responsive trên tablet và mobile

---

## 🎯 MỤC TIÊU CUỐI CÙNG

Giao diện sau khi nâng cấp phải:
1. **Trông tự nhiên**, không bị "template" hay "AI-generated"
2. **Cảm giác cao cấp**, xứng tầm với thương hiệu quán nhậu
3. **Tối ưu cho tablet** (vì nhân viên phục vụ dùng iPad)
4. **Màu sắc hài hòa**, chỉ dùng 1 màu nhấn duy nhất
5. **Card-based layout** xuyên suốt
6. **Micro-interactions** mượt mà

Hãy bắt đầu ngay!