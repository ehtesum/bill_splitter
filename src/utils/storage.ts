import { GroupState } from '../types';

const STORAGE_KEY = 'billsplitter:state';

export const DEFAULT_STATE: GroupState = {
  groupName: 'Dinner & Trip',
  currency: '$',
  participants: [
    { id: 'p_1', name: 'Alex', color: '#6366F1' },
    { id: 'p_2', name: 'Sarah', color: '#10B981' },
    { id: 'p_3', name: 'David', color: '#F59E0B' }
  ],
  expenses: []
};

export function loadInitialState(): GroupState {
  try {
    const hash = window.location.hash;
    if (hash.startsWith('#data=')) {
      const json = decodeURIComponent(atob(hash.substring(6)));
      const parsed = JSON.parse(json);
      if (parsed.participants && parsed.expenses) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to parse URL hash state', e);
  }

  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      return JSON.parse(local);
    }
  } catch (e) {
    console.warn('Failed to read localStorage', e);
  }

  return DEFAULT_STATE;
}

export function saveState(state: GroupState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to write to localStorage', e);
  }
}

export function generateShareUrl(state: GroupState): string {
  try {
    const json = JSON.stringify(state);
    const encoded = btoa(encodeURIComponent(json));
    const url = new URL(window.location.href);
    url.hash = `data=${encoded}`;
    return url.toString();
  } catch (e) {
    return window.location.href;
  }
}
