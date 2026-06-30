# 🚀 ShopManagement (ZôOS) — Master Ideas & Project Blueprint

> **Master document** tổng hợp toàn bộ vision, architecture, features, và roadmap.
> Dùng để **reinitialize project từ đầu** với full context.
> 
> **Last Updated**: 2026-06-23  
> **Status**: 🏗️ Building Phase (Menu UI refinement + QR Order WIP)

---

## 📌 **SECTION 1: VISION & MISSION**

### Project Identity
- **Name**: ShopManagement (ZôOS - Zô Operating System)
- **Type**: SaaS Multi-tenant POS (Point of Sale) for Restaurants
- **Target Users**: Restaurant owners, managers, staff, customers (QR ordering)
- **Core Problem**: Restaurants need unified system to manage tables, menu, orders, payments in real-time with multi-location & role-based access

### Key Values
1. **Multi-tenant from Day One** → One User, Multiple Shops/Branches
2. **Real-time Synchronization** → Kitchen, Server, Manager all see live updates
3. **Role-based & Secure** → Owner/Manager/Staff with granular permissions
4. **Clean Architecture** → Maintainable, testable, scalable code
5. **Beautiful UI** → Premium experience (not cheap POS) via "Ember Bistro" design

### Success Metrics (MVP)
- ✅ Multi-shop authentication & shop switching
- ✅ Table management (create, view status, soft delete)
- ✅ Menu management (shared + branch-specific)
- ✅ Order placement & real-time updates via SignalR
- ✅ Basic payment processing
- ✅ Dashboard with table status visualization
- ✅ Staff role & permission enforcement

---

## 🏗️ **SECTION 2: TECHNOLOGY STACK**

> **2026-06: Migrated từ React SPA + WebAPI sang ASP.NET Core MVC truyền thống
> (server-render CSHTML).** `client-app/` và `ShopManagement.WebAPI` đã bị xóa.
> Domain/Application/Infrastructure giữ nguyên; chỉ có lớp presentation đổi.

### .NET 9 Clean Architecture (single web app)
```
Architecture Layers:
├── ShopManagement.Domain
│   ├── Entities (Shop, Table, Menu, Order, Payment, ShopMember)
│   ├── Value Objects (Money, OrderStatus, TableStatus, Role)
│   ├── Aggregates & Invariants
│   ├── Domain Exceptions (BusinessException, InvalidOperationException)
│   └── Interfaces (IRepository, ITenantService)
│
├── ShopManagement.Application
│   ├── Use Cases / Business Services (OrderService, PaymentService, MenuService, TableService...)
│   ├── DTOs (Create, Update, Read models)
│   └── Interfaces (IServices.cs, IUnitOfWork, repositories)
│
├── ShopManagement.Infrastructure
│   ├── EF Core DbContext (Global Query Filters cho ShopId isolation)
│   ├── Repository Implementations (Generic + Custom)
│   ├── SignalR Hub (ShopHub tại /hubs/shop)
│   ├── ASP.NET Core Identity (ApplicationUser, Role management)
│   ├── TenantService (ShopId/BranchId: claim → header legacy → Session)
│   ├── External Services (Cloudinary photo upload)
│   └── Persistence Migrations
│
├── ShopManagement.Web  ← MVC app duy nhất, thay cho client-app + WebAPI cũ
│   ├── Controllers (Account, Shop, Branch, Table, Menu, Order, Payment, Report)
│   ├── Models/ (ViewModels — KHÔNG dùng entity trực tiếp trong View)
│   ├── Views/ (.cshtml theo controller, _Layout.cshtml dùng chung)
│   ├── wwwroot/css/site.css (Ember Bistro, CSS thuần — không Tailwind/build step)
│   ├── Cookie Authentication (ConfigureApplicationCookie) — không còn JWT
│   └── Program.cs (DI, Identity, Session, SignalR, EF Core, seed data)
│
└── ShopManagement.Tests
    ├── Unit Tests (Domain logic, Services)
    └── Integration Tests (EF Core)
```

