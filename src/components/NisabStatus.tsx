
import React from 'react';
import { Coins, AlertCircle, CheckCircle } from 'lucide-react';
import { useZakatStore } from '@/store/useZakatStore';

// CONSTANTS
const GOLD_PRICE_PER_GRAM = 65;
const NISAB_THRESHOLD_GRAMS = 85;
const NISAB_VALUE = GOLD_PRICE_PER_GRAM * NISAB_THRESHOLD_GRAMS; // $5525

export function NisabStatus() {
    const assets = useZakatStore((state) => state.assets);

    // Zakatable Ratio: Cash + Inventory + Receivables (Fixed Assets are exempt)
    const netZakatableWealth = assets.cash + assets.inventory + assets.receivables;

    const isLiable = netZakatableWealth >= NISAB_VALUE;

    return (
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-l-amber-500">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                        <Coins className="w-5 h-5 text-amber-500" />
                        Nisab Threshold
                    </h2>
                    <p className="text-sm text-slate-500">Minimum wealth for Zakat liability</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${isLiable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                    {isLiable ? (
                        <>
                            <CheckCircle className="w-4 h-4" /> Zakat Liable
                        </>
                    ) : (
                        <>
                            <AlertCircle className="w-4 h-4" /> Exempt
                        </>
                    )}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Current Gold Price</span>
                    <span className="font-mono font-medium">${GOLD_PRICE_PER_GRAM}/g</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Nisab Value (85g)</span>
                    <span className="font-mono font-bold text-amber-600">${NISAB_VALUE.toLocaleString()}</span>
                </div>

                <div className="mt-4 pt-2">
                    <div className="flex justify-between text-sm mb-1">
                        <span>Net Wealth</span>
                        <span className={isLiable ? "text-emerald-600 font-bold" : "text-slate-500"}>
                            ${netZakatableWealth.toLocaleString()}
                        </span>
                    </div>
                    {/* Progress bar to Nisab */}
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div
                            className={`h-2.5 rounded-full ${isLiable ? 'bg-emerald-500' : 'bg-amber-400'}`}
                            style={{ width: `${Math.min((netZakatableWealth / NISAB_VALUE) * 100, 100)}%` }}
                        ></div>
                    </div>
                    {!isLiable && (
                        <p className="text-xs text-slate-400 mt-1 text-right">
                            ${(NISAB_VALUE - netZakatableWealth).toLocaleString()} more needed
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
