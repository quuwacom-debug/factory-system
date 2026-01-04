'use client';

import Header from '@/components/Layout/Header.js';
import Link from 'next/link';
import AttendanceWidget from '@/components/Dashboard/AttendanceWidget';
import OvertimeWidget from '@/components/Dashboard/OvertimeWidget';

export default function Home() {
  return (
    <div>
      <Header title="Dashboard" />

      <div className="stats-grid">
        <AttendanceWidget />
        <OvertimeWidget />

        {/* Quick Actions / Extras */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ marginBottom: '16px' }}>Quick Actions</h3>
          <Link href="/register" style={{ marginBottom: '12px' }}>
            <button className="btn-primary" style={{ width: '100%' }}>
              + Register New Worker
            </button>
          </Link>
          <Link href="/reports">
            <button className="glass" style={{
              padding: '12px',
              borderRadius: '12px',
              color: 'var(--text-primary)',
              border: '1px solid var(--glass-border)',
              cursor: 'pointer',
              width: '100%'
            }}>
              Download Reports
            </button>
          </Link>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '24px' }}>Recent Activity</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '12px' }}>Time</th>
              <th style={{ padding: '12px' }}>Worker</th>
              <th style={{ padding: '12px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((_, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px' }}>08:0{i} AM</td>
                <td style={{ padding: '12px' }}>Worker #{100 + i}</td>
                <td style={{ padding: '12px', color: 'var(--success)' }}>Checks In</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
