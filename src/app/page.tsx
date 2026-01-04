
'use client';

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { HawlTracker } from '@/components/HawlTracker';
import { NisabStatus } from '@/components/NisabStatus';
import { AssetTable } from '@/components/AssetTable';
import { PurificationModule } from '@/components/PurificationModule';
import { ZakatReport } from '@/components/ZakatReport';

export default function Home() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Corporate Zakat Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage your assets, track your Hawl, and calculate your Zakat liability.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Input & Logic */}
        <div className="lg:col-span-2 space-y-8">
          {/* Top Widgets Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HawlTracker />
            <NisabStatus />
          </div>

          {/* Main Input Table */}
          <AssetTable />

          {/* Purification Section */}
          <PurificationModule />
        </div>

        {/* Right Column: Report & Visualization */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            <ZakatReport />

            {/* Additional Info / Footer */}
            <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 border border-slate-100">
              <h3 className="font-semibold text-slate-700 mb-2">Important Notes</h3>
              <ul className="space-y-1 list-disc pl-4">
                <li>Calculations are based on the Lunar Hijri year (354 days).</li>
                <li>Fixed assets (tools, furniture, buildings) are exempt.</li>
                <li>Gold price is set to $65/gram for MVP demo purposes.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
