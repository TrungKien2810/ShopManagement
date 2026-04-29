# Biên bản Đánh giá Kiến trúc (Agent Council Review) 🛡️
**Chủ đề:** Review tính năng Mời Nhân sự (Staff Invitations) và Cấu trúc Backend Quản lý Không gian (Space Management)
**Ngày:** 2026-04-19

---

## 1. Đánh giá UI & Frontend (Từ `@Frontend Specialist`)
### ✅ Những điểm đã đạt được (Awesome Design Standard)
- **Kiến trúc DOM hoàn hảo**: Modal `InviteStaffModal.tsx` đã sử dụng `React Portal` để neo trực tiếp vào `document.body` với `z-index: 999`. Hiện tượng Dropdown nuốt z-index đã biến mất hoàn toàn.
- **Thẩm mỹ (Aesthetics)**: Việc tạo các thẻ Phân quyền theo màu đặc trưng ("Manager = Linear Purple", "Staff = Emerald Green") mang lại khả năng định vị bằng thị giác rất tốt cho người dùng. 
- **Animation**: PWA layout chuyển cảnh sử dụng `Framer Motion` mượt mà, bao gồm cả hệ thống bắt lỗi (Error Handling) được tích hợp trực tiếp vào Form chứ không dùng thẻ `alert` nhàm chán.

### ⚠️ Điểm cần cải thiện
- Chức năng gọi API đang hoạt động (gọi vào `/api/shop/{id}/invite`) nhưng **Notification System** hiện tại chỉ tự đóng Modal sau 2 giây. Trong tương lai, bộ khung Frontend cần có Context/Redux Global Notification để thông báo góc màn hình nổi bọt lên đẹp hơn.

---

## 2. Đánh giá Cấu trúc Backend (Từ `@Architect`)
### ✅ Những điểm đã đạt được
- Tính năng **Staff Invitation** đã có sẵn API trong `ShopController.cs` (`POST /{shopId}/invite`). Logic đã bao gồm kiểm tra quyền (Chỉ Owner/Manager mới được mời) và tra cứu `ApplicationUser`, đây là tư duy bảo mật Multi-tenant rất chuẩn. 

### 🚨 Rủi ro tiềm ẩn ở phần Quản lý Không gian (Space / Area / Table)
- **Cấu trúc Schema hiện tại**: Entity `Table.cs` hiện đang quản lý khu vực bằng 1 chuỗi string `Location` đơn giản, trong khi DB đã có định nghĩa Entity `Area.cs` nhưng chưa được Mapping chặt chẽ bằng Foreign Key (`AreaId`).
- **Nếu tiến hành Implement tiếp**:
    1. Chúng ta sẽ phải thêm `public Guid? AreaId { get; set; }` vào `Table`.
    2. Chạy EF Core Migration (Điều này cực kì nhạy cảm vì DB có thể bị Locked nếu đang có dữ liệu).
    3. Tạo `AreaController` với đầy đủ CRUD.
    4. Sửa `TablesController` để nhận `AreaId`.

**👉 Khuyến nghị từ Kiến trúc sư:** Trước khi code Backend cho phần Tạo Khu Vực/Bàn, chúng ta nên giữ thiết kế `Location` (String) thêm 1 thời gian cho bản MVP để tránh làm phình to Entity không cần thiết. Trừ khi Business YÊU CẦU bắt buộc Khu vực phải có dữ liệu riêng biệt (VD: Tính phụ thu theo Zone), dùng String `Location` group by ở Frontend sẽ hiệu quả hơn x10 lần về mặt hiệu suất.

---

## 3. Khuyến nghị Nghiệp vụ (Từ `@Business Analyst`)
- **Về Nhân sự**: Quy trình "Thêm thẳng vào quán" sau khi gõ Username là một luồng (flow) rất nhanh cho tiệm nhỏ. Tuy nhiên, với SaaS lớn, người dùng sẽ bị add vào quán mà không có thông báo đồng ý (Acceptance). Tạm thời luồng này ổn định cho MVP, nhưng cần nâng cấp "Email Invitation Link" trong Phase 3.
- **Quyết định chuyển tiếp (Next Steps)**: Đồng ý xả code UI cho phần "Mời Nhân Sự". Tạm thời Pending việc băm nhỏ DB cho "Khu Vực", đề xuất hiển thị Khu Vực qua bộ lọc từ giá trị `Location` của `Table`.
