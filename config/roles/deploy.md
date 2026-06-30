---
role: deploy
triggers: [deploy, triển khai, release, publish, build, npm, dotnet, docker, ci, cd, pipeline, smoke, e2e, version, artifact, tag, ship, rollout, dockerfile]
areas: [scripts, config, client-app, src]
summary: DEPLOY: (1) backend: dotnet build + test pass, (2) frontend: npm run build + lint pass, (3) smoke/E2E test, (4) KHÔNG commit dist/bin/obj, (5) Stop verify pass.
skills: [run, verify]
---

# Vocabulary (đồng nghĩa, dùng để normalize local)
triển khai = deploy = release = ship
kiểm khói = smoke = e2e = integration test
gói = package = artifact = dist = build output
phiên bản = version = tag = release
dotnet build = backend build = csharp compile
npm build = frontend build = react bundle
xác minh = verify = validate = check
