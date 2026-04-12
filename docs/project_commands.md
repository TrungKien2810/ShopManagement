# Tổng hợp các Lệnh Dự án (Project Commands Cheat Sheet)

Tài liệu này lưu lại các lệnh quan trọng đã dùng để khởi tạo và phát triển dự án. Bạn có thể dùng nó để tra cứu hoặc chạy lại khi cần.

---

## 1. Backend (.NET 8/9)

### Khởi tạo Solution và Projects

```bash
# Tạo file Solution (Quản lý chung)
dotnet new sln -n ShopManagement

# Tạo các Project con (Library và WebAPI)
dotnet new classlib -n ShopManagement.Domain -o src/ShopManagement.Domain
dotnet new classlib -n ShopManagement.Application -o src/ShopManagement.Application
dotnet new classlib -n ShopManagement.Infrastructure -o src/ShopManagement.Infrastructure
dotnet new webapi -n ShopManagement.WebAPI -o src/ShopManagement.WebAPI

# Thêm các Project con vào Solution
dotnet sln add src/ShopManagement.Domain/ShopManagement.Domain.csproj
dotnet sln add src/ShopManagement.Application/ShopManagement.Application.csproj
dotnet sln add src/ShopManagement.Infrastructure/ShopManagement.Infrastructure.csproj
dotnet sln add src/ShopManagement.WebAPI/ShopManagement.WebAPI.csproj
```

### Thiết lập quan hệ giữa các lớp (References)

```bash
# Application phụ thuộc vào Domain
dotnet add src/ShopManagement.Application/ShopManagement.Application.csproj reference src/ShopManagement.Domain/ShopManagement.Domain.csproj

# Infrastructure phụ thuộc vào Application
dotnet add src/ShopManagement.Infrastructure/ShopManagement.Infrastructure.csproj reference src/ShopManagement.Application/ShopManagement.Application.csproj

# WebAPI phụ thuộc vào Application và Infrastructure
dotnet add src/ShopManagement.WebAPI/ShopManagement.WebAPI.csproj reference src/ShopManagement.Application/ShopManagement.Application.csproj src/ShopManagement.Infrastructure/ShopManagement.Infrastructure.csproj
```

---

## 2. Frontend (React + TypeScript)

### Khởi tạo Project với Vite

```bash
# Tạo dự án React với template TypeScript
npm create vite@latest client-app -- --template react-ts

# Cài đặt các thư viện (Dependencies)
cd client-app
npm install

# Chạy thử dự án ở môi trường phát triển
npm run dev
```

---

## 3. Lệnh vận hành chung

### Kiểm tra phiên bản công cụ

```bash
dotnet --version  # Kiểm tra .NET SDK
node -v          # Kiểm tra Node.js
npm -v           # Kiểm tra trình quản lý gói của Node
```

### Build và Chạy dự án

```bash
# Build toàn bộ Solution
dotnet build

# Chạy Web API
dotnet run --project src/ShopManagement.WebAPI/ShopManagement.WebAPI.csproj
```

---

## Ghi chú về cấu trúc Folder

- **src/**: Chứa toàn bộ mã nguồn Backend.
- **client-app/**: Chứa toàn bộ mã nguồn Frontend.
- **docs/**: Chứa các tài liệu hướng dẫn, sơ đồ và lộ trình học tập.
