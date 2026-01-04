'use client';

import Header from '@/components/Layout/Header.js';
import Link from 'next/link';

export default function Reports() {
    return (
        <div>
            <Header title="Reports Hub" />

            <div className="grid-2">
                <Link href="/reports/overtime">
                    <div className="card hover-effect" style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <span style={{ fontSize: '2rem', marginRight: '16px' }}>⏱️</span>
                            <div>
                                <h3 style={{ margin: 0 }}>Overtime Report</h3>
                                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>View yesterday's overtime logs</p>
                            </div>
                        </div>
                        <span style={{ color: 'var(--accent-primary)', fontWeight: '500' }}>View Report →</span>
                    </div>
                </Link>

                <Link href="/attendance">
                    <div className="card hover-effect" style={{ cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <span style={{ fontSize: '2rem', marginRight: '16px' }}>📅</span>
                            <div>
                                <h3 style={{ margin: 0 }}>Attendance Log</h3>
                                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>View check-in/out history</p>
                            </div>
                        </div>
                        <span style={{ color: 'var(--accent-primary)', fontWeight: '500' }}>View Log →</span>
                    </div>
                </Link>

                <div className="card" style={{ opacity: 0.5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ fontSize: '2rem', marginRight: '16px' }}>💰</span>
                        <div>
                            <h3 style={{ margin: 0 }}>Salary Sheet</h3>
                            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Calculated monthly salaries</p>
                        </div>
                    </div>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Coming Soon</span>
                </div>
            </div>
        </div>
    );
}
