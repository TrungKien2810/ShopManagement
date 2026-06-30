# technical-design — kiến trúc & quyết định (ADR)

> Ghi các quyết định kiến trúc kèm LÝ DO, để sau này không phải đoán. Mỗi quyết
> định một mục; lịch sử dạng dòng ở [decisions-log.md](decisions-log.md).

## AD-1: Multi-tenancy qua `ShopId` + EF Core Global Query Filter
- **Bối cảnh:** Một hệ thống dùng chung cho nhiều quán (Shop); User có thể sở hữu/làm
  nhân viên nhiều Shop. Phải đảm bảo Shop A không bao giờ thấy dữ liệu Shop B.
- **Quyết định:** Mọi bảng nghiệp vụ có cột `ShopId`; `ITenantService` trích `ShopId`
  từ JWT/Header; `AppDbContext` áp Global Query Filter tự lọc theo `ShopId` ở mọi query.
- **Lý do / đánh đổi:** Cô lập dữ liệu ở tầng DB-access (khó quên filter ở 1 chỗ) thay
  vì lọc tay từng query; đánh đổi là phải cực kỳ cẩn thận khi cần query xuyên-tenant
  (admin) — phải tắt filter có chủ đích, không patch vòng quanh.

## AD-2: Tiền tệ — `decimal(18,2)` + `MidpointRounding.AwayFromZero`
- **Bối cảnh:** F&B nhạy với sai số làm tròn (VAT 8–10%, phí phục vụ 5%); 1 đồng lệch
  cũng làm kế toán cuối ngày khó chốt sổ.
- **Quyết định:** Toàn hệ thống dùng `decimal` cho mọi trường tiền (không `float/double`);
  thứ tự tính: Tổng tiền hàng → trừ khuyến mãi → cộng phí phục vụ → cộng VAT; làm tròn
  thống nhất bằng `MidpointRounding.AwayFromZero`. Chi tiết: business_accounting_rules.md.
- **Lý do / đánh đổi:** Nhất quán toàn hệ thống quan trọng hơn tối ưu hiệu năng nhỏ của
  `double`; chấp nhận round có thể lệch so với một số chuẩn làm tròn khác (banker's
  rounding) nhưng đổi lại dễ giải trình với kế toán.

## AD-3: Soft delete làm mặc định
- **Bối cảnh:** Dữ liệu nghiệp vụ (món, bàn, đơn) thường cần khôi phục/audit, xóa cứng
  mất vết.
- **Quyết định:** Ưu tiên soft delete (cờ trạng thái/`IsDeleted`) trừ khi user yêu cầu rõ
  "xóa vĩnh viễn".
- **Lý do / đánh đổi:** Giữ audit trail & khả năng khôi phục; đánh đổi là query phải
  luôn cộng thêm điều kiện lọc bản ghi đã xóa (đã có Global Query Filter hỗ trợ AD-1).

## AD-4: Rule Engine duyệt món tự động (Luồng Xanh/Đỏ)
- **Bối cảnh:** Khách tự order qua QR không có nhân viên giám sát trực tiếp; cần chặn
  đơn bất thường (số lượng/giá trị lớn bất thường, nghi gian lận hoặc thao tác nhầm).
- **Quyết định:** `OrderService` áp ngưỡng (số lượng < 20 và giá < 500k → `Pending` tự
  duyệt = Luồng Xanh; vượt ngưỡng → `NeedsApproval` + bắn alert SignalR cho quản lý =
  Luồng Đỏ). Idempotency key tránh duplicate khi mạng lag/khách bấm 2 lần.
- **Lý do / đánh đổi:** Tự động hoá phần lớn đơn hàng (trải nghiệm khách nhanh) mà vẫn
  có lưới an toàn cho đơn bất thường; đánh đổi là ngưỡng cứng có thể cần tinh chỉnh theo
  quy mô quán thực tế (chưa cấu hình được per-shop).

## AD-5: Thiết kế UI "Ember Bistro" thay theme tím/lạnh cũ
- **Bối cảnh:** Theme cũ (tím Linear `#7c3aed`) không hợp tinh thần F&B ấm áp/kích thích
  vị giác; gây drift giữa DESIGN.md và code thực tế.
- **Quyết định:** Chuyển toàn bộ token màu/typography sang "Ember Bistro" (espresso nền
  + terracotta/saffron-amber, font Fraunces/Plus Jakarta Sans), tập trung token tại
  `client-app/src/index.css` (`@theme`), không hardcode màu trong component. Chi tiết:
  [DESIGN.md](DESIGN.md).
- **Lý do / đánh đổi:** Re-skin toàn cục 1 lần ở token thay vì sửa rải rác từng
  component; đánh đổi là đợt rewrite động chạm nhiều file cùng lúc (xem trạng thái WIP ở
  HANDOFF.md) — rủi ro regression UI trong lúc chuyển tiếp.
