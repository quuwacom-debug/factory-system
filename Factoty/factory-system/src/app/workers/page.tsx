'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Layout/Header.js';
import Link from 'next/link';

export default function WorkerList() {
    const [workers, setWorkers] = useState<any[]>([]);
    const [search, setSearch] = useState('');

    // Load from LocalStorage
    useEffect(() => {
        const stored = localStorage.getItem('workers');
        if (stored) {
            setWorkers(JSON.parse(stored));
        } else {
            // Fallback default data if empty
            const defaults = [
                { id: 'W-2024-1021', name: 'John Doe', role: 'Operator', salary: 1200, status: 'Active' },
                { id: 'W-2024-3321', name: 'Jane Smith', role: 'Supervisor', salary: 2500, status: 'Active' },
            ];
            setWorkers(defaults);
            localStorage.setItem('workers', JSON.stringify(defaults));
        }
    }, []);

    const handleDelete = (id: string) => {
        // Direct delete for smoother demo interaction
        const updated = workers.filter(w => w.id !== id);
        setWorkers(updated);
        localStorage.setItem('workers', JSON.stringify(updated));
    };

    const handleEdit = (worker: any) => {
        const newName = prompt('Enter new name:', worker.name);
        if (newName === null) return; // Cancelled

        const newSalary = prompt('Enter new salary:', worker.salary);
        if (newSalary === null) return;

        const updatedWorkers = workers.map(w =>
            w.id === worker.id ? { ...w, name: newName, salary: newSalary } : w
        );

        setWorkers(updatedWorkers);
        localStorage.setItem('workers', JSON.stringify(updatedWorkers));
    };

    const filteredWorkers = workers.filter(worker =>
        worker.name.toLowerCase().includes(search.toLowerCase()) ||
        worker.id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <Header title="Worker Data" />

            <div className="card">
                <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between' }}>
                    <input
                        type="text"
                        placeholder="Search workers..."
                        className="glass"
                        style={{ padding: '12px', borderRadius: '8px', color: 'white', width: '300px' }}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                    <Link href="/register">
                        <button className="btn-primary" style={{ cursor: 'pointer' }}>+ Add Worker</button>
                    </Link>
                </div>

                <div className="table-responsive">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '16px' }}>ID</th>
                                <th style={{ padding: '16px' }}>Name</th>
                                <th style={{ padding: '16px' }}>Role</th>
                                <th style={{ padding: '16px' }}>Salary</th>
                                <th style={{ padding: '16px' }}>Contact</th>
                                <th style={{ padding: '16px' }}>Status</th>
                                <th style={{ padding: '16px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredWorkers.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        No workers found.
                                    </td>
                                </tr>
                            ) : (
                                filteredWorkers.map(worker => (
                                    <tr key={worker.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '16px', fontFamily: 'monospace' }}>{worker.id}</td>
                                        <td style={{ padding: '16px', fontWeight: '500' }}>{worker.name}</td>
                                        <td style={{ padding: '16px' }}>{worker.role}</td>
                                        <td style={{ padding: '16px' }}>৳{worker.salary}</td>
                                        <td style={{ padding: '16px' }}>
                                            {worker.phone ? (
                                                <a href={`tel:${worker.phone}`}>
                                                    <button
                                                        className="glass"
                                                        style={{
                                                            padding: '4px 12px',
                                                            borderRadius: '4px',
                                                            color: '#3b82f6', // Bright Blue
                                                            borderColor: '#3b82f6',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        Call
                                                    </button>
                                                </a>
                                            ) : (
                                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>N/A</span>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <span style={{
                                                color: worker.status === 'Active' ? 'var(--success)' : 'var(--warning)',
                                                background: worker.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.85rem'
                                            }}>{worker.status}</span>
                                        </td>
                                        <td style={{ padding: '16px' }}>
                                            <Link href={`/workers/edit/${worker.id}`}>
                                                <button
                                                    className="glass"
                                                    style={{
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        marginRight: '8px',
                                                        color: 'var(--success)',
                                                        borderColor: 'var(--success)',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            </Link>
                                            <button
                                                className="glass"
                                                style={{ padding: '4px 8px', borderRadius: '4px', color: 'var(--danger)', cursor: 'pointer' }}
                                                onClick={() => handleDelete(worker.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