**Key Technologies**:
- **Runtime**: .NET 9.0, ASP.NET Core MVC (server-rendered Razor views)
- **ORM**: Entity Framework Core 9 (SQL Server)
- **Database**: SQL Server Express (dev)
- **Authentication**: ASP.NET Core Identity + Cookie Auth (LoginPath `/Account/Login`)
- **Tenant switching**: ASP.NET Core Session (`HttpContext.Session` lưu ShopId/BranchId)
- **Real-time**: SignalR (`/hubs/shop`), client dùng `@microsoft/signalr` qua CDN script trong View
- **Styling**: CSS thuần với custom properties (`wwwroot/css/site.css`), không Tailwind/PostCSS/Vite
- **Testing**: xUnit, Moq, FluentAssertions

---

## 🎨 **SECTION 3: DESIGN SYSTEM — "Ember Bistro"**

### Philosophy
- **Mood**: Warm, inviting, appetite-stimulating, premium but not cold
- **Atmosphere**: Dark espresso background + warm ember/amber gradients + subtle film-grain overlay
- **Principles**: Elegant borders, warm glows (not cold shadows), intentional whitespace

### Color Palette

| Color Name | Hex | Token | Role | Usage |
|---|---|---|---|---|
| **Void** (Espresso) | `#0c0a09` | `--color-void` | Primary Background | Page bg, body background |
| **Slate Deep** | `#18130f` | `--color-slate-deep` | Secondary Background | Cards, sidebars, containers |
| **Ember** (Terracotta) | `#c2410c` | `--color-ember` / `bg-ember` | Primary Action | Primary buttons, main CTA, highlights |
| **Ember Bright** | `#e2562a` | `--color-ember-bright` | Hover/Active | Button hover, active states |
| **Saffron Amber** | `#f4b541` | `--color-amber` / `text-amber` | Accent Glow | Headings, highlights, glow effects |
| **Clay** | `#9a3412` | `--color-clay` / `text-clay` | Accent Dark | Strong accent, secondary heading |
| **Emerald** | `#2fb97a` | `--color-brand-emerald` | Success | Success state, available, profit |
| **Warm White** | `#f6f1ea` | — | Primary Text | Main body text |
| **Warm Gray** | `#9b938b` | `--color-brand-gray` | Secondary Text | Muted text, icons, helper text |

**⚠️ DO NOT reuse old cold theme** (`#7c3aed` purple, `rgba(94,106,210)`)

### Typography

| Type | Font | Size | Weight | Usage |
|---|---|---|---|---|
| **Display** (h1-h4) | Fraunces (serif) | 32px / 24px / 20px / 18px | 600-700 | Page titles, major headings |
| **Body Text** | Plus Jakarta Sans | 14px | 400-500 | Main content, descriptions |
| **Small** | Plus Jakarta Sans | 12px | 400 | Labels, captions |
| **Micro** | Plus Jakarta Sans | 10px | 600 (uppercase) | Micro-labels, badges |

**CSS Classes**:
- `.font-display` → Fraunces
- `.text-sm` → 12px
- `.text-xs` → 10px (uppercase tracking)

### Component Styles

#### Buttons
```css
/* Primary Button */
.btn-primary {
  @apply px-6 py-3 rounded-xl font-semibold;
  background: linear-gradient(135deg, #d9531a 0%, #c2410c 100%);
  color: white;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 20px rgba(194, 65, 12, 0.3);
}
.btn-primary:hover {
  box-shadow: 0 0 30px rgba(194, 65, 12, 0.5);
}
.btn-primary:active {
  transform: scale(0.95);
}

/* Secondary Button */
.btn-secondary {
  @apply px-6 py-3 rounded-xl font-semibold border;
  background: transparent;
  border-color: rgba(155, 147, 139, 0.3);
  color: #f6f1ea;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-secondary:hover {
  border-color: #f4b541;
  box-shadow: 0 0 15px rgba(244, 181, 65, 0.2);
}
```

#### Cards
```css
.linear-card {
  @apply backdrop-blur rounded-2xl p-6;
  background: rgba(24, 19, 15, 0.5);
  border: 1px solid rgba(155, 147, 139, 0.2);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.linear-card:hover {
  border-color: #f4b541;
  box-shadow: 0 0 20px rgba(244, 181, 65, 0.15);
}
```

#### Modals
```css
.modal-backdrop {
  @apply fixed inset-0 flex items-center justify-center;
  background: rgba(12, 10, 9, 0.8);
  backdrop-filter: blur(12px);
  z-index: 999;
}
```

