'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const AttendanceWidget = () => {
    const [stats, setStats] = useState({ total: 0, present: 0, percentage: 0 });

    useEffect(() => {
        const calculateStats = () => {
            // 1. Get Total Workers
            const storedWorkers = JSON.parse(localStorage.getItem('workers') || '[]');
            const total = storedWorkers.length;

            // 2. Get Present Count (Attendance keys for today)
            const todayStr = new Date().toDateString();
            let present = 0;

            // Loop through all keys to find attendance_ID_DATE
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('attendance_') && key.includes(todayStr)) {
                    // Extract ID from key: attendance_WorkerID_DateStr
                    // Format: attendance_W-2024-1021_Sun Jan ...
                    // Let's assume ID is between 'attendance_' and the date string.
                    // Actually simplest way is to iterate WORKERS and check if they have a key.
                    // This guarantees we only count valid workers.
                }
            }

            // Correct Logic: Iterate WORKERS, check if present.
            storedWorkers.forEach((worker: any) => {
                const specificKey = `attendance_${worker.id}_${todayStr}`;
                if (localStorage.getItem(specificKey)) {
                    present++;
                }
            });

            const pct = total > 0 ? Math.round((present / total) * 100) : 0;
            setStats({ total, present, percentage: pct });
        };

        calculateStats();
        // Optional: Poll every few seconds to update real-time
        const interval = setInterval(calculateStats, 5000);
        return () => clearInterval(interval);
    }, []);

    const { total, present, percentage } = stats;

    return (
        <div className="card">
            <h3 style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Today's Attendance</h3>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                    <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--success)' }}>{percentage}%</span>
                    <p style={{ color: 'var(--text-secondary)' }}>{present} / {total} Workers</p>
                </div>
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: `conic-gradient(var(--success) ${percentage}%, var(--bg-secondary) 0)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'var(--bg-card)'
                    }}></div>
                </div>
            </div>

            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                <Link href="/attendance/absent" style={{ color: 'var(--accent-primary)', fontWeight: '500', display: 'flex', alignItems: 'center' }}>
                    See who hasn't come
                    <span style={{ marginLeft: '8px' }}>→</span>
                </Link>
            </div>
        </div>
    );
};

export default AttendanceWidget;
