import React from 'react';
import { Users, Plus, ArrowRightLeft, Share2 } from 'lucide-react';
import { GroupState } from '../types';

interface HeaderProps {
  state: GroupState;
  onOpenAddModal: () => void;
  onOpenSettlement: () => void;
  onOpenShare: () => void;
  onAddParticipant: (name: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  state,
  onOpenAddModal,
  onOpenSettlement,
  onOpenShare,
  onAddParticipant
}) => {
  const totalSpend = state.expenses.reduce((acc, e) => acc + e.amount, 0);

  const handlePromptAdd = () => {
    const name = prompt('Enter new participant name:');
    if (name && name.trim()) {
      onAddParticipant(name.trim());
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 p-4 md:p-6 text-white">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>💸</span> BillSplitter
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Total Group Spend: <span className="font-semibold text-emerald-400">{state.currency}{totalSpend.toFixed(2)}</span> • {state.participants.length} friends
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handlePromptAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Add Friend</span>
          </button>

          <button
            onClick={onOpenSettlement}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-emerald-400 transition"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Settle Up</span>
          </button>

          <button
            onClick={onOpenShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-indigo-400 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share QR</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Expense</span>
          </button>
        </div>
      </div>
    </header>
  );
};
