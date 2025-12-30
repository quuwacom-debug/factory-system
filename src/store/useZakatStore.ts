import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AssetData {
  cash: number;
  inventory: number;
  receivables: number;
  fixedAssets: number;
}

interface ZakatState {
  businessStartDate: string | null; // ISO Date string
  assets: AssetData;
  impureIncome: number;
  setBusinessStartDate: (date: string | null) => void;
  setAssetValue: (key: keyof AssetData, value: number) => void;
  setImpureIncome: (value: number) => void;
}

export const useZakatStore = create<ZakatState>()(
  persist(
    (set) => ({
      businessStartDate: null,
      assets: {
        cash: 0,
        inventory: 0,
        receivables: 0,
        fixedAssets: 0,
      },
      impureIncome: 0,
      setBusinessStartDate: (date) => set({ businessStartDate: date }),
      setAssetValue: (key, value) =>
        set((state) => ({
          assets: { ...state.assets, [key]: value },
        })),
      setImpureIncome: (value) => set({ impureIncome: value }),
    }),
    {
      name: 'zakat-storage',
    }
  )
);
