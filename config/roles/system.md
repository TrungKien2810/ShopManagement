---
role: system
triggers: [system, hệ thống, infra, infrastructure, db, sql, database, schema, entity, migration, config, settings, cache, signalr, real-time, kiến trúc, architecture, global-filter, tenancy, multi-tenant, ef-core, repository, clean-architecture]
areas: [src/ShopManagement.Infrastructure, src/ShopManagement.Domain, src/ShopManagement.Application]
summary: SYSTEM: Clean Architecture tuân thủ. Domain (entity, logic nghiệp vụ, exception) độc lập. Infra (EF Core, SignalR, Repositories). Migration luôn additive, không phá schema cũ. Global Query Filter enforce multi-tenancy (ShopId).
skills: [code-review]
---

# Vocabulary (đồng nghĩa, dùng để normalize local)
infra = infrastructure = data access = repository
entity = model = domain object = aggregate
schema = database = bảng = table
migration = ef core migration = database change
cấu hình = config = settings = appsettings.json
quản lý = tenancy = multi-tenant = shopid
thực thời = real-time = signalr = websocket
filter = global query filter = soft delete
