'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Layout/Header.js';

export default function Attendance() {
    const [barcodeInput, setBarcodeInput] = useState('');
    const [lastAction, setLastAction] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleScan = (e) => {
        e.preventDefault();
        if (!barcodeInput) return;

        // Real Logic using LocalStorage to mock DB
        const workerId = barcodeInput.trim();
        const storeKey = `attendance_${workerId}_${new Date().toDateString()}`;
        const storedStatus = localStorage.getItem(storeKey);

        // Default: Check In if not found, Check Out if found
        let nextStatus = 'Checked In';
        let message = 'Have a good work day!';
        let type = 'success';
        let overtime = '0';

        if (storedStatus) {
            // Already Checked In -> Check Out
            const checkInTime = new Date(JSON.parse(storedStatus).time);
            const now = new Date();
            const diffHours = (now.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);

            // Mocking: If diff is small (<1 min), assume accidental double scan, but for demo we proceed
            nextStatus = 'Checked Out';
            if (diffHours > 8) {
                overtime = (diffHours - 8).toFixed(1);
                message = `Overtime: ${overtime} hours added.`;
                type = 'warning';
            } else {
                message = `Shift ended. Total: ${diffHours.toFixed(1)} hrs`;
            }

            // Clear session (or mark as complete)
            localStorage.removeItem(storeKey);
        } else {
            // Checking In
            localStorage.setItem(storeKey, JSON.stringify({ status: 'Checked In', time: new Date() }));
        }

        setLastAction({
            status: nextStatus,
            worker: `Worker ${workerId}`,
            time: new Date().toLocaleTimeString(),
            message: message,
            type: type
        });

        setBarcodeInput('');
    };

    return (
        <div>
            <Header title="Daily Attendance" />

            <div className="card" style={{ textAlign: 'center', padding: '48px', marginBottom: '32px' }}>
                <h2 style={{ fontSize: '4rem', marginBottom: '16px' }}>
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>

                <form onSubmit={handleScan} style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <input
                        type="text"
                        placeholder="Scan Barcode ID or Type ID..."
                        className="glass"
                        style={{
                            width: '100%',
                            padding: '16px',
                            fontSize: '1.2rem',
                            color: 'white',
                            textAlign: 'center',
                            borderRadius: '12px',
                            border: '2px solid var(--accent-primary)'
                        }}
                        value={barcodeInput}
                        onChange={e => setBarcodeInput(e.target.value)}
                        autoFocus
                    />
                    <p style={{ marginTop: '16px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Press Enter to Check-in/Check-out
                    </p>
                </form>
            </div>

            {lastAction && (
                <div className="card" style={{
                    borderLeft: `5px solid ${lastAction.type === 'success' ? 'var(--success)' : 'var(--warning)'}`
                }}>
                    <h3 style={{ marginBottom: '8px' }}>
                        {lastAction.status}: <span style={{ fontWeight: 'normal' }}>{lastAction.worker}</span>
                    </h3>
                    <p style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '8px' }}>
                        {lastAction.time}
                    </p>
                    <p style={{ color: lastAction.type === 'success' ? 'var(--success)' : 'var(--warning)' }}>
                        {lastAction.message}
                    </p>
                </div>
            )}

            {/* Recent Scans Table (Mock) */}
            <div className="card" style={{ marginTop: '32px', opacity: 0.8 }}>
                <h4 style={{ marginBottom: '16px' }}>Recent Scans</h4>
                <table style={{ width: '100%', textAlign: 'left' }}>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td style={{ padding: '8px' }}>Worker #1093</td>
                            <td style={{ padding: '8px' }}>08:05 AM</td>
                            <td style={{ padding: '8px', color: 'var(--success)' }}>Check-in</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '8px' }}>Worker #0421</td>
                            <td style={{ padding: '8px' }}>08:02 AM</td>
                            <td style={{ padding: '8px', color: 'var(--success)' }}>Check-in</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