### Layout System
- **Grid**: 12-column standard
- **Spacing Scale**: 4px base (4, 8, 12, 16, 24, 32, 48, 64...)
- **Depth Layers**:
  - Layer 0: Void Black (background)
  - Layer 1: Slate Deep (cards, sidebars)
  - Layer 2: Popovers, tooltips (wide shadows)

### Motion & Interactions
- **Hover Transitions**: `transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1)` (Linear easing)
- **Button Click**: `active:scale(0.98)` for tactile feedback
- **Modal Animation**: Framer Motion spring (stiffness: 300, damping: 30) from bottom
- **List Items**: Subtle highlight + border opacity change on hover
- **Loading**: Shimmer effect (sweep highlight) over cards/tables

### Form & Validation
- **Focus State**: Border glow (amber) + ring with opacity
- **Error Messages**: Rose-400, 12px, slide-down animation
- **Input Groups**: Subtle 1px separator between related fields
- **Empty Fields**: Ghost Gray placeholder with high opacity (0.4)

### Accessibility (WCAG AA)
- **Contrast**: 4.5:1 minimum text/background
- **Focus Trap**: Modals trap keyboard focus
- **ARIA Labels**: All icon-only buttons have aria-label
- **Keyboard Navigation**: Tab-through all interactive elements

### Responsive Design
- **Mobile First**: Start with mobile, enhance for tablet/desktop
- **Adaptive Sidebar**: Icon-only on tablet, hidden + hamburger on mobile
- **Touch Targets**: Min 44x44px on mobile
- **Spacing Scale**: Reduce padding on mobile (8px → 4px)

---

## 🎯 **SECTION 4: FEATURES & FUNCTIONALITY**

### Phase 1 (MVP - Current) ✅

#### 1.1 Authentication & Multi-tenancy
- [x] User Registration (email, password, name)
- [x] User Login (ASP.NET Core Identity + Cookie Auth)
- [x] Logout (cookie sign-out)
- [x] Shop creation by user
- [x] Shop invitation to staff (via email/link)
- [x] Role assignment (Owner/Manager/Staff) per shop
- [x] Shop/Branch switcher lưu trong ASP.NET Core Session

#### 1.2 Shop & Branch Management
- [x] Create shop with basic info (name, address, phone)
- [x] Edit shop settings (name, address, logo, theme)
- [x] Create multiple branches per shop
- [x] Switch between branches
- [x] Staff invitation UI
- [x] Staff role management UI
- [x] Delete shop (soft delete)

#### 1.3 Table Management
- [x] Create tables (customizable area/zone)
- [x] View all tables in dashboard
- [x] Table status tracking (Available, Occupied, Dirty, Reserved)
- [x] Table card visual (seat count, status color)
- [x] Edit table info (name, seats, area)
- [x] Soft delete tables
- [x] 2D table layout map visualization

#### 1.4 Menu Management
- [x] Create menu (shop-wide or branch-specific)
- [x] Create categories within menu
- [x] Create menu items (name, price, description, image)
- [x] Edit menu items
- [x] Soft delete items & categories
- [x] Display shared menu (all branches see) vs branch-specific menu
- [x] Menu preview UI (grid layout with images)

#### 1.5 Order Management
- [x] Place order on table
- [x] Add items to order (with quantity)
- [x] Edit order items (quantity change, remove)
- [x] View order details (sidebar)
- [x] Order status tracking (Draft, Active, Completed, Paid)
- [x] Real-time order updates via SignalR
- [x] Mark order as completed

#### 1.6 Payment Processing
- [x] Record payment on order
- [x] Payment method selection (Cash, Card, Bank Transfer)
- [x] Payment status tracking (Pending, Completed, Refunded)
- [x] Receipt generation (simple format)
- [x] Change tracking (auto-calculate from total)

#### 1.7 Dashboard & Real-time
- [x] Main dashboard (table view + order list)
- [x] Table status map (2D visualization)
- [x] Real-time table updates (SignalR)
- [x] Order notifications (new order, completion)
- [x] Live order count per table
- [x] Staff view (limited to assigned tables)
- [x] Manager view (all tables + analytics)

