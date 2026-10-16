import React, { useState } from 'react';
import { X } from 'lucide-react';
import { GroupState } from '../types';

interface AddExpenseModalProps {
  state: GroupState;
  onClose: () => void;
  onAdd: (title: string, amount: number, paidById: string, beneficiaryIds: string[]) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ state, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [paidById, setPaidById] = useState(state.participants[0]?.id || '');
  const [beneficiaryIds, setBeneficiaryIds] = useState<string[]>(state.participants.map(p => p.id));

  const toggleBeneficiary = (id: string) => {
    if (beneficiaryIds.includes(id)) {
      if (beneficiaryIds.length > 1) {
        setBeneficiaryIds(beneficiaryIds.filter(b => b !== id));
      }
    } else {
      setBeneficiaryIds([...beneficiaryIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(amountStr);
    if (title.trim() && !isNaN(amount) && amount > 0 && paidById && beneficiaryIds.length > 0) {
      onAdd(title.trim(), amount, paidById, beneficiaryIds);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-base font-bold text-white">Add Group Expense</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
            <input
              type="text"
              required
              placeholder="e.g. Dinner at Olive Garden, Airbnb"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Total Amount ({state.currency})</label>
            <input
              type="number"
              step="0.01"
              required
              placeholder="0.00"
              value={amountStr}
              onChange={e => setAmountStr(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Who Paid?</label>
            <select
              value={paidById}
              onChange={e => setPaidById(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            >
              {state.participants.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Split Among</label>
            <div className="flex flex-wrap gap-2">
              {state.participants.map(p => {
                const isSelected = beneficiaryIds.includes(p.id);
                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => toggleBeneficiary(p.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white transition shadow-lg shadow-indigo-600/30"
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
