# Project Work Definition (PWD) — BillSplitter

## 1. Executive Summary & Vision
BillSplitter is an offline-first, zero-account group expense and dinner bill calculator built with React and TypeScript. In an era where apps like Splitwise force every person at a dinner table to register accounts, verify emails, pay monthly subscriptions, and download native apps, BillSplitter works instantly in any web browser with zero logins. It computes optimal debt settlement graphs (minimizing the total number of cash transactions) and shares state seamlessly via URL hashes or instant scannable QR codes.

---

## 2. Core Value Proposition
- **Zero Registration**: Open the webpage, add participant names, and start entering expenses immediately.
- **Offline-First Resilience**: All calculations, state updates, and storage occur inside browser memory and `localStorage`.
- **Debt Minimization Algorithm**: Uses a greedy bipartite graph algorithm to reduce 20 tangled peer-to-peer debts down to 3 or 4 simple settlements.
- **Instant State Sharing**: Encodes the entire trip or dinner state into a compressed URL hash (`#data=...`) or QR code that anyone can scan to view or edit.
- **Custom Splits**: Supports unequal splits, percentage splits, itemized restaurant receipts, and multi-currency inputs.

---

## 3. Target User Personas
- **Roommates & Housemates**: Splitting monthly groceries, Wi-Fi bills, and shared cleaning supplies.
- **Travel Groups**: Friends traveling together on road trips or holidays tracking expenses across multiple days.
- **Dinner & Party Organizers**: Quickly sorting out who paid for pizza, drinks, and appetizers without awkward spreadsheet calculations.

---

## 4. MVP Feature Scope
1. Participant roster management (Add/Remove members with custom avatar colors).
2. Expense entry (Title, Amount, Paid By, Split Method: Equal, Unequal, Percentages).
3. Live debt balance dashboard showing who owes whom.
4. "Optimal Settlement" breakdown minimizing payment transactions.
5. Exportable settlement summary card formatted for WhatsApp/iMessage text pasting.
6. Scannable QR code syncing current state across phones.