#### 1.8 Settings & Configuration
- [x] Shop settings page
- [x] Staff management (invite, role, remove)
- [x] Branch settings
- [x] Emergency settings modal
- [x] Theme customization (via design tokens)

### Phase 2 (Q3 2026) 🔬

#### 2.1 Shift Management
- **Idea**: Staff clock-in/out, shift assignment (owner assigns or staff self-picks)
- **Features**:
  - Shift templates (morning/afternoon/night)
  - Clock-in/out tracking
  - Late/absence tracking
  - Payroll integration (hours × hourly rate)
- **DB Schema**: `Shift`, `ShiftAssignment`, `ClockInOut`
- **Status**: 🔬 Need spec review

#### 2.2 Freemium Quota & Billing
- **Idea**: Free plan ≤5 staff, then paid tiers
- **Features**:
  - Staff count quota enforcement
  - Subscription management
  - Invoice generation
  - Payment gateway integration (Stripe/Razorpay)
- **Status**: 🔬 Need pricing model finalization

#### 2.3 Advanced Table Management
- **Idea**: Flexible area zoning, table merging, dynamic seating
- **Features**:
  - Custom area creation (VIP, patio, main hall)
  - Table merging/splitting
  - Capacity management
  - Pre-reservation system
- **Status**: 🔬 Under discussion

### Phase 3 (Q4 2026) 💡

#### 3.1 Z-Report (End-of-Shift Settlement)
- **Idea**: Cash register reconciliation at end of shift
- **Features**:
  - Total cash received vs reported
  - Total card transactions
  - Discrepancy handling
  - Manager approval workflow
  - Shift summary report
- **DB Schema**: `ZReport`, `PaymentSummary`
- **Status**: 💡 Backlog (Payment foundation exists)

#### 3.2 Kitchen Display System (KDS)
- **Idea**: Kitchen display instead of paper tickets
- **Features**:
  - Order queue (by table, by item type)
  - Grill/fryer/prep station assignment
  - Item status (pending, cooking, ready, served)
  - Audio/visual alerts
  - Kitchen staff view (read-only)
- **Real-time Tech**: SignalR KdsHub
- **Status**: 💡 Not yet scheduled

#### 3.3 Inventory Management
- **Idea**: Track ingredients, recipe costing, usage
- **Features**:
  - Ingredient master list (with unit, cost)
  - Recipe definition (ingredient + quantity)
  - Stock in/out transactions
  - Low-stock alerts
  - Cost of goods tracking
  - Recipe margin calculation
- **DB Schema**: `Ingredient`, `Recipe`, `RecipeItem`, `Inventory`, `InventoryTransaction`
- **Status**: 💡 Backlog (schema drafted)

#### 3.4 Advanced Reporting
- **Idea**: Revenue analytics, trend analysis, export
- **Features**:
  - Daily/weekly/monthly revenue
  - Item popularity ranking
  - Staff performance metrics
  - Time-based filters (date range, hour)
  - Export to Excel/PDF
  - Charts & dashboards
- **API**: Existing 7-day revenue endpoint (expand)
- **Status**: 🔬 Expand existing analytics

#### 3.5 Promotions & Vouchers
- **Idea**: Discount rules (fixed, percentage, buy-X-get-Y)
- **Features**:
  - Discount code system
  - Conditional rules (min amount, item-specific, time-based)
  - Voucher (stackable/non-stackable)
  - Loyalty program integration
  - Promotion analytics
- **Business Logic**: See business_accounting_rules.md §2
- **Status**: 💡 Backlog

#### 3.6 Split Bill & Merge Tables
- **Idea**: Separate bills from one table or merge multiple tables
- **Features**:
  - Split order by items or amount
  - Item-level payment tracking
  - Merge orders from adjacent tables
  - AA/AB/group split scenarios
- **Business Logic**: See business_accounting_rules.md §3
- **Status**: 💡 Backlog

### Phase 4 (Future) 🌟

#### 4.1 QR Code Customer Ordering
- **Idea**: Customer scans QR → orders from phone → kitchen receives → payment on table
- **Features**:
  - Dynamic QR codes (one per table)
  - Mobile-friendly menu view
  - Add to cart + submit order
  - Real-time order status
  - Payment terminal integration
  - Delivery/takeaway support
