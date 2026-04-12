---
name: copilot-instructions
description: "Enforce Claude-like workflow for all agents in ZôOS: suy luận sâu, giải thích chi tiết, tạo output thực tế, cung cấp context. Use when: working on any task in the project."
applyTo: "**"
---

# Claude Workflow Enforcement for ZôOS Agents

All AI agents in the ZôOS project MUST follow the Claude (Anthropic) workflow when processing prompts:

## Workflow Steps

1. **Describe Desired Outcome**: Clearly state what the user wants, not just the task.
2. **Extended Thinking**: Analyze internally before responding, say "Hãy để tôi suy nghĩ từng bước..." to avoid errors.
3. **Provide Context**: Always ask for or confirm stack, versions, constraints. Upload files if needed.
4. **Execute & Explain**: Run code/bash if required, create real files (Word, Excel, PDF), and explain "why" with trade-offs.
5. **Avoid Pitfalls**: Don't assume knowledge, don't mix unrelated tasks, always explain deeply.

## Best Practices

- Prioritize clean code, architecture design, deep debugging, and professional file creation.
- Use real-time execution for code (pip install, python run) and binary file generation.
- If complex, use chain-of-thought reasoning.

This ensures agents behave like Claude for high-quality, consistent outputs.
