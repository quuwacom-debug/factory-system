
'use client';

import React from 'react';
import { useZakatStore } from '@/store/useZakatStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Download } from 'lucide-react';

const COLORS = ['#10b981', '#94a3b8']; // Emerald-500, Slate-400

export function ZakatReport() {
    const { assets, impureIncome } = useZakatStore();

    const zakatableTotal = assets.cash + assets.inventory + assets.receivables;
    const exemptTotal = assets.fixedAssets;
    const totalAssets = zakatableTotal + exemptTotal;

    const NISAB_VALUE = 85 * 65; // $5525
    const isLiable = zakatableTotal >= NISAB_VALUE;

    const zakatPayable = isLiable ? zakatableTotal * 0.025 : 0;

    const data = [
        { name: 'Zakatable Assets', value: zakatableTotal },
        { name: 'Exempt Assets', value: exemptTotal },
    ];

    if (totalAssets === 0 && impureIncome === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center text-slate-400 h-64 border border-dashed border-slate-200">
                Input asset data to generate report
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden">
            <div className="bg-emerald-900 p-6 text-white flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold">Zakat Liability Report</h2>
                    <p className="text-emerald-200 text-sm mt-1">Summary of your financial obligations</p>
                </div>
                <button className="bg-emerald-800 hover:bg-emerald-700 p-2 rounded-lg transition-colors" title="Export (Demo)">
                    <Download className="w-5 h-5" />
                </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Chart Section */}
                <div className="h-64 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: any) => [`$${Number(value).toLocaleString()}`]}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Label */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-[-10px]">
                        <div className="text-xs text-slate-400">Total Assets</div>
                        <div className="font-bold text-slate-700">${totalAssets.toLocaleString()}</div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="text-slate-600">Total Zakatable Wealth</span>
                            <span className="font-medium text-emerald-700">${zakatableTotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="text-slate-600">Zakat Rate</span>
                            <span className="font-medium text-slate-900">2.5%</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-2">
                            <span className="text-slate-600">Zakat Status</span>
                            <span className={`font-bold ${isLiable ? 'text-emerald-600' : 'text-slate-400'}`}>
                                {isLiable ? 'LIABLE' : 'BELOW THRESHOLD'}
                            </span>
                        </div>
                    </div>

                    <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                        <div className="text-sm text-emerald-800 mb-1">Total Zakat Due</div>
                        <div className="text-3xl font-bold text-emerald-900">
                            ${zakatPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>

                    {impureIncome > 0 && (
                        <div className="text-xs text-center text-red-500 bg-red-50 p-2 rounded">
                            + ${impureIncome.toLocaleString()} to be distributed separately (Purification)
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
