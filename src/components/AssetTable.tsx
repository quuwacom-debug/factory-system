
import React from 'react';
import { TrendingUp, Archive, CreditCard, Building2, Calculator } from 'lucide-react';
import { useZakatStore, AssetData } from '@/store/useZakatStore';

export function AssetTable() {
    const { assets, setAssetValue } = useZakatStore();

    const handleInputChange = (key: keyof AssetData, value: string) => {
        const numValue = Math.max(0, parseFloat(value) || 0);
        setAssetValue(key, numValue);
    };

    const zakatableTotal = assets.cash + assets.inventory + assets.receivables;

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-emerald-600" />
                    Asset Classification
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Input your current financial standing. Fixed assets are exempt.
                </p>
            </div>

            <div className="p-4">
                <table className="w-full">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-medium">
                        <tr>
                            <th className="px-4 py-3 text-left">Asset Type</th>
                            <th className="px-4 py-3 text-right">Value ($)</th>
                            <th className="px-4 py-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {/* Cash */}
                        <tr className="group hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                        <CreditCard className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-700">Cash on Hand</div>
                                        <div className="text-xs text-slate-400">Total bank & physical cash</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full text-right p-1 border rounded focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                                    value={assets.cash === 0 ? '' : assets.cash}
                                    onChange={(e) => handleInputChange('cash', e.target.value)}
                                />
                            </td>
                            <td className="px-4 py-3 text-center">
                                <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">Zakatable</span>
                            </td>
                        </tr>

                        {/* Inventory */}
                        <tr className="group hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                        <Archive className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-700">Inventory</div>
                                        <div className="text-xs text-slate-400">Market value of goods for sale</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full text-right p-1 border rounded focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                                    value={assets.inventory === 0 ? '' : assets.inventory}
                                    onChange={(e) => handleInputChange('inventory', e.target.value)}
                                />
                            </td>
                            <td className="px-4 py-3 text-center">
                                <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">Zakatable</span>
                            </td>
                        </tr>

                        {/* Receivables */}
                        <tr className="group hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                        <TrendingUp className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-700">Receivables</div>
                                        <div className="text-xs text-slate-400">Owed to you (good debt)</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full text-right p-1 border rounded focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                                    value={assets.receivables === 0 ? '' : assets.receivables}
                                    onChange={(e) => handleInputChange('receivables', e.target.value)}
                                />
                            </td>
                            <td className="px-4 py-3 text-center">
                                <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">Zakatable</span>
                            </td>
                        </tr>

                        {/* Fixed Assets */}
                        <tr className="group hover:bg-slate-50 transition-colors bg-slate-50/30">
                            <td className="px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-slate-200 rounded-lg text-slate-500">
                                        <Building2 className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-slate-600">Fixed Assets</div>
                                        <div className="text-xs text-slate-400">Equipment, property, tools</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-4 py-3">
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full text-right p-1 border rounded focus:ring-2 focus:ring-emerald-500 outline-none font-mono bg-slate-100 text-slate-500"
                                    value={assets.fixedAssets === 0 ? '' : assets.fixedAssets}
                                    onChange={(e) => handleInputChange('fixedAssets', e.target.value)}
                                />
                            </td>
                            <td className="px-4 py-3 text-center">
                                <span className="text-xs font-semibold px-2 py-1 bg-slate-200 text-slate-500 rounded-full">Exempt</span>
                            </td>
                        </tr>
                    </tbody>
                    <tfoot className="bg-emerald-50 border-t border-emerald-100">
                        <tr>
                            <td colSpan={2} className="px-4 py-3 text-right font-medium text-emerald-800">Net Zakatable Wealth</td>
                            <td className="px-4 py-3 text-right font-bold text-emerald-900 font-mono">
                                ${zakatableTotal.toLocaleString()}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
