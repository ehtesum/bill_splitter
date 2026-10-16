# Architecture Specification (ARCH) — BillSplitter

## 1. High-Level System Architecture

```
+--------------------------------------------------------------------------+
|                         React 19 View Layer                              |
|         [DashboardView]      [ExpenseModal]      [SettlementView]        |
+--------------------------------------------------------------------------+
                                     │ (Custom Hooks / React Context)
+--------------------------------------------------------------------------+
|                       Group State Store (Zustand)                        |
|                     (Participants, Expenses, Currency)                  |
+--------------------------------------------------------------------------+
             │                                              │
             ▼                                              ▼
+--------------------------+                  +----------------------------+
| Debt Simplification Core |                  | Sync & Export Engine       |
| - Net Balance Calculator |                  | - LZ-String URL Hash       |
| - Greedy Bipartite Match |                  | - Canvas QR Generator      |
+--------------------------+                  +----------------------------+
             │                                              │
             ▼                                              ▼
+--------------------------+                  +----------------------------+
| Browser LocalStorage     |                  | Clipboard & Share API      |
| - IndexedDB Persistence  |                  | - WhatsApp / SMS text      |
+--------------------------+                  +----------------------------+
```

---

## 2. Settlement Calculation Flow

```
Expenses & Participants updated
              │
              ▼
Step 1: Compute Net Balance for each person:
net_balance = SUM(all amounts paid by person) - SUM(all amounts owed by person)
              │
              ▼
Step 2: Separate into two sorted lists:
- Debtors (negative balance, ordered ascending)
- Creditors (positive balance, ordered descending)
              │
              ▼
Step 3: Greedy Match Loop:
- Take biggest Debtor (D) and biggest Creditor (C)
- Transfer amount = MIN(ABS(D.balance), C.balance)
- Record transaction: D pays C the transfer amount
- Adjust balances until all balances reach 0
              │
              ▼
Output: Array of minimal `SettlementTransaction` items
```
