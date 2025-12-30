
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useZakatStore } from '@/store/useZakatStore';
import { calculateHawlDueDate, formatGregorianDate } from '@/utils/hijri';
import { differenceInDays, isPast } from 'date-fns';

export function HawlTracker() {
    const { businessStartDate, setBusinessStartDate } = useZakatStore();

    const dueDate = calculateHawlDueDate(businessStartDate);

    let daysRemaining = 0;
    let progress = 0;

    if (businessStartDate && dueDate) {
        const today = new Date();
        const totalDuration = 354;
        const daysElapsed = differenceInDays(today, new Date(businessStartDate));
        daysRemaining = differenceInDays(dueDate, today);

        // Clamp progress between 0 and 100
        progress = Math.min(Math.max((daysElapsed / totalDuration) * 100, 0), 100);
    }

    // Local state for the input to prevent UI jumping while typing
    const [localDate, setLocalDate] = React.useState('');

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalDate(e.target.value);
    };

    const saveDate = () => {
        if (localDate) setBusinessStartDate(localDate);
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 border border-emerald-100">
            <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-slate-800">Hawl Tracker</h2>
            </div>

            {!businessStartDate ? (
                <div className="text-center py-6">
                    <p className="text-sm text-slate-500 mb-3">Set your business start date to track your Zakat year.</p>
                    <div className="flex gap-2 max-w-sm mx-auto items-center">
                        <div className="relative flex-1">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            <input
                                type="date"
                                className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={localDate}
                                onChange={handleDateChange}
                            />
                        </div>
                        <button
                            onClick={saveDate}
                            disabled={!localDate}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Set
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-slate-50 p-3 rounded-lg">
                            <span className="block text-slate-400 text-xs mb-1">Start Date</span>
                            <span className="font-medium text-slate-700">{formatGregorianDate(new Date(businessStartDate))}</span>
                        </div>
                        <div className="bg-emerald-50 p-3 rounded-lg">
                            <span className="block text-emerald-600 text-xs mb-1">Zakat Due Date</span>
                            <span className="font-medium text-emerald-800">
                                {dueDate ? formatGregorianDate(dueDate) : '-'}
                            </span>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500">Progress (Lunar Year)</span>
                            <span className={daysRemaining <= 30 ? "text-amber-600 font-bold" : "text-slate-600"}>
                                {daysRemaining > 0 ? `${daysRemaining} days left` : 'Due / Overdue'}
                            </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3">
                            <div
                                className={`h-3 rounded-full transition-all duration-500 ${daysRemaining <= 30 ? 'bg-amber-500' : 'bg-emerald-500'
                                    }`}
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    <button
                        onClick={() => setBusinessStartDate(null)}
                        className="text-xs text-slate-400 underline hover:text-slate-600 w-full text-center"
                    >
                        Reset Date
                    </button>
                </div>
            )}
        </div>
    );
}
