---
name: CodeReviewer
description: "Enhanced code review skill: Analyzes architecture, security, performance, and integrates with tests. Use when: reviewing C# files for technical debt."
applyTo: "src/**/*.cs"
---

# Skill: CodeReviewer

This skill analyzes C# code for SOLID, security flaws, EF Core performance, and financial precision. It suggests refactors and recommends running tests.

## Assets

- CodeReviewer.js: Core analysis logic.

## Usage

Call analyzeFile(content, fileName) to get findings.
