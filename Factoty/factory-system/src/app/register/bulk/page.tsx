'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import Header from '@/components/Layout/Header.js';
import { generateWorkerId, generateBarcode } from '@/utils/barcode';

export default function BulkRegister() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const jsonData = XLSX.utils.sheet_to_json(ws);

            // Process data: add IDs
            const processed = jsonData.map(row => {
                const id = generateWorkerId();
                return {
                    ...row,
                    id: id, // generated ID
                    barcode: generateBarcode(id),
                    status: 'Ready'
                };
            });

            setData(processed);
        };
        reader.readAsBinaryString(file);
    };

    const handleImport = () => {
        setLoading(true);
        // Mock Import
        setTimeout(() => {
            alert(`Successfully imported ${data.length} workers!`);
            setLoading(false);
            setData([]);
        }, 1500);
    };

    return (
        <div>
            <Header title="Bulk Registration (Excel)" />

            <div className="card" style={{ marginBottom: '32px' }}>
                <p style={{ marginBottom: '16px' }}>Upload an Excel file with columns: <strong>Name, Role, Salary, JoinDate</strong></p>
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    style={{ color: 'var(--text-primary)' }}
                />
            </div>

            {data.length > 0 && (
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h3>Preview ({data.length} Workers)</h3>
                        <button className="btn-primary" onClick={handleImport} disabled={loading}>
                            {loading ? 'Importing...' : 'Confirm & Import All'}
                        </button>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ padding: '12px' }}>Generated ID</th>
                                <th style={{ padding: '12px' }}>Name</th>
                                <th style={{ padding: '12px' }}>Role</th>
                                <th style={{ padding: '12px' }}>Salary</th>
                                <th style={{ padding: '12px' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '12px', fontFamily: 'monospace' }}>{row.id}</td>
                                    <td style={{ padding: '12px' }}>{row.Name || row.name}</td>
                                    <td style={{ padding: '12px' }}>{row.Role || row.role}</td>
                                    <td style={{ padding: '12px' }}>{row.Salary || row.salary}</td>
                                    <td style={{ padding: '12px', color: 'var(--success)' }}>{row.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
