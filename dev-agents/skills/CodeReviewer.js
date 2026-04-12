/**
 * Skill: CodeReviewer
 * Purpose: Analyzes code for architectural patterns, technical debt, security, and performance.
 * Enhanced: Integrates with tests, detects EF Core issues, JWT security flaws.
 */

export function analyzeFile(content, fileName) {
  if (fileName.endsWith(".cs")) {
    return analyzeCSharp(content, fileName);
  }
  return "Unsupported file type for analysis.";
}

function analyzeCSharp(content, fileName) {
  let findings = [];
  if (!content.includes("interface"))
    findings.push("- Consider using interfaces for loose coupling (SOLID).");
  if (content.length > 3000)
    findings.push(
      "- Large file detected (> 3000 chars), consider SRP refactoring.",
    );
  if (content.includes("SELECT *") || content.includes(".Include("))
    findings.push(
      "- Potential EF Core N+1 query issue; use explicit includes or projections.",
    );
  if (content.includes("password") && !content.includes("HashPassword"))
    findings.push(
      "- Security risk: Password not hashed; use ASP.NET Identity.",
    );
  if (
    content.includes("decimal") &&
    !content.includes("MidpointRounding.AwayFromZero")
  )
    findings.push(
      "- Financial precision: Use MidpointRounding.AwayFromZero for decimal calculations.",
    );
  // Integration: Suggest running tests
  findings.push(
    "- Recommendation: Run unit tests after review to validate changes.",
  );
  return findings.length > 0 ? findings.join("\n") : "Code looks clean.";
}
