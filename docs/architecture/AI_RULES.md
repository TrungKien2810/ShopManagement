# 🍺 ZôOS - AI Rules (Single Source of Truth)

Muc dich: Gop tat ca quy tac AI trong repo ve 1 noi duy nhat de:
- Giam drift giua `.cursorrules`, `.traerules`, va docs.
- Giam chi phi context khi bat dau chat moi (doc snapshot truoc).

Phan bo trach nhiem:
- File nay la nguon su that chinh.
- `.cursorrules` va `.traerules` chi la wrapper tro den file nay.

## 1) Chinh sach co ban
- Ngon ngu: thao luan + tai lieu = Tieng Viet; code/comment ky thuat = Tieng Anh.
- Khong tu y hanh dong dua tren gia dinh. Neu thieu context, phai hoi hoac tu tim trong repo.

## 2) Context (giam chi phi chat moi)
### 2.1 Bat dau chat moi (bat buoc)
- Doc `docs/architecture/context_snapshot.md` truoc.
- Chi doc them `docs/architecture/system_overview.md` + module lien quan khi task thuc su can.

### 2.2 Khi nao phai doc sau hon?
Chi doc them tai lieu goc khi:
- Sap implement thay doi lon (can plan + AC).
- Co thay doi DB/migration.
- Co thay doi nghiep vu tien/ke toan.

## 3) Neo tri nho & tai lieu goc
- Playbook: `docs/architecture/agent_playbook.md`
- DB schema: `docs/architecture/database_schema.md`
- Role simulation: `docs/architecture/roles_simulation.md`
- Roadmap/PRD: `docs/requirements/MASTER_ROADMAP.md`, `docs/requirements/PRD_Core_MVP.md`
- Module docs (doc truoc khi sua module tuong ung): `docs/modules/*.md`

## 4) Quy uoc luu tai lieu (docs/)
- Discussion (phan tich/phan bien nhap, chua chot): `docs/discussions/<topic>.md`
- Plan thi cong (truoc khi code lon): `docs/plans/<topic>_plan.md`
- Session log (sau moi task + quyet dinh cuoi): `docs/sessions/session_<YYYYMMDD>_<Feature>.md`
- Bug log: `docs/debug_logs/bug_<id>_<short>.md`
- Conflict resolution (bat dong/doi huong/quy tac mau thuan): `docs/conflicts_resolutions/conflict_<YYYYMMDD>_<topic>.md`

Quy tac chong drift:
- Duoc phep co "planning discussion" trong `docs/sessions/`, NHUNG neu chuan bi implement thi phai co 1 plan trong `docs/plans/` va session chi tom tat + link sang plan.

## 5) Gate: Plan truoc, code sau
- Neu thay doi lon: phai co plan trong `docs/plans/` (API/UI/AC/phasing/test plan) va user dong y truoc khi implement.

## 6) DB change protocol (bat buoc)
Neu co thay doi DB (them bang/cot/index/constraint/query filter):
- Tao EF Core Migration.
- Cap nhat `docs/architecture/database_schema.md`:
  - Them/doi bang/cot.
  - Ghi ro y nghia nghiep vu.
  - Append vao "Schema Change Log" (migration name + tom tat).
- Neu lien quan module: cap nhat `docs/modules/<module>.md`.
- Trong session log: ghi ro ten migration + ly do thay doi.

## 7) Quy tac vang nghiep vu
- Tien te: `decimal(18,2)` + `MidpointRounding.AwayFromZero`.
- Multi-tenant: moi API phai dung `ShopId` qua `ITenantService`; frontend bat buoc gui `ShopId`.
- Soft delete: uu tien xoa mem theo playbook (khong xoa cung) tru khi user yeu cau ro.

## 8) Luu vet & bao ton tai lieu
- `docs/sessions/` va `docs/discussions/`: uu tien append-only (neu can chinh sua, them muc "Ghi chu chinh sua" thay vi rewrite).
- `docs/plans/`: duoc phep cap nhat trong qua trinh chot, nhung phai giu muc "Quyet dinh da chot" ro rang.

## 9) Closure checklist (truoc khi ket thuc task)
- Neu co plan: dam bao plan o `docs/plans/` va session co link.
- Neu sua bug: co `docs/debug_logs/...`.
- Neu co conflict: co `docs/conflicts_resolutions/...`.
- Neu doi DB: cap nhat schema doc + schema change log.
- Cap nhat `docs/requirements/MASTER_ROADMAP.md` neu co thay doi muc tieu/roadmap.

