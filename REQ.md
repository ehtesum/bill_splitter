# Requirements Specification (REQ) — BillSplitter

## 1. Functional Requirements (FR)

### FR-01: Participant Management
- Users MUST be able to add participants by name.
- Each participant MUST automatically receive an assigned visual avatar color and unique identifier.

### FR-02: Expense Entry & Split Modes
- An expense entry MUST contain: Description, Total Amount, Payer ID, Participant Beneficiary IDs, and Timestamp.
- The system MUST support three split modes:
  1. **Equal Split**: Even division across all selected participants.
  2. **Exact Amounts**: Explicit monetary breakdown per person (validating that the sum equals the total).
  3. **Shares / Weights**: Integer ratio splits (e.g. 2 shares vs 1 share).

### FR-03: Debt Graph Simplification
- The engine MUST compute net balances per person (`total_paid - total_owed`).
- The engine MUST execute a minimum-transaction settlement algorithm (greedy heuristic matching max creditor with max debtor) to minimize cash transfers.

### FR-04: URL Hash & QR State Serialization
- The system MUST serialize state into a compressed string using LZ-String or Base64 Deflate.
- Loading the page with `#data=<payload>` MUST deserialize and reconstruct the entire group state without server queries.

---

## 2. Non-Functional Requirements (NFR)

### NFR-01: Performance & Web Vitals
- First Contentful Paint (FCP) MUST occur in under 300 ms on standard 4G connections.
- Settlement recalculation on 100 expenses across 20 participants MUST complete in < 5 ms.

### NFR-02: Offline PWA Compatibility
- The application MUST be registered as an offline Progressive Web App (PWA) with Service Worker caching all static JS/CSS assets.
