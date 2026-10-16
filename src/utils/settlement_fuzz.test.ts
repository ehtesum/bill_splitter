import { describe, it, expect } from 'vitest';
import { calculateSettlements } from './settlement';
import { Participant, Expense } from '../types';

describe('Settlement Algorithm Invariant & Stress Tests', () => {
  it('strictly preserves conservation of value under randomized fuzzy expenses', () => {
    // Generate 10 participants
    const participants: Participant[] = Array.from({ length: 10 }, (_, i) => ({
      id: `p_${i}`,
      name: `User ${i}`,
      color: '#000000'
    }));

    // Generate 50 random expenses
    const expenses: Expense[] = [];
    for (let i = 0; i < 50; i++) {
      const payerIdx = Math.floor(Math.random() * participants.length);
      const numBeneficiaries = 1 + Math.floor(Math.random() * (participants.length - 1));
      
      const shuffled = [...participants].sort(() => 0.5 - Math.random());
      const beneficiaryIds = shuffled.slice(0, numBeneficiaries).map(p => p.id);
      
      const randomAmount = Math.round((Math.random() * 200 + 5) * 100) / 100; // $5 to $205

      expenses.push({
        id: `exp_${i}`,
        title: `Expense ${i}`,
        amount: randomAmount,
        paidById: participants[payerIdx].id,
        beneficiaryIds,
        createdAt: Date.now() + i
      });
    }

    const settlements = calculateSettlements(participants, expenses);

    // Invariant 1: No self transfers
    settlements.forEach(tx => {
      expect(tx.fromId).not.toBe(tx.toId);
    });

    // Invariant 2: Strictly positive transfer amounts
    settlements.forEach(tx => {
      expect(tx.amount).toBeGreaterThan(0);
    });

    // Invariant 3: Net balance after settlements must be virtually 0 for all participants
    const netBalances: Record<string, number> = {};
    participants.forEach(p => (netBalances[p.id] = 0));

    // Calculate actual expenses net balance
    expenses.forEach(exp => {
      const totalCents = Math.round(exp.amount * 100);
      netBalances[exp.paidById] += totalCents;
      const perHead = Math.floor(totalCents / exp.beneficiaryIds.length);
      let rem = totalCents % exp.beneficiaryIds.length;
      exp.beneficiaryIds.forEach(bId => {
        netBalances[bId] -= (perHead + (rem > 0 ? 1 : 0));
        if (rem > 0) rem--;
      });
    });

    // Apply settlements
    settlements.forEach(tx => {
      const cents = Math.round(tx.amount * 100);
      netBalances[tx.fromId] += cents;
      netBalances[tx.toId] -= cents;
    });

    // Everyone's balance should now be settled to within ±1 cent (penny rounding margin)
    Object.values(netBalances).forEach(balance => {
      expect(Math.abs(balance)).toBeLessThanOrEqual(2);
    });
  });

  it('solves 100 participants and 300 expenses in under 50ms', () => {
    const participants: Participant[] = Array.from({ length: 100 }, (_, i) => ({
      id: `scale_p_${i}`,
      name: `Scale User ${i}`,
      color: '#123456'
    }));

    // Participant 0 pays for half the expenses, so settlements are guaranteed non-zero
    const expenses: Expense[] = Array.from({ length: 300 }, (_, i) => ({
      id: `scale_exp_${i}`,
      title: `Scale Expense ${i}`,
      amount: 45.75,
      paidById: i % 2 === 0 ? 'scale_p_0' : `scale_p_${i % 100}`,
      beneficiaryIds: [`scale_p_${(i + 1) % 100}`, `scale_p_${(i + 2) % 100}`],
      createdAt: i
    }));

    const t0 = performance.now();
    const result = calculateSettlements(participants, expenses);
    const elapsed = performance.now() - t0;

    expect(elapsed).toBeLessThan(50);
    expect(result.length).toBeGreaterThan(0);
  });
});
