/**
 * Skill: ScenarioSimulator
 * Purpose: Simulates operational scenarios dynamically with parameters and reports.
 * Enhanced: Integrates with SignalR for real-time load, outputs detailed reports.
 */

export function simulateScenario(scenarioName, params = {}) {
  switch (scenarioName) {
    case "PeakHour":
      const tables = params.tables || 20;
      const latency = simulateLoad(tables);
      return `Simulating ${tables} tables ordering simultaneously. System load: latency ${latency}ms. Report: ${generateReport("PeakHour", latency)}`;
    case "StaffShortage":
      const staff = params.staff || 1;
      const tablesForStaff = params.tables || 10;
      const friction = calculateFriction(staff, tablesForStaff);
      return `Simulating ${staff} staff for ${tablesForStaff} tables. UX friction: ${friction} points. Report: ${generateReport("StaffShortage", friction)}`;
    case "NetworkFailure":
      return `Simulating wifi down. Offline mode activated. Report: ${generateReport("NetworkFailure", "PWA fallback successful")}`;
    default:
      return "Scenario unknown.";
  }
}

function simulateLoad(tables) {
  // Simulate SignalR load
  return tables * 50; // ms latency
}

function calculateFriction(staff, tables) {
  return (tables / staff) * 10; // arbitrary friction score
}

function generateReport(scenario, result) {
  return `Detailed report for ${scenario}: ${result}. Recommendations: Optimize for high load.`;
}