- **Tech**: Razor view riêng (responsive, không cần đăng nhập), route `/qr/{shopId}/{tableId}`
- **Real-time**: SignalR for order updates to customer phone
- **Status**: 💡 Chưa triển khai lại trên MVC (đã có ở bản React cũ, cần port)

#### 4.2 Delivery & Takeaway
- **Idea**: Non-dine-in orders
- **Features**:
  - Order type selection (dine-in, takeaway, delivery)
  - Delivery address & fee calculation
  - Delivery agent assignment & tracking
  - Live tracking for customer
  - Delivery route optimization
- **Status**: 💡 Future consideration

#### 4.3 Mobile App (Native)
- **Idea**: Native mobile app for staff & customers
- **Tech**: React Native or Flutter
- **Features**:
  - Staff: table management, orders, payments
  - Customer: QR ordering, order tracking
- **Status**: 💡 Post-web stabilization

#### 4.4 Multi-location Analytics
- **Idea**: Chain-level insights across all shops
- **Features**:
  - Consolidated revenue by location
  - Staff performance across locations
  - Benchmark comparisons
  - Supply chain optimization
- **Status**: 💡 Future (after multi-shop stabilization)

---

## 🛡️ **SECTION 5: ARCHITECTURE PRINCIPLES & RULES**

### Clean Architecture Mandates
1. **Domain Layer Independence**
   - No EF Core decorators (no `[Table]`, `[Column]`)
   - Pure C# domain logic
   - Value Objects for money, status enums
   - Exceptions are domain exceptions (not generic)

2. **Application Layer Services**
   - Command/Query handlers (optional CQRS)
   - DTOs for input/output (not passing entities)
   - Business rule validation
   - Transaction management

3. **Infrastructure Isolation**
   - EF Core lives here (DbContext, Migrations, Repositories)
   - SignalR Hubs
   - External service integrations
   - No business logic leakage

4. **Web (MVC) as Thin Layer**
   - Controllers route to Application services, return Views with ViewModels
   - Minimal logic in controllers (PRG pattern: POST → redirect → GET)
   - Không truyền entity trực tiếp ra View, luôn map sang ViewModel

### Multi-tenant Isolation Enforcement
1. **All controllers must**:
   - Resolve `ShopId`/`BranchId` qua `ITenantService` (claim → header legacy → Session)
   - Validate user has access to that `ShopId`
   - Pass `ShopId` to all repository queries

2. **EF Core Global Query Filters**:
   - Auto-filter all entities by `ShopId`
   - Example: `modelBuilder.Entity<Table>().HasQueryFilter(t => t.ShopId == _tenantId);`
   - Prevents accidental data leakage

3. **Session Enforcement**:
   - `ShopController`/`BranchController` ghi `ShopId`/`BranchId` vào Session khi user chọn/tạo shop/branch
   - `AccountController` tự chọn Shop/Branch khi login nếu user chỉ có đúng 1

### Database & Currency Rules
1. **Currency Handling**:
   - Use `decimal(18,2)` for all monetary fields
   - Never use `double` or `float`
   - Use `MidpointRounding.AwayFromZero` for rounding
   - Example: `decimal price = Math.Round(total, 2, MidpointRounding.AwayFromZero);`

2. **Soft Delete Preference**:
   - Default to soft delete (IsDeleted flag) unless user explicitly requests permanent deletion
   - Global Query Filter excludes deleted records by default
   - Admins can optionally view/restore deleted records

3. **Schema Changes**:
   - All DB schema changes MUST be EF Core Migrations
   - Run `dotnet ef migrations add MigrationName`
   - Update [docs/architecture/database_schema.md](docs/architecture/database_schema.md)
   - Never drop tables/columns without migration
   - Migrations must be additive (backward compatible)

4. **Audit Trail** (Optional but Recommended):
   - CreatedAt, UpdatedAt, DeletedAt timestamps on all domain entities
   - CreatedBy, UpdatedBy tracking (UserId)
   - Soft delete via IsDeleted boolean

### Language Policy
| Context | Language | Example |
|---------|----------|---------|
| Code (variables, functions, classes) | English | `CreateOrder`, `totalPrice`, `OrderStatus` |
| Documentation & Discussion | Vietnamese | "Tạo đơn hàng", "Kiến trúc của hệ thống" |
| Comments (complex logic) | Vietnamese | `// Tính toán tiền thối dựa trên phương thức thanh toán` |
| Commit messages | English | `feat: add QR code ordering`, `fix: table soft delete` |
| Issues/PRs | English (commit) + Vietnamese (description) | |

