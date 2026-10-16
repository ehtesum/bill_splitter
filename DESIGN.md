# Design Specification (DESIGN) — BillSplitter

## 1. Visual Theme & Styling Tokens
- **Theme**: Clean Modern Minimalist (Tailwind CSS, Glassmorphism accents).
- **Color Palette**:
  - Background: Crisp Slate (`#0F172A` Dark, `#F8FAFC` Light).
  - Primary Action: Electric Indigo (`#6366F1`).
  - Positive Balance (You get back): Mint Emerald (`#10B981`).
  - Negative Balance (You owe): Warm Rose (`#F43F5E`).
- **Typography**: Inter for UI controls, Plus Jakarta Sans for headings and monetary amounts.

---

## 2. Component Layout & Key Views

### 2.1 Main Dashboard View
- **Top Summary Banner**: Total Group Spend, Total Expenses Count, and User's Net Personal Balance pill (`+ $45.00` or `- $20.00`).
- **Action Bar**: Big "Add Expense" button, "Settle Up" view toggle, and "Share Group QR" button.
- **Expense Feed**: Chronological list of cards showing:
  - Expense Title, Category Icon, Payer Name ("Alex paid $80.00"), and your personal involvement ("You lent $20.00").

### 2.2 Settlement Modal ("Who Pays Whom")
- Clean transaction flow cards with directional arrows:
  ```
  [Sarah] ──────── $32.50 ───────▶ [Alex]
  [David] ──────── $18.00 ───────▶ [Alex]
  ```
- "Copy for WhatsApp" button generating formatted message text with one tap.

### 2.3 QR Code Share Drawer
- High-contrast QR code generated directly onto a canvas element. Friends scan with phone camera to instantly load the full trip ledger into their own browsers.
