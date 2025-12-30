
import React from 'react';
import { Flame } from 'lucide-react';
import { useZakatStore } from '@/store/useZakatStore';

export function PurificationModule() {
    const { impureIncome, setImpureIncome } = useZakatStore();

    return (
        <div className="bg-white rounded-xl shadow-md p-6 border border-red-100">
            <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                    <Flame className="w-5 h-5 text-red-500" />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">Wealth Purification</h2>
            </div>

            <p className="text-sm text-slate-500 mb-4">
                Interest or non-compliant income cannot be mixed with Zakat. It must be donated entirely.
            </p>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Impure Income Amount</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                        <input
                            type="number"
                            min="0"
                            className="w-full pl-7 pr-4 py-2 border border-red-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                            placeholder="0.00"
                            value={impureIncome === 0 ? '' : impureIncome}
                            onChange={(e) => setImpureIncome(Math.max(0, parseFloat(e.target.value) || 0))}
                        />
                    </div>
                </div>

                {impureIncome > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800 flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
                        <Flame className="w-4 h-4 shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold">Action Required:</span> Donate ${impureIncome.toLocaleString()} to charity immediately. This does not count as Zakat.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
