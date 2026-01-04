'use client';

import { useState } from 'react';
import Header from '@/components/Layout/Header.js';
import { generateWorkerId, generateBarcode } from '@/utils/barcode';
import { supabase } from '@/lib/supabaseClient';

export default function RegisterWorker() {
    const [formData, setFormData] = useState({
        name: '',
        joinDate: new Date().toISOString().split('T')[0],
        salary: '',
        role: 'Worker',
        phone: '',
        photo: null
    });
    const [generatedId, setGeneratedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 1. Generate ID & Barcode
        const newId = generateWorkerId();
        const barcode = generateBarcode(newId);

        // 2. Prepare data
        const workerData = {
            ...formData,
            id: newId,
            barcode_id: barcode,
            status: 'Active' // Default status
        };

        console.log("Registering:", workerData);

        // 3. Save to LocalStorage (Mock DB)
        const storedWorkers = JSON.parse(localStorage.getItem('workers') || '[]');
        storedWorkers.push(workerData);
        localStorage.setItem('workers', JSON.stringify(storedWorkers));

        // Mock Success
        setTimeout(() => {
            setGeneratedId(newId);
            setLoading(false);
            alert(`Worker Registered! ID: ${newId}`);
            // Optional: Redirect or reset
            setFormData({ ...formData, name: '', role: 'Worker', salary: '', phone: '', photo: null });
        }, 1000);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Header title="Register New Worker" />
                <a href="/register/bulk" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>
                    Bulk Upload (Excel)
                </a>
            </div>

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
                            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                                <span style={{ padding: '12px 16px', color: 'var(--text-secondary)', borderRight: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)', borderRadius: '8px 0 0 8px' }}>
                                    🇧🇩 +88
                                </span>
                                <input
                                    name="phone"
                                    type="tel"
                                    required
                                    placeholder="01XXXXXXXXX"
                                    maxLength={11}
                                    pattern="[0-9]{11}"
                                    className="glass"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        color: 'white',
                                        border: 'none',
                                        background: 'transparent',
                                        outline: 'none'
                                    }}
                                    value={(formData as any).phone}
                                    onChange={e => {
                                        const val = e.target.value.replace(/\D/g, ''); // Only numbers
                                        setFormData({ ...formData, phone: val } as any);
                                    }}
                                />
                            </div>
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

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Photo</label>
                            <div
                                style={{
                                    border: '2px dashed var(--glass-border)',
                                    padding: '32px',
                                    borderRadius: '12px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    background: (formData as any).photo ? 'rgba(0, 255, 0, 0.1)' : 'transparent',
                                    transition: 'all 0.2s'
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                                }}
                                onDragLeave={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                                    e.currentTarget.style.background = 'transparent';
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                                    e.currentTarget.style.background = 'transparent';
                                    const file = e.dataTransfer.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setFormData({ ...formData, photo: reader.result as any });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                onClick={() => document.getElementById('photo-upload')?.click()}
                            >
                                {(formData as any).photo ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <img
                                            src={(formData as any).photo}
                                            alt="Preview"
                                            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '8px' }}
                                        />
                                        <p style={{ color: 'var(--success)' }}>Photo Selected!</p>
                                    </div>
                                ) : (
                                    <p>Click to upload or drag and drop</p>
                                )}
                                <input
                                    id="photo-upload"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setFormData({ ...formData, photo: reader.result as any });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '16px' }}>
                            {loading ? 'Processing...' : 'Generate ID & Register'}
                        </button>
                    </form>
                </div>

                {/* Preview / ID Card Side */}
                <div className="card" style={{ height: 'fit-content', textAlign: 'center', background: 'linear-gradient(180deg, var(--bg-card) 0%, rgba(59, 130, 246, 0.1) 100%)' }}>
                    <h3 style={{ marginBottom: '24px' }}>Generated ID Card</h3>

                    <div style={{
                        width: '120px',
                        height: '120px',
                        background: 'var(--bg-secondary)',
                        borderRadius: '50%',
                        margin: '0 auto 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid var(--accent-primary)',
                        overflow: 'hidden'
                    }}>
                        {(formData as any).photo ? (
                            <img
                                src={(formData as any).photo}
                                alt="ID Photo"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <span style={{ fontSize: '2rem' }}>📷</span>
                        )}
                    </div>

                    <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{formData.name || 'Worker Name'}</h2>
                    <p style={{ color: 'var(--accent-primary)', fontWeight: '600' }}>{formData.role}</p>

                    <div style={{ margin: '32px 0', padding: '16px', background: 'white', borderRadius: '8px' }}>
                        {/* Barcode Placeholder */}
                        <div style={{ height: '40px', background: 'repeating-linear-gradient(90deg, black 0, black 2px, white 2px, white 4px)', opacity: generatedId ? 1 : 0.2 }}></div>
                        <p style={{ color: 'black', marginTop: '8px', fontFamily: 'monospace', fontWeight: 'bold' }}>
                            {generatedId || 'W-XXXX-XXXX'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
