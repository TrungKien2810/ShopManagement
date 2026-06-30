---
role: code
triggers: [code, lỗi, bug, refactor, test, compile, build, function, hàm, api, type, lint, import, module, class, method, debug, fix, implement, vitest, xunit, nunit, assert, dotnet, typescript, tsc]
areas: [src, client-app/src]
summary: CODE: sửa src/ (backend) & client-app/src/ (frontend) chỉ. Lint+test pass trước kết thúc, tránh đổi public API mà không update test.
skills: [code-review]
---

# Vocabulary (đồng nghĩa, dùng để normalize local)
lỗi compile = build error = tsc error = dotnet build fail
lỗi test = test failure = assertion failed = vitest fail = xunit fail
api = endpoint = controller = service
frontend = react = client-app = typescript
backend = dotnet = csharp = webapi = ef core
type = kiểu = typescript type = csharp type
phụ thuộc = dependency = import = nuget = package.json
