'use client';

import Header from '@/components/Layout/Header.js';

export default function OvertimeReport() {
    const overtimeData = [
        { id: 101, name: 'John Doe', date: 'Yesterday', hours: 2.5, shift: 'Day' },
        { id: 103, name: 'Jane Doe', date: 'Yesterday', hours: 1.5, shift: 'Day' },
        { id: 156, name: 'Mike Ross', date: 'Yesterday', hours: 4.0, shift: 'Night' },
    ];

    return (
        <div>
            <Header title="Overtime Report (Yesterday)" />

            <div className="card">
                <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                    <div className="glass" style={{ padding: '16px', borderRadius: '12px', flex: 1 }}>
                        <p style={{ color: 'var(--text-secondary)' }}>Total Workers</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{overtimeData.length}</p>
                    </div>
                    <div className="glass" style={{ padding: '16px', borderRadius: '12px', flex: 1 }}>
                        <p style={{ color: 'var(--text-secondary)' }}>Total Hours</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                            {overtimeData.reduce((acc, curr) => acc + curr.hours, 0)} hrs
                        </p>
                    </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '16px' }}>Worker</th>
                            <th style={{ padding: '16px' }}>Date</th>
                            <th style={{ padding: '16px' }}>Overtime Hours</th>
                            <th style={{ padding: '16px' }}>Shift</th>
                            <th style={{ padding: '16px' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {overtimeData.map(record => (
                            <tr key={record.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '16px' }}>
                                    <div>
                                        <p style={{ fontWeight: '500' }}>{record.name}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>#{record.id}</p>
                                    </div>
                                </td>
                                <td style={{ padding: '16px' }}>{record.date}</td>
                                <td style={{ padding: '16px', fontWeight: 'bold', color: 'var(--warning)' }}>+{record.hours}h</td>
                                <td style={{ padding: '16px' }}>{record.shift}</td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{
                                        background: 'rgba(16, 185, 129, 0.2)',
                                        color: '#10b981',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem'
                                    }}>Approved</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
