# decisions-log — nhật ký quyết định (append-only)

> Mỗi dòng = một quyết định đã chốt, theo thời gian. Chỉ thêm, không sửa dòng cũ.
> Quyết định lớn nên có mục đầy đủ trong technical-design.md.

- 2026-04-12 — Chốt kiến trúc nền: Clean Architecture (.NET 9) + multi-tenancy qua `ShopId`
  (Global Query Filter) + React 19/Vite frontend. Xem [technical-design.md#ad-1](technical-design.md#ad-1-multi-tenancy-qua-shopid--ef-core-global-query-filter).
- 2026-04-12 — Chốt quy tắc tiền tệ: `decimal(18,2)` + `MidpointRounding.AwayFromZero`
  bắt buộc toàn hệ thống, không dùng `float/double`. Xem [technical-design.md#ad-2](technical-design.md#ad-2-tiền-tệ--decimal182--midpointroundingawayfromzero).
- 2026-04-29 — Hoàn thiện luồng Menu/Category/Gán món vào bàn (commit `9710ca3`); thêm
  Rule Engine duyệt món tự động Luồng Xanh/Đỏ. Xem [technical-design.md#ad-4](technical-design.md#ad-4-rule-engine-duyệt-món-tự-động-luồng-xanhđỏ).
- 2026-04-29 — Migration `<PENDING_AddTableAreas>`: thêm bảng `TableAreas` +
  `Tables.AreaId` để chuẩn hoá vị trí bàn (module Table Management).
- 2026-05-04 — Hoàn thiện luồng đổi bàn (Transfer Table) + chốt module Menu
  (commit `f3e64d6`).
- 2026-06-15 — Checkpoint trước rewrite UI Menu: chốt re-skin toàn cục sang theme
  "Ember Bistro" thay theme tím/lạnh cũ (commit `1ccb21f`). Xem [technical-design.md#ad-5](technical-design.md#ad-5-thiết-kế-ui-ember-bistro-thay-theme-tímlạnh-cũ).
- 2026-06-16 — Dọn sạch toàn bộ "AI agent scaffolding" giả lập (dev-agents/, sessions,
  discussions, persona docs...); chốt AGENTS.md (gốc repo) là nguồn sự thật duy nhất cho
  agent. Repo giảm 2.0G → ~272M. Xem memory `agent-flow-single-source-of-truth`.

