
import { Coins, AlertCircle, CheckCircle, Edit2 } from 'lucide-react';
import { useZakatStore } from '@/store/useZakatStore';
import { getCurrencySymbol } from './CurrencySwitcher';

const NISAB_THRESHOLD_GRAMS = 85;

export function NisabStatus() {
    const { assets, currency, goldPrice, setGoldPrice } = useZakatStore();

    const NISAB_VALUE = goldPrice * NISAB_THRESHOLD_GRAMS;
    const symbol = getCurrencySymbol(currency);

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
                    <span className="text-slate-600 flex items-center gap-1">
                        Gold Price <span className="text-xs text-slate-400">/gram</span>
                    </span>
                    <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-sm">{symbol}</span>
                        <input
                            type="number"
                            min="0"
                            className="w-20 text-right font-mono font-medium border-b border-dashed border-slate-300 focus:border-emerald-500 outline-none"
                            value={goldPrice}
                            onChange={(e) => setGoldPrice(parseFloat(e.target.value) || 0)}
                        />
                    </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-600">Nisab Value (85g)</span>
                    <span className="font-mono font-bold text-amber-600">
                        {symbol}{NISAB_VALUE.toLocaleString()}
                    </span>
                </div>

                <div className="mt-4 pt-2">
                    <div className="flex justify-between text-sm mb-1">
                        <span>Net Wealth</span>
                        <span className={isLiable ? "text-emerald-600 font-bold" : "text-slate-500"}>
                            {symbol}{netZakatableWealth.toLocaleString()}
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
                            {symbol}{(NISAB_VALUE - netZakatableWealth).toLocaleString()} more needed
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