### Code Quality Standards
1. **Naming Conventions**:
   - PascalCase for classes, methods, properties
   - camelCase for local variables, parameters
   - UPPER_CASE for constants
   - Meaningful names (no abbreviations unless universally known)

2. **No Magic Numbers**:
   - Extract to named constants
   - Example: `const MaxStaffFreeplan = 5;`

3. **Error Handling**:
   - Use domain-specific exceptions (e.g., `InvalidOrderException`)
   - Catch exceptions at Application/WebAPI layer
   - Return proper HTTP status codes (400, 403, 404, 500)

4. **Testing Mindset**:
   - Write testable code (dependency injection)
   - Unit test domain logic
   - Integration test repository + EF Core
   - E2E test critical workflows

---

## 📊 **SECTION 6: DATABASE SCHEMA (Core Entities)**

### Identity & Tenancy
```sql
/* Users & Roles */
AspNetUsers (from ASP.NET Identity)
├── Id (PK)
├── Email
├── PasswordHash
├── PhoneNumber
├── FullName
├── CreatedAt, UpdatedAt

AspNetRoles (from ASP.NET Identity)
├── Id (PK)
├── Name (e.g., "Admin", "SystemUser")

AspNetUserRoles (junction)
├── UserId (FK)
└── RoleId (FK)

/* Shops & Membership */
Shops
├── Id (PK)
├── OwnerId (FK → AspNetUsers)
├── Name
├── Address, Phone, Email
├── Logo (URL)
├── CreatedAt, UpdatedAt, DeletedAt (soft delete)

Branches
├── Id (PK)
├── ShopId (FK → Shops)
├── Name
├── Address, Phone
├── CreatedAt, UpdatedAt, DeletedAt (soft delete)

ShopMembers (RBAC mapping)
├── Id (PK)
├── ShopId (FK)
├── UserId (FK)
├── Role (Owner/Manager/Staff/Chef enum)
├── JoinedAt
├── IsActive
├── DeletedAt (soft delete)
```

### Menu & Ordering
```sql
/* Menu */
Menus
├── Id (PK)
├── ShopId (FK)
├── BranchId (FK, nullable - null = shared for all branches)
├── Name
├── IsActive

Categories
├── Id (PK)
├── MenuId (FK)
├── Name
├── DisplayOrder

MenuItems
├── Id (PK)
├── CategoryId (FK)
├── Name
├── Description
├── Price (decimal(18,2))
├── ImageUrl
├── IsAvailable
├── CreatedAt, UpdatedAt, DeletedAt (soft delete)

/* Tables */
Tables
├── Id (PK)
├── ShopId (FK)
├── BranchId (FK)
├── Name (e.g., "Table 1")
├── SeatCount
├── Area (e.g., "Main Hall", "VIP")
├── Status (Available/Occupied/Dirty/Reserved)
├── CreatedAt, UpdatedAt, DeletedAt (soft delete)

/* Orders & Items */
Orders
├── Id (PK)
├── ShopId (FK)
├── TableId (FK)
├── OrderNumber (unique per shop)
├── Status (Draft/Active/Completed/Paid)
├── TotalAmount (decimal(18,2))
├── CreatedAt, UpdatedAt, DeletedAt (soft delete)
├── PaidAt (nullable)

OrderItems
├── Id (PK)
├── OrderId (FK)
├── MenuItemId (FK)
├── Quantity
├── UnitPrice (decimal(18,2))
├── Notes (special requests)
├── Status (Pending/Cooking/Ready/Served)
├── CreatedAt, UpdatedAt

/* Payments */
Payments
├── Id (PK)
├── OrderId (FK)
├── Method (Cash/Card/BankTransfer enum)
├── Amount (decimal(18,2))
├── Status (Pending/Completed/Refunded)
├── TransactionId (for card/bank)
├── CreatedAt, UpdatedAt

/* Future: Inventory (scaffolded) */
Ingredients
├── Id (PK)
├── ShopId (FK)
├── Name
├── Unit (kg, liter, pieces, etc.)
├── CostPerUnit (decimal(18,2))
├── CreatedAt, UpdatedAt

Recipes
├── Id (PK)
├── MenuItemId (FK)
├── CostPerServing (calculated)

RecipeItems (recipe components)
├── Id (PK)
├── RecipeId (FK)
├── IngredientId (FK)
├── Quantity
├── Unit

Inventory
├── Id (PK)
├── ShopId (FK)
├── IngredientId (FK)
├── CurrentStock (decimal)
├── LastCountedAt

InventoryTransactions
├── Id (PK)
├── InventoryId (FK)
├── Type (In/Out)
├── Quantity (decimal)
├── Reason (Purchase/Usage/Adjustment/Loss)
├── TransactionDate
```

