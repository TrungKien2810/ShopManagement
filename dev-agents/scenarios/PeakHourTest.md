# Scenario: Peak Hour Simulation

**Objective:** Test the system's resilience and usability when the restaurant is at 100% capacity.

**Participants:** 
- @BusinessAgent: Evaluate profit impact of 10-minute delays.
- @StaffAgent: Identify friction in order confirmation speed.
- @TesterAgent: Stress test SignalR connections for 50+ concurrent clients.

**Expected Outcome:**
Identifying a bottleneck in the "Draft Order" confirmation flow where one staff member cannot handle more than 5 tables simultaneously. Recommendation for "Auto-Confirm" or "Self-Pay" options.
