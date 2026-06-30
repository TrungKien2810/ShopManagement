---
name: agent-flow-single-source-of-truth
description: AGENTS.md (root) is the canonical agent guide; AI scaffolding/theater was purged
metadata:
  type: project
---

Ngày 2026-06-16, dọn sạch toàn bộ "AI agent scaffolding" thừa khỏi repo và gom luồng Agent về một nguồn sự thật duy nhất.

- **Nguồn sự thật**: [AGENTS.md](../../../AGENTS.md) ở gốc repo (stack, kiến trúc, golden rules, lệnh dev, design direction). [DESIGN.md](../../../DESIGN.md) đã được cập nhật sang theme Ember Bistro (trước đó còn mô tả theme tím Linear cũ → drift). Xem [[ui-ember-bistro-direction]].
- **Đã xóa**: `design-skills/` (301MB clone), `tools/openclaw-engine/` (repo agent ngoài), logs JVM, `clone_design_skills.ps1`, `dev-agents/` (persona giả lập), `.cursorrules`/`.traerules`, `claudeFormat.md`, `.github/{agents,skills,hooks}` + copilot-instructions, và docs quy trình AI (sessions/discussions/conflicts_resolutions/debug_logs/learning/walkthroughs/stories/ai_metrics + AI_RULES/agent_playbook/roles_simulation). Repo giảm 2.0G → ~272M.
- **Giữ lại tri thức thật**: `docs/architecture/` (system_overview, database_schema, *_playbook, business_accounting_rules, development_guidelines), `docs/modules/`, `docs/requirements/`, và skill `.agent/skills/ui-ux-pro-max/` (dùng được, Python).

**Why:** User yêu cầu chỉ giữ thứ tạo ra output thật, xóa scaffolding thừa, và làm lại luồng Agent + src-truth cho sạch.
**How to apply:** Đọc AGENTS.md gốc trước; không dựng lại "đội ngũ agent giả lập" hay session-log ceremony.
