# ShopManagement (ZôOS) — Agent Guide / Single Source of Truth

> Đây là **nguồn sự thật duy nhất** cho mọi AI agent làm việc trong repo này.
> Không có "đội ngũ agent giả lập", không session-log ceremony. Chỉ có dự án thật.

## 1. Dự án là gì
SaaS **multi-tenant** quản lý nhà hàng / quán ăn (POS). Một `User` có thể sở hữu
nhiều `Shop` hoặc làm nhân viên cho nhiều shop. Toàn bộ dữ liệu nghiệp vụ (Bàn, Món,
Đơn) cô lập theo `ShopId`.

## 2. Tech stack (thực tế trong repo)
.NET 9 **ASP.NET Core MVC truyền thống** (CSHTML, server-render), EF Core (SQL Server),
Clean Architecture — không còn SPA/WebAPI riêng, không có client-app/.
- `ShopManagement.Domain` — entity & logic nghiệp vụ thuần
- `ShopManagement.Application` — services, DTOs (dùng chung, không đổi khi migrate UI)
- `ShopManagement.Infrastructure` — EF Core, SignalR hubs, Identity, external services
- `ShopManagement.Web` — **MVC app duy nhất**: Controllers, ViewModels (`Models/`), Views (`.cshtml`),
  `wwwroot/` (CSS thuần "Ember Bistro", không Tailwind/build step)
  - Auth: ASP.NET Core Identity + Cookie (không còn JWT)
  - Chuyển Shop/Branch: lưu trong **Session** (`HttpContext.Session`), không phải claim JWT
  - Real-time: SignalR `ShopHub` tại `/hubs/shop`, client dùng `@microsoft/signalr` qua CDN script
- `ShopManagement.Tests` — test (chỉ reference Application + Domain)

## 3. Lệnh dev
```bash
dotnet build
dotnet run --project src/ShopManagement.Web/ShopManagement.Web.csproj
```

## 4. Golden rules (BẮT BUỘC)
- **Multi-tenant**: mọi action phải lấy `ShopId`/`BranchId` qua `ITenantService` (fallback:
  claim → header legacy → Session). EF Core dùng Global Query Filter lọc theo `ShopId`.
- **Tiền tệ**: `decimal(18,2)` + `MidpointRounding.AwayFromZero`. Không dùng `double/float`.
- **Soft delete** ưu tiên hơn xóa cứng, trừ khi user yêu cầu rõ "xóa vĩnh viễn".
- **DB change**: đổi schema ⇒ tạo EF Core Migration + cập nhật
  [docs/architecture/database_schema.md](docs/architecture/database_schema.md).
- **Ngôn ngữ**: thảo luận/tài liệu = Tiếng Việt; code, tên biến/hàm/class, commit = Tiếng Anh;
  comment giải thích logic phức tạp = Tiếng Việt.

## 5. Design direction — UI
- UI dùng theme **"Ember Bistro"** (warm dark: terracotta `#c2410c` + saffron-amber `#f4b541`,
  nền espresso `#0c0a09`). Display font **Fraunces**, body **Plus Jakarta Sans**.
- Tokens & utility class thuần CSS tại
  [src/ShopManagement.Web/wwwroot/css/site.css](src/ShopManagement.Web/wwwroot/css/site.css)
  (CSS custom properties, không Tailwind). Re-skin toàn cục bằng cách sửa token ở đây.
  Utility có sẵn: `linear-card`, `linear-surface`, `btn-primary`, `btn-secondary`, `btn-danger`,
  `badge`/`badge-available`/`badge-occupied`/`badge-pending`, `app-shell`/`app-sidebar`/`app-topbar`.
- Layout dùng app-shell (sidebar + topbar) khi đã đăng nhập; bare layout cho trang Login/Register.
- **Không** dùng lại theme tím/lạnh cũ (`#7c3aed`, `rgba(94,106,210)`).

## 6. Tài liệu tham chiếu (chỉ đọc khi task cần)
- Tổng quan: [docs/architecture/system_overview.md](docs/architecture/system_overview.md)
- DB schema: [docs/architecture/database_schema.md](docs/architecture/database_schema.md)
- Quy ước backend/frontend: [docs/architecture/backend_playbook.md](docs/architecture/backend_playbook.md),
  [docs/architecture/frontend_playbook.md](docs/architecture/frontend_playbook.md)
- Quy tắc tiền/kế toán: [docs/architecture/business_accounting_rules.md](docs/architecture/business_accounting_rules.md)
- Module (đọc trước khi sửa module tương ứng): [docs/modules/](docs/modules/)
- Roadmap / PRD: [docs/requirements/](docs/requirements/)

## 7. Cách làm việc
- Thiếu context thì tìm trong repo hoặc hỏi — **không giả định**.
- Thay đổi lớn (API/UI/DB): trình bày kế hoạch ngắn gọn trước, được duyệt rồi mới code.
- Giữ code sạch theo Clean Architecture; thay đổi nhỏ thì làm trực tiếp.
