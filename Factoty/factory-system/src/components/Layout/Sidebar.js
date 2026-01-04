'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Layout.module.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Attendance', path: '/attendance', icon: '📅' },
    { name: 'Worker Data', path: '/workers', icon: '👥' },
    { name: 'Registration', path: '/register', icon: '📝' },
    { name: 'Reports', path: '/reports', icon: '📈' },
  ];

  return (
    <>
      <button
        className={styles.mobileToggle}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.logo}>
          <h2>🏭 Factory<span style={{ color: 'var(--accent-primary)' }}>Flow</span></h2>
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`${styles.navItem} ${pathname === item.path ? styles.active : ''}`}
              onClick={() => setIsOpen(false)} // Close on navigate
            >
              <span className={styles.icon}>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div
          className={styles.userProfile}
          onClick={() => {
            if (confirm('Log out?')) {
              alert('Logged out successfully (Mock)');
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className={styles.avatar}>PM</div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>Manager</p>
            <p className={styles.userRole}>Admin</p>
          </div>
          <span style={{ marginLeft: 'auto', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>⏻</span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
