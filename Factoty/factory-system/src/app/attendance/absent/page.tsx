'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Layout/Header.js';

export default function AbsentWorkers() {
    const [absentWorkers, setAbsentWorkers] = useState<any[]>([]);

    useEffect(() => {
        const storedWorkers = JSON.parse(localStorage.getItem('workers') || '[]');
        const todayStr = new Date().toDateString();

        const absent = storedWorkers.filter((worker: any) => {
            const key = `attendance_${worker.id}_${todayStr}`;
            return !localStorage.getItem(key);
        });

        setAbsentWorkers(absent);
    }, []);

    return (
        <div>
            <Header title="Absent Workers (Today)" />

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '16px' }}>ID</th>
                            <th style={{ padding: '16px' }}>Name</th>
                            <th style={{ padding: '16px' }}>Role</th>
                            <th style={{ padding: '16px' }}>Since</th>
                            <th style={{ padding: '16px' }}>Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {absentWorkers.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    Everyone is present! 🎉
                                </td>
                            </tr>
                        ) : (
                            absentWorkers.map(worker => (
                                <tr key={worker.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '16px' }}>{worker.id}</td>
                                    <td style={{ padding: '16px', fontWeight: '500' }}>{worker.name}</td>
                                    <td style={{ padding: '16px' }}>{worker.role}</td>
                                    <td style={{ padding: '16px', color: 'var(--warning)' }}>Today</td>
                                    <td style={{ padding: '16px' }}>
                                        {worker.phone ? (
                                            <a href={`tel:${worker.phone}`}>
                                                <button className="glass" style={{ padding: '6px 12px', borderRadius: '6px', color: '#3b82f6', borderColor: '#3b82f6', cursor: 'pointer' }}>Call</button>
                                            </a>
                                        ) : (
                                            <span style={{ color: 'var(--text-secondary)' }}>N/A</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
