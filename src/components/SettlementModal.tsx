import React, { useState } from 'react';
import { X, Copy, Check, ArrowRight, CheckCircle2 } from 'lucide-react';
import { GroupState } from '../types';
import { calculateSettlements } from '../utils/settlement';

interface SettlementModalProps {
  state: GroupState;
  isOpen: boolean;
  onClose: () => void;
}

export const SettlementModal: React.FC<SettlementModalProps> = ({
  state,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const settlements = calculateSettlements(state.participants, state.expenses);
  const totalSpend = state.expenses.reduce((sum, e) => sum + e.amount, 0);

  const participantMap = new Map(state.participants.map(p => [p.id, p]));

  const handleCopySummary = () => {
    let text = `💸 *${state.groupName}* Settlement Summary\n`;
    text += `Total Spend: ${state.currency}${totalSpend.toFixed(2)}\n\n`;

    if (settlements.length === 0) {
      text += '✅ All debts are settled! No payments needed.';
    } else {
      text += 'Transfers needed:\n';
      settlements.forEach(s => {
        const from = participantMap.get(s.fromId)?.name || 'Someone';
        const to = participantMap.get(s.toId)?.name || 'Someone';
        text += `• ${from} pays ${to} ${state.currency}${s.amount.toFixed(2)}\n`;
      });
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl text-white">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h2 className="text-lg font-bold">Settlement Plan</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {settlements.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-medium text-slate-300">All balances are even!</p>
              <p className="text-xs text-slate-500 mt-1">No money owes to anyone.</p>
            </div>
          ) : (
            settlements.map((s, idx) => {
              const from = participantMap.get(s.fromId);
              const to = participantMap.get(s.toId);
              return (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/50"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-slate-200">{from?.name}</span>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                    <span className="font-semibold text-slate-200">{to?.name}</span>
                  </div>
                  <div className="text-sm font-bold text-emerald-400">
                    {state.currency}{s.amount.toFixed(2)}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleCopySummary}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy for WhatsApp</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
