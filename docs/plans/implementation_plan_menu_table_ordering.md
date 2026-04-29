# Ban ve thi cong (Implementation Plan) - Menu + Mo ban + Tam tinh hien tai

## 0. Muc tieu
Hoan thien 3 luong van hanh noi bo (staff) cho quan:
1. Tao/quan ly menu (danh muc, mon, gia, 1 anh chinh, trang thai con ban/het ban).
2. Mo ban va them mon vao ban (goi mon, duyet mon "luong do").
3. Hien thi "tam tinh hien tai" cua ban (chi tinh mon da accept).

Pham vi: staff flow noi bo (co JWT + RBAC + ShopId). Khong lam QR/public flow trong dot nay.

## 1. Quyet dinh da chot (Owner)
- "Gia hien tai cua ban" = chi tinh mon da accept (khong tinh mon `NeedsApproval`).
- Mon het ban: van hien thi nhung `disabled` (khong cho chon), thay vi an.
- Moi mon chi co 1 anh chinh (`imageUrl`).
- UI label: "Tam tinh" (chua ap dung VAT/service charge/voucher trong dot nay).
- Staff flow noi bo (bat buoc auth + tenant header `ShopId`).

## 2. Hien trang (de canh bao truoc khi code)
- Backend menu co `AddCategoryAsync`, `AddProductAsync` nhung `MenuController` chi co `GET`:
  - `src/ShopManagement.Application/Services/MenuService.cs`
  - `src/ShopManagement.WebAPI/Controllers/MenuController.cs`
- Frontend menu dang goi raw axios + hard-code cong, khong di qua `apiClient` nen thieu JWT + ShopId:
  - `client-app/src/api/menuApi.ts`
  - `client-app/src/api/apiClient.ts`
- Enum trang thai mon bi map sai tren UI (nguy co hien thi/duyet sai):
  - UI dang coi `status === 1` la "Cho duyet"
  - Backend `OrderItemStatus.NeedsApproval = 3`, `Served = 1`:
    - `src/ShopManagement.Domain/Enums/OrderItemStatus.cs`
    - `client-app/src/components/OrderPage.tsx`
- Tong tien hien tai dang duoc tinh trong entity theo "khong huy", tuc hien tai se tinh ca `NeedsApproval`:
  - `src/ShopManagement.Domain/Entities/Order.cs`

## 3. Dinh nghia nghiep vu (nguon su that)
### 3.1 Accept la gi?
Voi dot nay, "accept" = cac item co `Status` thuoc: `Pending` hoac `Served`.
Khong tinh: `NeedsApproval`, `Cancelled`.

### 3.2 Tam tinh hien tai cua ban
- `CurrentAcceptedAmount` = sum(UnitPrice * Quantity) cua cac item accept.
- UI phai hien ro:
  - "Tam tinh (da accept)" = `CurrentAcceptedAmount`
  - "Cho duyet" = dem item `NeedsApproval` (chi de canh bao, khong cong vao tam tinh).

## 4. Thiet ke ky thuat (Backend)
### 4.1 API Menu Management (noi bo)
Muc tieu: Owner/Manager/Staff co the tu van hanh menu theo tenant `ShopId`.

De xuat endpoints (giu route gon, khong pha vo `api/[controller]`):
- `GET /api/menu` (da co) -> bo sung them `isActive/isAvailable` trong response.
- `POST /api/menu/categories` -> tao danh muc.
- `PUT /api/menu/categories/{id}` -> sua ten/mo ta, toggle `IsActive`.
- `POST /api/menu/products` -> tao mon.
- `PUT /api/menu/products/{id}` -> sua ten/gia/mo ta/anh, toggle `IsAvailable`.

Validate bat buoc:
- Category/Product phai thuoc `ShopId` hien tai (tenant boundary).
- Tao product phai check `CategoryId` ton tai va thuoc shop.

### 4.2 Anh san pham
Su dung `IPhotoService` (Cloudinary) da co.
De xuat endpoint upload chung (noi bo):
- `POST /api/photos` (multipart/form-data) -> return `url`
Sau do frontend set `imageUrl` cho product.

