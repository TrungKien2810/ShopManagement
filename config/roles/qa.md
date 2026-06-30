---
role: qa
triggers: [qa, test, e2e, unit, integration, kiểm thử, coverage, regression, flaky, playwright, vitest, xunit, nunit, assert, smoke, dogfood, verify]
areas: [src/ShopManagement.Tests, client-app, docs/requirements]
summary: QA: viết test có ý nghĩa (scenario thực tế, không chỉ tăng coverage%). Chặn regression. XỚ flaky: chủa gốc nguyên, không retry mú. Unit: domain, service. E2E: signalr real-time, multi-tenant isolation.
skills: [code-review]
---

# Vocabulary (đồng nghĩa, dùng để normalize local)
kiểm thử = test = qa = verify
hồi quy = regression = side effect = break
flaky = không ñn định = từm dừng = intermittent
unit test = kiểm thử đơn vị = domain test
e2e test = kiểm thử đằu cuối = end-to-end = integration = smoke
coverage = coverage % = code coverage
