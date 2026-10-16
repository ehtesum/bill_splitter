import { Participant, Expense, SettlementTransaction } from '../types';

export function calculateSettlements(
  participants: Participant[],
  expenses: Expense[]
): SettlementTransaction[] {
  // Calculate net balances in cents
  const balances: Record<string, number> = {};
  participants.forEach(p => (balances[p.id] = 0));

  expenses.forEach(exp => {
    const totalCents = Math.round(exp.amount * 100);
    const count = exp.beneficiaryIds.length;
    if (count === 0) return;

    balances[exp.paidById] = (balances[exp.paidById] || 0) + totalCents;

    const perPersonCents = Math.floor(totalCents / count);
    let remainder = totalCents % count;

    exp.beneficiaryIds.forEach(bId => {
      const share = perPersonCents + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
      balances[bId] = (balances[bId] || 0) - share;
    });
  });

  // Separate debtors and creditors
  const debtors: { id: string; amount: number }[] = [];
  const creditors: { id: string; amount: number }[] = [];

  Object.entries(balances).forEach(([id, balanceCents]) => {
    if (balanceCents < -1) {
      debtors.push({ id, amount: -balanceCents });
    } else if (balanceCents > 1) {
      creditors.push({ id, amount: balanceCents });
    }
  });

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  // Match debtors to creditors
  const settlements: SettlementTransaction[] = [];
  let dIdx = 0;
  let cIdx = 0;

  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];
    const transfer = Math.min(debtor.amount, creditor.amount);

    if (transfer > 0) {
      settlements.push({
        fromId: debtor.id,
        toId: creditor.id,
        amount: transfer / 100
      });
    }

    debtor.amount -= transfer;
    creditor.amount -= transfer;

    if (debtor.amount <= 1) dIdx++;
    if (creditor.amount <= 1) cIdx++;
  }

  return settlements;
}
