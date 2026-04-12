# Bản vẽ Thi công (Implementation Plan) - Story 01

**Tính năng**: API Mở Bàn (Open Table & Session Gen)
**Tham chiếu Cốt lõi**: `docs/stories/story_01_open_table_api.md`

## 1. Mục tiêu (Goal)
Xây dựng Endpoint `POST /api/tables/{id}/open` giúp nhân viên thiết lập trạng thái bàn từ "Trống" sang "Đang phục vụ", đồng thời tạo ra một Hóa đơn (Order) mới trong hệ thống.

## 2. Đề xuất Thay đổi Code (Proposed Changes)

Dựa trên nguyên tắc Clean Architecture, mình sẽ dàn trải luồng code qua các lớp như sau:

### [Application Layer] - Xử lý Nghiệp vụ lõi
- **[NEW] `ShopManagement.Application/DTOs/Tables`**: 
  - Tạo `OpenTableResponse.cs` (Chứa `OrderId` và `SessionToken`).
- **[NEW] `ShopManagement.Application/Interfaces/ITableService.cs`**:
  - Khai báo hàm `Task<OpenTableResponse> OpenTableAsync(Guid tableId);`
- **[NEW] `ShopManagement.Application/Services/TableService.cs`**:
  - Chứa thuật toán kiểm tra: 
    1. Tìm Bàn theo `id`. (Nếu không thấy -> Báo lỗi 404).
    2. Nếu `Status == InUse` -> Ném Exception `Bad Request` (Bàn đang có người).
    3. Cập nhật `Status = InUse`.
    4. Khởi tạo Object `Order` mới: `TableId = id`, `Status = Open`, `CheckInTime = Now`, `SessionToken = Guid.NewGuid().ToString()`.
    5. Unit of Work: Lưu Table và Order xuống Database trên CÙNG 1 TRANSACTION (Bảo toàn dữ liệu).

### [WebAPI Layer] - Giao tiếp bên ngoài
- **[NEW] `ShopManagement.WebAPI/Controllers/TablesController.cs`**:
  - Tạo API `[HttpPost("{id}/open")]`.
  - Cấu hình Dependency Injection (`builder.Services.AddScoped<ITableService, TableService>()`) trong `Program.cs`.

## 3. Câu hỏi Cần Sếp Duyệt (User Review Required)

> [!WARNING]
> Mình cần Sếp chốt 1 điểm kỹ thuật nhỏ trước khi đập bàn phím viết Code:
> Về "Chìa khóa" (Session Token) sinh ra để gắn vào mã QR, hiện tại mình đang đề xuất sinh tạm bằng 1 chuỗi ngẫu nhiên (`Guid.NewGuid()`) và lưu vào bảng Hóa đơn (`Order.SessionToken`). Cách này code cực nhanh cho MVP. Sếp có thấy OK không, hay muốn áp dụng JWT Token xịn xò (Header Auth) ngay từ vòng này luôn?

---
*Ghi chú cho Agent: Nếu Sếp gật đầu chốt, lập tức chuyển Mode sang EXECUTION và phun Code ra.*