### 4.3 Them mon vao order (invariant)
Bo sung rule trong `OrderService.AddItemToOrderAsync`:
- Khong cho add neu `Order.Status != Open`.
- Khong cho add neu `Product.IsAvailable == false`.
- (Optional) Khong cho add neu `Category.IsActive == false`.

### 4.4 Tam tinh accepted (nguon su that)
Thay doi tinh tien:
- Khong dung `Order.CalculateTotal()` theo "khong huy" de lam "tam tinh".
- Them ham tinh accepted-only, hoac tinh ngay trong query DTO.

De xuat DTO:
- `OrderDto` bo sung:
  - `AcceptedAmount`
  - `NeedsApprovalCount`
Hoac thay `TotalAmount` thanh accepted-only (nhung can can nhac backward-compat UI).

## 5. Thiet ke ky thuat (Frontend)
### 5.1 Thong nhat API client
- `menuApi` phai dung `apiClient` de tu dong gan JWT + `ShopId`.
- Khong hard-code cong khac.

### 5.2 UI staff: Mo ban + goi mon + tam tinh
Muc tieu: tranh nham lan "tien mon dang chon" va "tam tinh ban".
- `OrderPage`:
  - Hien "Tam tinh (da accept)" tu backend.
  - Hien badge "Cho duyet (N)".
  - Fix mapping enum status (khong dung magic number).
- `OrderSidebar`:
  - Chi hien "Tam them lan nay" (pending selection), khong tu nhan la tong bill.
- `Dashboard`:
  - (P1) Hien "Tam tinh" tren card ban dang `InUse` (neu backend cung cap).

### 5.3 UI quan ly menu (Owner/Manager)
Man hinh toi thieu:
- Quan ly danh muc: list + tao + sua + bat/tat.
- Quan ly mon: list theo danh muc + tao + sua + bat/tat + upload 1 anh chinh.

Yeu cau UX:
- Mon het ban: hien disabled (khong clickable trong `MenuGrid`).
- Gia nhap vao format VN (format realtime), tranh nhap sai dinh dang.

## 6. Thu tu trien khai (Phasing)
### Phase A (P0) - Fix contract + an toan tenant
- Fix `menuApi` sang `apiClient`.
- Fix enum mapping `OrderItemStatus` tren UI (khong magic number).
- Backend: them API menu management (create/update/toggle) + validate tenant.
- Backend: chan add item neu order da checkout; chan add mon unavailable.
- Backend: dinh nghia accepted-only amount va tra ve cho UI.

### Phase B (P1) - UI quan ly menu + hien tam tinh
- UI menu management pages (owner/manager).
- UI order page: hien "Tam tinh (da accept)" va "Cho duyet".
- UI disabled item: menu grid render disabled state.

### Phase C (P2) - Polish + realtime
- Batch place-order (tranh loop tung item) + idempotency theo "1 lan confirm".
- Dashboard hien tam tinh tren card ban; reload theo SignalR.

## 7. Nghiem thu (Acceptance Criteria)
- Tao menu end-to-end: tao category, tao product co anh, toggle het ban -> mon disabled tren menu.
- Mo ban -> goi mon:
  - Them mon available thanh cong.
  - Them mon unavailable bi chan o backend va UI.
  - Mon vuot nguong -> `NeedsApproval` hien dung, co nut duyet, duyet xong tinh vao accepted amount.
- Tam tinh:
  - "Tam tinh (da accept)" khong cong mon `NeedsApproval`.
  - Tong tien duoc lay tu backend (1 nguon su that), UI chi render.
- Tenant:
  - Tat ca request menu/order/table bat buoc co JWT + `ShopId`.

## 8. Test can co (toi thieu)
- Backend tests:
  - Add item khi order `Paid` bi tu choi.
  - Add item voi product `IsAvailable=false` bi tu choi.
  - Accepted amount khong tinh `NeedsApproval`.
- Frontend sanity:
  - Mapping enum dung (NeedsApproval = 3).
  - Menu disabled item khong cho select.

## 9. Out of scope (dot nay)
- QR/public ordering flow.
- VAT/service charge/voucher/combo.
- Split/merge/transfer bill.
- Soft delete refactor toan he thong (se mo task rieng neu can).

