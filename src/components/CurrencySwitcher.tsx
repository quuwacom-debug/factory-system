
import React from 'react';
import { useZakatStore } from '@/store/useZakatStore';
import { Globe } from 'lucide-react';

const CURRENCIES = [
    { code: 'USD', symbol: '$', label: 'US Dollar', defaultGold: 65 },
    { code: 'BDT', symbol: '৳', label: 'Bangladeshi Taka', defaultGold: 7500 }, // Approx
    { code: 'GBP', symbol: '£', label: 'British Pound', defaultGold: 50 },
    { code: 'EUR', symbol: '€', label: 'Euro', defaultGold: 60 },
    { code: 'INR', symbol: '₹', label: 'Indian Rupee', defaultGold: 5400 },
];

export function CurrencySwitcher() {
    const { currency, setCurrency, setGoldPrice } = useZakatStore();

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCurrency = e.target.value;
        const currencyData = CURRENCIES.find(c => c.code === newCurrency);

        setCurrency(newCurrency);
        if (currencyData) {
            setGoldPrice(currencyData.defaultGold);
        }
    };

    return (
        <div className="flex items-center gap-2 bg-emerald-800/50 p-2 rounded-lg border border-emerald-700">
            <Globe className="w-4 h-4 text-emerald-300" />
            <select
                value={currency}
                onChange={handleCurrencyChange}
                className="bg-transparent text-white text-sm focus:outline-none cursor-pointer [&>option]:text-slate-900"
            >
                {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                        {c.code} - {c.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export function getCurrencySymbol(code: string) {
    return CURRENCIES.find(c => c.code === code)?.symbol || '$';
}
