# AI Agent Playbook (ZôOS)

Tài liệu này là "Nguồn sự thật duy nhất" (Single Source of Truth) định nghĩa cách các AI Agent làm việc trong dự án ZôOS. Mọi Agent tham gia dự án BẮT BUỘC phải tuân thủ các quy tắc này.

## 🧠 1. Chiến lược Bảo tồn Logic (Logic Preservation)

Để tránh hiện tượng AI bị "ảo giác" hoặc quên nghiệp vụ khi đổi phiên làm việc, dự án áp dụng cơ chế **Neo Trí Nhớ (Memory Anchors)**:

- **Điểm neo Hệ thống**: Agent phải đọc [system_overview.md](./system_overview.md) khi bắt đầu mọi phiên làm việc.
- **Điểm neo Module**: Agent phải đọc tài liệu tương ứng trong `docs/modules/` trước khi sửa code module đó.
- **Context Snapshot (giam chi phi chat moi)**: Khi bat dau chat moi, doc `docs/architecture/context_snapshot.md` truoc de lay tong quan + quy uoc. Chi doc them tai lieu goc khi task thuc su can.

## 🤖 2. Giả lập Vai trò (Role Simulation)

Dự án sử dụng cơ chế **Role-playing** để đa dạng hóa góc nhìn phản diện. Một Agent có thể đóng nhiều vai hoặc triệu hồi các Agent khác qua OpenClaw:

- **@Architect**: Giám sát tính "sạch" của code (DDD, SOLID, Clean Architecture).
- **@Business**: Tối ưu hiệu quả vận hành và dòng tiền.
- **@Staff**: Đại diện cho trải nghiệm phục vụ (nút phải to, dễ dùng, không rườm rà).
- **@Tester**: Tìm kiếm các kịch bản lỗi và trường hợp biên (say xỉn, mất mạng).
- **Captain (Antigravity)**: Điều phối và tổng hợp ý kiến từ các vai trò chuyên biệt.

## 🔄 3. Quy trình làm việc Tiêu chuẩn

1.  **Thuyết trình trước, Code sau**: Cung cấp `implementation_plan.md` trước khi sửa code lớn.
2.  **Tự động lưu trữ (Self-Archiving)**: Cập nhật tài liệu kỹ thuật và nhật ký phiên (`docs/sessions/`) sau mỗi task.
3.  **Chốt Quyết Định (Final Decision Tracking)**: Sau khi chủ dự án review và ra quyết định từ các nhật ký phân tích, AI BẮT BUỘC phải mở lại file nhật ký đó và ghi đè thêm mục "Quyết định cuối cùng" để lưu trữ rành mạch luồng xử lý.
4.  **Ngôn ngữ**: Hội thoại và tài liệu dùng **Tiếng Việt**. Code và Comment kỹ thuật dùng **Tiếng Anh**.

### Quy uoc dat file: `docs/plans/` vs `docs/sessions/` (de tranh nham)
Trong repo hien co 2 loai tai lieu hay bi tron:

- `docs/plans/`: "Ban ve thi cong" / implementation plan (P0). Day la noi chot spec de bat dau code: API, DTO, UI flow, acceptance criteria, phasing, rui ro, va danh sach file du kien dong vao.
- `docs/sessions/`: "Nhat ky phien lam viec" / session log (P1). Day la noi luu vet: da lam gi, tai sao chon, quyet dinh, bai hoc, buoc tiep theo, va link den plan neu co.

Quy tac ap dung:
- Duoc phep co "planning discussion" trong `docs/sessions/` (bao cao ke hoach, role-playing, roadmap), NHUNG neu chuan bi implement thi phai tao/duy tri 1 file plan trong `docs/plans/` va session chi nen tro toi file do.
- Chuoi `implementation_plan.md` o buoc (1) duoc hieu la "implementation plan document". Repo co the dat ten theo convention `docs/plans/<topic>_plan.md` (vi du: `docs/plans/story_01_open_table_plan.md`). Khong bat buoc ten file dung y chang `implementation_plan.md`.
- Neu session co muc "Implementation Plan" thi muc do chi nen la tom tat + link sang `docs/plans/...` (tranh duplicate va drift).

### Checklist bat buoc khi co thay doi lon
- Neu co thay doi DB (them bang/cot/index/constraint):
  - Tao EF Core migration.
  - Cap nhat `docs/architecture/database_schema.md` (toi thieu: bang/cot moi + y nghia nghiep vu).
  - Cap nhat module doc trong `docs/modules/` neu lien quan.
  - Ghi ro ten migration + ly do trong session log.
- Neu sua bug: tao log theo template trong `docs/debug_logs/`.
- Neu co bat dong/doi huong giua cac phuong an: tao 1 ban ghi trong `docs/conflicts_resolutions/` de luu vet quyet dinh.

## 🛡️ 4. Quy tắc "Vàng" về Nghiệp vụ

- **Tiền tệ**: Luôn dùng `decimal(18,2)` và `MidpointRounding.AwayFromZero`.
- **Dữ liệu**: Tuyệt đối dùng **Soft Delete** (`IsDeleted`), không xóa cứng.
- **SaaS**: Mọi API phải xử lý `ShopId` thông qua `ITenantService`.

## 🤖 5. Claude Workflow Enforcement (Ép Buộc Luồng Hoạt Động Giống Claude)

Để đảm bảo tất cả agents thực thi theo phong cách Claude (Anthropic), mọi agent BẮT BUỘC tuân thủ workflow sau khi nhận prompt:

- **Suy luận sâu (Extended Thinking)**: Phân tích nội tâm trước khi trả lời, nói "Hãy để tôi suy nghĩ từng bước..." để tránh hallucination.
- **Giải thích chi tiết**: Không chỉ đưa ra kết quả, mà giải thích "tại sao" và trade-offs, như Claude giải thích lỗi/debug.
- **Tạo output thực tế**: Nếu prompt yêu cầu, tạo file binary (Word, Excel, PDF) hoặc thực thi code (chạy bash/Python) trong môi trường thực.
- **Cung cấp context**: Luôn yêu cầu context đầy đủ (stack, phiên bản, constraints), upload file nếu cần, tránh giả định.
- **Workflow mẫu**: Mô tả kết quả mong muốn → Suy nghĩ từng bước → Thực thi → Giải thích. Tránh pitfalls như hỏi nhiều việc không liên quan hoặc bỏ qua giải thích.

Agents ưu tiên tasks như viết code sạch, thiết kế kiến trúc, debug sâu, và tạo file chuyên nghiệp.

---

_Tài liệu này được kế thừa và thay thế cho `LOGIC_PRESERVATION.md` cũ._
