'use client';

import styles from './Layout.module.css';

const Header = ({ title }) => {
    return (
        <header style={{
            marginBottom: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div>
                <h1 style={{ fontSize: '2rem' }}>{title}</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Welcome back, Manager</p>
            </div>
            <div>
                <button className="glass" style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    border: '1px solid var(--glass-border)'
                }}>
                    🔔 Notifications
                </button>
            </div>
        </header>
    );
};

export default Header;
