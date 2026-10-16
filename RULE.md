# Engineering Rules & Guidelines (RULE) — BillSplitter

## 1. Zero-Backend Mandate
- **RULE-01: No External API Dependency**: Core calculations and state updates MUST execute entirely on the client side. No data is dispatched to any external analytics or tracking server.
- **RULE-02: Self-Contained PWA**: Service worker MUST precache all necessary application assets to allow fully offline initial page boots.

---

## 2. Mathematical & Precision Rules
- **RULE-03: Integer Cent Representation**: Calculations MUST convert floating-point input into integer cents (`Math.round(amount * 100)`) before computing splits to prevent standard IEEE floating-point remainder errors (e.g. `0.1 + 0.2 != 0.3`).
- **RULE-04: Odd Cent Distribution**: When splitting amounts with remainders (e.g. $10.00 across 3 people = $3.33 each with 1 cent left over), the residual 1 cent MUST be deterministically allocated to the payer or first beneficiary.

---

## 3. URL Safety Rules
- **RULE-05: Safe Character Encoding**: When serializing state into URL hashes, use `encodeURIComponent` over compressed LZ-String byte payloads to ensure compatibility across all messaging apps and QR scanners.
