import React, { useState, useEffect } from 'react';
import { GroupState, Expense, Participant } from './types';
import { loadInitialState, saveState } from './utils/storage';
import { Header } from './components/Header';
import { ExpenseList } from './components/ExpenseList';
import { AddExpenseModal } from './components/AddExpenseModal';
import { SettlementModal } from './components/SettlementModal';
import { ShareQrModal } from './components/ShareQrModal';

const AVATAR_COLORS = [
  '#6366F1', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4', '#EF4444'
];

export const App: React.FC = () => {
  const [state, setState] = useState<GroupState>(() => loadInitialState());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isSettlementOpen, setIsSettlementOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const handleAddExpense = (newExpense: Omit<Expense, 'id' | 'createdAt'>) => {
    const expense: Expense = {
      ...newExpense,
      id: `exp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now()
    };
    setState(prev => ({
      ...prev,
      expenses: [expense, ...prev.expenses]
    }));
  };

  const handleDeleteExpense = (id: string) => {
    setState(prev => ({
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== id)
    }));
  };

  const handleAddParticipant = (name: string) => {
    const newParticipant: Participant = {
      id: `p_${Date.now()}`,
      name,
      color: AVATAR_COLORS[state.participants.length % AVATAR_COLORS.length]
    };
    setState(prev => ({
      ...prev,
      participants: [...prev.participants, newParticipant]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        state={state}
        onOpenAddModal={() => setIsAddOpen(true)}
        onOpenSettlement={() => setIsSettlementOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onAddParticipant={handleAddParticipant}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Participant Avatars & Balance strip */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Group Members ({state.participants.length})
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {state.participants.map(p => (
              <div
                key={p.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60"
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                  style={{ backgroundColor: p.color }}
                >
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-medium text-slate-200">{p.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Expenses List */}
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6">
          <ExpenseList
            state={state}
            onDeleteExpense={handleDeleteExpense}
          />
        </section>
      </main>

      {isAddOpen && (
        <AddExpenseModal
          state={state}
          onClose={() => setIsAddOpen(false)}
          onAdd={(title, amount, paidById, beneficiaryIds) =>
            handleAddExpense({ title, amount, paidById, beneficiaryIds })
          }
        />
      )}

      <SettlementModal
        state={state}
        isOpen={isSettlementOpen}
        onClose={() => setIsSettlementOpen(false)}
      />

      <ShareQrModal
        state={state}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
};

export default App;
