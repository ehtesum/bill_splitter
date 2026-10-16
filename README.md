# BillSplitter 🧾

> An offline-first group expense calculator that minimizes debt settlements and shares trips via URL hashes or QR codes—zero accounts, zero ads, zero tracking.

Splitting expenses on trips or at dinner shouldn't require everyone at the table to download an app, create an account, verify an email, or pay for a "Pro" subscription.

**BillSplitter** runs entirely in the browser. You add participants, log who paid for what, and the app calculates the mathematically minimal number of peer-to-peer transfers needed to settle all debts. When done, tap **Share** to generate a link or QR code containing the full state in the URL hash—anyone who opens it has the exact same ledger instantly, with no backend database needed.

---

## Key Features

- ⚡ **Zero Accounts, Zero Signup**: Open the page, add your friends, and log expenses. Works on mobile, tablet, and desktop.
- 🧮 **Greedy Debt Minimization**: Solves the split-debt balance graph. If Alice owes Bob $20 and Bob owes Charlie $20, the algorithm simplifies it so Alice pays Charlie $20 directly.
- 🔗 **Zero-Backend State Sync**: The entire group state is serialized and encoded directly in the URL hash (`#data=...`) or rendered as a scannable QR code.
- 💰 **Zero Penny Drift**: Calculations are handled in integer cents before converting back to decimals, eliminating JavaScript floating-point rounding errors (e.g. `$10.00 / 3 = $3.33, $3.33, $3.34`).
- 📴 **Offline & Local Storage**: Auto-persists your active session to `localStorage` so you don't lose progress if you close the tab.

---

## How Settlement Simplification Works

Instead of everyone paying everyone else back:

```
[ Traditional Complex Debts ]               [ BillSplitter Optimal Settlement ]
Alice  ── owes $25 ──► Bob                 
Bob    ── owes $15 ──► Charlie     ───►     Alice  ── pays $15 ──► Charlie
Charlie── owes $10 ──► Alice                Alice  ── pays $10 ──► Bob
(3 transactions, tangled)                   (2 clean, direct transactions)
```

---

## Tech Stack

| Component | Library / Tool |
| :--- | :--- |
| **Framework** | React 18 with TypeScript |
| **Styling** | Tailwind CSS (Dark slate theme) |
| **Icons** | Lucide React |
| **QR Code** | `qrcode` SVG/Canvas generator |
| **Build Tool** | Vite 5 |
| **Testing** | Vitest 1.6 |

---

## Quickstart

```bash
# Clone the repository
git clone https://github.com/your-username/bill_splitter.git
cd bill_splitter

# Install dependencies
npm install

# Start local dev server (http://localhost:5173)
npm run dev

# Build production bundle
npm run build
```

---

## Testing

The test suite covers:
1. **Unit Tests**: Equal splits, multi-person splits, non-beneficiary payers.
2. **Property-Based Invariant Fuzzing**: Proves that the conservation of money holds across 50 randomized expenses (total money sent strictly equals total deficit to within ±1 cent).
3. **Storage & URL Hash Tests**: Serialization, URL encoding, and restoration tests.
4. **Performance Scale Tests**: Verifies that a 100-participant, 300-expense ledger is solved in < 50ms.

```bash
# Run test suite
npm test
```

---

## Known Limitations

1. **URL Length Limits**: Because the entire trip state is compressed into the URL hash, trips with more than ~80 expenses may exceed mobile browser URL limits (approx. 2,000 characters).
2. **No Real-Time Collaborative Conflict Resolution**: If two people edit the ledger simultaneously offline, merging requires one person to share their latest QR code to overwrite.
3. **Equal Splits Only (Current UI)**: Currently splits item totals equally among selected beneficiaries; custom dollar-amount or percentage overrides are not yet exposed in the modal.

---

## Future Work & Roadmap

- [ ] **Itemized Receipt Scanner**: Local OCR using Tesseract.js to scan a paper dinner bill and assign line items to diners.
- [ ] **LZ-String Compression**: Add lz-string compression to the URL hash to support 300+ expenses within standard URL limits.
- [ ] **Multi-Currency Converter**: Support expenses logged in foreign currencies (EUR, GBP, JPY) with offline-cached exchange rates.
- [ ] **Copyable WhatsApp/Telegram Settlement Text**: One-click formatted summary ready to paste directly into group chats.

---

## License

MIT License. Free for personal trips, roommates, and dinners everywhere.
