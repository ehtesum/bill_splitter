import { describe, it, expect } from 'vitest';
import { calculateSettlements } from './settlement';
import { Participant, Expense } from '../types';

describe('calculateSettlements', () => {
  const participants: Participant[] = [
    { id: 'alice', name: 'Alice', color: '#ff0000' },
    { id: 'bob', name: 'Bob', color: '#00ff00' },
    { id: 'charlie', name: 'Charlie', color: '#0000ff' }
  ];

  it('returns empty array when there are no expenses', () => {
    const result = calculateSettlements(participants, []);
    expect(result).toEqual([]);
  });

  it('correctly splits equal expense between two people', () => {
    const expenses: Expense[] = [
      {
        id: 'e1',
        title: 'Lunch',
        amount: 30,
        paidById: 'alice',
        beneficiaryIds: ['alice', 'bob'],
        createdAt: Date.now()
      }
    ];

    const result = calculateSettlements(participants, expenses);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      fromId: 'bob',
      toId: 'alice',
      amount: 15
    });
  });

  it('correctly calculates multi-person uneven cents split without penny drift', () => {
    const expenses: Expense[] = [
      {
        id: 'e2',
        title: 'Coffee',
        amount: 10, // $10 split 3 ways is $3.33, $3.33, $3.34
        paidById: 'alice',
        beneficiaryIds: ['alice', 'bob', 'charlie'],
        createdAt: Date.now()
      }
    ];

    const result = calculateSettlements(participants, expenses);
    expect(result).toHaveLength(2);

    const totalTransferred = result.reduce((sum, tx) => sum + tx.amount, 0);
    // Alice paid $10, her share is $3.34. Bob and Charlie owe $3.33 each ($6.66 total).
    expect(Math.round(totalTransferred * 100) / 100).toBeCloseTo(6.66, 2);
    result.forEach(tx => expect(tx.toId).toBe('alice'));
  });

  it('minimizes transfers when multiple people pay for different items', () => {
    const expenses: Expense[] = [
      {
        id: 'e1',
        title: 'Groceries',
        amount: 60, // paid by Alice for Alice, Bob, Charlie ($20 each)
        paidById: 'alice',
        beneficiaryIds: ['alice', 'bob', 'charlie'],
        createdAt: 1
      },
      {
        id: 'e2',
        title: 'Taxi',
        amount: 30, // paid by Bob for Alice, Bob, Charlie ($10 each)
        paidById: 'bob',
        beneficiaryIds: ['alice', 'bob', 'charlie'],
        createdAt: 2
      }
    ];

    // Net balances:
    // Alice: paid 60, consumed 20+10=30 -> +30
    // Bob: paid 30, consumed 20+10=30 -> 0
    // Charlie: paid 0, consumed 20+10=30 -> -30
    const result = calculateSettlements(participants, expenses);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      fromId: 'charlie',
      toId: 'alice',
      amount: 30
    });
  });

  it('handles case where payer is not a beneficiary', () => {
    const expenses: Expense[] = [
      {
        id: 'e1',
        title: 'Gift for Charlie',
        amount: 50,
        paidById: 'alice',
        beneficiaryIds: ['bob'], // Alice buys solely for Bob
        createdAt: 1
      }
    ];

    const result = calculateSettlements(participants, expenses);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      fromId: 'bob',
      toId: 'alice',
      amount: 50
    });
  });
});