---

## 🔄 **SECTION 7: KEY WORKFLOWS**

### 1. User Registration & Shop Creation
```
User → Register (email, password) 
  → Backend creates AspNetUser
  → Frontend redirects to "Create First Shop"
  → User fills shop info
  → Backend creates Shop + adds user as Owner
  → AuthContext stores currentShop
  → Redirect to Dashboard
```

### 2. Staff Invitation Workflow
```
Owner → SettingsPage 
  → Clicks "Invite Staff"
  → Enters email + selects Role
  → Backend sends invitation email
  → Invitee clicks link
  → System creates ShopMember with that Role
  → Invitee logs in → currentShop auto-selected
```

### 3. Order Placement Flow (Server)
```
Server → Dashboard Table View
  → Clicks table → TableDetails
  → Clicks "New Order"
  → Menu grid shows items
  → Select items + quantity → Add to Cart
  → Review order (OrderSidebar)
  → Click "Submit Order"
  → Backend creates Order + OrderItems
  → SignalR broadcast: Order placed (kitchen display)
  → Table status changes to "Occupied"
```

### 4. Real-time Order Updates (Kitchen → Server)
```
Kitchen staff → Marks item "Ready"
  → Backend updates OrderItem.Status = Ready
  → SignalR broadcast to all connected staff
  → Server's OrderSidebar updates (item shows "ready")
  → Ticket printer triggers (optional)
```

### 5. Payment & Settlement
```
Server/Cashier → OrderSidebar
  → Reviews total
  → Clicks "Settle Payment"
  → Selects payment method (Cash/Card/Bank)
  → If card: integrates with payment gateway
  → Backend records Payment
  → Order.Status = Paid
  → Table.Status = Available
  → Receipt generated & printed
```

### 6. QR Code Ordering (Customer)
```
Customer → Scans QR on table
  → Opens QROrderPage (mobile-friendly)
  → Browses menu (same React frontend)
  → Adds items to cart
  → Submits order
  → Backend creates Order (linked to Table)
  → Kitchen sees order
  → Customer sees real-time status updates
  → Waiter delivers dishes
  → Customer scans to pay (or waiter brings terminal)
```

---

## ⚙️ **SECTION 8: DEVELOPMENT WORKFLOW**

### Setup Instructions

#### Prerequisites
- .NET 9 SDK
- SQL Server Express (or LocalDB)
- Git

#### Setup
```bash
# 1. Clone repo
git clone https://github.com/TrungKien2810/ShopManagement.git
cd ShopManagement

# 2. Set connection string in src/ShopManagement.Web/appsettings.json
# ConnectionStrings:DefaultConnection

# 3. Build & run (migration + seed chạy tự động khi start)
dotnet build
dotnet run --project src/ShopManagement.Web/ShopManagement.Web.csproj

# App chạy trên https://localhost:xxxx (theo launchSettings.json), MVC server-render,
# không có Swagger (không còn API riêng) — toàn bộ UI là Razor View.
```

#### Running Tests
```bash
dotnet test
```

### Git Workflow
1. Create feature branch: `git checkout -b feat/feature-name`
2. Make changes, test locally
3. Commit with message: `git commit -m "feat: description"` (English)
4. Push: `git push origin feat/feature-name`
5. Create PR with Vietnamese description
6. Code review & merge to main

### Commit Message Format
```
<type>: <short-summary>

<optional-longer-description>

Fixes: #<issue-number> (if applicable)
```

