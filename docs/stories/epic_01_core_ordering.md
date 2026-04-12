# Epic 01: Core Ordering & Table Management

**Người phụ trách**: `@ScrumMaster` / `@PO`
**Tài liệu tham chiếu**: `docs/requirements/PRD_Core_MVP.md`
**Mục tiêu**: Xây dựng toàn bộ hệ thống API và Logic (Backend) cho việc quản lý Bàn ăn và Cho khách gọi món qua mã QR tĩnh.

---

## Danh sách User Stories (Khối Context Sharding)

Theo đúng tiêu chuẩn **BMAD Context Sharding**, AI khi viết Code chỉ được phép đọc ĐÚNG 1 FILE STORY tại 1 thời điểm. Không đọc các Story khác để tránh ảo giác (Hallucination).

Dưới đây là danh sách phân rã (Breakdown):

1. **[DONE] [Story 01_OpenTable](story_01_open_table_api.md)**: Nhân viên bấm Mở bàn, Đổi trạng thái bàn thành đang sử dụng và sinh JWT Session.
2. **[DONE] [Story 02_GetMenu]**: Sinh API Lấy danh sách Món ăn (Menu) phân nhóm theo Category cho khách lướt chọn. 
3. **[DONE] [Story 03_PlaceOrder_AutoPrint]**: Xây API nhận List món ăn khách gửi. Chạy bộ tự nhận diện Rủi Ro (Rule Engine Luồng Xanh/Đỏ) và lưu Database.
4. **[DONE] [Story 04_ManualApprove_RedAlert]**: API dành riêng cho Thu ngân duyệt tay một Order bị xếp vào Luồng Đỏ (Cảnh báo).
5. **[DONE] [Story 05_CloseTable_Checkout]**: Tính tổng tiền bao gồm Thuế VAT, Khuyến mãi (nếu có) và đóng Session của Bàn, set Bàn về lại trạng thái Available (Trống).

---
*Ghi chú cho Agent: Cập nhật biến [PENDING] thành [DONE] trong file Epic này mỗi khi hoàn thành xuất sắc 1 Story.*
