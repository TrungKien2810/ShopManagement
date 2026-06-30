# HANDOFF — context / nguồn sự thật

> File này là điểm "tiếp tục từ đây" cho người/agent kế tiếp. Giữ nó là nguồn sự
> thật prose; cập nhật khi trạng thái dự án đổi. Trạng thái số liệu tự sinh ở
> [STATUS.md](STATUS.md).

## Dự án là gì
**ZôOS** — SaaS multi-tenant quản lý nhà hàng/quán nhậu (POS). Một `User` sở hữu hoặc
làm nhân viên cho nhiều `Shop`; dữ liệu nghiệp vụ (Bàn, Món, Đơn) cô lập theo `ShopId`
qua EF Core Global Query Filter. Backend .NET 9 WebAPI (Clean Architecture) +
React 19/Vite frontend, real-time qua SignalR. Chi tiết stack/golden rules/lệnh dev:
[AGENTS.md](AGENTS.md) (nguồn sự thật duy nhất, không lặp lại ở đây).

## Trạng thái hiện tại
- **Đã xong (Giai đoạn 1 — Core MVP)**: Multi-tenancy + Identity/JWT/RBAC theo Shop,
  Quản lý Bàn (mở/thanh toán/dọn bàn), Menu & Gọi món với Rule Engine duyệt tự động
  (luồng xanh/đỏ) + SignalR real-time Khách→Bếp→Thu ngân, QR Order, ghi nhận Payment.
  Báo cáo doanh thu 7 ngày cơ bản đã có API + UI. Xem
  [docs/requirements/MASTER_ROADMAP.md](docs/requirements/MASTER_ROADMAP.md).
- **Đang làm (chưa commit)**: Re-skin toàn frontend sang theme **"Ember Bistro"** (warm
  dark, xem [DESIGN.md](DESIGN.md)) + viết lại `MenuManagement.tsx` (UI quản lý menu) +
  component `PageHeader.tsx` mới. Commit gần nhất `1ccb21f` là checkpoint trước đợt
  rewrite này — working tree hiện có ~19 file frontend sửa dở, chưa commit.
- **Kế hoạch (Giai đoạn 2, chưa code)**: Shift Management (phân ca, chấm công), User
  UX (profile dropdown, multi-tenant switcher, quota Freemium), Staff Invitations &
  Space Management. **Backlog (Giai đoạn 3)**: Z-Report, KDS, Kiểm kho, Analytics mở
  rộng. Xem [IDEAS.md](IDEAS.md) + MASTER_ROADMAP.md cho chi tiết.

## Cách chạy
```bash
# Backend
dotnet build
dotnet run --project src/ShopManagement.WebAPI/ShopManagement.WebAPI.csproj
dotnet test

# Frontend
cd client-app
npm install
npm run dev      # vite dev server
npm run build    # tsc -b && vite build
npm run lint     # eslint
```
