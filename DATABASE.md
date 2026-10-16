# Database & State Specification (DATABASE) — BillSplitter

## 1. Storage Architecture
- **Primary Engine**: Browser `localStorage` backed by IndexedDB for large multi-week trips.
- **State Serialization**: JSON schema optimized for LZ-string compression to fit within standard URL length limits (< 2,048 characters).

---

## 2. TypeScript Data Models & Schema

```typescript
export interface Participant {
  id: string;              // e.g. "p_1"
  name: string;            // e.g. "Alex"
  color: string;           // Hex color for avatar
}

export type SplitMode = 'EQUAL' | 'EXACT' | 'SHARES';

export interface Expense {
  id: string;              // UUID
  title: string;           // e.g. "Airbnb Weekend"
  amount: number;          // Monetary value (cents or floating point)
  currency: string;        // e.g. "USD", "EUR"
  paidById: string;        // Reference to Participant.id
  splitMode: SplitMode;
  beneficiaries: {
    participantId: string;
    value?: number;        // Explicit amount or share ratio
  }[];
  createdAt: number;       // Unix epoch ms
}

export interface GroupState {
  id: string;
  groupName: string;
  defaultCurrency: string;
  participants: Participant[];
  expenses: Expense[];
  updatedAt: number;
}

export interface SettlementTransaction {
  fromParticipantId: string;
  toParticipantId: string;
  amount: number;
}
```

---

## 3. Storage Key Conventions
- `billsplitter:active_group_id`: Stores the string ID of the currently loaded group.
- `billsplitter:groups:<id>`: Full serialized `GroupState` JSON payload.
