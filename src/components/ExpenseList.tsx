import React from 'react';
import { Trash2 } from 'lucide-react';
import { GroupState } from '../types';

interface ExpenseListProps {
  state: GroupState;
  onDeleteExpense: (id: string) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ state, onDeleteExpense }) => {
  const getParticipant = (id: string) => state.participants.find(p => p.id === id);

  if (state.expenses.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        <p className="text-sm">No expenses logged yet.</p>
        <p className="text-xs text-slate-400 mt-1">Tap "New Expense" to log dinner, hotel, or groceries.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {state.expenses.map(exp => {
        const payer = getParticipant(exp.paidById);
        const splitCount = exp.beneficiaryIds.length;
        const perPerson = splitCount > 0 ? (exp.amount / splitCount).toFixed(2) : '0.00';

        return (
          <div
            key={exp.id}
            className="flex items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                style={{ backgroundColor: payer?.color || '#6366F1' }}
              >
                {payer?.name.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-200">{exp.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Paid by <span className="font-medium text-slate-300">{payer?.name || 'Someone'}</span> • Split across {splitCount} people ({state.currency}{perPerson} each)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-base font-bold text-emerald-400">
                {state.currency}{exp.amount.toFixed(2)}
              </span>
              <button
                onClick={() => onDeleteExpense(exp.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                title="Delete Expense"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
