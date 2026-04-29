# Context Snapshot (Giam chi phi context) - ZôOS ShopManagement

Muc dich: File nay la "ban tom tat context" de giam chi phi moi khi bat dau chat moi. Agent doc file nay truoc, sau do chi doc them cac tai lieu goc khi can.

## 1) Trang thai he thong (High-level)
- Domain: SaaS multi-tenant quan ly quan (Shop) voi RBAC theo vai tro (Owner/Manager/Staff).
- Backend: .NET 9 WebAPI, Clean Architecture, EF Core + SQL Server, SignalR realtime.
- Frontend: React 19 + Vite + TypeScript, tenant context qua `ShopId` header.

## 2) Neo tri nho (Memory Anchors)
- He thong: `docs/architecture/system_overview.md`
- Playbook: `docs/architecture/agent_playbook.md`
- DB schema (nguon su that ve data): `docs/architecture/database_schema.md`
- Module docs (doc truoc khi sua module):
  - `docs/modules/table_management.md`
  - `docs/modules/menu_ordering.md`
  - `docs/modules/auth_rbac.md`
  - `docs/modules/qr_order.md`

## 3) Quy uoc luu tai lieu (docs/)
- Thiet ke/phan bien nhap (chua chot): `docs/discussions/<topic>.md`
- Nhat ky phien + quyet dinh cuoi: `docs/sessions/session_<YYYYMMDD>_<Feature>.md`
- Ban ve thi cong (implementation plan truoc khi code lon): `docs/plans/<topic>_plan.md`
- Bug log: `docs/debug_logs/bug_<id>_<short>.md`
- Conflict resolution (khi bat dong/doi huong): `docs/conflicts_resolutions/conflict_<YYYYMMDD>_<topic>.md`

## 4) Quy tac vang can nho
- Tien te: `decimal(18,2)` + `MidpointRounding.AwayFromZero`.
- Multi-tenant: moi API phai dung `ShopId` (qua `ITenantService`) va frontend phai gui `ShopId`.
- Soft delete: uu tien xoa mem (khong xoa cung) theo playbook.

## 5) Khi nao phai doc sau hon?
Chi doc them tai lieu goc (PRD/roadmap/story/module) khi:
- Sap implement 1 feature lon (can plan + AC).
- Co thay doi DB/migration (bat buoc cap nhat `database_schema.md`).
- Co thay doi nghiep vu/luong tien/ke toan.

## 6) Khi nao cap nhat file nay?
Cap nhat `context_snapshot.md` khi co thay doi "nen" (architecture/rules/convention/entrypoint), vi du:
- Doi stack version, route/chuan tenant/auth, thay doi quy uoc docs.
- Them module moi bat buoc doc (them file trong `docs/modules/`).

