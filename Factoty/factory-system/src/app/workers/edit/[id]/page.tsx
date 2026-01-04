'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '@/components/Layout/Header.js';
import { generateBarcode } from '@/utils/barcode';

export default function EditWorker() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [formData, setFormData] = useState({
        name: '',
        joinDate: '',
        salary: '',
        role: 'Worker',
        phone: '',
        photo: null
    });
    const [loading, setLoading] = useState(true);
    const [barcode, setBarcode] = useState('');

    useEffect(() => {
        // Load worker data
        const stored = localStorage.getItem('workers');
        if (stored) {
            const workers = JSON.parse(stored);
            const worker = workers.find((w: any) => w.id === id);

            if (worker) {
                setFormData({
                    name: worker.name,
                    joinDate: worker.joinDate || new Date().toISOString().split('T')[0],
                    salary: worker.salary,
                    salary: worker.salary,
                    role: worker.role,
                    phone: worker.phone || '',
                    photo: null
                });
                setBarcode(worker.barcode_id || generateBarcode(id));
            } else {
                alert('Worker not found');
                router.push('/workers');
            }
        }
        setLoading(false);
    }, [id, router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const stored = localStorage.getItem('workers');
        if (!stored) return;

        const workers = JSON.parse(stored);
        const updatedWorkers = workers.map((w: any) =>
            w.id === id ? { ...w, ...formData } : w
        );

        localStorage.setItem('workers', JSON.stringify(updatedWorkers));

        setTimeout(() => {
            alert('Worker updated successfully!');
            router.push('/workers');
        }, 500);
    };

    if (loading) return <div style={{ padding: '32px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div>
            <Header title={`Edit Worker: ${id}`} />

            <div className="layout-split">
                <div className="card">
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '24px' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Full Name</label>
                            <input
                                name="fullName"
                                type="text"
                                required
                                className="glass"
                                style={{ width: '100%', padding: '12px', color: 'white', borderRadius: '8px' }}
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Phone Number</label>
                            <input
                                name="phone"
                                type="tel"
                                required
                                placeholder="01XXXXXXXXX"
                                className="glass"
                                style={{ width: '100%', padding: '12px', color: 'white', borderRadius: '8px' }}
                                value={(formData as any).phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value } as any)}
                            />
                        </div>

                        <div className="grid-2">
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Joining Date</label>
                                <input
                                    type="date"
                                    required
                                    className="glass"
                                    style={{ width: '100%', padding: '12px', color: 'white', borderRadius: '8px' }}
                                    value={formData.joinDate}
                                    onChange={e => setFormData({ ...formData, joinDate: e.target.value })}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Role</label>
                                <select
                                    className="glass"
                                    style={{ width: '100%', padding: '12px', color: 'white', borderRadius: '8px' }}
                                    value={formData.role}
                                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="Worker" style={{ color: 'black' }}>Worker</option>
                                    <option value="Supervisor" style={{ color: 'black' }}>Supervisor</option>
                                    <option value="Cleaner" style={{ color: 'black' }}>Cleaner</option>
                                    <option value="Security" style={{ color: 'black' }}>Security</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Monthly Salary (BDT)</label>
                            <input
                                type="number"
                                required
                                className="glass"
                                style={{ width: '100%', padding: '12px', color: 'white', borderRadius: '8px' }}
                                value={formData.salary}
                                onChange={e => setFormData({ ...formData, salary: e.target.value })}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                            <button type="submit" className="btn-primary">
                                Save Changes
                            </button>
                            <button
                                type="button"
                                className="glass"
                                style={{ padding: '12px 24px', borderRadius: '12px', color: 'var(--text-primary)', cursor: 'pointer' }}
                                onClick={() => router.push('/workers')}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                {/* ID Card Preview */}
                <div className="card" style={{ height: 'fit-content', textAlign: 'center', background: 'linear-gradient(180deg, var(--bg-card) 0%, rgba(59, 130, 246, 0.1) 100%)' }}>
                    <h3 style={{ marginBottom: '24px' }}>Worker ID Card</h3>

                    <div style={{
                        width: '120px',
                        height: '120px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '50%',
                        margin: '0 auto 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid var(--accent-primary)'
                    }}>
                        📷
                    </div>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{formData.name || 'Worker Name'}</h2>
                    <p style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>{formData.role}</p>

                    <div style={{ margin: '32px 0', padding: '16px', background: 'white', borderRadius: '8px' }}>
                        <div style={{ height: '40px', background: 'repeating-linear-gradient(90deg, black 0, black 2px, white 2px, white 4px)' }}></div>
                        <p style={{ color: 'black', marginTop: '8px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                            {id}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
