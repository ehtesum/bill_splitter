export interface Participant {
  id: string;
  name: string;
  color: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidById: string;
  beneficiaryIds: string[];
  createdAt: number;
}

export interface SettlementTransaction {
  fromId: string;
  toId: string;
  amount: number;
}

export interface GroupState {
  groupName: string;
  currency: string;
  participants: Participant[];
  expenses: Expense[];
}
