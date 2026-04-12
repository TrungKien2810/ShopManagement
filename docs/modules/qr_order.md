# Module: QR Ordering Flow

**Goal**: Allow customers to order from their phone without staff interaction.

## 🎯 Business Objectives
- Reduce labor costs by 20%.
- Prevent "Theft Orders" by using unique session tokens per QR scan.
- Ensure the kitchen receives orders immediately via SignalR.

## 🛠️ Implementation Notes
- Order starts as a "Draft" upon QR scan.
- Staff must "Confirm" or payment must be verified before moving to "Order" state.
- Real-time hub: `OrderHub`.
