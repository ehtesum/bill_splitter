import { describe, it, expect, beforeEach } from 'vitest';
import { loadInitialState, saveState, generateShareUrl, DEFAULT_STATE } from './storage';
import { GroupState } from '../types';

describe('Storage and State Serialization', () => {
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    mockStorage = {};
    globalThis.localStorage = {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, val: string) => { mockStorage[key] = val; },
      removeItem: (key: string) => { delete mockStorage[key]; },
      clear: () => { mockStorage = {}; },
      length: 0,
      key: () => null
    };

    globalThis.window = {
      location: {
        href: 'http://localhost:5173/',
        hash: ''
      }
    } as any;
  });

  it('loads default state when localStorage and hash are empty', () => {
    const state = loadInitialState();
    expect(state.groupName).toBe(DEFAULT_STATE.groupName);
    expect(state.participants.length).toBe(3);
  });

  it('saves and loads state cleanly from localStorage', () => {
    const customState: GroupState = {
      groupName: 'Summer Vacation',
      currency: '€',
      participants: [
        { id: 'u1', name: 'Marco', color: '#ff0000' }
      ],
      expenses: []
    };

    saveState(customState);
    const loaded = loadInitialState();
    expect(loaded.groupName).toBe('Summer Vacation');
    expect(loaded.currency).toBe('€');
  });

  it('generates a valid URL hash and restores state accurately', () => {
    const stateToShare: GroupState = {
      groupName: 'Ski Trip',
      currency: '$',
      participants: [
        { id: 'p1', name: 'Elena', color: '#123456' }
      ],
      expenses: [
        {
          id: 'e1',
          title: 'Cabin Rental',
          amount: 450,
          paidById: 'p1',
          beneficiaryIds: ['p1'],
          createdAt: 100
        }
      ]
    };

    const shareUrl = generateShareUrl(stateToShare);
    expect(shareUrl).toContain('#data=');

    // Simulate opening with hash
    const hash = shareUrl.split('#')[1];
    window.location.hash = `#${hash}`;

    const restored = loadInitialState();
    expect(restored.groupName).toBe('Ski Trip');
    expect(restored.expenses.length).toBe(1);
    expect(restored.expenses[0].amount).toBe(450);
  });
});
