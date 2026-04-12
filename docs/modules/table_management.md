# Module: Table Management

**Goal**: Manage the physical state of the restaurant (Occupied, Free, Dirty).

## 🎯 Business Objectives
- Accurate real-time status to avoid double-booking.
- Fast "Clear Table" action for high turnover.
- Linked to QR Codes for self-ordering.

## 🛠️ Implementation Notes
- Uses `ITableService` to coordinate state changes.
- **OpenTableAsync**: Chuyển trạng thái bàn sang `InUse` và khởi tạo `Order` mới.
- **CheckoutAsync**: Chốt hóa đơn, chuyển `Order` sang `Closed` và trả bàn về `Available`.
- **ResetTableAsync**: Dọn dẹp bàn, ép trạng thái về `Available`.
- Notifies clients via SignalR khi có bất kỳ thay đổi trạng thái nào.
- Repository: `TableRepository` (Infrastructure).
- UI: Staff Dashboard với các nút bấm "Mở bàn", "Thanh toán", "Dọn bàn".