**Types**: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`

---

## 📋 **SECTION 9: GOVERNANCE & CODE REVIEW**

### Pre-commit Checks (Local)
1. **Code Formatting**: Run `dotnet format` (backend) & `npm run lint` (frontend)
2. **Type Safety**: Ensure TypeScript strict mode, no `any`
3. **Testing**: Run test suite, ensure no regressions
4. **Security**: No hardcoded credentials, validate inputs

### Code Review Checklist
- [ ] Follows Clean Architecture layers
- [ ] Multi-tenant isolation enforced (ShopId checks)
- [ ] Currency handled correctly (decimal, no float)
- [ ] Database migrations are additive
- [ ] Error handling present
- [ ] Tests included (unit or integration)
- [ ] Documentation updated (docs/modules/ if relevant)
- [ ] Design system respected (Ember Bistro colors, fonts)
- [ ] Performance acceptable (no N+1 queries, optimize SignalR broadcasts)
- [ ] No breaking changes to existing APIs

### Documentation Requirements
1. **New Feature**: Create/update `docs/modules/<feature-name>.md`
2. **API Change**: Update `docs/architecture/backend_playbook.md`
3. **UI Change**: Update `docs/architecture/frontend_playbook.md`
4. **DB Change**: Update `docs/architecture/database_schema.md`
5. **Business Rule**: Update `docs/architecture/business_accounting_rules.md`

---

## 🚀 **SECTION 10: DEPLOYMENT & ROADMAP**

### Deployment Strategy
- **App**: Docker containerization (multi-stage build) → Cloud (Azure App Service or similar);
  single deployable (MVC app serves UI + business logic, no separate frontend deploy)
- **Database**: Azure SQL Database or SQL Server managed service
- **Real-time**: SignalR scales with Azure SignalR Service (production)
- **CI/CD**: GitHub Actions (unit tests, build, deploy on PR merge)

### Timeline (Estimated)
- **Phase 1 (MVP)**: June 2026 ✅ (current)
- **Phase 2 (Shift + Quota)**: Q3 2026 🔬
- **Phase 3 (KDS + Inventory + Advanced Reports)**: Q4 2026 💡
- **Phase 4 (QR + Delivery + Mobile App)**: 2027+

### Success Milestones
- [ ] MVP deployed & accessible
- [ ] First beta testers (2-3 restaurants)
- [ ] User feedback integration
- [ ] Shift management MVP
- [ ] Mobile-responsive QR ordering
- [ ] Production-grade performance (< 200ms API latency)
- [ ] 99.9% uptime SLA

---

## 📚 **SECTION 11: REFERENCE DOCUMENTS**

Keep in sync with this master IDEAS.md:

1. **[AGENTS.md](AGENTS.md)** → Single source of truth for AI agents
2. **[DESIGN.md](DESIGN.md)** → Ember Bistro visual system
3. **[docs/architecture/system_overview.md](docs/architecture/system_overview.md)** → High-level architecture
4. **[docs/architecture/database_schema.md](docs/architecture/database_schema.md)** → Entity relationships
5. **[docs/architecture/backend_playbook.md](docs/architecture/backend_playbook.md)** → Backend conventions
6. **[docs/architecture/frontend_playbook.md](docs/architecture/frontend_playbook.md)** → Frontend conventions
7. **[docs/architecture/business_accounting_rules.md](docs/architecture/business_accounting_rules.md)** → Business logic
8. **[docs/modules/table_management.md](docs/modules/table_management.md)** → Table feature spec
9. **[docs/modules/menu_ordering.md](docs/modules/menu_ordering.md)** → Menu & order spec
10. **[docs/modules/qr_order.md](docs/modules/qr_order.md)** → QR ordering feature

---

## 🎓 **CONCLUSION**

**ShopManagement (ZôOS)** is a full-stack **SaaS restaurant management system** with:
- ✅ Solid multi-tenant architecture
- ✅ Real-time ordering & kitchen display
- ✅ Beautiful, warm UI (Ember Bistro)
- ✅ Clean, testable, scalable code
- ✅ Clear roadmap (Phase 1-4)
- ✅ Governance & code quality standards

This document serves as the **master blueprint** for reinitializing the project. Use it to onboard new team members, plan sprints, and maintain consistency across backend/frontend/design.

---

**Last Updated**: 2026-06-23  
**Maintained By**: TrungKien  
**Next Review**: After Phase 1 completion
