# ZôOS - Nền tảng SaaS Quản lý Nhà hàng & Phân quyền Chi tiết

ZôOS (Zô Operating System) hiện tại là một giải pháp **SaaS Multi-tenant** hoàn chỉnh, giải quyết bài toán quản lý cho nhiều chủ quán trên cùng một hạ tầng duy nhất.

## 🎯 Mục tiêu Dự án Hiện tại (Chi tiết)
1. **Mô hình Đa chủ sở hữu (Multi-tenancy)**: 
   - Hệ thống cho phép một User có thể sở hữu nhiều Quán (Shop) hoặc làm nhân viên (Staff) cho nhiều Quán khác nhau.
   - Toàn bộ dữ liệu nghiệp vụ (Bàn, Món ăn, Đơn hàng) được cô lập bằng `ShopId`. Dữ liệu chỉ được truy xuất khi có `ShopId` hợp lệ trong Header và User có quyền truy cập tương ứng.
2. **Hệ thống Định danh & Phân quyền (Identity & RBAC)**:
   - Sử dụng **ASP.NET Core Identity** để quản lý tài khoản User toàn hệ thống.
   - Triển khai **RBAC cấp độ Tenant**: Quyền hạn của người dùng được xác định dựa trên vai trò của họ tại Shop đó (Owner, Manager, Staff).
3. **Vận hành "Một Chạm" & Real-time**:
   - Nhân viên thao tác mở bàn, gọi món với độ trễ tối thiểu.
   - Dashboard của chủ quán/quản lý cập nhật trạng thái bàn thời gian thực qua SignalR.
4. **Kiến trúc Clean Architecture & Logic Preservation**:
   - Đảm bảo code sạch, dễ mở rộng và mọi thay đổi kiến trúc đều được documented hóa ngay lập tức.

## 🏗️ Kiến trúc Công nghệ Hiện tại
- **Core Entities**: `Shop`, `ShopMember` (mapping User-Shop-Role), `ApplicationUser`.
- **Isolation Layer**: `ITenantService` trích xuất `ShopId` từ Header; `AppDbContext` sử dụng **Global Query Filters** để tự động lọc dữ liệu.
- **Security Layer**: JWT Authentication chứa thông tin UserId. RBAC Handler kiểm tra quyền hạn tại từng API.
- **Frontend Layer**: React 19 với `AuthContext` quản lý Login và `currentShop`. Mọi request API đều tự động đính kèm JWT và `ShopId`.

## 📜 Trạng thái Phát triển (SaaS Phase)
- [x] Cập nhật Database sang IdentityDbContext (SaaS Phase).
- [x] Triển khai Global Query Filter cho 100% thực thể nghiệp vụ.
- [x] API Auth (Register/Login) & Shop Management (Create/Invite).
- [x] Frontend Login & Shop Switcher.
- [x] Áp dụng Custom Authorization Policy (RequireShopRole).

## 2. Công nghệ sử dụng (Stack)
Dự án được tối ưu hóa cho môi trường .NET hiện đại, đảm bảo tính sẵn sàng cao và khả năng mở rộng.

- **Backend**: .NET 9 WebAPI, Entity Framework Core (SQL Server).
- **Frontend**: React 19 (Vite), TypeScript, Tailwind CSS.
- **Real-time**: ASP.NET Core SignalR (Sync đơn hàng Khách -> Bếp -> Thu ngân).
- **PWA**: Hỗ trợ Offline-first thông qua Service Workers và IndexedDB.
- **Security**: ASP.NET Core Identity + JWT Bearer Token (RBAC cấp độ Tenant).
- **Isolation**: EF Core Global Query Filters (Tự động lọc dữ liệu theo `ShopId`).

## 3. Kiến trúc lõi (DDD/Clean Architecture)
Để đảm bảo code "sạch" và dễ bảo trì trong dài hạn:
- **Domain**: Logic nghiệp vụ thuần túy (Bàn, Đơn hàng, Menu).
- **Application**: CQRS/CQRS Patterns, DTOs, Business Services.
- **Infrastructure**: Persistence (EF Core), External Services, SignalR Hubs.
- **WebAPI**: RESTful API Controllers, Middlewares, Identity Config.

## 4. Nguyên tắc Ngôn ngữ (Language Policy) - QUAN TRỌNG
- **Tất cả các cuộc hội thoại, ghi chú kiến trúc, và hướng dẫn cho Agent phải được thực hiện bằng TIẾNG VIỆT.**
- Code (Variable naming, Class, Method) vẫn sử dụng Tiếng Anh theo chuẩn quốc tế.
- Comment trong code: Sử dụng Tiếng Việt để giải thích logic nghiệp vụ phức tạp.

## 5. Quy tắc vận hành Agent
Mọi AI Agent tham gia dự án phải tuân thủ nghiêm ngặt các quy định tại:
👉 **[AI Agent Playbook (agent_playbook.md)](./agent_playbook.md)**

Các vai trò chính được giả lập: `@Architect`, `@Business`, `@Staff`, `@Tester`.
- Neo trí nhớ thông qua `docs/modules/` và `docs/sessions/`.
- Phản biện đa chiều trước khi thực thi.

## 6. Mục lục Module Chi tiết
Để hiểu sâu từng tính năng, AI **BẮT BUỘC** đọc các file sau khi làm việc với module tương ứng:
1. [Quản lý Bàn (Table Management)](../modules/table_management.md)
2. [Thực đơn & Gọi món (Menu & Ordering)](../modules/menu_ordering.md)
3. [QR Order (Dự kiến)](../modules/qr_order.md)
